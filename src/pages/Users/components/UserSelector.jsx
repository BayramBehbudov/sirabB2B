import { GetAllSystemUsers } from "@/api/Auth";
import ColumnHeaderWithSearch from "@/components/ui/SearchInput";
import DataTableContainer, {
  tableStaticProps,
} from "@/components/ui/TableContainer";
import { showToast } from "@/providers/ToastProvider";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

const UserSelector = ({
  visible,
  onClose,
  selectedUserIds = [],
  handleSelect,
}) => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [filters, setFilters] = useState({});

  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  const [selectedUsers, setSelectedUsers] = useState([]);

  const columns = useMemo(() => ["phoneNumber", "userName"], []);
  const getUsers = async () => {
    try {
      setLoading(true);
      const res = await GetAllSystemUsers({
        pageNumber: 1,
        pageSize: 10000,
      });
      setUsers(res.systemUsers);
      setFilteredUsers(res.systemUsers);
      const preselected = res.systemUsers.filter((c) =>
        selectedUserIds.includes(c.id)
      );
      setSelectedUsers(preselected);
    } catch (error) {
      console.log("error at user selector", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (visible) getUsers();
  }, [visible]);

  useEffect(() => {
    let filtered = [...users];
    Object.entries(filters).forEach(([key, value]) => {
      if (value?.trim()) {
        filtered = filtered.filter((item) =>
          String(item[key] || "")
            .toLowerCase()
            .includes(value.toLowerCase())
        );
      }
    });
    setFilteredUsers(filtered);
  }, [filters, users]);
  const handleClose = () => {
    setSelectedUsers([]);
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
        disabled={selectedUsers.length === 0}
        onClick={() => {
          handleSelect(selectedUsers);
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
          {selectedUsers.length > 0
            ? `${selectedUsers.length} ${t("user")} ${t("selected")}`
            : t("users")}
        </p>
      }
      className="w-[95%]"
      footer={footer}
    >
      <DataTableContainer>
        <DataTable
          loading={loading}
          value={filteredUsers}
          {...tableStaticProps}
          lazy={false}
          selection={selectedUsers}
          onSelectionChange={(e) => setSelectedUsers(e.value)}
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
    </Dialog>
  );
};

export default UserSelector;
