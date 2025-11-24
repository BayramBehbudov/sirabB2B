import { useTranslation } from "react-i18next";
import AddUserGroup from "./components/AddUserGroup";
import DataTableContainer, {
  tableStaticProps,
} from "@/components/ui/TableContainer";
import { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import {
  deleteCustomerGroup,
  getAllCustomerGroup,
} from "@/api/B2BCustomerGroup";
import DeleteConfirm from "@/components/ui/dialogs/DeleteConfirm";
import { showToast } from "@/providers/ToastProvider";
import usePermissions from "@/hooks/usePermissions";
import { useNavigate } from "react-router-dom";

const UserGroups = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [groups, setGroups] = useState([]);

  const navigate = useNavigate();
  const perms = usePermissions({
    show: "B2BCustomerGroup: Müştəri qrupu siyahısı",
    create: "B2BCustomerGroup: Müştəri qrupu yaratmaq",
    update: "B2BCustomerGroup: Müştəri qrupu düzəliş etmək",
    delete: "B2BCustomerGroup: Müştəri qrupu silmək",
  });

  const isAllowed = perms.isAllowed("show");
  const hasAny = perms.hasAny(["update", "delete"]);

  const getGroups = async () => {
    try {
      setLoading(true);
      const response = await getAllCustomerGroup();
      if (response.length) {
        setGroups(response);
      }
    } catch (error) {
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  // console.log(perms);
  useEffect(() => {
    if (!perms.ready) return;
    if (!isAllowed) return navigate("/not-allowed", { replace: true });
    getGroups();
  }, [isAllowed, perms.ready]);

  if (!isAllowed || !perms.ready) return null;

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      const res = await deleteCustomerGroup(id);
      if (res.success) {
        showToast({
          severity: "success",
          summary: t("success"),
          detail: t("dataDeletedSuccess"),
        });
        getGroups();
      }
    } catch (error) {
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex flex-col gap-5">
      <div className={`flex items-center justify-between p-2`}>
        <div>
          <p className={`text-2xl font-semibold`}>{t("groups")}</p>
        </div>
        <div className="flex flex-row gap-2">
          {perms.create && <AddUserGroup onSuccess={getGroups} />}
        </div>
      </div>
      <DataTableContainer>
        <DataTable
          loading={loading}
          value={groups}
          {...tableStaticProps}
          rows={10}
          lazy={false}
        >
          <Column
            field=""
            header={"№"}
            body={(_, rowData) => {
              return <p>{rowData.rowIndex + 1}</p>;
            }}
          />
          {["name"].map((f) => {
            return <Column field={f} header={t(f)} />;
          })}
          {hasAny && (
            <Column
              exportable={false}
              header={"#"}
              alignHeader="center"
              body={(row) => {
                return (
                  <div className="flex flex-row gap-2 justify-center">
                    {perms.update && (
                      <AddUserGroup group={row} onSuccess={getGroups} />
                    )}
                    {perms.delete && (
                      <DeleteConfirm onConfirm={() => handleDelete(row.id)} />
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

export default UserGroups;
