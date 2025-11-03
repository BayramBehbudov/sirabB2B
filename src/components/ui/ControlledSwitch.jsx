import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { InputSwitch } from "primereact/inputswitch";

const ControlledSwitch = ({ control, name, label, tooltip }) => {
  const { t } = useTranslation();
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState: { error } }) => (
        <div className="flex flex-col gap-1">
          {label && <label className="font-semibold">{label}:</label>}
          <InputSwitch
            tooltip={
              tooltip ? tooltip : field.value ? t("deactive") : t("active")
            }
            tooltipOptions={{ position: "top" }}
            checked={field.value}
            {...field}
          />
          {error && <small className="p-error">{t(error.message)}</small>}
        </div>
      )}
    />
  );
};

export default ControlledSwitch;
