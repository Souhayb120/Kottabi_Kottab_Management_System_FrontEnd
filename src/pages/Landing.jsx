import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faBars,
  faBookQuran,
  faCalendarCheck,
  faChalkboardUser,
  faCheck,
  faChildren,
  faFileLines,
  faGlobe,
  faMagnifyingGlass,
  faTrophy,
  faUserShield,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import ThemeToggle from "../components/ThemeToggle";

function Landing() {
  const { t, i18n } = useTranslation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dark, setDark] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches,
  );

  const isAr = i18n.language === "ar";
  const toggleLang = () => i18n.changeLanguage(isAr ? "fr" : "ar");

  const navLinks = [
    { href: "#product", label: t("landing.navFeatures", "Fonctionnalités") },
    { href: "#roles", label: t("landing.navRoles", "Pour qui") },
    { href: "#story", label: t("landing.navStory", "L'histoire") },
  ];

  const features = [
    {
      icon: faCalendarCheck,
      title: t("landing.f1Title", "La présence"),
      desc: t("landing.f1Desc", "Le pointage du matin, en trente secondes."),
    },
    {
      icon: faBookQuran,
      title: t("landing.f2Title", "Le suivi de la mémorisation"),
      desc: t("landing.f2Desc", "Sourates, versets, et degré de difficulté."),
    },
    {
      icon: faChildren,
      title: t("landing.f3Title", "Les fiches élèves"),
      desc: t("landing.f3Desc", "Coordonnées, naissance, et historique complet."),
    },
    {
      icon: faTrophy,
      title: t("landing.f4Title", "Les concours"),
      desc: t("landing.f4Desc", "Inscription, notes, classement."),
    },
    {
      icon: faFileLines,
      title: t("landing.f5Title", "Les rapports"),
      desc: t("landing.f5Desc", "Un bilan simple, envoyé aux familles."),
    },
    {
      icon: faMagnifyingGlass,
      title: t("landing.f6Title", "La recherche"),
      desc: t("landing.f6Desc", "Retrouver un élève par son nom, immédiatement."),
    },
  ];

  const roles = [
    {
      icon: faUserShield,
      title: t("landing.roleAdminTitle", "La direction"),
      desc: t("landing.roleAdminDesc", "Toute l'école en un écran, sans recompter les cahiers."),
      points: [
        t("landing.roleAdmin1", "Créer les comptes, les classes et les niveaux"),
        t("landing.roleAdmin2", "Répartir les enseignants"),
        t("landing.roleAdmin3", "Ouvrir les rapports du trimestre"),
      ],
    },
    {
      icon: faChalkboardUser,
      title: t("landing.roleTeacherTitle", "Les enseignants"),
      desc: t("landing.roleTeacherDesc", "Trente secondes par élève, puis on revient à l'enseignement."),
      points: [
        t("landing.roleTeacher1", "Pointer la présence du matin"),
        t("landing.roleTeacher2", "Noter la leçon du jour et sa difficulté"),
        t("landing.roleTeacher3", "Envoyer un mot à la famille, sans rendez-vous"),
      ],
    },
    {
      icon: faBookQuran,
      title: t("landing.roleParentTitle", "Les familles"),
      desc: t("landing.roleParentDesc", "Suivre de loin, sans bruit, l'essentiel seulement."),
      points: [
        t("landing.roleParent1", "Voir la leçon du jour"),
        t("landing.roleParent2", "Recevoir le bilan du trimestre"),
        t("landing.roleParent3", "Encourager une réussite, le jour même"),
      ],
    },
  ];

  const numbers = [
    { value: "120", label: t("landing.count1Label", "élèves suivis") },
    { value: "12", label: t("landing.count2Label", "enseignants") },
    { value: "8", label: t("landing.count3Label", "concours organisés") },
    { value: "1", label: t("landing.count4Label", "rapport remis chaque trimestre") },
  ];

  const week = [40, 68, 52, 90, 62, 80, 66];

  return (
    <div className={dark ? "dark" : undefined}>
      <div className="min-h-screen bg-(--bg) text-(--text) transition-colors duration-300">
        <header className="sticky top-0 z-50 border-b border-(--border) bg-(--bg)/95 backdrop-blur-sm">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
            <a href="#top" className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-md border border-(--border) bg-(--surface)">
                <FontAwesomeIcon icon={faBookQuran} className="h-4 w-4 text-(--brand)" />
              </span>
              <div className="leading-tight">
                <div className="text-sm font-semibold text-(--text)">Kottabi</div>
                <div className="hidden text-[10px] text-(--text-muted) sm:block">
                  {t("sidebar.tagline", "Gestion des écoles coraniques")}
                </div>
              </div>
            </a>

            <nav className="hidden items-center gap-7 md:flex">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm text-(--text-muted) transition-colors duration-150 hover:text-(--text)"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              <button
                onClick={toggleLang}
                className="flex h-9 items-center gap-1.5 rounded-md border border-(--border) px-3 text-xs text-(--text-muted) transition-colors duration-150 hover:text-(--text)"
              >
                <FontAwesomeIcon icon={faGlobe} className="h-3.5 w-3.5" />
                {isAr ? "FR" : "عربي"}
              </button>

              <ThemeToggle
                className="flex h-9 w-9 items-center justify-center rounded-md border border-(--border) text-(--text-muted) transition-colors duration-150 hover:text-(--text)"
                value={dark}
                onToggle={() => setDark((value) => !value)}
                light={t("landing.darkModeOn", "Passer en clair")}
                dark={t("landing.darkModeOff", "Passer en sombre")}
              />

              <a
                href="/login"
                className="hidden h-9 items-center rounded-md bg-(--brand) px-4 text-sm font-medium text-[#f3efe3] transition-colors duration-150 hover:bg-(--brand-strong) sm:flex"
              >
                {t("landing.navLogin", "Se connecter")}
              </a>

              <button
                onClick={() => setMobileOpen((open) => !open)}
                className="flex h-9 w-9 items-center justify-center rounded-md text-(--text-muted) md:hidden"
                aria-label="Menu"
              >
                <FontAwesomeIcon icon={mobileOpen ? faXmark : faBars} className="h-4 w-4" />
              </button>
            </div>
          </div>

          {mobileOpen && (
            <div className="border-t border-(--border) bg-(--bg) px-5 py-3 md:hidden">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block border-b border-(--border) py-3 text-sm text-(--text-muted) last:border-b-0"
                >
                  {link.label}
                </a>
              ))}
            </div>
          )}
        </header>

        <main>
          <section id="top" className="border-b border-(--border)">
            <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:py-24">
              <div className="grid gap-12 lg:grid-cols-[0.88fr_1.12fr] lg:items-start">
                <div className="max-w-xl lg:pt-10">
                  <p className="text-xs font-medium uppercase tracking-[0.16em] text-(--brand)/70">
                    {t("landing.heroBadge", "Pensé pour les madrasas")}
                  </p>

                  <p className="mt-6 font-serif text-xl leading-relaxed text-(--brand)/80 sm:text-2xl">
                    {t(
                      "landing.heroAyah",
                      "وَلَقَدْ يَسَّرْنَا الْقُرْآنَ لِلذِّكْرِ فَهَلْ مِن مُّدَّكِرٍ",
                    )}
                  </p>

                  <p className="mt-2 text-[11px] text-(--text-muted)">
                    {t("landing.heroAyahRef", "Al-Qamar · 54:17")}
                  </p>

                  <h1 className="mt-8 text-4xl font-semibold leading-[1.05] tracking-[-0.04em] text-(--text) sm:text-5xl lg:text-[3.75rem]">
                    {t("landing.heroTitle1", "Le suivi du Coran,")}{" "}
                    <span className="text-(--brand)">
                      {t("landing.heroTitle2", "enfin simple.")}
                    </span>
                  </h1>

                  <p className="mt-6 max-w-lg text-base leading-7 text-(--text-muted)">
                    {t(
                      "landing.heroText",
                      "Kottabi réunit la présence, la leçon du jour, la mémorisation et les concours dans un seul endroit — lisible par la direction, les enseignants et les familles.",
                    )}
                  </p>

                  <div className="mt-8 flex flex-wrap items-center gap-3">
                    <a
                      href="/login"
                      className="inline-flex h-10 items-center gap-2 rounded-md bg-(--brand) px-5 text-sm font-medium text-[#f3efe3] transition-colors duration-150 hover:bg-(--brand-strong)"
                    >
                      {t("landing.heroCtaPrimary", "Essayer gratuitement")}
                      <FontAwesomeIcon icon={faArrowRight} className="h-3.5 w-3.5 rtl:rotate-180" />
                    </a>

                    <a
                      href="#product"
                      className="inline-flex h-10 items-center rounded-md border border-(--border) px-5 text-sm text-(--text-muted) transition-colors duration-150 hover:text-(--text)"
                    >
                      {t("landing.heroCtaSecondary", "Voir la démo")}
                    </a>
                  </div>

                  <p className="mt-4 text-xs text-(--text-muted)">
                    {t("landing.heroFree", "Gratuit. Sans carte bancaire, sans engagement.")}
                  </p>
                </div>

                <div id="product" className="scroll-mt-24">
                  <div className="border border-(--border) bg-(--surface)">
                    <div className="flex items-center justify-between border-b border-(--border) px-4 py-3">
                      <div className="text-xs font-medium text-(--text)">
                        {t("landing.demoTitle", "Classe A — cette semaine")}
                      </div>
                      <div className="text-[11px] text-(--text-muted)">
                        {t("landing.demoToday", "Aujourd'hui · samedi")}
                      </div>
                    </div>

                    <div className="grid min-h-[430px] sm:grid-cols-[56px_1fr]">
                      <div className="hidden border-e border-(--border) py-5 sm:block">
                        <div className="flex flex-col items-center gap-4">
                          {[faChildren, faCalendarCheck, faBookQuran, faTrophy, faFileLines].map((icon, index) => (
                            <div
                              key={index}
                              className={`flex h-8 w-8 items-center justify-center rounded-md ${
                                index === 0
                                  ? "bg-(--brand) text-(--accent)"
                                  : "text-(--text-muted)"
                              }`}
                            >
                              <FontAwesomeIcon icon={icon} className="h-3.5 w-3.5" />
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="p-5 sm:p-7">
                        <div className="grid gap-6 md:grid-cols-[1fr_130px]">
                          <div>
                            <div className="text-xs text-(--text-muted)">
                              {t("landing.demoPresence", "Présence aujourd'hui")}
                            </div>
                            <div className="mt-1 text-3xl font-semibold tracking-tight text-(--text)">
                              24/25
                            </div>
                          </div>

                          <div className="flex h-16 items-end gap-1.5">
                            {week.map((bar, index) => (
                              <span
                                key={index}
                                style={{ height: `${bar}%` }}
                                className={`flex-1 ${
                                  index === week.length - 1
                                    ? "bg-(--brand)"
                                    : "bg-(--brand)/15"
                                }`}
                              />
                            ))}
                          </div>
                        </div>

                        <div className="mt-7 border-t border-(--border)">
                          {[
                            {
                              name: t("landing.demoRow1Name", "Youssef Ben Salah"),
                              lesson: t("landing.demoRow1Lesson", "Nouvelle leçon · Sourate Al-Baqarah"),
                              state: t("landing.demoStatePass", "Pass"),
                              color: "text-(--ok)",
                            },
                            {
                              name: t("landing.demoRow2Name", "Bilal Khaled"),
                              lesson: t("landing.demoRow2Lesson", "Révision · Page 391 – 393"),
                              state: t("landing.demoStateReview", "À refaire demain"),
                              color: "text-(--warn)",
                            },
                            {
                              name: t("landing.demoRow3Name", "Amina Ali"),
                              lesson: t("landing.demoRow3Lesson", "Rappel · Juz 1 – 5"),
                              state: t("landing.demoStatePending", "En attente"),
                              color: "text-(--text-muted)",
                            },
                          ].map((row) => (
                            <div
                              key={row.name}
                              className="grid gap-2 border-b border-(--border) py-4 sm:grid-cols-[1fr_auto] sm:items-center"
                            >
                              <div>
                                <div className="text-sm font-medium text-(--text)">
                                  {row.name}
                                </div>
                                <div className="mt-1 text-xs text-(--text-muted)">
                                  {row.lesson}
                                </div>
                              </div>

                              <div className={`text-xs font-medium ${row.color}`}>
                                {row.state}
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="mt-7 grid grid-cols-3 border border-(--border)">
                          {[
                            ["14", t("landing.f2Title", "Mémorisation")],
                            ["3", t("landing.f4Title", "Concours")],
                            ["6", t("landing.f5Title", "Rapports")],
                          ].map(([value, label], index) => (
                            <div
                              key={label}
                              className={`px-3 py-4 ${index !== 2 ? "border-e border-(--border)" : ""}`}
                            >
                              <div className="text-lg font-semibold text-(--text)">{value}</div>
                              <div className="mt-1 text-[10px] leading-4 text-(--text-muted)">{label}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="border-b border-(--border)">
            <div className="mx-auto grid max-w-7xl grid-cols-2 px-5 sm:px-8 lg:grid-cols-4">
              {numbers.map((item, index) => (
                <div
                  key={item.label}
                  className={`py-7 ${index < 3 ? "lg:border-e" : ""} border-(--border) lg:px-7`}
                >
                  <div className="text-2xl font-semibold text-(--brand)">{item.value}</div>
                  <div className="mt-1 text-xs text-(--text-muted)">{item.label}</div>
                </div>
              ))}
            </div>
          </section>

          <section id="features" className="scroll-mt-24 py-20 lg:py-24">
            <div className="mx-auto max-w-7xl px-5 sm:px-8">
              <div className="grid gap-12 lg:grid-cols-[0.65fr_1.35fr]">
                <div className="max-w-sm">
                  <p className="text-xs font-medium uppercase tracking-[0.16em] text-(--brand)/70">
                    {t("landing.featuresEyebrow", "Ce que fait Kottabi")}
                  </p>
                  <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-[-0.025em] text-(--text)">
                    {t("landing.featuresTitle", "Le nécessaire, bien fait.")}
                  </h2>
                  <p className="mt-4 text-sm leading-6 text-(--text-muted)">
                    {t("landing.featuresText", "Six outils, tous utiles chaque jour.")}
                  </p>
                </div>

                <div className="border-t border-(--border)">
                  {features.map((feature, index) => (
                    <div
                      key={feature.title}
                      className="grid gap-3 border-b border-(--border) py-5 sm:grid-cols-[40px_180px_1fr] sm:items-center"
                    >
                      <div className="flex h-8 w-8 items-center justify-center text-(--brand)">
                        <FontAwesomeIcon icon={feature.icon} className="h-4 w-4" />
                      </div>
                      <div className="text-sm font-medium text-(--text)">
                        {feature.title}
                      </div>
                      <div className="text-sm leading-6 text-(--text-muted)">
                        {feature.desc}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section id="roles" className="scroll-mt-24 border-y border-(--border) bg-(--surface) py-20 lg:py-24">
            <div className="mx-auto max-w-7xl px-5 sm:px-8">
              <div className="max-w-xl">
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-(--brand)/70">
                  {t("landing.rolesEyebrow", "Pour chaque métier de l'école")}
                </p>
                <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-[-0.025em] text-(--text)">
                  {t("landing.rolesTitle", "Chacun fait son travail, Kottabi s'occupe du reste.")}
                </h2>
              </div>

              <div className="mt-10 grid gap-px overflow-hidden border border-(--border) bg-(--border) lg:grid-cols-3">
                {roles.map((role) => (
                  <article key={role.title} className="bg-(--bg) p-6">
                    <div className="flex items-center gap-3">
                      <FontAwesomeIcon icon={role.icon} className="h-4 w-4 text-(--brand)" />
                      <h3 className="text-sm font-semibold text-(--text)">{role.title}</h3>
                    </div>

                    <p className="mt-4 text-sm leading-6 text-(--text-muted)">
                      {role.desc}
                    </p>

                    <ul className="mt-6 space-y-3">
                      {role.points.map((point) => (
                        <li key={point} className="flex items-start gap-3 text-sm leading-6 text-(--text-muted)">
                          <FontAwesomeIcon icon={faCheck} className="mt-1.5 h-3 w-3 shrink-0 text-(--brand)/60" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section id="story" className="scroll-mt-24 py-20 lg:py-24">
            <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-[1fr_0.75fr]">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-(--brand)/70">
                  {t("landing.founderEyebrow", "Pourquoi j'ai construit Kottabi")}
                </p>

                <p className="mt-6 max-w-3xl font-serif text-xl leading-9 text-(--text)">
                  {t(
                    "landing.founderText",
                    "L'école tenait dans les registres de mon père : un cahier d'écolier relié de fil, où se mêlaient les prénoms des enfants, la sourate du jour et les absences de la semaine. Les années ont passé, les cahiers non. Kottabi est né de ce cahier — je l'ai seulement rendu lisible pour toutes les mains qui en ont besoin : les enseignants, la direction et les familles.",
                  )}
                </p>

                <div className="mt-7">
                  <div className="text-sm font-medium text-(--text)">
                    {t("landing.founderName", "Cheikh Ahmed El-Fassi")}
                  </div>
                  <div className="mt-1 text-xs text-(--text-muted)">
                    {t("landing.founderRole", "Directeur — fondateur de Kottabi")}
                  </div>
                </div>
              </div>

              <div className="border-s border-(--border) ps-6 lg:ps-8">
                <div className="text-5xl leading-none text-(--accent)">“</div>
                <blockquote className="mt-2 font-serif text-lg italic leading-8 text-(--text-muted)">
                  {t(
                    "landing.testimonialQuote",
                    "Avant, je notais tout dans un cahier et je refaisais les comptes le dimanche. Aujourd'hui, je m'occupe des enfants au lieu de la paperasse.",
                  )}
                </blockquote>

                <div className="mt-6 text-sm font-medium text-(--text)">
                  {t("landing.testimonialName", "Khaled Ben Amor")}
                </div>
                <div className="mt-1 text-xs text-(--text-muted)">
                  {t("landing.testimonialRole", "Enseignant — classe des 8 à 12 ans")}
                </div>
              </div>
            </div>
          </section>

          <section id="cta" className="border-t border-(--border)">
            <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8">
              <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
                <div className="max-w-2xl">
                  <h2 className="text-2xl font-semibold tracking-[-0.02em] text-(--text)">
                    {t("landing.ctaTitle", "Essayez avec votre école, c'est gratuit.")}
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-(--text-muted)">
                    {t(
                      "landing.ctaText",
                      "Nous ouvrons tout, sans carte et sans engagement. Si ça vous sert la première semaine, ça vous servira toute l'année.",
                    )}
                  </p>
                </div>

                <a
                  href="/login"
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-(--brand) px-5 text-sm font-medium text-[#f3efe3] transition-colors duration-150 hover:bg-(--brand-strong)"
                >
                  {t("landing.ctaButton", "Se connecter")}
                  <FontAwesomeIcon icon={faArrowRight} className="h-3.5 w-3.5 rtl:rotate-180" />
                </a>
              </div>
            </div>
          </section>
        </main>

        <footer className="bg-[#0a2e22] py-9 text-[#eff2ec]/65">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <div className="flex items-center gap-2 text-white">
                  <FontAwesomeIcon icon={faBookQuran} className="h-4 w-4 text-[#c79a3b]" />
                  <span className="text-sm font-semibold">Kottabi</span>
                </div>
                <p className="mt-2 text-xs">
                  {t("landing.footerTagline", "Le cahier des écoles coraniques, tenu avec soin.")}
                </p>
              </div>

              <a href="mailto:contact@kottabi.org" className="text-xs hover:text-white">
                contact@kottabi.org
              </a>
            </div>

            <div className="mt-7 border-t border-white/10 pt-5 text-[11px] text-[#eff2ec]/40">
              © {new Date().getFullYear()} Kottabi — {t("landing.footerRights", "Tous droits réservés.")}
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default Landing;
