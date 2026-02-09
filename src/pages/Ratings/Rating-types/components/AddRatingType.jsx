import {
  CreateOrderEvaluationType,
  UpdateOrderEvaluationType,
} from "@/api/OrderEvaluation";
import ControlledInput from "@/components/ui/ControlledInput";
import { showToast } from "@/providers/ToastProvider";
import {
  RequiredSchemaId,
  RequiredSchemaIntNumber,
  RequiredSchemaMin1,
} from "@/schemas/shared.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import z from "zod";

const AddRatingType = ({ onSuccess, defaultType, allTypes }) => {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const isEdit = !!defaultType;

  const defaultValues = {
    ...(isEdit ? { id: defaultType.id } : {}),
    name: defaultType?.name || "",
    order: defaultType?.order || "",
  };

  const { control, handleSubmit, reset } = useForm({
    resolver: zodResolver(
      z.object({
        ...(isEdit ? { id: RequiredSchemaId } : {}),
        name: RequiredSchemaMin1,
        order: RequiredSchemaIntNumber,
      }),
    ),
    defaultValues,
  });
  const onSubmit = async (formData) => {
    const isOrderExists = allTypes?.some(
      (type) => type.order === formData.order && type.id !== formData.id,
    );
    if (isOrderExists) {
      showToast({
        severity: "warn",
        summary: t("error"),
        detail: t("seriAlreadyExists"),
      });
      return;
    }
    try {
      setLoading(true);
      const res = isEdit
        ? await UpdateOrderEvaluationType(formData)
        : await CreateOrderEvaluationType(formData);
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

  useEffect(() => {
    reset(defaultValues);
  }, [defaultType]);

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
        header={t("addTypeInfo")}
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
          {[
            { name: "name", type: "text", label: "name" },
            { name: "order", type: "number", label: "seri" },
          ].map((input) => (
            <ControlledInput
              control={control}
              key={input.name}
              name={input.name}
              placeholder={t(input.label)}
              label={t(input.label)}
              type={input.type || "text"}
              className={"w-[250px]"}
            />
          ))}
        </div>
      </Dialog>
    </div>
  );
};

export default AddRatingType;
