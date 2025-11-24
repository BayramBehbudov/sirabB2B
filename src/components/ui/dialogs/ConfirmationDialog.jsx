import { Button } from "primereact/button";
import { ConfirmDialog } from "primereact/confirmdialog";
import React, { Fragment, useState } from "react";
import { useTranslation } from "react-i18next";

const ConfirmationDialog = ({
  onConfirm,
  onCancel,
  trigger = "icon",
  disabled,
}) => {
  const [visible, setVisible] = useState(false);
  const { t } = useTranslation();
  const accept = () => {
    onConfirm?.();
    setVisible(false);
  };
  const reject = () => {
    onCancel?.();
    setVisible(false);
  };
  return (
    <Fragment>
      <Button
        icon="pi pi-check"
        onClick={() => setVisible(true)}
        rounded
        outlined
        label={trigger === "label" ? t("confirm") : ""}
        disabled={disabled}
        severity="success"
        size="small"
        tooltip={t("confirm")}
        tooltipOptions={{
          position: "top",
        }}
      />
      <ConfirmDialog
        group="declarative"
        visible={visible}
        onHide={() => setVisible(false)}
        header={t("confirm")}
        message={t("confirmInfo")}
        icon="pi pi-exclamation-triangle"
        accept={accept}
        reject={reject}
        style={{ width: "500px", maxWidth: "500px" }}
        breakpoints={{ "1100px": "75vw", "960px": "100vw" }}
        defaultFocus="reject"
        acceptLabel={t("yes")}
        rejectLabel={t("no")}
        acceptIcon="pi pi-check"
        rejectIcon="pi pi-times"
      />
    </Fragment>
  );
};

export default ConfirmationDialog;
