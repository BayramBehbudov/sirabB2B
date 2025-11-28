import React, { useEffect, useState } from "react";
import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { getAllCustomerGroup } from "@/api/B2BCustomerGroup";
import { MultiSelect } from "primereact/multiselect";
import usePermissions from "@/hooks/usePermissions";

//  müştəri qruplarının idlərini arrayda qaytarır
const CustomerGroupMultiSelector = ({ control, fieldName, trigger }) => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const perms = usePermissions({
    show: "B2BCustomerGroup: Müştəri qrupu siyahısı",
  });
  const isAllowed = perms.isAllowed("show");

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
    if (!perms.ready || !isAllowed) return;
    getGroups();
  }, [isAllowed, perms.ready]);
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
            emptyMessage={isAllowed ? t("dataNotFound") : t("notPermForList")}
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
