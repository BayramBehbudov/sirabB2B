import { CreateDocumentType, UpdateDocumentType } from "@/api/Document";
import ControlledInput from "@/components/ui/ControlledInput";
import { showToast } from "@/providers/ToastProvider";
import { DocumentTypeSchema } from "@/schemas/document.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

const AddDocumentType = ({ onSuccess, currentType }) => {
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const { t } = useTranslation();
  const isEdit = !!currentType;

  const defaultValues = {
    name: currentType?.name || "",
  };

  const { control, handleSubmit, reset } = useForm({
    resolver: zodResolver(DocumentTypeSchema),
    defaultValues,
  });

  const onSubmit = async (formData) => {
    setLoading(true);
    try {
      const res = isEdit
        ? await UpdateDocumentType({ ...formData, id: currentType.id })
        : await CreateDocumentType(formData);

      showToast({
        severity: "success",
        summary: t("success"),
        detail: res?.message || "",
      });
      onClose();
      onSuccess?.();
    } catch (error) {
      console.log("error at CreateDocumentType", error);
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
              disabled={loading}
              loading={loading}
            />
          </div>
        }
      >
        <div className={"flex flex-row flex-wrap gap-3 py-2"}>
          {[{ name: "name" }].map((input) => (
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
        </div>
      </Dialog>
    </div>
  );
};

export default AddDocumentType;
