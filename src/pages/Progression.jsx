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

const Progressions = () => {
  const URL = "api/progressions";
  const ELEVE_URL = "api/eleve";
  const ENSEIGNANT_URL = "api/enseignant";
  const { t } = useTranslation();

  const [progressions, setProgressions] = useState([]);
  const [eleves, setEleves] = useState([]);
  const [enseignants, setEnseignants] = useState([]);
  const [searchUsername, setSearchUsername] = useState("");
  const [souratFilter, setSouratFilter] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedProgressionId, setSelectedProgressionId] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editProgression, setEditProgression] = useState(null);

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(progressionSchema),
  });

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 440,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 3,
  };

  const fetchProgressions = async () => {
    const response = await api.get(`${URL}?size=1000`);
    setProgressions(response.data.content);
  };

  useEffect(() => {
    fetchProgressions();
  }, []);

  const onSearch = async () => {
    if (searchUsername.trim() === "") {
      fetchProgressions();
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

  const filtered = progressions.filter(
    (progression) =>
      !souratFilter ||
      (progression.sourat || "").toLowerCase().includes(souratFilter.toLowerCase()),
  );

  //  Deleting Process
  const handleCloseDelete = () => setOpen(false);

  const openDeleteDialog = (id) => {
    setSelectedProgressionId(id);
    setOpen(true);
  };

  const deleteProgression = async (id) => {
    try {
      await api.delete(`${URL}/${id}`);
      setProgressions((prev) => prev.filter((progression) => progression.id !== id));
      toast.success(t("progression.deleteSuccess"));
      setOpen(false);
    } catch (error) {
      toast.error(t("progression.deleteError"));
    }
  };

  //  Adding Process
  const handleClose = () => setOpenModal(false);

  const handleOpen = async () => {
    reset();
    setOpenModal(true);
    try {
      const eleveRes = await api.get(`${ELEVE_URL}?size=1000`);
      setEleves(eleveRes.data.content);
    } catch (error) {
      toast.error(t("progression.loadElevesError"));
    }

    try {
      const enseignantRes = await api.get(`${ENSEIGNANT_URL}?size=1000`);
      setEnseignants(enseignantRes.data.content);
    } catch (error) {
      toast.error(t("progression.loadEnseignantsError"));
    }
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

  return (
    <>
      <div className="app-layout">
        <Sidebar />
        <div className="main">
          <NavBar />
          <div className="content">
            <h2 className="text-base font-semibold text-gray-700 text-right mb-3">
              {t("progression.title")}
            </h2>

            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder={t("progression.searchPlaceholder")}
                    value={searchUsername}
                    onChange={(e) => setSearchUsername(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && onSearch()}
                    className="border border-gray-300 rounded-md py-0.5 px-2 text-xs focus:outline-none focus:border-slate-400"
                  />
                  <button
                    onClick={onSearch}
                    className="rounded bg-slate-700 p-1.5 text-white hover:bg-slate-600"
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
                  type="text"
                  placeholder={t("progression.sourate")}
                  value={souratFilter}
                  onChange={(e) => setSouratFilter(e.target.value)}
                  className="border border-gray-300 rounded-md py-0.5 px-2 text-xs focus:outline-none focus:border-slate-400"
                />
              </div>

              <Button size="small" onClick={handleOpen}>
                {t("progression.add")}
              </Button>
            </div>

            <div className="mt-3 overflow-hidden rounded-xl bg-white ring-1 ring-gray-200">
              <table className="w-full text-xs text-left text-gray-600">
                <thead>
                  <tr className="bg-gray-50 text-[11px] uppercase tracking-wider text-gray-400 border-b border-gray-200">
                    <th className="px-4 py-3 font-medium">{t("progression.id")}</th>
                    <th className="px-4 py-3 font-medium">{t("progression.eleve")}</th>
                    <th className="px-4 py-3 font-medium">{t("progression.sourate")}</th>
                    <th className="px-4 py-3 font-medium">{t("progression.versets")}</th>
                    <th className="px-4 py-3 font-medium">{t("progression.enseignant")}</th>
                    <th className="px-4 py-3 font-medium text-center">
                      {t("progression.actions")}
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filtered.map((progression) => (
                    <tr
                      key={progression.id || `${progression.eleve?.username}-${progression.sourat}`}
                      className="border-b border-gray-100 last:border-0 hover:bg-gray-50/70 transition-colors"
                    >
                      <td className="px-4 py-3">{progression.id}</td>
                      <td className="px-4 py-3">
                        <span className="font-medium text-gray-700">
                          {progression.eleve?.prenom} {progression.eleve?.nom}
                        </span>
                        <span className="ms-1 text-[11px] text-gray-400">
                          ({progression.eleve?.username})
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700">
                          {progression.sourat}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {progression.versetDebut} - {progression.versetFin}
                      </td>
                      <td className="px-4 py-3">
                        {progression.enseignant?.prenom} {progression.enseignant?.nom}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-center gap-1.5">
                          <button
                            onClick={() => editThisProgression(progression)}
                            className="flex items-center gap-1 rounded-md bg-amber-500 px-2.5 py-1 text-[11px] font-medium text-white transition-colors hover:bg-amber-400"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3">
                              <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                            </svg>
                            {t("progression.edit")}
                          </button>
                          <button
                            onClick={() => openDeleteDialog(progression.id)}
                            className="flex items-center gap-1 rounded-md bg-red-500 px-2.5 py-1 text-[11px] font-medium text-white transition-colors hover:bg-red-400"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3">
                              <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                            </svg>
                            {t("progression.delete")}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {filtered.length === 0 && (
                    <tr className="border-b border-gray-100 last:border-0">
                      <td colSpan={6} className="px-4 py-6 text-center text-gray-400">
                        {t("progression.noProgressions")}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
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
          {t("progression.deleteConfirmTitle")}
        </DialogTitle>

        <DialogActions>
          <Button onClick={handleCloseDelete} autoFocus>
            NO
          </Button>

          <Button onClick={() => deleteProgression(selectedProgressionId)}>
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
              sx={{ fontSize: "0.9375rem", fontWeight: 600, mb: 2 }}
            >
              {t("progression.createTitle")}
            </Typography>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
              <div>
                <label className="mb-1 block text-xs text-gray-500">
                  {t("progression.selectEleve")}
                </label>
                <select
                  {...register("eleveId")}
                  className="w-full rounded-md border border-gray-300 px-2 py-1.5 text-xs focus:outline-none focus:border-slate-400"
                >
                  <option value="">
                    {t("progression.selectElevePlaceholder")}
                  </option>
                  {eleves.map((eleve) => (
                    <option key={eleve.id} value={eleve.id}>
                      {eleve.prenom} {eleve.nom} ({eleve.username})
                    </option>
                  ))}
                </select>
                {errors.eleveId && (
                  <p className="mt-1 text-[11px] text-red-500">
                    {errors.eleveId.message}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-1 block text-xs text-gray-500">
                  {t("progression.selectEnseignant")}
                </label>
                <select
                  {...register("enseignantId")}
                  className="w-full rounded-md border border-gray-300 px-2 py-1.5 text-xs focus:outline-none focus:border-slate-400"
                >
                  <option value="">
                    {t("progression.selectEnseignantPlaceholder")}
                  </option>
                  {enseignants.map((enseignant) => (
                    <option key={enseignant.id} value={enseignant.id}>
                      {enseignant.prenom} {enseignant.nom} ({enseignant.username})
                    </option>
                  ))}
                </select>
                {errors.enseignantId && (
                  <p className="mt-1 text-[11px] text-red-500">
                    {errors.enseignantId.message}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-1 block text-xs text-gray-500">
                  {t("progression.sourateLabel")}
                </label>
                <input
                  type="text"
                  placeholder="Al-Baqarah"
                  {...register("sourat")}
                  className="w-full rounded-md border border-gray-300 px-2 py-1.5 text-xs focus:outline-none focus:border-slate-400"
                />
                {errors.sourat && (
                  <p className="mt-1 text-[11px] text-red-500">
                    {errors.sourat.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs text-gray-500">
                    {t("progression.versetDebutLabel")}
                  </label>
                  <input
                    type="number"
                    min={1}
                    {...register("versetDebut")}
                    className="w-full rounded-md border border-gray-300 px-2 py-1.5 text-xs focus:outline-none focus:border-slate-400"
                  />
                  {errors.versetDebut && (
                    <p className="mt-1 text-[11px] text-red-500">
                      {errors.versetDebut.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-1 block text-xs text-gray-500">
                    {t("progression.versetFinLabel")}
                  </label>
                  <input
                    type="number"
                    min={1}
                    {...register("versetFin")}
                    className="w-full rounded-md border border-gray-300 px-2 py-1.5 text-xs focus:outline-none focus:border-slate-400"
                  />
                  {errors.versetFin && (
                    <p className="mt-1 text-[11px] text-red-500">
                      {errors.versetFin.message}
                    </p>
                  )}
                </div>
              </div>

              <button
                type="submit"
                className="p-0.5 px-2 bg-green-600 rounded text-xs text-white flex self-end hover:bg-green-500"
              >
                {t("progression.save")}
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
              sx={{ fontSize: "0.9375rem", fontWeight: 600, mb: 2 }}
            >
              {t("progression.editTitle")}
            </Typography>
            <form onSubmit={handleSubmit(onEdit)} className="space-y-3">
              <div>
                <label className="mb-1 block text-xs text-gray-500">
                  {t("progression.selectEleve")}
                </label>
                <select
                  {...register("eleveId")}
                  className="w-full rounded-md border border-gray-300 px-2 py-1.5 text-xs focus:outline-none focus:border-slate-400"
                >
                  <option value="">
                    {t("progression.selectElevePlaceholder")}
                  </option>
                  {eleves.map((eleve) => (
                    <option key={eleve.id} value={eleve.id}>
                      {eleve.prenom} {eleve.nom} ({eleve.username})
                    </option>
                  ))}
                </select>
                {errors.eleveId && (
                  <p className="mt-1 text-[11px] text-red-500">
                    {errors.eleveId.message}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-1 block text-xs text-gray-500">
                  {t("progression.selectEnseignant")}
                </label>
                <select
                  {...register("enseignantId")}
                  className="w-full rounded-md border border-gray-300 px-2 py-1.5 text-xs focus:outline-none focus:border-slate-400"
                >
                  <option value="">
                    {t("progression.selectEnseignantPlaceholder")}
                  </option>
                  {enseignants.map((enseignant) => (
                    <option key={enseignant.id} value={enseignant.id}>
                      {enseignant.prenom} {enseignant.nom} ({enseignant.username})
                    </option>
                  ))}
                </select>
                {errors.enseignantId && (
                  <p className="mt-1 text-[11px] text-red-500">
                    {errors.enseignantId.message}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-1 block text-xs text-gray-500">
                  {t("progression.sourateLabel")}
                </label>
                <input
                  type="text"
                  placeholder="Al-Baqarah"
                  {...register("sourat")}
                  className="w-full rounded-md border border-gray-300 px-2 py-1.5 text-xs focus:outline-none focus:border-slate-400"
                />
                {errors.sourat && (
                  <p className="mt-1 text-[11px] text-red-500">
                    {errors.sourat.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs text-gray-500">
                    {t("progression.versetDebutLabel")}
                  </label>
                  <input
                    type="number"
                    min={1}
                    {...register("versetDebut")}
                    className="w-full rounded-md border border-gray-300 px-2 py-1.5 text-xs focus:outline-none focus:border-slate-400"
                  />
                  {errors.versetDebut && (
                    <p className="mt-1 text-[11px] text-red-500">
                      {errors.versetDebut.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-1 block text-xs text-gray-500">
                    {t("progression.versetFinLabel")}
                  </label>
                  <input
                    type="number"
                    min={1}
                    {...register("versetFin")}
                    className="w-full rounded-md border border-gray-300 px-2 py-1.5 text-xs focus:outline-none focus:border-slate-400"
                  />
                  {errors.versetFin && (
                    <p className="mt-1 text-[11px] text-red-500">
                      {errors.versetFin.message}
                    </p>
                  )}
                </div>
              </div>

              <button
                type="submit"
                className="p-0.5 px-2 bg-green-600 rounded text-xs text-white flex self-end hover:bg-green-500"
              >
                {t("progression.save")}
              </button>
            </form>
          </Box>
        </Fade>
      </Modal>
    </>
  );
};

export default Progressions;