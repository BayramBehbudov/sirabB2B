import { CreateUnitDefinition, UpdateUnitDefinition } from "@/api/Products";
import ControlledInput from "@/components/ui/ControlledInput";
import { showToast } from "@/providers/ToastProvider";
import { UnitSchema } from "@/schemas/product.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

const AddUnit = ({ onSuccess, unit, disabled = false }) => {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const isEdit = !!unit;
  const defaultValues = {
    name: unit?.name || "",
    code: unit?.code || "",
  };
  const { control, handleSubmit, reset } = useForm({
    resolver: zodResolver(UnitSchema),
    defaultValues,
  });
  useEffect(() => {
    if (!unit) return;
    reset({
      name: unit.name,
      code: unit.code,
    });
  }, [unit]);

  const onSubmit = async (formData) => {
    try {
      setLoading(true);
      const res = isEdit
        ? await UpdateUnitDefinition({
            ...formData,
            id: unit.id,
          })
        : await CreateUnitDefinition(formData);
      showToast({
        severity: "success",
        summary: t("success"),
        detail: res?.message || "",
      });
      setVisible(false);
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
        header={t("addUnitInfo")}
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
              disabled={loading || disabled}
              loading={loading}
            />
          </div>
        }
      >
        <div className={`flex flex-row flex-wrap gap-2 py-[10px]`}>
          {[{ name: "name" }, { name: "code" }].map((inp) => {
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
        </div>
      </Dialog>
    </div>
  );
};

export default AddUnit;
