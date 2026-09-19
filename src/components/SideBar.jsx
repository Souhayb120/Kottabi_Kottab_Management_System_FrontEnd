import { NavLink, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
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
      ? "nav-item flex items-center rounded-lg border-s-4 border-[#c79a3b] bg-emerald-700/40 py-2.5 text-sm font-medium text-white"
      : "nav-item flex items-center rounded-lg border-s-4 border-transparent py-2.5 text-sm text-emerald-100/80 transition-colors hover:bg-white/5 hover:text-white";

  return (
    <aside className="sidebar flex h-screen flex-col bg-[#0f3d2e] text-white">
      <div className="brand-block flex items-center border-b border-white/10 py-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-800/60">
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
          </svg>
        </div>
        <div className="brand-text">
          <div className="flex items-center gap-1.5 text-base font-semibold leading-tight">
            <span className="select-none text-[9px] leading-none text-[#d9b45f]">۞</span>
            Kottabi
          </div>
          <div className="text-[11px] text-emerald-100/60">{t("sidebar.tagline")}</div>
        </div>
      </div>

      <div className="menu-text px-5 pb-1 pt-4 text-[11px] font-medium uppercase tracking-widest text-emerald-100/40">
        {t("sidebar.menu", "Menu")}
      </div>

      <ul className="flex flex-col gap-1">
        <li>
          <NavLink to="/dashboard" className={linkClass}>
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 13h8V3H3z" />
              <path d="M13 21h8v-6h-8z" />
              <path d="M13 11h8V3h-8z" />
              <path d="M3 21h8v-4H3z" />
            </svg>
            <span className="nav-text">{t("sidebar.dashboard")}</span>
          </NavLink>
        </li>

        <li>
          <NavLink to="/eleve" className={linkClass}>
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="9" cy="8" r="3" />
              <circle cx="17" cy="9" r="2.5" />
              <path d="M3 20c0-3.5 2.5-5.5 6-5.5s6 2 6 5.5" />
              <path d="M15 15c2.8 0 5 1.6 5 5" />
            </svg>
            <span className="nav-text">{t("sidebar.students")}</span>
          </NavLink>
        </li>

        <li>
          <NavLink to="/presence" className={linkClass}>
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 11l3 3 8-8" />
              <path d="M21 12v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h11" />
            </svg>
            <span className="nav-text">{t("sidebar.presence")}</span>
          </NavLink>
        </li>

        <li>
          <NavLink to="/enseignant" className={linkClass}>
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 3L2 8l10 5 10-5-10-5z" />
              <path d="M6 10.5V16c0 1.7 2.7 3 6 3s6-1.3 6-3v-5.5" />
            </svg>
            <span className="nav-text">{t("sidebar.teachers")}</span>
          </NavLink>
        </li>

        <li>
          <NavLink to="/progress" className={linkClass}>
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 17l6-6 4 4 8-8" />
              <path d="M15 7h6v6" />
            </svg>
            <span className="nav-text">{t("sidebar.progress")}</span>
          </NavLink>
        </li>

        <li>
          <NavLink to="/competitions" className={linkClass}>
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M8 21h8" />
              <path d="M12 17v4" />
              <path d="M7 4h10v5a5 5 0 0 1-10 0V4z" />
              <path d="M7 5H4a3 3 0 0 0 3 4" />
              <path d="M17 5h3a3 3 0 0 1-3 4" />
            </svg>
            <span className="nav-text">{t("sidebar.competitions")}</span>
          </NavLink>
        </li>

        <li>
          <NavLink to="/participation" className={linkClass}>
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="8" r="5" />
              <path d="M8.5 14l-1 6.5L12 18.5l4.5 2-1-6.5" />
            </svg>
            <span className="nav-text">{t("sidebar.participation")}</span>
          </NavLink>
        </li>

        <li>
          <NavLink to="/reports" className={linkClass}>
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 2h9l3 3v17H6z" />
              <path d="M15 2v3h3" />
              <path d="M9 13h6" />
              <path d="M9 17h6" />
            </svg>
            <span className="nav-text">{t("sidebar.reports")}</span>
          </NavLink>
        </li>
      </ul>

      <div className="flex-1" />

      <div className="border-t border-white/10 py-3">
        <button
          onClick={handleLogout}
          className="nav-item flex w-full items-center rounded-lg border-s-4 border-transparent py-2.5 text-sm text-emerald-100/80 transition-colors hover:bg-white/5 hover:text-white"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
            <path d="M10 17l5-5-5-5" />
            <path d="M15 12H3" />
          </svg>
          <span className="nav-text">{t("sidebar.logout")}</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;