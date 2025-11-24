import { useTranslation } from "react-i18next";
import AddNotification from "./components/AddNotification";
import { useEffect, useState } from "react";
import { GetAllNotifications } from "@/api/Notification";
import DataTableContainer, {
  tableStaticProps,
} from "@/components/ui/TableContainer";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { formatDate } from "@/helper/DateFormatter";
import CustomersViewDialog from "../Customers/components/CustomersViewDialog";

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
  // qeyd bu səhifə permissionları yazılmayıb
//  bildirişin şəkilləri göstərmirik
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

  useEffect(() => {
    getNotifications();
  }, [page]);

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
                  <CustomersViewDialog customers={data.recipients} />
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
