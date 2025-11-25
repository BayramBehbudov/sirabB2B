import {
  CreateNotificationTemplate,
  UpdateNotificationTemplate,
} from "@/api/Notification";
import ControlledInput from "@/components/ui/ControlledInput";
import { showToast } from "@/providers/ToastProvider";
import { NotificationTemplateSchema } from "@/schemas/notification.schema";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

const AddNotificationTemplate = ({ onSuccess, defaultValue }) => {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const isEdit = !!defaultValue;

  const defaultValues = {
    ...(isEdit ? { id: defaultValue.id } : {}),
    titleTemplate: defaultValue?.titleTemplate || "",
    bodyTemplate: defaultValue?.bodyTemplate || "",
  };

  const { control, handleSubmit, reset } = useForm({
    resolver: zodResolver(NotificationTemplateSchema),
    defaultValues,
  });

  const onSubmit = async (formData) => {
    const formatted = {
      ...formData,
      ...(isEdit ? { id: defaultValue.id } : {}),
    };
    try {
      setLoading(true);
      const res = isEdit
        ? await UpdateNotificationTemplate(formatted)
        : await CreateNotificationTemplate(formatted);
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
        className={`max-w-[1100px] min-w-[800px]`}
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
        <div className="flex flex-col">
          <div className={`flex flex-row flex-wrap gap-2 py-[10px] `}>
            {[{ name: "titleTemplate", type: "text", label: "title" }].map(
              (input) => (
                <ControlledInput
                  control={control}
                  key={input.name}
                  name={input.name}
                  placeholder={t(input.label)}
                  label={t(input.label)}
                  type={input.type || "text"}
                  className={"w-[250px]"}
                />
              )
            )}
          </div>
          <div className={`flex flex-row flex-wrap gap-2 py-[10px] `}>
            {[{ name: "bodyTemplate", type: "textarea", label: "body" }].map(
              (input) => (
                <ControlledInput
                  control={control}
                  key={input.name}
                  name={input.name}
                  placeholder={t(input.label)}
                  label={t(input.label)}
                  type={input.type || "text"}
                  classNameContainer="grow"
                />
              )
            )}
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default AddNotificationTemplate;
