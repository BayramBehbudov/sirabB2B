import { Controller } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { useTranslation } from "react-i18next";
import { InputTextarea } from "primereact/inputtextarea";

const ControlledInput = ({
  control,
  name,
  placeholder,
  type = "text",
  label,
  className,
  avtoValue,
  rows = 5,
  autoResize = false,
  classNameContainer = "",
}) => {
  const { t } = useTranslation();
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState: { error } }) => (
        <div className={`flex flex-col gap-1 ${classNameContainer}`}>
          {label && <label className="font-semibold">{label}:</label>}
          {type === "textarea" ? (
            <InputTextarea
              {...field}
              placeholder={placeholder}
              className={`${error ? "p-invalid" : ""} ${className}`}
              onFocus={() => {
                if (avtoValue && !field.value) {
                  field.onChange(avtoValue);
                }
              }}
              autoResize={autoResize}
              rows={rows}
            />
          ) : (
            <InputText
              {...field}
              placeholder={placeholder}
              type={type}
              className={`${error ? "p-invalid" : ""} ${className}`}
              onFocus={() => {
                if (avtoValue && !field.value) {
                  field.onChange(avtoValue);
                }
              }}
            />
          )}
          {error && <small className="p-error">{t(error.message)}</small>}
        </div>
      )}
    />
  );
};

export default ControlledInput;
