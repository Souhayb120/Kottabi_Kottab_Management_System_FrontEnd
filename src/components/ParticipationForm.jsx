import { useTranslation } from "react-i18next";

const ParticipationForm = ({ register, errors, eleves, enseignants, concours }) => {
  const { t } = useTranslation();

  const inputClass = "input-trad";
  const labelClass = "label-trad";

  return (
    <div className="grid grid-cols-1 gap-3 py-3 sm:grid-cols-2">
      <div>
        <label className={labelClass}>{t("participation.selectEleve")}</label>
        <select className={inputClass} {...register("eleveId")}>
          <option value="">{t("participation.selectElevePlaceholder")}</option>
          {eleves.map((eleve) => (
            <option key={eleve.id} value={eleve.id}>
              {eleve.prenom} {eleve.nom} ({eleve.username})
            </option>
          ))}
        </select>
        {errors.eleveId && (
          <p className="field-error">
            {errors.eleveId.message}
          </p>
        )}
      </div>

      <div>
        <label className={labelClass}>{t("participation.selectEnseignant")}</label>
        <select className={inputClass} {...register("enseignantId")}>
          <option value="">{t("participation.selectEnseignantPlaceholder")}</option>
          {enseignants.map((enseignant) => (
            <option key={enseignant.id} value={enseignant.id}>
              {enseignant.prenom} {enseignant.nom} ({enseignant.username})
            </option>
          ))}
        </select>
        {errors.enseignantId && (
          <p className="field-error">
            {errors.enseignantId.message}
          </p>
        )}
      </div>

      <div className="col-span-2">
        <label className={labelClass}>{t("participation.selectConcour")}</label>
        <select className={inputClass} {...register("concourId")}>
          <option value="">{t("participation.selectConcourPlaceholder")}</option>
          {concours.map((concour) => (
            <option key={concour.id} value={concour.id}>
              {concour.nom} ({concour.niveauHifz})
            </option>
          ))}
        </select>
        {errors.concourId && (
          <p className="field-error">
            {errors.concourId.message}
          </p>
        )}
      </div>

      <div>
        <label className={labelClass}>{t("participation.noteLabel")}</label>
        <input
          className={inputClass}
          type="number"
          step="0.1"
          min={0}
          {...register("note")}
        />
        {errors.note && (
          <p className="field-error">{errors.note.message}</p>
        )}
      </div>

      <div>
        <label className={labelClass}>{t("participation.classementLabel")}</label>
        <input
          className={inputClass}
          type="number"
          min={1}
          {...register("classement")}
        />
        {errors.classement && (
          <p className="field-error">
            {errors.classement.message}
          </p>
        )}
      </div>

      <div className="col-span-2">
        <label className={labelClass}>{t("participation.commentaireLabel")}</label>
        <textarea
          rows={2}
          className={inputClass}
          {...register("commentaire")}
        />
        {errors.commentaire && (
          <p className="field-error">
            {errors.commentaire.message}
          </p>
        )}
      </div>
    </div>
  );
};

export default ParticipationForm;