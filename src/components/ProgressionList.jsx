import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookQuran } from "@fortawesome/free-solid-svg-icons";
import api from "../api/Api";
import ProgressionForm from "./ProgressionForm";
import AppModal from "./AppModal";
import EmptyState from "./EmptyState";

const progressionSchema = yup.object({
  sourat: yup.string().required("La sourate est obligatoire"),
  versetDebut: yup
    .number()
    .typeError("Le verset de début est obligatoire")
    .min(1, "Le verset de début est obligatoire"),
  versetFin: yup
    .number()
    .typeError("Le verset de fin est obligatoire")
    .min(1, "Le verset de fin est obligatoire"),
  eleveId: yup
    .number()
    .typeError("L'élève est obligatoire")
    .min(1, "L'élève est obligatoire"),
  enseignantId: yup
    .number()
    .typeError("L'enseignant est obligatoire")
    .min(1, "L'enseignant est obligatoire"),
});

const ProgressionList = () => {
  const URL = "api/progressions";
  const { t } = useTranslation();
  const [progressions, setProgressions] = useState([]);
  const [eleves, setEleves] = useState([]);
  const [enseignants, setEnseignants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [selectedProgressionId, setSelectedProgressionId] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editProgression, setEditProgression] = useState(null);
  const [searchUsername, setSearchUsername] = useState("");

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(progressionSchema),
  });

  //  Deleting Process
  const handleCloseDelete = () => {
    setOpen(false);
  };

  const openDeleteDialog = (id) => {
    setSelectedProgressionId(id);
    setOpen(true);
  };

  const deleteProgression = async (id) => {
    try {
      await api.delete(`${URL}/${id}`);
      setProgressions(progressions.filter((progression) => progression.id !== id));
      toast.success(t("progression.deleteSuccess"));
      setOpen(false);
    } catch (error) {
      toast.error(t("progression.deleteError"));
    }
  };

  //  Adding Process
  const handleClose = () => setOpenModal(false);

  const handleOpen = () => {
    reset();
    setOpenModal(true);
  };

  const onSubmit = async (data) => {
    try {
      const payload = {
        sourat: data.sourat,
        versetDebut: Number(data.versetDebut),
        versetFin: Number(data.versetFin),
        eleveId: Number(data.eleveId),
        enseignantId: Number(data.enseignantId),
      };
      const response = await api.post(URL, payload);
      setProgressions((prev) => [response.data, ...prev]);
      handleClose();
      toast.success(t("progression.createSuccess"));
    } catch (error) {
      toast.error(t("progression.createError"));
    }
  };

  //  Edit Process
  const editThisProgression = (progression) => {
    setEditProgression(progression);
    reset({
      sourat: progression.sourat,
      versetDebut: progression.versetDebut,
      versetFin: progression.versetFin,
      eleveId: progression.eleve?.id || "",
      enseignantId: progression.enseignant?.id || "",
    });
    setOpenEditModal(true);
  };

  const handleCloseEdit = () => setOpenEditModal(false);

  const onEdit = async (data) => {
    try {
      const payload = {
        sourat: data.sourat,
        versetDebut: Number(data.versetDebut),
        versetFin: Number(data.versetFin),
        eleveId: Number(data.eleveId),
        enseignantId: Number(data.enseignantId),
      };
      const response = await api.put(`${URL}/${editProgression.id}`, payload);
      setProgressions((prev) =>
        prev.map((progression) =>
          progression.id === editProgression.id ? response.data : progression,
        ),
      );
      toast.success(t("progression.updateSuccess"));
      setOpenEditModal(false);
    } catch (error) {
      toast.error(t("progression.updateError"));
    }
  };

  //  Search Process
  const onSearch = async () => {
    if (searchUsername.trim() === "") {
      const response = await api.get(`${URL}?size=1000`);
      setProgressions(response.data.content);
      return;
    }

    try {
      const response = await api.get(`${URL}/eleve/${searchUsername}?size=100`);
      setProgressions(response.data.content);
    } catch (error) {
      setProgressions([]);
      toast.error(t("progression.notFound"));
    }
  };

  useEffect(() => {
    const fetchProgressions = async () => {
      const response = await api.get(`${URL}?size=1000`);
      setProgressions(response.data.content);
      setLoading(false);
    };

    const fetchEleves = async () => {
      try {
        const response = await api.get("api/eleve?size=1000");
        setEleves(response.data.content);
      } catch (error) {
        toast.error(t("progression.loadElevesError"));
      }
    };

    const fetchEnseignants = async () => {
      try {
        const response = await api.get("api/enseignant?size=1000");
        setEnseignants(response.data.content);
      } catch (error) {
        toast.error(t("progression.loadEnseignantsError"));
      }
    };

    fetchProgressions();
    fetchEleves();
    fetchEnseignants();
  }, []);

  const searched = searchUsername.trim() !== "" && progressions.length === 0;

  return (
    <>
      <div className="page-header has-toolbar">
        <div>
          <h1 className="page-title">{t("progression.title")}</h1>
        </div>
        <button onClick={handleOpen} className="btn">
          {t("progression.add")}
        </button>
      </div>

      <div className="toolbar">
        <div className="searchbox">
          <svg
            className="search-ico"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.8}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            />
          </svg>
          <input
            type="text"
            placeholder={t("progression.searchPlaceholder")}
            value={searchUsername}
            onChange={(e) => setSearchUsername(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSearch()}
            className="input-trad"
          />
        </div>
        <span className="text-[11px] uppercase tracking-[0.08em] text-(--text-muted)">
          {progressions.length}
        </span>
      </div>

      <div className="table-shell">
        <table className="tbl">
          <thead>
            <tr>
              <th>{t("progression.id")}</th>
              <th>{t("progression.eleve")}</th>
              <th>{t("progression.sourate")}</th>
              <th>{t("progression.versets")}</th>
              <th>{t("progression.enseignant")}</th>
              <th className="text-end">{t("progression.actions")}</th>
            </tr>
          </thead>
          <tbody>
            {loading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td colSpan={6}>
                      <div className="skeleton h-4 w-full" />
                    </td>
                  </tr>
                ))
              : progressions.map((progression) => (
                  <tr key={progression.id}>
                    <td className="num">{progression.id}</td>
                    <td>
                      <span className="cell-strong">
                        {progression.eleve?.prenom} {progression.eleve?.nom}
                      </span>
                      <span className="ms-2 text-[11px] text-(--text-muted)">
                        ({progression.eleve?.username})
                      </span>
                    </td>
                    <td>
                      <span className="badge badge-ink">
                        {progression.sourat}
                      </span>
                    </td>
                    <td className="cell-muted">
                      {progression.versetDebut} – {progression.versetFin}
                    </td>
                    <td className="cell-muted">
                      {progression.enseignant?.prenom}{" "}
                      {progression.enseignant?.nom}
                    </td>
                    <td>
                      <div className="flex justify-end gap-1">
                        <button
                          onClick={() => editThisProgression(progression)}
                          className="btn-xs btn-xs-gold"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                          </svg>
                          {t("progression.edit")}
                        </button>
                        <button
                          onClick={() => openDeleteDialog(progression.id)}
                          className="btn-xs btn-xs-danger"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                          </svg>
                          {t("progression.delete")}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>

        {!loading && progressions.length === 0 && (
          <EmptyState
            icon={<FontAwesomeIcon icon={faBookQuran} className="h-5 w-5" />}
            title={
              searched
                ? t("progression.notFound")
                : t("progression.noProgressions")
            }
          />
        )}
      </div>

      <AppModal
        open={open}
        onClose={handleCloseDelete}
        title={t("progression.deleteConfirmTitle")}
        labelledBy="delete-progression-title"
      >
        <p className="text-[13px] leading-relaxed text-(--text-2)">
          {t("progression.deleteConfirmMessage")}
        </p>
        <p className="mt-1 text-[12px] text-(--text-muted)">{t("common.deleteHint")}</p>
        <div className="mt-6 flex items-center justify-end gap-2">
          <button type="button" onClick={handleCloseDelete} className="btn-secondary">
            {t("common.cancel")}
          </button>
          <button
            type="button"
            onClick={() => deleteProgression(selectedProgressionId)}
            className="btn-danger"
          >
            {t("progression.delete")}
          </button>
        </div>
      </AppModal>

      <AppModal
        open={openModal}
        onClose={handleClose}
        title={t("progression.createTitle")}
        labelledBy="add-progression-title"
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <ProgressionForm
            register={register}
            errors={errors}
            eleves={eleves}
            enseignants={enseignants}
          />
          <div className="mt-5 flex items-center justify-end">
            <button type="submit" className="btn">
              {t("progression.save")}
            </button>
          </div>
        </form>
      </AppModal>

      <AppModal
        open={openEditModal}
        onClose={handleCloseEdit}
        title={t("progression.editTitle")}
        labelledBy="edit-progression-title"
      >
        <form onSubmit={handleSubmit(onEdit)}>
          <ProgressionForm
            register={register}
            errors={errors}
            eleves={eleves}
            enseignants={enseignants}
          />
          <div className="mt-5 flex items-center justify-end">
            <button type="submit" className="btn">
              {t("progression.save")}
            </button>
          </div>
        </form>
      </AppModal>
    </>
  );
};

export default ProgressionList;