import ControlledCalendar from "@/components/ui/ControlledCalendar";
import ControlledInput from "@/components/ui/ControlledInput";
import { BannerSchema } from "@/schemas/banners.schema";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import React, { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import CustomerHandler from "../../Customers/components/CustomerHandler";
import FilePicker from "@/components/ui/file/FilePicker";
import FileScrollView from "@/components/ui/file/FileScrollView";
import { zodResolver } from "@hookform/resolvers/zod";
import { BannerCreate, BannerUpdate } from "@/api/Banner";
import { showToast } from "@/providers/ToastProvider";
import CustomerGroupSelector from "@/pages/Customers/groups/components/CustomerGroupSelector";
import ControlledSwitch from "@/components/ui/ControlledSwitch";

const AddBanner = ({ onSuccess, banner, disabled }) => {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const isEdit = !!banner;
  const defaultValues = {
    title: banner?.title || "",
    description: banner?.description || "",
    startDate: banner?.startDate || "",
    endDate: banner?.endDate || "",
    bannerImageDtos:
      banner?.bannerImages?.map((i) => {
        return {
          fileName: i.fileName,
          base64: i.filePath,
          type: "image/",
          id: i.id,
        };
      }) || [],

    b2BCustomerGroupId: banner?.customerGroupId || null,
    b2BCustomerId: banner?.b2BCustomerId || null,
    clSpecode: banner?.clSpecode || "*",
    clSpecode1: banner?.clSpecode1 || "*",
    clSpecode2: banner?.clSpecode2 || "*",
    clSpecode3: banner?.clSpecode3 || "*",
    clSpecode4: banner?.clSpecode4 || "*",
    clSpecode5: banner?.clSpecode5 || "*",
    b2BCustomerType: banner?.b2BCustomerType || "*",
    isActive: banner?.isActive ?? true,
  };

  const {
    handleSubmit,
    formState: { errors },
    control,
    setValue,
    watch,
    reset,
  } = useForm({
    resolver: zodResolver(BannerSchema),
    defaultValues,
  });
  const b2BCustomerId = watch("b2BCustomerId");

  const { fields, append, remove } = useFieldArray({
    control,
    name: "bannerImageDtos",
    keyName: "fieldId",
  });

  useEffect(() => {
    reset(defaultValues);
  }, [banner]);

  const onSubmit = async (formData) => {
    setLoading(true);

    try {
      const images = formData.bannerImageDtos
        .map((image) => {
          return {
            ...image,
            base64: image.base64.split(",")[1],
          };
        })
        .filter((i) => i.id === 0 && i.base64);
      const deletedBannerImageIds =
        isEdit && banner
          ? banner.bannerImages
              .filter(
                (image) =>
                  !formData.bannerImageDtos.some((i) => i.id === image.id),
              )
              .map((i) => i.id)
          : undefined;
      const formattedDATA = {
        ...formData,
        bannerImageDtos: images,
        ...(isEdit ? { id: banner.id, deletedBannerImageIds } : {}),
      };
      const res = isEdit
        ? await BannerUpdate(formattedDATA)
        : await BannerCreate(formattedDATA);
      showToast({
        severity: "success",
        summary: t("success"),
        detail: res?.message || "",
      });
      onSuccess?.();
      reset(defaultValues);
      setVisible(false);
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
  const onClose = () => {
    setVisible(false);
    reset(defaultValues);
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
        header={t("addBannerInfo")}
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
              onClick={handleSubmit(onSubmit)}
            />
          </div>
        }
      >
        <div className="flex flex-col gap-5">
          <div className="flex flex-row gap-2 flex-wrap">
            <CustomerGroupSelector
              control={control}
              field="b2BCustomerGroupId"
              showClear={true}
            />
            <CustomerHandler
              error={errors.b2BCustomerId}
              value={b2BCustomerId ? [b2BCustomerId] : []}
              setValue={setValue}
            />
            {[
              { name: "title" },
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
                placeholder={t("enter")}
                label={t(input.name)}
                type={"text"}
                avtoValue={input.avtoValue}
                className={"w-[200px]"}
              />
            ))}
            {["startDate", "endDate"].map((item) => {
              const minDate =
                item === "startDate"
                  ? new Date()
                  : new Date(watch("startDate"));
              const maxDate =
                item === "startDate" ? new Date(watch("endDate")) : undefined;
              return (
                <ControlledCalendar
                  key={item}
                  control={control}
                  name={item}
                  placeholder={t(item)}
                  label={t(item)}
                  className={"w-[200px]"}
                  minDate={minDate}
                  maxDate={maxDate}
                />
              );
            })}
            <FilePicker
              label={t("images")}
              onChange={(files) => {
                const formatted = files.map((file) => {
                  return {
                    fileName: file.name,
                    base64: file.base64,
                    type: file.type,
                    id: 0,
                  };
                });
                append(formatted);
              }}
              error={errors.bannerImageDtos}
              value={fields}
              accept={"image/*"}
            />
            <ControlledSwitch
              label={t("isActive")}
              control={control}
              name={`isActive`}
              placeholder={t("isActive")}
            />
          </div>
          {["description"].map((item) => (
            <ControlledInput
              type="textarea"
              classNameContainer="grow"
              key={item}
              control={control}
              name={item}
              placeholder={t(item)}
              label={t(item)}
            />
          ))}
          <FileScrollView fields={fields} handleRemove={remove} />
        </div>
      </Dialog>
    </div>
  );
};

export default AddBanner;
