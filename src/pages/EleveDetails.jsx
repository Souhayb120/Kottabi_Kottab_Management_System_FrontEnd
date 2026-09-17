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
  PRESENT: "bg-green-100 text-green-700",
  RETARD: "bg-yellow-100 text-yellow-700",
  ABSENT: "bg-red-100 text-red-700",
  EXCUSE: "bg-gray-100 text-gray-600",
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
    <div className="flex justify-between py-2 border-b border-gray-100 last:border-0">
      <span className="text-gray-500 text-xs">{label}</span>
      <span className="text-gray-700 text-xs font-medium">{value}</span>
    </div>
  );

  const Card = ({ title, children }) => (
    <div className="rounded-xl bg-white ring-1 ring-gray-200">
      <div className="border-b border-gray-200 px-5 py-3">
        <h3 className="text-sm font-semibold text-gray-700">{title}</h3>
      </div>
      <div className="px-5 py-3">{children}</div>
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
              className="rounded-md bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-200"
            >
              {t("eleveDetails.back")}
            </button>
            <h2 className="text-base font-semibold text-gray-700 text-right">
              {t("eleveDetails.title")}
            </h2>
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
                  <p className="text-xs text-gray-500">
                    {t("eleveDetails.noProgression")}
                  </p>
                )}
              </Card>

              <Card title={t("eleveDetails.presence")}>
                {presences.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left text-gray-600">
                      <thead>
                        <tr className="border-b border-gray-200 text-[11px] uppercase tracking-wider text-gray-400">
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
                            className="border-b border-gray-100 last:border-0"
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
                  <p className="text-xs text-gray-500">
                    {t("eleveDetails.noPresence")}
                  </p>
                )}
              </Card>

              <Card title={t("eleveDetails.participation")}>
                {participations.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left text-gray-600">
                      <thead>
                        <tr className="border-b border-gray-200 text-[11px] uppercase tracking-wider text-gray-400">
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
                            className="border-b border-gray-100 last:border-0"
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
                  <p className="text-xs text-gray-500">
                    {t("eleveDetails.noParticipation")}
                  </p>
                )}
              </Card>
            </div>
          ) : (
            <p className="rounded-xl bg-white ring-1 ring-gray-200 px-5 py-4 text-xs text-gray-500">
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