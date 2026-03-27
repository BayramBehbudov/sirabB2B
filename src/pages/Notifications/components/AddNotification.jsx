import { CreateNotification, UpdateNotification } from "@/api/Notification";
import ControlledCalendar from "@/components/ui/ControlledCalendar";
import ControlledInput from "@/components/ui/ControlledInput";
import FilePicker from "@/components/ui/file/FilePicker";
import FileScrollView from "@/components/ui/file/FileScrollView";
import CustomerHandler from "@/pages/Customers/components/CustomerHandler";
import CustomerGroupSelector from "@/pages/Customers/groups/components/CustomerGroupSelector";
import { showToast } from "@/providers/ToastProvider";
import { NotificationSchema } from "@/schemas/notification.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import React, { useEffect, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import NotificationTypeSelector from "../Types/NotificationTypeSelector";
import NotificationTemplateSelector from "../Forms/NotificationTemplateSelector";

const AddNotification = ({ onSuccess, notification, disabled }) => {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const isEdit = !!notification;

  const defaultValues = {
    customerGroupId: notification?.customerGroupId || null,
    b2BCustomerId: notification?.b2BCustomerId || null,
    clSpecode: notification?.clSpecode || "*",
    clSpecode1: notification?.clSpecode1 || "*",
    clSpecode2: notification?.clSpecode2 || "*",
    clSpecode3: notification?.clSpecode3 || "*",
    clSpecode4: notification?.clSpecode4 || "*",
    clSpecode5: notification?.clSpecode5 || "*",
    b2BCustomerType: notification?.b2BCustomerType || "*",
    notificationTypeId: notification?.notificationTypeId || 0,
    notificationTemplateId: notification?.notificationTemplateId || 0,
    scheduledAt: notification?.scheduledAt || "",

    images:
      notification?.images?.map((i) => {
        return {
          fileName: i.fileName,
          base64: i.filePath,
          type: "image/",
          id: i.id,
        };
      }) || [],
  };

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(NotificationSchema),
    defaultValues,
  });
  const b2BCustomerId = watch("b2BCustomerId");

  const { fields, append, remove } = useFieldArray({
    control,
    name: "images",
    keyName: "fieldId",
  });

  useEffect(() => {
    reset(defaultValues);
  }, [notification]);

  const onSubmit = async (data) => {
    if (disabled) return;
    const formatted = {
      ...data,
      images: data.images
        .map((image) => {
          return {
            ...image,
            base64: image.base64.split(",")[1],
          };
        })
        .filter((i) => i.id === 0 && i.base64),
    };
    const deletedNotificationImageIds = isEdit
      ? notification.images
          .filter((image) => !data.images.some((i) => i.id === image.id))
          .map((i) => i.id)
      : [];

    try {
      setLoading(true);
      const res = isEdit
        ? await UpdateNotification({
            ...formatted,
            id: notification.id,
            deletedNotificationImageIds,
          })
        : await CreateNotification(formatted);
      showToast({
        severity: "success",
        summary: t("success"),
        detail: res?.message || "",
      });
      onClose();
      onSuccess?.();
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
        header={t("addNotificationInfo")}
        visible={visible}
        className={`max-w-[1100px]`}
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
        <div className={`flex flex-row flex-wrap gap-2 py-[10px]`}>
          <ControlledCalendar
            control={control}
            name="scheduledAt"
            label={t("scheduledAt")}
            placeholder={t("select")}
            minDate={new Date()}
            className={"w-[200px]"}
          />
          <Controller
            control={control}
            name="notificationTypeId"
            render={({ field: { value, onChange }, fieldState: { error } }) => {
              return (
                <NotificationTypeSelector
                  error={error}
                  handleSelect={(v) => {
                    onChange(v[0]?.id ?? 0);
                  }}
                  value={value ? [value] : []}
                />
              );
            }}
          />
          <Controller
            control={control}
            name="notificationTemplateId"
            render={({ field: { value, onChange }, fieldState: { error } }) => {
              return (
                <NotificationTemplateSelector
                  error={error}
                  handleSelect={(v) => {
                    onChange(v[0]?.id ?? 0);
                  }}
                  value={value ? [value] : []}
                />
              );
            }}
          />
          <CustomerGroupSelector
            control={control}
            field="customerGroupId"
            showClear={true}
          />

          <CustomerHandler
            error={errors.b2BCustomerId}
            value={b2BCustomerId ? [b2BCustomerId] : []}
            setValue={setValue}
          />

          {[
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
            error={errors.images}
            value={fields}
            accept={"image/*"}
          />
        </div>
        <FileScrollView fields={fields} handleRemove={remove} />
      </Dialog>
    </div>
  );
};

export default AddNotification;
