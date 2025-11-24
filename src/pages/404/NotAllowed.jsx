import React from "react";
import { useNavigate } from "react-router-dom";
import { FaLock } from "react-icons/fa";
import { useTranslation } from "react-i18next";

const NotAllowed = ({ showBackBtn = true }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const canGoBack = window.history.length > 1;
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-6">
      <div className="flex flex-col items-center gap-4 max-w-md">
        <div className="bg-red-100 dark:bg-red-900/30 p-6 rounded-full">
          <FaLock className="text-red-500 dark:text-red-400 text-6xl animate-pulse" />
        </div>

        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mt-4">
          {t("notEntryAccess")}
        </h1>

        <p className="text-gray-600 dark:text-gray-400 text-base leading-relaxed">
          {t("notAllowedPageText")}
        </p>

        {showBackBtn && (
          <button
            onClick={() => {
              canGoBack ? navigate(-1) : navigate("/");
            }}
            className="mt-6 px-6 py-3 bg-gradient-to-r from-blue-500 to-sky-400 text-white font-medium  rounded-xl shadow-md hover:shadow-lg hover:scale-105 transition-transform duration-300 hover:gap-4 flex gap-2 items-center"
          >
            <span className="">←</span> <span>{t("goBack")}</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default NotAllowed;
