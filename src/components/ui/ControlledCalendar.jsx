import { Controller } from "react-hook-form";
import { Calendar } from "primereact/calendar";
import { useTranslation } from "react-i18next";

const ControlledCalendar = ({
  control,
  name,
  label,
  placeholder,
  className,
  showIcon = true,
  dateFormat = "yy-mm-dd",
}) => {
  const { t } = useTranslation();
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState: { error } }) => (
        <div className="flex flex-col gap-1">
          {label && <label className="font-semibold">{label}:</label>}
          <Calendar
            {...field}
            value={field.value ? new Date(field.value) : null}
            onChange={(e) => {
              field.onChange(e.value.toISOString());
            }}
            placeholder={placeholder}
            showIcon={showIcon}
            dateFormat={dateFormat}
            className={`${error ? "p-invalid" : ""} ${className}`}
          />
          {error && <small className="p-error">{t(error.message)}</small>}
        </div>
      )}
    />
  );
};

export default ControlledCalendar;
