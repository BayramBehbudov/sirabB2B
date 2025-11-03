import { ConfirmDialog } from "primereact/confirmdialog";
import { InputSwitch } from "primereact/inputswitch";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

export const SwitchConfirm = ({
  checked,
  onAccept,
  onReject,
  headerText,
  text,
  disabled = false,
  tooltip,
}) => {
  const [visible, setVisible] = useState(false);
  const { t } = useTranslation();
  return (
    <div className="flex">
      <InputSwitch
        tooltip={tooltip || t("confirm")}
        tooltipOptions={{ position: "top" }}
        checked={checked}
        onChange={() => {
          setVisible(true);
        }}
        disabled={disabled}
      />

      <ConfirmDialog
        header={headerText || t("confirm")}
        message={
          text ? text : checked ? t("cancelConfirmation") : t("confirmAction")
        }
        style={{ width: "400px" }}
        contentStyle={{ fontWeight: "500" }}
        visible={visible}
        onHide={() => setVisible(false)}
        accept={onAccept}
        reject={onReject}
        acceptLabel={t("yes")}
        rejectLabel={t("no")}
      />
    </div>
  );
};
