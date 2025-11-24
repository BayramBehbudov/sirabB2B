import { Dropdown } from "primereact/dropdown";
import React, { useEffect, useState } from "react";
import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { getAllCustomerGroup } from "@/api/B2BCustomerGroup";

const CustomerGroupSelector = ({ control }) => {
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
      name="customerGroupId"
      control={control}
      render={({ field, fieldState: { error } }) => (
        <div className={`flex flex-col gap-1 w-[250px]`}>
          <label className={`font-semibold`}>{t("customerGroup")}</label>
          <Dropdown
            {...field}
            options={groups.map((group) => ({
              name: group.name,
              value: group.id,
            }))}
            loading={loading}
            optionLabel="name"
            placeholder={t("customerGroup")}
            className={error ? "p-invalid" : ""}
          />
          {error && <small className="p-error">{t(error.message)}</small>}
        </div>
      )}
    />
  );
};

export default CustomerGroupSelector;
