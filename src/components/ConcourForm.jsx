import { useTranslation } from "react-i18next";

const ConcourForm = ({ register, errors }) => {
  const { t } = useTranslation();

  const inputClass = "input-trad";
  const labelClass = "label-trad";

  return (
    <div className="grid grid-cols-2 gap-3 py-3">
      <div>
        <label className={labelClass}>{t("concours.nomLabel")}</label>
        <input className={inputClass} {...register("nom")} />
        {errors.nom && (
          <p className="text-red-600 text-[11px] mt-0.5">{errors.nom.message}</p>
        )}
      </div>

      <div>
        <label className={labelClass}>{t("concours.dateLabel")}</label>
        <input className={inputClass} type="date" {...register("dateCreation")} />
        {errors.dateCreation && (
          <p className="text-red-600 text-[11px] mt-0.5">
            {errors.dateCreation.message}
          </p>
        )}
      </div>

      <div className="col-span-2">
        <label className={labelClass}>{t("concours.niveauLabel")}</label>
        <select className={inputClass} {...register("niveauHifz")}>
          <option value="">{t("concours.selectNiveauPlaceholder")}</option>
          <option value="HIFZ_15_HIZB">{t("concours.hifz15")}</option>
          <option value="HIFZ_30_HIZB">{t("concours.hifz30")}</option>
          <option value="HIFZ_60_HIZB">{t("concours.hifz60")}</option>
        </select>
        {errors.niveauHifz && (
          <p className="text-red-600 text-[11px] mt-0.5">
            {errors.niveauHifz.message}
          </p>
        )}
      </div>

      <div className="col-span-2">
        <label className={labelClass}>{t("concours.descriptionLabel")}</label>
        <textarea
          rows={3}
          className={inputClass}
          {...register("description")}
        />
        {errors.description && (
          <p className="text-red-600 text-[11px] mt-0.5">
            {errors.description.message}
          </p>
        )}
      </div>
    </div>
  );
};

export default ConcourForm;