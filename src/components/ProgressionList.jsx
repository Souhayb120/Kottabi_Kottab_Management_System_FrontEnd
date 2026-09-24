import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBookQuran,
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

import api from "../api/Api";
import AuthService from "../services/AuthService";
import ProgressionForm from "./ProgressionForm";
import AppModal from "./AppModal";
import EmptyState from "./EmptyState";

const progressionSchema = yup.object({
  sourat: yup
    .string()
    .required("La sourate est obligatoire"),

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
  const SIZE = 10;

  const { t } = useTranslation();

  const isEnseignant =
    AuthService.getRole() === "ENSEIGNANT";

  // Data
  const [progressions, setProgressions] = useState([]);
  const [eleves, setEleves] = useState([]);
  const [enseignants, setEnseignants] = useState([]);

  const [loading, setLoading] = useState(true);

  // Pagination
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  // Search
  const [inputTerm, setInputTerm] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Add
  const [openAddModal, setOpenAddModal] = useState(false);

  // Edit
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editProgression, setEditProgression] = useState(null);

  // Delete
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedProgressionId, setSelectedProgressionId] =
    useState(null);

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(progressionSchema),
  });

  // Get progressions
  const fetchProgressions = async () => {
    setLoading(true);

    try {
      let url = `${URL}?page=${page}&size=${SIZE}`;

      // Search progression by student
      if (searchTerm !== "") {
        url = `${URL}/eleve/${searchTerm}?page=${page}&size=${SIZE}`;
      }

      const response = await api.get(url);

      const countResponse = await api.get(
        `${URL}/count`
      );

      setProgressions(response.data.content);
      setTotalPages(response.data.totalPages);
      setTotalElements(response.data.totalElements);
      setTotalCount(countResponse.data);
    } catch (error) {
      setProgressions([]);
      setTotalPages(0);
      setTotalElements(0);
    }

    setLoading(false);
  };

  // Get students and teachers for the form
  const fetchFormData = async () => {
    try {
      const elevesResponse = await api.get(
        "api/eleve/consulterEleves?size=1000"
      );

      setEleves(elevesResponse.data.content);
    } catch (error) {
      toast.error(t("progression.loadElevesError"));
    }

    try {
      const enseignantsResponse = await api.get(
        "api/enseignant?size=1000"
      );

      setEnseignants(enseignantsResponse.data.content);
    } catch (error) {
      toast.error(t("progression.loadElevesError"));
    }
  };

  useEffect(() => {
    fetchProgressions();
  }, [page, searchTerm]);

  useEffect(() => {
    fetchFormData();
  }, []);

  // Search
  const onSearch = () => {
    setSearchTerm(inputTerm.trim());
    setPage(0);
  };

  // Add
  const openAddProgression = () => {
    reset();
    setOpenAddModal(true);
  };

  const onSubmit = async (data) => {
    const progression = {
      sourat: data.sourat,
      versetDebut: Number(data.versetDebut),
      versetFin: Number(data.versetFin),
      eleveId: Number(data.eleveId),
      enseignantId: Number(data.enseignantId),
    };

    try {
      await api.post(URL, progression);

      toast.success(t("progression.createSuccess"));

      setOpenAddModal(false);
      setPage(0);

      fetchProgressions();
    } catch (error) {
      toast.error(t("progression.createError"));
    }
  };

  // Edit
  const openEditProgression = (progression) => {
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
    const progression = {
      sourat: data.sourat,
      versetDebut: Number(data.versetDebut),
      versetFin: Number(data.versetFin),
      eleveId: Number(data.eleveId),
      enseignantId: Number(data.enseignantId),
    };

    try {
      await api.put(
        `${URL}/${editProgression.id}`,
        progression
      );

      toast.success(t("progression.updateSuccess"));

      setOpenEditModal(false);

      fetchProgressions();
    } catch (error) {
      toast.error(t("progression.updateError"));
    }
  };

  // Delete
  const openDeleteProgression = (id) => {
    setSelectedProgressionId(id);
    setOpenDeleteModal(true);
  };

  const deleteProgression = async () => {
    try {
      await api.delete(
        `${URL}/${selectedProgressionId}`
      );

      toast.success(t("progression.deleteSuccess"));

      setOpenDeleteModal(false);

      fetchProgressions();
    } catch (error) {
      toast.error(t("progression.deleteError"));
    }
  };

  // Pagination
  const pageNumbers = [];

  for (let i = 0; i < totalPages; i++) {
    pageNumbers.push(i);
  }

  let from = 0;
  let to = 0;

  if (totalElements > 0) {
    from = page * SIZE + 1;
    to = Math.min((page + 1) * SIZE, totalElements);
  }

  return (
    <>
      {/* Header */}
      <div className="page-header has-toolbar">
        <div>
          <h1 className="page-title">
            {t("progression.title")}
          </h1>
        </div>

        <button
          onClick={openAddProgression}
          className="btn"
        >
          {t("progression.add")}
        </button>
      </div>

      {/* Search */}
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
            value={inputTerm}
            onChange={(e) => {
              setInputTerm(e.target.value);

              if (e.target.value.trim() === "") {
                setSearchTerm("");
              }
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                onSearch();
              }
            }}
            className="input-trad"
          />
        </div>

        <span className="text-[11px] uppercase tracking-[0.08em] text-(--text-muted)">
          {totalCount}
        </span>
      </div>

      {/* Table */}
      <div className="table-shell">
        <table className="tbl">
          <thead>
            <tr>
              <th>{t("progression.id")}</th>
              <th>{t("progression.eleve")}</th>
              <th>{t("progression.sourate")}</th>
              <th>{t("progression.versets")}</th>
              <th>{t("progression.enseignant")}</th>

              <th className="text-end">
                {t("progression.actions")}
              </th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <>
                {[1, 2, 3, 4, 5].map((item) => (
                  <tr key={item}>
                    <td colSpan={6}>
                      <div className="skeleton h-4 w-full" />
                    </td>
                  </tr>
                ))}
              </>
            ) : (
              <>
                {progressions.map((progression) => (
                  <tr key={progression.id}>
                    <td className="num">
                      {progression.id}
                    </td>

                    <td>
                      <span className="cell-strong">
                        {progression.eleve?.prenom}{" "}
                        {progression.eleve?.nom}
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
                      {progression.versetDebut} –{" "}
                      {progression.versetFin}
                    </td>

                    <td className="cell-muted">
                      {progression.enseignant?.prenom}{" "}
                      {progression.enseignant?.nom}
                    </td>

                    <td>
                      <div className="flex justify-end gap-1">

                        {/* Edit */}
                        <button
                          onClick={() =>
                            openEditProgression(progression)
                          }
                          className="btn-xs btn-xs-gold"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.8}
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                            />
                          </svg>

                          {t("progression.edit")}
                        </button>

                        {/* Delete */}
                        {!isEnseignant && (
                          <button
                            onClick={() =>
                              openDeleteProgression(
                                progression.id
                              )
                            }
                            className="btn-xs btn-xs-danger"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.8}
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                              />
                            </svg>

                            {t("progression.delete")}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </>
            )}
          </tbody>
        </table>

        {/* Empty */}
        {!loading && progressions.length === 0 && (
          <EmptyState
            icon={
              <FontAwesomeIcon
                icon={faBookQuran}
                className="h-5 w-5"
              />
            }
            title={
              searchTerm !== ""
                ? t("progression.notFound")
                : t("progression.noProgressions")
            }
          />
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-(--border) px-4 py-3">
            <span className="text-[12px] text-(--text-muted)">
              {from}–{to} / {totalElements}
            </span>

            <div className="flex items-center gap-1.5">
              {/* Previous */}
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 0}
                className="flex h-8 w-8 items-center justify-center rounded-md text-[12px] text-(--text-muted) transition-colors hover:bg-(--border) disabled:cursor-not-allowed disabled:opacity-40"
              >
                <FontAwesomeIcon
                  icon={faChevronLeft}
                  className="h-3 w-3 rtl:rotate-180"
                />
              </button>

              {/* Page numbers */}
              {pageNumbers.map((pageNumber) => (
                <button
                  key={pageNumber}
                  onClick={() => setPage(pageNumber)}
                  className={`flex h-8 w-8 items-center justify-center rounded-md text-[12px] font-medium transition-colors ${
                    pageNumber === page
                      ? "bg-(--brand) text-white"
                      : "text-(--text-muted) hover:bg-(--border)"
                  }`}
                >
                  {pageNumber + 1}
                </button>
              ))}

              {/* Next */}
              <button
                onClick={() => setPage(page + 1)}
                disabled={page >= totalPages - 1}
                className="flex h-8 w-8 items-center justify-center rounded-md text-[12px] text-(--text-muted) transition-colors hover:bg-(--border) disabled:cursor-not-allowed disabled:opacity-40"
              >
                <FontAwesomeIcon
                  icon={faChevronRight}
                  className="h-3 w-3 rtl:rotate-180"
                />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Modal */}
      <AppModal
        open={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        title={t("progression.deleteConfirmTitle")}
        labelledBy="delete-progression-title"
      >
        <p className="text-[13px] leading-relaxed text-(--text-2)">
          {t("progression.deleteConfirmMessage")}
        </p>

        <p className="mt-1 text-[12px] text-(--text-muted)">
          {t("common.deleteHint")}
        </p>

        <div className="mt-6 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => setOpenDeleteModal(false)}
            className="btn-secondary"
          >
            {t("common.cancel")}
          </button>

          <button
            type="button"
            onClick={deleteProgression}
            className="btn-danger"
          >
            {t("progression.delete")}
          </button>
        </div>
      </AppModal>

      {/* Add Modal */}
      <AppModal
        open={openAddModal}
        onClose={() => setOpenAddModal(false)}
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
            <button
              type="submit"
              className="btn"
            >
              {t("progression.save")}
            </button>
          </div>
        </form>
      </AppModal>

      {/* Edit Modal */}
      <AppModal
        open={openEditModal}
        onClose={() => setOpenEditModal(false)}
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
            <button
              type="submit"
              className="btn"
            >
              {t("progression.save")}
            </button>
          </div>
        </form>
      </AppModal>
    </>
  );
};

export default ProgressionList;