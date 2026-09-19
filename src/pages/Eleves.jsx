import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import api from "../api/Api";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Fade from "@mui/material/Fade";
import Backdrop from "@mui/material/Backdrop";
import Typography from "@mui/material/Typography";
import EleveForm from "../components/EleveForm";
import Sidebar from "../components/SideBar";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

const eleveSchema = yup.object({
  username: yup.string().required("Le nom d'utilisateur est obligatoire"),
  nom: yup.string().required("Le nom est obligatoire"),
  prenom: yup.string().required("Le prénom est obligatoire"),
  email: yup
    .string()
    .required("L'email est obligatoire")
    .email("Email invalide"),
  tel: yup.string().required("Le téléphone est obligatoire"),
  dateNaissance: yup.string().required("La date de naissance est obligatoire"),
});

const Eleves = () => {
  const URL = "api/eleve";
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [eleves, setEleves] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedEleveId, setSelectedEleveId] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editEleve, setEditEleve] = useState(null);
  const [searchUsername, setSearchUsername] = useState("");

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(eleveSchema),
  });

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 440,
    bgcolor: "#fbfaf6",
    border: "1px solid rgba(199, 154, 59, 0.4)",
    boxShadow: "0 22px 60px -20px rgba(15, 61, 46, 0.45)",
    borderRadius: "18px",
    p: "22px",
  };

  //  Deleting Process
  const handleCloseDelete = () => {
    setOpen(false);
  };

  const openDeleteDialog = (id) => {
    setSelectedEleveId(id);
    setOpen(true);
  };

  const deleteEleve = async (id) => {
    try {
      await api.delete(`${URL}/${id}`);
      setEleves(eleves.filter((eleve) => eleve.id !== id));
      toast.success(t("eleves.deleteSuccess"));
      setOpen(false);
    } catch (error) {
      toast.error(t("eleves.deleteError"));
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
      setEleves((prev) => [...prev, response.data]);
      handleClose();
      toast.success(t("eleves.createSuccess"));
    } catch (error) {
      toast.error(t("eleves.createError"));
    }
  };

  //  Edit Process
  const editThisEleve = (eleve) => {
    setEditEleve(eleve);
    reset(eleve);
    setOpenEditModal(true);
  };

  const onEdit = async (data) => {
    try {
      const response = await api.put(`${URL}/${editEleve.id}`, data);
      setEleves((prev) =>
        prev.map((eleve) =>
          eleve.id === editEleve.id ? response.data : eleve,
        ),
      );
      toast.success(t("eleves.updateSuccess"));
      setOpenEditModal(false);
    } catch (error) {
      toast.error(t("eleves.updateError"));
    }
  };

  //  Search Process
  const onSearch = async () => {
    if (searchUsername.trim() === "") {
      const response = await api.get(`${URL}?size=1000`);
      setEleves(response.data.content);
      return;
    }

    try {
      const response = await api.get(`${URL}/username/${searchUsername}`);
      setEleves([response.data]);
    } catch (error) {
      setEleves([]);
      toast.error(t("eleves.notFound"));
    }
  };

  useEffect(() => {
    const fetchEleves = async () => {
      const response = await api.get(`${URL}?size=1000`);
      setEleves(response.data.content);
    };

    fetchEleves();
  }, []);

  return (
    <>
      <div className="app-layout">
        <Sidebar />
        <div className="main">
          <NavBar />
          <div className="content">
            <div className="ornament-row mb-1.5">
              <span className="select-none text-sm leading-none text-[#c79a3b]">۞</span>
            </div>
            <h2 className="mb-4 text-right font-serif text-lg font-semibold tracking-tight text-(--text)">
              {t("eleves.title")}
            </h2>

            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder={t("eleves.searchPlaceholder")}
                  value={searchUsername}
                  onChange={(e) => setSearchUsername(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && onSearch()}
                  className="input-trad w-56"
                />
                <button
                  onClick={onSearch}
                  className="btn-icon"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-3 h-3"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                    />
                  </svg>
                </button>
              </div>

              <button onClick={handleOpen} className="btn-trad">
                <span className="select-none text-[10px] leading-none text-[#d9b45f]">✦</span>
                {t("eleves.add")}
              </button>
            </div>

            <div className="trad-card p-2">
              <div className="trad-panel overflow-x-auto">
              <table className="w-full text-xs text-left text-(--text)">
                <thead>
                  <tr className="bg-[#f5efdf]/70 text-[10px] uppercase tracking-[0.18em] text-[#0f3d2e] border-b border-[#c79a3b]/30">
                    <th className="px-4 py-3 font-medium">{t("eleves.id")}</th>
                    <th className="px-4 py-3 font-medium">{t("eleves.username")}</th>
                    <th className="px-4 py-3 font-medium">{t("eleves.nom")}</th>
                    <th className="px-4 py-3 font-medium">{t("eleves.prenom")}</th>
                    <th className="px-4 py-3 font-medium">{t("eleves.email")}</th>
                    <th className="px-4 py-3 font-medium">{t("eleves.tel")}</th>
                    <th className="px-4 py-3 font-medium">{t("eleves.dateNaissance")}</th>
                    <th className="px-4 py-3 font-medium text-center">
                      {t("eleves.actions")}
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {eleves.map((eleve) => (
                    <tr
                      key={eleve.id}
                      className="border-b border-[#0f3d2e]/10 last:border-0 hover:bg-[#f6f0e0]/40 transition-colors"
                    >
                      <td className="px-4 py-3">{eleve.id}</td>
                      <td className="px-4 py-3 font-medium text-(--text)">
                        {eleve.username}
                      </td>
                      <td className="px-4 py-3">{eleve.nom}</td>
                      <td className="px-4 py-3">{eleve.prenom}</td>
                      <td className="px-4 py-3">{eleve.email}</td>
                      <td className="px-4 py-3">{eleve.tel}</td>
                      <td className="px-4 py-3">{eleve.dateNaissance}</td>
                      <td className="px-4 py-3">
                        <div className="flex justify-center gap-1.5">
                          <button
                            onClick={() => navigate(`/eleve/details/${eleve.username}`)}
                            className="btn-xs btn-xs-green"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                            </svg>
                            {t("eleves.view")}
                          </button>
                          <button
                            onClick={() => editThisEleve(eleve)}
                            className="btn-xs btn-xs-gold"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3">
                              <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                            </svg>
                            {t("eleves.edit")}
                          </button>
                          <button
                            onClick={() => openDeleteDialog(eleve.id)}
                            className="btn-xs btn-xs-danger"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3">
                              <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                            </svg>
                            {t("eleves.delete")}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
            </div>
          </div>
          <Footer />
        </div>
      </div>

      <Dialog
        open={open}
        onClose={handleCloseDelete}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        role="alertdialog"
      >
        <DialogTitle id="alert-dialog-title">
          {t("eleves.deleteConfirmTitle")}
        </DialogTitle>

        <DialogActions>
          <Button onClick={handleCloseDelete} autoFocus>
            NO
          </Button>

          <Button onClick={() => deleteEleve(selectedEleveId)}>YES</Button>
        </DialogActions>
      </Dialog>

      <Modal
        aria-labelledby="add-modal-title"
        aria-describedby="add-modal-description"
        open={openModal}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={openModal}>
          <Box sx={style}>
            <Typography
              id="add-modal-title"
              variant="h6"
              component="h2"
              sx={{ fontSize: "0.9375rem", fontWeight: 600, color: "#0f3d2e", fontFamily: 'Georgia, "Amiri", serif' }}
            >
              <span style={{ color: "#c79a3b", marginInlineEnd: 6 }}>۞</span>
              {t("eleves.createTitle")}
            </Typography>
            <form onSubmit={handleSubmit(onSubmit)}>
              <EleveForm register={register} errors={errors} />
              <button
                type="submit"
                className="btn-trad mt-2 self-end"
              >
                <span className="select-none text-[10px] leading-none text-[#d9b45f]">✦</span>
                {t("eleves.save")}
              </button>
            </form>
          </Box>
        </Fade>
      </Modal>

      <Modal
        aria-labelledby="edit-modal-title"
        aria-describedby="edit-modal-description"
        open={openEditModal}
        onClose={() => setOpenEditModal(false)}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={openEditModal}>
          <Box sx={style}>
            <Typography
              id="edit-modal-title"
              variant="h6"
              component="h2"
              sx={{ fontSize: "0.9375rem", fontWeight: 600, color: "#0f3d2e", fontFamily: 'Georgia, "Amiri", serif' }}
            >
              <span style={{ color: "#c79a3b", marginInlineEnd: 6 }}>۞</span>
              {t("eleves.editTitle")}
            </Typography>
            <form onSubmit={handleSubmit(onEdit)}>
              <EleveForm register={register} errors={errors} />
              <button
                type="submit"
                className="btn-trad mt-2 self-end"
              >
                <span className="select-none text-[10px] leading-none text-[#d9b45f]">✦</span>
                {t("eleves.save")}
              </button>
            </form>
          </Box>
        </Fade>
      </Modal>
    </>
  );
};

export default Eleves;