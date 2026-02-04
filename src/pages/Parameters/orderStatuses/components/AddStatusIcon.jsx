import { UpdateOrderStatus } from "@/api/OrderStatuses";
import FilePicker from "@/components/ui/file/FilePicker";
import { showToast } from "@/providers/ToastProvider";
import {
  RequiredSchemaIntNumber,
  RequiredSchemaMin1,
} from "@/schemas/shared.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Image } from "primereact/image";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import z from "zod";

const AddStatusIcon = ({ onSuccess, status }) => {
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const { t } = useTranslation();
  const defaultValues = { id: status.id, fileName: "", base64: "" };
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { isDirty },
  } = useForm({
    resolver: zodResolver(
      z.object({
        id: RequiredSchemaIntNumber,
        fileName: RequiredSchemaMin1,
        base64: RequiredSchemaMin1,
      }),
    ),
    defaultValues,
  });
  const base64 = watch("base64");
  const previewUri = base64
    ? `data:image/svg+xml;base64,${base64}`
    : status?.filePath;

  const onClose = () => {
    reset(defaultValues);
    setVisible(false);
  };

  const onSubmit = async (formData) => {
    setLoading(true);
    try {
      const res = await UpdateOrderStatus(formData);
      showToast({
        severity: "success",
        summary: t("success"),
        detail: res?.message || "",
      });
      onClose();
      onSuccess?.();
    } catch (error) {
      console.log("error at AddStatusIcon", error);
      showToast({
        severity: "error",
        summary: t("error"),
        detail: error?.response?.data?.message || t("unexpectedError"),
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    reset(defaultValues);
  }, [status, reset]);

  return (
    <div>
      <Button
        onClick={() => setVisible(true)}
        icon={"pi pi-pencil"}
        severity="contrast"
        tooltip={t("changeIcon")}
        tooltipOptions={{ position: "left" }}
      />

      <Dialog
        header={t("changeStatusIcon")}
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
              disabled={loading || !isDirty}
              loading={loading}
            />
          </div>
        }
      >
        <div className={"flex flex-row items-end flex-wrap gap-10"}>
          <div className={"flex flex-row flex-wrap gap-3 py-2"}>
            <Controller
              name="base64"
              control={control}
              render={({
                field: { value, onChange },
                fieldState: { error },
              }) => {
                return (
                  <FilePicker
                    label={t("icon")}
                    placeholder={t("addFile")}
                    onChange={(files) => {
                      const formatted = files
                        .filter((file) => file.type === "image/svg+xml")
                        .map((file) => {
                          return {
                            fileName: file.name,
                            base64: file.base64.split(",")[1],
                          };
                        });

                      onChange(formatted[0]?.base64 || "");
                      setValue("fileName", formatted[0]?.fileName || "");
                    }}
                    error={error}
                    value={value ? [value] : []}
                    multiple={false}
                    accept={"image/svg+xml"}
                  />
                );
              }}
            />
          </div>
          {previewUri && (
            <Image
              imageClassName="w-[32px] h-[32px]"
              className="bg-[#DEF4FF] p-3 rounded-full w-fit h-fit"
              src={previewUri}
            />
          )}
        </div>
      </Dialog>
    </div>
  );
};

export default AddStatusIcon;
