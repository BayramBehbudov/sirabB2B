import {
  CreateNotificationType,
  UpdateNotificationType,
} from "@/api/Notification";
import ControlledInput from "@/components/ui/ControlledInput";
import FilePicker from "@/components/ui/file/FilePicker";
import FileScrollView from "@/components/ui/file/FileScrollView";
import { showToast } from "@/providers/ToastProvider";
import {
  NotificationTypeSchema,
  NotificationTypeUpdateSchema,
} from "@/schemas/notification.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

const AddNotificationType = ({ onSuccess, defaultValue }) => {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const isEdit = !!defaultValue;

  const defaultValues = {
    ...(isEdit ? { id: defaultValue.id } : {}),
    name: defaultValue?.name || "",
    soundFileName: defaultValue?.soundFileName || "",
    iconFileName: "",
    iconBase64: "",
  };

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(
      isEdit ? NotificationTypeUpdateSchema : NotificationTypeSchema
    ),
    defaultValues,
  });

  const formValue = watch();
  const onSubmit = async (formData) => {
    // qeyd create test edilməyib
    // edit edir amma error qaytarır
    const formatted = {
      ...formData,
      iconBase64: formData.iconBase64.split(",")[1] || "",
    };
    try {
      setLoading(true);
      const res = isEdit
        ? await UpdateNotificationType(formatted)
        : await CreateNotificationType(formatted);
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
      />
      <Dialog
        header={t("addNotificationInfo")}
        visible={visible}
        className={`max-w-[1100px]`}
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
        <div className={`flex flex-row flex-wrap gap-2 py-[10px]`}>
          {[{ name: "name" }, { name: "soundFileName" }].map((input) => (
            <ControlledInput
              control={control}
              key={input.name}
              name={input.name}
              placeholder={t(input.name)}
              label={t(input.name)}
              type={input.type || "text"}
              className={"w-[250px]"}
            />
          ))}
          <FilePicker
            label={t("iconSelect")}
            onChange={(files) => {
              if (files?.length === 0) return;
              const { name, base64 } = files[0];
              setValue("iconFileName", name);
              setValue("iconBase64", base64);
            }}
            error={errors.iconFileName}
            multiple={false}
            accept={"image/*"}
          />
        </div>
        <FileScrollView
          fields={
            formValue.iconBase64
              ? [
                  {
                    fileName: formValue.iconFileName,
                    base64: formValue.iconBase64,
                    type: "image/",
                  },
                ]
              : []
          }
          handleRemove={() => {
            setValue("iconBase64", "");
            setValue("iconFileName", "");
          }}
        />
      </Dialog>
    </div>
  );
};

export default AddNotificationType;
