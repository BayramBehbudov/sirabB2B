import ControlledSwitch from "@/components/ui/ControlledSwitch";
import ProductHandler from "@/pages/Products/components/ProductHandler";
import { Button } from "primereact/button";
import { InputNumber } from "primereact/inputnumber";
import { Controller, useFieldArray } from "react-hook-form";
import { useTranslation } from "react-i18next";

const DiscountConditionPercentageController = ({ control, formLines }) => {
  const { t } = useTranslation();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "discountConditionLines",
    keyName: "fieldId",
  });

  return (
    <div className="flex flex-col gap-3 border p-3 rounded-md border-gray-200">
      <label className="font-bold">{t("percentages")}:</label>
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
                disabledIds={formLines.map((line) => line.productId)}
              />
              <Controller
                control={control}
                name={`discountConditionLines.${index}.discountPercentage`}
                render={({
                  field,
                  fieldState: { error: discountPercentageError },
                }) => {
                  return (
                    <div className="flex flex-col gap-1 max-w-[150px]">
                      <label className="font-semibold">
                        {t("discountPercentage")}:
                      </label>

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
                          borderColor: discountPercentageError ? "red" : "",
                        }}
                      />

                      {discountPercentageError && (
                        <small className="p-error line-clamp-2">
                          {t(discountPercentageError.message)}
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
                      !formLines.every(
                        (line) => line.discountPercentage && line.productId,
                      )
                    }
                    icon="pi pi-plus"
                    onClick={() =>
                      append({
                        discountPercentage: null,
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

export default DiscountConditionPercentageController