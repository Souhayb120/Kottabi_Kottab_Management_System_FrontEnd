import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChalkboardUser,
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

import api from "../api/Api";
import EnseignantForm from "./EnseignantForm";
import AppModal from "./AppModal";
import EmptyState from "./EmptyState";

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

const EnseignantList = () => {
  const URL = "api/enseignant";
  const SIZE = 10;

  const { t } = useTranslation();

  // Data
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
  const [editEnseignant, setEditEnseignant] = useState(null);

  // Delete
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedEnseignantId, setSelectedEnseignantId] = useState(null);

  // Details
  const [openDetailsModal, setOpenDetailsModal] = useState(false);
  const [selectedEnseignant, setSelectedEnseignant] = useState(null);

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(enseignantSchema),
  });

  // Get enseignants
  const fetchEnseignants = async () => {
    setLoading(true);

    try {
      let url = `${URL}?page=${page}&size=${SIZE}`;

      // Search by speciality
      if (searchTerm !== "") {
        url = `${URL}/specialite/${searchTerm}?page=${page}&size=${SIZE}`;
      }

      const response = await api.get(url);

      const countResponse = await api.get(
        `${URL}/countEnseignants`
      );

      setEnseignants(response.data.content);
      setTotalPages(response.data.totalPages);
      setTotalElements(response.data.totalElements);
      setTotalCount(countResponse.data);
    } catch (error) {
      setEnseignants([]);
      setTotalPages(0);
      setTotalElements(0);

      toast.error(t("enseignants.notFound"));
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchEnseignants();
  }, [page, searchTerm]);

  // Search
  const onSearch = () => {
    setSearchTerm(inputTerm.trim());
    setPage(0);
  };

  // Add
  const openAddEnseignant = () => {
    reset();
    setOpenAddModal(true);
  };

  const onSubmit = async (data) => {
    try {
      await api.post(URL, data);

      toast.success(t("enseignants.createSuccess"));

      setOpenAddModal(false);
      setPage(0);

      fetchEnseignants();
    } catch (error) {
      toast.error(t("enseignants.createError"));
    }
  };

  // Edit
  const openEditEnseignant = (enseignant) => {
    setEditEnseignant(enseignant);
    reset(enseignant);
    setOpenEditModal(true);
  };

  const onEdit = async (data) => {
    try {
      await api.put(`${URL}/${editEnseignant.id}`, data);

      toast.success(t("enseignants.updateSuccess"));

      setOpenEditModal(false);
      fetchEnseignants();
    } catch (error) {
      toast.error(t("enseignants.updateError"));
    }
  };

  // Delete
  const openDeleteEnseignant = (id) => {
    setSelectedEnseignantId(id);
    setOpenDeleteModal(true);
  };

  const deleteEnseignant = async () => {
    try {
      await api.delete(`${URL}/${selectedEnseignantId}`);

      toast.success(t("enseignants.deleteSuccess"));

      setOpenDeleteModal(false);
      fetchEnseignants();
    } catch (error) {
      toast.error(t("enseignants.deleteError"));
    }
  };

  // Details
  const openEnseignantDetails = (enseignant) => {
    setSelectedEnseignant(enseignant);
    setOpenDetailsModal(true);
  };

  // Pagination numbers
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

  const enseignantToDelete = enseignants.find(
    (enseignant) => enseignant.id === selectedEnseignantId
  );

  return (
    <>
      {/* Header */}
      <div className="page-header has-toolbar">
        <div>
          <h1 className="page-title">
            {t("enseignants.title")}
          </h1>
        </div>

        <button
          onClick={openAddEnseignant}
          className="btn"
        >
          {t("enseignants.add")}
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
            placeholder={t("enseignants.searchPlaceholder")}
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
              <th>{t("enseignants.id")}</th>
              <th>{t("enseignants.username")}</th>
              <th>{t("enseignants.nom")}</th>
              <th>{t("enseignants.prenom")}</th>
              <th>{t("enseignants.email")}</th>
              <th>{t("enseignants.tel")}</th>
              <th>{t("enseignants.specialite")}</th>
              <th className="text-end">
                {t("enseignants.actions")}
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
                {enseignants.map((enseignant) => (
                  <tr key={enseignant.id}>
                    <td className="num">
                      {enseignant.id}
                    </td>

                    <td className="cell-strong">
                      {enseignant.username}
                    </td>

                    <td>{enseignant.nom}</td>

                    <td>{enseignant.prenom}</td>

                    <td className="cell-muted">
                      {enseignant.email}
                    </td>

                    <td className="cell-muted">
                      {enseignant.tel}
                    </td>

                    <td>
                      <span className="badge badge-ink">
                        {enseignant.specialite}
                      </span>
                    </td>

                    <td>
                      <div className="flex justify-end gap-1">

                        {/* View */}
                        <button
                          onClick={() =>
                            openEnseignantDetails(enseignant)
                          }
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

                          {t("enseignants.view")}
                        </button>

                        {/* Edit */}
                        <button
                          onClick={() =>
                            openEditEnseignant(enseignant)
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

                          {t("enseignants.edit")}
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() =>
                            openDeleteEnseignant(enseignant.id)
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

                          {t("enseignants.delete")}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </>
            )}
          </tbody>
        </table>

        {/* Empty */}
        {!loading && enseignants.length === 0 && (
          <EmptyState
            icon={
              <FontAwesomeIcon
                icon={faChalkboardUser}
                className="h-5 w-5"
              />
            }
            title={
              searchTerm !== ""
                ? t("enseignants.notFound")
                : t("enseignants.empty")
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
        title={t("enseignants.deleteConfirmTitle")}
        labelledBy="delete-enseignant-title"
      >
        <p className="mb-1 text-[13px] leading-relaxed text-(--text-2)">
          {t("enseignants.deleteConfirmMessage", {
            username: enseignantToDelete?.username || "",
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
            onClick={deleteEnseignant}
            className="btn-danger"
          >
            {t("enseignants.delete")}
          </button>
        </div>
      </AppModal>

      {/* Add Modal */}
      <AppModal
        open={openAddModal}
        onClose={() => setOpenAddModal(false)}
        title={t("enseignants.createTitle")}
        labelledBy="add-enseignant-title"
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <EnseignantForm
            register={register}
            errors={errors}
          />

          <div className="mt-5 flex items-center justify-end">
            <button
              type="submit"
              className="btn"
            >
              {t("enseignants.save")}
            </button>
          </div>
        </form>
      </AppModal>

      {/* Edit Modal */}
      <AppModal
        open={openEditModal}
        onClose={() => setOpenEditModal(false)}
        title={t("enseignants.editTitle")}
        labelledBy="edit-enseignant-title"
      >
        <form onSubmit={handleSubmit(onEdit)}>
          <EnseignantForm
            register={register}
            errors={errors}
          />

          <div className="mt-5 flex items-center justify-end">
            <button
              type="submit"
              className="btn"
            >
              {t("enseignants.save")}
            </button>
          </div>
        </form>
      </AppModal>

      {/* Details Modal */}
      <AppModal
        open={openDetailsModal}
        onClose={() => setOpenDetailsModal(false)}
        title={`${t("enseignants.seeTitle")} — ${
          selectedEnseignant?.username || ""
        }`}
        labelledBy="details-enseignant-title"
      >
        {selectedEnseignant && (
          <dl className="m-0">
            <div className="dl">
              <dt>{t("enseignants.id")}</dt>
              <dd className="num">
                {selectedEnseignant.id}
              </dd>
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
    </>
  );
};

export default EnseignantList;