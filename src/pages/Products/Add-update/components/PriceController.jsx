import ControlledCalendar from "@/components/ui/ControlledCalendar";
import ControlledSwitch from "@/components/ui/ControlledSwitch";
import { showToast } from "@/providers/ToastProvider";
import { Button } from "primereact/button";
import { InputNumber } from "primereact/inputnumber";
import { Controller, useFieldArray } from "react-hook-form";
import { useTranslation } from "react-i18next";

const PriceController = ({ control, formPrices }) => {
  const { t } = useTranslation();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "productPrices",
    keyName: "fieldId",
  });

  return (
    <div className="flex flex-col gap-3 border p-3 rounded-md border-gray-200">
      <label className="font-bold">{t("productPrices")}:</label>
      <div className="flex flex-col gap-2 flex-wrap">
        {fields.map((item, index) => {
          return (
            <div
              key={item.fieldId}
              className="flex flex-row gap-5 border-b border-gray-200 py-2 items-start flex-wrap"
            >
              <Controller
                control={control}
                name={`productPrices.${index}.price`}
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
              <ControlledCalendar
                label={t("startDate")}
                control={control}
                name={`productPrices.${index}.startDate`}
                placeholder={t("select")}
                showTime={false}
                maxDate={
                  formPrices[index]?.endDate
                    ? new Date(formPrices[index].endDate)
                    : null
                }
              />
              <ControlledCalendar
                label={t("endDate")}
                control={control}
                name={`productPrices.${index}.endDate`}
                placeholder={t("select")}
                showTime={false}
                minDate={
                  formPrices[index]?.startDate
                    ? new Date(formPrices[index].startDate)
                    : null
                }
              />

              <Controller
                control={control}
                name={`productPrices.${index}.priority`}
                render={({ field, fieldState: { error: priorityError } }) => {
                  return (
                    <div className="flex flex-col gap-1 max-w-[150px]">
                      <label className="font-semibold">{t("priority")}:</label>
                      <InputNumber
                        {...field}
                        onChange={(e) => {
                          const v = e.value;
                          const isDuplicate = formPrices.some(
                            (price) => price.priority === v
                          );
                          if (v === null) return field.onChange(null);

                          if (isDuplicate) {
                            showToast({
                              severity: "warn",
                              summary: t("error"),
                              detail: t("errors.invalidPriority"),
                            });
                            return;
                          }
                          field.onChange(v);
                        }}
                        placeholder={t("enter")}
                        inputStyle={{
                          width: "100px",
                          borderColor: priorityError ? "red" : "",
                        }}
                      />

                      {priorityError && (
                        <small className="p-error line-clamp-2">
                          {t(priorityError.message)}
                        </small>
                      )}
                    </div>
                  );
                }}
              />
              <ControlledSwitch
                label={t("isVAT")}
                control={control}
                name={`productPrices.${index}.isVAT`}
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
                    disabled={formPrices.some(
                      (price) =>
                        price.price === null ||
                        price.startDate === null ||
                        price.endDate === null ||
                        price.priority === null
                    )}
                    icon="pi pi-plus"
                    onClick={() =>
                      append({
                        price: null,
                        startDate: "",
                        endDate: "",
                        priority: formPrices.length + 1,
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

export default PriceController;
