import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import AuthService from "../services/AuthService";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { BookOpen, Mail, Lock, Eye, EyeOff, Globe, HelpCircle, ArrowRight } from "lucide-react";

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
    
    <div className="flex min-h-screen items-center justify-center bg-[#f2ece1] p-4">
      <div className="flex w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-xl">

        <div className="relative hidden w-1/2 flex-col justify-between bg-gradient-to-br from-[#0f3d2e] to-[#123a2c] p-10 text-white md:flex">
          <div>
            <div className="flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-amber-400" />
              <span className="text-xl font-semibold">Kottabi</span>
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

        <div className="flex w-full flex-col justify-center px-8 py-10 sm:px-12 md:w-1/2">
          <h1 className="text-2xl font-semibold text-gray-800">{t("login.title", "Bienvenue")}</h1>
          <p className="mt-1 text-sm text-gray-500">
            {t("login.subtitle", "Veuillez vous connecter à votre compte.")}
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                {t("login.username", "User Name")}
              </label>
              <div className="flex items-center rounded-lg border border-gray-300 px-3 focus-within:border-[#0f3d2e] focus-within:ring-1 focus-within:ring-[#0f3d2e]">
                <Mail className="h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="ahmed129"
                  className="w-full border-none bg-transparent p-2.5 text-sm text-gray-700 placeholder-gray-400 outline-none focus:ring-0"
                  {...register("username")}
                />
              </div>
            </div>

            <div>
             
              <div className="flex items-center rounded-lg border border-gray-300 px-3 focus-within:border-[#0f3d2e] focus-within:ring-1 focus-within:ring-[#0f3d2e]">
                <Lock className="h-4 w-4 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full border-none bg-transparent p-2.5 text-sm text-gray-700 placeholder-gray-400 outline-none focus:ring-0"
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  
                </button>
              </div>
            </div>

           
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#0f3d2e] p-2.5 text-sm font-medium text-white transition hover:bg-[#0c3325]"
            >
              {t("login.submit", "Se connecter")}
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            {t("login.noAccount", "Vous n'avez pas de compte ?")}{" "}
            <Link to="/register" className="font-medium text-[#0f3d2e] hover:underline">
              {t("login.contactAdmin", "register.title")}
            </Link>
          </p>

          <p className="mt-8 text-center text-xs text-gray-400">
            © 2026 Kottabi. {t("login.rightsReserved", "Tous droits réservés.")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;