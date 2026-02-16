import { useTranslation } from "react-i18next";
import AddSaleCondition from "./components/AddSaleCondition";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import usePermissions from "@/hooks/usePermissions";
import DataTableContainer, {
  tableStaticProps,
} from "@/components/ui/TableContainer";
import { DataTable } from "primereact/datatable";
import TableHeader from "@/components/ui/TableHeader";
import { Column } from "primereact/column";
import { GetAllSaleCondtions } from "@/api/SaleConditions";
import { formatDate } from "@/helper/DateFormatter";

const SaleConditions = () => {
  const { t } = useTranslation();
  const [conditions, setConditions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [filter, setFilter] = useState({
    pageNumber: 1,
    pageSize: 10,
    order: "",
    orderColumn: "",
    searchList: [],
  });
  // qeyd yoxla gör uzun mətnlər cədvəllərdə necə görünür bütün səhifələri yoxla
  const navigate = useNavigate();
  const perms = usePermissions({
    show: "SALE_CONDITION: SALE_CONDITION_LIST",
    create: "SALE_CONDITION: CREATE_SALE_CONDITION",
    update: "SALE_CONDITION: UPDATE_SALE_CONDITION",
  });

  const isAllowed = perms.isAllowed("show");
  const getConditions = async (payload = filter) => {
    try {
      setLoading(true);
      const res = await GetAllSaleCondtions(payload);
      setConditions(res.saleConditions);
      setTotalRecords(res.pageInfo.totalItems);
    } catch (error) {
      console.log("error at getConditions", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!perms.ready) return;
    if (!isAllowed) return navigate("/not-allowed", { replace: true });
    getConditions();
  }, [isAllowed, perms.ready]);

  if (!isAllowed || !perms.ready) return null;
  return (
    <div className="flex flex-col gap-5">
      <div className={`flex items-center justify-between`}>
        <div>
          <p className={`text-[1.5rem] font-bold`}>{t("SaleConditions")}</p>
        </div>
        <div className="flex flex-row gap-2">
          {perms.create && (
            <AddSaleCondition
              onSuccess={() => getConditions()}
              disabled={!perms.create}
            />
          )}
        </div>
      </div>
      <DataTableContainer>
        <DataTable
          value={conditions}
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
              getConditions(newFilter);
              return newFilter;
            });
          }}
        >
          {[
            { label: "description", field: "description", type: "text" },
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
            { label: "startDate", field: "startDate", type: "date" },
            { label: "endDate", field: "endDate", type: "date" },
          ].map((c) => (
            <Column
              field={c.field}
              body={(data) => {
                const v = data[c.field];
                if (c.type === "date") return formatDate(v);
                return v;
              }}
              header={() => {
                return (
                  <TableHeader
                    type={c.type}
                    handleSearch={getConditions}
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
                        getConditions(newFilter);
                        return newFilter;
                      });
                    }}
                  />
                );
              }}
            />
          ))}

          <Column
            body={(data) => {
              return (
                <div className="flex flex-row gap-2">
                  {perms.update && (
                    <AddSaleCondition
                      onSuccess={() => getConditions()}
                      condition={data}
                      disabled={!perms.update}
                    />
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

export default SaleConditions;
