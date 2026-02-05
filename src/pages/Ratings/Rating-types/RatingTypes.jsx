import {
  DeleteOrderEvaluationType,
  GetAllOrderEvaluationType,
} from "@/api/OrderEvaluationType";
import DataTableContainer, {
  tableStaticProps,
} from "@/components/ui/TableContainer";
import usePermissions from "@/hooks/usePermissions";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import AddRatingType from "./components/AddRatingType";
import { showToast } from "@/providers/ToastProvider";
import DeleteConfirm from "@/components/ui/dialogs/DeleteConfirm";

const RatingTypes = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [types, setTypes] = useState([]);

  const navigate = useNavigate();
  const perms = usePermissions({
    show: "OrderEvaluationType: OrderEvaluationType List",
    create: "OrderEvaluationType: OrderEvaluationType Create",
    update: "OrderEvaluationType: OrderEvaluationType Update",
    delete: "OrderEvaluationType: OrderEvaluationType Delete",
  });

  const isAllowed = perms.isAllowed("show");
  const hasAny = perms.hasAny(["update", "delete"]);

  const getTypes = async () => {
    try {
      setLoading(true);
      const res = await GetAllOrderEvaluationType();
      setTypes(res.data);
    } catch (error) {
      console.log("error at rating type get", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (!perms.ready) return;
    if (!isAllowed) return navigate("/not-allowed", { replace: true });
    getTypes();
  }, [isAllowed, perms.ready]);

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      await DeleteOrderEvaluationType(id);
      getTypes();
      showToast({
        severity: "success",
        summary: t("success"),
        detail: t("dataDeletedSuccess"),
      });
    } catch (error) {
      console.log("error at notification delete", error);
      showToast({
        severity: "error",
        summary: t("error"),
        detail: error?.response?.data?.message || t("unexpectedError"),
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isAllowed || !perms.ready) return null;
  return (
    <div className="flex flex-col gap-5">
      <div className={`flex items-center justify-between`}>
        <div>
          <p className={`text-[1.5rem] font-bold`}>{t("ratingTypes")}</p>
        </div>
        <div className="flex flex-row gap-2">
          {perms.create && (
            <AddRatingType onSuccess={getTypes} allTypes={types} />
          )}
        </div>
      </div>
      <DataTableContainer>
        <DataTable
          loading={loading}
          value={types}
          {...tableStaticProps}
          lazy={false}
          removableSort
        >
          {[
            { field: "name", label: "name" },
            { field: "order", label: "seri" },
          ].map(({ field, label }) => {
            return (
              <Column sortable field={field} key={field} header={t(label)} />
            );
          })}

          {hasAny && (
            <Column
              header={"#"}
              alignHeader="center"
              className="w-[100px]"
              body={(data) => (
                <div className="flex flex-row gap-2 items-center">
                  {perms.update && (
                    <AddRatingType
                      onSuccess={getTypes}
                      defaultType={data}
                      allTypes={types}
                    />
                  )}
                  {perms.delete && (
                    <DeleteConfirm onConfirm={() => handleDelete(data.id)} />
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

export default RatingTypes;
