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
import Sidebar from "../components/SideBar";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

const statutKeys = {
  PRESENT: "present",
  RETARD: "retard",
  ABSENT: "absent",
  EXCUSE: "excuse",
};

const statutColors = {
  PRESENT: "bg-[#0f3d2e]/10 text-[#0f3d2e] border border-[#0f3d2e]/15",
  RETARD: "bg-[#c79a3b]/15 text-[#8a691d] border border-[#c79a3b]/30",
  ABSENT: "bg-red-50 text-red-600 border border-red-200",
  EXCUSE: "bg-[#0f3d2e]/5 text-(--text-muted) border border-[#0f3d2e]/10",
};

const presenceSchema = yup.object({
  eleveId: yup
    .number()
    .typeError("L'élève est obligatoire")
    .min(1, "L'élève est obligatoire"),
  date: yup.string().required("La date est obligatoire"),
  statut: yup.string().required("Le statut est obligatoire"),
});

const Presences = () => {
  const URL = "api/presence";
  const ELEVE_URL = "api/eleve";
  const { t } = useTranslation();

  const [presences, setPresences] = useState([]);
  const [eleves, setEleves] = useState([]);
  const [searchUsername, setSearchUsername] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [statutFilter, setStatutFilter] = useState("ALL");
  const [open, setOpen] = useState(false);
  const [selectedPresenceId, setSelectedPresenceId] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editPresence, setEditPresence] = useState(null);

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(presenceSchema),
  });

  const today = () => {
    const d = new Date();
    const pad = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  };

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

  const fetchPresences = async () => {
    const response = await api.get(`${URL}?size=1000`);
    setPresences(response.data.content);
  };

  useEffect(() => {
    fetchPresences();
  }, []);

  const onSearch = async () => {
    if (searchUsername.trim() === "") {
      fetchPresences();
      return;
    }

    try {
      const response = await api.get(`${URL}/eleve/${searchUsername}?size=100`);
      setPresences(response.data.content);
    } catch (error) {
      setPresences([]);
      toast.error(t("presence.notFound"));
    }
  };

  const filtered = presences.filter(
    (presence) =>
      (!dateFilter || presence.date === dateFilter) &&
      (statutFilter === "ALL" || presence.statut === statutFilter),
  );

  const counts = presences.reduce(
    (acc, presence) => {
      acc[presence.statut] = (acc[presence.statut] || 0) + 1;
      return acc;
    },
    { PRESENT: 0, RETARD: 0, ABSENT: 0, EXCUSE: 0 },
  );

  //  Deleting Process
  const handleCloseDelete = () => setOpen(false);

  const openDeleteDialog = (id) => {
    setSelectedPresenceId(id);
    setOpen(true);
  };

  const deletePresence = async (id) => {
    try {
      await api.delete(`${URL}/${id}`);
      setPresences((prev) => prev.filter((presence) => presence.id !== id));
      toast.success(t("presence.deleteSuccess"));
      setOpen(false);
    } catch (error) {
      toast.error(t("presence.deleteError"));
    }
  };

  //  Adding Process
  const handleClose = () => setOpenModal(false);

  const handleOpen = async () => {
    reset({ date: today(), statut: "PRESENT" });
    setOpenModal(true);
    try {
      const response = await api.get(`${ELEVE_URL}?size=1000`);
      setEleves(response.data.content);
    } catch (error) {
      toast.error(t("presence.loadElevesError"));
    }
  };

  const onSubmit = async (data) => {
    try {
      const payload = {
        date: data.date,
        statut: data.statut,
        eleveId: Number(data.eleveId),
      };
      const response = await api.post(URL, payload);
      setPresences((prev) => [response.data, ...prev]);
      handleClose();
      toast.success(t("presence.createSuccess"));
    } catch (error) {
      toast.error(t("presence.createError"));
    }
  };

  //  Edit Process
  const editThisPresence = (presence) => {
    setEditPresence(presence);
    reset({ statut: presence.statut });
    setOpenEditModal(true);
  };

  const onEdit = async (data) => {
    try {
      await api.put(`${URL}/${editPresence.id}?statut=${data.statut}`);
      setPresences((prev) =>
        prev.map((presence) =>
          presence.id === editPresence.id
            ? { ...presence, statut: data.statut }
            : presence,
        ),
      );
      toast.success(t("presence.updateSuccess"));
      setOpenEditModal(false);
    } catch (error) {
      toast.error(t("presence.updateError"));
    }
  };

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
              {t("presence.title")}
            </h2>

            <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder={t("presence.searchPlaceholder")}
                    value={searchUsername}
                    onChange={(e) => setSearchUsername(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && onSearch()}
                    className="input-trad w-52"
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

                <input
                  type="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  title={t("presence.filterDate")}
                  className="input-trad w-40"
                />

                <select
                  value={statutFilter}
                  onChange={(e) => setStatutFilter(e.target.value)}
                  className="input-trad w-36"
                >
                  <option value="ALL">{t("presence.filterAll")}</option>
                  <option value="PRESENT">{t("eleveDetails.present")}</option>
                  <option value="RETARD">{t("eleveDetails.retard")}</option>
                  <option value="ABSENT">{t("eleveDetails.absent")}</option>
                  <option value="EXCUSE">{t("eleveDetails.excuse")}</option>
                </select>
              </div>

              <button onClick={handleOpen} className="btn-trad">
                <span className="select-none text-[10px] leading-none text-[#d9b45f]">✦</span>
                {t("presence.add")}
              </button>
            </div>

            <div className="mb-3 flex flex-wrap gap-2">
              {["PRESENT", "RETARD", "ABSENT", "EXCUSE"].map((key) => (
                <span
                  key={key}
                  className={`rounded-full px-3 py-1 text-[11px] font-medium ${statutColors[key]}`}
                >
                  {t(`eleveDetails.${statutKeys[key]}`)} : {counts[key] || 0}
                </span>
              ))}
            </div>

            <div className="trad-card p-2">
              <div className="trad-panel overflow-x-auto">
              <table className="w-full text-xs text-left text-(--text)">
                <thead>
                  <tr className="bg-[#f5efdf]/70 text-[10px] uppercase tracking-[0.18em] text-[#0f3d2e] border-b border-[#c79a3b]/30">
                    <th className="px-4 py-3 font-medium">{t("presence.id")}</th>
                    <th className="px-4 py-3 font-medium">{t("presence.eleve")}</th>
                    <th className="px-4 py-3 font-medium">{t("presence.date")}</th>
                    <th className="px-4 py-3 font-medium">{t("presence.statut")}</th>
                    <th className="px-4 py-3 font-medium text-center">
                      {t("presence.actions")}
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filtered.map((presence) => (
                    <tr
                      key={presence.id || `${presence.date}-${presence.eleve?.username}`}
                      className="border-b border-[#0f3d2e]/10 last:border-0 hover:bg-[#f6f0e0]/40 transition-colors"
                    >
                      <td className="px-4 py-3">{presence.id}</td>
                      <td className="px-4 py-3">
                        <span className="font-medium text-(--text)">
                          {presence.eleve?.prenom} {presence.eleve?.nom}
                        </span>
                        <span className="ms-1 text-[11px] text-(--text-muted)">
                          ({presence.eleve?.username})
                        </span>
                      </td>
                      <td className="px-4 py-3">{presence.date}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`rounded-md px-2 py-0.5 text-[11px] font-medium ${
                            statutColors[presence.statut] ||
                            "bg-[#0f3d2e]/5 text-(--text-muted)"
                          }`}
                        >
                          {t(
                            `eleveDetails.${
                              statutKeys[presence.statut] || "present"
                            }`,
                          )}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-center gap-1.5">
                          <button
                            onClick={() => editThisPresence(presence)}
                            className="btn-xs btn-xs-gold"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3">
                              <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                            </svg>
                            {t("presence.edit")}
                          </button>
                          <button
                            onClick={() => openDeleteDialog(presence.id)}
                            className="btn-xs btn-xs-danger"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3">
                              <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                            </svg>
                            {t("presence.delete")}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {filtered.length === 0 && (
                    <tr className="border-b border-[#0f3d2e]/10 last:border-0">
                      <td colSpan={5} className="px-4 py-6 text-center text-(--text-muted)">
                        {t("presence.noPresence")}
                      </td>
                    </tr>
                  )}
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
          {t("presence.deleteConfirmTitle")}
        </DialogTitle>

        <DialogActions>
          <Button onClick={handleCloseDelete} autoFocus>
            NO
          </Button>

          <Button onClick={() => deletePresence(selectedPresenceId)}>
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
              sx={{ fontSize: "0.9375rem", fontWeight: 600, color: "#0f3d2e", fontFamily: 'Georgia, "Amiri", serif', mb: 2 }}
            >
              <span style={{ color: "#c79a3b", marginInlineEnd: 6 }}>۞</span>
              {t("presence.createTitle")}
            </Typography>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
              <div>
                <label className="label-trad">
                  {t("presence.selectEleve")}
                </label>
                <select
                  {...register("eleveId")}
                  className="input-trad"
                >
                  <option value="">
                    {t("presence.selectElevePlaceholder")}
                  </option>
                  {eleves.map((eleve) => (
                    <option key={eleve.id} value={eleve.id}>
                      {eleve.prenom} {eleve.nom} ({eleve.username})
                    </option>
                  ))}
                </select>
                {errors.eleveId && (
                  <p className="mt-1 text-[11px] text-red-600">
                    {errors.eleveId.message}
                  </p>
                )}
              </div>

              <div>
                <label className="label-trad">
                  {t("presence.dateLabel")}
                </label>
                <input
                  type="date"
                  {...register("date")}
                  className="input-trad"
                />
                {errors.date && (
                  <p className="mt-1 text-[11px] text-red-600">
                    {errors.date.message}
                  </p>
                )}
              </div>

              <div>
                <label className="label-trad">
                  {t("presence.statut")}
                </label>
                <select
                  {...register("statut")}
                  className="input-trad"
                >
                  <option value="PRESENT">{t("eleveDetails.present")}</option>
                  <option value="RETARD">{t("eleveDetails.retard")}</option>
                  <option value="ABSENT">{t("eleveDetails.absent")}</option>
                  <option value="EXCUSE">{t("eleveDetails.excuse")}</option>
                </select>
                {errors.statut && (
                  <p className="mt-1 text-[11px] text-red-600">
                    {errors.statut.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="btn-trad mt-2 self-end"
              >
                <span className="select-none text-[10px] leading-none text-[#d9b45f]">✦</span>
                {t("presence.save")}
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
              sx={{ fontSize: "0.9375rem", fontWeight: 600, color: "#0f3d2e", fontFamily: 'Georgia, "Amiri", serif', mb: 2 }}
            >
              <span style={{ color: "#c79a3b", marginInlineEnd: 6 }}>۞</span>
              {t("presence.editTitle")}
            </Typography>
            <form onSubmit={handleSubmit(onEdit)} className="space-y-3">
              {editPresence && (
                <div className="text-xs text-(--text-muted) rounded-lg border border-[#c79a3b]/25 bg-white/60 px-3 py-2.5">
                  <div className="font-medium text-[#0f3d2e]">
                    {editPresence.eleve?.prenom} {editPresence.eleve?.nom} (
                    {editPresence.eleve?.username})
                  </div>
                  <div className="mt-1 text-(--text-muted)">{editPresence.date}</div>
                </div>
              )}

              <div>
                <label className="label-trad">
                  {t("presence.statut")}
                </label>
                <select
                  {...register("statut")}
                  className="input-trad"
                >
                  <option value="PRESENT">{t("eleveDetails.present")}</option>
                  <option value="RETARD">{t("eleveDetails.retard")}</option>
                  <option value="ABSENT">{t("eleveDetails.absent")}</option>
                  <option value="EXCUSE">{t("eleveDetails.excuse")}</option>
                </select>
              </div>

              <button
                type="submit"
                className="btn-trad mt-2 self-end"
              >
                <span className="select-none text-[10px] leading-none text-[#d9b45f]">✦</span>
                {t("presence.save")}
              </button>
            </form>
          </Box>
        </Fade>
      </Modal>
    </>
  );
};

export default Presences;