import { GetNotificationTypes } from "@/api/Notification";
import DataTableContainer, {
  tableStaticProps,
} from "@/components/ui/TableContainer";
import TableHeader from "@/components/ui/TableHeader";
import usePermissions from "@/hooks/usePermissions";
import NotAllowed from "@/pages/404/NotAllowed";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { Fragment, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

const defaultFilters = {
  pageNumber: 1,
  pageSize: 10,
  order: "",
  orderColumn: "",
  searchList: [],
};

const NotificationTypeSelector = ({
  value,
  error,
  mode = "single",
  handleSelect,
}) => {
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState([]);
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState(defaultFilters);
  const [totalRecords, setTotalRecords] = useState(0);

  const { t } = useTranslation();
  const btnRef = useRef(null);
  const perms = usePermissions({
    show: "NOTIFICATION_TYPE: NOTIFICATION_TYPE_LIST",
  });

  const isAllowed = perms.isAllowed("show");

  const getTypes = async (payload = filter) => {
    setLoading(true);
    try {
      const response = await GetNotificationTypes(payload);
      setTypes(response.notificationTypes);
      setTotalRecords(response.pageInfo.totalItems);
    } catch (error) {
      console.log("error at get notificattion types", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (!perms.ready || !visible || !isAllowed) return;
    getTypes();
  }, [isAllowed, perms.ready, visible]);

  useEffect(() => {
    if (visible && Array.isArray(value)) {
      const mappedValue = value.map((v) =>
        typeof v === "object" && v !== null ? v : { id: v },
      );
      setSelected(mappedValue);
    }
  }, [visible, value]);

  const handleClose = () => {
    setFilter(defaultFilters);
    setVisible(false);
  };

  const footer = (
    <div className="flex justify-end gap-2 mt-4">
      {selected.length > 0 && (
        <Button
          label={t("clear")}
          icon="pi pi-times"
          className="p-button-text"
          onClick={() => {
            setSelected([]);
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
          handleSelect(selected);
          handleClose();
        }}
      />
    </div>
  );

  return (
    <Fragment>
      <div className="flex flex-col gap-1">
        <label className="font-semibold">{t("notificationType")}:</label>
        <button
          ref={btnRef}
          className={`flex items-center w-[200px] justify-between border rounded-md px-3 py-2 cursor-pointer select-none transition-all duration-200 hover:border-primary ${
            error ? "border-red-500" : "border-gray-300"
          }`}
          onClick={() => setVisible(true)}
        >
          <span
            className={`${
              value?.length === 0 ? "text-gray-400" : "text-gray-800"
            } line-clamp-1 font-normal`}
          >
            {value?.length > 0
              ? t("typeSelectedCount", { count: value?.length })
              : t("selectType")}
          </span>
          <span className="pi pi-chevron-down"></span>
        </button>

        {error && <small className="p-error">{t(error.message)}</small>}
      </div>
      <Dialog
        visible={visible}
        onHide={handleClose}
        header={
          <p className={`text-[1.5rem] font-bold`}>
            {selected.length > 0
              ? t("typeSelectedCount", { count: selected.length })
              : t("notificationType")}
          </p>
        }
        className="w-[95%]"
        footer={footer}
      >
        {isAllowed ? (
          <DataTableContainer>
            <DataTable
              value={types}
              loading={loading}
              {...tableStaticProps}
              first={filter.pageNumber * filter.pageSize - filter.pageSize}
              totalRecords={totalRecords}
              rows={filter.pageSize}
              dataKey={`id`}
              onPage={(e) => {
                const newPage = {
                  pageNumber: e.page + 1,
                  pageSize: e.rows,
                };
                setFilter((p) => {
                  const newFilter = { ...p, ...newPage };
                  getTypes(newFilter);
                  return newFilter;
                });
              }}
              selection={
                mode === "single"
                  ? selected.length > 0
                    ? selected[0]
                    : null
                  : selected
              }
              onSelectionChange={(e) => {
                if (mode === "single") {
                  setSelected(e.value ? [e.value] : []);
                } else {
                  setSelected(e.value);
                }
              }}
            >
              <Column selectionMode={mode} headerStyle={{ width: "3rem" }} />
              {[
                { field: "name", label: "name" },
                { field: "soundFileName", label: "soundFileName" },
              ].map(({ field, label }) => {
                return (
                  <Column
                    field={field}
                    header={() => {
                      return (
                        <TableHeader
                          type={"text"}
                          onChange={(v) => {
                            setFilter((prev) => {
                              const newFilter = { ...prev };
                              newFilter.searchList =
                                newFilter.searchList.filter(
                                  (item) => item.colName !== field,
                                );
                              if (v) {
                                newFilter.searchList.push({
                                  colName: field,
                                  value: v,
                                });
                              }
                              return newFilter;
                            });
                          }}
                          label={t(label)}
                          placeholder={t("search")}
                          value={
                            filter.searchList.find(
                              (item) => item.colName === field,
                            )?.value
                          }
                          sort={
                            filter.orderColumn === field ? filter.order : ""
                          }
                          handleSort={(s) => {
                            setFilter((prev) => {
                              const newFilter = { ...prev };
                              newFilter.orderColumn = field;
                              newFilter.order = s;
                              getTypes(newFilter);
                              return newFilter;
                            });
                          }}
                        />
                      );
                    }}
                    handleSearch={getTypes}
                  />
                );
              })}
            </DataTable>
          </DataTableContainer>
        ) : (
          <NotAllowed showBackBtn={false} />
        )}
      </Dialog>
    </Fragment>
  );
};

export default NotificationTypeSelector;
