import React from "react";
import { useNavigate } from "react-router-dom";
import { FaSearchMinus, FaExclamationTriangle } from "react-icons/fa";
import { useTranslation } from "react-i18next";

const NotFound = ({ showBackBtn = true, isError = false }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const canGoBack = window.history.length > 1;

  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-6">
      <div className="flex flex-col items-center gap-4 max-w-md">
        <div className="relative">
          <div className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 p-8 rounded-full shadow-lg">
            {isError ? (
              <FaExclamationTriangle className="text-orange-500 dark:text-orange-400 text-7xl animate-pulse" />
            ) : (
              <FaSearchMinus className="text-gray-500 dark:text-gray-400 text-7xl" />
            )}
          </div>

          {!isError && (
            <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-red-500 to-red-600 text-white font-bold text-2xl px-4 py-2 rounded-full shadow-lg">
              404
            </div>
          )}
        </div>

        <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mt-6">
          {isError ? t("errorOccurred") : t("pageNotFound")}
        </h1>

        <p className="text-gray-600 dark:text-gray-400 text-base leading-relaxed">
          {t("pageNotFoundText")}
        </p>

        <div className="flex gap-2 mt-2">
          <div
            className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
            style={{ animationDelay: "0s" }}
          ></div>
          <div
            className="w-2 h-2 bg-sky-400 rounded-full animate-bounce"
            style={{ animationDelay: "0.2s" }}
          ></div>
          <div
            className="w-2 h-2 bg-blue-300 rounded-full animate-bounce"
            style={{ animationDelay: "0.4s" }}
          ></div>
        </div>

        {showBackBtn && (
          <button
            onClick={() => {
              canGoBack ? navigate(-1) : navigate("/");
            }}
            className="mt-6 px-6 py-3 bg-gradient-to-r from-blue-500 to-sky-400 text-white font-medium rounded-xl shadow-md hover:shadow-lg hover:scale-105 transition-transform duration-300 hover:gap-4 flex gap-2 items-center"
          >
            <span className="">←</span> <span>{t("goBack")}</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default NotFound;
