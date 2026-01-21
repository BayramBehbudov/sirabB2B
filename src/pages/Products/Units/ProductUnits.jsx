import { GetAllUnitDefinition } from "@/api/Products";
import DataTableContainer, {
  tableStaticProps,
} from "@/components/ui/TableContainer";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import AddUnit from "./components/AddUnit";
import { useNavigate } from "react-router-dom";
import usePermissions from "@/hooks/usePermissions";

const ProductUnits = () => {
  const [loading, setLoading] = useState(false);
  const [units, setUnits] = useState([]);

  const navigate = useNavigate();

  const perms = usePermissions({
    show: "Vahid: Vahidləri görmək",
    create: "Vahid: Vahid yaratma",
    update: "Vahid: Vahid yeniləmə",
  });

  const isAllowed = perms.isAllowed("show");
  const hasAny = perms.hasAny(["update"]);

  const getAllUnits = async () => {
    try {
      setLoading(true);
      const res = await GetAllUnitDefinition();
      setUnits(res.data);
    } catch (error) {
      console.log("error at getAllUnits", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!perms.ready) return;
    if (!isAllowed) return navigate("/not-allowed", { replace: true });
    getAllUnits();
  }, [isAllowed, perms.ready]);

  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-5">
      <div className={`flex items-center justify-between`}>
        <div>
          <p className={`text-[1.5rem] font-bold`}>{t("productUnits")}</p>
        </div>
        <div className="flex flex-row gap-2">
          {perms.create && <AddUnit onSuccess={getAllUnits} />}
        </div>
      </div>
      <DataTableContainer>
        <DataTable
          value={units}
          loading={loading}
          {...tableStaticProps}
          lazy={false}
        >
          <Column header={"№"} body={(_, row) => row.rowIndex + 1} />
          <Column field="name" header={t("name")} />
          <Column field="code" header={t("code")} />
          {hasAny && (
            <Column
              header={"#"}
              body={(unit) => {
                return (
                  <div className="flex flex-row gap-2">
                    {perms.update && (
                      <AddUnit onSuccess={getAllUnits} unit={unit} />
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

export default ProductUnits;
