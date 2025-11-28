import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { useTranslation } from "react-i18next";
import {
  EmptySchema,
  PasswordSchema,
  CustomerSchema,
} from "@/schemas/user.schema";
import CustomerGroupSelector from "../groups/components/CustomerGroupSelector";
import ControlledInput from "../../../components/ui/ControlledInput";
import { createB2BCustomer, editB2BCustomer } from "@/api/B2BCustomer";
import { showToast } from "@/providers/ToastProvider";

const AddCustomer = ({ onSuccess, user, disabled = false }) => {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const isEdit = !!user;

  const defaultValues = {
    customerGroupId: user?.customerGroupId || 0,
    erpId: user?.erpId || "",
    taxId: user?.taxId || "",
    phoneNumber: user?.phoneNumber || "",
    email: user?.email || "",
    contactPersonFirstName: user?.contactPersonFirstName || "",
    contactPersonLastName: user?.contactPersonLastName || "",
    companyName: user?.companyName || "",
    ...(isEdit ? {} : { password: "" }),
  };

  const { control, handleSubmit, reset } = useForm({
    resolver: zodResolver(
      isEdit
        ? CustomerSchema.extend(EmptySchema.shape)
        : CustomerSchema.extend(PasswordSchema.shape)
    ),
    defaultValues,
  });
  const onSubmit = async (formData) => {
    try {
      setLoading(true);
      const res = isEdit
        ? await editB2BCustomer({
            ...formData,
            b2BCustomerId: user.b2BCustomerId,
          })
        : await createB2BCustomer(formData);
      showToast({
        severity: "success",
        summary: t("success"),
        detail: res?.message || "",
      });

      setVisible(false);
      reset(defaultValues);
      onSuccess?.();
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
        header={t("addCustomerInfo")}
        visible={visible}
        className={"max-w-[90%] min-w-[700px]"}
        onHide={onClose}
        footer={
          <div>
            <Button
              label={t("cancel")}
              className={"!w-[150px]"}
              onClick={onClose}
            />
            <Button
              label={t("save")}
              className={"!w-[150px]"}
              onClick={handleSubmit(onSubmit)}
              disabled={loading}
              loading={loading}
            />
          </div>
        }
      >
        <div className={"flex flex-row flex-wrap gap-2 py-[10px]"}>
          <CustomerGroupSelector control={control} />

          {[
            { name: "contactPersonFirstName" },
            { name: "contactPersonLastName" },
            { name: "phoneNumber", avtoValue: "+994" },
            { name: "email", type: "email" },
            ...(!isEdit ? [{ name: "password", type: "password" }] : []),
            { name: "erpId" },
            { name: "taxId" },
            { name: "companyName" },
          ].map((input) => (
            <ControlledInput
              control={control}
              key={input.name}
              name={input.name}
              placeholder={t(input.name)}
              label={t(input.name)}
              type={input.type || "text"}
              className={"w-[250px]"}
              avtoValue={input.avtoValue}
            />
          ))}
        </div>
      </Dialog>
    </div>
  );
};

export default AddCustomer;
