import {
  DeleteMinimumOrderPrice,
  GetAllMinimumOrderPrices,
} from "@/api/MinimumOrderPrice";
import DataTableContainer, {
  tableStaticProps,
} from "@/components/ui/TableContainer";
import TableHeader from "@/components/ui/TableHeader";
import usePermissions from "@/hooks/usePermissions";
import { showToast } from "@/providers/ToastProvider";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import AddMinOrderPrice from "./components/AddMinOrderPrice";
import DeleteConfirm from "@/components/ui/dialogs/DeleteConfirm";

const MinimumOrderPrice = () => {
  const [loading, setLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState({
    pageNumber: 1,
    pageSize: 10,
    order: "",
    orderColumn: "",
    searchList: [],
  });
  const { t } = useTranslation();
  const navigate = useNavigate();

  const perms = usePermissions({
    show: "MINIMUM_ORDER_PRICE: MINIMUM_ORDER_PRICE_LIST",
    create: "MINIMUM_ORDER_PRICE: CREATE_MINIMUM_ORDER_PRICE",
    update: "MINIMUM_ORDER_PRICE: UPDATE_MINIMUM_ORDER_PRICE",
    delete: "MINIMUM_ORDER_PRICE: DELETE_MINIMUM_ORDER_PRICE",
  });

  const isAllowed = perms.isAllowed("show");
  const hasAny = perms.hasAny(["update", "delete"]);

  const getData = async (payload = filter) => {
    try {
      setLoading(true);
      const res = await GetAllMinimumOrderPrices(payload);
      setData(res.minimumOrderPrices);
      setTotalRecords(res.pageInfo.totalItems);
    } catch (error) {
      console.log("error at getData at minimum order price", error);
    } finally {
      setLoading(false);
    }
  };
  const handleDelete = async (id) => {
    setLoading(true);
    try {
      const res = await DeleteMinimumOrderPrice(id);
      showToast({
        severity: "success",
        summary: t("success"),
        detail: res?.message || "",
      });
      getData();
    } catch (error) {
      console.log("error at handleDelete at minimum order price", error);
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
    getData();
  }, [isAllowed, perms.ready]);

  if (!isAllowed || !perms.ready) return null;
  return (
    <div className="flex flex-col gap-5">
      <div className={`flex items-center justify-between`}>
        <div>
          <p className={`text-[1.5rem] font-bold`}>{t("minimumOrderPrice")}</p>
        </div>
        <div className="flex flex-row gap-2">
          {perms.create && <AddMinOrderPrice onSuccess={getData} />}
        </div>
      </div>
      <DataTableContainer>
        <DataTable
          value={data}
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
              getData(newFilter);
              return newFilter;
            });
          }}
        >
          {[
            {
              label: "customerGroup",
              field: "customerGroupName",
              type: "text",
            },
            {
              label: "companyName",
              field: "b2BCustomerCompanyName",
              type: "text",
            },
            { label: "orderPrice", field: "orderPrice", type: "text" },
          ].map((c) => (
            <Column
              field={c.field}
              header={() => {
                return (
                  <TableHeader
                    type={c.type}
                    handleSearch={getData}
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
                        getData(newFilter);
                        return newFilter;
                      });
                    }}
                  />
                );
              }}
            />
          ))}
          {hasAny && (
            <Column
              header={"#"}
              style={{ width: "100px" }}
              alignHeader="center"
              body={(data) => (
                <div className="flex flex-row gap-2 items-center">
                  {perms.update && (
                    <AddMinOrderPrice onSuccess={getData} currentData={data} />
                  )}
                  {perms.delete && data?.id && (
                    <DeleteConfirm
                      onConfirm={() => handleDelete(data.id)}
                      disabled={loading}
                    />
                  )}
                </div>
              )}
            />
          )}
        </DataTable>
      </DataTableContainer>
    </div>
  );
};

export default MinimumOrderPrice;

//'MINIMUM_ORDER_PRICE: MINIMUM_ORDER_PRICE_LIST'
//'MINIMUM_ORDER_PRICE: CREATE_MINIMUM_ORDER_PRICE'
//'MINIMUM_ORDER_PRICE: UPDATE_MINIMUM_ORDER_PRICE'
//'MINIMUM_ORDER_PRICE: DELETE_MINIMUM_ORDER_PRICE'
