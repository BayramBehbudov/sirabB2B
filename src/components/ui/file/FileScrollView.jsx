import { Button } from "primereact/button";
import { Image } from "primereact/image";
import { useTranslation } from "react-i18next";

const FileScrollView = ({ fields, handleRemove }) => {
  const { t } = useTranslation();

  const renderPreview = (field) => {
    const type = field.type || "";

    if (type.startsWith("image/")) {
      return (
        <Image
          src={field.base64}
          alt={field.fileName}
          width="150"
          height="150"
          preview
          className="rounded-md shadow-md object-cover"
        />
      );
    } else if (type === "application/pdf") {
      return (
        <div className="flex flex-col items-center justify-center w-[150px] h-full min-h-[150px] bg-gray-100 rounded-md shadow-md">
          <i className="pi pi-file-pdf text-red-500 !text-5xl " />
          <span className="text-xl font-semibold text-gray-600 mt-2">PDF</span>
        </div>
      );
    } else if (
      type === "application/msword" ||
      type ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      return (
        <div className="flex flex-col items-center justify-center w-[150px] h-full min-h-[150px] bg-gray-100 rounded-md shadow-md">
          <i className="pi pi-file-word text-blue-500 !text-5xl" />
          <span className="text-xl font-semibold text-gray-600 mt-2">DOC</span>
        </div>
      );
    } else {
      return (
        <div className="flex flex-col items-center justify-center w-[150px] h-full min-h-[150px] bg-gray-100 rounded-md shadow-md">
          <i className="pi pi-file text-gray-400 !text-5xl" />
          <span className="text-xl font-semibold text-gray-600 mt-2">
            {t("file")}
          </span>
        </div>
      );
    }
  };

  if (!fields || fields.length === 0) return null;
  return (
    <div
      className="flex flex-nowrap gap-3 overflow-x-auto p-2 border border-gray-200 rounded-md max-w-full"
      style={{ scrollbarWidth: "thin" }}
    >
      {fields.map((field, index) => (
        <div
          key={field.fileName + index}
          className="relative overflow-hidden flex flex-col items-center border rounded-md justify-between w-[150px] flex-shrink-0"
        >
          {renderPreview(field)}

          <div className="flex flex-row items-center justify-between w-full mt-1 px-1 text-sm text-gray-700">
            <span className="truncate max-w-[110px]" title={field.fileName}>
              {field.fileName}
            </span>

            {handleRemove && (
              <Button
                icon="pi pi-times"
                className="p-button-rounded p-button-text p-button-danger !w-6 !h-6"
                onClick={() => {
                  handleRemove(index);
                }}
                tooltip={t("remove")}
              />
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default FileScrollView;
