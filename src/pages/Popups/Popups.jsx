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
import { PhotosViewerDialog } from "@/components/ui/file/PhotosViewerDialog";
import AddPopup from "./components/AddPopup";
import { GetAllPromoPopups } from "@/api/Popup";
import CustomersViewDialog from "../Customers/components/CustomersViewDialog";

const Popups = () => {
  const { t } = useTranslation();
  const [popups, setPopups] = useState([]);
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
    show: "PromoPopup: PromoPopupların siyahısı",
    create: "PromoPopup: PromoPopup yaratmaq",
    update: "PromoPopup: PromoPopup yeniləmə",
  });

  const isAllowed = perms.isAllowed("show");

  const getPopups = async (payload = filter) => {
    try {
      setLoading(true);
      const res = await GetAllPromoPopups(payload);
      setPopups(res.promoPopups);
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
    getPopups();
  }, [isAllowed, perms.ready]);

  if (!isAllowed || !perms.ready) return null;
  return (
    <div className="flex flex-col gap-5">
      <div className={`flex items-center justify-between`}>
        <div>
          <p className={`text-[1.5rem] font-bold`}>{t("popups")}</p>
        </div>
        <div className="flex flex-row gap-2">
          {perms.create && <AddPopup onSuccess={() => getPopups()} />}
        </div>
      </div>
      <DataTableContainer>
        <DataTable
          value={popups}
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
              getPopups(newFilter);
              return newFilter;
            });
          }}
        >
          {[
            { label: "title", field: "title", type: "text" },
            { label: "description", field: "description", type: "text" },
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
                    handleSearch={getPopups}
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
                        getPopups(newFilter);
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
                  <PhotosViewerDialog images={data.promoPopupImages} />
                  <CustomersViewDialog
                    customers={data.promoPopupCustomers}
                    allCustomers={data.sendToAllCustomers}
                  />
                  {perms.update && (
                    <AddPopup
                      onSuccess={() => getPopups()}
                      popup={data}
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

export default Popups;
