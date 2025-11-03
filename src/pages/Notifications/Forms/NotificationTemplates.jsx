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

const NotificationTemplates = () => {
  const { t } = useTranslation();
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(false);
  const getTemplates = async () => {
    setLoading(true);
    try {
      const response = await GetNotificationTemplates();
      setTemplates(response);
    } catch (error) {
      console.log("error at get notificattion templates", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getTemplates();
  }, []);

  const handleDelete = async (id) => {
    try {
      // qeyd succes gəlir amma silmir
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

  return (
    <div className="flex flex-col gap-5">
      <div className={`flex items-center justify-between p-2`}>
        <div>
          <p className={`text-[1.5rem] font-bold`}>
            {t("notificationTemplates")}
          </p>
        </div>
        <div className="flex flex-row gap-2">
          <AddNotificationTemplate onSuccess={getTemplates} />
        </div>
      </div>
      <DataTableContainer>
        <DataTable
          value={templates}
          loading={loading}
          {...tableStaticProps}
          lazy={false}
          rows={10}
        >
          {/* <Column field="id" header={t("id")} /> */}
          <Column field="titleTemplate" header={t("title")} />
          <Column field="bodyTemplate" header={t("body")} />
          <Column
            body={(data) => {
              return (
                <div className="flex flex-row gap-2">
                  <AddNotificationTemplate
                    defaultValue={data}
                    onSuccess={getTemplates}
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

export default NotificationTemplates;
