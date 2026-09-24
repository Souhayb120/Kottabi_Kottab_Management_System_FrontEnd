import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import api from "../api/Api";
import AuthService from "../services/AuthService";
import Sidebar from "../components/SideBar";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import EleveDashboard from "../components/EleveDashboard";
import EnseignantDashboard from "../components/EnseignantDashboard";

const statOrder = [
  "eleves",
  "enseignants",
  "presences",
  "progressions",
  "concours",
  "participations",
];

const presenceKeys = [
  "PRESENT",
  "RETARD",
  "ABSENT",
  "EXCUSE",
];

const statutBadges = {
  PRESENT: "badge badge-ok",
  RETARD: "badge badge-warn",
  ABSENT: "badge badge-danger",
  EXCUSE: "badge badge-muted",
};

const statutKeys = {
  PRESENT: "present",
  RETARD: "retard",
  ABSENT: "absent",
  EXCUSE: "excuse",
};

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
  const [presenceCounts, setPresenceCounts] = useState({
    PRESENT: 0,
    RETARD: 0,
    ABSENT: 0,
    EXCUSE: 0,
  });
  const [recentProgressions, setRecentProgressions] = useState([]);
  const [todayPresence, setTodayPresence] = useState([]);
  const [loading, setLoading] = useState(true);

  const username = AuthService.getUsername();
  const role = AuthService.getRole();
  const isEleve = role === "ELEVE";
  const isEnseignant = role === "ENSEIGNANT";

  const getCount = async (url) => {
    try {
      const response = await api.get(url);
      return response.data;
    } catch {
      return 0;
    }
  };

  const getList = async (url) => {
    try {
      const response = await api.get(url);
      return response.data.content;
    } catch {
      return [];
    }
  };

  const getTotalElements = async (url) => {
    try {
      const response = await api.get(url);
      return response.data.totalElements;
    } catch {
      return 0;
    }
  };

 

 

  useEffect(() => {
     if (role !== "ADMIN") return;
    const loadDashboard = async () => {
      try {
        const [
          eleves,
          enseignants,
          concours,
          progressions,
          present,
          retard,
          absent,
          excuse,
          participations,
          recentProgressions,
          todayPresence,
        ] = await Promise.all([
          getCount("api/eleve/countEleves"),
          getCount("api/enseignant/countEnseignants"),
          getCount("api/concour/countConcours"),
          getCount("api/progressions/count"),
          getCount("api/presence/countPresence/PRESENT"),
          getCount("api/presence/countPresence/RETARD"),
          getCount("api/presence/countPresence/ABSENT"),
          getCount("api/presence/countPresence/EXCUSE"),
          getTotalElements("api/participation?size=1"),
          getList("api/progressions/recentProgressions?size=5"),
          getList("api/presence/Recent6Presence?size=6"),
        ]);

        setStats({
          eleves,
          enseignants,
          concours,
          progressions,
          participations,
          presences: present + retard + absent + excuse,
        });
        setPresenceCounts({ PRESENT: present, RETARD: retard, ABSENT: absent, EXCUSE: excuse });

        setRecentProgressions(recentProgressions);
        setTodayPresence(todayPresence);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [role]);

  const dateLabel = new Date().toLocaleDateString(
    i18n.language === "ar" ? "ar-EG" : "fr-FR",
    {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    },
  );

  if (isEleve) {
    return (
      <div className="app-layout">
        <Sidebar />
        <div className="main">
          <NavBar />
          <EleveDashboard username={username} />
          <Footer />
        </div>
      </div>
    );
  }

  if (isEnseignant) {
    return (
      <div className="app-layout">
        <Sidebar />
        <div className="main">
          <NavBar />
          <EnseignantDashboard username={username} />
          <Footer />
        </div>
      </div>
    );
  }

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
                <div className="stat-value">{loading ? "–" : stats[key]}</div>
                <div className="stat-label">{t(`dashboard.${key}`)}</div>
              </div>
            ))}
          </div>

          <h2 className="panel-title mt-6 mb-2.5">
            {t("dashboard.presenceOverview")}
          </h2>
          <div className="stat-ledger">
            {presenceKeys.map((key) => (
              <div key={key} className="stat-item">
                <div className="stat-value">
                  {loading ? "–" : presenceCounts[key]}
                </div>
                <div className="stat-label">
                  <span className={statutBadges[key]}>
                    <span className="dot" />
                    {t(`eleveDetails.${statutKeys[key]}`)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 grid gap-5 xl:grid-cols-2">
            <section className="panel">
              <header className="panel-head">
                <h2 className="panel-title">{t("dashboard.todayPresence")}</h2>
              </header>
              <div className="panel-body">
                <div className="table-shell table-shell--bare">
                  <table className="tbl">
                    <thead>
                      <tr>
                        <th>{t("presence.eleve")}</th>
                        <th>{t("presence.statut")}</th>
                        <th>{t("presence.date")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading
                        ? Array.from({ length: 3 }).map((_, i) => (
                            <tr key={i}>
                              <td colSpan={3}>
                                <div className="skeleton h-4 w-full" />
                              </td>
                            </tr>
                          ))
                        : todayPresence.map((presence) => (
                            <tr key={presence.id}>
                              <td className="cell-strong">
                                {presence.eleve?.prenom} {presence.eleve?.nom}
                              </td>
                              <td>
                                <span className={statutBadges[presence.statut] || "badge badge-muted"}>
                                  <span className="dot" />
                                  {t(`eleveDetails.${statutKeys[presence.statut] || "present"}`)}
                                </span>
                              </td>
                              <td className="cell-muted">{presence.date}</td>
                            </tr>
                          ))}
                      {!loading && todayPresence.length === 0 && (
                        <tr>
                          <td colSpan={3} className="py-6 text-center text-(--text-muted)">
                            {t("dashboard.noTodayPresence")}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            <section className="panel">
              <header className="panel-head">
                <h2 className="panel-title">{t("dashboard.recentProgressions")}</h2>
                <Link to="/progress" className="btn-xs btn-xs-green">
                  {t("dashboard.viewAll")}
                </Link>
              </header>
              <div className="panel-body">
                <div className="table-shell table-shell--bare">
                  <table className="tbl">
                    <thead>
                      <tr>
                        <th>{t("progression.eleve")}</th>
                        <th>{t("progression.sourate")}</th>
                        <th>{t("progression.enseignant")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading
                        ? Array.from({ length: 3 }).map((_, i) => (
                            <tr key={i}>
                              <td colSpan={3}>
                                <div className="skeleton h-4 w-full" />
                              </td>
                            </tr>
                          ))
                        : recentProgressions.map((progression) => (
                            <tr key={progression.id}>
                              <td className="cell-strong">
                                {progression.eleve?.prenom} {progression.eleve?.nom}
                              </td>
                              <td>
                                <span className="badge badge-ink">
                                  {progression.sourat}{" "}
                                  <span className="text-(--text-muted)">
                                    ({progression.versetDebut}–{progression.versetFin})
                                  </span>
                                </span>
                              </td>
                              <td className="cell-muted">
                                {progression.enseignant?.prenom}{" "}
                                {progression.enseignant?.nom}
                              </td>
                            </tr>
                          ))}
                      {!loading && recentProgressions.length === 0 && (
                        <tr>
                          <td colSpan={3} className="py-6 text-center text-(--text-muted)">
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
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Dashboard;