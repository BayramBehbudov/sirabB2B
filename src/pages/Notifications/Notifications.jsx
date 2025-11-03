import { useTranslation } from "react-i18next";
import AddNotification from "./components/AddNotification";
import { useEffect, useState } from "react";
import { GetNotifications } from "@/api/Notification";
import DataTableContainer, {
  tableStaticProps,
} from "@/components/ui/TableContainer";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { formatDate } from "@/helper/DateFormatter";

const notificationStatuses = {
  0: "Pending",
  1: "Sent",
  2: "Failed",
};

const Notifications = () => {
  const { t } = useTranslation();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  const getNotifications = async () => {
    try {
      setLoading(true);
      const res = await GetNotifications();
      setNotifications(res.data);
    } catch (error) {
      console.log("error at getNotifications", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getNotifications();
  }, []);
  return (
    <div className="flex flex-col gap-5">
      <div className={`flex items-center justify-between p-2`}>
        <div>
          <p className={`text-[1.5rem] font-bold`}>{t("notifications")}</p>
        </div>
        <div className="flex flex-row gap-2">
          <AddNotification onSuccess={getNotifications} />
        </div>
      </div>
      <DataTableContainer>
        <DataTable
          value={notifications}
          loading={loading}
          {...tableStaticProps}
          lazy={false}
          rows={10}
        >
          {/* <Column field="id" header={t("id")} /> */}
          <Column
            field="notificationTemplateId"
            header={t("notificationTemplate")}
          />
          <Column field="notificationTypeId" header={t("notificationType")} />
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
          {/* <Column
            body={(data) => {
              return (
                <div className="flex flex-row gap-2">
                  
                  <DeleteConfirm
                    onConfirm={() => {
                      handleDelete(data.id);
                    }}
                  />
                </div>
              );
            }}
          /> */}
        </DataTable>
      </DataTableContainer>
    </div>
  );
};

export default Notifications;
