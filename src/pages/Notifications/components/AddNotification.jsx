import {
  CreateNotification,
  GetNotificationTemplates,
  GetNotificationTypes,
} from "@/api/Notification";
import ControlledCalendar from "@/components/ui/ControlledCalendar";
import ControlledDropdown from "@/components/ui/ControlledDropdown";
import FilePicker from "@/components/ui/file/FilePicker";
import FileScrollView from "@/components/ui/file/FileScrollView";
import { showToast } from "@/providers/ToastProvider";
import { NotificationSchema } from "@/schemas/notification.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import React, { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

const AddNotification = ({ onSuccess }) => {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [types, setTypes] = useState([]);
  const [temps, setTemps] = useState([]);

  const defaultValues = {
    notificationTypeId: "",
    notificationTemplateId: "",
    sendDate: "",
    images: [],
  };
  
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(NotificationSchema),
    defaultValues,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "images",
    keyName: "fieldId",
  });

  const getNotificationsData = async () => {
    try {
      setLoading(true);
      const resTemps = await GetNotificationTemplates();
      const resTypes = await GetNotificationTypes();
      setTemps(resTemps);
      setTypes(resTypes.data);
    } catch (error) {
      console.log("error at getNotificationsData", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getNotificationsData();
  }, []);

  const onSubmit = async (data) => {
    const formatted = {
      ...data,
      images: data.images.map((image) => {
        return {
          ...image,
          base64: image.base64.split(",")[1],
        };
      }),
    };

    try {
      setLoading(true);
      // qeyd create xəta atır
      const res = await CreateNotification(formatted);
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
        icon={"pi pi-plus"}
        onClick={() => setVisible(true)}
        label={t("add")}
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
          />
          <FilePicker
            label={t("images")}
            onChange={(files) => {
              const formatted = files.map((file) => {
                return {
                  fileName: file.name,
                  base64: file.base64,
                  type: file.type,
                  notificationId: 0,
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
