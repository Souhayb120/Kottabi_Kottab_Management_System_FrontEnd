import { useTranslation } from "react-i18next";

function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="footer">
      <p>
        © 2026 Kottabi. {t("footer.rights", "All Rights Reserved.")}
      </p>
    </footer>
  );
}

export default Footer;