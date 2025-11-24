import { getB2BCustomers } from "@/api/B2BCustomer";
import ColumnHeaderWithSearch from "@/components/ui/SearchInput";
import DataTableContainer, {
  tableStaticProps,
} from "@/components/ui/TableContainer";
import usePermissions from "@/hooks/usePermissions";
import NotAllowed from "@/pages/404/NotAllowed";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

const CustomerSelectorDialog = ({
  visible,
  onClose,
  selectedCustomerIds = [],
  handleSelect,
}) => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [filters, setFilters] = useState({});
  const { t } = useTranslation();
  const perms = usePermissions({
    show: "B2BMüştərilər: Müştərilər listi",
  });

  const isAllowed = perms.isAllowed("show");
  const columns = useMemo(
    () => [
      "companyName",
      "contactPersonFirstName",
      "contactPersonLastName",
      "customerGroupId",
      "email",
      "erpId",
      "phoneNumber",
      "taxId",
    ],
    []
  );

  const getCustomers = async () => {
    try {
      setLoading(true);
      const res = await getB2BCustomers({
        pageNumber: 1,
        pageSize: 10000,
      });
      setCustomers(res.b2BCustomers);
      setFilteredCustomers(res.b2BCustomers);
      const preselected = res.b2BCustomers.filter((c) =>
        selectedCustomerIds.includes(c.b2BCustomerId)
      );
      setSelectedCustomers(preselected);
    } catch (error) {
      console.log("error at getCustomers", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (!isAllowed) return;
    if (visible) getCustomers();
  }, [visible]);

  useEffect(() => {
    let filtered = [...customers];
    Object.entries(filters).forEach(([key, value]) => {
      if (value?.trim()) {
        filtered = filtered.filter((item) =>
          String(item[key] || "")
            .toLowerCase()
            .includes(value.toLowerCase())
        );
      }
    });
    setFilteredCustomers(filtered);
  }, [filters, customers]);

  const handleClose = () => {
    setSelectedCustomers([]);
    setFilters({});
    onClose();
  };

  const footer = (
    <div className="flex justify-end gap-2 mt-4">
      <Button
        label={t("cancel")}
        icon="pi pi-times"
        className="p-button-text"
        onClick={handleClose}
      />
      <Button
        label={t("confirm")}
        icon="pi pi-check"
        onClick={() => {
          handleSelect(selectedCustomers);
          handleClose();
        }}
      />
    </div>
  );

  if (!visible) return null;
  return (
    <Dialog
      visible={visible}
      onHide={handleClose}
      header={
        <p className={`text-[1.5rem] font-bold`}>
          {selectedCustomers.length > 0
            ? `${selectedCustomers.length} ${t("customer")} ${t("selected")}`
            : t("customers")}
        </p>
      }
      className="w-[95%]"
      footer={footer}
    >
      {isAllowed ? (
        <DataTableContainer>
          <DataTable
            loading={loading}
            value={filteredCustomers}
            {...tableStaticProps}
            lazy={false}
            selection={selectedCustomers}
            onSelectionChange={(e) => setSelectedCustomers(e.value)}
          >
            <Column selectionMode="multiple" headerStyle={{ width: "3rem" }} />

            {columns.map((f) => {
              return (
                <Column
                  key={f}
                  field={f}
                  header={
                    <ColumnHeaderWithSearch
                      label={t(f)}
                      value={filters[f] || ""}
                      onChange={(val) =>
                        setFilters((prev) => ({ ...prev, [f]: val }))
                      }
                    />
                  }
                />
              );
            })}
          </DataTable>
        </DataTableContainer>
      ) : (
        <NotAllowed showBackBtn={false} />
      )}
    </Dialog>
  );
};

export default CustomerSelectorDialog;
