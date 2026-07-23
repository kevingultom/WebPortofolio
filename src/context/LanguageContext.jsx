import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { translations } from "../i18n/translations";

const STORAGE_KEY = "site-lang";

const LanguageContext = createContext(null);

const getInitialLang = () => {
  if (typeof window === "undefined") return "en";
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === "en" || stored === "id") return stored;
  return "en";
};

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(getInitialLang);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, lang);
    document.documentElement.lang = lang;
  }, [lang]);

  const toggleLanguage = useCallback(() => {
    setLang((prev) => (prev === "en" ? "id" : "en"));
  }, []);

  const value = {
    lang,
    setLang,
    toggleLanguage,
    t: translations[lang],
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return ctx;
};
