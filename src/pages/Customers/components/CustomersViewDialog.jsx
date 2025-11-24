import { useState } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useTranslation } from "react-i18next";
import { tableStaticProps } from "@/components/ui/TableContainer";

const CustomersViewDialog = ({ customers = [] }) => {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);
  return (
    <div>
      <Button
        icon="pi pi-users"
        tooltip={t("viewCustomers")}
        tooltipOptions={{ position: "top" }}
        onClick={() => setVisible(true)}
      />

      <Dialog
        header={t("customers")}
        visible={visible}
        modal
        onHide={() => setVisible(false)}
        className="min-w-[700px]"
      >
        <DataTable
          value={customers}
          {...tableStaticProps}
          rows={10}
          lazy={false}
        >
          {[
            "companyName",
            "contactPersonFirstName",
            "contactPersonLastName",
            "email",
            "taxId",
            "phoneNumber",
          ].map((i) => {
            return <Column field={i} header={t(i)} />;
          })}
        </DataTable>
      </Dialog>
    </div>
  );
};

export default CustomersViewDialog;
