import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const SearchInput = ({
  value,
  onChange,
  debounce = 150,
  className = "",
  classNameInput = "",
  handleSearch = () => {},
  showSearch = true,
  placeholder = "",
}) => {
  const [inputValue, setInputValue] = useState(value || "");
  const { t } = useTranslation();
  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(inputValue);
    }, debounce);

    return () => clearTimeout(timeout);
  }, [inputValue]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div
      className={`flex flex-row gap-1 ${className}`}
      onKeyDown={handleKeyDown}
    >
      <InputText
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        className={`w-[250px] ${classNameInput}`}
        placeholder={placeholder || t("search")}
      />
      {showSearch && (
        <Button icon={"pi pi-search"} onClick={() => handleSearch()} />
      )}
    </div>
  );
};

export default SearchInput;
