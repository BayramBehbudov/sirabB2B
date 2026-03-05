import ControlledCalendar from "@/components/ui/ControlledCalendar";
import ControlledInput from "@/components/ui/ControlledInput";
import CustomerHandler from "@/pages/Customers/components/CustomerHandler";
import { SaleConditionSchema } from "@/schemas/sale-condition.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import SaleConditionPriceController from "./SaleConditionPriceController";
import { CreateSaleCondition, UpdateSaleCondition } from "@/api/SaleConditions";
import { showToast } from "@/providers/ToastProvider";
import CustomerGroupSelector from "@/pages/Customers/groups/components/CustomerGroupSelector";
import ControlledSwitch from "@/components/ui/ControlledSwitch";

const AddSaleCondition = ({ onSuccess, condition, disabled }) => {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const isEdit = !!condition;
  const defaultValues = {
    startDate: condition?.startDate || "",
    endDate: condition?.endDate || "",
    description: condition?.description || "",
    saleConditionLines: condition?.saleConditionLines?.map((l) => ({
      id: l.lineId,
      price: l.price,
      isVAT: l.isVAT,
      productId: l.productId,
    })) || [
      {
        id: 0,
        price: null,
        isVAT: false,
        productId: null,
      },
    ],

    b2BCustomerGroupId: condition?.customerGroupId || null,
    b2BCustomerId: condition?.b2BCustomerId || null,

    clSpecode: condition?.clSpecode || "*",
    clSpecode1: condition?.clSpecode1 || "*",
    clSpecode2: condition?.clSpecode2 || "*",
    clSpecode3: condition?.clSpecode3 || "*",
    clSpecode4: condition?.clSpecode4 || "*",
    clSpecode5: condition?.clSpecode5 || "*",
    b2BCustomerType: condition?.b2BCustomerType || "*",
    isActive: condition?.isActive ?? true,
  };
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
    setValue,
  } = useForm({
    resolver: zodResolver(SaleConditionSchema),
    defaultValues,
  });
  const b2BCustomerId = watch("b2BCustomerId");

  const onSubmit = async (formData) => {
    try {
      setLoading(true);
      const res = isEdit
        ? await UpdateSaleCondition({
            ...formData,
            id: condition.id,
            deletedLineIds: (condition?.saleConditionLines ?? [])
              .map((l) => {
                if (
                  !formData.saleConditionLines.some((sl) => sl.id === l.lineId)
                )
                  return l.lineId;
              })
              .filter((l) => l),
          })
        : await CreateSaleCondition(formData);
      showToast({
        severity: "success",
        summary: t("success"),
        detail: res?.message || "",
      });
      onSuccess?.();
      setVisible(false);
      reset(defaultValues);
    } catch (error) {
      showToast({
        severity: "error",
        summary: t("error"),
        detail: error?.response?.data?.message || t("unexpectedError"),
      });
    } finally {
      setLoading(false);
    }
  };
  const onClose = () => {
    setVisible(false);
    reset(defaultValues);
  };

  useEffect(() => {
    reset(defaultValues);
  }, [condition]);

  return (
    <div>
      <Button
        tooltip={isEdit ? t("edit") : ""}
        tooltipOptions={{ position: "left" }}
        icon={`pi ${isEdit ? "pi-pencil" : "pi-plus"}`}
        onClick={() => setVisible(true)}
        label={!isEdit && t("add")}
        disabled={disabled}
      />
      <Dialog
        header={t("addInfo")}
        visible={visible}
        onHide={onClose}
        className="max-w-[90%] min-w-[90%] min-h-[70%]"
        footer={
          <div>
            <Button
              label={t("cancel")}
              onClick={onClose}
              className="mr-2"
              disabled={loading}
            />
            <Button
              label={t("save")}
              disabled={loading}
              loading={loading}
              onClick={handleSubmit(onSubmit)}
            />
          </div>
        }
      >
        <div className="flex flex-col gap-2">
          <div className="flex flex-row gap-2 flex-wrap">
            <CustomerGroupSelector
              control={control}
              field="b2BCustomerGroupId"
              showClear={true}
            />
            <CustomerHandler
              error={errors.b2BCustomerId}
              value={b2BCustomerId ? [b2BCustomerId] : []}
              setValue={setValue}
              field="b2BCustomerId"
              required={false}
              mode="single"
            />
            {["startDate", "endDate"].map((item) => {
              const minDate =
                item === "startDate"
                  ? new Date()
                  : watch("startDate")
                    ? new Date(watch("startDate"))
                    : new Date();
              const maxDate =
                item === "startDate" ? new Date(watch("endDate")) : undefined;

              return (
                <ControlledCalendar
                  key={item}
                  control={control}
                  name={item}
                  placeholder={t(item)}
                  label={t(item)}
                  className={"w-[200px]"}
                  minDate={minDate}
                  maxDate={maxDate}
                />
              );
            })}

            {[
              { name: "clSpecode" },
              { name: "clSpecode1" },
              { name: "clSpecode2" },
              { name: "clSpecode3" },
              { name: "clSpecode4" },
              { name: "clSpecode5" },
              { name: "b2BCustomerType" },
            ].map((input) => (
              <ControlledInput
                control={control}
                key={input.name}
                name={input.name}
                placeholder={t("enter")}
                label={t(input.name)}
                type={"text"}
                avtoValue={input.avtoValue}
              />
            ))}
            <ControlledSwitch
              label={t("isActive")}
              control={control}
              name={`isActive`}
              placeholder={t("isActive")}
            />
          </div>

          <div className="flex flex-row gap-2 flex-wrap">
            {["description"].map((item) => (
              <ControlledInput
                key={item}
                type="textarea"
                control={control}
                name={item}
                placeholder={t(item)}
                label={t(item)}
                classNameContainer={"grow"}
              />
            ))}
          </div>
          <SaleConditionPriceController
            control={control}
            formPrices={watch("saleConditionLines")}
          />
        </div>
      </Dialog>
    </div>
  );
};

export default AddSaleCondition;
