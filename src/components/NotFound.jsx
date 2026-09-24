import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";

function NotFound() {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-(--bg) p-6 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-(--r-md) border border-(--border-strong) bg-(--surface) text-[#c79a3b]">
        <FontAwesomeIcon icon={faTriangleExclamation} className="h-7 w-7" />
      </span>
      <div>
        <p className="font-display text-5xl font-bold text-(--text)">404</p>
        <p className="mt-2 text-[14px] text-(--text-muted)">
          {t("notFound.message", "Cette page n'existe pas.")}
        </p>
      </div>
      <Link
        to="/"
        className="btn inline-flex items-center justify-center gap-2"
      >
        <FontAwesomeIcon icon={faHouse} className="h-3.5 w-3.5" />
        {t("notFound.backHome", "Retour à l'accueil")}
      </Link>
    </div>
  );
}

export default NotFound;