import { InputText } from "primereact/inputtext";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const ColumnHeaderWithSearch = ({
  label,
  value,
  onChange,
  debounce = 200,
  className = "",
}) => {
  const [inputValue, setInputValue] = useState(value || "");
  const { t } = useTranslation();
  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(inputValue);
    }, debounce);

    return () => clearTimeout(timeout);
  }, [inputValue]);

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <span className="font-medium">{label}</span>
      <InputText
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        className="p-inputtext-sm"
        placeholder={t("search")}
      />
    </div>
  );
};

export default ColumnHeaderWithSearch;
