import {
  CreateNotification,
  GetNotificationTemplates,
  GetNotificationTypes,
  UpdateNotification,
} from "@/api/Notification";
import ControlledCalendar from "@/components/ui/ControlledCalendar";
import ControlledDropdown from "@/components/ui/ControlledDropdown";
import FilePicker from "@/components/ui/file/FilePicker";
import FileScrollView from "@/components/ui/file/FileScrollView";
import CustomerHandler from "@/pages/Banners/components/CustomerHandler";
import SendToAllCustomersHandler from "@/pages/Banners/components/SendToAllCustomersHandler";
import CustomerGroupMultiSelector from "@/pages/Customers/groups/components/CustomerGroupMultiSelector";
import { showToast } from "@/providers/ToastProvider";
import { NotificationSchema } from "@/schemas/notification.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import React, { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

const AddNotification = ({ onSuccess, notification, disabled }) => {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [types, setTypes] = useState([]);
  const [temps, setTemps] = useState([]);
  const isEdit = !!notification;
  const defaultValues = {
    b2BCustomerGroupIds: [],
    b2BCustomerIds: notification?.recipients?.map((r) => r.b2BCustomerId) || [],
    sendDate: notification?.sendDate || "",

    notificationTypeId: notification?.notificationTypeId || 0,
    notificationTemplateId: notification?.notificationTemplateId || 0,
    images:
      notification?.images?.map((i) => {
        return {
          fileName: i.fileName,
          base64: i.filePath,
          type: "image/",
          id: i.id,
        };
      }) || [],
    sendToAllCustomers: false,
  };

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
    trigger,
    watch,
  } = useForm({
    resolver: zodResolver(NotificationSchema),
    defaultValues,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "images",
    keyName: "fieldId",
  });
  const sendToAllCustomers = watch("sendToAllCustomers");
  const b2BCustomerIds = watch("b2BCustomerIds");

  const getNotificationsData = async () => {
    try {
      setLoading(true);
      const page = { pageNumber: 1, pageSize: 1000000 };
      const resTemps = await GetNotificationTemplates(page);
      const resTypes = await GetNotificationTypes(page);
      setTemps(resTemps.notificationTemplates);
      setTypes(resTypes.notificationTypes);
    } catch (error) {
      console.log("error at getNotificationsData", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!visible) return;
    getNotificationsData();
  }, [visible]);

  useEffect(() => {
    reset(defaultValues);
  }, [notification]);

  const onSubmit = async (data) => {
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
          <SendToAllCustomersHandler control={control} setValue={setValue} />

          {!sendToAllCustomers && (
            <CustomerGroupMultiSelector
              fieldName="b2BCustomerGroupIds"
              control={control}
              trigger={trigger}
            />
          )}

          {!sendToAllCustomers && (
            <CustomerHandler
              error={errors.b2BCustomerIds}
              value={b2BCustomerIds}
              setValue={setValue}
              trigger={trigger}
            />
          )}

          <ControlledDropdown
            control={control}
            name="notificationTypeId"
            label={t("notificationType")}
            showIcon={false}
            options={types.map((t) => {
              return {
                label: t.id + " - " + t.name,
                value: t.id,
              };
            })}
          />
          <ControlledDropdown
            control={control}
            name="notificationTemplateId"
            label={t("notificationTemplate")}
            showIcon={false}
            options={temps.map((t) => {
              return {
                label: t.id + " - " + t.titleTemplate,
                value: t.id,
              };
            })}
          />
          <ControlledCalendar
            control={control}
            name="sendDate"
            label={t("sendDate")}
            placeholder={t("select")}
            minDate={new Date()}
          />
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
