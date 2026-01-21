import { useTranslation } from "react-i18next";
import AddProductCategory from "./components/AddProductCategory";
import { GetAllProductCategories, ProductCategoryDelete } from "@/api/Products";
import DataTableContainer, {
  tableStaticProps,
} from "@/components/ui/TableContainer";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Image } from "primereact/image";
import { useEffect, useState } from "react";
import { showToast } from "@/providers/ToastProvider";
import DeleteConfirm from "@/components/ui/dialogs/DeleteConfirm";
import ColumnHeaderWithSearch from "@/components/ui/SearchInput";
import SearchInput from "@/components/ui/SearchInput";
import { useNavigate } from "react-router-dom";
import usePermissions from "@/hooks/usePermissions";

const ProductCategories = () => {
  const { t } = useTranslation();
  const [categories, setCategories] = useState([]);

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
    show: "Məhsul kateqoriyası: Məhsul kateqoriyaları görmək",
    create: "Məhsul kateqoriyası: Məhsul kateqoriyası yaratmaq",
    update: "Məhsul kateqoriyası: Məhsul kateqoriyası yeniləmə",
    delete: "Məhsul kateqoriyası: Məhsul kateqoriyası silmə",
  });

  const isAllowed = perms.isAllowed("show");
  const hasAny = perms.hasAny(["update", "delete"]);

  const getCategories = async (payload = filter) => {
    try {
      setLoading(true);
      const res = await GetAllProductCategories(payload);
      setCategories(res.productCategories);
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

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      const res = await ProductCategoryDelete(id);
      await getCategories();
      showToast({
        severity: "success",
        summary: t("success"),
        detail: res?.message || "",
      });
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
    getCategories();
  }, [isAllowed, perms.ready]);

  return (
    <div className="flex flex-col gap-5">
      <div className={`flex items-center justify-between`}>
        <div>
          <p className={`text-[1.5rem] font-bold`}>{t("productCategories")}</p>
        </div>
        <div className="flex flex-row gap-2">
          <SearchInput
            className="mr-5"
            onChange={(v) => {
              setFilter((prev) => {
                const newFilter = { ...prev };
                newFilter.searchList = newFilter.searchList.filter(
                  (item) => item.colName !== "name"
                );
                if (v) {
                  newFilter.searchList.push({ colName: "name", value: v });
                }
                return newFilter;
              });
            }}
            handleSearch={getCategories}
            placeholder={t("searchWithName")}
          />
          {perms.create && <AddProductCategory onSuccess={getCategories} />}
        </div>
      </div>

      <DataTableContainer>
        <DataTable
          value={categories}
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
              getCategories(newFilter);
              return newFilter;
            });
          }}
          // onSort={(data) => {
          //   console.log(data);
          //   setFilter((p) => {
          //     const newFilter = {
          //       ...p,
          //       ...{
          //         order: data.sortOrder === 1 ? "asc" : "desc",
          //         orderColumn: data.sortField,
          //       },
          //     };
          //     getCategories(newFilter);
          //     return newFilter;
          //   });
          // }}
          // sortField={filter.orderColumn}
          // sortOrder={filter.order === "asc" ? 1 : -1}
        >
          <Column
            header={"№"}
            body={(_, row) => {
              return row.rowIndex + 1;
            }}
          />
          {["name"].map((c) => (
            <Column
              field={c}
              body={(data) => {
                const v = data[c];
                return v;
              }}
              header={t(c)}
            />
          ))}
          <Column
            header={"Şəkil"}
            body={(data) => {
              return (
                <Image
                  alt={data?.fileName || ""}
                  src={data?.filePath || ""}
                  preview
                  className="w-[50px] h-[50px]"
                />
              );
            }}
          />
          {hasAny && (
            <Column
              header={"#"}
              body={(data) => {
                return (
                  <div className="flex flex-row gap-2">
                    {perms.update && (
                      <AddProductCategory
                        category={data}
                        onSuccess={getCategories}
                      />
                    )}
                    {perms.delete && (
                      <DeleteConfirm
                        onConfirm={() => {
                          handleDelete(data.id);
                        }}
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

export default ProductCategories;
