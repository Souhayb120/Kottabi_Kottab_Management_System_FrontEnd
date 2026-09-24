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
  faCircleCheck,
  faFileLines,
  faGear,
  faGlobe,
  faMagnifyingGlass,
  faStarAndCrescent,
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
    { href: "#roles", label: t("landing.navRoles", "Pour qui") },
    { href: "#features", label: t("landing.navFeatures", "Fonctionnalités") },
    { href: "#story", label: t("landing.navStory", "L'histoire") },
  ];

  const sidebarIcons = [
    faStarAndCrescent,
    faChildren,
    faBookQuran,
    faTrophy,
    faFileLines,
    faGear,
  ];

  const roles = [
    {
      icon: faUserShield,
      title: t("landing.roleAdminTitle", "La direction"),
      desc: t(
        "landing.roleAdminDesc",
        "Toute l'école en un écran, sans recompter les cahiers.",
      ),
      points: [
        t("landing.roleAdmin1", "Créer les comptes, les classes et les niveaux"),
        t("landing.roleAdmin2", "Répartir les enseignants"),
        t("landing.roleAdmin3", "Ouvrir les rapports du trimestre"),
      ],
    },
    {
      icon: faChalkboardUser,
      title: t("landing.roleTeacherTitle", "Les enseignants"),
      desc: t(
        "landing.roleTeacherDesc",
        "Trente secondes par élève, puis on revient à l'enseignement.",
      ),
      points: [
        t("landing.roleTeacher1", "Pointer la présence du matin"),
        t(
          "landing.roleTeacher2",
          "Noter la leçon du jour et sa difficulté",
        ),
        t(
          "landing.roleTeacher3",
          "Envoyer un mot à la famille, sans rendez-vous",
        ),
      ],
    },
    {
      icon: faBookQuran,
      title: t("landing.roleParentTitle", "Les familles"),
      desc: t(
        "landing.roleParentDesc",
        "Suivre de loin, sans bruit, l'essentiel seulement.",
      ),
      points: [
        t("landing.roleParent1", "Voir la leçon du jour"),
        t("landing.roleParent2", "Recevoir le bilan du trimestre"),
        t(
          "landing.roleParent3",
          "Encourager une réussite, le jour même",
        ),
      ],
    },
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
      desc: t(
        "landing.f2Desc",
        "Sourates, versets, et degré de difficulté.",
      ),
    },
    {
      icon: faChildren,
      title: t("landing.f3Title", "Les fiches élèves"),
      desc: t(
        "landing.f3Desc",
        "Coordonnées, naissance, et historique complet.",
      ),
    },
    {
      icon: faTrophy,
      title: t("landing.f4Title", "Les concours"),
      desc: t("landing.f4Desc", "Inscription, notes, classement."),
    },
    {
      icon: faFileLines,
      title: t("landing.f5Title", "Les rapports"),
      desc: t(
        "landing.f5Desc",
        "Un bilan simple, envoyé aux familles.",
      ),
    },
    {
      icon: faMagnifyingGlass,
      title: t("landing.f6Title", "La recherche"),
      desc: t(
        "landing.f6Desc",
        "Retrouver un élève par son nom, immédiatement.",
      ),
    },
  ];

  const numbers = [
    { value: "120", label: t("landing.count1Label", "élèves suivis") },
    { value: "12", label: t("landing.count2Label", "enseignants") },
    { value: "8", label: t("landing.count3Label", "concours organisés") },
    {
      value: "1",
      label: t(
        "landing.count4Label",
        "rapport remis chaque trimestre",
      ),
    },
  ];

  const week = [40, 68, 52, 90, 62, 80, 66];

  return (
    <div className={dark ? "dark" : undefined}>
      <div className="min-h-screen bg-(--bg) text-(--text) transition-colors duration-300">
        <header className="sticky top-0 z-50 border-b border-(--border) bg-(--bg)/95 backdrop-blur-md">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
            <a href="#top" className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-md bg-(--brand)">
                <FontAwesomeIcon
                  icon={faBookQuran}
                  className="h-4 w-4 text-(--accent)"
                />
              </span>
              <span className="text-base font-semibold tracking-tight text-(--text)">
                Kottabi
              </span>
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
                className="flex h-9 items-center gap-1.5 rounded-md border border-(--border) px-3 text-xs font-medium text-(--text-muted) transition-colors duration-150 hover:border-(--brand)/35 hover:text-(--text)"
              >
                <FontAwesomeIcon icon={faGlobe} className="h-3.5 w-3.5" />
                {isAr ? "FR" : "عربي"}
              </button>

              <ThemeToggle
                className="flex h-9 w-9 items-center justify-center rounded-md border border-(--border) text-(--text-muted) transition-colors duration-150 hover:border-(--brand)/35 hover:text-(--text)"
                value={dark}
                onToggle={() => setDark((value) => !value)}
                light={t("landing.darkModeOn", "Passer en clair")}
                dark={t("landing.darkModeOff", "Passer en sombre")}
              />

              <a
                href="#cta"
                className="hidden h-9 items-center rounded-md bg-(--brand) px-4 text-sm font-medium text-[#f3efe3] transition-colors duration-150 hover:bg-(--brand-strong) sm:flex"
              >
                {t("landing.navLogin", "Se connecter")}
              </a>

              <button
                onClick={() => setMobileOpen((open) => !open)}
                className="flex h-9 w-9 items-center justify-center rounded-md text-(--text-muted) transition-colors hover:bg-(--surface) md:hidden"
                aria-label="Menu"
              >
                <FontAwesomeIcon
                  icon={mobileOpen ? faXmark : faBars}
                  className="h-4 w-4"
                />
              </button>
            </div>
          </div>

          {mobileOpen && (
            <nav className="border-t border-(--border) bg-(--bg) px-5 py-3 md:hidden">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block border-b border-(--border) py-3 text-sm text-(--text-muted) last:border-0"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          )}
        </header>

        <main>
          <section id="top" className="border-b border-(--border)">
            <div className="mx-auto grid max-w-7xl gap-14 px-5 py-16 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:py-24">
              <div className="max-w-xl">
                <div className="mb-8 flex items-center gap-3 text-xs font-medium text-(--text-muted)">
                  <span className="h-px w-8 bg-(--accent)" />
                  {t("landing.heroBadge", "Pensé pour les madrasas")}
                </div>

                <p className="font-serif text-xl leading-relaxed text-(--brand)/80 sm:text-2xl">
                  {t(
                    "landing.heroAyah",
                    "وَلَقَدْ يَسَّرْنَا الْقُرْآنَ لِلذِّكْرِ فَهَلْ مِن مُّدَّكِرٍ",
                  )}
                </p>

                <p className="mt-2 text-[11px] tracking-[0.18em] text-(--text-muted)">
                  {t("landing.heroAyahRef", "Al-Qamar · 54:17")}
                </p>

                <h1 className="mt-8 max-w-2xl text-4xl font-semibold leading-[1.08] tracking-[-0.035em] text-(--text) sm:text-5xl lg:text-[3.55rem]">
                  {t("landing.heroTitle1", "Le suivi du Coran,")}{" "}
                  <span className="text-(--brand)">
                    {t("landing.heroTitle2", "enfin simple.")}
                  </span>
                </h1>

                <p className="mt-6 max-w-xl text-base leading-7 text-(--text-muted)">
                  {t(
                    "landing.heroText",
                    "Kottabi réunit la présence, la leçon du jour, la mémorisation et les concours dans un seul endroit — lisible par la direction, les enseignants et les familles.",
                  )}
                </p>

                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <a
                    href="#cta"
                    className="inline-flex h-10 items-center gap-2 rounded-md bg-(--brand) px-5 text-sm font-medium text-[#f3efe3] transition-colors duration-150 hover:bg-(--brand-strong)"
                  >
                    {t("landing.heroCtaPrimary", "Essayer gratuitement")}
                    <FontAwesomeIcon
                      icon={faArrowRight}
                      className="h-3.5 w-3.5 rtl:rotate-180"
                    />
                  </a>

                  <a
                    href="#demo"
                    className="inline-flex h-10 items-center rounded-md border border-(--border) px-5 text-sm font-medium text-(--text-muted) transition-colors duration-150 hover:border-(--brand)/35 hover:text-(--text)"
                  >
                    {t("landing.heroCtaSecondary", "Voir la démo")}
                  </a>
                </div>

                <p className="mt-4 text-xs text-(--text-muted)">
                  {t(
                    "landing.heroFree",
                    "Gratuit. Sans carte bancaire, sans engagement.",
                  )}
                </p>
              </div>

              <div id="demo" className="scroll-mt-24">
                <div className="overflow-hidden rounded-lg border border-(--border) bg-(--surface) shadow-(--shadow-sm)">
                  <div className="flex items-center border-b border-(--border) px-4 py-3">
                    <div className="flex min-w-0 flex-1 items-center gap-2 text-[11px] text-(--text-muted)">
                      <FontAwesomeIcon
                        icon={faMagnifyingGlass}
                        className="h-3 w-3"
                      />
                      <span className="truncate">app.kottabi.org</span>
                    </div>
                  </div>

                  <div className="flex min-h-[380px]">
                    <aside className="hidden w-14 shrink-0 border-e border-(--border) py-5 sm:block">
                      <div className="flex flex-col items-center gap-3">
                        {sidebarIcons.map((icon, index) => (
                          <span
                            key={index}
                            className={`flex h-8 w-8 items-center justify-center rounded-md ${
                              index === 1
                                ? "bg-(--brand) text-(--accent)"
                                : "text-(--text-muted)"
                            }`}
                          >
                            <FontAwesomeIcon
                              icon={icon}
                              className="h-3.5 w-3.5"
                            />
                          </span>
                        ))}
                      </div>
                    </aside>

                    <div className="flex-1 p-5 sm:p-7">
                      <div className="flex items-start justify-between gap-4 border-b border-(--border) pb-5">
                        <div>
                          <p className="text-xs text-(--text-muted)">
                            {t(
                              "landing.demoToday",
                              "Aujourd'hui · samedi",
                            )}
                          </p>
                          <h2 className="mt-1 text-base font-semibold text-(--text)">
                            {t(
                              "landing.demoTitle",
                              "Classe A — cette semaine",
                            )}
                          </h2>
                        </div>

                        <div className="text-end">
                          <div className="text-xl font-semibold text-(--brand)">
                            24/25
                          </div>
                          <div className="mt-0.5 text-[11px] text-(--text-muted)">
                            {t(
                              "landing.demoPresence",
                              "Présence aujourd'hui",
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="mt-6">
                        <div className="flex h-20 items-end gap-2 border-b border-(--border) px-1 pb-1">
                          {week.map((bar, index) => (
                            <span
                              key={index}
                              style={{ height: `${bar}%` }}
                              className={`flex-1 rounded-t-sm ${
                                index === week.length - 1
                                  ? "bg-(--brand)"
                                  : "bg-(--brand)/15"
                              }`}
                            />
                          ))}
                        </div>
                      </div>

                      <div className="mt-6 divide-y divide-(--border)">
                        {[
                          {
                            name: t(
                              "landing.demoRow1Name",
                              "Youssef Ben Salah",
                            ),
                            lesson: t(
                              "landing.demoRow1Lesson",
                              "Nouvelle leçon · Sourate Al-Baqarah",
                            ),
                            state: t(
                              "landing.demoStatePass",
                              "Pass",
                            ),
                            chip: "text-(--ok)",
                            dot: "bg-(--ok)",
                          },
                          {
                            name: t(
                              "landing.demoRow2Name",
                              "Bilal Khaled",
                            ),
                            lesson: t(
                              "landing.demoRow2Lesson",
                              "Révision · Page 391 – 393",
                            ),
                            state: t(
                              "landing.demoStateReview",
                              "À refaire demain",
                            ),
                            chip: "text-(--warn)",
                            dot: "bg-(--warn)",
                          },
                          {
                            name: t(
                              "landing.demoRow3Name",
                              "Amina Ali",
                            ),
                            lesson: t(
                              "landing.demoRow3Lesson",
                              "Rappel · Juz 1 – 5",
                            ),
                            state: t(
                              "landing.demoStatePending",
                              "En attente",
                            ),
                            chip: "text-(--text-muted)",
                            dot: "bg-(--border)",
                          },
                        ].map((row) => (
                          <div
                            key={row.name}
                            className="flex items-center gap-3 py-3.5"
                          >
                            <span
                              className={`h-1.5 w-1.5 shrink-0 rounded-full ${row.dot}`}
                            />
                            <div className="min-w-0 flex-1">
                              <div className="truncate text-xs font-medium text-(--text)">
                                {row.name}
                              </div>
                              <div className="mt-0.5 truncate text-[11px] text-(--text-muted)">
                                {row.lesson}
                              </div>
                            </div>
                            <span
                              className={`shrink-0 text-[11px] font-medium ${row.chip}`}
                            >
                              {row.state}
                            </span>
                          </div>
                        ))}
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
                  className={`py-8 ${
                    index % 2 === 0 ? "pe-5" : "ps-5"
                  } border-(--border) lg:border-e lg:px-8 lg:last:border-e-0`}
                >
                  <div className="font-serif text-3xl font-semibold text-(--brand)">
                    {item.value}
                  </div>
                  <div className="mt-1.5 max-w-[150px] text-xs leading-5 text-(--text-muted)">
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section
            id="roles"
            className="scroll-mt-24 border-b border-(--border) py-20 lg:py-24"
          >
            <div className="mx-auto max-w-7xl px-5 sm:px-8">
              <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr]">
                <div className="max-w-md">
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-(--brand)/65">
                    {t(
                      "landing.rolesEyebrow",
                      "Pour chaque métier de l'école",
                    )}
                  </p>
                  <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-[-0.025em] text-(--text) sm:text-4xl">
                    {t(
                      "landing.rolesTitle",
                      "Chacun fait son travail, Kottabi s'occupe du reste.",
                    )}
                  </h2>
                </div>

                <div className="divide-y divide-(--border) border-y border-(--border)">
                  {roles.map((role) => (
                    <article
                      key={role.title}
                      className="grid gap-5 py-7 sm:grid-cols-[180px_1fr]"
                    >
                      <div>
                        <div className="flex h-9 w-9 items-center justify-center rounded-md border border-(--border) text-(--brand)">
                          <FontAwesomeIcon
                            icon={role.icon}
                            className="h-4 w-4"
                          />
                        </div>
                        <h3 className="mt-3 font-semibold text-(--text)">
                          {role.title}
                        </h3>
                        <p className="mt-1 text-sm leading-6 text-(--text-muted)">
                          {role.desc}
                        </p>
                      </div>

                      <ul className="space-y-3 sm:pt-1">
                        {role.points.map((point) => (
                          <li
                            key={point}
                            className="flex items-start gap-3 text-sm leading-6 text-(--text-muted)"
                          >
                            <FontAwesomeIcon
                              icon={faCheck}
                              className="mt-1 h-3 w-3 shrink-0 text-(--brand)/65"
                            />
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section
            id="features"
            className="scroll-mt-24 border-b border-(--border) bg-(--surface) py-20 lg:py-24"
          >
            <div className="mx-auto max-w-7xl px-5 sm:px-8">
              <div className="flex flex-col gap-5 border-b border-(--border) pb-8 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-(--brand)/65">
                    {t(
                      "landing.featuresEyebrow",
                      "Ce que fait Kottabi",
                    )}
                  </p>
                  <h2 className="mt-3 text-3xl font-semibold tracking-[-0.025em] text-(--text) sm:text-4xl">
                    {t(
                      "landing.featuresTitle",
                      "Le nécessaire, bien fait.",
                    )}
                  </h2>
                </div>
                <p className="max-w-sm text-sm leading-6 text-(--text-muted)">
                  {t(
                    "landing.featuresText",
                    "Six outils, tous utiles chaque jour.",
                  )}
                </p>
              </div>

              <div className="grid md:grid-cols-2">
                {features.map((feature, index) => (
                  <article
                    key={feature.title}
                    className={`flex gap-4 border-(--border) py-6 ${
                      index < features.length - 2
                        ? "border-b"
                        : ""
                    } ${
                      index % 2 === 0
                        ? "md:border-e md:pe-8"
                        : "md:ps-8"
                    }`}
                  >
                    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-(--border) text-(--brand)">
                      <FontAwesomeIcon
                        icon={feature.icon}
                        className="h-3.5 w-3.5"
                      />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-(--text)">
                        {feature.title}
                      </h3>
                      <p className="mt-1 text-sm leading-6 text-(--text-muted)">
                        {feature.desc}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section
            id="story"
            className="scroll-mt-24 border-b border-(--border) py-20 lg:py-24"
          >
            <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="max-w-2xl">
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-(--brand)/65">
                  {t(
                    "landing.founderEyebrow",
                    "Pourquoi j'ai construit Kottabi",
                  )}
                </p>

                <p className="mt-6 font-serif text-xl leading-9 text-(--text)">
                  {t(
                    "landing.founderText",
                    "L'école tenait dans les registres de mon père : un cahier d'écolier relié de fil, où se mêlaient les prénoms des enfants, la sourate du jour et les absences de la semaine. Les années ont passé, les cahiers non. Kottabi est né de ce cahier — je l'ai seulement rendu lisible pour toutes les mains qui en ont besoin : les enseignants, la direction et les familles.",
                  )}
                </p>

                <div className="mt-7 border-s-2 border-(--accent) ps-4">
                  <div className="font-medium text-(--text)">
                    {t(
                      "landing.founderName",
                      "Cheikh Ahmed El-Fassi",
                    )}
                  </div>
                  <div className="mt-1 text-sm text-(--text-muted)">
                    {t(
                      "landing.founderRole",
                      "Directeur — fondateur de Kottabi",
                    )}
                  </div>
                </div>
              </div>

              <figure className="self-end border-t border-(--border) pt-6 lg:border-s lg:border-t-0 lg:ps-10 lg:pt-0">
                <blockquote className="font-serif text-lg italic leading-8 text-(--text-muted)">
                  “
                  {t(
                    "landing.testimonialQuote",
                    "Avant, je notais tout dans un cahier et je refaisais les comptes le dimanche. Aujourd'hui, je m'occupe des enfants au lieu de la paperasse.",
                  )}
                  ”
                </blockquote>

                <figcaption className="mt-6">
                  <div className="text-sm font-semibold text-(--text)">
                    {t(
                      "landing.testimonialName",
                      "Khaled Ben Amor",
                    )}
                  </div>
                  <div className="mt-1 text-xs text-(--text-muted)">
                    {t(
                      "landing.testimonialRole",
                      "Enseignant — classe des 8 à 12 ans",
                    )}
                  </div>
                </figcaption>
              </figure>
            </div>
          </section>

          <section id="cta" className="scroll-mt-24 py-16 lg:py-20">
            <div className="mx-auto max-w-7xl px-5 sm:px-8">
              <div className="flex flex-col gap-8 border-y border-(--border) py-10 md:flex-row md:items-center md:justify-between">
                <div className="max-w-2xl">
                  <h2 className="text-2xl font-semibold tracking-[-0.02em] text-(--text) sm:text-3xl">
                    {t(
                      "landing.ctaTitle",
                      "Essayez avec votre école, c'est gratuit.",
                    )}
                  </h2>
                  <p className="mt-3 max-w-xl text-sm leading-6 text-(--text-muted)">
                    {t(
                      "landing.ctaText",
                      "Nous ouvrons tout, sans carte et sans engagement. Si ça vous sert la première semaine, ça vous servira toute l'année.",
                    )}
                  </p>
                </div>

                <a
                  href="/login"
                  className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-md bg-(--brand) px-5 text-sm font-medium text-[#f3efe3] transition-colors duration-150 hover:bg-(--brand-strong)"
                >
                  {t("landing.ctaButton", "Se connecter")}
                  <FontAwesomeIcon
                    icon={faArrowRight}
                    className="h-3.5 w-3.5 rtl:rotate-180"
                  />
                </a>
              </div>
            </div>
          </section>
        </main>

        <footer className="bg-[#0a2e22] py-10 text-[#eff2ec]/70">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <div className="grid gap-8 md:grid-cols-[1fr_1.4fr_1fr] md:items-center">
              <div className="flex items-center gap-3 text-white">
                <span className="flex h-8 w-8 items-center justify-center rounded-md border border-white/15">
                  <FontAwesomeIcon
                    icon={faBookQuran}
                    className="h-4 w-4 text-[#c79a3b]"
                  />
                </span>
                <span className="font-semibold">Kottabi</span>
              </div>

              <p className="text-sm leading-6 md:text-center">
                {t(
                  "landing.footerTagline",
                  "Le cahier des écoles coraniques, tenu avec soin.",
                )}
              </p>

              <a
                href="mailto:contact@kottabi.org"
                className="text-sm transition-colors hover:text-white md:text-end"
              >
                contact@kottabi.org
              </a>
            </div>

            <div className="mt-8 border-t border-white/10 pt-5 text-xs text-[#eff2ec]/45">
              © {new Date().getFullYear()} Kottabi —{" "}
              {t("landing.footerRights", "Tous droits réservés.")}
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default Landing;
