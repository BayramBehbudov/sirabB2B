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
import TableHeader from "@/components/ui/TableHeader";
import { Image } from "primereact/image";

const NotificationTypes = () => {
  const { t } = useTranslation();
  const [types, setTypes] = useState([]);
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
    show: "NOTIFICATION_TYPE: NOTIFICATION_TYPE_LIST",
    create: "NOTIFICATION_TYPE: CREATE_NOTIFICATION_TYPE",
    update: "NOTIFICATION_TYPE: UPDATE_NOTIFICATION_TYPE",
    delete: "NOTIFICATION_TYPE: DELETE_NOTIFICATION_TYPE",
  });

  const isAllowed = perms.isAllowed("show");
  const hasAny = perms.hasAny(["update", "delete"]);

  const getTypes = async (payload = filter) => {
    try {
      setLoading(true);
      const res = await GetNotificationTypes(payload);
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
  }, [isAllowed, perms.ready]);

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
      <div className={`flex items-center justify-between`}>
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
              getTypes(newFilter);
              return newFilter;
            });
          }}
        >
          {[
            { field: "name", label: "name" },
            { field: "soundFileName", label: "soundFileName" },
          ].map(({ field, label }) => {
            return (
              <Column
                field={field}
                header={() => {
                  return (
                    <TableHeader
                      type={"text"}
                      handleSearch={getTypes}
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
                          getTypes(newFilter);
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
            headerClassName="align-top "
            alignHeader={"center"}
            header={t("icon")}
            bodyClassName={"flex items-center justify-center"}
            body={(data) => {
              return (
                <Image
                  alt={data?.iconFileName || ""}
                  src={data?.iconFilePath || ""}
                  preview
                  className="w-[30px] h-[30px]"
                  imageClassName="w-[30px] h-[30px] object-contain"
                />
              );
            }}
          />
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
