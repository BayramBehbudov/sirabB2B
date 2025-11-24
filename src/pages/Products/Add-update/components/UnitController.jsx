import { showToast } from "@/providers/ToastProvider";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { Controller, useFieldArray } from "react-hook-form";
import { useTranslation } from "react-i18next";

const UnitController = ({ control, units, formUnits }) => {
  const { t } = useTranslation();
  const {
    fields: selectedUnits,
    append, //sona element əlavə edir, append(value)
    remove, // bir elementi silir, remove(2); // 3-cü elementi silir, remove([1, 3]) -birdən çox index silmək    remove() - hamısını silmək
    insert, //istənilən index-ə əlavə edir,  insert(1, value); Index 1-ə qoyur və digərlərini sağa sürüşdürür.
    move, // elementi bir yerdən başqa yerə sürüşdürür, move(3, 0); // 4-cü elementi birinci yerə çəkir
    prepend, //əvvələ element əlavə edir, prepend(value);
    replace, // bütün array-ı yenisi ilə əvəz edir, replace([value1, value2, value3]);
    swap, // 2 elementi yerlə dəyişdirir, swap(0, 2);
    update, //mövcud elementi tam olaraq dəyişmək, update(1, value);
  } = useFieldArray({
    control,
    name: "productUnits",
    keyName: "fieldId",
  });

  return (
    <div className="flex flex-col gap-3 border p-3 rounded-md border-gray-200">
      <label className="font-bold">{t("productUnits")}:</label>
      <div className="flex flex-col gap-2 flex-wrap">
        {selectedUnits.map((item, index) => {
          return (
            <div
              key={item.fieldId}
              className="flex flex-row gap-2 items-start flex-wrap border-b border-gray-200 py-2"
            >
              <Controller
                key={item.fieldId}
                control={control}
                name={`productUnits.${index}.unitDefinitionId`}
                render={({
                  field,
                  fieldState: { error: unitDefinitionIdError },
                }) => {
                  return (
                    <div className="flex flex-col gap-2 max-w-[200px] ">
                      <Dropdown
                        {...field}
                        onChange={(e) => {
                          const v = e.value;

                          if (
                            formUnits.some(
                              (unit) => unit.unitDefinitionId === v
                            )
                          ) {
                            showToast({
                              severity: "warn",
                              summary: t("error"),
                              detail: t("errors.duplicateUnit"),
                            });
                          } else {
                            field.onChange(e.value);
                          }
                        }}
                        options={units.map((unit) => ({
                          label: unit.name,
                          value: unit.id,
                        }))}
                        placeholder={t("selectUnit")}
                        style={{
                          width: "150px",
                          borderColor: unitDefinitionIdError ? "red" : "",
                        }}
                      />
                      {unitDefinitionIdError && (
                        <small className="p-error line-clamp-2">
                          {t(unitDefinitionIdError.message)}
                        </small>
                      )}
                    </div>
                  );
                }}
              />
              <Controller
                control={control}
                name={`productUnits.${index}.unit`}
                render={({ field, fieldState: { error: unitError } }) => {
                  return (
                    <div className="flex flex-col gap-2 max-w-[150px]">
                      <InputNumber
                        {...field}
                        onChange={(e) => {
                          field.onChange(Number(e.value));
                        }}
                        placeholder={t("quantity")}
                        inputStyle={{
                          width: "100px",
                          borderColor: unitError ? "red" : "",
                        }}
                      />

                      {unitError && (
                        <small className="p-error line-clamp-2">
                          {t(unitError.message)}
                        </small>
                      )}
                    </div>
                  );
                }}
              />
              <div className="flex flex-row gap-2">
                {selectedUnits.length > 1 && (
                  <Button
                    icon="pi pi-trash"
                    onClick={() => remove(index)}
                    severity="danger"
                  />
                )}
                {index + 1 === selectedUnits.length &&
                  selectedUnits.length !== units.length && (
                    <Button
                      disabled={formUnits.some(
                        (unit) =>
                          unit.unitDefinitionId === null || unit.unit === null
                      )}
                      icon="pi pi-plus"
                      onClick={() =>
                        append({ unitDefinitionId: null, unit: null })
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

export default UnitController;
