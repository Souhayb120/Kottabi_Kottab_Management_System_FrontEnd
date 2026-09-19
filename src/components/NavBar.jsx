import { jwtDecode } from "jwt-decode";
import { useTranslation } from "react-i18next";
import { CalendarDays, Globe, GraduationCap } from "lucide-react";

function Topbar() {
  const { t, i18n } = useTranslation();
  const token = localStorage.getItem("token");

  const toggleLang = () => i18n.changeLanguage(i18n.language === "ar" ? "fr" : "ar");

  let username = "";
  let role = "";
  try {
    const decoded = jwtDecode(token);
    username = decoded.sub || "";
    role = (decoded.role || "").replace("ROLE_", "");
  } catch (e) {
    username = "";
  }

  const initials = username
    .split(/[\s._-]+/)
    .map((part) => part.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const dateLabel = new Date().toLocaleDateString(
    i18n.language === "ar" ? "ar-EG" : "fr-FR",
    { weekday: "long", day: "numeric", month: "long", year: "numeric" },
  );

  return (
    <div className="topbar">
      <div className="hidden items-center gap-3 text-[13px] sm:flex">
        <span className="flex items-center gap-2 font-medium text-white">
          <GraduationCap className="h-4 w-4 text-[#d9b45f]" />
          Kottab el Imam Warch
        </span>
        <span className="topbar-split" />
        <span className="flex items-center gap-1.5 text-xs text-white/60">
          <CalendarDays className="h-3.5 w-3.5" />
          <span className="capitalize">{dateLabel}</span>
        </span>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={toggleLang}
          className="flex items-center gap-1.5 rounded-md border border-white/20 bg-white/5 px-2.5 py-1.5 text-[11.5px] font-medium text-[#e3c472] transition-colors hover:bg-white/10 hover:text-white"
        >
          <Globe className="h-3.5 w-3.5" />
          {i18n.language === "ar" ? "FR" : "عربي"}
        </button>
        <div className="avatar">{initials || "U"}</div>
        <div className="leading-tight">
          <div className="text-[13px] font-medium text-white">
            {username || "Utilisateur"}
          </div>
          <div className="text-[10.5px] uppercase tracking-wide text-white/45">
            {role || t("topbar.profile", "Profile")}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Topbar;