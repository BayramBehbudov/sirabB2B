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
import TableHeader from "@/components/ui/TableHeader";

const NotificationTemplates = () => {
  const { t } = useTranslation();
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState({
    pageNumber: 1,
    pageSize: 10,
    order: "",
    orderColumn: "",
    searchList: [],
  });
  const [totalRecords, setTotalRecords] = useState(0);

  const perms = usePermissions({
    show: "NOTIFICATION_TEMPLATE: NOTIFICATION_TEMPLATE_LIST",
    create: "NOTIFICATION_TEMPLATE: CREATE_NOTIFICATION_TEMPLATE",
    update: "NOTIFICATION_TEMPLATE: UPDATE_NOTIFICATION_TEMPLATE",
    delete: "NOTIFICATION_TEMPLATE: DELETE_NOTIFICATION_TEMPLATE",
  });

  const isAllowed = perms.isAllowed("show");
  const hasAny = perms.hasAny(["update", "delete"]);

  const getTemplates = async (payload = filter) => {
    setLoading(true);
    try {
      const response = await GetNotificationTemplates(payload);
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
  }, [isAllowed, perms.ready]);

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
      <div className={`flex items-center justify-between`}>
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
          first={filter.pageNumber * filter.pageSize - filter.pageSize}
          totalRecords={totalRecords}
          rows={filter.pageSize}
          onPage={(e) => {
            const newPage = {
              pageNumber: e.page + 1,
              pageSize: e.rows,
            };
            setFilter((p) => {
              const newFilter = { ...p, ...newPage };
              getTemplates(newFilter);
              return newFilter;
            });
          }}
        >
          {[
            { field: "name", label: "name" },
            { field: "titleTemplate", label: "title" },
            { field: "bodyTemplate", label: "body" },
          ].map(({ field, label }) => {
            return (
              <Column
                field={field}
                header={() => {
                  return (
                    <TableHeader
                      type={"text"}
                      handleSearch={getTemplates}
                      onChange={(v) => {
                        setFilter((prev) => {
                          const newFilter = { ...prev };
                          newFilter.searchList = newFilter.searchList.filter(
                            (item) => item.colName !== field,
                          );
                          if (v) {
                            newFilter.searchList.push({
                              colName: field,
                              value: v,
                            });
                          }
                          return newFilter;
                        });
                      }}
                      label={t(label)}
                      placeholder={t("search")}
                      value={
                        filter.searchList.find((item) => item.colName === field)
                          ?.value
                      }
                      sort={filter.orderColumn === field ? filter.order : ""}
                      handleSort={(s) => {
                        setFilter((prev) => {
                          const newFilter = { ...prev };
                          newFilter.orderColumn = field;
                          newFilter.order = s;
                          getTemplates(newFilter);
                          return newFilter;
                        });
                      }}
                    />
                  );
                }}
              />
            );
          })}
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
