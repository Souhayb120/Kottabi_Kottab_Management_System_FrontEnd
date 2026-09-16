import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  fr: {
    translation: {
      register: {
        title: "Créer un compte",
        firstName: "Prénom",
        lastName: "Nom",
        email: "Email",
        password: "Mot de passe",
        submit: "S'inscrire",
      },

      login: {
        title: "Se connecter",
        subtitle: "Veuillez vous connecter à votre compte.",
        tagline: "Gestion des étudiants",
        quote: "La recherche du savoir est une obligation pour chaque musulman.",
        quoteSource: "TRADITION DE L'APPRENTISSAGE",
        username: "Nom d'utilisateur",
        password: "Mot de passe",
        submit: "Se connecter",
        forgotPassword: "Mot de passe oublié ?",
        rememberMe: "Se souvenir de moi",
        noAccount: "Vous n'avez pas de compte ?",
        contactAdmin: "Contacter l'administration",
        success: "Connexion réussie !",
        error: "Échec de la connexion.",
        rightsReserved: "Tous droits réservés.",
      },
    },
  },

  ar: {
    translation: {
      register: {
        title: "إنشاء حساب",
        firstName: "الاسم الشخصي",
        lastName: "النسب",
        email: "البريد الإلكتروني",
        password: "كلمة المرور",
        submit: "إنشاء الحساب",
      },

      login: {
        title: "تسجيل الدخول",
        subtitle: "يرجى تسجيل الدخول إلى حسابك.",
        tagline: "نظام إدارة كتابي للقرءان الكريم",
        quote: "يُقال لقارئ القرآن: اقرأ وارقَ، فإن منزلتك عند آخر آية تقرؤها",
        quoteSource: "رواه أبو داود والترمذي",
        username: "اسم المستخدم",
        password: "كلمة المرور",
        submit: "تسجيل الدخول",
        forgotPassword: "هل نسيت كلمة المرور؟",
        rememberMe: "تذكرني",
        noAccount: "ليس لديك حساب؟",
        contactAdmin: "تواصل مع الإدارة",
        success: "تم تسجيل الدخول بنجاح!",
        error: "فشل تسجيل الدخول.",
        rightsReserved: "جميع الحقوق محفوظة.",
      },
    },
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "ar",
    fallbackLng: "fr",
    interpolation: {
      escapeValue: false,
    },
  });

i18n.on("languageChanged", (lng) => {
  document.documentElement.dir = lng === "ar" ? "rtl" : "ltr";
  document.documentElement.lang = lng;
});

document.documentElement.dir = i18n.language === "ar" ? "rtl" : "ltr";
document.documentElement.lang = i18n.language;

export default i18n;