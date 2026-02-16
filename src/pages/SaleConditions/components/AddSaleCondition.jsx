import ControlledCalendar from "@/components/ui/ControlledCalendar";
import ControlledInput from "@/components/ui/ControlledInput";
import CustomerHandler from "@/pages/Banners/components/CustomerHandler";
import SendToAllCustomersHandler from "@/pages/Banners/components/SendToAllCustomersHandler";
import CustomerGroupMultiSelector from "@/pages/Customers/groups/components/CustomerGroupMultiSelector";
import { SaleConditionSchema } from "@/schemas/sale-condition.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import SaleConditionPriceController from "./SaleConditionPriceController";
import { CreateSaleCondition } from "@/api/SaleConditions";
import { showToast } from "@/providers/ToastProvider";

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
      price: l.price,
      isVAT: l.isVAT,
      productId: l.productId,
    })) || [
      {
        price: null,
        isVAT: false,
        productId: null,
      },
    ],

    sendToAllCustomers: false,
    b2BCustomerGroupIds: [],
    b2BCustomerIds: [],
  };

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
    setValue,
    trigger,
  } = useForm({
    resolver: zodResolver(SaleConditionSchema),
    defaultValues,
  });

  const sendToAllCustomers = watch("sendToAllCustomers");
  const b2BCustomerIds = watch("b2BCustomerIds");
  const onSubmit = async (formData) => {
    // qeyd edit yazılmayıb
    if (isEdit) return;
    try {
      setLoading(true);
      const res = await CreateSaleCondition(formData);
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
            <SendToAllCustomersHandler control={control} setValue={setValue} />
            {!sendToAllCustomers && (
              <CustomerGroupMultiSelector
                fieldName="b2BCustomerGroupIds"
                control={control}
                trigger={trigger}
              />
            )}
            {!sendToAllCustomers && (
              <CustomerHandler
                error={errors.b2BCustomerIds}
                value={b2BCustomerIds}
                setValue={setValue}
                trigger={trigger}
              />
            )}
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
