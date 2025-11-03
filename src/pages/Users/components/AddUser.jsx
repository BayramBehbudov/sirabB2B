import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { useTranslation } from "react-i18next";
import { UserSchema } from "@/schemas/user.schema";
import ControlledInput from "../../../components/ui/ControlledInput";
import { showToast } from "@/providers/ToastProvider";
import { AuthCreate } from "@/api/Auth";
import ControlledSwitch from "@/components/ui/ControlledSwitch";

const AddUser = ({ onSuccess }) => {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const defaultValues = {
    username: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    isActive: true,
  };

  const { control, handleSubmit, reset } = useForm({
    resolver: zodResolver(UserSchema),
    defaultValues,
  });
  const onSubmit = async (formData) => {
    try {
      setLoading(true);
      const res = await AuthCreate(formData);
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
        icon={`pi pi-plus`}
        onClick={() => setVisible(true)}
        label={t("add")}
      />

      <Dialog
        header={t("addUserInfo")}
        visible={visible}
        className={"max-w-[90%] min-w-[700px]"}
        onHide={onClose}
        footer={
          <div>
            <Button
              label={t("cancel")}
              className={`w-[150px]`}
              onClick={onClose}
            />
            <Button
              label={t("save")}
              className={`w-[150px]`}
              onClick={handleSubmit(onSubmit)}
              disabled={loading}
              loading={loading}
            />
          </div>
        }
      >
        <div className={"flex flex-row flex-wrap gap-3 py-2"}>
          {[
            { name: "phoneNumber", avtoValue: "+994" },
            { name: "username" },
            { name: "password", type: "password" },
            { name: "confirmPassword", type: "password" },
          ].map((input) => (
            <ControlledInput
              control={control}
              key={input.name}
              name={input.name}
              label={t(input.name)}
              type={input.type || "text"}
              className={"w-[250px]"}
              avtoValue={input.avtoValue}
            />
          ))}

          <ControlledSwitch
            control={control}
            name="isActive"
            label={t("activePassive")}
          />
        </div>
      </Dialog>
    </div>
  );
};

export default AddUser;
