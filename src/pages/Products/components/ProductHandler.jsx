import { Fragment, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import ProductSelectorDialog from "./ProductSelectorDialog";
import { Controller } from "react-hook-form";

const ProductHandler = ({ name, control, disabledIds = [] }) => {
  const [show, setShow] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { t } = useTranslation();
  const btnRef = useRef(null);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value }, fieldState: { error } }) => {
        return (
          <Fragment>
            <div className="flex flex-col gap-1">
              <label className="font-semibold">{t("product")}:</label>
              <button
                ref={btnRef}
                className={`flex items-center w-[200px] justify-between border rounded-md px-3 py-2 cursor-pointer select-none transition-all duration-200 hover:border-primary ${
                  error ? "border-red-500" : "border-gray-300"
                }`}
                onClick={() => setShow(true)}
              >
                <span
                  className={`${
                    value === 0 ? "text-gray-400" : "text-gray-800"
                  } line-clamp-1 font-normal`}
                >
                  {value > 0
                    ? selectedProduct
                      ? `${selectedProduct?.name}`
                      : `1 ${t("product")} ${t("selected")}`
                    : t("select")}
                </span>
                <span className="pi pi-chevron-down"></span>
              </button>

              {error && <small className="p-error">{t(error.message)}</small>}
            </div>

            <ProductSelectorDialog
              visible={show}
              onClose={() => setShow(false)}
              handleSelect={(selected) => {
                setSelectedProduct(selected[0]);
                onChange(selected[0]?.id || 0);
                if (btnRef.current) {
                  btnRef.current.focus();
                }
              }}
              defaultSelected={value && value > 0 ? [{ id: value }] : []}
              selectionMode="single"
              disabledIds={disabledIds}
            />
          </Fragment>
        );
      }}
    />
  );
};

export default ProductHandler;
