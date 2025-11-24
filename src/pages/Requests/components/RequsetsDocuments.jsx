import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Image } from "primereact/image";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import RejectConfirmWithReason from "@/components/ui/dialogs/RejectConfirmWithReason";
import { showToast } from "@/providers/ToastProvider";
import { confirmDocument } from "@/api/Document";
import { Tooltip } from "primereact/tooltip";
import ConfirmationDialog from "@/components/ui/dialogs/ConfirmationDialog";

const RequestsDocuments = ({ row, onSuccess }) => {
  const [visible, setVisible] = useState(false);
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const { documents } = row || {};

  const handleDownload = (filePath, fileName) => {
    const link = document.createElement("a");
    link.href = filePath;
    link.download = fileName || "document";
    link.target = "_blank";
    link.click();
  };

  const handleReject = async ({ id, reason }) => {
    if (!id) return;
    if (!reason)
      return showToast({
        summary: t("error"),
        detail: t("rejectReasonRequired"),
        severity: "error",
      });

    try {
      setLoading(true);
      const res = await confirmDocument({
        id,
        isConfirmed: false,
        rejectMessage: reason,
      });
      showToast({
        summary: t("success"),
        detail: res.message || "",
        severity: "success",
      });
      onSuccess?.();
    } catch (error) {
      console.log("error at handleReject in requests documents", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async ({ id }) => {
    if (!id) return;

    try {
      setLoading(true);
      const res = await confirmDocument({
        id,
        isConfirmed: true,
        rejectMessage: "",
      });
      showToast({
        summary: t("success"),
        detail: res.message || "",
        severity: "success",
      });
      onSuccess?.();
    } catch (error) {
      console.log("error at handleReject in requests documents", error);
    } finally {
      setLoading(false);
    }
  };

  const renderPreview = (doc) => {
    const extension = doc.fileName?.split(".").pop()?.toLowerCase();

    if (["jpg", "jpeg", "png", "gif", "webp"].includes(extension)) {
      return (
        <Image
          src={doc.filePath}
          alt={doc.fileName}
          preview
          className="max-w-[200px] max-h-[200px] object-cover rounded-lg"
        />
      );
    }

    if (extension === "pdf") {
      return (
        <iframe
          src={doc.filePath}
          title={doc.fileName}
          allowFullScreen
          className="w-[200px] h-[200px] border rounded-lg"
        />
      );
    }

    if (["doc", "docx"].includes(extension)) {
      return <i className="pi pi-file-word !text-5xl text-blue-500"></i>;
    }

    if (["xls", "xlsx"].includes(extension)) {
      return <i className="pi pi-file-excel !text-5xl text-green-500"></i>;
    }

    return <i className="pi pi-file !text-5xl text-gray-500"></i>;
  };

  return (
    <div>
      <Button
        icon="pi pi-file"
        size="small"
        onClick={() => setVisible(true)}
        tooltip={t("documents")}
        tooltipOptions={{ position: "left" }}
      />

      <Dialog
        visible={visible}
        onHide={() => setVisible(false)}
        header={t("customerDocumentsWithName", {
          userName: `${row.contactPersonFirstName} ${row.contactPersonLastName}`,
        })}
        className="w-[90vw] h-[90vh]"
      >
        <div>
          <div className="flex flex-wrap gap-4 justify-start">
            {documents?.length > 0 ? (
              documents.map((doc) => {
                return (
                  <div
                    key={doc.id}
                    className="flex flex-col justify-between p-3 w-[230px] h-[300px] shadow-sm border rounded-2xl"
                  >
                    <div className="flex-1 flex items-center justify-center overflow-hidden ">
                      {renderPreview(doc)}
                    </div>

                    <div className="mt-3">
                      <div className="flex flex-col gap-1">
                        <div className="flex flex-row gap-1 items-center">
                          <span className="text-md">{t("documentType")}:</span>
                          <span className="font-semibold text-md">
                            {doc.documentTypeName}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 flex-row">
                          <span className="text-md">{t("name")}:</span>
                          <span className="text-md font-semibold  truncate max-w-[200px]">
                            {doc.fileName.substring(37)}
                          </span>
                        </div>
                        {doc.rejectMessage && (
                          <div
                            data-pr-tooltip={doc.rejectMessage}
                            data-pr-position="top"
                            className="flex items-center gap-1 flex-row reject-reason"
                          >
                            <span className="text-md">{t("reason")}:</span>
                            <span className="text-md font-semibold  truncate max-w-[200px]">
                              {doc.rejectMessage}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="flex justify-center gap-2 mt-3">
                        <Button
                          icon="pi pi-download"
                          rounded
                          outlined
                          size="small"
                          onClick={() =>
                            handleDownload(doc.filePath, doc.fileName)
                          }
                          tooltip={t("download")}
                          tooltipOptions={{
                            position: "top",
                          }}
                          disabled={loading}
                        />
                        <div
                          className="flex flex-row gap-2 buttons-container"
                          data-pr-tooltip={
                            doc.isConfirmed ? t("documentConfirmed") : ""
                          }
                          data-pr-position="top"
                        >
                          <RejectConfirmWithReason
                            disabled={doc.isConfirmed || loading}
                            onConfirm={(v) =>
                              handleReject({ id: doc.id, reason: v })
                            }
                          />
                          <ConfirmationDialog
                            disabled={doc.isConfirmed || loading}
                            onConfirm={() => handleAccept({ id: doc.id })}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-gray-500 text-center w-full">
                {t("noDocuments")}
              </p>
            )}
          </div>
        </div>
        <Tooltip target=".buttons-container" />
        <Tooltip target=".reject-reason" />
      </Dialog>
    </div>
  );
};

export default RequestsDocuments;
