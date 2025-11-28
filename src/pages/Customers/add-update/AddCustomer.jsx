import usePermissions from "@/hooks/usePermissions";
import {
  CustomerSchema,
  EmptySchema,
  PasswordSchema,
} from "@/schemas/user.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "primereact/button";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import CustomerGroupSelector from "../groups/components/CustomerGroupSelector";
import ControlledInput from "@/components/ui/ControlledInput";
import FullScreenLoader from "@/components/ui/FullScreenLoader";
import AddressesController from "./AddressesController";

const AddCustomer = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const isEdit = id && /^[1-9]\d*$/.test(id);

  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  const perms = usePermissions({
    show: "B2BMüştərilər: Müştərilər listi",
    // create: "B2BMüştərilər: B2BMüştəri yaratma",
    // passUpdate: "B2BMüştərilər: B2BMüştəri şifrə yeniləmə",
    // update: "B2BMüştərilər: Admin B2BMüştəri məlumatlarını yeniləmə",
    // confirm:
    //   "B2BMüştərilər: Sirab tərəfindən B2BMüştəri məlumatlarını təsdiqləmə",
    // status: "B2BMüştərilər: Müştəri aktiv/deaktiv etmə",
  });

  const defaultValues = {
    customerGroupId: 0,
    erpId: "",
    taxId: "",
    phoneNumber: "",
    email: "",
    contactPersonFirstName: "",
    contactPersonLastName: "",
    companyName: "",
    deliveryAddresses: [],
    ...(isEdit ? {} : { password: "" }),
  };

  const { control, handleSubmit, reset, watch, setValue } = useForm({
    resolver: zodResolver(
      isEdit
        ? CustomerSchema.extend(EmptySchema.shape)
        : CustomerSchema.extend(PasswordSchema.shape)
    ),
    defaultValues,
  });
  const onSubmit = async (formData) => {
    console.log(formData);
    // try {
    //   setLoading(true);
    //   const res = isEdit
    //     ? await editB2BCustomer({
    //         ...formData,
    //         b2BCustomerId: user.b2BCustomerId,
    //       })
    //     : await createB2BCustomer(formData);
    //   showToast({
    //     severity: "success",
    //     summary: t("success"),
    //     detail: res?.message || "",
    //   });

    //   setVisible(false);
    //   reset(defaultValues);
    //   onSuccess?.();
    // } catch (error) {
    //   showToast({
    //     severity: "error",
    //     summary: t("error"),
    //     detail: error?.response?.data?.message || t("unexpectedError"),
    //   });
    // } finally {
    //   setLoading(false);
    // }
  };

  return (
    <div className="flex flex-col gap-6 p-2 overflow-y-auto scrollbar">
      <div className={`flex items-center justify-between`}>
        <div>
          <p className={`text-[1.5rem] font-bold`}>
            {t(isEdit ? "editCustomer" : "addCustomer")}
          </p>
        </div>
        <div>
          <Button
            label={t("goBack")}
            icon="pi pi-arrow-left"
            onClick={() => navigate(-1)}
          />
        </div>
      </div>

      <div className={"flex flex-row flex-wrap gap-2 py-[10px]"}>
        <CustomerGroupSelector control={control} />

        {[
          { name: "contactPersonFirstName" },
          { name: "contactPersonLastName" },
          { name: "phoneNumber", avtoValue: "+994" },
          { name: "email", type: "email" },
          ...(!isEdit ? [{ name: "password", type: "password" }] : []),
          { name: "erpId" },
          { name: "taxId" },
          { name: "companyName" },
        ].map((input) => (
          <ControlledInput
            control={control}
            key={input.name}
            name={input.name}
            placeholder={t(input.name)}
            label={t(input.name)}
            type={input.type || "text"}
            className={"md:w-[250px]"}
            avtoValue={input.avtoValue}
          />
        ))}
      </div>

      <AddressesController
        control={control}
        formAddresses={watch("deliveryAddresses")}
        setValue={setValue}
      />

      <div className={`flex items-center justify-end mt-10`}>
        <Button
          label={t(isEdit ? "confirm" : "save")}
          icon="pi pi-plus"
          onClick={handleSubmit(onSubmit)}
        />
      </div>
      <FullScreenLoader visible={loading} />
    </div>
  );
};

export default AddCustomer;
