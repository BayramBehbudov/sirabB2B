import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { useTranslation } from "react-i18next";
import { UserSchema, UserUpdateSchema } from "@/schemas/user.schema";
import ControlledInput from "../../../components/ui/ControlledInput";
import { showToast } from "@/providers/ToastProvider";
import { CreateUser, UpdateUser } from "@/api/Auth";
import ControlledSwitch from "@/components/ui/ControlledSwitch";

const AddUser = ({ onSuccess, user, disabled = false }) => {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const isEdit = !!user;

  const defaultValues = {
    username: user?.userName || "",
    phoneNumber: user?.phoneNumber || "",
    isActive: user?.isActive || false,
    isWebLogin: user?.isWebLogin || false,
    isMobileLogin: user?.isMobileLogin || false,
    ...(isEdit ? {} : { password: "", confirmPassword: "" }),
  };

  const { control, handleSubmit, reset } = useForm({
    resolver: zodResolver(isEdit ? UserUpdateSchema : UserSchema),
    defaultValues,
  });
  useEffect(() => {
    reset(defaultValues);
  }, [user]);

  const onSubmit = async (formData) => {
    try {
      setLoading(true);

      const res = isEdit
        ? await UpdateUser({
            ...formData,
            id: user.id,
          })
        : await CreateUser(formData);
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
        icon={`pi ${isEdit ? "pi-pencil" : "pi-plus"}`}
        onClick={() => setVisible(true)}
        tooltipOptions={{ position: "top" }}
        tooltip={isEdit ? t("edit") : ""}
        label={!isEdit && t("add")}
        disabled={disabled}
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
        <div className="flex flex-col gap-2">
          <div className={"flex flex-row flex-wrap gap-3 py-2"}>
            {[
              { name: "phoneNumber", avtoValue: "+994" },
              { name: "username" },
              ...(!isEdit
                ? [
                    { name: "password", type: "password" },
                    { name: "confirmPassword", type: "password" },
                  ]
                : []),
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
          </div>
          <div className="flex flex-row flex-wrap gap-3 py-2">
            {[
              { label: "activePassive", name: "isActive" },
              { label: "webAccess", name: "isWebLogin" },
              { label: "mobileAccess", name: "isMobileLogin" },
            ].map((input) => {
              return (
                <ControlledSwitch
                  key={input.name}
                  control={control}
                  name={input.name}
                  label={t(input.label)}
                  className="mr-5"
                />
              );
            })}
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default AddUser;
