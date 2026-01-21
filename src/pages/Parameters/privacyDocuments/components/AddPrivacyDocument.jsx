import { CreatePrivacyDocument } from "@/api/PrivacyDocuments";
import FilePicker from "@/components/ui/file/FilePicker";
import { showToast } from "@/providers/ToastProvider";
import { PrivacyDocumentSchema } from "@/schemas/privacy-document.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

const AddPrivacyDocument = ({ onSuccess, disabled = false }) => {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  const defaultValues = {
    fileName: "",
    base64: "",
  };
  const { handleSubmit, control, setValue, reset } = useForm({
    resolver: zodResolver(PrivacyDocumentSchema),
    defaultValues,
  });

  const onSubmit = async (formData) => {
    try {
      setLoading(true);
      const res = await CreatePrivacyDocument(formData);
      showToast({
        severity: "success",
        summary: t("success"),
        detail: res?.message || t("createdSuccessfully"),
      });
      setVisible(false);
      onSuccess?.();
    } catch (error) {
      console.log("error at onsubmit in AddPrivacyDocument", error);
      showToast({
        severity: "error",
        summary: t("error"),
        detail: t("unexpectedError"),
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
        label={t("add")}
        icon={"pi pi-plus"}
        onClick={() => {
          setVisible(true);
        }}
        disabled={disabled}
      />
      <Dialog
        header={t("addPrivacyDocument")}
        onHide={onClose}
        visible={visible}
        showCloseIcon={false}
        className="min-w-[500px]"
        footer={() => {
          return (
            <div className="flex flex-row gap-2 items-center justify-end">
              <Button
                severity="danger"
                label={t("cancel")}
                onClick={onClose}
                className="min-w-[100px]"
                disabled={loading}
              />
              <Button
                onClick={handleSubmit(onSubmit)}
                label={t("save")}
                className="min-w-[100px]"
                loading={loading}
                disabled={loading}
              />
            </div>
          );
        }}
      >
        <Controller
          name="base64"
          control={control}
          render={({ field: { value, onChange }, fieldState: { error } }) => {
            return (
              <FilePicker
                label={t("document")}
                placeholder={t("addFile")}
                onChange={(files) => {
                  const formatted = files.map((file) => {
                    return {
                      fileName: file.name,
                      base64: file.base64.split(",")[1],
                    };
                  });
                  onChange(formatted[0].base64);
                  setValue("fileName", formatted[0].fileName);
                }}
                error={error}
                value={value ? [value] : []}
                multiple={false}
                accept={"application/pdf"}
              />
            );
          }}
        />
      </Dialog>
    </div>
  );
};

export default AddPrivacyDocument;
