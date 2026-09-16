
import React from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
// import api from "../api/Api";
// import AuthService from "../services/AuthService";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

const Register = () => {
  const navigate = useNavigate();
const { t } = useTranslation();
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await AuthService.register(data);

      if (response.data === "User registered successfully") {
        toast.success("Register successfuly");
        navigate("/login");
      } else {
        alert(response.data);
      }
    } catch (error) {
      alert("Registration failed");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-96 rounded-lg bg-white p-8 shadow-md">
        <h1 className="mb-6 text-2xl font-bold text-gray-800 text-center">
         {t("register.title")}
        </h1>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className="mb-1 block text-gray-700"><label>{t("register.firstName")}</label></label>
            <input
              type="text"
              className="w-full rounded border border-gray-300 p-2"
              {...register("userName")}
            />
          </div>

          <div>
            <label className="mb-1 block text-gray-700"> {t("register.email")}</label>
            <input
              type="email"
              className="w-full rounded border border-gray-300 p-2"
              {...register("email")}
            />
          </div>

          <div>
            <label className="mb-1 block text-gray-700">Role</label>
            <input
              type="text"
              className="w-full rounded border border-gray-300 p-2"
              {...register("role")}
            />
          </div>

          <div>
            <label className="mb-1 block text-gray-700"> {t("register.password")}</label>
            <input
              type="password"
              className="w-full rounded border border-gray-300 p-2"
              {...register("password")}
            />
          </div>

          <button
            type="submit"
            className="w-full rounded bg-blue-600 p-2 text-white hover:bg-blue-700"
          >
           {t("submit")}
          </button>
        </form>

        <p className="mt-4 text-gray-600 text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;

