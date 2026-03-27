import { useTranslation } from "react-i18next";
import AddNotification from "./components/AddNotification";
import { useEffect, useState } from "react";
import { DeleteNotification, GetAllNotifications } from "@/api/Notification";
import DataTableContainer, {
  tableStaticProps,
} from "@/components/ui/TableContainer";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { formatDate } from "@/helper/DateFormatter";
import { useNavigate } from "react-router-dom";
import usePermissions from "@/hooks/usePermissions";
import { PhotosViewerDialog } from "@/components/ui/file/PhotosViewerDialog";
import DeleteConfirm from "@/components/ui/dialogs/DeleteConfirm";
import { showToast } from "@/providers/ToastProvider";
import TableHeader from "@/components/ui/TableHeader";

const notificationStatuses = {
  0: "Draft",
  1: "Scheduled",
  2: "Sending",
  3: "Sent",
  4: "Failed",
  5: "PartialFailed",
};

const Notifications = () => {
  const { t } = useTranslation();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState({
    pageNumber: 1,
    pageSize: 10,
    order: "",
    orderColumn: "",
    searchList: [],
  });
  const [totalRecords, setTotalRecords] = useState(0);
  const navigate = useNavigate();

  const perms = usePermissions({
    show: "NOTIFICATION: NOTIFICATION_LIST",
    create: "NOTIFICATION: CREATE_NOTIFICATION",
    update: "NOTIFICATION: UPDATE_NOTIFICATION",
    delete: "NOTIFICATION: DELETE_NOTIFICATION",
  });

  const isAllowed = perms.isAllowed("show");

  const getNotifications = async (payload = filter) => {
    try {
      setLoading(true);
      const res = await GetAllNotifications(payload);
      setNotifications(res.notifications);
      setTotalRecords(res.pageInfo.totalItems);
    } catch (error) {
      console.log("error at getNotifications", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      const res = await DeleteNotification(id);
      await getNotifications();
      showToast({
        severity: "success",
        summary: t("success"),
        detail: res?.message || "",
      });
    } catch (error) {
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
    getNotifications();
  }, [isAllowed, perms.ready]);

  if (!isAllowed || !perms.ready) return null;
  return (
    <div className="flex flex-col gap-5">
      <div className={`flex items-center justify-between`}>
        <div>
          <p className={`text-[1.5rem] font-bold`}>{t("notifications")}</p>
        </div>
        <div className="flex flex-row gap-2">
          {perms.create && <AddNotification onSuccess={getNotifications} />}
        </div>
      </div>
      <DataTableContainer>
        <DataTable
          value={notifications}
          loading={loading}
          {...tableStaticProps}
          first={filter.pageNumber * filter.pageSize - filter.pageSize}
          totalRecords={totalRecords}
          rows={filter.pageSize}
          scrollable
          onPage={(e) => {
            const newPage = {
              pageNumber: e.page + 1,
              pageSize: e.rows,
            };
            setFilter((p) => {
              const newFilter = { ...p, ...newPage };
              getNotifications(newFilter);
              return newFilter;
            });
          }}
        >
          {[
            {
              field: "notificationTypeName",
              label: "notificationType",
              type: "text",
            },
            {
              field: "notificationTemplateName",
              label: "notificationTemplate",
              type: "text",
            },
            {
              field: "b2BCustomerType",
              label: "b2BCustomerType",
              type: "text",
            },
            {
              field: "status",
              label: "status",
              type: "dropdown",
              options: Object.entries(notificationStatuses).map(
                ([key, value]) => ({
                  label: t(value),
                  value: key,
                }),
              ),
            },
            { field: "scheduledAt", label: "scheduledAt", type: "date" },
            { field: "sentAt", label: "sentAt", type: "date" },
            { field: "clSpecode", label: "clSpecode", type: "text" },
            { field: "clSpecode1", label: "clSpecode1", type: "text" },
            { field: "clSpecode2", label: "clSpecode2", type: "text" },
            { field: "clSpecode3", label: "clSpecode3", type: "text" },
            { field: "clSpecode4", label: "clSpecode4", type: "text" },
            { field: "clSpecode5", label: "clSpecode5", type: "text" },
          ].map(({ field, label, type, options }) => {
            return (
              <Column
                field={field}
                body={(data) => {
                  const v = data[field];
                  if (type === "date") return formatDate(v);
                  if (type === "dropdown")
                    return options.find(
                      (item) => item.value.toString() === v.toString(),
                    )?.label;
                  return v;
                }}
                header={() => {
                  return (
                    <TableHeader
                      type={type}
                      handleSearch={getNotifications}
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
                      dropdownOptions={options}
                      sort={filter.orderColumn === field ? filter.order : ""}
                      handleSort={(s) => {
                        setFilter((prev) => {
                          const newFilter = { ...prev };
                          newFilter.orderColumn = field;
                          newFilter.order = s;
                          getNotifications(newFilter);
                          return newFilter;
                        });
                      }}
                    />
                  );
                }}
              />
            );
          })}

          <Column
            frozen
            alignFrozen="right"
            header="#"
            alignHeader="center"
            body={(data) => {
              const disabled = !!data.sentAt;
              return (
                <div className="flex flex-row gap-2 justify-end">
                  {perms.update && !disabled && (
                    <AddNotification
                      onSuccess={getNotifications}
                      disabled={!perms.update}
                      notification={data}
                    />
                  )}
                  {perms.delete && !disabled && (
                    <DeleteConfirm
                      onConfirm={() => {
                        handleDelete(data.id);
                      }}
                    />
                  )}
                  <PhotosViewerDialog images={data.images} />
                </div>
              );
            }}
          />
        </DataTable>
      </DataTableContainer>
    </div>
  );
};

export default Notifications;
