import { GetAllPendingDocuments } from "@/api/Document";
import DataTableContainer, {
  tableStaticProps,
} from "@/components/ui/TableContainer";
import TableHeader from "@/components/ui/TableHeader";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import RequsetsDocuments from "./components/RequsetsDocuments";
import { useNavigate } from "react-router-dom";
import usePermissions from "@/hooks/usePermissions";

const Requests = () => {
  const [loading, setLoading] = useState(false);
  const [requests, setRequests] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
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
    show: "Müştəri sənədi: Müştəri sənədlərini görmək",
    confirm: "Müştəri sənədi: Müştəri sənədini təsdiq və ya rədd etmək",
  });

  const isAllowed = perms.isAllowed("show");
  const hasAny = perms.hasAny(["confirm"]);

  const getRequests = async (payload = filter) => {
    setLoading(true);
    try {
      const res = await GetAllPendingDocuments(payload);
      setRequests(res.customerUploadedDocs);
      setTotalRecords(res.pageInfo.totalItems);
    } catch (error) {
      console.log("error at getAllRequests", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!perms.ready) return;
    if (!isAllowed) return navigate("/not-allowed", { replace: true });
    getRequests();
  }, [isAllowed, perms.ready]);

  // qeyd sort test edilməyib
  return (
    <div className="flex flex-col gap-5">
      <div className={`flex items-center justify-between`}>
        <div>
          <p className={`text-[1.5rem] font-bold`}>
            {t("registrationRequests")}
          </p>
        </div>
        <div className="flex flex-row gap-2">{/* */}</div>
      </div>
      <DataTableContainer>
        <DataTable
          loading={loading}
          value={requests}
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
              getRequests(newFilter);
              return newFilter;
            });
          }}
        >
          {[
            "companyName",
            "contactPersonFirstName",
            "contactPersonLastName",
            "erpId",
            "taxId",
            "phoneNumber",
            "email",
          ].map((c) => (
            <Column
              field={c}
              header={() => {
                return (
                  <TableHeader
                    handleSearch={getRequests}
                    onChange={(v) => {
                      setFilter((prev) => {
                        const newFilter = { ...prev };
                        newFilter.searchList = newFilter.searchList.filter(
                          (item) => item.colName !== c
                        );
                        if (v) {
                          newFilter.searchList.push({ colName: c, value: v });
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
                        getRequests(newFilter);
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
              header={""}
              body={(row) => {
                return (
                  <div className="flex flex-row gap-2">
                    {perms.confirm && (
                      <RequsetsDocuments
                        row={row}
                        onSuccess={() => getRequests()}
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

export default Requests;
