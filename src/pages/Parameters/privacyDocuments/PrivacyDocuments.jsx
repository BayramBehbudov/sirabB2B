import {
  DeletePrivacyDocument,
  GetAllPrivacyDocument,
} from "@/api/PrivacyDocuments";
import usePermissions from "@/hooks/usePermissions";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import AddPrivacyDocument from "./components/AddPrivacyDocument";
import { Button } from "primereact/button";
import DeleteConfirm from "@/components/ui/dialogs/DeleteConfirm";
import { showToast } from "@/providers/ToastProvider";

const PrivacyDocuments = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [documents, setDocuments] = useState([]);
  const navigate = useNavigate();
  const perms = usePermissions({
    show: "PrivacyDocument: Gizlilik şərti siyahısı",
    create: "PrivacyDocument: Gizlilik şərti yaratmaq",
    delete: "PrivacyDocument: Gizlilik şərti silmək",
  });
  const isAllowed = perms.isAllowed("show");

  const getAll = async () => {
    try {
      setLoading(true);
      const res = await GetAllPrivacyDocument();
      setDocuments(res.data);
    } catch (error) {
      console.log("error at get all in privact documents", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (filePath, fileName) => {
    const link = document.createElement("a");
    link.href = filePath;
    link.download = fileName || "document";
    link.target = "_blank";
    link.click();
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      await DeletePrivacyDocument(id);
      showToast({
        severity: "success",
        summary: t("success"),
        detail: t("dataDeletedSuccess"),
      });
      setDocuments((prev) => prev.filter((d) => d.id !== id));
    } catch (error) {
      console.log("error at handle delete privacy document", error);
      showToast({
        severity: "error",
        summary: t("error"),
        detail: t("unexpectedError"),
      });
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (!perms.ready) return;
    if (!isAllowed) return navigate("/not-allowed", { replace: true });
    getAll();
  }, [perms.ready, isAllowed]);

  return (
    <div className="flex flex-col gap-5">
      <div className={`flex items-center justify-between`}>
        <div>
          <p className={`text-[1.5rem] font-bold`}>{t("privacyDocuments")}</p>
        </div>
        <div className="flex flex-row gap-2">
          {perms.create && (
            <AddPrivacyDocument
              onSuccess={getAll}
              disabled={documents.length || loading}
            />
          )}
        </div>
      </div>
      <div className="flex flex-row flex-wrap gap-4 items-start">
        {documents.length > 0 ? (
          documents.map((doc) => {
            return (
              <div
                key={doc.id}
                className="flex flex-col justify-between p-3 w-[230px] h-[300px] shadow-sm border rounded-2xl"
              >
                <div className="flex-1 flex items-center justify-center overflow-hidden ">
                  <iframe
                    src={doc.filePath}
                    title={doc.fileName}
                    allowFullScreen
                    className="w-[200px] h-[200px] border rounded-lg"
                  />
                </div>

                <div className="mt-3">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1 flex-row">
                      <span className="text-md">{t("name")}:</span>
                      <span className="text-md font-semibold  truncate max-w-[200px]">
                        {doc.fileName.substring(37)}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-center gap-2 mt-3">
                    <Button
                      icon="pi pi-download"
                      size="small"
                      onClick={() => handleDownload(doc.filePath, doc.fileName)}
                      tooltip={t("download")}
                      tooltipOptions={{
                        position: "top",
                      }}
                      disabled={loading}
                    />
                    {perms.delete && (
                      <DeleteConfirm
                        onConfirm={() => {
                          handleDelete(doc.id);
                        }}
                      />
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-2xl text-center w-full">{t("noDocuments")}</p>
        )}
      </div>
    </div>
  );
};

export default PrivacyDocuments;
