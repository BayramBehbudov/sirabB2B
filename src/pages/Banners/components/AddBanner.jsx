import ControlledCalendar from "@/components/ui/ControlledCalendar";
import ControlledInput from "@/components/ui/ControlledInput";
import { BannerSchema } from "@/schemas/banners.schema";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import React, { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import CustomerHandler from "./CustomerHandler";
import IsGlobalHandler from "./IsGlobalHandler";
import FilePicker from "@/components/ui/file/FilePicker";
import FileScrollView from "@/components/ui/file/FileScrollView";
import { zodResolver } from "@hookform/resolvers/zod";
import { BannerCreate } from "@/api/Banner";
import { showToast } from "@/providers/ToastProvider";

const AddBanner = () => {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const defaultValues = {
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    isGlobal: false,
    b2BCustomerIds: [],
    bannerImageDtos: [],
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
  const isGlobal = watch("isGlobal");
  const b2BCustomerIds = watch("b2BCustomerIds");

  const { fields, append, remove } = useFieldArray({
    control,
    name: "bannerImageDtos",
    keyName: "fieldId",
  });

  const onSubmit = async (formData) => {
    setLoading(true);
    try {
      const formattedDATA = {
        ...formData,
        bannerImageDtos: formData.bannerImageDtos.map((image) => {
          return {
            fileName: image.fileName,
            base64: image.base64.split(",")[1],
            bannerId: 0,
          };
        }),
      };
      const res = await BannerCreate(formattedDATA);
      showToast({
        severity: "success",
        summary: t("success"),
        detail: res?.message || "",
      });
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

  return (
    <div>
      <Button
        tooltip={""}
        tooltipOptions={{ position: "top" }}
        icon={`pi ${"pi-plus"}`}
        onClick={() => setVisible(true)}
        label={t("add")}
      />
      <Dialog
        header={t("addBannerInfo")}
        visible={visible}
        onHide={() => setVisible(false)}
        className="max-w-[90%] min-w-[90%] min-h-[70%]"
        footer={
          <div>
            <Button
              label={t("cancel")}
              onClick={() => setVisible(false)}
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
            <IsGlobalHandler control={control} setValue={setValue} />
            {!isGlobal && (
              <CustomerHandler
                error={errors.b2BCustomerIds}
                value={b2BCustomerIds}
                setValue={setValue}
              />
            )}

            {["title", "description"].map((item) => (
              <ControlledInput
                key={item}
                control={control}
                name={item}
                placeholder={t(item)}
                label={t(item)}
                className={"w-[200px]"}
              />
            ))}
            {["startDate", "endDate"].map((item) => (
              <ControlledCalendar
                key={item}
                control={control}
                name={item}
                placeholder={t(item)}
                label={t(item)}
                className={"w-[200px]"}
              />
            ))}

            <FilePicker
              label={t("images")}
              onChange={(files) => {
                const formatted = files.map((file) => {
                  return {
                    fileName: file.name,
                    base64: file.base64,
                    type: file.type,
                    bannerId: 0,
                  };
                });
                append(formatted);
              }}
              error={errors.bannerImageDtos}
              value={fields}
              accept={"image/*"}
            />
          </div>
          <FileScrollView fields={fields} handleRemove={remove} />
        </div>
      </Dialog>
    </div>
  );
};

export default AddBanner;
