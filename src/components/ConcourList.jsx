import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrophy } from "@fortawesome/free-solid-svg-icons";
import api from "../api/Api";
import ConcourForm from "./ConcourForm";
import AppModal from "./AppModal";
import EmptyState from "./EmptyState";

const concourSchema = yup.object({
  nom: yup.string().required("Le nom est obligatoire"),
  description: yup.string(),
  dateCreation: yup.string().required("La date de création est obligatoire"),
  niveauHifz: yup.string().required("Le niveau de mémorisation est obligatoire"),
});

const niveauKeys = {
  HIFZ_15_HIZB: "hifz15",
  HIFZ_30_HIZB: "hifz30",
  HIFZ_60_HIZB: "hifz60",
};

const ConcourList = () => {
  const URL = "api/concour";
  const { t } = useTranslation();
  const [concours, setConcours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [selectedConcourId, setSelectedConcourId] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editConcour, setEditConcour] = useState(null);

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(concourSchema),
  });

  const niveauLabel = (niveau) =>
    niveau ? t(`concours.${niveauKeys[niveau] || "hifz15"}`) : "—";

  //  Deleting Process
  const handleCloseDelete = () => {
    setOpen(false);
  };

  const openDeleteDialog = (id) => {
    setSelectedConcourId(id);
    setOpen(true);
  };

  const deleteConcour = async (id) => {
    try {
      await api.delete(`${URL}/${id}`);
      setConcours(concours.filter((concour) => concour.id !== id));
      toast.success(t("concours.deleteSuccess"));
      setOpen(false);
    } catch (error) {
      toast.error(t("concours.deleteError"));
    }
  };

  //  Adding Process
  const handleClose = () => setOpenModal(false);

  const handleOpen = () => {
    reset({
      nom: "",
      description: "",
      dateCreation: new Date().toISOString().slice(0, 10),
      niveauHifz: "",
    });
    setOpenModal(true);
  };

  const onSubmit = async (data) => {
    try {
      const response = await api.post(URL, data);
      setConcours((prev) => [response.data, ...prev]);
      handleClose();
      toast.success(t("concours.createSuccess"));
    } catch (error) {
      toast.error(t("concours.createError"));
    }
  };

  //  Edit Process
  const editThisConcour = (concour) => {
    setEditConcour(concour);
    reset({
      nom: concour.nom,
      description: concour.description || "",
      dateCreation: concour.dateCreation,
      niveauHifz: concour.niveauHifz,
    });
    setOpenEditModal(true);
  };

  const handleCloseEdit = () => setOpenEditModal(false);

  const onEdit = async (data) => {
    try {
      const response = await api.put(`${URL}/${editConcour.id}`, data);
      setConcours((prev) =>
        prev.map((concour) =>
          concour.id === editConcour.id ? response.data : concour,
        ),
      );
      toast.success(t("concours.updateSuccess"));
      setOpenEditModal(false);
    } catch (error) {
      toast.error(t("concours.updateError"));
    }
  };

  useEffect(() => {
    const fetchConcours = async () => {
      try {
        const response = await api.get(`${URL}?size=1000`);
        setConcours(response.data.content);
      } catch (error) {
        toast.error(t("concours.loadError"));
      } finally {
        setLoading(false);
      }
    };

    fetchConcours();
  }, []);

  return (
    <>
      <div className="page-header has-toolbar">
        <div>
          <h1 className="page-title">{t("concours.title")}</h1>
        </div>
        <button onClick={handleOpen} className="btn">
          {t("concours.add")}
        </button>
      </div>

      <div className="table-shell">
        <table className="tbl">
          <thead>
            <tr>
              <th>{t("concours.id")}</th>
              <th>{t("concours.nom")}</th>
              <th>{t("concours.dateCreation")}</th>
              <th>{t("concours.niveauHifz")}</th>
              <th className="text-end">{t("concours.participants")}</th>
              <th className="text-end">{t("concours.actions")}</th>
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
              : concours.map((concour) => (
                  <tr key={concour.id}>
                    <td className="num">{concour.id}</td>
                    <td className="cell-strong">{concour.nom}</td>
                    <td className="cell-muted">{concour.dateCreation}</td>
                    <td>
                      <span className="badge badge-warn">
                        {niveauLabel(concour.niveauHifz)}
                      </span>
                    </td>
                    <td className="text-end num">
                      {concour.participationList?.length || 0}
                    </td>
                    <td>
                      <div className="flex justify-end gap-1">
                        <button
                          onClick={() => editThisConcour(concour)}
                          className="btn-xs btn-xs-gold"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                          </svg>
                          {t("concours.edit")}
                        </button>
                        <button
                          onClick={() => openDeleteDialog(concour.id)}
                          className="btn-xs btn-xs-danger"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                          </svg>
                          {t("concours.delete")}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>

        {!loading && concours.length === 0 && (
          <EmptyState
            icon={<FontAwesomeIcon icon={faTrophy} className="h-5 w-5" />}
            title={t("concours.noConcours")}
          />
        )}
      </div>

      <AppModal
        open={open}
        onClose={handleCloseDelete}
        title={t("concours.deleteConfirmTitle")}
        labelledBy="delete-concour-title"
      >
        <p className="text-[13px] leading-relaxed text-(--text-2)">
          {t("concours.deleteConfirmMessage")}
        </p>
        <p className="mt-1 text-[12px] text-(--text-muted)">{t("common.deleteHint")}</p>
        <div className="mt-6 flex items-center justify-end gap-2">
          <button type="button" onClick={handleCloseDelete} className="btn-secondary">
            {t("common.cancel")}
          </button>
          <button
            type="button"
            onClick={() => deleteConcour(selectedConcourId)}
            className="btn-danger"
          >
            {t("concours.delete")}
          </button>
        </div>
      </AppModal>

      <AppModal
        open={openModal}
        onClose={handleClose}
        title={t("concours.createTitle")}
        labelledBy="add-concour-title"
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <ConcourForm register={register} errors={errors} />
          <div className="mt-5 flex items-center justify-end">
            <button type="submit" className="btn">
              {t("concours.save")}
            </button>
          </div>
        </form>
      </AppModal>

      <AppModal
        open={openEditModal}
        onClose={handleCloseEdit}
        title={t("concours.editTitle")}
        labelledBy="edit-concour-title"
      >
        <form onSubmit={handleSubmit(onEdit)}>
          <ConcourForm register={register} errors={errors} />
          <div className="mt-5 flex items-center justify-end">
            <button type="submit" className="btn">
              {t("concours.save")}
            </button>
          </div>
        </form>
      </AppModal>
    </>
  );
};

export default ConcourList;