import { GetAllInventoryAnswers, UpdateInventoryAnswer } from "@/api/Inventory";
import ConfirmationDialog from "@/components/ui/dialogs/ConfirmationDialog";
import RejectConfirmWithReason from "@/components/ui/dialogs/RejectConfirmWithReason";
import { PhotosViewerDialog } from "@/components/ui/file/PhotosViewerDialog";
import DataTableContainer, {
  tableStaticProps,
} from "@/components/ui/TableContainer";
import TableHeader from "@/components/ui/TableHeader";
import { formatDate } from "@/helper/DateFormatter";
import usePermissions from "@/hooks/usePermissions";
import { showToast } from "@/providers/ToastProvider";
import { inventoryAssignmentStatus } from "@/static/static-data";
import { Badge } from "primereact/badge";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Tooltip } from "primereact/tooltip";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const InventoryCheckAssignment = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [inventoryAssignments, setInventoryAssignments] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [filter, setFilter] = useState({
    pageNumber: 1,
    pageSize: 10,
    order: "",
    orderColumn: "",
    searchList: [],
  });

  const navigate = useNavigate();
  const perms = usePermissions({
    show: "INVENTORY: INVENTORY_CUSTOMER_ANSWER_LIST",
    update: "INVENTORY: UPDATE_INVENTORY_ANSWER",
  });
  const isAllowed = perms.isAllowed("show");
  const isUpdateAllowed = perms.isAllowed("update");

  const getInventory = async (payload = filter) => {
    try {
      setLoading(true);
      const res = await GetAllInventoryAnswers(payload);
      setInventoryAssignments(res.inventoryCustomerAnswers);
      setTotalRecords(res.pageInfo.totalItems);
    } catch (error) {
      console.log("error at getInventory", error);
    } finally {
      setLoading(false);
    }
  };
  const updateInventory = async ({ id, isConfirmed, rejectNote }) => {
    try {
      setLoading(true);
      const res = await UpdateInventoryAnswer({
        id,
        isConfirmed,
        rejectNote,
      });
      showToast({
        severity: "success",
        summary: t("success"),
        detail: res?.message || "",
      });
      getInventory();
    } catch (error) {
      console.log("error at update inventory", error);
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
    getInventory();
  }, [isAllowed, perms.ready]);

  if (!isAllowed || !perms.ready) return null;
  return (
    <div className="flex flex-col gap-5">
      <div className={`flex items-center justify-between`}>
        <div>
          <p className={`text-[1.5rem] font-bold`}>
            {t("inventoryCheckAssignment")}
          </p>
        </div>
        <div className="flex flex-row gap-2"></div>
      </div>
      <DataTableContainer>
        <DataTable
          value={inventoryAssignments}
          loading={loading}
          {...tableStaticProps}
          first={filter.pageNumber * filter.pageSize - filter.pageSize}
          totalRecords={totalRecords}
          scrollable
          rows={filter.pageSize}
          onPage={(e) => {
            const newPage = {
              pageNumber: e.page + 1,
              pageSize: e.rows,
            };
            setFilter((p) => {
              const newFilter = { ...p, ...newPage };
              getInventory(newFilter);
              return newFilter;
            });
          }}
        >
          {[
            {
              label: "companyName",
              field: "b2BCustomerCompanyName",
              type: "text",
              options: [],
            },
            {
              label: "phoneNumber",
              field: "b2BCustomerPhoneNumber",
              type: "text",
              options: [],
            },
            {
              label: "email",
              field: "b2BCustomerEmail",
              type: "text",
              options: [],
            },
            {
              label: "erpCode",
              field: "inventoryCheckRequirementErpCode",
              type: "text",
              options: [],
            },
            {
              label: "serialCode",
              field: "inventoryCheckRequirementSerialCode",
              type: "text",
              options: [],
            },
            {
              label: "description",
              field: "inventoryCheckRequirementDescription",
              type: "text",
              options: [],
            },
            {
              label: "confirmStatus",
              field: "isConfirmed",
              type: "dropdown",
              options: [
                {
                  label: t("confirmed"),
                  value: "true",
                },
                {
                  label: t("notConfirmed"),
                  value: "false",
                },
              ],
            },
            {
              label: "rejectReason",
              field: "rejectNote",
              type: "text",
              options: [],
            },
            {
              label: "completedAt",
              field: "completedAt",
              type: "date",
              options: [],
            },
            {
              label: "process",
              field: "processStatus",
              type: "dropdown",
              options: Object.keys(inventoryAssignmentStatus).map((k) => ({
                label: t(inventoryAssignmentStatus[k]),
                value: k,
              })),
            },
          ].map((c) => (
            <Column
              field={c.field}
              body={
                c.field === "processStatus"
                  ? (row) => {
                      const value = row[c.field];
                      return t(inventoryAssignmentStatus[value]);
                    }
                  : c.field === "isConfirmed"
                    ? (row) => {
                        const value = row[c.field];
                        return (
                          <Badge
                            value={t(value ? "confirmed" : "notConfirmed")}
                            severity={value ? "success" : "danger"}
                          />
                        );
                      }
                    : c.field === "completedAt"
                      ? (row) => {
                          const value = row[c.field];
                          return value ? formatDate(value) : "";
                        }
                      : undefined
              }
              header={() => {
                return (
                  <TableHeader
                    type={c.type}
                    handleSearch={getInventory}
                    dropdownOptions={c.options}
                    onChange={(v) => {
                      setFilter((prev) => {
                        const newFilter = { ...prev };
                        newFilter.searchList = newFilter.searchList.filter(
                          (item) => item.colName !== c.field,
                        );
                        if (v) {
                          newFilter.searchList.push({
                            colName: c.field,
                            value: v,
                          });
                        }
                        return newFilter;
                      });
                    }}
                    label={t(c.label)}
                    placeholder={t("search")}
                    value={
                      filter.searchList.find((item) => item.colName === c.field)
                        ?.value
                    }
                    sort={filter.orderColumn === c.field ? filter.order : ""}
                    handleSort={(s) => {
                      setFilter((prev) => {
                        const newFilter = { ...prev };
                        newFilter.orderColumn = c.field;
                        newFilter.order = s;
                        getInventory(newFilter);
                        return newFilter;
                      });
                    }}
                  />
                );
              }}
            />
          ))}
          <Column
            frozen
            alignFrozen="right"
            header="#"
            alignHeader="center"
            body={(data) => {
              const disabled = data.processStatus === 3;
              return (
                <div className="flex flex-row gap-2">
                  <PhotosViewerDialog images={data.inventoryPhotos} />
                  {isUpdateAllowed && (
                    <div
                      className="flex flex-row gap-2 buttons-container"
                      data-pr-tooltip={
                        disabled ? t("documentConfirmed") : undefined
                      }
                      data-pr-position="top"
                    >
                      <ConfirmationDialog
                        onConfirm={() => {
                          updateInventory({
                            id: data.id,
                            isConfirmed: true,
                            rejectNote: "",
                          });
                        }}
                        disabled={disabled}
                      />
                      <RejectConfirmWithReason
                        disabled={disabled}
                        onConfirm={(reason) => {
                          if (!reason) return;
                          updateInventory({
                            id: data.id,
                            isConfirmed: false,
                            rejectNote: reason,
                          });
                        }}
                      />
                      <Tooltip target=".buttons-container" />
                    </div>
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

export default InventoryCheckAssignment;
