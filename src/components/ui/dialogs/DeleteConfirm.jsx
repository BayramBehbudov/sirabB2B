import { Button } from "primereact/button";
import { ConfirmDialog } from "primereact/confirmdialog";
import React, { Fragment, useState } from "react";
import { useTranslation } from "react-i18next";

const DeleteConfirm = ({ onConfirm, onCancel, trigger = "icon" }) => {
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
        onClick={() => setVisible(true)}
        icon="pi pi-trash"
        className="p-button-danger"
        label={trigger === "label" ? t("delete") : ""}
        severity="danger"
      />
      <ConfirmDialog
        group="declarative"
        visible={visible}
        onHide={() => setVisible(false)}
        message={t("deleteInfoWarning")}
        header={t("deleteConfirmation")}
        icon="pi pi-exclamation-triangle"
        accept={accept}
        reject={reject}
        style={{ width: "500px", maxWidth: "500px" }}
        breakpoints={{ "1100px": "75vw", "960px": "100vw" }}
        defaultFocus="reject"
        acceptClassName="p-button-danger"
        acceptLabel={t("yes")}
        rejectLabel={t("no")}
        acceptIcon="pi pi-check"
        rejectIcon="pi pi-times"
      />
    </Fragment>
  );
};

export default DeleteConfirm;
