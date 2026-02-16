import { GetAllOrderStatuses } from "@/api/OrderStatuses";
import DataTableContainer, {
  tableStaticProps,
} from "@/components/ui/TableContainer";
import usePermissions from "@/hooks/usePermissions";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Image } from "primereact/image";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import AddStatusIcon from "./components/AddStatusIcon";

const OrderStatuses = () => {
  const [loading, setLoading] = useState(false);
  const [statuses, setStatuses] = useState([]);

  const { t } = useTranslation();
  const navigate = useNavigate();

  const perms = usePermissions({
    show: "ORDER_STATUS: ORDER_STATUS_LIST",
    update: "ORDER_STATUS: UPDATE_ORDER_STATUS",
  });

  const isAllowed = perms.isAllowed("show");
  const hasAny = perms.hasAny(["update"]);

  const getStatuses = async () => {
    try {
      setLoading(true);
      const res = await GetAllOrderStatuses();
      setStatuses(res.data);
    } catch (error) {
      console.log("error at getStatuses at order statuses", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!perms.ready) return;
    if (!isAllowed) return navigate("/not-allowed", { replace: true });
    getStatuses();
  }, [isAllowed, perms.ready]);

  if (!isAllowed || !perms.ready) return null;
  return (
    <div className="flex flex-col gap-5">
      <div className={`flex items-center justify-between`}>
        <div>
          <p className={`text-[1.5rem] font-bold`}>{t("orderStatuses")}</p>
        </div>
      </div>
      <DataTableContainer>
        <DataTable
          loading={loading}
          value={statuses}
          {...tableStaticProps}
          totalRecords={statuses.length}
          lazy={false}
        >
          <Column field={"name"} header={t("name")} />
          <Column
            field={"filePath"}
            header={t("icon")}
            body={(data) => {
              return (
                <Image src={data.filePath} alt="icon" width="20" height="20" />
              );
            }}
          />
          {hasAny && (
            <Column
              header={"#"}
              style={{ width: "100px" }}
              body={(data) => (
                <div className="flex flex-row gap-2 items-center">
                  {perms.update && (
                    <AddStatusIcon onSuccess={getStatuses} status={data} />
                  )}
                </div>
              )}
            />
          )}
        </DataTable>
      </DataTableContainer>
    </div>
  );
};

export default OrderStatuses;
