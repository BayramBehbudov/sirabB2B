import { formatDateToBakuTimeZone } from "@/helper/DateFormatter";
import { Calendar } from "primereact/calendar";
import { InputText } from "primereact/inputtext";
import { useTranslation } from "react-i18next";
import { BiSearch, BiSortAlt2, BiSortDown, BiSortUp } from "react-icons/bi";

const TableHeader = ({
  placeholder = "",
  value = "",
  onChange,
  label = "",
  handleSearch,
  type = "text",
  sort = "",
  handleSort,
}) => {
  const { t } = useTranslation();
  const isDate = type === "date";
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      event.stopPropagation();
      handleSearch?.();
    }
  };
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2 ">
        <p className="w-[15rem] m-0 p-0">{label}</p>
        <button
          onClick={() => {
            handleSort?.(sort === "asc" ? "desc" : "asc");
          }}
          className="p-1 rounded no-focus"
        >
          {sort ? (
            sort === "asc" ? (
              <BiSortDown size={20} color="#2196F3" />
            ) : (
              <BiSortUp size={20} color="#2196F3" />
            )
          ) : (
            <BiSortAlt2 size={20} />
          )}
        </button>
      </div>
      <div className={`flex items-center gap-2`}>
        {isDate ? (
          <Calendar
            value={value ? new Date(value) : null}
            onChange={(e) => {
              onChange(e.value || "");
            }}
            onClick={(e) => e.stopPropagation()}
            dateFormat="dd-mm-yy"
            placeholder={t("select")}
            showIcon
            showButtonBar
            showTime
            hideOnDateTimeSelect
            className={`w-[15rem]`}
          />
        ) : (
          <InputText
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onClick={(e) => e.stopPropagation()}
            placeholder={placeholder}
            className="p-[6px] box-border rounded-[4px] border border-[#ccc] flex items-center w-[15rem]"
            onKeyDown={handleKeyPress}
          />
        )}

        <button
          className="p-1 rounded no-focus"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleSearch?.();
          }}
        >
          <BiSearch size={20} />
        </button>
      </div>
    </div>
  );
};

export default TableHeader;
