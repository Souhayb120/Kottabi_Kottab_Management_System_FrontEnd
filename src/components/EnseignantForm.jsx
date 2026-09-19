import { useTranslation } from "react-i18next";

const EnseignantForm = ({ register, errors }) => {
  const { t } = useTranslation();

  const inputClass = "input-trad";
  const labelClass = "label-trad";

  return (
    <div className="grid grid-cols-2 gap-3 py-3">
      <div>
        <label className={labelClass}>{t("enseignants.username")}</label>
        <input className={inputClass} {...register("username")} />
        {errors.username && (
          <p className="text-red-600 text-[11px] mt-1">{errors.username.message}</p>
        )}
      </div>

      <div>
        <label className={labelClass}>{t("enseignants.nom")}</label>
        <input className={inputClass} {...register("nom")} />
        {errors.nom && (
          <p className="text-red-600 text-[11px] mt-1">{errors.nom.message}</p>
        )}
      </div>

      <div>
        <label className={labelClass}>{t("enseignants.prenom")}</label>
        <input className={inputClass} {...register("prenom")} />
        {errors.prenom && (
          <p className="text-red-600 text-[11px] mt-1">{errors.prenom.message}</p>
        )}
      </div>

      <div>
        <label className={labelClass}>{t("enseignants.email")}</label>
        <input className={inputClass} {...register("email")} />
        {errors.email && (
          <p className="text-red-600 text-[11px] mt-1">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label className={labelClass}>{t("enseignants.tel")}</label>
        <input className={inputClass} {...register("tel")} />
        {errors.tel && (
          <p className="text-red-600 text-[11px] mt-1">{errors.tel.message}</p>
        )}
      </div>

      <div>
        <label className={labelClass}>{t("enseignants.specialite")}</label>
        <input className={inputClass} {...register("specialite")} />
        {errors.specialite && (
          <p className="text-red-600 text-[11px] mt-1">{errors.specialite.message}</p>
        )}
      </div>

      <div className="col-span-2">
        <label className={labelClass}>{t("enseignants.description")}</label>
        <input className={inputClass} {...register("description")} />
        {errors.description && (
          <p className="text-red-600 text-[11px] mt-1">{errors.description.message}</p>
        )}
      </div>
    </div>
  );
};

export default EnseignantForm;