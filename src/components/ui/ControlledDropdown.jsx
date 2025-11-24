import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Dropdown } from "primereact/dropdown";

const ControlledDropdown = ({
  control,
  name,
  label,
  placeholder,
  showIcon = true,
  options = [], // [{ value: "a", label: "b" }] nümunə, b göstərir a qaytarır
  className = "",
}) => {
  const { t } = useTranslation();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState: { error } }) => (
        <div className="flex flex-col gap-1">
          {label && <label className="font-semibold">{label}:</label>}
          <Dropdown
            style={{ width: "200px", ...(error ? { border: "1px solid #ff0000" } : {} )}}
            options={options}
            placeholder={placeholder || t("select")}
            onChange={(v) => {
              field.onChange(v.value);
            }}
            value={field.value}
            showClear={showIcon}
            className={className}
          />
          {error && <small className="p-error">{t(error.message)}</small>}
        </div>
      )}
    />
  );
};

export default ControlledDropdown;
