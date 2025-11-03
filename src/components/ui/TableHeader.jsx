import { Calendar } from "primereact/calendar";
import { useTranslation } from "react-i18next";
import { BiSearch } from "react-icons/bi";

const TableHeader = ({
  placeholder = "",
  value = "",
  onChange,
  label = "",
  handleSearch,
}) => {
  const { t } = useTranslation();
  const isDate = label === "date";
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      event.stopPropagation();
      handleSearch?.();
    }
  };
  return (
    <div>
      {label && <div>{label}</div>}
      <div className={`flex items-center mt-[5px]`}>
        {isDate ? (
          <Calendar
            value={value ?? null}
            onChange={(e) => onChange(e.value)}
            onClick={(e) => e.stopPropagation()}
            dateFormat="dd-mm-yy"
            placeholder={t("select")}
            showIcon
            className={`p-inputtext p-0 w-[9rem] text-[4px] ${styles.datePicker}`}
            showButtonBar
          />
        ) : (
          <input
            type="text"
            value={value}
            onChange={(e) => {
              onChange(e.target.value);
            }}
            onClick={(e) => e.stopPropagation()}
            placeholder={placeholder}
            className="p-[6px] box-border rounded-[4px] border border-[#ccc] flex items-center w-[15rem]"
            onKeyDown={handleKeyPress}
          />
        )}
        <div
          className="bg-none border-none cursor-pointer p-[3px]"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleSearch?.();
          }}
        >
          <BiSearch size={18} />
        </div>
      </div>
    </div>
  );
};

export default TableHeader;
