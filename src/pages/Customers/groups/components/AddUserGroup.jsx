import { Button } from "primereact/button";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import ControlledInput from "@/components/ui/ControlledInput";
import { Dialog } from "primereact/dialog";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { showToast } from "@/providers/ToastProvider";
import {
  createCustomerGroup,
  updateCustomerGroup,
} from "@/api/B2BCustomerGroup";
const AddUserGroup = ({ group = null, onSuccess }) => {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const isEdit = !!group;

  const { handleSubmit, control, reset } = useForm({
    resolver: zodResolver(
      z.object({
        name: z
          .string({ error: "errors.required" })
          .nonempty({ error: "errors.required" }),
      })
    ),
    defaultValues: {
      name: group?.name || "",
    },
  });

  const onSubmit = async (formData) => {
    try {
      setLoading(true);
      const res = isEdit
        ? await updateCustomerGroup({ ...formData, id: group.id })
        : await createCustomerGroup(formData);
      showToast({
        severity: "success",
        summary: t("success"),
        detail: res?.message,
      });
      reset();
      setVisible(false);
      onSuccess?.();
    } catch (error) {
      showToast({
        severity: "error",
        summary: t("error"),
        detail:
          error?.response?.data?.message ??
          t("messages.userGroupCreationError") + ". " + t("messages.tryAgain"),
      });
    } finally {
      setLoading(false);
    }
  };

  const onClose = () => {
    setVisible(false);
    reset();
  };

  return (
    <div>
      <Button
        onClick={() => setVisible(true)}
        label={isEdit ? undefined : t("addUserGroup")}
        icon={isEdit ? "pi pi-pencil" : "pi pi-plus"}
      />
      <Dialog
        header={isEdit ? t("editUserGroupInfo") : t("addUserGroupInfo")}
        visible={visible}
        className={"max-w-[1100px] min-w-[500px]"}
        onHide={onClose}
        showCloseIcon={false}
        draggable={false}
        footer={
          <div>
            <Button
              label={t("cancel")}
              className={"!w-[100px]"}
              onClick={onClose}
            />
            <Button
              label={isEdit ? t("edit") : t("save")}
              className={"!w-[100px]"}
              onClick={handleSubmit(onSubmit)}
              disabled={loading}
              loading={loading}
            />
          </div>
        }
      >
        <div className={"flex flex-row flex-wrap gap-2 py-[10px]"}>
          {[{ name: "name" }].map((input) => (
            <ControlledInput
              control={control}
              key={input.name}
              name={input.name}
              placeholder={t("groupName")}
              label={t(input.name)}
              type={input.type || "text"}
              className={"w-[250px]"}
            />
          ))}
        </div>
      </Dialog>
    </div>
  );
};

export default AddUserGroup;
