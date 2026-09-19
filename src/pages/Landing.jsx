import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ArrowRight,
  BookOpen,
  Check,
  CheckCircle2,
  FileText,
  Globe,
  GraduationCap,
  LayoutDashboard,
  Menu,
  Search,
  Settings,
  TrendingUp,
  Trophy,
  Users,
  X,
} from "lucide-react";
import ThemeToggle from "../components/ThemeToggle";

function Landing() {
  const { t, i18n } = useTranslation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dark, setDark] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches,
  );

  const isAr = i18n.language === "ar";
  const toggleLang = () => i18n.changeLanguage(isAr ? "fr" : "ar");

  const navLinks = [
    { href: "#roles", label: t("landing.navRoles", "Pour qui") },
    { href: "#features", label: t("landing.navFeatures", "Fonctionnalités") },
    { href: "#story", label: t("landing.navStory", "L'histoire") },
  ];

  const sidebarIcons = [LayoutDashboard, Users, TrendingUp, Trophy, FileText, Settings];

  const roles = [
    {
      icon: Users,
      title: t("landing.roleAdminTitle", "La direction"),
      desc: t("landing.roleAdminDesc", "Toute l'école en un écran, sans recompter les cahiers."),
      points: [
        t("landing.roleAdmin1", "Créer les comptes, les classes et les niveaux"),
        t("landing.roleAdmin2", "Répartir les enseignants"),
        t("landing.roleAdmin3", "Ouvrir les rapports du trimestre"),
      ],
    },
    {
      icon: GraduationCap,
      title: t("landing.roleTeacherTitle", "Les enseignants"),
      desc: t("landing.roleTeacherDesc", "Trente secondes par élève, puis on revient à l'enseignement."),
      points: [
        t("landing.roleTeacher1", "Pointer la présence du matin"),
        t("landing.roleTeacher2", "Noter la leçon du jour et sa difficulté"),
        t("landing.roleTeacher3", "Envoyer un mot à la famille, sans rendez-vous"),
      ],
    },
    {
      icon: BookOpen,
      title: t("landing.roleParentTitle", "Les familles"),
      desc: t("landing.roleParentDesc", "Suivre de loin, sans bruit, l'essentiel seulement."),
      points: [
        t("landing.roleParent1", "Voir la leçon du jour"),
        t("landing.roleParent2", "Recevoir le bilan du trimestre"),
        t("landing.roleParent3", "Encourager une réussite, le jour même"),
      ],
    },
  ];

  const features = [
    {
      icon: Check,
      title: t("landing.f1Title", "La présence"),
      desc: t("landing.f1Desc", "Le pointage du matin, en trente secondes."),
    },
    {
      icon: TrendingUp,
      title: t("landing.f2Title", "Le suivi de la mémorisation"),
      desc: t("landing.f2Desc", "Sourates, versets, et degré de difficulté."),
    },
    {
      icon: Users,
      title: t("landing.f3Title", "Les fiches élèves"),
      desc: t("landing.f3Desc", "Coordonnées, naissance, et historique complet."),
    },
    {
      icon: Trophy,
      title: t("landing.f4Title", "Les concours"),
      desc: t("landing.f4Desc", "Inscription, notes, classement."),
    },
    {
      icon: FileText,
      title: t("landing.f5Title", "Les rapports"),
      desc: t("landing.f5Desc", "Un bilan simple, envoyé aux familles."),
    },
    {
      icon: Search,
      title: t("landing.f6Title", "La recherche"),
      desc: t("landing.f6Desc", "Retrouver un élève par son nom, immédiatement."),
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
        <header className="sticky top-0 z-50 border-b border-(--border) bg-(--bg)/85 backdrop-blur-xl">
          <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
            <a href="#top" className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-(--brand) shadow-md shadow-(--brand)/20">
                <BookOpen className="h-5 w-5 text-(--accent)" />
              </span>
              <span className="text-lg font-bold tracking-tight text-(--brand)">Kottabi</span>
            </a>

            <nav className="hidden items-center gap-8 md:flex">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-(--text-muted) transition-colors hover:text-(--brand)"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            <div className="flex items-center gap-2.5">
              <button
                onClick={toggleLang}
                className="flex items-center gap-1.5 rounded-full border border-(--border) bg-(--surface) px-3 py-2 text-xs font-medium text-(--text-muted) transition-colors hover:text-(--brand)"
              >
                <Globe className="h-3.5 w-3.5" />
                {isAr ? "FR" : "عربي"}
              </button>

              <ThemeToggle
                className="rounded-full border border-(--border) bg-(--surface) p-2 text-(--text-muted) transition-colors hover:text-(--brand)"
                value={dark}
                onToggle={() => setDark((d) => !d)}
                light={t("landing.darkModeOn", "Passer en clair")}
                dark={t("landing.darkModeOff", "Passer en sombre")}
              />

              <a
                href="#cta"
                className="hidden items-center gap-1.5 rounded-full bg-(--brand) px-4 py-2 text-sm font-semibold text-[#f3efe3] transition-colors hover:bg-(--brand-strong) sm:flex"
              >
                {t("landing.navLogin", "Se connecter")}
              </a>

              <button
                onClick={() => setMobileOpen((open) => !open)}
                className="rounded-md p-2 text-(--text-muted) transition-colors hover:bg-(--border) md:hidden"
                aria-label="Menu"
              >
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {mobileOpen && (
            <nav className="border-t border-(--border) bg-(--bg) px-5 pb-4 pt-2 md:hidden">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-md px-3 py-2.5 text-sm text-(--text-muted) transition-colors hover:bg-(--border) hover:text-(--brand)"
                >
                  {link.label}
                </a>
              ))}
              <a
                href="#cta"
                onClick={() => setMobileOpen(false)}
                className="mt-1 flex items-center justify-center gap-1.5 rounded-full bg-(--brand) px-4 py-2.5 text-sm font-semibold text-[#f3efe3]"
              >
                {t("landing.navLogin", "Se connecter")}
              </a>
            </nav>
          )}
        </header>

        <section id="top">
          <div className="relative mx-auto max-w-6xl px-5 pb-20 pt-16 text-center sm:px-8 lg:pb-24 lg:pt-20">
            <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-(--border) bg-(--surface) px-3.5 py-1.5 text-xs font-medium text-(--text-muted) shadow-sm">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-(--brand)">
                <BookOpen className="h-3 w-3 text-(--accent)" />
              </span>
              {t("landing.heroBadge", "Pensé pour les madrasas")}
            </div>

            <p className="mt-9 font-serif text-2xl leading-relaxed text-(--brand)/80 sm:text-[1.7rem]">
              {t("landing.heroAyah", "وَلَقَدْ يَسَّرْنَا الْقُرْآنَ لِلذِّكْرِ فَهَلْ مِن مُّدَّكِرٍ")}
            </p>
            <p className="mt-2.5 text-[11px] uppercase tracking-[0.3em] text-(--brand)/50">
              {t("landing.heroAyahRef", "Al-Qamar · 54:17")}
            </p>

            <h1 className="mx-auto mt-7 max-w-3xl text-4xl font-bold leading-[1.08] tracking-tight text-(--text) sm:text-6xl">
              {t("landing.heroTitle1", "Le suivi du Coran,")}{" "}
              <span className="relative inline-block">
                {t("landing.heroTitle2", "enfin simple.")}
                <span className="absolute inset-x-0 -bottom-1.5 h-3 -rotate-1 rounded-sm bg-(--accent)/25" />
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-(--text-muted) sm:text-lg">
              {t(
                "landing.heroText",
                "Kottabi réunit la présence, la leçon du jour, la mémorisation et les concours dans un seul endroit — lisible par la direction, les enseignants et les familles.",
              )}
            </p>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <a
                href="#cta"
                className="inline-flex items-center gap-2 rounded-full bg-(--brand) px-8 py-3.5 text-sm font-semibold text-[#f3efe3] transition-colors hover:bg-(--brand-strong)"
              >
                {t("landing.heroCtaPrimary", "Essayer gratuitement")}
                <ArrowRight className="h-4 w-4 rtl:rotate-180" />
              </a>
              <a
                href="#demo"
                className="inline-flex items-center gap-2 rounded-full border border-(--border) bg-(--surface) px-8 py-3.5 text-sm font-semibold text-(--text-muted) transition-colors hover:border-(--brand)/40 hover:text-(--brand)"
              >
                {t("landing.heroCtaSecondary", "Voir la démo")}
              </a>
            </div>

            <p className="mt-5 text-xs text-(--text-muted)">
              {t("landing.heroFree", "Gratuit. Sans carte bancaire, sans engagement.")}
            </p>
          </div>

          <div id="demo" className="relative mx-auto max-w-5xl scroll-mt-24 px-5 pb-8 sm:px-8">
            <div className="relative overflow-hidden rounded-2xl border border-(--border) bg-(--surface) shadow-[0_24px_48px_-28px_rgba(10,46,34,0.35)]">
              <div className="flex items-center gap-2 border-b border-(--border) bg-(--surface-2) px-4 py-2.5">
                <div className="flex flex-1 items-center gap-2 rounded-lg bg-(--bg) px-3 py-1 text-[11px] text-(--text-muted)">
                  <Search className="h-3 w-3" />
                  app.kottabi.org
                </div>
              </div>

              <div className="flex">
                <div className="hidden w-14 shrink-0 flex-col items-center gap-4 border-e border-(--border) bg-(--surface-2) py-6 sm:flex">
                  {sidebarIcons.map((Icon, index) => (
                    <span
                      key={index}
                      className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
                        index === 1 ? "bg-(--brand) text-(--accent)" : "text-(--text-muted)"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </span>
                  ))}
                </div>

                <div className="flex-1 space-y-5 p-6">
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-sm font-semibold text-(--text)">
                      {t("landing.demoTitle", "Classe A — cette semaine")}
                    </div>
                    <span className="shrink-0 text-[11px] text-(--text-muted)">
                      {t("landing.demoToday", "Aujourd'hui · samedi")}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-3 rounded-xl bg-(--brand) px-4 py-3 text-[#f3efe3]">
                    <span className="flex items-center gap-2 text-xs font-medium">
                      <CheckCircle2 className="h-4 w-4 text-(--accent)" />
                      {t("landing.demoPresence", "Présence aujourd'hui")}
                    </span>
                    <span className="text-sm font-bold">24/25</span>
                  </div>

                  <div className="flex h-16 items-end gap-2 px-1">
                    {week.map((bar, index) => (
                      <span
                        key={index}
                        style={{ height: `${bar}%` }}
                        className={`flex-1 rounded-t-md transition-colors ${
                          index === week.length - 1
                            ? "bg-(--brand)"
                            : "bg-(--brand)/[0.16]"
                        }`}
                      />
                    ))}
                  </div>

                  <div className="space-y-2">
                    {[
                      {
                        name: t("landing.demoRow1Name", "Youssef Ben Salah"),
                        lesson: t("landing.demoRow1Lesson", "Nouvelle leçon · Sourate Al-Baqarah"),
                        state: t("landing.demoStatePass", "Pass"),
                        chip:
                          "bg-emerald-500/10 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300",
                        dot: "bg-emerald-500",
                      },
                      {
                        name: t("landing.demoRow2Name", "Bilal Khaled"),
                        lesson: t("landing.demoRow2Lesson", "Révision · Page 391 – 393"),
                        state: t("landing.demoStateReview", "À refaire demain"),
                        chip: "bg-amber-500/10 text-amber-700 dark:bg-amber-400/10 dark:text-amber-200",
                        dot: "bg-amber-500",
                      },
                      {
                        name: t("landing.demoRow3Name", "Amina Ali"),
                        lesson: t("landing.demoRow3Lesson", "Rappel · Juz 1 – 5"),
                        state: t("landing.demoStatePending", "En attente"),
                        chip: "bg-(--surface-2) text-(--text-muted)",
                        dot: "bg-(--border)",
                      },
                    ].map((row) => (
                      <div
                        key={row.name}
                        className="flex items-center gap-3 rounded-xl border border-(--border) bg-(--bg) px-4 py-3"
                      >
                        <span className={`h-2 w-2 shrink-0 rounded-full ${row.dot}`} />
                        <div className="min-w-0 flex-1">
                          <div className="truncate text-xs font-medium text-(--text)">{row.name}</div>
                          <div className="truncate text-[11px] text-(--text-muted)">{row.lesson}</div>
                        </div>
                        <span className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-medium ${row.chip}`}>
                          {row.state}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-(--border) bg-(--surface)">
          <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-5 py-12 sm:px-8 lg:grid-cols-4">
            {numbers.map((item) => (
              <div key={item.label} className="text-center">
                <div className="font-serif text-4xl font-semibold text-(--brand) lg:text-5xl">
                  {item.value}
                </div>
                <div className="mt-2 text-xs font-medium uppercase tracking-wider text-(--text-muted)">
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="roles" className="scroll-mt-24 bg-(--bg) py-20 lg:py-28">
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-(--brand)/60">
                {t("landing.rolesEyebrow", "Pour chaque métier de l'école")}
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-(--text) sm:text-4xl">
                {t("landing.rolesTitle", "Chacun fait son travail, Kottabi s'occupe du reste.")}
              </h2>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {roles.map((role) => (
                <div
                  key={role.title}
                  className="rounded-2xl border border-(--border) bg-(--surface) p-7 transition-colors hover:border-(--brand)/35"
                >
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-(--brand) text-(--accent)">
                    <role.icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-5 text-lg font-semibold text-(--text)">{role.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-(--text-muted)">{role.desc}</p>
                  <ul className="mt-6 space-y-3">
                    {role.points.map((point) => (
                      <li key={point} className="flex items-start gap-3 text-sm text-(--text-muted)">
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">
                          <Check className="h-3 w-3" />
                        </span>
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="features" className="scroll-mt-24 border-y border-(--border) bg-(--surface) py-20 lg:py-28">
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-(--brand)/60">
                {t("landing.featuresEyebrow", "Ce que fait Kottabi")}
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-(--text) sm:text-4xl">
                {t("landing.featuresTitle", "Le nécessaire, bien fait.")}
              </h2>
              <p className="mt-3 text-sm text-(--text-muted)">
                {t("landing.featuresText", "Six outils, tous utiles chaque jour.")}
              </p>
            </div>

            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="rounded-2xl border border-(--border) bg-(--bg) p-6 transition-colors hover:border-(--brand)/35"
                >
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-(--brand)/10 text-(--brand) transition-colors group-hover:bg-(--brand) group-hover:text-(--accent)">
                    <feature.icon className="h-4 w-4" />
                  </span>
                  <h3 className="mt-4 font-semibold text-(--text)">{feature.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-(--text-muted)">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="story" className="scroll-mt-24 bg-(--bg) py-20 lg:py-28">
          <div className="mx-auto grid max-w-6xl gap-12 px-5 sm:px-8 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-(--brand)/60">
                {t("landing.founderEyebrow", "Pourquoi j'ai construit Kottabi")}
              </p>
              <p className="mt-6 text-lg leading-relaxed text-(--text-muted) first-letter:float-start first-letter:me-2 first-letter:font-serif first-letter:text-6xl first-letter:font-bold first-letter:leading-[0.85] first-letter:text-(--brand)">
                {t(
                  "landing.founderText",
                  "L'école tenait dans les registres de mon père : un cahier d'écolier relié de fil, où se mêlaient les prénoms des enfants, la sourate du jour et les absences de la semaine. Les années ont passé, les cahiers non. Kottabi est né de ce cahier — je l'ai seulement rendu lisible pour toutes les mains qui en ont besoin : les enseignants, la direction et les familles.",
                )}
              </p>

              <div className="mt-8 flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-(--brand) text-sm font-bold text-(--accent)">
                  {t("landing.founderInitials", "A")}
                </span>
                <div>
                  <div className="font-semibold text-(--text)">
                    {t("landing.founderName", "Cheikh Ahmed El-Fassi")}
                  </div>
                  <div className="text-sm text-(--text-muted)">
                    {t("landing.founderRole", "Directeur — fondateur de Kottabi")}
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 lg:col-start-9">
              <figure className="rounded-2xl border border-(--border) bg-(--surface) p-8 shadow-xl shadow-(--brand)/5">
                <span aria-hidden className="font-serif text-5xl leading-none text-(--accent)">
                  “
                </span>
                <blockquote className="mt-3 font-serif text-lg italic leading-relaxed text-(--text-muted)">
                  {t(
                    "landing.testimonialQuote",
                    "Avant, je notais tout dans un cahier et je refaisais les comptes le dimanche. Aujourd'hui, je m'occupe des enfants au lieu de la paperasse.",
                  )}
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-3 border-t border-(--border) pt-5">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-(--surface-2) text-xs font-bold text-(--brand)">
                    {t("landing.testimonialInitials", "K")}
                  </span>
                  <div>
                    <div className="text-sm font-semibold text-(--text)">
                      {t("landing.testimonialName", "Khaled Ben Amor")}
                    </div>
                    <div className="text-xs text-(--text-muted)">
                      {t("landing.testimonialRole", "Enseignant — classe des 8 à 12 ans")}
                    </div>
                  </div>
                </figcaption>
              </figure>
            </div>
          </div>
        </section>

        <section id="cta" className="scroll-mt-24 bg-(--bg) pb-20 pt-4 lg:pb-28">
          <div className="mx-auto max-w-5xl px-5 sm:px-8">
            <div className="rounded-2xl bg-(--brand) px-8 py-16 text-center sm:px-14">
              <h2 className="text-3xl font-bold tracking-tight text-[#f3efe3] sm:text-4xl">
                {t("landing.ctaTitle", "Essayez avec votre école, c'est gratuit.")}
              </h2>
              <p className="mx-auto mt-4 max-w-xl leading-relaxed text-[#c6d3cb]">
                {t(
                  "landing.ctaText",
                  "Nous ouvrons tout, sans carte et sans engagement. Si ça vous sert la première semaine, ça vous servira toute l'année.",
                )}
              </p>
              <a
                href="/login"
                className="mt-9 inline-flex items-center gap-2 rounded-full bg-[#c79a3b] px-9 py-3.5 text-sm font-semibold text-[#241c08] transition-colors hover:bg-[#d4ab54]"
              >
                {t("landing.ctaButton", "Se connecter")}
                <ArrowRight className="h-4 w-4 rtl:rotate-180" />
              </a>
            </div>
          </div>
        </section>

        <footer className="bg-[#0a2e22] py-12 text-emerald-100/70">
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
              <div className="flex items-center gap-3 text-white">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10">
                  <BookOpen className="h-5 w-5 text-[#c79a3b]" />
                </span>
                <span className="text-lg font-bold tracking-tight">Kottabi</span>
              </div>

              <p className="text-center text-sm italic md:text-start">
                {t("landing.footerTagline", "Le cahier des écoles coraniques, tenu avec soin.")}
              </p>

              <a
                href="mailto:contact@kottabi.org"
                className="text-sm transition-colors hover:text-white"
              >
                contact@kottabi.org
              </a>
            </div>

            <div className="mt-9 border-t border-white/10 pt-6 text-center text-xs text-emerald-100/50">
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