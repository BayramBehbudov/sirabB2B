import usePermissions from "@/hooks/usePermissions";
import {
  CustomerSchema,
  EmptySchema,
  PasswordSchema,
} from "@/schemas/user.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "primereact/button";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import CustomerGroupSelector from "../groups/components/CustomerGroupSelector";
import ControlledInput from "@/components/ui/ControlledInput";
import FullScreenLoader from "@/components/ui/FullScreenLoader";
import AddressesController from "./AddressesController";
import {
  createB2BCustomer,
  editB2BCustomer,
  GetB2BCustomer,
} from "@/api/B2BCustomer";
import { showToast } from "@/providers/ToastProvider";
import FilePicker from "@/components/ui/file/FilePicker";
import { Image } from "primereact/image";

const AddCustomer = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const isEdit = id && /^[1-9]\d*$/.test(id);

  const [loading, setLoading] = useState(false);
  const [customer, setCustomer] = useState(null);
  const [picture, setPicture] = useState("");

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
    profileImageFileName: "",
    profileImageBase64: "",
    ...(isEdit ? {} : { password: "" }),
  };

  const { control, handleSubmit, reset, watch, setValue } = useForm({
    resolver: zodResolver(
      isEdit
        ? CustomerSchema.extend(EmptySchema.shape)
        : CustomerSchema.extend(PasswordSchema.shape),
    ),
    defaultValues,
  });

  const perms = usePermissions({
    create: "B2BCUSTOMER: CREATE_B2BCUSTOMER",
    update: "B2BCUSTOMER: UPDATE_B2BCUSTOMER_PROFILE_ADMIN",
    showOne: "B2BCUSTOMER: B2BCUSTOMER_PROFILE_INFO",
  });

  const hasUpdate = perms.isAllowed("update");
  const hasCreate = perms.isAllowed("create");

  useEffect(() => {
    if (!perms.ready) return;
    if (!isEdit && !hasCreate)
      return navigate("/not-allowed", { replace: true });
    if (!isEdit) return;
    if (!hasUpdate || !perms.showOne)
      return navigate("/not-allowed", { replace: true });
    getCustomer();
  }, [perms.ready]);

  const getCustomer = async () => {
    try {
      const res = await GetB2BCustomer(id);
      const data = res.data;

      const customerData = {
        customerGroupId: data.customerGroupId,
        erpId: data.erpId,
        taxId: data.taxId,
        phoneNumber: data.phoneNumber,
        email: data.email,
        contactPersonFirstName: data.contactPersonFirstName,
        contactPersonLastName: data.contactPersonLastName,
        companyName: data.companyName,
        deliveryAddresses: data.deliveryAddresses || [],
      };
      setCustomer(data);
      reset(customerData);
      setPicture(data.profileImageFilePath);
    } catch (error) {
      showToast({
        severity: "error",
        summary: t("error"),
        detail: t("customerNotFound"),
      });
      navigate("/page-not-found");
    }
  };
  const onSubmit = async (formData) => {
    const { deliveryAddresses, ...rest } = formData;
    const forDelete = isEdit
      ? (customer.deliveryAddresses || [])
          .filter(
            (adr) =>
              !deliveryAddresses.some(
                (ad) => ad.deliveryAddressId === adr.deliveryAddressId,
              ),
          )
          .map((a) => a.deliveryAddressId)
      : [];
    try {
      setLoading(true);
      const res = isEdit
        ? await editB2BCustomer({
            ...rest,
            b2BCustomerId: id,
            updateCustomerDeliveryAddresses: deliveryAddresses,
            deletedCustomerDeliveryAddresses: forDelete,
          })
        : await createB2BCustomer({
            ...rest,
            createCustomerDeliveryAddresses: deliveryAddresses,
          });
      showToast({
        severity: "success",
        summary: t("success"),
        detail: res?.message || "",
      });

      if (!isEdit) {
        reset(defaultValues);
      }
      {
        // qeyd səhifəni reload etmək lazımdır
      }
    } catch (error) {
      showToast({
        severity: "error",
        summary: t("error"),
        detail: error?.response?.data?.message || t("unexpectedError"),
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex flex-col gap-6 overflow-y-auto scrollbar">
      <div className={`flex items-center justify-between`}>
        <div>
          <p className={`text-[1.5rem] font-bold`}>
            {t(isEdit ? "editCustomer" : "addCustomer")}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-row">
          {picture && (
            <Image
              src={picture}
              alt="Image"
              width="50"
              height="50"
              preview
              className="max-w-[50px] max-h-[50px] bg-red-50 rounded-full overflow-hidden"
            />
          )}
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
        <FilePicker
          label={t("profilePicture")}
          accept={"image/*"}
          className="rounded-sm md:w-[250px]"
          multiple={false}
          onChange={(v) => {
            setValue("profileImageFileName", v[0].name);
            setValue("profileImageBase64", v[0].base64.split(",")[1]);
            setPicture(v[0].base64);
          }}
          value={[]}
        />
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
