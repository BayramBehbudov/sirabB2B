import { GetAllUnitDefinition } from "@/api/Products";
import DataTableContainer, {
  tableStaticProps,
} from "@/components/ui/TableContainer";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import AddUnit from "./components/AddUnit";

const ProductUnits = () => {
  const [loading, setLoading] = useState(false);
  const [units, setUnits] = useState([]);

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
    getAllUnits();
  }, []);

  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-5">
      <div className={`flex items-center justify-between p-2`}>
        <div>
          <p className={`text-[1.5rem] font-bold`}>{t("productUnits")}</p>
        </div>
        <div className="flex flex-row gap-2">
          <AddUnit onSuccess={getAllUnits} />
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
          <Column
            header={"#"}
            body={(unit) => {
              return (
                <div className="flex flex-row gap-2">
                  <AddUnit onSuccess={getAllUnits} unit={unit} />
                </div>
              );
            }}
          />
        </DataTable>
      </DataTableContainer>
    </div>
  );
};

export default ProductUnits;
