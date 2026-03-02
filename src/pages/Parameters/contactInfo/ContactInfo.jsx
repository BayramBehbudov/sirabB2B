import { DeleteContactDetails, GetAllContactDetails } from "@/api/ContactInfo";
import DataTableContainer, {
  tableStaticProps,
} from "@/components/ui/TableContainer";
import usePermissions from "@/hooks/usePermissions";
import { showToast } from "@/providers/ToastProvider";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import AddContactInfo from "./components/AddContactInfo";
import DeleteConfirm from "@/components/ui/dialogs/DeleteConfirm";

const ContactInfo = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const { t } = useTranslation();
  const navigate = useNavigate();

  const perms = usePermissions({
    show: "CONTACT_DETAILS: CONTACT_DETAILS_LIST",
    create: "CONTACT_DETAILS: CREATE_CONTACT_DETAILS",
    update: "CONTACT_DETAILS: UPDATE_CONTACT_DETAILS",
    delete: "CONTACT_DETAILS: DELETE_CONTACT_DETAILS",
  });

  const isAllowed = perms.isAllowed("show");
  const hasAny = perms.hasAny(["update", "delete"]);

  const getData = async () => {
    try {
      setLoading(true);
      const res = await GetAllContactDetails();
      setData(res.data);
    } catch (error) {
      console.log("error at getData at contact info", error);
    } finally {
      setLoading(false);
    }
  };
  const handleDelete = async (id) => {
    setLoading(true);
    try {
      await DeleteContactDetails(id);
      showToast({
        severity: "success",
        summary: t("success"),
        detail: "",
      });
      getData();
    } catch (error) {
      console.log("error at handleDelete at contact info", error);
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
    getData();
  }, [isAllowed, perms.ready]);

  if (!isAllowed || !perms.ready) return null;
  return (
    <div className="flex flex-col gap-5">
      <div className={`flex items-center justify-between`}>
        <div>
          <p className={`text-[1.5rem] font-bold`}>{t("contactInfo")}</p>
        </div>
        <div className="flex flex-row gap-2">
          {perms.create && <AddContactInfo onSuccess={getData} />}
        </div>
      </div>
      <DataTableContainer>
        <DataTable
          loading={loading}
          value={data}
          {...tableStaticProps}
          totalRecords={data.length}
          lazy={false}
        >
          <Column
            sortable
            field={"whatsAppNumber"}
            header={t("whatsAppNumber")}
          />
          <Column sortable field={"callNumber"} header={t("callNumber")} />
          {hasAny && (
            <Column
              header={"#"}
              style={{ width: "100px" }}
              body={(data) => (
                <div className="flex flex-row gap-2 items-center">
                  {perms.update && (
                    <AddContactInfo onSuccess={getData} currentInfo={data} />
                  )}
                  {perms.delete && (
                    <DeleteConfirm
                      onConfirm={() => handleDelete(data.id)}
                      disabled={loading}
                    />
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

export default ContactInfo;
