import FilePicker from "@/components/ui/file/FilePicker";
import FileScrollView from "@/components/ui/file/FileScrollView";
import { useFieldArray } from "react-hook-form";
import { useTranslation } from "react-i18next";

const ImageControllerForProduct = ({ control, errors }) => {
  const { t } = useTranslation();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "productImages",
    keyName: "fieldId",
  });
  return (
    <div className="flex flex-col gap-6 border p-3 rounded-md border-gray-200">
      <FilePicker
        label={t("images")}
        onChange={(files) => {
          const formatted = files.map((file) => {
            return {
              fileName: file.name,
              base64: file.base64,
              type: file.type,
            };
          });
          append(formatted);
        }}
        error={errors.productImages}
        value={fields}
        accept={"image/*"}
      />
      <FileScrollView fields={fields} handleRemove={remove} />
    </div>
  );
};

export default ImageControllerForProduct;
