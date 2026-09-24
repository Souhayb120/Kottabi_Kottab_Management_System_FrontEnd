import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import api from "../api/Api";
import AuthService from "../services/AuthService";
import Sidebar from "../components/SideBar";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

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

const EleveDetails = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const isEleve = AuthService.getRole() === "ELEVE";

  const [eleve, setEleve] = useState(null);
  const [progression, setProgression] = useState(null);
  const [presences, setPresences] = useState([]);
  const [participations, setParticipations] = useState([]);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchDetails = async () => {
    setLoading(true);

    if (isEleve) {
      try {
        const { data } = await api.get("api/eleve/me");

        setEleve({ ...data, username: data.username || username });
        setProgression(data.progressions?.[0] || null);
        setPresences(data.presences || []);
        setParticipations(data.participations || []);
      } catch (error) {
        console.error("Failed to load student profile:", error);
        setEleve(null);
        setProgression(null);
        setPresences([]);
        setParticipations([]);
      } finally {
        setLoading(false);
      }
      return;
    }

    try {
      const eleveRes = await api.get(
        `api/eleve/username/${encodeURIComponent(username)}`
      );
      setEleve(eleveRes.data);
    } catch {
      setEleve(null);
    }

    try {
      const progressionRes = await api.get(
        `api/progressions/eleve/${username}?size=100`
      );
      setProgression(progressionRes.data.content[0] || null);
    } catch {
      setProgression(null);
    }

    try {
      const presenceRes = await api.get(
        `api/presence/eleve/${username}?size=100`
      );
      setPresences(presenceRes.data.content);
    } catch {
      setPresences([]);
    }

    try {
      const participationRes = await api.get(
        `api/participation/eleve/${username}?size=100`
      );
      setParticipations(participationRes.data.content);
    } catch {
      setParticipations([]);
    }

    setLoading(false);
  };

  fetchDetails();
}, [username, isEleve]);
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main">
        <NavBar />
        <div className="content">
          <div className="page-header has-toolbar">
            <div>
              <h1 className="page-title">{t("eleveDetails.title")}</h1>
            </div>
            <button onClick={() => navigate(isEleve ? "/dashboard" : "/eleve")} className="btn-secondary">
              <FontAwesomeIcon icon={faArrowRight} className="h-3.5 w-3.5" />
              {t("eleveDetails.back")}
            </button>
          </div>

          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
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
          ) : eleve ? (
            <div className="grid grid-cols-1 gap-4">
              <section className="panel">
                <header className="panel-head">
                  <h2 className="panel-title">{t("eleveDetails.identity")}</h2>
                </header>
                <div className="panel-body">
                  <dl className="m-0 max-w-md">
                    {eleve.id != null && (
                      <div className="dl">
                        <dt>{t("eleveDetails.id")}</dt>
                        <dd className="num">{eleve.id}</dd>
                      </div>
                    )}
                    <div className="dl">
                      <dt>{t("eleveDetails.username")}</dt>
                      <dd>{eleve.username}</dd>
                    </div>
                    <div className="dl">
                      <dt>{t("eleveDetails.nom")}</dt>
                      <dd>{eleve.nom}</dd>
                    </div>
                    <div className="dl">
                      <dt>{t("eleveDetails.prenom")}</dt>
                      <dd>{eleve.prenom}</dd>
                    </div>
                    {eleve.email != null && (
                      <div className="dl">
                        <dt>{t("eleveDetails.email")}</dt>
                        <dd>{eleve.email}</dd>
                      </div>
                    )}
                    {eleve.tel != null && (
                      <div className="dl">
                        <dt>{t("eleveDetails.tel")}</dt>
                        <dd>{eleve.tel}</dd>
                      </div>
                    )}
                    <div className="dl">
                      <dt>{t("eleveDetails.dateNaissance")}</dt>
                      <dd>{eleve.dateNaissance}</dd>
                    </div>
                    <div className="dl">
                      <dt>{t("eleveDetails.role")}</dt>
                      <dd>{t("eleveDetails.eleveRole")}</dd>
                    </div>
                  </dl>
                </div>
              </section>

              <section className="panel">
                <header className="panel-head">
                  <h2 className="panel-title">{t("eleveDetails.progression")}</h2>
                </header>
                <div className="panel-body">
                  {progression ? (
                    <dl className="m-0 max-w-md">
                      <div className="dl">
                        <dt>{t("eleveDetails.sourate")}</dt>
                        <dd>
                          <span className="badge badge-ink">
                            {progression.sourat}
                          </span>
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
                            {progression.enseignant.prenom}{" "}
                            {progression.enseignant.nom}
                          </dd>
                        </div>
                      )}
                    </dl>
                  ) : (
                    <p className="m-0 text-[12px] text-(--text-muted)">
                      {t("eleveDetails.noProgression")}
                    </p>
                  )}
                </div>
              </section>

              <section className="panel">
                <header className="panel-head">
                  <h2 className="panel-title">{t("eleveDetails.presence")}</h2>
                </header>
                <div className="panel-body">
                  {presences.length > 0 ? (
                    <div className="table-shell">
                      <table className="tbl">
                        <thead>
                          <tr>
                            <th>{t("eleveDetails.date")}</th>
                            <th>{t("eleveDetails.statut")}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {presences.map((presence) => (
                            <tr
                              key={presence.id || `${presence.date}`}
                            >
                              <td className="cell-muted">{presence.date}</td>
                              <td>
                                <span
                                  className={
                                    statutBadges[presence.statut] ||
                                    "badge badge-muted"
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
                      {t("eleveDetails.noPresence")}
                    </p>
                  )}
                </div>
              </section>

              <section className="panel">
                <header className="panel-head">
                  <h2 className="panel-title">
                    {t("eleveDetails.participation")}
                  </h2>
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
                            <th>{t("eleveDetails.commentaire")}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {participations.map((participation) => (
                            <tr
                              key={
                                participation.id ||
                                participation.concour?.nom ||
                                participation.note
                              }
                            >
                              <td className="cell-strong">
                                {participation.concour?.nom || "—"}
                              </td>
                              <td>
                                <span className="badge badge-ink">
                                  {participation.note}
                                </span>
                              </td>
                              <td className="num">{participation.classement}</td>
                              <td className="cell-muted">
                                {participation.commentaire || "—"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="m-0 text-[12px] text-(--text-muted)">
                      {t("eleveDetails.noParticipation")}
                    </p>
                  )}
                </div>
              </section>
            </div>
          ) : (
            <p className="text-[13px] text-(--text-muted)">
              {t("eleves.notFound")}
            </p>
          )}
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default EleveDetails;