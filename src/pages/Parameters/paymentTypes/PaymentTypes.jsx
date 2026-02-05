import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import DataTableContainer, {
  tableStaticProps,
} from "@/components/ui/TableContainer";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useNavigate } from "react-router-dom";
import usePermissions from "@/hooks/usePermissions";
import { GetAllPaymentTypes } from "@/api/PaymentTypes";
import AddPaymentType from "./components/AddPaymentType";

const PaymentTypes = () => {
  const [loading, setLoading] = useState(false);
  const [types, setTypes] = useState([]);
  const { t } = useTranslation();
  const navigate = useNavigate();

  const perms = usePermissions({
    show: "PaymentType: Ödəniş növləri siyahı görmək",
    create: "PaymentType: Ödəniş növləri yaratmaq",
    update: "PaymentType: Ödəniş növləri yeniləmə",
  });

  const isAllowed = perms.isAllowed("show");
  const hasAny = perms.hasAny(["update"]);

  const getTypes = async () => {
    try {
      setLoading(true);
      const res = await GetAllPaymentTypes();
      setTypes(res.data);
    } catch (error) {
      console.log("error at getTypes at payment types", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!perms.ready) return;
    if (!isAllowed) return navigate("/not-allowed", { replace: true });
    getTypes();
  }, [isAllowed, perms.ready]);

  if (!isAllowed || !perms.ready) return null;
  return (
    <div className="flex flex-col gap-5">
      <div className={`flex items-center justify-between`}>
        <div>
          <p className={`text-[1.5rem] font-bold`}>{t("paymentTypes")}</p>
        </div>
        <div className="flex flex-row gap-2">
          {perms.create && <AddPaymentType onSuccess={getTypes} />}
        </div>
      </div>
      <DataTableContainer>
        <DataTable
          loading={loading}
          value={types}
          {...tableStaticProps}
          lazy={false}
        >
          {["name", "description"].map((f) => {
            return <Column key={f} field={f} header={t(f)} />;
          })}

          {hasAny && (
            <Column
              header={"#"}
              className="w-[100px]"
              body={(data) => (
                <div className="flex flex-row gap-2 items-center">
                  {perms.update && (
                    <AddPaymentType onSuccess={getTypes} currentType={data} />
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

export default PaymentTypes;
