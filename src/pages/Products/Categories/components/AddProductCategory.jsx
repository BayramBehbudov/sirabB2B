import { ProductCategoryCreate, ProductCategoryUpdate } from "@/api/Products";
import ControlledInput from "@/components/ui/ControlledInput";
import FilePicker from "@/components/ui/file/FilePicker";
import { showToast } from "@/providers/ToastProvider";
import { ProductCategorySchema } from "@/schemas/product.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

const AddProductCategory = ({ onSuccess, category, disabled = false }) => {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const isEdit = !!category;

  const defaultValues = {
    name: category?.name || "",
    fileName: category?.fileName || "",
    base64: category?.filePath || "",
  };

  const {
    handleSubmit,
    setValue,
    formState: { errors },
    control,
    watch,
    reset,
  } = useForm({
    resolver: zodResolver(ProductCategorySchema),
    defaultValues,
  });

  useEffect(() => {
    reset(defaultValues);
  }, [category]);

  const onSubmit = async (formData) => {
    try {
      setLoading(true);
      const formatted = {
        ...formData,
        base64: formData.base64.split(",")[1],
      };
      const res = isEdit
        ? await ProductCategoryUpdate({
            ...formatted,
            id: category.id,
          })
        : await ProductCategoryCreate(formatted);
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
        header={t("addCategoryInfo")}
        visible={visible}
        className={"max-w-[90%] min-w-[700px]"}
        onHide={onClose}
        footer={
          <div>
            <Button
              label={t("cancel")}
              className={`min-w-[100px]`}
              onClick={onClose}
            />
            <Button
              label={t("save")}
              className={`min-w-[100px]`}
              onClick={handleSubmit(onSubmit)}
              disabled={loading}
              loading={loading}
            />
          </div>
        }
      >
        <div className={`flex flex-row flex-wrap gap-2 py-[10px]`}>
          {[{ name: "name" }].map((inp) => {
            return (
              <ControlledInput
                control={control}
                name={inp.name}
                label={t(inp.name)}
                placeholder={t(inp.name)}
                className={"w-[250px]"}
                key={inp.name}
              />
            );
          })}
          <FilePicker
            label={t("image")}
            onChange={(files) => {
              const file = files[0];
              if (file) {
                setValue("fileName", file.name);
                setValue("base64", file.base64);
              }
            }}
            error={errors.base64}
            value={watch("base64") ? [watch("base64")] : []}
            multiple={false}
            placeholder={t("addFile")}
            accept={"image/*"}
          />
        </div>
      </Dialog>
    </div>
  );
};

export default AddProductCategory;
