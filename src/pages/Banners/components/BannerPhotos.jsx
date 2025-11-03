import React, { useState } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Image } from "primereact/image";
import { useTranslation } from "react-i18next";

export const BannerPhotos = ({ images = [] }) => {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);
  return (
    <div>
      <Button
        icon="pi pi-images"
        tooltip={t("viewPhotos")}
        tooltipOptions={{ position: "top" }}
        onClick={() => setVisible(true)}
      />

      <Dialog
        header={t("photos")}
        visible={visible}
        modal
        onHide={() => setVisible(false)}
        style={{ maxWidth: "90vw", width: "90%" }}
        contentStyle={{
          maxHeight: "80vh",
          overflowY: "auto",
        }}
      >
        {images?.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 p-3">
            {images.map((img) => (
              <div
                key={img.id}
                className="flex flex-col items-center gap-2 border rounded-lg p-2 shadow-sm bg-white"
              >
                <Image
                  src={`${img.filePath}`}
                  alt={img.fileName}
                  preview
                  className="w-full h-40 object-cover rounded-md"
                  imageStyle={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    borderRadius: "8px",
                  }}
                />
                <p className="text-sm text-gray-700 text-center break-all">
                  {img.fileName}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-10">
            {t("noAvailableOptions")}
          </p>
        )}
      </Dialog>
    </div>
  );
};
