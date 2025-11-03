import {
  GetPermissionsByGroupId,
  SetPermissionSelected,
} from "@/api/ClaimGroups";
import ColumnHeaderWithSearch from "@/components/ui/ColumnHeaderWithSearch";
import { SwitchConfirm } from "@/components/ui/dialogs/SwitchConfirm";
import { tableStaticProps } from "@/components/ui/TableContainer";
import { showToast } from "@/providers/ToastProvider";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const PermissionsSelector = ({ claimGroup }) => {
  const [loading, setLoading] = useState(false);
  const [permissions, setPermissions] = useState([]);
  const [filteredPermissions, setFilteredPermissions] = useState([]);
  const [visible, setVisible] = useState(false);
  const [page, setPage] = useState({
    pageNumber: 1,
    pageSize: 10,
  });
  const [totalRecords, setTotalRecords] = useState(0);
  const { t } = useTranslation();

  const getPermissions = async () => {
    if (!claimGroup.id) return;
    try {
      setLoading(true);
      const res = await GetPermissionsByGroupId(
        claimGroup.id,
        page.pageNumber,
        page.pageSize
      );
      setPermissions(res.groupPermissionViewModel.permissions);
      setFilteredPermissions(res.groupPermissionViewModel.permissions);
      setTotalRecords(res.pageInfo.totalItems);
    } catch (error) {
      console.log("error at getPermissions", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSetPermission = async (permission) => {
    if (!claimGroup.id) return;
    const formattedValue = {
      claimGroupId: claimGroup.id,
      principalName: permission.item1,
      selected: !permission.item2,
    };
    try {
      setLoading(true);
      const res = await SetPermissionSelected(formattedValue);
      showToast({
        detail: res.message,
        severity: res.type,
        life: 4000,
      });
      getPermissions();
    } catch (error) {
      showToast({
        detail: error?.response?.data?.message || t("unexpectedError"),
        severity: error?.response?.data?.type || "error",
        life: 4000,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!visible) return;
    getPermissions();
  }, [page, visible]);

  const onClose = () => {
    setVisible(false);
  };

  return (
    <div>
      <Button
        tooltip={t("controlPermissions")}
        tooltipOptions={{ position: "top" }}
        icon={`pi pi-unlock`}
        onClick={() => setVisible(true)}
      />
      <Dialog
        header={t("controlPermissionForGroup", { name: claimGroup.name })}
        visible={visible}
        className={`max-w-[90%] min-w-[700px]`}
        onHide={onClose}
      >
        <DataTable
          loading={loading}
          value={filteredPermissions}
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
            body={(_, rowData) => {
              return <p>{rowData.rowIndex + 1}</p>;
            }}
          />
          {[{ field: "item1", label: "description" }].map((f) => {
            return (
              <Column
                field={f.field}
                header={
                  <ColumnHeaderWithSearch
                    label={t(f.label)}
                    onChange={(v) => {
                      if (!permissions.length) return;
                      const filtered = permissions.filter((p) => {
                        const value = v.toString().trim().toLowerCase();
                        if (!value) return true;
                        return p.item1.toLowerCase().includes(value);
                      });
                      setFilteredPermissions(filtered);
                    }}
                    className="flex-row items-center gap-4"
                  />
                }
              />
            );
          })}
          <Column
            field="item2"
            body={(data) => {
              const checked = data.item2;
              return (
                <div>
                  <SwitchConfirm
                    checked={checked}
                    text={
                      checked
                        ? t("removePermissionFromGroup", {
                            name: claimGroup.name,
                          })
                        : t("addPermissionToGroup", { name: claimGroup.name })
                    }
                    tooltip={
                      checked ? t("removePermission") : t("addPermission")
                    }
                    disabled={loading}
                    onAccept={() => {
                      handleSetPermission(data);
                    }}
                  />
                </div>
              );
            }}
          />
        </DataTable>
      </Dialog>
    </div>
  );
};

export default PermissionsSelector;
