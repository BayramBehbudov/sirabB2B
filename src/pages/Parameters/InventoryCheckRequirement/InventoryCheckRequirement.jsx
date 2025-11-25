import { useTranslation } from "react-i18next";

const InventoryCheckRequirement = () => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-5">
      <div className={`flex items-center justify-between p-2`}>
        <div>
          <p className={`text-[1.5rem] font-bold`}>{t("inventoryCheckRequirement")}</p>
        </div>
        <div className="flex flex-row gap-2">{/*  */}</div>
      </div>
    </div>
  );
};

export default InventoryCheckRequirement;
