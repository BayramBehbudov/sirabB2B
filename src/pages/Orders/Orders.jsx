import DataTableContainer, {
  tableStaticProps,
} from "@/components/ui/TableContainer";
import { formatDate } from "@/helper/DateFormatter";
import { showToast } from "@/providers/ToastProvider";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import usePermissions from "@/hooks/usePermissions";
import TableHeader from "@/components/ui/TableHeader";
import { GetAllOrders } from "@/api/Orders";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import OrderDetails from "./components/OrderDetails";
import { GetAllOrderStatuses } from "@/api/OrderStatuses";
import { GetAllPaymentTypes } from "@/api/PaymentTypes";
const columns = [
  {
    fieldKey: "orderInfo",
    label: "orderNumber",
    field: "orderNumber",
    type: "text",
  },
  {
    fieldKey: "orderInfo",
    label: "status",
    field: "orderStatusId",
    type: "dropdown",
  },
  {
    fieldKey: "orderInfo",
    label: "paymentType",
    field: "paymentTypeId",
    type: "dropdown",
  },
  {
    fieldKey: "orderInfo",
    label: "address",
    field: "customerDeliveryAddressTitle",
    type: "text",
  },
  {
    fieldKey: "customerInfo",
    label: "companyName",
    field: "companyName",
    type: "text",
  },
  {
    fieldKey: "customerInfo",
    label: "contactPersonFullName",
    field: "contactPersonFullName",
    type: "text",
  },
  {
    fieldKey: "orderInfo",
    label: "totalNetAmount",
    field: "totalNetAmount",
    type: "number",
  },
  {
    fieldKey: "orderInfo",
    label: "totalDiscountAmount",
    field: "totalDiscountAmount",
    type: "number",
  },
  {
    fieldKey: "orderInfo",
    label: "totalTaxAmount",
    field: "totalTaxAmount",
    type: "number",
  },
  {
    fieldKey: "orderInfo",
    label: "totalGrossAmount",
    field: "totalGrossAmount",
    type: "number",
  },
  {
    fieldKey: "orderInfo",
    label: "note",
    field: "note",
    type: "text",
  },
  {
    fieldKey: "orderInfo",
    label: "promoCode",
    field: "promoCode",
    type: "text",
  },
  {
    fieldKey: "orderInfo",
    label: "orderDate",
    field: "orderDate",
    type: "date",
  },
  {
    fieldKey: "orderInfo",
    label: "deliveryDate",
    field: "deliveryDate",
    type: "date",
  },
];
const Orders = () => {
  const { t } = useTranslation();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [paymentTypes, setPaymentTypes] = useState([]);
  const [orderStatuses, setOrderStatuses] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filter, setFilter] = useState({
    pageNumber: 1,
    pageSize: 10,
    order: "",
    orderColumn: "",
    searchList: [],
    beginDate: new Date().toLocaleDateString("az-AZ"),
    endDate: new Date().toLocaleDateString("az-AZ"),
  });

  const navigate = useNavigate();
  const perms = usePermissions({
    show: "ORDER: ORDER_LIST",
  });

  const isAllowed = perms.isAllowed("show");

  const getOrders = async (payload = filter) => {
    const { beginDate, endDate, ...rest } = payload;
    try {
      setLoading(true);
      const res = await GetAllOrders(rest, { beginDate, endDate });
      setOrders(res.data.data);
      setTotalRecords(res.data.totalCount);
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
  const getStaticData = async () => {
    try {
      setLoading(true);
      const resStatuses = await GetAllOrderStatuses();
      setOrderStatuses(resStatuses.data);
      const resTypes = await GetAllPaymentTypes();
      setPaymentTypes(resTypes.data);
    } catch (error) {
      console.log("error at getStatuses at order statuses", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!perms.ready) return;
    if (!isAllowed) return navigate("/not-allowed", { replace: true });
    getOrders();
    getStaticData();
  }, [isAllowed, perms.ready]);

  if (!isAllowed || !perms.ready) return null;

  return (
    <div className="flex flex-col gap-5">
      <div className={`flex items-center justify-between`}>
        <div>
          <p className={`text-[1.5rem] font-bold`}>{t("orders")}</p>
        </div>
        <div className="flex flex-row gap-2">
          {["beginDate", "endDate"].map((item) => {
            return (
              <Calendar
                key={item}
                value={new Date(filter[item])}
                onChange={(e) => {
                  const v = e.value.toLocaleDateString("az-AZ");
                  setFilter((p) => {
                    const newFilter = { ...p, [item]: v };
                    getOrders(newFilter);
                    return newFilter;
                  });
                }}
                placeholder={t(item)}
                showIcon
              />
            );
          })}
        </div>
      </div>
      <DataTableContainer>
        <DataTable
          value={orders}
          loading={loading}
          {...tableStaticProps}
          first={filter.pageNumber * filter.pageSize - filter.pageSize}
          totalRecords={totalRecords}
          rows={filter.pageSize}
          onPage={(e) => {
            const newPage = {
              pageNumber: e.page + 1,
              pageSize: e.rows,
            };
            setFilter((p) => {
              const newFilter = { ...p, ...newPage };
              getOrders(newFilter);
              return newFilter;
            });
          }}
          scrollable
          onRowDoubleClick={(e) => {
            setSelectedOrder(e.data);
          }}
          rowClassName={"!cursor-pointer"}
        >
          {columns.map((c) => (
            <Column
              field={c.field}
              body={(data) => {
                const v = data[c.fieldKey][c.field];
                if (c.type === "date") return formatDate(v);
                if (c.field === "orderStatusId")
                  return data[c.fieldKey]["orderStatusName"];
                if (c.field === "paymentTypeId")
                  return paymentTypes.find((t) => t.id === v)?.name ?? "";
                return v;
              }}
              header={() => {
                const options =
                  c.field === "orderStatusId"
                    ? orderStatuses.map((item) => ({
                        label: item.name,
                        value: item.id.toString(),
                      }))
                    : c.field === "paymentTypeId"
                      ? paymentTypes.map((item) => ({
                          label: item.name,
                          value: item.id.toString(),
                        }))
                      : [];

                return (
                  <TableHeader
                    type={c.type}
                    handleSearch={getOrders}
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
                        getOrders(newFilter);
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
            body={(data) => (
              <div className="flex gap-2">
                <Button
                  icon="pi pi-eye"
                  text
                  className="resetBtnCss"
                  size="large"
                  tooltip={t("viewOrder")}
                  tooltipOptions={{ position: "left" }}
                  onClick={() => setSelectedOrder(data)}
                />
              </div>
            )}
          />
        </DataTable>
      </DataTableContainer>
      <OrderDetails
        visible={!!selectedOrder}
        onHide={() => setSelectedOrder(null)}
        selectedOrder={selectedOrder}
      />
    </div>
  );
};

export default Orders;
