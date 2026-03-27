import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Mention } from "primereact/mention";
import { useState } from "react";

const ControlledMention = ({
  control,
  name,
  label,
  placeholder,
  variables,
  className,
  classNameContainer = "",
  autoResize = false,
  rows = 5,
  type = "textarea",
}) => {
  const { t } = useTranslation();
  const [suggestions, setSuggestions] = useState([]);
  const itemTemplate = (suggestion) => {
    return <span className="font-medium">{suggestion.label}</span>;
  };
  const onSearch = (event) => {
    const query = event.query.toLowerCase();
    const filtered = variables.filter((v) =>
      v.label.toLowerCase().includes(query),
    );
    setSuggestions(filtered);
  };
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState: { error } }) => (
        <div className={`flex flex-col gap-1 ${classNameContainer}`}>
          {label && <label className="font-semibold ">{label}:</label>}
          <Mention
            {...field}
            placeholder={placeholder}
            panelStyle={{ maxWidth: 100 }}
            inputClassName={`${error ? "p-invalid" : ""} ${className} !text-black`}
            autoResize={autoResize}
            rows={rows}
            suggestions={suggestions}
            type={type}
            trigger="{"
            field={"value"}
            itemTemplate={itemTemplate}
            onSearch={onSearch}
          />
          {error && <small className="p-error">{t(error.message)}</small>}
        </div>
      )}
    />
  );
};

export default ControlledMention;
