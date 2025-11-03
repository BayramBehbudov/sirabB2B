import { CreateClaimGroup, UpdateClaimGroup } from "@/api/ClaimGroups";
import ControlledInput from "@/components/ui/ControlledInput";
import { showToast } from "@/providers/ToastProvider";
import { ClaimGroupSchema } from "@/schemas/claim-group.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

const AddClaimGroup = ({ onSuccess, claim }) => {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const isEdit = !!claim;

  const defaultValues = {
    name: claim?.name || "",
  };

  const {
    control,
    handleSubmit,
    reset,
    formState: { isDirty },
  } = useForm({
    defaultValues,
    resolver: zodResolver(ClaimGroupSchema),
  });

  const onSubmit = async (formData) => {
    try {
      setLoading(true);
      const res = isEdit
        ? await UpdateClaimGroup({
            ...formData,
            id: claim.id,
          })
        : await CreateClaimGroup(formData);
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
        header={t("addClaimGroup")}
        visible={visible}
        className={`max-w-[90%] min-w-[700px]`}
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
        <div className={`flex flex-row flex-wrap gap-2 py-2 `}>
          {[{ name: "name", label: "groupName" }].map((input) => (
            <ControlledInput
              control={control}
              key={input.name}
              name={input.name}
              placeholder={t(input.label)}
              label={t(input.label)}
              type={input.type || "text"}
              className={"w-[250px]"}
              avtoValue={input.avtoValue}
            />
          ))}
        </div>
      </Dialog>
    </div>
  );
};

export default AddClaimGroup;
