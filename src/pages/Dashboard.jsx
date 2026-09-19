import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { jwtDecode } from "jwt-decode";
import api from "../api/Api";
import Sidebar from "../components/SideBar";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

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

  const dateLabel = new Date().toLocaleDateString(i18n.language === "ar" ? "ar-EG" : "fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const cards = [
    { key: "eleves", color: "bg-[#0f3d2e]" },
    { key: "enseignants", color: "bg-[#c79a3b]" },
    { key: "concours", color: "bg-[#8a691d]" },
    { key: "presences", color: "bg-[#3e5a4d]" },
    { key: "progressions", color: "bg-[#0f3d2e]" },
    { key: "participations", color: "bg-[#8a691d]" },
  ];

  const cardIcons = {
    eleves: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
        <circle cx="9" cy="8" r="3" />
        <circle cx="17" cy="9" r="2.5" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 20c0-3.5 2.5-5.5 6-5.5s6 2 6 5.5" />
      </svg>
    ),
    enseignants: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
        <path d="M12 3L2 8l10 5 10-5-10-5z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 10.5V16c0 1.7 2.7 3 6 3s6-1.3 6-3v-5.5" />
      </svg>
    ),
    concours: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 21h8" />
        <path d="M12 17v4" />
        <path d="M7 4h10v5a5 5 0 0 1-10 0V4z" />
        <path d="M7 5H4a3 3 0 0 0 3 4" />
        <path d="M17 5h3a3 3 0 0 1-3 4" />
      </svg>
    ),
    presences: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 11l3 3 8-8" />
        <path d="M21 12v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h11" />
      </svg>
    ),
    progressions: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 17l6-6 4 4 8-8" />
        <path d="M15 7h6v6" />
      </svg>
    ),
    participations: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
      </svg>
    ),
  };

  return (
    <>
      <div className="app-layout">
        <Sidebar />
        <div className="main">
          <NavBar />
<div className="content">
  <div className="ornament-row mb-1.5">
    <span className="select-none text-sm leading-none text-[#c79a3b]">۞</span>
  </div>
  <h2 className="mb-4 text-right font-serif text-lg font-semibold tracking-tight text-(--text)">
    {t("dashboard.title")}
  </h2>

  <div className="trad-card flex flex-wrap items-center justify-between gap-3 px-5 py-4">
    <div className="flex items-center gap-3">
      <span className="select-none text-sm leading-none text-[#c79a3b]">✦</span>
      <div>
        <p className="font-serif text-sm font-semibold text-[#0f3d2e]">
          {t("dashboard.welcome")}, {username}
        </p>
        <p className="text-xs text-(--text-muted) mt-0.5 capitalize">
          {dateLabel} · {t("dashboard.subtitle")}
        </p>
      </div>
    </div>
  </div>

  <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3">
    {cards.map((card) => (
      <div
        key={card.key}
        className="trad-card flex items-center gap-3 p-3"
      >
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-white ${card.color}`}
        >
          {cardIcons[card.key]}
        </div>
        <div className="leading-tight">
          <div className="text-xl font-bold text-(--text)">
            {stats[card.key]}
          </div>
          <div className="text-[11px] text-(--text-muted)">
            {t(`dashboard.${card.key}`)}
          </div>
        </div>
      </div>
    ))}
  </div>

  <div className="trad-card mt-4 p-2">
    <div className="trad-panel">
      <div className="flex items-center justify-between border-b border-[#c79a3b]/25 px-4 py-3">
        <span className="flex items-center gap-2 font-serif text-xs font-semibold text-[#0f3d2e]">
          <span className="select-none text-[11px] leading-none text-[#c79a3b]">۞</span>
          {t("dashboard.recentProgressions")}
        </span>
        <Link
          to="/progress"
          className="btn-ghost"
        >
          {t("dashboard.viewAll")}
        </Link>
      </div>

      <table className="w-full text-xs text-left text-(--text)">
        <thead>
          <tr className="bg-[#f5efdf]/70 text-[10px] uppercase tracking-[0.18em] text-[#0f3d2e] border-b border-[#c79a3b]/30">
            <th className="px-4 py-2.5 font-medium">{t("progression.eleve")}</th>
            <th className="px-4 py-2.5 font-medium">{t("progression.sourate")}</th>
            <th className="px-4 py-2.5 font-medium">{t("progression.versets")}</th>
            <th className="px-4 py-2.5 font-medium">{t("progression.enseignant")}</th>
          </tr>
        </thead>
        <tbody>
          {recentProgressions.map((progression) => (
            <tr
              key={progression.id}
              className="border-b border-[#0f3d2e]/10 last:border-0 hover:bg-[#f6f0e0]/40 transition-colors"
            >
              <td className="px-4 py-2.5 font-medium text-(--text)">
                {progression.eleve?.prenom} {progression.eleve?.nom}
              </td>
              <td className="px-4 py-2.5">{progression.sourat}</td>
              <td className="px-4 py-2.5">
                {progression.versetDebut} - {progression.versetFin}
              </td>
              <td className="px-4 py-2.5">
                {progression.enseignant?.prenom} {progression.enseignant?.nom}
              </td>
            </tr>
          ))}
          {recentProgressions.length === 0 && (
            <tr>
              <td colSpan={4} className="px-4 py-6 text-center text-(--text-muted)">
                {t("dashboard.noProgressions")}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
</div>
          <Footer />
        </div>
      </div>
    </>
  );
};

export default Dashboard;