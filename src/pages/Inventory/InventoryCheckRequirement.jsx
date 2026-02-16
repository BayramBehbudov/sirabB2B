import { GetAllInventoryRequirements } from "@/api/Inventory";
import DataTableContainer, {
  tableStaticProps,
} from "@/components/ui/TableContainer";
import TableHeader from "@/components/ui/TableHeader";
import usePermissions from "@/hooks/usePermissions";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import AddInventoryRequirement from "./components/AddInventoryRequirement";

const InventoryCheckRequirement = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [inventoryRequirements, setInventoryRequirements] = useState([]);

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
    show: "INVENTORY: INVENTORY_REQUIREMENT_LIST",
    create: "INVENTORY: CREATE_INVENTORY",
  });

  const isAllowed = perms.isAllowed("show");

  const getInventory = async (payload = filter) => {
    try {
      setLoading(true);
      const res = await GetAllInventoryRequirements(payload);
      setInventoryRequirements(res.inventoryCheckRequirements);
      setTotalRecords(res.pageInfo.totalItems);
    } catch (error) {
      console.log("error at getInventory", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!perms.ready) return;
    if (!isAllowed) return navigate("/not-allowed", { replace: true });
    getInventory();
  }, [isAllowed, perms.ready]);

  if (!isAllowed || !perms.ready) return null;
  return (
    <div className="flex flex-col gap-5">
      <div className={`flex items-center justify-between`}>
        <div>
          <p className={`text-[1.5rem] font-bold`}>
            {t("inventoryCheckRequirement")}
          </p>
        </div>
        <div className="flex flex-row gap-2">
          {perms.create && (
            <AddInventoryRequirement
              disabled={!perms.create}
              onSuccess={getInventory}
            />
          )}
        </div>
      </div>
      <DataTableContainer>
        <DataTable
          value={inventoryRequirements}
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
              getInventory(newFilter);
              return newFilter;
            });
          }}
        >
          {[
            { label: "description", field: "description", type: "text" },
            { label: "photoCount", field: "requiredPhotoCount", type: "text" },
          ].map((c) => (
            <Column
              field={c.field}
              header={() => {
                return (
                  <TableHeader
                    type={c.type}
                    handleSearch={getInventory}
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
                        getInventory(newFilter);
                        return newFilter;
                      });
                    }}
                  />
                );
              }}
            />
          ))}
        </DataTable>
      </DataTableContainer>
    </div>
  );
};

export default InventoryCheckRequirement;
