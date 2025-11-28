import { InventoryCheckRequirementAdd } from "@/api/Inventory";
import ControlledInput from "@/components/ui/ControlledInput";
import CustomerHandler from "@/pages/Banners/components/CustomerHandler";
import SendToAllCustomersHandler from "@/pages/Banners/components/SendToAllCustomersHandler";
import CustomerGroupMultiSelector from "@/pages/Customers/groups/components/CustomerGroupMultiSelector";
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
    requiredPhotoCount: 1,
    description: "",
    sendToAllCustomers: false,
    b2BCustomerIds: [],
    b2BCustomerGroupIds: [],
  };

  const {
    handleSubmit,
    formState: { errors },
    control,
    setValue,
    watch,
    reset,
    trigger,
  } = useForm({
    resolver: zodResolver(InventoryRequirementSchema),
    defaultValues,
  });
  const sendToAllCustomers = watch("sendToAllCustomers");
  const b2BCustomerIds = watch("b2BCustomerIds");
  
  const onSubmit = async (formData) => {
    // qeyd edit yazılmayıb
    if (isEdit) return;
    try {
      setLoading(true);
      const res = await InventoryCheckRequirementAdd(formData);
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
        tooltipOptions={{ position: "top" }}
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
