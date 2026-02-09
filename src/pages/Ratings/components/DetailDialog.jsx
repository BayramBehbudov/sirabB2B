import FileScrollView from "@/components/ui/file/FileScrollView";
import DataTableContainer from "@/components/ui/TableContainer";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { useTranslation } from "react-i18next";

const DetailDialog = ({ row, setRow }) => {
  const { t } = useTranslation();

  const onHide = () => {
    setRow(undefined);
  };
  return (
    <Dialog
      header={t("seeOrderDetails", { orderNumber: row?.orderNumber || "" })}
      visible={!!row}
      onHide={onHide}
      modal
      className="w-[90vw] h-[90vh] overflow-auto"
    >
      <div className="flex flex-col gap-5">
        <DataTableContainer>
          <DataTable size="small" value={row?.orderEvaluationDetails || []}>
            {["orderEvaluationTypeName", "rating", "comment"].map((field) => (
              <Column
                className="min-w-[200px]"
                field={field}
                header={t(field)}
              />
            ))}
          </DataTable>
        </DataTableContainer>
        <div className="divider" />
        {row?.orderEvaluationPhotos?.length > 0 ? (
          <FileScrollView
            fields={(row?.orderEvaluationPhotos || [])?.map((item) => {
              return {
                fileName: "",
                base64: item.filePath,
                type: "image/jpeg",
              };
            })}
          />
        ) : (
          <span>{t("noAddedPhotos")}</span>
        )}
      </div>
    </Dialog>
  );
};

export default DetailDialog;
