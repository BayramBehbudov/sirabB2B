import {
  CreateInventoryCheckRequirement,
  UpdateInventoryCheckRequirement,
} from "@/api/Inventory";
import ControlledCalendar from "@/components/ui/ControlledCalendar";
import ControlledInput from "@/components/ui/ControlledInput";
import ControlledSwitch from "@/components/ui/ControlledSwitch";
import CustomerHandler from "@/pages/Customers/components/CustomerHandler";
import CustomerGroupSelector from "@/pages/Customers/groups/components/CustomerGroupSelector";
import { showToast } from "@/providers/ToastProvider";
import { InventoryRequirementSchema } from "@/schemas/inventory.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

const AddInventoryRequirement = ({ onSuccess, defaultReq, disabled }) => {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const isEdit = !!defaultReq;

  const defaultValues = {
    requiredPhotoCount: defaultReq?.requiredPhotoCount || 1,
    description: defaultReq?.description || "",
    erpCode: defaultReq?.erpCode || "",
    serialCode: defaultReq?.serialCode || "",
    startDate: defaultReq?.startDate || "",
    endDate: defaultReq?.endDate || "",
    customerGroupId: defaultReq?.customerGroupId || null,
    b2BCustomerId: defaultReq?.b2BCustomerId || null,
    clSpecode: defaultReq?.clSpecode || "*",
    clSpecode1: defaultReq?.clSpecode1 || "*",
    clSpecode2: defaultReq?.clSpecode2 || "*",
    clSpecode3: defaultReq?.clSpecode3 || "*",
    clSpecode4: defaultReq?.clSpecode4 || "*",
    clSpecode5: defaultReq?.clSpecode5 || "*",
    b2BCustomerType: defaultReq?.b2BCustomerType || "*",
    isActive: defaultReq?.isActive ?? true,
  };

  const {
    handleSubmit,
    formState: { errors },
    control,
    setValue,
    watch,
    reset,
  } = useForm({
    resolver: zodResolver(InventoryRequirementSchema),
    defaultValues,
  });
  const b2BCustomerId = watch("b2BCustomerId");

  const onSubmit = async (formData) => {
    try {
      setLoading(true);
      const res = isEdit
        ? await UpdateInventoryCheckRequirement({
            ...formData,
            id: defaultReq.id,
          })
        : await CreateInventoryCheckRequirement(formData);
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
        <div className="flex flex-col gap-5">
          <div className="flex flex-row gap-2 flex-wrap">
            <CustomerGroupSelector
              control={control}
              field="customerGroupId"
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
                  : new Date(watch("startDate"));
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
              {
                name: "requiredPhotoCount",
                type: "number",
                label: "photoCount",
              },
            ].map((item) => (
              <ControlledInput
                key={item.name}
                control={control}
                name={item.name}
                placeholder={t(item.label)}
                label={t(item.label)}
                className={"w-[200px] no-spinner"}
                type={item.type}
              />
            ))}
            {[
              { name: "clSpecode" },
              { name: "clSpecode1" },
              { name: "clSpecode2" },
              { name: "clSpecode3" },
              { name: "clSpecode4" },
              { name: "clSpecode5" },
              { name: "b2BCustomerType" },
              { name: "erpCode" },
              { name: "serialCode" },
            ].map((input) => (
              <ControlledInput
                control={control}
                key={input.name}
                name={input.name}
                placeholder={t("enter")}
                label={t(input.name)}
                type={"text"}
                avtoValue={input.avtoValue}
                className={"w-[200px]"}
              />
            ))}

            <ControlledSwitch
              label={t("isActive")}
              control={control}
              name={`isActive`}
              placeholder={t("isActive")}
            />
          </div>
          {["description"].map((item) => (
            <ControlledInput
              type="textarea"
              classNameContainer="grow"
              key={item}
              control={control}
              name={item}
              placeholder={t(item)}
              label={t(item)}
            />
          ))}
        </div>
      </Dialog>
    </div>
  );
};

export default AddInventoryRequirement;
