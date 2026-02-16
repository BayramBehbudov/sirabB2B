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
import CustomersViewDialog from "../Customers/components/CustomersViewDialog";
import { useNavigate } from "react-router-dom";
import usePermissions from "@/hooks/usePermissions";
import { PhotosViewerDialog } from "@/components/ui/file/PhotosViewerDialog";
import DeleteConfirm from "@/components/ui/dialogs/DeleteConfirm";
import { showToast } from "@/providers/ToastProvider";

const notificationStatuses = {
  0: "Pending",
  1: "Sent",
  2: "Failed",
};

const Notifications = () => {
  const { t } = useTranslation();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState({
    pageNumber: 1,
    pageSize: 10,
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

  const getNotifications = async () => {
    try {
      setLoading(true);
      const res = await GetAllNotifications(page);
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
  }, [page, isAllowed, perms.ready]);

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
          <Column
            field=""
            header={"№"}
            body={(_, rowData) => rowData.rowIndex + 1}
          />
          {["personalizedMessage"].map((i) => {
            return <Column field={i} header={t(i)} />;
          })}
          <Column
            field="sendDate"
            header={t("sendDate")}
            body={(data) => {
              return <p>{formatDate(data.sendDate)}</p>;
            }}
          />
          <Column
            field="status"
            header={t("status")}
            body={(data) => {
              return <p>{t(notificationStatuses[data.status])}</p>;
            }}
          />
          <Column
            header={"#"}
            body={(data) => {
              return (
                <div className="flex flex-row gap-2">
                  <PhotosViewerDialog images={data.images} />
                  <CustomersViewDialog customers={data.recipients} />
                  {perms.update && (
                    <AddNotification
                      onSuccess={getNotifications}
                      disabled={!perms.update}
                      notification={data}
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
        </DataTable>
      </DataTableContainer>
    </div>
  );
};

export default Notifications;
