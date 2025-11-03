import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import ControlledInput from "@/components/ui/ControlledInput";
import { Button } from "primereact/button";
import { useUserContext } from "@/providers/UserProvider";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { LoginSchema } from "@/schemas/auth.schema";
import { loginAuth } from "@/api/Auth";
import { setCookie } from "@/helper/Cookie";
import { showToast } from "@/providers/ToastProvider";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const { setIsLoggedIn } = useUserContext();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { control, handleSubmit } = useForm({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      userName: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const res = await loginAuth(data);
      setCookie("token", res.token, res.expirationDate);
      setCookie(
        "refreshToken",
        res.refreshToken,
        res.refreshTokenExpirationDate
      );

      setIsLoggedIn(true);
      navigate("/");
    } catch (error) {
      showToast({
        severity: "error",
        summary: t("error"),
        detail: error.response.data.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center w-screen h-screen">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col w-[400px] gap-2 p-5 border-1 border-gray-200 rounded-md"
      >
        <h2 className="text-center mb-5 font-bold">{t("login")}</h2>

        <ControlledInput
          control={control}
          name="userName"
          placeholder={t("username")}
          className="!rounded-lg"
        />
        <ControlledInput
          control={control}
          name="password"
          placeholder={t("password")}
          type="password"
          className="!rounded-lg"
        />

        <Button
          type="submit"
          label={t("login")}
          loading={loading}
          disabled={loading}
          style={{ width: "100%" }}
        />
      </form>
    </div>
  );
};

export default Login;
