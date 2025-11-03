import { editB2BCustomerPassword } from "@/api/B2BCustomer";
import ControlledInput from "@/components/ui/ControlledInput";
import { showToast } from "@/providers/ToastProvider";
import { PasswordSchema } from "@/schemas/user.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Fragment, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

const EditPassword = ({ user, onSuccess, disabled = false }) => {
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const { t } = useTranslation();
  const defaultValues = {
    password: "",
  };
  const { control, handleSubmit, reset } = useForm({
    resolver: zodResolver(PasswordSchema),
    defaultValues,
  });
  const onSubmit = async (formData) => {
    try {
      setLoading(true);
      const res = await editB2BCustomerPassword({
        ...formData,
        b2BCustomerId: user.b2BCustomerId,
      });

      showToast({
        severity: "success",
        summary: t("success"),
        detail: res?.message || t("updatedSuccessfully"),
      });
      onHide();
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

  const onHide = () => {
    setVisible(false);
    reset(defaultValues);
  };

  return (
    <Fragment>
      <Button
        tooltip={t("messages.changePassword")}
        tooltipOptions={{ position: "top" }}
        icon={`pi pi-key`}
        disabled={disabled}
        onClick={() => setVisible(true)}
      />
      <Dialog
        visible={visible}
        onHide={onHide}
        header={t("changeUserPassword", {
          userName:
            user.contactPersonFirstName + " " + user.contactPersonLastName,
        })}
        showCloseIcon={false}
        draggable={false}
        className="min-w-[400px]"
        footer={
          <div>
            <Button label={t("cancel")} onClick={onHide} disabled={loading} />
            <Button
              label={t("save")}
              onClick={handleSubmit(onSubmit)}
              disabled={loading}
              loading={loading}
            />
          </div>
        }
      >
        <ControlledInput
          control={control}
          name="password"
          label={t("password")}
          type="password"
        />
      </Dialog>
    </Fragment>
  );
};

export default EditPassword;
