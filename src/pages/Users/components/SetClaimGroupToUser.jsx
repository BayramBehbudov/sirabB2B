import { GetClaimGroupsByUserId, SetUserPermission } from "@/api/Auth";
import { SwitchConfirm } from "@/components/ui/dialogs/SwitchConfirm";
import { tableStaticProps } from "@/components/ui/TableContainer";
import { showToast } from "@/providers/ToastProvider";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const SetClaimGroupToUser = ({ userId }) => {
  const [loading, setLoading] = useState(false);
  const [groups, setGroups] = useState([]);
  const [visible, setVisible] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [page, setPage] = useState({
    pageNumber: 1,
    pageSize: 10,
  });
  const { t } = useTranslation();

  const getGroups = async () => {
    try {
      setLoading(true);
      const res = await GetClaimGroupsByUserId(userId, page);
      setTotalRecords(res.pageInfo.totalItems);
      setGroups(res?.systemUserClaimGroupGetUser?.claimGroups || []);
    } catch (error) {
      console.log("error at getGroups for setClaimGroupToUser", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // lazımsız yerə serverə sorğu getməsin deyə yalnız dialog açıq ikən sorğu atıram
    if (!userId || !visible) return;
    getGroups();
  }, [userId, visible, page]);

  const handleSetPermission = async (group) => {
    if (!userId) return;
    const value = {
      claimGroupId: group.claimGroupId,
      systemUserId: userId,
      selected: !group.isAssigned,
    };
    try {
      setLoading(true);
      const res = await SetUserPermission(value);
      showToast({
        severity: res?.data?.type || "success",
        summary: t("success"),
        detail: res?.data?.message || "",
      });
      await getGroups();
    } catch (error) {
      console.log(
        "error at handleSetPermission for setClaimGroupToUser",
        error
      );
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
    <div>
      <Button
        icon="pi pi-link"
        onClick={() => setVisible(true)}
        tooltip={t("messages.setClaimGroup")}
        tooltipOptions={{ position: "top" }}
      />
      <Dialog
        visible={visible}
        onHide={() => setVisible(false)}
        header={t("setClaimGroupToUser")}
        className="min-w-[80%]"
      >
        <div>
          <DataTable
            value={groups}
            loading={loading}
            {...tableStaticProps}
            totalRecords={totalRecords}
            rows={page.pageSize}
            first={page.pageNumber * page.pageSize - page.pageSize}
            onPage={(e) => {
              const newPage = {
                pageNumber: e.page + 1,
                pageSize: e.rows,
              };
              setPage(newPage);
            }}
          >
            <Column field="name" header={t("groupName")} />
            <Column
              header={t("status")}
              body={(data) => {
                const checked = data.isAssigned;
                return (
                  <div>
                    <SwitchConfirm
                      checked={checked}
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
        </div>
      </Dialog>
    </div>
  );
};

export default SetClaimGroupToUser;
