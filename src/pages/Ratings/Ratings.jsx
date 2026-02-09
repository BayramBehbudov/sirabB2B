import { GetAllOrderEvaluations } from "@/api/OrderEvaluation";
import DataTableContainer, {
  tableStaticProps,
} from "@/components/ui/TableContainer";
import TableHeader from "@/components/ui/TableHeader";
import { formatDate } from "@/helper/DateFormatter";
import usePermissions from "@/hooks/usePermissions";
import { showToast } from "@/providers/ToastProvider";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import DetailDialog from "./components/DetailDialog";

const Ratings = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [selectedRow, setSelectedRow] = useState(undefined);
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
    show: "OrderEvaluation: OrderEvaluation List",
  });
  const isAllowed = perms.isAllowed("show");

  const getEvaluations = async (payload = filter) => {
    try {
      setLoading(true);
      const res = await GetAllOrderEvaluations(payload);
      setData(res.orderEvaluations);
      setTotalRecords(res.pageInfo.totalItems);
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
    getEvaluations();
  }, [isAllowed, perms.ready]);

  if (!isAllowed || !perms.ready) return null;
  return (
    <div className="flex flex-col gap-5">
      <div className={`flex items-center justify-between`}>
        <div>
          <p className={`text-[1.5rem] font-bold`}>{t("ratings")}</p>
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
              getEvaluations(newFilter);
              return newFilter;
            });
          }}
          scrollable
          size="small"
          rowClassName={"!cursor-pointer"}
          onRowDoubleClick={(e) => setSelectedRow(e.data)}
        >
          <Column
            header={"№"}
            body={(_, row) => {
              return row.rowIndex + 1;
            }}
          />
          {[
            "orderNumber",
            "companyName",
            "contactPersonFullName",
            "deliveryDate",
            "orderDate",
            "orderStatusName",
          ].map((c) => {
            const isDate = c === "deliveryDate" || c === "orderDate";
            return (
              <Column
                field={c}
                key={c}
                body={(data) => {
                  return isDate ? formatDate(data[c]) : data[c];
                }}
                header={() => {
                  return (
                    <TableHeader
                      type={isDate ? "date" : "text"}
                      handleSearch={getEvaluations}
                      onChange={(v) => {
                        setFilter((prev) => {
                          const newFilter = { ...prev };
                          newFilter.searchList = newFilter.searchList.filter(
                            (item) => item.colName !== c,
                          );
                          if (v) {
                            newFilter.searchList.push({
                              colName: c,
                              value: v,
                            });
                          }
                          return newFilter;
                        });
                      }}
                      label={t(c)}
                      placeholder={t("search")}
                      value={
                        filter.searchList.find((item) => item.colName === c)
                          ?.value
                      }
                      sort={filter.orderColumn === c ? filter.order : ""}
                      handleSort={(s) => {
                        setFilter((prev) => {
                          const newFilter = { ...prev };
                          newFilter.orderColumn = c;
                          newFilter.order = s;
                          getEvaluations(newFilter);
                          return newFilter;
                        });
                      }}
                    />
                  );
                }}
              />
            );
          })}
          <Column
            header={"#"}
            frozen
            alignFrozen="right"
            body={(data) => {
              return (
                <div className="flex items-center gap-2">
                  <Button
                    tooltip={t("seeDetails")}
                    tooltipOptions={{ position: "left" }}
                    icon="pi pi-eye"
                    onClick={() => setSelectedRow(data)}
                    className="!p-1"
                  />
                </div>
              );
            }}
          />
        </DataTable>
      </DataTableContainer>
      <DetailDialog row={selectedRow} setRow={setSelectedRow} />
    </div>
  );
};

export default Ratings;
