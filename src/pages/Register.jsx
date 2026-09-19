import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import AuthService from "../services/AuthService";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { BookOpen, Mail, Lock, Eye, EyeOff, User, ArrowRight } from "lucide-react";

const Register = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { register: fieldRegister, handleSubmit } = useForm();
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data) => {
    try {
      const response = await AuthService.register(data);

      if (response.data === "User registered successfully") {
        toast.success(t("register.success", "Inscription réussie"));
        navigate("/login");
      } else {
        alert(response.data);
      }
    } catch (error) {
      alert(t("register.error", "Registration failed"));
    }
  };

  const inputClass = "input-trad ps-9";

  return (
    <div className="flex min-h-screen flex-col bg-(--bg)">
      <div className="flex flex-1 items-center justify-center p-4">
        <div className="w-full max-w-[400px]">
          <div className="panel overflow-hidden">
            <div className="bg-(--brand) px-8 py-7 border-b border-[#c79a3b]/40">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-[#c79a3b]/45 bg-white/5 text-[#e3c472]">
                  <BookOpen className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-[15px] font-semibold leading-tight text-[#f3efe3]">
                    Kottabi
                  </p>
                  <p className="text-[11px] leading-tight text-[#c6d3cb]">
                    {t("login.tagline")}
                  </p>
                </div>
              </div>
            </div>

            <div className="px-8 py-8">
              <h1 className="font-display text-[22px] leading-tight text-(--text)">
                {t("register.title")}
              </h1>
              <p className="mt-1 text-[13px] text-(--text-muted)">
                {t("register.subtitle", "Veuillez créer votre compte.")}
              </p>

              <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
                <div>
                  <label className="label-trad">{t("register.userName")}</label>
                  <div className="relative">
                    <User className="absolute inset-y-0 start-3.5 my-auto h-4 w-4 text-(--text-muted)" />
                    <input
                      type="text"
                      placeholder="ahmed129"
                      className={inputClass}
                      {...fieldRegister("userName")}
                    />
                  </div>
                </div>

                <div>
                  <label className="label-trad">{t("register.email")}</label>
                  <div className="relative">
                    <Mail className="absolute inset-y-0 start-3.5 my-auto h-4 w-4 text-(--text-muted)" />
                    <input
                      type="email"
                      className={inputClass}
                      {...fieldRegister("email")}
                    />
                  </div>
                </div>

                <div>
                  <label className="label-trad">{t("register.role")}</label>
                  <div className="relative">
                    <Lock className="absolute inset-y-0 start-3.5 my-auto h-4 w-4 text-(--text-muted)" />
                    <select
                      className={`${inputClass} appearance-none`}
                      defaultValue="ENSEIGNANT"
                      {...fieldRegister("role")}
                    >
                      <option value="ADMIN">{t("register.roleAdmin")}</option>
                      <option value="ENSEIGNANT">
                        {t("register.roleEnseignant")}
                      </option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="label-trad">{t("register.password")}</label>
                  <div className="relative">
                    <Lock className="absolute inset-y-0 start-3.5 my-auto h-4 w-4 text-(--text-muted)" />
                    <input
                      type={showPassword ? "text" : "password"}
                      className={`${inputClass} pe-10`}
                      {...fieldRegister("password")}
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
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn mt-2 flex w-full items-center justify-center gap-2"
                >
                  {t("register.submit")}
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>

              <p className="mt-6 text-center text-[13px] text-(--text-muted)">
                {t("login.noAccount")}{" "}
                <Link
                  to="/login"
                  className="font-medium text-(--brand) hover:underline"
                >
                  {t("login.title")}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;