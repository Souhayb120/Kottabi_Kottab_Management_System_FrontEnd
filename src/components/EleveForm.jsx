import { useTranslation } from "react-i18next";

const EleveForm = ({ register, errors }) => {
  const { t } = useTranslation();

  const inputClass =
    "w-full border border-gray-300 rounded-md py-1 px-2 text-xs text-gray-700 focus:outline-none focus:border-slate-400";
  const labelClass = "block text-[11px] text-gray-600 mb-1";

  return (
    <div className="grid grid-cols-2 gap-3 py-3">
      <div>
        <label className={labelClass}>{t("eleves.username")}</label>
        <input className={inputClass} {...register("username")} />
        {errors.username && (
          <p className="text-red-500 text-[11px] mt-0.5">{errors.username.message}</p>
        )}
      </div>

      <div>
        <label className={labelClass}>{t("eleves.nom")}</label>
        <input className={inputClass} {...register("nom")} />
        {errors.nom && (
          <p className="text-red-500 text-[11px] mt-0.5">{errors.nom.message}</p>
        )}
      </div>

      <div>
        <label className={labelClass}>{t("eleves.prenom")}</label>
        <input className={inputClass} {...register("prenom")} />
        {errors.prenom && (
          <p className="text-red-500 text-[11px] mt-0.5">{errors.prenom.message}</p>
        )}
      </div>

      <div>
        <label className={labelClass}>{t("eleves.email")}</label>
        <input className={inputClass} {...register("email")} />
        {errors.email && (
          <p className="text-red-500 text-[11px] mt-0.5">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label className={labelClass}>{t("eleves.tel")}</label>
        <input className={inputClass} {...register("tel")} />
        {errors.tel && (
          <p className="text-red-500 text-[11px] mt-0.5">{errors.tel.message}</p>
        )}
      </div>

      <div>
        <label className={labelClass}>{t("eleves.dateNaissance")}</label>
        <input className={inputClass} type="date" {...register("dateNaissance")} />
        {errors.dateNaissance && (
          <p className="text-red-500 text-[11px] mt-0.5">
            {errors.dateNaissance.message}
          </p>
        )}
      </div>
    </div>
  );
};

export default EleveForm;