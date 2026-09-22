import { NavLink, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBookQuran,
  faCalendarCheck,
  faChalkboardUser,
  faChildren,
  faFileLines,
  faMedal,
  faMosque,
  faRightFromBracket,
  faStarAndCrescent,
  faTrophy,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import AuthService from "../services/AuthService";
import { toast } from "react-toastify";

function Sidebar() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleLogout = () => {
    AuthService.logout();
    toast.info(t("sidebar.loggedOut", "Vous êtes déconnecté."));
    navigate("/login");
  };

  const linkClass = ({ isActive }) =>
    isActive
      ? "nav-item flex items-center rounded-md border-s-2 border-[#c79a3b] bg-white/10 py-2.5 text-[13px] font-medium text-white"
      : "nav-item flex items-center rounded-md border-s-2 border-transparent py-2.5 text-[13px] text-white/70 transition-colors hover:bg-white/5 hover:text-white";

  const role = AuthService.getRole();
  const username = AuthService.getUsername();

  let navItems = [];
  if (role === "ELEVE") {
    navItems = [
      { to: "/dashboard", labelKey: "sidebar.dashboard", icon: faStarAndCrescent },
      { to: `/eleve/details/${username}`, labelKey: "sidebar.profile", icon: faUser },
    ];
  } else if (role === "ENSEIGNANT") {
    navItems = [
      { to: "/dashboard", labelKey: "sidebar.dashboard", icon: faStarAndCrescent },
      { to: "/progress", labelKey: "sidebar.progress", icon: faBookQuran },
      { to: "/participation", labelKey: "sidebar.participation", icon: faMedal },
      { to: `/enseignant/details/${username}`, labelKey: "sidebar.profile", icon: faUser },
    ];
  } else {
    navItems = [
      { to: "/dashboard", labelKey: "sidebar.dashboard", icon: faStarAndCrescent },
      { to: "/eleve", labelKey: "sidebar.students", icon: faChildren },
      { to: "/presence", labelKey: "sidebar.presence", icon: faCalendarCheck },
      { to: "/enseignant", labelKey: "sidebar.teachers", icon: faChalkboardUser },
      { to: "/progress", labelKey: "sidebar.progress", icon: faBookQuran },
      { to: "/competitions", labelKey: "sidebar.competitions", icon: faTrophy },
      { to: "/participation", labelKey: "sidebar.participation", icon: faMedal },
      { to: "/reports", labelKey: "sidebar.reports", icon: faFileLines },
    ];
  }

  return (
    <aside className="sidebar flex h-screen flex-col text-white">
      <div className="brand-block flex items-center border-b border-[#c79a3b]/30 py-5">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-[#c79a3b]/45 bg-white/5 text-[#e3c472]">
          <FontAwesomeIcon icon={faMosque} className="h-5 w-5" />
        </div>
        <div className="brand-text">
          <div className="font-display text-[17px] font-bold leading-none text-white">
            {t("landing.titleApp")}
          </div>
          <div className="mt-1 text-[11px] text-white/45">{t("sidebar.tagline")}</div>
        </div>
      </div>

      <div className="menu-text px-5 pb-1 pt-5 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#c79a3b]/80">
        {t("sidebar.menu", "Menu")}
      </div>

      <ul className="flex flex-col gap-0.5 px-2.5">
        {navItems.map((item) => (
          <li key={item.to}>
            <NavLink to={item.to} className={linkClass}>
              <FontAwesomeIcon icon={item.icon} className="h-4 w-4 shrink-0" />
              <span className="nav-text">{t(item.labelKey)}</span>
            </NavLink>
          </li>
        ))}
      </ul>

      <div className="flex-1" />

      <div className="border-t border-white/10 px-2.5 py-3">
        <button
          onClick={handleLogout}
          className="nav-item flex w-full items-center rounded-md border-s-2 border-transparent py-2.5 text-[13px] text-white/70 transition-colors hover:bg-white/5 hover:text-white"
        >
          <FontAwesomeIcon icon={faRightFromBracket} className="h-4 w-4 shrink-0" />
          <span className="nav-text">{t("sidebar.logout")}</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;