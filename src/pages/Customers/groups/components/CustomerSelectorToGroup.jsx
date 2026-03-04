import {
  GetB2BCustomerByGroupId,
  SetB2BCustomerToGroup,
} from "@/api/B2BCustomerGroup";
import DataTableContainer, {
  tableStaticProps,
} from "@/components/ui/TableContainer";
import TableHeader from "@/components/ui/TableHeader";
import usePermissions from "@/hooks/usePermissions";
import NotAllowed from "@/pages/404/NotAllowed";
import { showToast } from "@/providers/ToastProvider";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { InputSwitch } from "primereact/inputswitch";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
const columns = [
  {
    label: "companyName",
    field: "companyName",
    type: "text",
  },
  {
    label: "contactPersonFirstName",
    field: "contactPersonFirstName",
    type: "text",
  },
  {
    label: "contactPersonLastName",
    field: "contactPersonLastName",
    type: "text",
  },
  {
    label: "status",
    field: "isSelected",
    type: "dropdown",
  },
];
const CustomerSelectorToGroup = ({ group }) => {
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [filters, setFilters] = useState({
    pageNumber: 1,
    pageSize: 10,
    order: "",
    orderColumn: "",
    searchList: [],
  });
  const { t } = useTranslation();
  const perms = usePermissions({
    setCustomer: "B2BCUSTOMER_GROUP: SET_B2BCUSTOMER_TO_B2BCUSTOMER_GROUP",
    getCustomers: "B2BCUSTOMER_GROUP: GET_B2BCUSTOMERS_BY_GROUP_ID",
  });

  const isAllowed = perms.isAllowed("getCustomers");

  const getCustomers = async (payload = filters) => {
    if (!group?.id) return;
    try {
      setLoading(true);
      const res = await GetB2BCustomerByGroupId(group.id, payload);
      setCustomers(res?.data?.customerViewModels ?? []);
      setTotalRecords(res?.totalCount ?? 0);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  const handleAdd = async (data, isSelected) => {
    try {
      setLoading(true);
      const res = await SetB2BCustomerToGroup({
        id: group.id,
        customerId: data.customerId,
        isSelected,
      });
      showToast({
        severity: "success",
        summary: t("success"),
        detail: res?.message ?? t("updatedSuccessfully"),
      });
      getCustomers();
    } catch (error) {
      console.log(error);
      showToast({
        severity: "error",
        summary: t("error"),
        detail: error?.response?.data?.message ?? t("unexpectedError"),
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!perms.ready || !isAllowed || !group?.id || !visible) return;
    getCustomers();
  }, [isAllowed, perms.ready, group?.id, visible]);

  const onClose = () => {
    setVisible(false);
  };
  const selectedOptions = [
    {
      value: "true",
      label: t("selected").charAt(0).toUpperCase() + t("selected").slice(1),
    },
    {
      value: "false",
      label: t("unselected"),
    },
  ];
  return (
    <div>
      <Button
        onClick={() => setVisible(true)}
        icon="pi pi-user-plus"
        tooltip={t("addCustomer")}
        tooltipOptions={{ position: "top" }}
      />
      <Dialog
        header={t("addCustomerToGroup", { name: group.name })}
        visible={visible}
        className={"max-w-[1100px] min-w-[500px]"}
        onHide={onClose}
        draggable={false}
        footer={
          <div>
            <Button
              label={t("close")}
              className={"!w-[150px]"}
              onClick={onClose}
            />
          </div>
        }
      >
        {isAllowed ? (
          <DataTableContainer>
            <DataTable
              value={customers}
              loading={loading}
              {...tableStaticProps}
              first={filters.pageNumber * filters.pageSize - filters.pageSize}
              totalRecords={totalRecords}
              rows={filters.pageSize}
              onPage={(e) => {
                const newPage = {
                  pageNumber: e.page + 1,
                  pageSize: e.rows,
                };
                setFilters((p) => {
                  const newFilter = { ...p, ...newPage };
                  getCustomers(newFilter);
                  return newFilter;
                });
              }}
              scrollable
            >
              {columns.map((c) => (
                <Column
                  field={c.field}
                  body={(data) => {
                    const v = data[c.field];
                    if (c.field === "isSelected")
                      return selectedOptions.find(
                        (o) => o.value === v?.toString(),
                      )?.label;
                    return v;
                  }}
                  header={() => {
                    const options =
                      c.field === "isSelected" ? selectedOptions : [];

                    return (
                      <TableHeader
                        type={c.type}
                        handleSearch={getCustomers}
                        onChange={(v) => {
                          setFilters((prev) => {
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
                          filters.searchList.find(
                            (item) => item.colName === c.field,
                          )?.value
                        }
                        sort={
                          filters.orderColumn === c.field ? filters.order : ""
                        }
                        handleSort={(s) => {
                          setFilters((prev) => {
                            const newFilter = { ...prev };
                            newFilter.orderColumn = c.field;
                            newFilter.order = s;
                            getCustomers(newFilter);
                            return newFilter;
                          });
                        }}
                        dropdownOptions={options}
                      />
                    );
                  }}
                />
              ))}
              <Column
                alignFrozen="right"
                frozen
                header={"#"}
                alignHeader="center"
                body={(data) => (
                  <div className="flex gap-2">
                    {perms.setCustomer && (
                      <InputSwitch
                        checked={data.isSelected}
                        onChange={(e) => handleAdd(data, e.value)}
                        tooltip={data.isSelected ? t("remove") : t("add")}
                        tooltipOptions={{ position: "top" }}
                      />
                    )}
                  </div>
                )}
              />
            </DataTable>
          </DataTableContainer>
        ) : (
          <NotAllowed showBackBtn={false} />
        )}
      </Dialog>
    </div>
  );
};

export default CustomerSelectorToGroup;
