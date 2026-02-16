import { GetAllProducts } from "@/api/Products";
import DataTableContainer, {
  tableStaticProps,
} from "@/components/ui/TableContainer";
import TableHeader from "@/components/ui/TableHeader";
import usePermissions from "@/hooks/usePermissions";
import { showToast } from "@/providers/ToastProvider";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const Products = () => {
  const { t } = useTranslation();
  const [products, setProducts] = useState([]);
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
    show: "PRODUCT: PRODUCT_LIST",
    create: "PRODUCT: CREATE_PRODUCT",
    update: "PRODUCT: UPDATE_PRODUCT",
  });

  const isAllowed = perms.isAllowed("show");
  const hasAny = perms.hasAny(["update"]);

  const getProducts = async (payload = filter) => {
    try {
      setLoading(true);
      const res = await GetAllProducts(payload);
      setProducts(res.products);
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
    getProducts();
  }, [isAllowed, perms.ready]);

  if (!isAllowed || !perms.ready) return null;
  return (
    <div className="flex flex-col gap-5">
      <div className={`flex items-center justify-between`}>
        <div>
          <p className={`text-[1.5rem] font-bold`}>{t("products")}</p>
        </div>
        <div className="flex flex-row gap-2">
          {perms.create && (
            <Button
              tooltipOptions={{ position: "top" }}
              icon={`pi pi-plus`}
              onClick={() => navigate("/add-product/add")}
              label={t("add")}
            />
          )}
        </div>
      </div>
      <DataTableContainer>
        <DataTable
          value={products}
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
              getProducts(newFilter);
              return newFilter;
            });
          }}
        >
          <Column
            header={"№"}
            body={(_, row) => {
              return row.rowIndex + 1;
            }}
          />
          {["name", "productCategoryName", "erpId", "description"].map((c) => (
            <Column
              field={c}
              key={c}
              header={() => {
                return (
                  <TableHeader
                    handleSearch={getProducts}
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
                        getProducts(newFilter);
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
              body={(data) => {
                return (
                  <div className="flex flex-row gap-2">
                    {perms.update && (
                      <Button
                        tooltip={t("edit")}
                        tooltipOptions={{ position: "top" }}
                        icon={`pi pi-pencil`}
                        onClick={() => navigate(`/add-product/${data.id}`)}
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

export default Products;
