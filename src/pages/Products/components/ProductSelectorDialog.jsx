import { GetAllProducts } from "@/api/Products";
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
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const ProductSelectorDialog = ({
  visible,
  onClose,
  selectionMode = "single", // single və ya multiple
  defaultSelected = [], // object array
  handleSelect, // həmişə objectdə qaytarır məhsulu. Amma bəzən objectdə sadəcə id qaytara bilər, defaultSelecteddən asılı olaraq
  disabledIds = [],
}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
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
    show: "Məhsul: Məhsulları görmək",
  });

  const isAllowed = perms.isAllowed("show");
  const getProducts = async (payload = filters) => {
    try {
      setLoading(true);
      const res = await GetAllProducts(payload);
      setProducts(res.products);
      setTotalRecords(res.pageInfo.totalItems);
      if (defaultSelected.length > 0) {
        const existingIds = new Set(selectedProducts.map((p) => p.id));
        const productsMap = new Map(res.products.map((p) => [p.id, p]));
        const defaultSelectedMap = new Map(
          defaultSelected.map((item) => [item.id, item])
        );
        const updated = selectedProducts.map((p) => {
          if (defaultSelectedMap.has(p.id)) {
            const fullData = productsMap.get(p.id);
            return fullData ? { id: p.id, ...fullData } : p;
          }
          return p;
        });
        const newProducts = defaultSelected
          .filter((item) => !existingIds.has(item.id))
          .map((item) => ({
            id: item.id,
            ...(productsMap.get(item.id) || {}),
          }));

        setSelectedProducts([...updated, ...newProducts]);
      }
    } catch (error) {
      console.log("error at getProducts", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (!perms.ready || !isAllowed || !visible) return;
    getProducts();
  }, [isAllowed, perms.ready, visible]);

  const handleClose = () => {
    setSelectedProducts([]);
    setFilters({
      pageNumber: 1,
      pageSize: 10,
      order: "",
      orderColumn: "",
      searchList: [],
    });
    onClose?.();
  };

  const footer = (
    <div className="flex justify-end gap-2 mt-4">
      <Button
        label={t("cancel")}
        icon="pi pi-times"
        className="p-button-text"
        onClick={handleClose}
      />
      <Button
        label={t("confirm")}
        icon="pi pi-check"
        onClick={() => {
          handleSelect(selectedProducts);
          handleClose();
        }}
      />
    </div>
  );

  if (!visible) return null;
  return (
    <Dialog
      visible={visible}
      onHide={handleClose}
      header={
        <p className={`text-[1.5rem] font-bold`}>
          {selectedProducts.length > 0
            ? `${selectedProducts.length} ${t("product")} ${t("selected")}`
            : t("products")}
        </p>
      }
      className="w-[95%]"
      footer={footer}
    >
      {isAllowed ? (
        <DataTableContainer>
          <DataTable
            loading={loading}
            value={products}
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
                getProducts(newFilter);
                return newFilter;
              });
            }}
            dataKey="id"
            selectionMode={selectionMode}
            selection={selectedProducts}
            onSelectionChange={(e) => {
              if (selectionMode === "single") {
                if (disabledIds.includes(e.value.id)) {
                  showToast({
                    severity: "warn",
                    summary: t("error"),
                    detail: t("productAlreadySelected"),
                  });
                  return;
                }
                setSelectedProducts([e.value]);
              } else {
                setSelectedProducts(e.value);
              }
            }}
          >
            <Column
              selectionMode={selectionMode}
              headerStyle={{ width: "3rem" }}
            />

            {["name", "productCategoryName", "erpId", "description"].map(
              (c) => {
                return (
                  <Column
                    key={c}
                    field={c}
                    header={
                      <TableHeader
                        handleSearch={getProducts}
                        onChange={(v) => {
                          setFilters((prev) => {
                            const newFilter = { ...prev };
                            newFilter.searchList = newFilter.searchList.filter(
                              (item) => item.colName !== c
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
                          filters.searchList.find((item) => item.colName === c)
                            ?.value
                        }
                        sort={filters.orderColumn === c ? filters.order : ""}
                        handleSort={(s) => {
                          setFilters((prev) => {
                            const newFilter = { ...prev };
                            newFilter.orderColumn = c;
                            newFilter.order = s;
                            getProducts(newFilter);
                            return newFilter;
                          });
                        }}
                      />
                    }
                  />
                );
              }
            )}
          </DataTable>
        </DataTableContainer>
      ) : (
        <NotAllowed showBackBtn={false} />
      )}
    </Dialog>
  );
};

export default ProductSelectorDialog;
