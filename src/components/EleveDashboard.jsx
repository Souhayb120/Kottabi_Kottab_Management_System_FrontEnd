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

const statusOrder = ["PRESENT", "RETARD", "ABSENT", "EXCUSE"];

const EleveDashboard = ({ username }) => {
  const { t } = useTranslation();
  const [eleve, setEleve] = useState(null);
  const [progression, setProgression] = useState(null);
  const [presences, setPresences] = useState([]);
  const [participations, setParticipations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const eleveResponse = await api.get(`api/eleve/username/${username}`);
        setEleve(eleveResponse.data);
      } catch {
        setEleve(null);
      }

      try {
        const progressionResponse = await api.get(
          `api/progressions/eleve/${username}?size=1`,
        );
        setProgression(progressionResponse.data.content[0] || null);
      } catch {
        setProgression(null);
      }

      try {
        const presenceResponse = await api.get(
          `api/presence/eleve/${username}?size=100`,
        );
        setPresences(presenceResponse.data.content);
      } catch {
        setPresences([]);
      }

      try {
        const participationResponse = await api.get(
          `api/participation/eleve/${username}?size=100`,
        );
        setParticipations(participationResponse.data.content);
      } catch {
        setParticipations([]);
      }

      setLoading(false);
    };

    loadDashboard();
  }, [username]);

  const presenceCounts = statusOrder.reduce((acc, status) => {
    acc[status] = presences.filter((p) => p.statut === status).length;
    return acc;
  }, {});

  const recentPresences = presences.slice(0, 6);

  return (
    <div className="content">
      <div className="page-header has-toolbar">
        <div>
          <h1 className="page-title">{t("eleveDashboard.title")}</h1>
          <p className="page-sub">
            {eleve?.prenom} {eleve?.nom} ({username})
          </p>
        </div>
        <Link to={`/eleve/details/${username}`} className="btn">
          <FontAwesomeIcon icon={faArrowRight} className="h-3.5 w-3.5 rtl:-scale-x-100" />
          {t("eleveDashboard.viewProfile")}
        </Link>
      </div>

      <div className="stat-ledger">
        <div className="stat-item">
          <div className="stat-value">{loading ? "–" : progression?.sourat || "—"}</div>
          <div className="stat-label">{t("eleveDashboard.statProgression")}</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">{loading ? "–" : presences.length}</div>
          <div className="stat-label">{t("eleveDashboard.statPresences")}</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">{loading ? "–" : presenceCounts.PRESENT}</div>
          <div className="stat-label">{t("eleveDashboard.statPresent")}</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">{loading ? "–" : participations.length}</div>
          <div className="stat-label">{t("eleveDashboard.statParticipations")}</div>
        </div>
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-2">
        <section className="panel">
          <header className="panel-head">
            <h2 className="panel-title">{t("eleveDashboard.progressionTitle")}</h2>
          </header>
          <div className="panel-body">
            {progression ? (
              <dl className="m-0 max-w-md">
                <div className="dl">
                  <dt>{t("eleveDetails.sourate")}</dt>
                  <dd>
                    <span className="badge badge-ink">{progression.sourat}</span>
                  </dd>
                </div>
                <div className="dl">
                  <dt>{t("eleveDetails.versets")}</dt>
                  <dd>
                    {progression.versetDebut} – {progression.versetFin}
                  </dd>
                </div>
                {progression.enseignant && (
                  <div className="dl">
                    <dt>{t("eleveDetails.enseignant")}</dt>
                    <dd>
                      {progression.enseignant.prenom} {progression.enseignant.nom}
                    </dd>
                  </div>
                )}
              </dl>
            ) : (
              <p className="m-0 text-[12px] text-(--text-muted)">
                {loading ? "…" : t("eleveDetails.noProgression")}
              </p>
            )}
          </div>
        </section>

        <section className="panel">
          <header className="panel-head">
            <h2 className="panel-title">{t("eleveDashboard.presenceTitle")}</h2>
          </header>
          <div className="panel-body">
            {recentPresences.length > 0 ? (
              <div className="table-shell">
                <table className="tbl">
                  <thead>
                    <tr>
                      <th>{t("presence.date")}</th>
                      <th>{t("presence.statut")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentPresences.map((presence) => (
                      <tr key={presence.id || presence.date}>
                        <td className="cell-muted">{presence.date}</td>
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
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="m-0 text-[12px] text-(--text-muted)">
                {loading ? "…" : t("eleveDetails.noPresence")}
              </p>
            )}
          </div>
        </section>

        <section className="panel">
          <header className="panel-head">
            <h2 className="panel-title">{t("eleveDashboard.participationTitle")}</h2>
          </header>
          <div className="panel-body">
            {participations.length > 0 ? (
              <div className="table-shell">
                <table className="tbl">
                  <thead>
                    <tr>
                      <th>{t("eleveDetails.concour")}</th>
                      <th>{t("eleveDetails.note")}</th>
                      <th>{t("eleveDetails.classement")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {participations.slice(0, 6).map((participation) => (
                      <tr key={participation.id}>
                        <td className="cell-strong">
                          {participation.concour?.nom || "—"}
                        </td>
                        <td>
                          <span className="badge badge-ink">
                            {participation.note}
                          </span>
                        </td>
                        <td className="num">{participation.classement}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="m-0 text-[12px] text-(--text-muted)">
                {loading ? "…" : t("eleveDetails.noParticipation")}
              </p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default EleveDashboard;