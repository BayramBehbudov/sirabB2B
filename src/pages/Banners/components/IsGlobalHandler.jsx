import { Dropdown } from "primereact/dropdown";
import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";

const IsGlobalHandler = ({ control, setValue }) => {
  const { t } = useTranslation();
  return (
    <Controller
      control={control}
      name={"isGlobal"}
      render={({ field, fieldState: { error } }) => {
        return (
          <div className="flex flex-col gap-1">
            <label className="font-semibold">{t("customerType")}:</label>
            <Dropdown
              value={field.value}
              onChange={(e) => {
                field.onChange(e.value);
                if (e.value) {
                  setValue("b2BCustomerIds", []);
                }
              }}
              options={[
                { label: t("allCustomers"), value: true },
                { label: t("selectedCustomers"), value: false },
              ]}
              placeholder={t("customerType")}
              className={`${error ? "p-invalid" : ""} w-[200px]`}
            />
            {error && <small className="p-error">{t(error.message)}</small>}
          </div>
        );
      }}
    />
  );
};

export default IsGlobalHandler;
