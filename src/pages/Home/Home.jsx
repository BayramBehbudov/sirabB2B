import React from "react";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Home = () => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-5">
      <div className={`flex items-center justify-between`}>
        <div>
          <p className={`text-[1.5rem] font-bold`}>{t("home")}</p>
        </div>
        <div className="flex flex-row gap-2">{/* add */}</div>
      </div>
    </div>
  );
};

export default Home;
