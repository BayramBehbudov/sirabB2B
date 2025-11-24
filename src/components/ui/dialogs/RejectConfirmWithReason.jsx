import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputTextarea } from "primereact/inputtextarea";
import React, { Fragment, useState } from "react";
import { useTranslation } from "react-i18next";

const RejectConfirmWithReason = ({
  onConfirm,
  onCancel,
  trigger = "icon",
  disabled,
}) => {
  const [visible, setVisible] = useState(false);
  const { t } = useTranslation();
  const [reason, setReason] = useState("");
  const accept = () => {
    onConfirm?.(reason);
    setReason("");
    setVisible(false);
  };
  const reject = () => {
    onCancel?.();
    setReason("");
    setVisible(false);
  };
  return (
    <Fragment>
      <Button
        icon="pi pi-times"
        rounded
        outlined
        severity="danger"
        disabled={disabled}
        label={trigger === "label" ? t("reject") : ""}
        size="small"
        tooltip={t("reject")}
        tooltipOptions={{
          position: "top",
        }}
        onClick={() => setVisible(true)}
      />
      <Dialog
        header={t("confirReject")}
        visible={visible}
        style={{ width: "500px", maxWidth: "500px" }}
        onHide={() => setVisible(false)}
        footer={() => {
          return (
            <div>
              <Button
                icon="pi pi-times"
                rounded
                severity="danger"
                label={t("close")}
                onClick={reject}
              />
              <Button
                icon="pi pi-check"
                rounded
                severity="success"
                label={t("reject")}
                disabled={reason.trim() === ""}
                onClick={accept}
              />
            </div>
          );
        }}
      >
        <div>
          <div className="flex flex-col gap-2">
            <p>{t("enterRejectReason")}</p>
            <InputTextarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>
        </div>
      </Dialog>
    </Fragment>
  );
};

export default RejectConfirmWithReason;
