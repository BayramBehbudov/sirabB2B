import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { useTranslation } from "react-i18next";

const OrderDetails = ({ visible, onHide, selectedOrder }) => {
  const { t } = useTranslation();

  return (
    <Dialog
      header={t("orderDetails", {
        orderCode: selectedOrder?.orderInfo?.orderNumber ?? "",
      })}
      visible={visible}
      onHide={onHide}
      className="min-w-1/2"
    >
      <div>
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
