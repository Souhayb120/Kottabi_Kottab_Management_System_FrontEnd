import { useEffect, useState } from "react";
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
import ConcourForm from "../components/ConcourForm";
import Sidebar from "../components/SideBar";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

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

const Concours = () => {
  const URL = "api/concour";
  const { t } = useTranslation();
  const [concours, setConcours] = useState([]);
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
      }
    };

    fetchConcours();
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
              {t("concours.title")}
            </h2>

            <div className="flex justify-between items-center mb-4">
              <span className="flex items-center gap-2 text-xs text-(--text-muted)">
                <span className="select-none text-[10px] text-[#c79a3b]">✦</span>
                {concours.length} {t("concours.title")}
              </span>

              <button onClick={handleOpen} className="btn-trad">
                <span className="select-none text-[10px] leading-none text-[#d9b45f]">✦</span>
                {t("concours.add")}
              </button>
            </div>

            <div className="trad-card p-2">
              <div className="trad-panel overflow-x-auto">
              <table className="w-full text-xs text-left text-(--text)">
                <thead>
                  <tr className="bg-[#f5efdf]/70 text-[10px] uppercase tracking-[0.18em] text-[#0f3d2e] border-b border-[#c79a3b]/30">
                    <th className="px-4 py-3 font-medium">{t("concours.id")}</th>
                    <th className="px-4 py-3 font-medium">{t("concours.nom")}</th>
                    <th className="px-4 py-3 font-medium">{t("concours.dateCreation")}</th>
                    <th className="px-4 py-3 font-medium">{t("concours.niveauHifz")}</th>
                    <th className="px-4 py-3 font-medium">
                      {t("concours.participants")}
                    </th>
                    <th className="px-4 py-3 font-medium text-center">
                      {t("concours.actions")}
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {concours.map((concour) => (
                    <tr
                      key={concour.id}
                      className="border-b border-[#0f3d2e]/10 last:border-0 hover:bg-[#f6f0e0]/40 transition-colors"
                    >
                      <td className="px-4 py-3">{concour.id}</td>
                      <td className="px-4 py-3 font-medium text-(--text)">
                        {concour.nom}
                      </td>
                      <td className="px-4 py-3">{concour.dateCreation}</td>
                      <td className="px-4 py-3">
                        <span className="rounded-md bg-[#c79a3b]/15 border border-[#c79a3b]/30 px-2 py-0.5 text-[11px] font-medium text-[#8a691d]">
                          {niveauLabel(concour.niveauHifz)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {concour.participationList?.length || 0}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-center gap-1.5">
                          <button
                            onClick={() => editThisConcour(concour)}
                            className="btn-xs btn-xs-gold"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3">
                              <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                            </svg>
                            {t("concours.edit")}
                          </button>
                          <button
                            onClick={() => openDeleteDialog(concour.id)}
                            className="btn-xs btn-xs-danger"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3">
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
          {t("concours.deleteConfirmTitle")}
        </DialogTitle>

        <DialogActions>
          <Button onClick={handleCloseDelete} autoFocus>
            NO
          </Button>

          <Button onClick={() => deleteConcour(selectedConcourId)}>
            YES
          </Button>
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
              {t("concours.createTitle")}
            </Typography>
            <form onSubmit={handleSubmit(onSubmit)}>
              <ConcourForm register={register} errors={errors} />
              <button
                type="submit"
                className="btn-trad mt-2 self-end"
              >
                <span className="select-none text-[10px] leading-none text-[#d9b45f]">✦</span>
                {t("concours.save")}
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
              {t("concours.editTitle")}
            </Typography>
            <form onSubmit={handleSubmit(onEdit)}>
              <ConcourForm register={register} errors={errors} />
              <button
                type="submit"
                className="btn-trad mt-2 self-end"
              >
                <span className="select-none text-[10px] leading-none text-[#d9b45f]">✦</span>
                {t("concours.save")}
              </button>
            </form>
          </Box>
        </Fade>
      </Modal>
    </>
  );
};

export default Concours;