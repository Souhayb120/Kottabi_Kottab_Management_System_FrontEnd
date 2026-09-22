import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import api from "../api/Api";
import AuthService from "../services/AuthService";
import Sidebar from "../components/SideBar";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

const EnseignantDetails = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const username = AuthService.getUsername();

  const [enseignant, setEnseignant] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await api.get(
          `api/enseignant/username/${username}`,
        );
        setEnseignant(response.data);
      } catch {
        setEnseignant(null);
      }
      setLoading(false);
    };

    fetchDetails();
  }, [username]);

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main">
        <NavBar />
        <div className="content">
          <div className="page-header has-toolbar">
            <div>
              <h1 className="page-title">{t("enseignantDetails.title")}</h1>
            </div>
            <button
              onClick={() => navigate("/dashboard")}
              className="btn-secondary"
            >
              <FontAwesomeIcon icon={faArrowRight} className="h-3.5 w-3.5 rtl:-scale-x-100" />
              {t("enseignantDetails.back")}
            </button>
          </div>

          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="panel">
                  <div className="panel-head">
                    <div className="skeleton h-4 w-32" />
                  </div>
                  <div className="panel-body">
                    <div className="skeleton h-4 w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : enseignant ? (
            <section className="panel">
              <header className="panel-head">
                <h2 className="panel-title">{t("enseignantDetails.identity")}</h2>
              </header>
              <div className="panel-body">
                <dl className="m-0 max-w-md">
                  <div className="dl">
                    <dt>{t("enseignantDetails.id")}</dt>
                    <dd className="num">{enseignant.id}</dd>
                  </div>
                  <div className="dl">
                    <dt>{t("enseignantDetails.username")}</dt>
                    <dd>{enseignant.username}</dd>
                  </div>
                  <div className="dl">
                    <dt>{t("enseignantDetails.nom")}</dt>
                    <dd>{enseignant.nom}</dd>
                  </div>
                  <div className="dl">
                    <dt>{t("enseignantDetails.prenom")}</dt>
                    <dd>{enseignant.prenom}</dd>
                  </div>
                  <div className="dl">
                    <dt>{t("enseignantDetails.email")}</dt>
                    <dd>{enseignant.email}</dd>
                  </div>
                  <div className="dl">
                    <dt>{t("enseignantDetails.tel")}</dt>
                    <dd>{enseignant.tel}</dd>
                  </div>
                  <div className="dl">
                    <dt>{t("enseignantDetails.specialite")}</dt>
                    <dd>{enseignant.specialite || "—"}</dd>
                  </div>
                  <div className="dl">
                    <dt>{t("enseignantDetails.description")}</dt>
                    <dd>{enseignant.description || "—"}</dd>
                  </div>
                  <div className="dl">
                    <dt>{t("enseignantDetails.role")}</dt>
                    <dd>{t("enseignantDetails.enseignantRole")}</dd>
                  </div>
                </dl>
              </div>
            </section>
          ) : (
            <p className="text-[13px] text-(--text-muted)">
              {t("enseignants.notFound")}
            </p>
          )}
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default EnseignantDetails;