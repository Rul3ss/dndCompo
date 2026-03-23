import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Import modules mapping
import common_en from "./locales/en/common.json";
import common_pt from "./locales/pt/common.json";

import auth_en from "./locales/en/auth.json";
import auth_pt from "./locales/pt/auth.json";

import dashboard_en from "./locales/en/dashboard.json";
import dashboard_pt from "./locales/pt/dashboard.json";

import landing_en from "./locales/en/landing.json";
import landing_pt from "./locales/pt/landing.json";

import character_en from "./locales/en/character.json";
import character_pt from "./locales/pt/character.json";

export const defaultNS = "common";
export const resources = {
  en: {
    common: common_en,
    auth: auth_en,
    dashboard: dashboard_en,
    landing: landing_en,
    character: character_en,
  },
  pt: {
    common: common_pt,
    auth: auth_pt,
    dashboard: dashboard_pt,
    landing: landing_pt,
    character: character_pt,
  },
} as const;

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    defaultNS,
    fallbackLng: "en",
    supportedLngs: ["en", "pt"],
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },
  });

export default i18n;
