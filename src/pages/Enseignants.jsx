import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { GraduationCap } from "lucide-react";
import api from "../api/Api";
import EnseignantForm from "../components/EnseignantForm";
import Sidebar from "../components/SideBar";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import AppModal from "../components/AppModal";
import EmptyState from "../components/EmptyState";

const enseignantSchema = yup.object({
  username: yup.string().required("Le nom d'utilisateur est obligatoire"),
  nom: yup.string().required("Le nom est obligatoire"),
  prenom: yup.string().required("Le prénom est obligatoire"),
  email: yup
    .string()
    .required("L'email est obligatoire")
    .email("Email invalide"),
  tel: yup.string().required("Le téléphone est obligatoire"),
  specialite: yup.string().required("La spécialité est obligatoire"),
  description: yup.string().required("La description est obligatoire"),
});

const Enseignants = () => {
  const URL = "api/enseignant";
  const { t } = useTranslation();
  const [enseignants, setEnseignants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [selectedEnseignantId, setSelectedEnseignantId] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDetailsModal, setOpenDetailsModal] = useState(false);
  const [editEnseignant, setEditEnseignant] = useState(null);
  const [selectedEnseignant, setSelectedEnseignant] = useState(null);
  const [searchSpecialite, setSearchSpecialite] = useState("");

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(enseignantSchema),
  });

  //  Deleting Process
  const handleCloseDelete = () => {
    setOpen(false);
  };

  const openDeleteDialog = (id) => {
    setSelectedEnseignantId(id);
    setOpen(true);
  };

  const deleteEnseignant = async (id) => {
    try {
      await api.delete(`${URL}/${id}`);
      setEnseignants(enseignants.filter((enseignant) => enseignant.id !== id));
      toast.success(t("enseignants.deleteSuccess"));
      setOpen(false);
    } catch (error) {
      toast.error(t("enseignants.deleteError"));
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
      const response = await api.post(URL, data);
      setEnseignants((prev) => [...prev, response.data]);
      handleClose();
      toast.success(t("enseignants.createSuccess"));
    } catch (error) {
      toast.error(t("enseignants.createError"));
    }
  };

  //  Edit Process
  const editThisEnseignant = (enseignant) => {
    setEditEnseignant(enseignant);
    reset(enseignant);
    setOpenEditModal(true);
  };

  const onEdit = async (data) => {
    try {
      const response = await api.put(`${URL}/${editEnseignant.id}`, data);
      setEnseignants((prev) =>
        prev.map((enseignant) =>
          enseignant.id === editEnseignant.id ? response.data : enseignant,
        ),
      );
      toast.success(t("enseignants.updateSuccess"));
      setOpenEditModal(false);
    } catch (error) {
      toast.error(t("enseignants.updateError"));
    }
  };

  //  Details Process
  const openThisEnseignant = (enseignant) => {
    setSelectedEnseignant(enseignant);
    setOpenDetailsModal(true);
  };

  //  Search Process
  const onSearch = async () => {
    if (searchSpecialite.trim() === "") {
      const response = await api.get(`${URL}?size=1000`);
      setEnseignants(response.data.content);
      return;
    }

    try {
      const response = await api.get(
        `${URL}/specialite/${searchSpecialite}?size=1000`,
      );
      setEnseignants(response.data.content);
    } catch (error) {
      setEnseignants([]);
      toast.error(t("enseignants.notFound"));
    }
  };

  useEffect(() => {
    const fetchEnseignants = async () => {
      try {
        const response = await api.get(`${URL}?size=1000`);
        setEnseignants(response.data.content);
      } finally {
        setLoading(false);
      }
    };

    fetchEnseignants();
  }, []);

  const searched = searchSpecialite.trim() !== "" && enseignants.length === 0;

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main">
        <NavBar />
        <div className="content">
          <div className="page-header has-toolbar">
            <div>
              <h1 className="page-title">{t("enseignants.title")}</h1>
            </div>
            <button onClick={handleOpen} className="btn">
              {t("enseignants.add")}
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
                placeholder={t("enseignants.searchPlaceholder")}
                value={searchSpecialite}
                onChange={(e) => setSearchSpecialite(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && onSearch()}
                className="input-trad"
              />
            </div>
            <span className="text-[11px] uppercase tracking-[0.08em] text-(--text-muted)">
              {enseignants.length}
            </span>
          </div>

          <div className="table-shell">
            <table className="tbl">
              <thead>
                <tr>
                  <th>{t("enseignants.id")}</th>
                  <th>{t("enseignants.username")}</th>
                  <th>{t("enseignants.nom")}</th>
                  <th>{t("enseignants.prenom")}</th>
                  <th>{t("enseignants.email")}</th>
                  <th>{t("enseignants.tel")}</th>
                  <th>{t("enseignants.specialite")}</th>
                  <th className="text-end">{t("enseignants.actions")}</th>
                </tr>
              </thead>
              <tbody>
                {loading
                  ? Array.from({ length: 5 }).map((_, i) => (
                      <tr key={i}>
                        <td colSpan={8}>
                          <div className="skeleton h-4 w-full" />
                        </td>
                      </tr>
                    ))
                  : enseignants.map((enseignant) => (
                      <tr key={enseignant.id}>
                        <td className="num">{enseignant.id}</td>
                        <td className="cell-strong">{enseignant.username}</td>
                        <td>{enseignant.nom}</td>
                        <td>{enseignant.prenom}</td>
                        <td className="cell-muted">{enseignant.email}</td>
                        <td className="cell-muted">{enseignant.tel}</td>
                        <td>
                          <span className="badge badge-ink">
                            {enseignant.specialite}
                          </span>
                        </td>
                        <td>
                          <div className="flex justify-end gap-1">
                            <button
                              onClick={() => openThisEnseignant(enseignant)}
                              className="btn-xs btn-xs-green"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                              </svg>
                              {t("enseignants.view")}
                            </button>
                            <button
                              onClick={() => editThisEnseignant(enseignant)}
                              className="btn-xs btn-xs-gold"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                              </svg>
                              {t("enseignants.edit")}
                            </button>
                            <button
                              onClick={() => openDeleteDialog(enseignant.id)}
                              className="btn-xs btn-xs-danger"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                              </svg>
                              {t("enseignants.delete")}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>

            {!loading && enseignants.length === 0 && (
              <EmptyState
                icon={<GraduationCap className="h-5 w-5" />}
                title={searched ? t("enseignants.notFound") : t("enseignants.empty")}
              />
            )}
          </div>
        </div>
        <Footer />
      </div>

      <AppModal
        open={open}
        onClose={handleCloseDelete}
        title={t("enseignants.deleteConfirmTitle")}
        labelledBy="delete-enseignant-title"
      >
        <p className="mb-1 text-[13px] leading-relaxed text-(--text-2)">
          {t("enseignants.deleteConfirmMessage", {
            username:
              enseignants.find((e) => e.id === selectedEnseignantId)?.username ||
              "",
          })}
        </p>
        <p className="text-[12px] text-(--text-muted)">{t("common.deleteHint")}</p>
        <div className="mt-6 flex items-center justify-end gap-2">
          <button type="button" onClick={handleCloseDelete} className="btn-secondary">
            {t("common.cancel")}
          </button>
          <button
            type="button"
            onClick={() => deleteEnseignant(selectedEnseignantId)}
            className="btn-danger"
          >
            {t("enseignants.delete")}
          </button>
        </div>
      </AppModal>

      <AppModal
        open={openModal}
        onClose={handleClose}
        title={t("enseignants.createTitle")}
        labelledBy="add-enseignant-title"
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <EnseignantForm register={register} errors={errors} />
          <div className="mt-5 flex items-center justify-end">
            <button type="submit" className="btn">
              {t("enseignants.save")}
            </button>
          </div>
        </form>
      </AppModal>

      <AppModal
        open={openEditModal}
        onClose={() => setOpenEditModal(false)}
        title={t("enseignants.editTitle")}
        labelledBy="edit-enseignant-title"
      >
        <form onSubmit={handleSubmit(onEdit)}>
          <EnseignantForm register={register} errors={errors} />
          <div className="mt-5 flex items-center justify-end">
            <button type="submit" className="btn">
              {t("enseignants.save")}
            </button>
          </div>
        </form>
      </AppModal>

      <AppModal
        open={openDetailsModal}
        onClose={() => setOpenDetailsModal(false)}
        title={`${t("enseignants.seeTitle")} — ${selectedEnseignant?.username ?? ""}`}
        labelledBy="details-enseignant-title"
      >
        {selectedEnseignant && (
          <dl className="m-0">
            <div className="dl">
              <dt>{t("enseignants.id")}</dt>
              <dd className="num">{selectedEnseignant.id}</dd>
            </div>
            <div className="dl">
              <dt>{t("enseignants.username")}</dt>
              <dd>{selectedEnseignant.username}</dd>
            </div>
            <div className="dl">
              <dt>{t("enseignants.nom")}</dt>
              <dd>{selectedEnseignant.nom}</dd>
            </div>
            <div className="dl">
              <dt>{t("enseignants.prenom")}</dt>
              <dd>{selectedEnseignant.prenom}</dd>
            </div>
            <div className="dl">
              <dt>{t("enseignants.email")}</dt>
              <dd>{selectedEnseignant.email}</dd>
            </div>
            <div className="dl">
              <dt>{t("enseignants.tel")}</dt>
              <dd>{selectedEnseignant.tel}</dd>
            </div>
            <div className="dl">
              <dt>{t("enseignants.specialite")}</dt>
              <dd>{selectedEnseignant.specialite}</dd>
            </div>
            <div className="dl">
              <dt>{t("enseignants.description")}</dt>
              <dd>{selectedEnseignant.description}</dd>
            </div>
            <div className="dl">
              <dt>{t("enseignants.role")}</dt>
              <dd>{t("enseignants.enseignantRole")}</dd>
            </div>
          </dl>
        )}
      </AppModal>
    </div>
  );
};

export default Enseignants;