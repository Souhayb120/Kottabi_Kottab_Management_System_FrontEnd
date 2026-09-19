import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import api from "../api/Api";
import Sidebar from "../components/SideBar";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

const statutKeys = {
  PRESENT: "present",
  RETARD: "retard",
  ABSENT: "absent",
  EXCUSE: "excuse",
};

const statutColors = {
  PRESENT: "bg-[#0f3d2e]/10 text-[#0f3d2e]",
  RETARD: "bg-[#c79a3b]/15 text-[#8a691d]",
  ABSENT: "bg-red-600/10 text-red-700",
  EXCUSE: "bg-gray-500/10 text-gray-600",
};

const EleveDetails = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [eleve, setEleve] = useState(null);
  const [progression, setProgression] = useState(null);
  const [presences, setPresences] = useState([]);
  const [participations, setParticipations] = useState([]);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const eleveRes = await api.get(`api/eleve/username/${username}`);
        setEleve(eleveRes.data);
      } catch (error) {
        setEleve(null);
      }

      try {
        const progressionRes = await api.get(
          `api/progressions/eleve/${username}`,
        );
        setProgression(progressionRes.data);
      } catch (error) {
        setProgression(null);
      }

      try {
        const presenceRes = await api.get(
          `api/presence/eleve/${username}?size=100`,
        );
        setPresences(presenceRes.data.content);
      } catch (error) {
        setPresences([]);
      }

      try {
        const participationRes = await api.get(
          `api/participation/eleve/${username}?size=100`,
        );
        setParticipations(participationRes.data.content);
      } catch (error) {
        setParticipations([]);
      }
    };

    fetchDetails();
  }, [username]);

  const Row = ({ label, value }) => (
    <div className="flex justify-between py-2 border-b border-[#0f3d2e]/10 last:border-0">
      <span className="text-(--text-muted) text-xs">{label}</span>
      <span className="text-(--text) text-xs font-medium">{value}</span>
    </div>
  );

  const Card = ({ title, children }) => (
    <div className="trad-card p-2">
      <div className="trad-panel">
        <div className="flex items-center gap-2 border-b border-[#c79a3b]/25 px-5 py-3">
          <span className="select-none text-[11px] leading-none text-[#c79a3b]">۞</span>
          <h3 className="font-serif text-sm font-semibold text-[#0f3d2e]">{title}</h3>
        </div>
        <div className="px-5 py-3">{children}</div>
      </div>
    </div>
  );

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main">
        <NavBar />
        <div className="content">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => navigate("/eleve")}
              className="btn-ghost"
            >
              {t("eleveDetails.back")}
            </button>
            <div>
              <div className="ornament-row mb-1.5">
                <span className="select-none text-sm leading-none text-[#c79a3b]">۞</span>
              </div>
              <h2 className="text-right font-serif text-lg font-semibold tracking-tight text-(--text)">
                {t("eleveDetails.title")}
              </h2>
            </div>
          </div>

          {eleve ? (
            <div className="grid grid-cols-1 gap-4">
              <Card title={t("eleveDetails.identity")}>
                <div className="max-w-md">
                  <Row label={t("eleveDetails.id")} value={eleve.id} />
                  <Row label={t("eleveDetails.username")} value={eleve.username} />
                  <Row label={t("eleveDetails.nom")} value={eleve.nom} />
                  <Row label={t("eleveDetails.prenom")} value={eleve.prenom} />
                  <Row label={t("eleveDetails.email")} value={eleve.email} />
                  <Row label={t("eleveDetails.tel")} value={eleve.tel} />
                  <Row
                    label={t("eleveDetails.dateNaissance")}
                    value={eleve.dateNaissance}
                  />
                  <Row
                    label={t("eleveDetails.role")}
                    value={t("eleveDetails.eleveRole")}
                  />
                </div>
              </Card>

              <Card title={t("eleveDetails.progression")}>
                {progression ? (
                  <div className="max-w-md">
                    <Row
                      label={t("eleveDetails.sourate")}
                      value={progression.sourat}
                    />
                    <Row
                      label={t("eleveDetails.versets")}
                      value={`${progression.versetDebut} - ${progression.versetFin}`}
                    />
                    {progression.enseignant && (
                      <Row
                        label={t("eleveDetails.enseignant")}
                        value={`${progression.enseignant.prenom} ${progression.enseignant.nom}`}
                      />
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-(--text-muted)">
                    {t("eleveDetails.noProgression")}
                  </p>
                )}
              </Card>

              <Card title={t("eleveDetails.presence")}>
                {presences.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left text-(--text)">
                      <thead>
                        <tr className="border-b border-[#c79a3b]/30 text-[10px] uppercase tracking-[0.18em] text-[#0f3d2e]">
                          <th className="py-2 pe-4 font-medium">
                            {t("eleveDetails.date")}
                          </th>
                          <th className="py-2 font-medium">
                            {t("eleveDetails.statut")}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {presences.map((presence) => (
                          <tr
                            key={presence.id || `${presence.date}`}
                            className="border-b border-[#0f3d2e]/10 last:border-0"
                          >
                            <td className="py-2 pe-4">{presence.date}</td>
                            <td className="py-2">
                              <span
                                className={`rounded-md px-2 py-0.5 text-[11px] font-medium ${
                                  statutColors[presence.statut] ||
                                  "bg-gray-100 text-gray-600"
                                }`}
                              >
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
                  <p className="text-xs text-(--text-muted)">
                    {t("eleveDetails.noPresence")}
                  </p>
                )}
              </Card>

              <Card title={t("eleveDetails.participation")}>
                {participations.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left text-(--text)">
                      <thead>
                        <tr className="border-b border-[#c79a3b]/30 text-[10px] uppercase tracking-[0.18em] text-[#0f3d2e]">
                          <th className="py-2 pe-4 font-medium">
                            {t("eleveDetails.concour")}
                          </th>
                          <th className="py-2 pe-4 font-medium">
                            {t("eleveDetails.note")}
                          </th>
                          <th className="py-2 pe-4 font-medium">
                            {t("eleveDetails.classement")}
                          </th>
                          <th className="py-2 font-medium">
                            {t("eleveDetails.commentaire")}
                          </th>
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
                            className="border-b border-[#0f3d2e]/10 last:border-0"
                          >
                            <td className="py-2 pe-4">
                              {participation.concour?.nom || "—"}
                            </td>
                            <td className="py-2 pe-4">{participation.note}</td>
                            <td className="py-2 pe-4">
                              {participation.classement}
                            </td>
                            <td className="py-2">
                              {participation.commentaire || "—"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-xs text-(--text-muted)">
                    {t("eleveDetails.noParticipation")}
                  </p>
                )}
              </Card>
            </div>
          ) : (
            <p className="trad-card px-5 py-4 text-xs text-(--text-muted)">
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