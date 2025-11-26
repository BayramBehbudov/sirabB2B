import ControlledSwitch from "@/components/ui/ControlledSwitch";
import ProductHandler from "@/pages/Products/components/ProductHandler";
import { Button } from "primereact/button";
import { InputNumber } from "primereact/inputnumber";
import { Controller, useFieldArray } from "react-hook-form";
import { useTranslation } from "react-i18next";

const DiscountConditionPriceController = ({ control, formPrices }) => {
  const { t } = useTranslation();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "discountConditionLines",
    keyName: "fieldId",
  });

  return (
    <div className="flex flex-col gap-3 border p-3 rounded-md border-gray-200">
      <label className="font-bold">{t("prices")}:</label>
      <div className="flex flex-col gap-2 flex-wrap">
        {fields.map((item, index) => {
          return (
            <div
              key={item.fieldId}
              className="flex flex-row gap-5 border-b border-gray-200 py-2 items-start flex-wrap"
            >
              <ProductHandler
                name={`discountConditionLines.${index}.productId`}
                control={control}
                disabledIds={formPrices.map((price) => price.productId)}
              />
              <Controller
                control={control}
                name={`discountConditionLines.${index}.price`}
                render={({ field, fieldState: { error: priceError } }) => {
                  return (
                    <div className="flex flex-col gap-1 max-w-[150px]">
                      <label className="font-semibold">{t("price")}:</label>

                      <InputNumber
                        {...field}
                        mode="decimal"
                        minFractionDigits={0}
                        maxFractionDigits={20}
                        onChange={(e) => {
                          field.onChange(Number(e.value));
                        }}
                        placeholder={t("enter")}
                        inputStyle={{
                          borderColor: priceError ? "red" : "",
                        }}
                      />

                      {priceError && (
                        <small className="p-error line-clamp-2">
                          {t(priceError.message)}
                        </small>
                      )}
                    </div>
                  );
                }}
              />

              <ControlledSwitch
                label={t("isVAT")}
                control={control}
                name={`discountConditionLines.${index}.isVAT`}
                placeholder={t("isVAT")}
              />
              <div className="flex flex-row gap-2 ml-5 self-center">
                {fields.length > 1 && (
                  <Button
                    icon="pi pi-trash"
                    onClick={() => remove(index)}
                    severity="danger"
                  />
                )}
                {index + 1 === fields.length && (
                  <Button
                    disabled={
                      !formPrices.every(
                        (price) => price.price && price.productId
                      )
                    }
                    icon="pi pi-plus"
                    onClick={() =>
                      append({
                        price: null,
                        productId: null,
                        isVAT: false,
                      })
                    }
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DiscountConditionPriceController;
