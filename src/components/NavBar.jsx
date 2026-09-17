import { jwtDecode } from "jwt-decode";
import { useTranslation } from "react-i18next";
import { CalendarDays, GraduationCap } from "lucide-react";

function Topbar() {
  const { t, i18n } = useTranslation();
  const token = localStorage.getItem("token");

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

  const dateLabel = new Date().toLocaleDateString(i18n.language === "ar" ? "ar-EG" : "fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="topbar">
      <div className="hidden items-center gap-4 rounded-full border border-white/10 bg-white/10 px-5 py-1.5 sm:flex">
        <span className="flex items-center gap-2 text-sm font-medium text-white">
          <GraduationCap className="h-4 w-4 text-emerald-100/70" />
          Kottab el Imam Warch
        </span>
        <span className="h-4 w-px bg-white/20" />
        <span className="flex items-center gap-1.5 text-xs text-emerald-100/70">
          <CalendarDays className="h-3.5 w-3.5" />
          <span className="capitalize">{dateLabel}</span>
        </span>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-700/70 text-xs font-semibold">
            {initials || "U"}
          </div>
          <div className="leading-tight">
            <div className="text-sm font-medium">{username || "Utilisateur"}</div>
            <div className="text-[11px] uppercase tracking-wide text-emerald-100/60">
              {role || t("topbar.profile", "Profile")}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Topbar;