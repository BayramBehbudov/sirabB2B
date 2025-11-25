import { useTranslation } from "react-i18next";
import AddDocumentType from "./components/AddDocumentType";
import { useEffect, useState } from "react";
import { DeleteDocumentType, GetAllDocumentTypes } from "@/api/Document";
import DataTableContainer, {
  tableStaticProps,
} from "@/components/ui/TableContainer";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Badge } from "primereact/badge";
import { Tag } from "primereact/tag";
import DeleteConfirm from "@/components/ui/dialogs/DeleteConfirm";
import { showToast } from "@/providers/ToastProvider";
import { useNavigate } from "react-router-dom";
import usePermissions from "@/hooks/usePermissions";

const DocumentTypes = () => {
  const [loading, setLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [types, setTypes] = useState([]);
  const [page, setPage] = useState({
    pageNumber: 1,
    pageSize: 10,
  });
  const { t } = useTranslation();
  const navigate = useNavigate();

  const perms = usePermissions({
    show: "Sənəd növü: Sənəd növlərini görmək",
    create: "Sənəd növü: Sənəd növü yaratmaq",
    update: "Sənəd növü: Sənəd növünü yeniləmək",
    delete: "Sənəd növü: Sənəd növünü silmək",
  });

  const isAllowed = perms.isAllowed("show");
  const hasAny = perms.hasAny(["update", "delete"]);

  const getTypes = async () => {
    try {
      setLoading(true);
      const res = await GetAllDocumentTypes(page);
      setTypes(res.documentTypes);
      setTotalRecords(res.pageInfo.totalItems);
    } catch (error) {
      console.log("error at getTypes at document types", error);
    } finally {
      setLoading(false);
    }
  };
  const handleDelete = async (id) => {
    setLoading(true);
    try {
      const res = await DeleteDocumentType(id);
      showToast({
        severity: "success",
        summary: t("success"),
        detail: res?.message || "",
      });
      getTypes();
    } catch (error) {
      console.log("error at DeleteDocumentType", error);
      showToast({
        severity: "error",
        summary: t("error"),
        detail: error?.response?.data?.message || t("unexpectedError"),
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!perms.ready) return;
    if (!isAllowed) return navigate("/not-allowed", { replace: true });
    getTypes();
  }, [page, isAllowed, perms.ready]);

  if (!isAllowed || !perms.ready) return null;
  return (
    <div className="flex flex-col gap-5">
      <div className={`flex items-center justify-between p-2`}>
        <div>
          <p className={`text-[1.5rem] font-bold`}>{t("documentTypes")}</p>
        </div>
        <div className="flex flex-row gap-2">
          {perms.create && <AddDocumentType onSuccess={getTypes} />}
        </div>
      </div>
      <DataTableContainer>
        <DataTable
          loading={loading}
          value={types}
          {...tableStaticProps}
          first={page.pageNumber * page.pageSize - page.pageSize}
          totalRecords={totalRecords}
          rows={page.pageSize}
          onPage={(e) => {
            const newPage = {
              pageNumber: e.page + 1,
              pageSize: e.rows,
            };
            setPage(newPage);
          }}
        >
          {["name"].map((f) => {
            return <Column field={f} header={t(f)} />;
          })}
          <Column
            field={"isOptional"}
            header={t("isOptional")}
            body={(data) => (
              <Tag
                value={data.isOptional ? t("mandatory") : t("notMandatory")}
                severity={data.isOptional ? "success" : "danger"}
              ></Tag>
            )}
          />
          {hasAny && (
            <Column
              header={"#"}
              body={(data) => (
                <div className="flex flex-row gap-2 items-center">
                  {perms.update && (
                    <AddDocumentType onSuccess={getTypes} currentType={data} />
                  )}
                  {perms.delete && (
                    <DeleteConfirm
                      onConfirm={() => handleDelete(data.id)}
                      disabled={loading}
                    />
                  )}
                </div>
              )}
            />
          )}
        </DataTable>
      </DataTableContainer>
    </div>
  );
};

export default DocumentTypes;
