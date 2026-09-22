import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import api from "../api/Api";

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

const EnseignantDashboard = ({ username }) => {
  const { t } = useTranslation();
  const [enseignant, setEnseignant] = useState(null);
  const [progressionsCount, setProgressionsCount] = useState(0);
  const [presenceCounts, setPresenceCounts] = useState({
    PRESENT: 0,
    RETARD: 0,
    ABSENT: 0,
    EXCUSE: 0,
  });
  const [recentProgressions, setRecentProgressions] = useState([]);
  const [todayPresence, setTodayPresence] = useState([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const enseignantResponse = await api.get(
          `api/enseignant/username/${username}`,
        );
        setEnseignant(enseignantResponse.data);
      } catch {
        setEnseignant(null);
      }

      const [progressionsCount, present, retard, absent, excuse] =
        await Promise.all([
          getCount("api/progressions/count"),
          getCount("api/presence/countPresence/PRESENT"),
          getCount("api/presence/countPresence/RETARD"),
          getCount("api/presence/countPresence/ABSENT"),
          getCount("api/presence/countPresence/EXCUSE"),
        ]);

      setProgressionsCount(progressionsCount);
      setPresenceCounts({ PRESENT: present, RETARD: retard, ABSENT: absent, EXCUSE: excuse });

      const [recentProgressions, todayPresence] = await Promise.all([
        getList("api/progressions/recentProgressions?size=5"),
        getList("api/presence/Recent6Presence?size=6"),
      ]);

      setRecentProgressions(recentProgressions);
      setTodayPresence(todayPresence);
      setLoading(false);
    };

    loadDashboard();
  }, [username]);

  return (
    <div className="content">
      <div className="page-header has-toolbar">
        <div>
          <h1 className="page-title">{t("enseignantDashboard.title")}</h1>
          <p className="page-sub">
            {enseignant?.prenom} {enseignant?.nom} ({username})
          </p>
        </div>
        <Link
          to={`/enseignant/details/${username}`}
          className="btn"
        >
          <FontAwesomeIcon icon={faArrowRight} className="h-3.5 w-3.5 rtl:-scale-x-100" />
          {t("enseignantDashboard.viewProfile")}
        </Link>
      </div>

      <div className="stat-ledger">
        <div className="stat-item">
          <div className="stat-value">{loading ? "–" : progressionsCount}</div>
          <div className="stat-label">{t("enseignantDashboard.statProgressions")}</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">{loading ? "–" : presenceCounts.PRESENT}</div>
          <div className="stat-label">{t("enseignantDashboard.statPresent")}</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">{loading ? "–" : presenceCounts.ABSENT}</div>
          <div className="stat-label">{t("enseignantDashboard.statAbsent")}</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">{loading ? "–" : todayPresence.length}</div>
          <div className="stat-label">{t("enseignantDashboard.statToday")}</div>
        </div>
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-2">
        <section className="panel">
          <header className="panel-head">
            <h2 className="panel-title">{t("enseignantDashboard.todayPresence")}</h2>
          </header>
          <div className="panel-body">
            {todayPresence.length > 0 ? (
              <div className="table-shell">
                <table className="tbl">
                  <thead>
                    <tr>
                      <th>{t("presence.eleve")}</th>
                      <th>{t("presence.statut")}</th>
                      <th>{t("presence.date")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {todayPresence.map((presence) => (
                      <tr key={presence.id}>
                        <td className="cell-strong">
                          {presence.eleve?.prenom} {presence.eleve?.nom}
                        </td>
                        <td>
                          <span
                            className={
                              statutBadges[presence.statut] || "badge badge-muted"
                            }
                          >
                            <span className="dot" />
                            {t(
                              `eleveDetails.${
                                statutKeys[presence.statut] || "present"
                              }`,
                            )}
                          </span>
                        </td>
                        <td className="cell-muted">{presence.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="m-0 text-[12px] text-(--text-muted)">
                {loading ? "…" : t("enseignantDashboard.noTodayPresence")}
              </p>
            )}
          </div>
        </section>

        <section className="panel">
          <header className="panel-head">
            <h2 className="panel-title">{t("enseignantDashboard.recentProgressions")}</h2>
            <Link to="/progress" className="btn-xs btn-xs-green">
              {t("enseignantDashboard.viewAll")}
            </Link>
          </header>
          <div className="panel-body">
            {recentProgressions.length > 0 ? (
              <div className="table-shell">
                <table className="tbl">
                  <thead>
                    <tr>
                      <th>{t("progression.eleve")}</th>
                      <th>{t("progression.sourate")}</th>
                      <th>{t("progression.versets")}</th>
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
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="m-0 text-[12px] text-(--text-muted)">
                {loading ? "…" : t("enseignantDashboard.noProgressions")}
              </p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default EnseignantDashboard;