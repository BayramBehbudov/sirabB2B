import { getB2BCustomers } from "@/api/B2BCustomer";
import SearchInput from "@/components/ui/SearchInput";
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
  mode = "multiple",
  required = true,
}) => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [filters, setFilters] = useState({});
  const { t } = useTranslation();
  const perms = usePermissions({
    show: "B2BCUSTOMER: B2BCUSTOMER_LIST",
  });

  const isAllowed = perms.isAllowed("show");
  const columns = useMemo(
    () => [
      "companyName",
      "contactPersonFirstName",
      "contactPersonLastName",
      "custmerGrupName",
      "email",
      "erpId",
      "phoneNumber",
      "taxId",
    ],
    [],
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
        selectedCustomerIds.includes(c.b2BCustomerId),
      );
      setSelectedCustomers(
        mode === "single" ? preselected.slice(0, 1) : preselected,
      );
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
            .includes(value.toLowerCase()),
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
      {selectedCustomers.length > 0 && !required && (
        <Button
          label={t("clear")}
          icon="pi pi-times"
          className="p-button-text"
          onClick={() => {
            setSelectedCustomers([]);
            setFilters({});
          }}
        />
      )}
      <Button
        label={t("close")}
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
            ? t("customerSelectedCount", { count: selectedCustomers.length })
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
            selection={
              mode === "single"
                ? selectedCustomers.length > 0
                  ? selectedCustomers[0]
                  : null
                : selectedCustomers
            }
            onSelectionChange={(e) => {
              if (mode === "single") {
                setSelectedCustomers(e.value ? [e.value] : []);
              } else {
                setSelectedCustomers(e.value);
              }
            }}
          >
            <Column selectionMode={mode} headerStyle={{ width: "3rem" }} />

            {columns.map((f) => {
              return (
                <Column
                  key={f}
                  field={f}
                  header={
                    <SearchInput
                      placeholder={t(f)}
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
