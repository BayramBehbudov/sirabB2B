import { Controller } from "react-hook-form";
import { Calendar } from "primereact/calendar";
import { useTranslation } from "react-i18next";
import { formatDateToBakuTimeZone } from "@/helper/DateFormatter";

const ControlledCalendar = ({
  control,
  name,
  label,
  placeholder,
  className,
  dateFormat = "yy-mm-dd",
  showIcon = true,
  showTime = true,
  hideOnDateTimeSelect = true,
  minDate,
  maxDate,
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
              if (!e.value) {
                field.onChange("");
                return;
              }
              const date = formatDateToBakuTimeZone(e.value);
              field.onChange(date);
            }}
            placeholder={placeholder}
            showIcon={showIcon}
            dateFormat={dateFormat}
            showTime={showTime}
            hideOnDateTimeSelect={hideOnDateTimeSelect}
            minDate={minDate}
            maxDate={maxDate}
            className={`${error ? "p-invalid" : ""} ${className}`}
          />
          {error && <small className="p-error">{t(error.message)}</small>}
        </div>
      )}
    />
  );
};

export default ControlledCalendar;
