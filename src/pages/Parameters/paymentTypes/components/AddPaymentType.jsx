import { CreatePaymentType, UpdatePaymentType } from "@/api/PaymentTypes";
import ControlledInput from "@/components/ui/ControlledInput";
import FilePicker from "@/components/ui/file/FilePicker";
import { showToast } from "@/providers/ToastProvider";
import { PaymentTypeSchema } from "@/schemas/payment-type.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Image } from "primereact/image";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

const AddPaymentType = ({ onSuccess, currentType }) => {
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const { t } = useTranslation();
  const isEdit = !!currentType;
  const defaultValues = {
    id: currentType?.id || 0,
    name: currentType?.name || "",
    description: currentType?.description || "",
    fileName: currentType?.fileName || "",
    base64: "",
  };
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { isDirty },
  } = useForm({
    resolver: zodResolver(PaymentTypeSchema),
    defaultValues,
  });

  const base64 = watch("base64");
  const previewUri = base64
    ? `data:image/png;base64,${base64}`
    : currentType?.filePath;

  const onSubmit = async (formData) => {
    setLoading(true);
    try {
      const res = isEdit
        ? await UpdatePaymentType(formData)
        : await CreatePaymentType(formData);

      showToast({
        severity: "success",
        summary: t("success"),
        detail: res?.message || "",
      });
      onClose();
      onSuccess?.();
    } catch (error) {
      console.log("error at CreatePaymentType", error);
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
  }, [currentType, reset]);

  const onClose = () => {
    reset(defaultValues);
    setVisible(false);
  };
  return (
    <div>
      <Button
        onClick={() => setVisible(true)}
        label={isEdit ? undefined : t("add")}
        icon={isEdit ? "pi pi-pencil" : "pi pi-plus"}
        severity="contrast"
      />

      <Dialog
        header={t("enterInfo")}
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
        <div className={"flex flex-col gap-3"}>
          <div className={"flex flex-row flex-wrap gap-3 py-2"}>
            {[{ name: "name" }, { name: "description" }].map((input) => (
              <ControlledInput
                control={control}
                key={input.name}
                name={input.name}
                label={t(input.name)}
                type={input.type || "text"}
                className={"w-[250px]"}
                avtoValue={input.avtoValue}
                placeholder={t("enter")}
              />
            ))}
            <Controller
              name="base64"
              control={control}
              render={({
                field: { value, onChange },
                fieldState: { error },
              }) => {
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
                      onChange(formatted[0]?.base64 || "");
                      setValue("fileName", formatted[0]?.fileName || "");
                    }}
                    error={error}
                    value={value ? [value] : []}
                    multiple={false}
                    accept={"image/*"}
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

export default AddPaymentType;
