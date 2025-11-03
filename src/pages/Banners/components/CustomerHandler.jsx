import CustomerSelectorDialog from "@/pages/Customers/components/CustomerSelectorDialog";
import { Fragment, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

const CustomerHandler = ({ error, value, setValue }) => {
  const [showCustomers, setShowCustomers] = useState(false);
  const { t } = useTranslation();
  const btnRef = useRef(null);

  return (
    <Fragment>
      <div className="flex flex-col gap-1">
        <label className="font-semibold">{t("customerSelect")}:</label>
        <button
          ref={btnRef}
          className={`flex items-center w-[200px] justify-between border rounded-md px-3 py-2 cursor-pointer select-none transition-all duration-200 hover:border-primary ${
            error ? "border-red-500" : "border-gray-300"
          }`}
          onClick={() => setShowCustomers(true)}
        >
          <span
            className={`${
              value.length === 0 ? "text-gray-400" : "text-gray-800"
            } line-clamp-1 font-normal`}
          >
            {value.length > 0
              ? `${value.length} ${t("customer")} ${t("selected")}`
              : t("customerSelect")}
          </span>
          <span className="pi pi-chevron-down"></span>
        </button>

        {error && <small className="p-error">{t(error.message)}</small>}
      </div>

      <CustomerSelectorDialog
        visible={showCustomers}
        onClose={() => setShowCustomers(false)}
        handleSelect={(customers) => {
          const ids = customers.map((c) => c.b2BCustomerId);
          setValue("b2BCustomerIds", ids);
          if (btnRef.current) {
            btnRef.current.focus();
          }
        }}
        selectedCustomerIds={value}
      />
    </Fragment>
  );
};

export default CustomerHandler;
