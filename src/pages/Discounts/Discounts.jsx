import { GetAllDiscountConditions } from "@/api/DiscountConditions";
import DataTableContainer, {
  tableStaticProps,
} from "@/components/ui/TableContainer";
import TableHeader from "@/components/ui/TableHeader";
import { formatDate } from "@/helper/DateFormatter";
import usePermissions from "@/hooks/usePermissions";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import AddDiscountCondition from "./components/AddDiscountCondition";

const Discounts = () => {
  const { t } = useTranslation();
  const [discounts, setDiscounts] = useState([]);
  const [loading, setLoading] = useState(false);
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
    show: "Endirim şərti: Endirim şərtlərini görmək",
    create: "Endirim şərti: Endirim şərti yaratmaq",
    update: "Endirim şərti: Endirim şərtlərini yeniləmək",
  });

  const isAllowed = perms.isAllowed("show");
  const getDiscountConditions = async (payload = filter) => {
    try {
      setLoading(true);
      const res = await GetAllDiscountConditions(payload);
      setDiscounts(res.discountConditions);
      setTotalRecords(res.pageInfo.totalItems);
    } catch (error) {
      console.log("error at getDiscountConditions", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!perms.ready) return;
    if (!isAllowed) return navigate("/not-allowed", { replace: true });
    getDiscountConditions();
  }, [isAllowed, perms.ready]);

  if (!isAllowed || !perms.ready) return null;
  return (
    <div className="flex flex-col gap-5">
      <div className={`flex items-center justify-between`}>
        <div>
          <p className={`text-[1.5rem] font-bold`}>{t("discounts")}</p>
        </div>
        <div className="flex flex-row gap-2">
          {perms.create && (
            <AddDiscountCondition
              onSuccess={() => getDiscountConditions()}
              disabled={!perms.create}
            />
          )}
        </div>
      </div>
      <DataTableContainer>
        <DataTable
          value={discounts}
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
              getDiscountConditions(newFilter);
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
                    handleSearch={getDiscountConditions}
                    onChange={(v) => {
                      setFilter((prev) => {
                        const newFilter = { ...prev };
                        newFilter.searchList = newFilter.searchList.filter(
                          (item) => item.colName !== c.field
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
                        getDiscountConditions(newFilter);
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
                    <AddDiscountCondition
                      onSuccess={() => getDiscountConditions()}
                      disabled={!perms.update}
                      condition={data}
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

export default Discounts;
