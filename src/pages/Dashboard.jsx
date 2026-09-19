import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { jwtDecode } from "jwt-decode";
import api from "../api/Api";
import Sidebar from "../components/SideBar";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

const statOrder = [
  "eleves",
  "enseignants",
  "presences",
  "progressions",
  "concours",
  "participations",
];

const Dashboard = () => {
  const { t, i18n } = useTranslation();
  const [stats, setStats] = useState({
    eleves: 0,
    enseignants: 0,
    concours: 0,
    presences: 0,
    progressions: 0,
    participations: 0,
  });
  const [recentProgressions, setRecentProgressions] = useState([]);

  let username = "";
  try {
    username = jwtDecode(localStorage.getItem("token")).sub || "";
  } catch (error) {
    username = "";
  }

  useEffect(() => {
    const fetchStat = async (url, key) => {
      try {
        const response = await api.get(url);
        setStats((prev) => ({ ...prev, [key]: response.data }));
      } catch (error) {
        setStats((prev) => ({ ...prev, [key]: 0 }));
      }
    };

    const fetchCount = async (url, key) => {
      try {
        const response = await api.get(url);
        setStats((prev) => ({ ...prev, [key]: response.data.totalElements }));
      } catch (error) {
        setStats((prev) => ({ ...prev, [key]: 0 }));
      }
    };

    const fetchRecentProgressions = async () => {
      try {
        const response = await api.get("api/progressions?size=5");
        setRecentProgressions(response.data.content);
      } catch (error) {
        setRecentProgressions([]);
      }
    };

    fetchStat("api/eleve/countEleves", "eleves");
    fetchStat("api/enseignant/countEnseignants", "enseignants");
    fetchStat("api/concour/countConcours", "concours");
    fetchCount("api/presence?size=1", "presences");
    fetchCount("api/progressions?size=1", "progressions");
    fetchCount("api/participation?size=1", "participations");
    fetchRecentProgressions();
  }, []);

  const dateLabel = new Date().toLocaleDateString(
    i18n.language === "ar" ? "ar-EG" : "fr-FR",
    {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    },
  );

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main">
        <NavBar />
        <div className="content">
          <div className="page-header">
            <div>
              <h1 className="page-title">{t("dashboard.title")}</h1>
              <p className="page-sub">
                {t("dashboard.welcome")}, {username} —{" "}
                <span className="capitalize">{dateLabel}</span>
              </p>
            </div>
          </div>

          <div className="stat-ledger">
            {statOrder.map((key) => (
              <div key={key} className="stat-item">
                <div className="stat-value">{stats[key]}</div>
                <div className="stat-label">{t(`dashboard.${key}`)}</div>
              </div>
            ))}
          </div>

          <section className="panel mt-5">
            <header className="panel-head">
              <h2 className="panel-title">
                {t("dashboard.recentProgressions")}
              </h2>
              <Link to="/progress" className="btn-xs btn-xs-green">
                {t("dashboard.viewAll")}
              </Link>
            </header>
            <div className="panel-body">
              <div className="table-shell">
                <table className="tbl">
                  <thead>
                    <tr>
                      <th>{t("progression.eleve")}</th>
                      <th>{t("progression.sourate")}</th>
                      <th>{t("progression.versets")}</th>
                      <th>{t("progression.enseignant")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentProgressions.map((progression) => (
                      <tr key={progression.id}>
                        <td className="cell-strong">
                          {progression.eleve?.prenom} {progression.eleve?.nom}
                        </td>
                        <td>
                          <span className="badge badge-ink">
                            {progression.sourat}
                          </span>
                        </td>
                        <td className="cell-muted">
                          {progression.versetDebut} – {progression.versetFin}
                        </td>
                        <td className="cell-muted">
                          {progression.enseignant?.prenom}{" "}
                          {progression.enseignant?.nom}
                        </td>
                      </tr>
                    ))}
                    {recentProgressions.length === 0 && (
                      <tr>
                        <td
                          colSpan={4}
                          className="py-6 text-center text-(--text-muted)"
                        >
                          {t("dashboard.noProgressions")}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Dashboard;