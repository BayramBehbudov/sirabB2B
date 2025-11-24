import DataTableContainer, {
  tableStaticProps,
} from "@/components/ui/TableContainer";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import EditPassword from "./components/EditPassword";
import {
  confirmB2BCustomerProfile,
  getB2BCustomers,
  setB2BCustomerStatus,
} from "@/api/B2BCustomer";
import { SwitchConfirm } from "@/components/ui/dialogs/SwitchConfirm";
import { showToast } from "@/providers/ToastProvider";
import AddCustomer from "./components/AddCustomer";
import usePermissions from "@/hooks/usePermissions";
import { useNavigate } from "react-router-dom";

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [page, setPage] = useState({
    pageNumber: 1,
    pageSize: 10,
  });

  const { t } = useTranslation();

  const navigate = useNavigate();
  const perms = usePermissions({
    show: "B2BMüştərilər: Müştərilər listi",
    create: "B2BMüştərilər: B2BMüştəri yaratma",
    passUpdate: "B2BMüştərilər: B2BMüştəri şifrə yeniləmə",
    update: "B2BMüştərilər: Admin B2BMüştəri məlumatlarını yeniləmə",
    confirm:
      "B2BMüştərilər: Sirab tərəfindən B2BMüştəri məlumatlarını təsdiqləmə",
    status: "B2BMüştərilər: Müştəri aktiv/deaktiv etmə",
  });

  const isAllowed = perms.isAllowed("show");
  const hasAny = perms.hasAny(["update", "passUpdate", "confirm", "status"]);

  const getCustomers = async () => {
    try {
      setLoading(true);
      const res = await getB2BCustomers(page);
      setCustomers(res.b2BCustomers);
      setTotalRecords(res.pageInfo.totalItems);
    } catch (error) {
      console.log("error at getCustomers", error);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileConfirm = async (id, status) => {
    try {
      setLoading(true);
      const res = await confirmB2BCustomerProfile({
        b2BCustomerId: id,
        isConfirmed: status,
      });
      showToast({
        severity: "success",
        summary: t("success"),
        detail: res?.message || "",
      });
      getCustomers();
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
      const res = await setB2BCustomerStatus({
        id,
        isActive: status,
      });
      showToast({
        severity: "success",
        summary: t("success"),
        detail: res?.message || "",
      });
      getCustomers();
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
    getCustomers();
  }, [page, isAllowed, perms.ready]);

  if (!isAllowed || !perms.ready) return null;
  return (
    <div className="flex flex-col gap-5">
      <div className={`flex items-center justify-between p-2`}>
        <div>
          <p className={`text-[1.5rem] font-bold`}>{t("customers")}</p>
        </div>
        <div className="flex flex-row gap-2">
          {perms.create && (
            <AddCustomer onSuccess={getCustomers} disabled={!perms.create} />
          )}
        </div>
      </div>
      <DataTableContainer>
        <DataTable
          loading={loading}
          value={customers}
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
          {[
            "companyName",
            "contactPersonFirstName",
            "contactPersonLastName",
            "customerGroupId",
            "email",
            "erpId",
            "phoneNumber",
            "taxId",
          ].map((f) => {
            return <Column field={f} header={t(f)} />;
          })}
          {hasAny && (
            <Column
              header={"#"}
              alignHeader="center"
              body={(data) => {
                const {
                  b2BCustomerId,
                  isConfirmedByOperator,
                  isActive,
                  contactPersonFirstName,
                  contactPersonLastName,
                } = data;
                const userName =
                  contactPersonFirstName + " " + contactPersonLastName;
                return (
                  <div className="flex flex-row gap-3 items-center justify-center">
                    {perms.update && (
                      <AddCustomer
                        onSuccess={getCustomers}
                        user={data}
                        disabled={!perms.update}
                      />
                    )}
                    {perms.passUpdate && (
                      <EditPassword
                        user={data}
                        onSuccess={getCustomers}
                        disabled={!perms.passUpdate}
                      />
                    )}
                    {perms.confirm && (
                      <SwitchConfirm
                        checked={isConfirmedByOperator}
                        onAccept={() => {
                          handleProfileConfirm(
                            b2BCustomerId,
                            !isConfirmedByOperator
                          );
                        }}
                        disabled={!perms.confirm}
                      />
                    )}
                    {perms.status && (
                      <SwitchConfirm
                        checked={isActive}
                        onAccept={() => {
                          handleSetStatus(b2BCustomerId, !isActive);
                        }}
                        tooltip={t("activePassive")}
                        text={
                          !isActive
                            ? t("confirmActiveUser", { userName })
                            : t("confirmDeactiveUser", { userName })
                        }
                        disabled={!perms.status}
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

export default Customers;
