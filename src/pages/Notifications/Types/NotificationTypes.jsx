import { useTranslation } from "react-i18next";
import AddNotificationType from "./AddNotificationType";
import { useEffect, useState } from "react";
import {
  DeleteNotificationType,
  GetNotificationTypes,
} from "@/api/Notification";
import DataTableContainer, {
  tableStaticProps,
} from "@/components/ui/TableContainer";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import DeleteConfirm from "@/components/ui/dialogs/DeleteConfirm";
import { showToast } from "@/providers/ToastProvider";
import { useNavigate } from "react-router-dom";
import usePermissions from "@/hooks/usePermissions";

const NotificationTypes = () => {
  const { t } = useTranslation();
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState({
    pageNumber: 1,
    pageSize: 10,
  });
  const [totalRecords, setTotalRecords] = useState(0);

  const navigate = useNavigate();

  const perms = usePermissions({
    show: "Bildiriş tipi: Bildiriş tiplərini görmək",
    create: "Bildiriş tipi: Bildiriş tipi yaratmaq",
    update: "Bildiriş tipi: Bildiriş tipi yeniləmək",
    delete: "Bildiriş tipi: Bildiriş tipi silmək",
  });

  const isAllowed = perms.isAllowed("show");
  const hasAny = perms.hasAny(["update", "delete"]);

  const getTypes = async () => {
    try {
      setLoading(true);
      const res = await GetNotificationTypes(page);
      setTypes(res.notificationTypes);
      setTotalRecords(res.pageInfo.totalItems);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (!perms.ready) return;
    if (!isAllowed) return navigate("/not-allowed", { replace: true });
    getTypes();
  }, [page, isAllowed, perms.ready]);

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      await DeleteNotificationType(id);
      getTypes();
      showToast({
        severity: "success",
        summary: t("success"),
        detail: t("dataDeletedSuccess"),
      });
    } catch (error) {
      console.log("error at notification delete", error);
      showToast({
        severity: "error",
        summary: t("error"),
        detail: error?.response?.data?.message || t("unexpectedError"),
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isAllowed || !perms.ready) return null;
  return (
    <div className="flex flex-col gap-5">
      <div className={`flex items-center justify-between p-2`}>
        <div>
          <p className={`text-[1.5rem] font-bold`}>{t("notificationTypes")}</p>
        </div>
        <div className="flex flex-row gap-2">
          {perms.create && <AddNotificationType onSuccess={getTypes} />}
        </div>
      </div>
      <DataTableContainer>
        <DataTable
          value={types}
          loading={loading}
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
          <Column field="name" header={t("name")} />
          <Column field="soundFileName" header={t("soundFileName")} />
          {hasAny && (
            <Column
              body={(data) => {
                return (
                  <div className="flex flex-row gap-2">
                    {perms.update && (
                      <AddNotificationType
                        defaultValue={data}
                        onSuccess={getTypes}
                      />
                    )}
                    {perms.delete && (
                      <DeleteConfirm
                        onConfirm={() => {
                          handleDelete(data.id);
                        }}
                      />
                    )}
                  </div>
                );
              }}
            />
          )}
        </DataTable>
      </DataTableContainer>
    </div>
  );
};

export default NotificationTypes;
