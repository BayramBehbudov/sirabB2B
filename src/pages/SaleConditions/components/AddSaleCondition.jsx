import { SaleConditionSchema } from "@/schemas/sale-condition.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

const AddSaleCondition = ({ onSuccess, condition, disabled }) => {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const isEdit = !!condition;
  const defaultValues = {
    customerGroupIds: [],
    b2BCustomerIds: [],
    sendToAllCustomers: false,
    startDate: "",
    endDate: "",
    description: "",
    saleConditionLines: [
      {
        price: 0,
        isVAT: false,
        productId: 0,
      },
    ],
  };

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
  } = useForm({
    resolver: zodResolver(SaleConditionSchema),
    defaultValues,
  });

  const onSubmit = async (formData) => {
    console.log(formData);
  };
  const onClose = () => {
    setVisible(false);
    // reset(defaultValues);
  };
  return (
    <div>
      <Button
        tooltip={isEdit ? t("edit") : ""}
        tooltipOptions={{ position: "top" }}
        icon={`pi ${isEdit ? "pi-pencil" : "pi-plus"}`}
        onClick={() => setVisible(true)}
        label={!isEdit && t("add")}
        disabled={disabled}
      />
      <Dialog
        header={t("addInfo")}
        visible={visible}
        onHide={onClose}
        className="max-w-[90%] min-w-[90%] min-h-[70%]"
        footer={
          <div>
            <Button
              label={t("cancel")}
              onClick={onClose}
              className="mr-2"
              disabled={loading}
            />
            <Button
              label={t("save")}
              disabled={loading}
              loading={loading}
              //   onClick={handleSubmit(onSubmit)}
            />
          </div>
        }
      >
        <div className="flex flex-row gap-2 flex-wrap"></div>
      </Dialog>
    </div>
  );
};

export default AddSaleCondition;
