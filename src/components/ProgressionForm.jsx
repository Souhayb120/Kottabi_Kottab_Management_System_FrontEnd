import { useTranslation } from "react-i18next";

const ProgressionForm = ({ register, errors, eleves, enseignants }) => {
  const { t } = useTranslation();

  const inputClass = "input-trad";
  const labelClass = "label-trad";

  return (
    <div className="grid grid-cols-2 gap-3 py-3">
      <div>
        <label className={labelClass}>{t("progression.selectEleve")}</label>
        <select className={inputClass} {...register("eleveId")}>
          <option value="">{t("progression.selectElevePlaceholder")}</option>
          {eleves.map((eleve) => (
            <option key={eleve.id} value={eleve.id}>
              {eleve.prenom} {eleve.nom} ({eleve.username})
            </option>
          ))}
        </select>
        {errors.eleveId && (
          <p className="text-red-600 text-[11px] mt-0.5">
            {errors.eleveId.message}
          </p>
        )}
      </div>

      <div>
        <label className={labelClass}>{t("progression.selectEnseignant")}</label>
        <select className={inputClass} {...register("enseignantId")}>
          <option value="">{t("progression.selectEnseignantPlaceholder")}</option>
          {enseignants.map((enseignant) => (
            <option key={enseignant.id} value={enseignant.id}>
              {enseignant.prenom} {enseignant.nom} ({enseignant.username})
            </option>
          ))}
        </select>
        {errors.enseignantId && (
          <p className="text-red-600 text-[11px] mt-0.5">
            {errors.enseignantId.message}
          </p>
        )}
      </div>

      <div className="col-span-2">
        <label className={labelClass}>{t("progression.sourateLabel")}</label>
        <input className={inputClass} placeholder="Al-Baqarah" {...register("sourat")} />
        {errors.sourat && (
          <p className="text-red-600 text-[11px] mt-0.5">{errors.sourat.message}</p>
        )}
      </div>

      <div>
        <label className={labelClass}>{t("progression.versetDebutLabel")}</label>
        <input
          className={inputClass}
          type="number"
          min={1}
          {...register("versetDebut")}
        />
        {errors.versetDebut && (
          <p className="text-red-600 text-[11px] mt-0.5">
            {errors.versetDebut.message}
          </p>
        )}
      </div>

      <div>
        <label className={labelClass}>{t("progression.versetFinLabel")}</label>
        <input
          className={inputClass}
          type="number"
          min={1}
          {...register("versetFin")}
        />
        {errors.versetFin && (
          <p className="text-red-600 text-[11px] mt-0.5">
            {errors.versetFin.message}
          </p>
        )}
      </div>
    </div>
  );
};

export default ProgressionForm;