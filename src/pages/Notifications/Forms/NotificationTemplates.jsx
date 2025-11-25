import { useTranslation } from "react-i18next";
import AddNotificationTemplate from "./AddNotificationTemplate";
import {
  DeleteNotificationTemplates,
  GetNotificationTemplates,
} from "@/api/Notification";
import { useEffect, useState } from "react";
import DataTableContainer, {
  tableStaticProps,
} from "@/components/ui/TableContainer";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import DeleteConfirm from "@/components/ui/dialogs/DeleteConfirm";
import { showToast } from "@/providers/ToastProvider";
import usePermissions from "@/hooks/usePermissions";

const NotificationTemplates = () => {
  const { t } = useTranslation();
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState({
    pageNumber: 1,
    pageSize: 10,
  });
  const [totalRecords, setTotalRecords] = useState(0);

  const perms = usePermissions({
    show: "Bildiriş şablonu: Bildiriş şablonlarını görmək",
    create: "Bildiriş şablonu: Bildiriş şablonu yaratmaq",
    update: "Bildiriş şablonu: Bildiriş şablonu yeniləmək",
    delete: "Bildiriş şablonu: Bildiriş şablonu silmək",
  });

  const isAllowed = perms.isAllowed("show");
  const hasAny = perms.hasAny(["update", "delete"]);

  const getTemplates = async () => {
    setLoading(true);
    try {
      const response = await GetNotificationTemplates(page);
      setTemplates(response.notificationTemplates);
      setTotalRecords(response.pageInfo.totalItems);
    } catch (error) {
      console.log("error at get notificattion templates", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (!perms.ready) return;
    if (!isAllowed) return navigate("/not-allowed", { replace: true });
    getTemplates();
  }, [page, isAllowed, perms.ready]);

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      await DeleteNotificationTemplates(id);
      getTemplates();
      showToast({
        severity: "success",
        summary: t("success"),
        detail: t("dataDeletedSuccess"),
      });
    } catch (error) {
      console.log("error at delete notification template", error);
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
          <p className={`text-[1.5rem] font-bold`}>
            {t("notificationTemplates")}
          </p>
        </div>
        <div className="flex flex-row gap-2">
          {perms.create && <AddNotificationTemplate onSuccess={getTemplates} />}
        </div>
      </div>
      <DataTableContainer>
        <DataTable
          value={templates}
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
          {/* <Column field="id" header={t("id")} /> */}
          <Column field="titleTemplate" header={t("title")} />
          <Column field="bodyTemplate" header={t("body")} />
          {hasAny && (
            <Column
              body={(data) => {
                return (
                  <div className="flex flex-row gap-2">
                    {perms.update && (
                      <AddNotificationTemplate
                        defaultValue={data}
                        onSuccess={getTemplates}
                      />
                    )}
                    {perms.delete && (
                      <DeleteConfirm
                        onConfirm={() => {
                          handleDelete(data.id);
                        }}
                      />
                    )}{" "}
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

export default NotificationTemplates;
