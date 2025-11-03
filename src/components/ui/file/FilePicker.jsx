import React, { useRef } from "react";
import { useTranslation } from "react-i18next";

const FilePicker = ({
  label = "",
  value = [],
  onChange,
  error,
  placeholder = "",
  accept, // Məsələn: "image/*,application/pdf"
  className = "",
  multiple = true,
}) => {
  const inputRef = useRef(null);
  const { t } = useTranslation();
  const handleFiles = async (files) => {
    if (!files) return;
    const fileArray = Array.from(files);

    const processedFiles = await Promise.all(
      fileArray.map(
        (file) =>
          new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = () =>
              resolve({
                name: file.name,
                size: file.size,
                type: file.type,
                lastModified: file.lastModified,
                base64: reader.result,
              });
            reader.readAsDataURL(file);
          })
      )
    );

    onChange(processedFiles);
  };

  return (
    <div className="flex flex-col gap-1">
      {label && <label className="font-semibold">{label}</label>}

      <button
        onClick={() => inputRef.current?.click()}
        className={`flex items-center w-[200px] justify-between border rounded-md px-3 py-2 cursor-pointer select-none transition-all duration-200 hover:border-primary ${
          error ? "border-red-500" : "border-gray-300"
        } ${className}`}
      >
        <span
          className={`${
            value.length === 0 ? "text-gray-400" : "text-gray-800"
          } line-clamp-1 font-normal`}
        >
          {value.length > 0
            ? `${value.length} ${t("file")} ${t("selected")}`
            : placeholder
            ? placeholder
            : t("addFiles")}
        </span>
        <span className="pi pi-upload text-gray-500"></span>
      </button>

      {error && <small className="p-error">{t(error.message)}</small>}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  );
};

export default FilePicker;
