import { useUserContext } from "@providers/UserProvider";
import { ProgressSpinner } from "primereact/progressspinner";
import { useTranslation } from "react-i18next";
import { Navigate } from "react-router-dom";

const AuthWrapper = ({ children }) => {
  const { isLoggedIn, loading } = useUserContext();
  const { t } = useTranslation();
  if (loading) {
    return (
      <div className="flex w-[100vw] flex-col justify-center items-center h-screen">
        <ProgressSpinner color="blue" />
        <p>{t("loading")}...</p>
      </div>
    );
  }

  if (!isLoggedIn) {
    return <Navigate to="/auth" replace />;
  }

  return children;
};

export default AuthWrapper;
