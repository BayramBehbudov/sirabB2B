import DataTableContainer, {
  tableStaticProps,
} from "@/components/ui/TableContainer";
import { Column } from "primereact/column";
import { useEffect, useState } from "react";
import AddUser from "./components/AddUser";
import { showToast } from "@/providers/ToastProvider";
import { SwitchConfirm } from "@/components/ui/dialogs/SwitchConfirm";
import { useTranslation } from "react-i18next";
import { DataTable } from "primereact/datatable";
import { GetAllSystemUsers, SetSystemUserStatus } from "@/api/Auth";
import EditUserPassword from "./components/EditUserPassword";
import SetClaimGroupToUser from "./components/SetClaimGroupToUser";
import { useNavigate } from "react-router-dom";
import usePermissions from "@/hooks/usePermissions";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const [page, setPage] = useState({
    pageNumber: 1,
    pageSize: 10,
  });

  const navigate = useNavigate();
  const perms = usePermissions({
    show: "AUTH: SYSTEM_USER_LIST",
    create: "AUTH: CREATE_USER",
    update: "AUTH: UPDATE_USER",
    permUpdate: "AUTH: SET_USER_PERMISSION",
    passUpdate: "AUTH: RESET_PASSWORD",
    status: "AUTH: SET_SYSTEM_USER_STATUS",
  });

  const isAllowed = perms.isAllowed("show");
  const hasAny = perms.hasAny(["permUpdate", "passUpdate", "status", "update"]);

  const getUsers = async () => {
    try {
      setLoading(true);
      const res = await GetAllSystemUsers(page);
      setUsers(res.systemUsers);
      setTotal(res.pageInfo.totalItems);
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

  const handleSetStatus = async (id, status) => {
    try {
      setLoading(true);
      const res = await SetSystemUserStatus({
        id,
        isActive: status,
      });
      showToast({
        severity: "success",
        summary: t("success"),
        detail: res?.message || "",
      });
      getUsers();
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
    getUsers();
  }, [page, isAllowed, perms.ready]);

  if (!isAllowed || !perms.ready) return null;
  return (
    <div className="flex flex-col gap-5">
      <div className={`flex items-center justify-between`}>
        <div>
          <p className={`text-[1.5rem] font-bold`}>{t("users")}</p>
        </div>
        <div className="flex flex-row gap-2">
          {perms.create && (
            <AddUser
              onSuccess={getUsers}
              disabled={!perms.create}
              statusDisabled={!perms.status}
            />
          )}
        </div>
      </div>
      <DataTableContainer>
        <DataTable
          loading={loading}
          value={users}
          {...tableStaticProps}
          totalRecords={total}
          first={page.pageNumber * page.pageSize - page.pageSize}
          onPage={(e) => {
            const newPage = {
              pageNumber: e.page + 1,
              pageSize: e.rows,
            };
            setPage(newPage);
          }}
          rows={page.pageSize}
        >
          <Column
            field=""
            header={"№"}
            body={(_, rowData) => {
              return <p>{rowData.rowIndex + 1}</p>;
            }}
          />
          {["phoneNumber", "userName"].map((f) => {
            return <Column field={f} header={t(f)} />;
          })}
          {hasAny && (
            <Column
              header={"#"}
              alignHeader="center"
              body={(data) => {
                const { isActive, id, userName } = data;
                return (
                  <div className="flex flex-row gap-3 items-center justify-center">
                    {perms.update && (
                      <AddUser
                        user={data}
                        onSuccess={getUsers}
                        disabled={!perms.update}
                        statusDisabled={!perms.status}
                      />
                    )}
                    {perms.permUpdate && <SetClaimGroupToUser userId={id} />}
                    {perms.passUpdate && (
                      <EditUserPassword user={data} onSuccess={getUsers} />
                    )}
                    {perms.status && (
                      <SwitchConfirm
                        checked={isActive}
                        onAccept={() => {
                          handleSetStatus(id, !isActive);
                        }}
                        tooltip={t("activePassive")}
                        text={
                          !isActive
                            ? t("confirmActiveUser", { userName })
                            : t("confirmDeactiveUser", { userName })
                        }
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

export default Users;
