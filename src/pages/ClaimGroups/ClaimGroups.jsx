import { useTranslation } from "react-i18next";
import AddClaimGroup from "./components/AddClaimGroup";
import { useEffect, useState } from "react";
import { GetClaimGroups } from "@/api/ClaimGroups";
import DataTableContainer, {
  tableStaticProps,
} from "@/components/ui/TableContainer";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import PermissionsSelector from "./components/PermissionsSelector";

const ClaimGroups = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [page, setPage] = useState({
    pageNumber: 1,
    pageSize: 10,
  });
  const { t } = useTranslation();

  const handleGetClaimGroups = async () => {
    try {
      setLoading(true);
      const res = await GetClaimGroups(page);
      setGroups(res.claimGroups);
      setTotalRecords(res.pageInfo.totalItems);
    } catch (error) {
      console.log("error at handleGetClaimGroups", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGetClaimGroups();
  }, [page]);

  return (
    <div className="flex flex-col gap-5">
      <div className={`flex items-center justify-between p-2`}>
        <div>
          <p className={`text-[1.5rem] font-bold`}>{t("claimGroups")}</p>
        </div>
        <div className="flex flex-row gap-2">
          <AddClaimGroup onSuccess={handleGetClaimGroups} />
        </div>
      </div>
      <DataTableContainer>
        <DataTable
          loading={loading}
          value={groups}
          {...tableStaticProps}
          first={page.pageNumber * page.pageSize - page.pageSize}
          totalRecords={totalRecords}
          rows={page.pageSize}
          onPage={(e) => {
            const newPage = {
              pageNumber: e.page + 1,
              pageSize: e.rows,
            };
            setPage(newPage);
          }}
        >
          <Column
            field=""
            header={"№"}
            body={(_, rowData) => {
              return <p>{rowData.rowIndex + 1}</p>;
            }}
          />

          {["name"].map((f) => {
            return <Column field={f} header={t(f)} />;
          })}
          <Column
            exportable={false}
            header={"#"}
            alignHeader="center"
            body={(row) => {
              return (
                <div className="flex flex-row gap-2 justify-center">
                  <AddClaimGroup claim={row} onSuccess={handleGetClaimGroups} />
                  <PermissionsSelector claimGroup={row} />
                </div>
              );
            }}
          />
        </DataTable>
      </DataTableContainer>
    </div>
  );
};

export default ClaimGroups;
