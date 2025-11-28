import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import ControlledInput from "@/components/ui/ControlledInput";
import { Button } from "primereact/button";
import { useUserContext } from "@/providers/UserProvider";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { LoginSchema } from "@/schemas/auth.schema";
import { VerifyUser } from "@/api/Auth";
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
      const res = await VerifyUser(data);
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
    <div className="flex min-h-screen min-w-screen flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="flex flex-1 items-center justify-center px-4 py-8">
        <div className="grid w-full max-w-6xl overflow-hidden rounded-3xl  shadow-2xl lg:grid-cols-[1.1fr_0.9fr]">
          <div className="relative hidden bg-slate-900 px-10 py-12 text-white lg:flex">
            <div className="space-y-8 flex flex-col gap-2 justify-center items-center">
              <img
                src="/logo.png"
                alt="Brand logo"
                className="h-16 w-auto drop-shadow-lg"
              />
              <div className="space-y-4">
                <h2 className="text-3xl font-semibold leading-tight">
                  {t("login_hero_title")}
                </h2>
                <p className="text-base text-slate-200">
                  {t("login_hero_description")}
                </p>
              </div>
              {/* <div className="rounded-2xl bg-white/10 p-5 backdrop-blur w-full text-center">
                <p className="text-sm text-slate-200">
                  {t("login_hero_hint", {
                    defaultValue:
                      "Giriş məlumatlarınız yoxdur? Adminlə əlaqə saxlayın.",
                  })}
                </p>
              </div> */}
            </div>
          </div>

          <div className="p-8 sm:p-10 bg-white">
            <div className="mb-10 space-y-2">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">
                {t("login_tagline")}
              </p>
              <h1 className="text-3xl font-semibold text-slate-900">
                {t("login")}
              </h1>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                  {t("username")}
                </label>
                <ControlledInput
                  control={control}
                  name="userName"
                  placeholder={t("username_placeholder", {
                    defaultValue: "example@company.com",
                  })}
                  className="!rounded-2xl !border-slate-200 focus:!border-slate-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                  {t("password")}
                </label>
                <ControlledInput
                  control={control}
                  name="password"
                  placeholder={"••••••••"}
                  type="password"
                  className="!rounded-2xl !border-slate-200 focus:!border-slate-500"
                />
              </div>

              <Button
                type="submit"
                label={t("login")}
                loading={loading}
                disabled={loading}
                className="!w-full !rounded-2xl !border-none !bg-slate-900 hover:!bg-slate-800"
              />
            </form>

            <div className="mt-10 rounded-2xl border border-dashed border-slate-200 p-4 text-center text-sm text-slate-500">
              {t("login_support")}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
