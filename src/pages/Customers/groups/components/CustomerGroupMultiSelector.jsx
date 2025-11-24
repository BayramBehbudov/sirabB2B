import React, { useEffect, useState } from "react";
import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { getAllCustomerGroup } from "@/api/B2BCustomerGroup";
import { MultiSelect } from "primereact/multiselect";

//  müştəri qruplarının idlərini arrayda qaytarır
const CustomerGroupMultiSelector = ({ control, fieldName, trigger }) => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  const getGroups = async () => {
    try {
      setLoading(true);
      const response = await getAllCustomerGroup();
      if (response.length) {
        setGroups(response);
      }
    } catch (error) {
      console.log("error at getGroups", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getGroups();
  }, []);

  return (
    <Controller
      name={fieldName}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <div className={`flex flex-col gap-1 w-[200px]`}>
          <label className={`font-semibold`}>{t("customerGroup")}</label>
          <MultiSelect
            {...field}
            onChange={(v) => {
              field.onChange(v.value, { shouldValidate: true });
              trigger?.(["b2BCustomerIds", "b2BCustomerGroupIds"]);
            }}
            options={groups.map((group) => ({
              label: group.name,
              value: group.id,
            }))}
            display="chip"
            loading={loading}
            placeholder={t("select")}
            className={error ? "p-invalid" : ""}
            filter
            showClear
            showSelectAll={false}
          />
          {error && <small className="p-error">{t(error.message)}</small>}
        </div>
      )}
    />
  );
};

export default CustomerGroupMultiSelector;
