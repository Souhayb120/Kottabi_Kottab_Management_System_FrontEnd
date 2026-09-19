import { useTranslation } from "react-i18next";

function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="footer">
      <p>
        © {new Date().getFullYear()} Kottabi —{" "}
        {t("footer.rights", "All Rights Reserved.")}
      </p>
    </footer>
  );
}

export default Footer;