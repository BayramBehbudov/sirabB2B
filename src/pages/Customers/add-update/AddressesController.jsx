import MapController from "@/components/MapController";
import ControlledInput from "@/components/ui/ControlledInput";
import ControlledSwitch from "@/components/ui/ControlledSwitch";
import { Button } from "primereact/button";
import { Controller, useFieldArray } from "react-hook-form";
import { useTranslation } from "react-i18next";

const AddressesController = ({ control, formAddresses = [], setValue }) => {
  const { t } = useTranslation();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "deliveryAddresses",
    keyName: "fieldId",
  });
  return (
    <div className="flex flex-col gap-3 border p-3 rounded-md border-gray-200">
      <div className="flex md:flex-row flex-col justify-between md:items-center items-start border-b pb-2 border-gray-200">
        <label className="font-bold">{t("customerAddresses")}</label>
        <div className="flex md:flex-row flex-col gap-1">
          <Button
            icon={"pi pi-plus"}
            label={t("addRow")}
            onClick={() =>
              append({
                title: "",
                addressLine: "",
                city: "",
                district: "",
                postalCode: "",
                loc_X: 0,
                loc_Y: 0,
                deliveryAddressId: 0,
                isDefault: false,
              })
            }
          />

          <MapController
            onSelect={(v) => {
              append({
                title: "",
                addressLine: v.displayName,
                city: v?.address?.city ?? "",
                district: "",
                postalCode: v?.address?.postcode ?? "",
                loc_Y: v?.lat ?? 0,
                loc_X: v?.lng ?? 0,
                deliveryAddressId: 0,
                isDefault: false,
              });
            }}
          />
        </div>
      </div>
      <div className="flex flex-col gap-2 flex-wrap">
        {fields.map((item, index) => {
          return (
            <div
              key={item.fieldId}
              className="flex flex-col gap-5 border  border-gray-400 rounded-2xl p-5"
            >
              <div className="flex flex-row justify-between items-center">
                <label className="font-bold">
                  {t(`addressCount`, { count: index + 1 })}
                </label>
                <div className="flex flex-row gap-5 items-center">
                  <ControlledSwitch
                    control={control}
                    name={`deliveryAddresses.${index}.isDefault`}
                    className="gap-3 flex-row"
                    tooltip={t("makeIsDefatult")}
                    handleChange={(val) => {
                      if (val) {
                        formAddresses.forEach((addr, idx) => {
                          if (idx !== index && addr.isDefault) {
                            setValue(
                              `deliveryAddresses.${idx}.isDefault`,
                              false
                            );
                          }
                        });
                      }
                    }}
                  />

                  <Button
                    icon="pi pi-trash"
                    tooltip={t("deleteAddress")}
                    tooltipOptions={{
                      position: "top",
                    }}
                    onClick={() => remove(index)}
                    severity="danger"
                    className="self-end"
                  />
                </div>
              </div>
              {[{ name: "addressLine", type: "textarea" }].map((inp) => {
                return (
                  <ControlledInput
                    key={inp.name}
                    control={control}
                    name={`deliveryAddresses.${index}.${inp.name}`}
                    label={t(inp.name)}
                    placeholder={t("enter")}
                    type={inp.type}
                    rows={1}
                    classNameContainer="grow"
                  />
                );
              })}

              <div className="flex flex-row gap-5 items-start flex-wrap">
                {[
                  { name: "title", type: "text" },
                  { name: "city", type: "text" },
                  { name: "district", type: "text" },
                  { name: "postalCode", type: "text" },
                  { name: "loc_X", type: "number" },
                  { name: "loc_Y", type: "number" },
                ].map((inp) => {
                  return (
                    <ControlledInput
                      key={inp.name}
                      control={control}
                      name={`deliveryAddresses.${index}.${inp.name}`}
                      label={t(inp.name)}
                      placeholder={t("enter")}
                      type={inp.type}
                      className={"no-spinner md:w-[250px]"}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AddressesController;
