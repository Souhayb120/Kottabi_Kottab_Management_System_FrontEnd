import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import AuthService from "../services/AuthService";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { BookOpen, Mail, Lock, Eye, EyeOff, Globe, HelpCircle, ArrowRight } from "lucide-react";
import Footer from "../components/Footer";

const Login = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { register, handleSubmit } = useForm();
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data) => {
    try {
      const response = await AuthService.login(data);

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        toast.success(t("login.success"));
        navigate("/dashboard");
      } else {
        toast.error(response.data.message || t("login.error"));
      }
    } catch (error) {
      toast.error(error?.message || t("login.error"));
    }
  };

  return (
    
<div className="flex min-h-screen items-center justify-center bg-(--bg) p-4">

<div className="flex w-full max-w-4xl overflow-hidden rounded-2xl trad-card">

        <div className="relative hidden w-1/2 flex-col justify-between bg-gradient-to-br from-[#0f3d2e] to-[#123a2c] p-10 text-white md:flex">
          <div>
            <div className="flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-amber-400" />
              <span className="text-xl font-semibold">Kottabi</span>
              <span className="select-none text-sm text-[#d9b45f]">۞</span>
            </div>
            <p className="mt-1 text-sm text-gray-300">{t("login.tagline", "Scholarship Management")}</p>
          </div>
          

          <div className="border-l-2 border-amber-400 pl-4">
            <p className="text-lg leading-snug text-gray-100">
              "{t("login.quote", "Seeking knowledge is an obligation upon every Muslim.")}"
            </p>
            <p className="mt-3 text-xs tracking-widest text-gray-400">
              {t("login.quoteSource", "TRADITION OF LEARNING")}
            </p>
          </div>

          <div className="flex items-center gap-4 text-gray-300">
            <Globe className="h-5 w-5 cursor-pointer hover:text-white" />
            <HelpCircle className="h-5 w-5 cursor-pointer hover:text-white" />
          </div>
        </div>

        <div className="flex w-full flex-col justify-center bg-[#fbfaf6] px-8 py-10 sm:px-12 md:w-1/2">
          <div className="ornament-row mb-3">
            <span className="select-none text-xs leading-none text-[#c79a3b]">۞</span>
          </div>
          <h1 className="font-serif text-2xl font-semibold text-(--text)">{t("login.title", "Bienvenue")}</h1>
          <p className="mt-1 text-sm text-(--text-muted)">
            {t("login.subtitle", "Veuillez vous connecter à votre compte.")}
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
            <div>
              <label className="label-trad">
                {t("login.username", "User Name")}
              </label>
              <div className="flex items-center rounded-lg border border-(--border) px-3 focus-within:border-(--brand) focus-within:ring-1 focus-within:ring-(--brand)">
                <Mail className="h-4 w-4 text-(--text-muted)" />
                <input
                  type="text"
                  placeholder="ahmed129"
                  className="w-full border-none bg-transparent p-2.5 text-sm text-(--text) placeholder-(--text-muted) outline-none focus:ring-0"
                  {...register("username")}
                />
              </div>
            </div>

            <div>
              <label className="label-trad">
                {t("login.password", "Mot de passe")}
              </label>
              <div className="flex items-center rounded-lg border border-(--border) px-3 focus-within:border-(--brand) focus-within:ring-1 focus-within:ring-(--brand)">
                <Lock className="h-4 w-4 text-(--text-muted)" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full border-none bg-transparent p-2.5 text-sm text-(--text) placeholder-(--text-muted) outline-none focus:ring-0"
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="text-(--text-muted) hover:text-(--text)"
                  aria-label={showPassword ? t("login.hidePassword", "Masquer") : t("login.showPassword", "Afficher")}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

           
            <button
              type="submit"
              className="btn-trad mt-2 flex w-full items-center justify-center gap-2"
            >
              <span className="select-none text-[10px] leading-none text-[#d9b45f]">✦</span>
              {t("login.submit", "Se connecter")}
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-(--text-muted)">
            {t("login.noAccount", "Vous n'avez pas de compte ?")}{" "}
            <Link to="/register" className="font-medium text-(--brand) hover:underline">
              {t("register.title")}
            </Link>
          </p>

            <Footer />
        </div>
      </div>
   
    </div>
  );
};

export default Login;