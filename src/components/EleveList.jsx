import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
  faChildren,
} from "@fortawesome/free-solid-svg-icons";

import api from "../api/Api";
import EleveForm from "./EleveForm";
import AppModal from "./AppModal";
import EmptyState from "./EmptyState";

const eleveSchema = yup.object({
  username: yup.string().required("Le nom d'utilisateur est obligatoire"),
  nom: yup.string().required("Le nom est obligatoire"),
  prenom: yup.string().required("Le prénom est obligatoire"),
  email: yup
    .string()
    .required("L'email est obligatoire")
    .email("Email invalide"),
  tel: yup.string().required("Le téléphone est obligatoire"),
  dateNaissance: yup
    .string()
    .required("La date de naissance est obligatoire"),
});

const EleveList = () => {
  const URL = "api/eleve";
  const SIZE = 10;

  const { t } = useTranslation();
  const navigate = useNavigate();

  const [eleves, setEleves] = useState([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  const [inputTerm, setInputTerm] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedEleveId, setSelectedEleveId] = useState(null);

  const [openAddModal, setOpenAddModal] = useState(false);

  const [openEditModal, setOpenEditModal] = useState(false);
  const [editEleve, setEditEleve] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(eleveSchema),
  });

  // Get students
  const fetchEleves = async () => {
    setLoading(true);

    try {
      // Search student by username
      if (searchTerm !== "") {
        const response = await api.get(
          `${URL}/username/${searchTerm}`
        );

        setEleves([response.data]);
        setTotalPages(0);
        setTotalElements(1);
      } else {
        // Get all students
        const response = await api.get(
          `${URL}/consulterEleves?page=${page}&size=${SIZE}`
        );

        const countResponse = await api.get(
          `${URL}/countEleves`
        );

        setEleves(response.data.content);
        setTotalPages(response.data.totalPages);
        setTotalElements(response.data.totalElements);
        setTotalCount(countResponse.data);
      }
    } catch (error) {
      setEleves([]);
      setTotalPages(0);
      setTotalElements(0);

      toast.error(t("eleves.notFound"));
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchEleves();
  }, [page, searchTerm]);

  // Search
  const onSearch = () => {
    setSearchTerm(inputTerm.trim());
    setPage(0);
  };

  // Add student
  const openAddEleve = () => {
    reset();
    setOpenAddModal(true);
  };

  const onSubmit = async (data) => {
    try {
      await api.post(URL, data);

      toast.success(t("eleves.createSuccess"));

      setOpenAddModal(false);
      setPage(0);

      fetchEleves();
    } catch (error) {
      toast.error(t("eleves.createError"));
    }
  };

  // Edit student
  const openEditEleve = (eleve) => {
    setEditEleve(eleve);
    reset(eleve);
    setOpenEditModal(true);
  };

  const onEdit = async (data) => {
    try {
      await api.put(`${URL}/${editEleve.id}`, data);

      toast.success(t("eleves.updateSuccess"));

      setOpenEditModal(false);
      fetchEleves();
    } catch (error) {
      toast.error(t("eleves.updateError"));
    }
  };

  // Delete student
  const openDeleteEleve = (id) => {
    setSelectedEleveId(id);
    setOpenDeleteModal(true);
  };

  const deleteEleve = async () => {
    try {
      await api.delete(`${URL}/${selectedEleveId}`);

      toast.success(t("eleves.deleteSuccess"));

      setOpenDeleteModal(false);
      fetchEleves();
    } catch (error) {
      toast.error(t("eleves.deleteError"));
    }
  };

  // View student details
  const viewEleve = (eleve) => {
    navigate(`/eleve/details/${eleve.username}`);
  };

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

  const selectedEleve = eleves.find(
    (eleve) => eleve.id === selectedEleveId
  );

  return (
    <>
      {/* Header */}
      <div className="page-header has-toolbar">
        <div>
          <h1 className="page-title">
            {t("eleves.title")}
          </h1>
        </div>

        <button
          onClick={openAddEleve}
          className="btn"
        >
          {t("eleves.add")}
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
            placeholder={t("eleves.searchPlaceholder")}
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

      {/* Students table */}
      <div className="table-shell">
        <table className="tbl">
          <thead>
            <tr>
              <th>{t("eleves.id")}</th>
              <th>{t("eleves.username")}</th>
              <th>{t("eleves.nom")}</th>
              <th>{t("eleves.prenom")}</th>
              <th>{t("eleves.email")}</th>
              <th>{t("eleves.tel")}</th>
              <th>{t("eleves.dateNaissance")}</th>
              <th className="text-end">
                {t("eleves.actions")}
              </th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <>
                {[1, 2, 3, 4, 5].map((item) => (
                  <tr key={item}>
                    <td colSpan={8}>
                      <div className="skeleton h-4 w-full" />
                    </td>
                  </tr>
                ))}
              </>
            ) : (
              <>
                {eleves.map((eleve) => (
                  <tr key={eleve.id}>
                    <td className="num">
                      {eleve.id}
                    </td>

                    <td className="cell-strong">
                      {eleve.username}
                    </td>

                    <td>{eleve.nom}</td>

                    <td>{eleve.prenom}</td>

                    <td className="cell-muted">
                      {eleve.email}
                    </td>

                    <td className="cell-muted">
                      {eleve.tel}
                    </td>

                    <td className="cell-muted">
                      {eleve.dateNaissance}
                    </td>

                    <td>
                      <div className="flex justify-end gap-1">
                        <button
                          onClick={() => viewEleve(eleve)}
                          className="btn-xs btn-xs-green"
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
                              d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                            />

                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                            />
                          </svg>

                          {t("eleves.view")}
                        </button>

                        <button
                          onClick={() => openEditEleve(eleve)}
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

                          {t("eleves.edit")}
                        </button>

                        <button
                          onClick={() =>
                            openDeleteEleve(eleve.id)
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

                          {t("eleves.delete")}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </>
            )}
          </tbody>
        </table>

        {/* Empty state */}
        {!loading && eleves.length === 0 && (
          <EmptyState
            icon={
              <FontAwesomeIcon
                icon={faChildren}
                className="h-5 w-5"
              />
            }
            title={
              searchTerm !== ""
                ? t("eleves.notFound")
                : t("eleves.empty")
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
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 0}
                className="flex h-8 w-8 items-center justify-center rounded-md text-[12px] text-(--text-muted) transition-colors hover:bg-(--border) disabled:cursor-not-allowed disabled:opacity-40"
                aria-label={t("eleves.previous")}
              >
                <FontAwesomeIcon
                  icon={faChevronLeft}
                  className="h-3 w-3 rtl:rotate-180"
                />
              </button>

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

              <button
                onClick={() => setPage(page + 1)}
                disabled={page >= totalPages - 1}
                className="flex h-8 w-8 items-center justify-center rounded-md text-[12px] text-(--text-muted) transition-colors hover:bg-(--border) disabled:cursor-not-allowed disabled:opacity-40"
                aria-label={t("eleves.next")}
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

      {/* Delete modal */}
      <AppModal
        open={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        title={t("eleves.deleteConfirmTitle")}
        labelledBy="delete-eleve-title"
      >
        <p className="mb-1 text-[13px] leading-relaxed text-(--text-2)">
          {t("eleves.deleteConfirmMessage", {
            username: selectedEleve?.username || "",
          })}
        </p>

        <p className="text-[12px] text-(--text-muted)">
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
            onClick={deleteEleve}
            className="btn-danger"
          >
            {t("eleves.delete")}
          </button>
        </div>
      </AppModal>

      {/* Add modal */}
      <AppModal
        open={openAddModal}
        onClose={() => setOpenAddModal(false)}
        title={t("eleves.createTitle")}
        labelledBy="add-eleve-title"
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <EleveForm
            register={register}
            errors={errors}
          />

          <div className="mt-5 flex items-center justify-end">
            <button
              type="submit"
              className="btn"
            >
              {t("eleves.save")}
            </button>
          </div>
        </form>
      </AppModal>

      {/* Edit modal */}
      <AppModal
        open={openEditModal}
        onClose={() => setOpenEditModal(false)}
        title={t("eleves.editTitle")}
        labelledBy="edit-eleve-title"
      >
        <form onSubmit={handleSubmit(onEdit)}>
          <EleveForm
            register={register}
            errors={errors}
          />

          <div className="mt-5 flex items-center justify-end">
            <button
              type="submit"
              className="btn"
            >
              {t("eleves.save")}
            </button>
          </div>
        </form>
      </AppModal>
    </>
  );
};

export default EleveList;