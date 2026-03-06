import {
  CreateMinimumOrderPrice,
  UpdateMinimumOrderPrice,
} from "@/api/MinimumOrderPrice";
import ControlledInput from "@/components/ui/ControlledInput";
import CustomerHandler from "@/pages/Customers/components/CustomerHandler";
import CustomerGroupSelector from "@/pages/Customers/groups/components/CustomerGroupSelector";
import { showToast } from "@/providers/ToastProvider";
import { MinOrderPriceSchema } from "@/schemas/minimum-order-price.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

const AddMinOrderPrice = ({ onSuccess, currentData }) => {
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const { t } = useTranslation();
  const isEdit = !!currentData;
  //   control fields
  const defaultValues = {
    id: currentData?.id || 0,
    orderPrice: currentData?.orderPrice || 0,
    customerGroupId: currentData?.customerGroupId || null,
    b2BCustomerId: currentData?.b2BCustomerId || null,
    clSpecode: currentData?.clSpecode || "*",
    clSpecode1: currentData?.clSpecode1 || "*",
    clSpecode2: currentData?.clSpecode2 || "*",
    clSpecode3: currentData?.clSpecode3 || "*",
    clSpecode4: currentData?.clSpecode4 || "*",
    clSpecode5: currentData?.clSpecode5 || "*",
    b2BCustomerType: currentData?.b2BCustomerType || "*",
  };
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { isDirty, errors },
  } = useForm({
    resolver: zodResolver(MinOrderPriceSchema),
    defaultValues,
  });
  const b2BCustomerId = watch("b2BCustomerId");

  const onClose = () => {
    reset(defaultValues);
    setVisible(false);
  };
  const onSubmit = async (formData) => {
    setLoading(true);
    try {
      const res = isEdit
        ? await UpdateMinimumOrderPrice(formData)
        : await CreateMinimumOrderPrice(formData);
      showToast({
        severity: "success",
        summary: t("success"),
        detail: res?.message || "",
      });
      onClose();
      onSuccess?.();
    } catch (error) {
      console.log("error at CreateMinimumOrderPrice", error);
      showToast({
        severity: "error",
        summary: t("error"),
        detail: error?.response?.data?.message || t("unexpectedError"),
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    reset(defaultValues);
  }, [currentData, reset]);

  return (
    <div>
      <Button
        onClick={() => setVisible(true)}
        label={isEdit ? undefined : t("add")}
        icon={isEdit ? "pi pi-pencil" : "pi pi-plus"}
        severity="contrast"
      />

      <Dialog
        header={t("enterInfo")}
        visible={visible}
        className={"max-w-[90%] min-w-[700px]"}
        onHide={onClose}
        footer={
          <div>
            <Button
              label={t("cancel")}
              className={`w-[150px]`}
              onClick={onClose}
            />
            <Button
              label={t("save")}
              className={`w-[150px]`}
              onClick={handleSubmit(onSubmit)}
              disabled={loading}
              loading={loading}
            />
          </div>
        }
      >
        <div className={"flex flex-col gap-3"}>
          <div className={"flex flex-row flex-wrap gap-3 py-2"}>
            <CustomerGroupSelector
              control={control}
              field="customerGroupId"
              showClear={true}
            />
            <CustomerHandler
              error={errors.b2BCustomerId}
              value={b2BCustomerId ? [b2BCustomerId] : []}
              setValue={setValue}
              field="b2BCustomerId"
              required={false}
              mode="single"
            />
            {[
              { name: "orderPrice", type: "number" },
              { name: "clSpecode" },
              { name: "clSpecode1" },
              { name: "clSpecode2" },
              { name: "clSpecode3" },
              { name: "clSpecode4" },
              { name: "clSpecode5" },
              { name: "b2BCustomerType" },
            ].map((input) => (
              <ControlledInput
                control={control}
                key={input.name}
                name={input.name}
                label={t(input.name)}
                type={input.type || "text"}
                className={"w-[250px] no-spinner"}
                avtoValue={input.avtoValue}
                placeholder={t("enter")}
              />
            ))}
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default AddMinOrderPrice;
