import { Fragment, useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarCheck,
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import api from "../api/Api";
import AppModal from "./AppModal";
import EmptyState from "./EmptyState";

const statutKeys = {
  PRESENT: "present",
  RETARD: "retard",
  ABSENT: "absent",
  EXCUSE: "excuse",
};

const statutBadges = {
  PRESENT: "badge badge-ok",
  RETARD: "badge badge-warn",
  ABSENT: "badge badge-danger",
  EXCUSE: "badge badge-muted",
};

const presenceSchema = yup.object({
  eleveId: yup
    .number()
    .typeError("L'élève est obligatoire")
    .min(1, "L'élève est obligatoire"),
  date: yup.string().required("La date est obligatoire"),
  statut: yup.string().required("Le statut est obligatoire"),
});

const PresenceList = () => {
  const URL = "api/presence";
  const ELEVE_URL = "api/eleve";
  const SIZE = 10;
  const { t } = useTranslation();

  const [presences, setPresences] = useState([]);
  const [eleves, setEleves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchUsername, setSearchUsername] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [statutFilter, setStatutFilter] = useState("ALL");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [reloadKey, setReloadKey] = useState(0);
  const [counts, setCounts] = useState({
    PRESENT: 0,
    RETARD: 0,
    ABSENT: 0,
    EXCUSE: 0,
  });
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

  const fetchCounts = useCallback(async () => {
    try {
      const [p, r, a, e] = await Promise.all([
        api.get(`${URL}/countPresence/PRESENT`),
        api.get(`${URL}/countPresence/RETARD`),
        api.get(`${URL}/countPresence/ABSENT`),
        api.get(`${URL}/countPresence/EXCUSE`),
      ]);
      setCounts({ PRESENT: p.data, RETARD: r.data, ABSENT: a.data, EXCUSE: e.data });
    } catch (error) {
      // keep previous counts
    }
  }, [URL]);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      try {
        let url = `${URL}?page=${page}&size=${SIZE}`;
        if (appliedSearch !== "") {
          url = `${URL}/eleve/${encodeURIComponent(appliedSearch)}?page=${page}&size=${SIZE}`;
        } else if (statutFilter !== "ALL") {
          url = `${URL}/filterPresence?statut=${statutFilter}&page=${page}&size=${SIZE}`;
        }
        const response = await api.get(url);
        if (!cancelled) {
          setPresences(response.data.content);
          setTotalPages(response.data.totalPages);
          setTotalElements(response.data.totalElements);
        }
      } catch (error) {
        if (!cancelled) {
          setPresences([]);
          setTotalPages(0);
          setTotalElements(0);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [URL, page, statutFilter, appliedSearch, reloadKey]);

  useEffect(() => {
    fetchCounts();
  }, [fetchCounts, reloadKey]);

  const onSearch = () => {
    const term = searchUsername.trim();
    if (term === "") {
      setAppliedSearch("");
    } else {
      setStatutFilter("ALL");
      setAppliedSearch(term);
    }
    setPage(0);
  };

  const onStatutChange = (e) => {
    setAppliedSearch("");
    setStatutFilter(e.target.value);
    setPage(0);
  };

  const getPageNumbers = (current, total) => {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i);
    const pages = new Set([0, total - 1, current - 1, current, current + 1]);
    return [...pages].filter((p) => p >= 0 && p < total).sort((a, b) => a - b);
  };

  //  Deleting Process
  const handleCloseDelete = () => setOpen(false);

  const openDeleteDialog = (id) => {
    setSelectedPresenceId(id);
    setOpen(true);
  };

  const deletePresence = async (id) => {
    try {
      await api.delete(`${URL}/${id}`);
      toast.success(t("presence.deleteSuccess"));
      setOpen(false);
      setReloadKey((k) => k + 1);
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
      await api.post(URL, {
        date: data.date,
        statut: data.statut,
        eleveId: Number(data.eleveId),
      });
      handleClose();
      toast.success(t("presence.createSuccess"));
      setReloadKey((k) => k + 1);
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

  const handleCloseEdit = () => setOpenEditModal(false);

  const onEdit = async (data) => {
    try {
      await api.put(`${URL}/${editPresence.id}?statut=${data.statut}`);
      toast.success(t("presence.updateSuccess"));
      setOpenEditModal(false);
      setReloadKey((k) => k + 1);
    } catch (error) {
      toast.error(t("presence.updateError"));
    }
  };

  const searched = appliedSearch !== "" && presences.length === 0;
  const pageItems = getPageNumbers(page, totalPages);
  const from = totalElements === 0 ? 0 : page * SIZE + 1;
  const to = totalElements === 0 ? 0 : Math.min((page + 1) * SIZE, totalElements);

  return (
    <>
      <div className="page-header has-toolbar">
        <div>
          <h1 className="page-title">{t("presence.title")}</h1>
        </div>
        <button onClick={handleOpen} className="btn">
          {t("presence.add")}
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
            placeholder={t("presence.searchPlaceholder")}
            value={searchUsername}
            onChange={(e) => {
              setSearchUsername(e.target.value);
              if (e.target.value.trim() === "") setAppliedSearch("");
            }}
            onKeyDown={(e) => e.key === "Enter" && onSearch()}
            className="input-trad"
          />
        </div>

        <select
          value={statutFilter}
          onChange={onStatutChange}
          className="input-trad w-36"
        >
          <option value="ALL">{t("presence.filterAll")}</option>
          <option value="PRESENT">{t("eleveDetails.present")}</option>
          <option value="RETARD">{t("eleveDetails.retard")}</option>
          <option value="ABSENT">{t("eleveDetails.absent")}</option>
          <option value="EXCUSE">{t("eleveDetails.excuse")}</option>
        </select>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {["PRESENT", "RETARD", "ABSENT", "EXCUSE"].map((key) => (
          <span key={key} className={statutBadges[key]}>
            <span className="dot" />
            {t(`eleveDetails.${statutKeys[key]}`)} : {counts[key] || 0}
          </span>
        ))}
      </div>

      <div className="table-shell">
        <table className="tbl">
          <thead>
            <tr>
              <th>{t("presence.id")}</th>
              <th>{t("presence.eleve")}</th>
              <th>{t("presence.date")}</th>
              <th>{t("presence.statut")}</th>
              <th className="text-end">{t("presence.actions")}</th>
            </tr>
          </thead>
          <tbody>
            {loading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td colSpan={5}>
                      <div className="skeleton h-4 w-full" />
                    </td>
                  </tr>
                ))
              : presences.map((presence) => (
                  <tr
                    key={presence.id || `${presence.date}-${presence.eleve?.username}`}
                  >
                    <td className="num">{presence.id}</td>
                    <td>
                      <span className="cell-strong">
                        {presence.eleve?.prenom} {presence.eleve?.nom}
                      </span>
                      <span className="ms-2 text-[11px] text-(--text-muted)">
                        ({presence.eleve?.username})
                      </span>
                    </td>
                    <td className="cell-muted">{presence.date}</td>
                    <td>
                      <span className={statutBadges[presence.statut] || "badge badge-muted"}>
                        <span className="dot" />
                        {t(`eleveDetails.${statutKeys[presence.statut] || "present"}`)}
                      </span>
                    </td>
                    <td>
                      <div className="flex justify-end gap-1">
                        <button
                          onClick={() => editThisPresence(presence)}
                          className="btn-xs btn-xs-gold"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                          </svg>
                          {t("presence.edit")}
                        </button>
                        <button
                          onClick={() => openDeleteDialog(presence.id)}
                          className="btn-xs btn-xs-danger"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                          </svg>
                          {t("presence.delete")}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>

        {!loading && presences.length === 0 && (
          <EmptyState
            icon={<FontAwesomeIcon icon={faCalendarCheck} className="h-5 w-5" />}
            title={searched ? t("presence.notFound") : t("presence.noPresence")}
          />
        )}

        {!loading && totalPages > 1 && (
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-(--border) px-4 py-3">
            <span className="text-[12px] text-(--text-muted)">
              {from}–{to} / {totalElements}
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                className="flex h-8 w-8 items-center justify-center rounded-md text-[12px] text-(--text-muted) transition-colors hover:bg-(--border) disabled:cursor-not-allowed disabled:opacity-40"
                aria-label={t("presence.previous")}
              >
                <FontAwesomeIcon icon={faChevronLeft} className="h-3 w-3 rtl:rotate-180" />
              </button>

              {pageItems.map((p, i, arr) => (
                <Fragment key={p}>
                  {i > 0 && p - arr[i - 1] > 1 && (
                    <span className="px-1 text-[12px] text-(--text-muted)">…</span>
                  )}
                  <button
                    onClick={() => setPage(p)}
                    className={`flex h-8 w-8 items-center justify-center rounded-md text-[12px] font-medium transition-colors ${
                      p === page
                        ? "bg-(--brand) text-white"
                        : "text-(--text-muted) hover:bg-(--border)"
                    }`}
                  >
                    {p + 1}
                  </button>
                </Fragment>
              ))}

              <button
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1}
                className="flex h-8 w-8 items-center justify-center rounded-md text-[12px] text-(--text-muted) transition-colors hover:bg-(--border) disabled:cursor-not-allowed disabled:opacity-40"
                aria-label={t("presence.next")}
              >
                <FontAwesomeIcon icon={faChevronRight} className="h-3 w-3 rtl:rotate-180" />
              </button>
            </div>
          </div>
        )}
      </div>

      <AppModal
        open={open}
        onClose={handleCloseDelete}
        title={t("presence.deleteConfirmTitle")}
        labelledBy="delete-presence-title"
      >
        <p className="text-[13px] leading-relaxed text-(--text-2)">
          {t("presence.deleteConfirmMessage")}
        </p>
        <p className="mt-1 text-[12px] text-(--text-muted)">{t("common.deleteHint")}</p>
        <div className="mt-6 flex items-center justify-end gap-2">
          <button type="button" onClick={handleCloseDelete} className="btn-secondary">
            {t("common.cancel")}
          </button>
          <button
            type="button"
            onClick={() => deletePresence(selectedPresenceId)}
            className="btn-danger"
          >
            {t("presence.delete")}
          </button>
        </div>
      </AppModal>

      <AppModal
        open={openModal}
        onClose={handleClose}
        title={t("presence.createTitle")}
        labelledBy="add-presence-title"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="label-trad">{t("presence.selectEleve")}</label>
            <select {...register("eleveId")} className="input-trad">
              <option value="">{t("presence.selectElevePlaceholder")}</option>
              {eleves.map((eleve) => (
                <option key={eleve.id} value={eleve.id}>
                  {eleve.prenom} {eleve.nom} ({eleve.username})
                </option>
              ))}
            </select>
            {errors.eleveId && (
              <p className="field-error">{errors.eleveId.message}</p>
            )}
          </div>

          <div>
            <label className="label-trad">{t("presence.dateLabel")}</label>
            <input type="date" {...register("date")} className="input-trad" />
            {errors.date && <p className="field-error">{errors.date.message}</p>}
          </div>

          <div>
            <label className="label-trad">{t("presence.statut")}</label>
            <select {...register("statut")} className="input-trad">
              <option value="PRESENT">{t("eleveDetails.present")}</option>
              <option value="RETARD">{t("eleveDetails.retard")}</option>
              <option value="ABSENT">{t("eleveDetails.absent")}</option>
              <option value="EXCUSE">{t("eleveDetails.excuse")}</option>
            </select>
            {errors.statut && <p className="field-error">{errors.statut.message}</p>}
          </div>

          <div className="flex items-center justify-end pt-1">
            <button type="submit" className="btn">
              {t("presence.save")}
            </button>
          </div>
        </form>
      </AppModal>

      <AppModal
        open={openEditModal}
        onClose={handleCloseEdit}
        title={t("presence.editTitle")}
        labelledBy="edit-presence-title"
      >
        <form onSubmit={handleSubmit(onEdit)} className="space-y-4">
          {editPresence && (
            <div className="border border-(--border) bg-(--bg) rounded-(--r-sm) px-3.5 py-3 text-[12px]">
              <div className="font-medium text-(--text)">
                {editPresence.eleve?.prenom} {editPresence.eleve?.nom} (
                {editPresence.eleve?.username})
              </div>
              <div className="mt-0.5 text-(--text-muted)">{editPresence.date}</div>
            </div>
          )}

          <div>
            <label className="label-trad">{t("presence.statut")}</label>
            <select {...register("statut")} className="input-trad">
              <option value="PRESENT">{t("eleveDetails.present")}</option>
              <option value="RETARD">{t("eleveDetails.retard")}</option>
              <option value="ABSENT">{t("eleveDetails.absent")}</option>
              <option value="EXCUSE">{t("eleveDetails.excuse")}</option>
            </select>
          </div>

          <div className="flex items-center justify-end pt-1">
            <button type="submit" className="btn">
              {t("presence.save")}
            </button>
          </div>
        </form>
      </AppModal>
    </>
  );
};

export default PresenceList;