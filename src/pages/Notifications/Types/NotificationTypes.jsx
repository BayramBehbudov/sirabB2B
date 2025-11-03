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

const NotificationTypes = () => {
  const { t } = useTranslation();
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const getTypes = async () => {
    try {
      setLoading(true);
      const res = await GetNotificationTypes();
      setTypes(res.data);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getTypes();
  }, []);
  
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

  // qeyd iconFilePath göstərmirik
  console.log(types)
  return (
    <div className="flex flex-col gap-5">
      <div className={`flex items-center justify-between p-2`}>
        <div>
          <p className={`text-[1.5rem] font-bold`}>{t("notificationTypes")}</p>
        </div>
        <div className="flex flex-row gap-2">
          <AddNotificationType onSuccess={getTypes} />
        </div>
      </div>
      <DataTableContainer>
        <DataTable
          value={types}
          loading={loading}
          {...tableStaticProps}
          lazy={false}
          rows={10}
        >
          <Column field="name" header={t("name")} />
          <Column field="soundFileName" header={t("soundFileName")} />
          <Column
            body={(data) => {
              return (
                <div className="flex flex-row gap-2">
                  <AddNotificationType
                    defaultValue={data}
                    onSuccess={getTypes}
                  />
                  <DeleteConfirm
                    onConfirm={() => {
                      handleDelete(data.id);
                    }}
                  />
                </div>
              );
            }}
          />
        </DataTable>
      </DataTableContainer>
    </div>
  );
};

export default NotificationTypes;
