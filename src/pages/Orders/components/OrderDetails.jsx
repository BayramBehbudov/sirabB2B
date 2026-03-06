import MapController from "@/components/MapController";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { useTranslation } from "react-i18next";
const addOptions = [
  {
    icon: "pi-tag",
    labelKey: "addressTitle",
    field: "customerDeliveryAddressTitle",
  },
  {
    icon: "pi-building",
    labelKey: "city",
    field: "customerDeliveryAddressCity",
  },
  {
    icon: "pi-compass",
    labelKey: "district",
    field: "customerDeliveryAddressDistrict",
  },
  {
    icon: "pi-envelope",
    labelKey: "postalCode",
    field: "customerDeliveryAddressPostalCode",
  },
  {
    icon: "pi-map",
    labelKey: "addressLine",
    field: "customerDeliveryAddressLine",
  },
];
const OrderDetails = ({ visible, onHide, selectedOrder }) => {
  const { t } = useTranslation();

  return (
    <Dialog
      header={t("seeOrderDetails", {
        orderNumber: selectedOrder?.orderInfo?.orderNumber ?? "",
      })}
      visible={visible}
      onHide={onHide}
      className="min-w-1/2"
    >
      <div className={`flex flex-col gap-4`}>
        <div
          className={`rounded-xl border border-slate-200 bg-slate-50 p-4 flex flex-col gap-4`}
        >
          <div
            className={`grid grid-cols-1 md:grid-cols-3 sm:grid-cols-2 gap-4`}
          >
            {addOptions.map(({ icon, labelKey, field }) => (
              <div key={labelKey} className={`flex flex-col gap-0.5`}>
                <span
                  className={`flex items-center gap-1.5 text-xs font-medium text-slate-400 uppercase tracking-wide`}
                >
                  <i className={`pi ${icon} text-[10px] text-blue-500`} />
                  {t(labelKey)}
                </span>
                <span className={`text-sm font-medium text-slate-700`}>
                  {selectedOrder?.customerDeliveryAddressInfo?.[field] || "—"}
                </span>
              </div>
            ))}
            <MapController
              locX={
                selectedOrder?.customerDeliveryAddressInfo
                  ?.customerDeliveryAddressLoc_X
              }
              locY={
                selectedOrder?.customerDeliveryAddressInfo
                  ?.customerDeliveryAddressLoc_Y
              }
              isShow={true}
              btnProps={{
                tooltip: t("viewOnMap"),
                label: undefined,
                size: "small",
                className: "p-1!",
              }}
            />
          </div>
        </div>
        <DataTable
          value={selectedOrder?.productsInfo ?? []}
          removableSort
          paginator
          rows={10}
          rowsPerPageOptions={[10, 25, 50]}
          emptyMessage={t("dataNotFound")}
        >
          {[
            { field: "productCategoryName", label: "category" },
            { field: "productName", label: "name" },
            { field: "productPrice", label: "price" },
            { field: "productQuantity", label: "quantity" },
            { field: "productUnitName", label: "unit" },
          ].map((item, index) => (
            <Column
              key={index}
              field={item.field}
              header={t(item.label)}
              sortable
            />
          ))}
        </DataTable>
      </div>
    </Dialog>
  );
};

export default OrderDetails;
