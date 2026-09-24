import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Navigate, useNavigate } from "react-router-dom";
import AuthService from "../services/AuthService";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faBookQuran,
  faEnvelope,
  faEye,
  faEyeSlash,
  faLock,
} from "@fortawesome/free-solid-svg-icons";
import kottabiVideo from "../assets/kottabi.mp4";

const Login = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { register, handleSubmit } = useForm();
  const [showPassword, setShowPassword] = useState(false);

  if (AuthService.hasToken()) {
    return <Navigate to="/dashboard" replace />;
  }

  const onSubmit = async (data) => {
    try {
      const response = await AuthService.login(data);

      if (response.data.token) {
        AuthService.saveToken(response.data.token);
        toast.success(t("login.success"));
        navigate("/dashboard");
      } else {
        toast.error(response.data.message || t("login.error"));
      }
    } catch (error) {
      toast.error(error?.message || t("login.error"));
    }
  };

  const inputClass = "input-trad ps-12";

  return (
    <div className="min-h-screen bg-(--bg) lg:grid lg:grid-cols-2">
      {/* Login side */}
      <div className="flex min-h-screen items-center justify-center p-4 lg:min-h-0 lg:py-10">
        <div className="w-full max-w-[400px]">
          <div className="panel overflow-hidden">
            <div className="bg-(--brand) px-8 py-7 border-b border-[#c79a3b]/40">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-[#c79a3b]/45 bg-white/5 text-[#e3c472]">
                  <FontAwesomeIcon icon={faBookQuran} className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-[15px] font-semibold leading-tight text-[#f3efe3]">
                    {t("landing.titleApp")}
                  </p>
                  <p className="text-[11px] leading-tight text-[#c6d3cb]">
                    {t("login.tagline")}
                  </p>
                </div>
              </div>
            </div>

            <div className="px-8 py-8">
              <h1 className="font-display text-[22px] leading-tight text-(--text)">
                {t("login.title")}
              </h1>
              <p className="mt-1 text-[13px] text-(--text-muted)">
                {t("login.subtitle")}
              </p>

              <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
                <div>
                  <label className="label-trad">{t("login.username")}</label>
                  <div className="relative">
                    <FontAwesomeIcon icon={faEnvelope} className="absolute inset-y-0 start-3.5 my-auto h-4 w-4 text-(--text-muted)" />
                    <input
                      type="text"
                      className={inputClass}
                      {...register("username")}
                    />
                  </div>
                </div>

                <div>
                  <label className="label-trad">{t("login.password")}</label>
                  <div className="relative">
                    <FontAwesomeIcon icon={faLock} className="absolute inset-y-0 start-3.5 my-auto h-4 w-4 text-(--text-muted)" />
                    <input
                      type={showPassword ? "text" : "password"}
                      className={`${inputClass} pe-10`}
                      {...register("password")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute inset-y-0 end-3 my-auto text-(--text-muted) hover:text-(--text)"
                      aria-label={
                        showPassword
                          ? t("login.hidePassword", "Masquer")
                          : t("login.showPassword", "Afficher")
                      }
                    >
                      {showPassword ? (
                        <FontAwesomeIcon icon={faEyeSlash} className="h-4 w-4" />
                      ) : (
                        <FontAwesomeIcon icon={faEye} className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn mt-2 flex w-full items-center justify-center gap-2"
                >
                  {t("login.submit")}
                  <FontAwesomeIcon icon={faArrowRight} className="h-4 w-4" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="relative hidden overflow-hidden bg-(--brand) lg:block">
        <video
          src={kottabiVideo}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-linear-to-t from-[#0f3d2e]/95 via-[#0f3d2e]/40 to-[#0f3d2e]/5" />

        <div className="relative flex h-full flex-col justify-end p-8 xl:p-12">
          <span className="mb-4 h-px w-12 bg-[#c79a3b]" />
          <p className="font-display max-w-md text-[22px] leading-snug text-[#f3efe3] xl:text-[26px]">
            {t("login.quote")}
          </p>
          <p className="mt-3 text-[11px] uppercase tracking-[0.14em] text-[#c6d3cb]">
            {t("login.quoteSource")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;