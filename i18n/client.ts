"use client";

import i18next from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import resourcesToBackend from "i18next-resources-to-backend";
import { useEffect, useState } from "react";
import {
  initReactI18next,
  type UseTranslationOptions,
  useTranslation as useTranslationOrg,
} from "react-i18next";
import { cookieName, getOptions, languages } from "./settings";

const runsOnServerSide = typeof window === "undefined";

// Initialize i18next for the client
i18next
  .use(initReactI18next)
  .use(LanguageDetector)
  .use(
    resourcesToBackend(
      (language: string, namespace: string) =>
        import(`./locales/${language}/${namespace}.json`)
    )
  )
  .init({
    ...getOptions(),
    lng: undefined, // let detect the language on client side
    detection: {
      order: ["path", "htmlTag", "cookie", "navigator"],
    },
    preload: runsOnServerSide ? languages : [],
  });

export function useTranslation(
  lng: string,
  ns = "translation",
  options?: UseTranslationOptions<string>
) {
  const ret = useTranslationOrg(ns, options);
  const { i18n } = ret;

  if (runsOnServerSide && lng && i18n.resolvedLanguage !== lng) {
    i18n.changeLanguage(lng);
  }

  const [activeLng, setActiveLng] = useState(i18n.resolvedLanguage);

  useEffect(() => {
    if (activeLng === i18n.resolvedLanguage) {
      return;
    }
    setActiveLng(i18n.resolvedLanguage);
  }, [activeLng, i18n.resolvedLanguage]);

  useEffect(() => {
    if (!lng || i18n.resolvedLanguage === lng) {
      return;
    }
    i18n.changeLanguage(lng);
  }, [lng, i18n]);

  useEffect(() => {
    if (typeof document !== "undefined") {
      const currentCookie = document.cookie
        .split("; ")
        .find((row) => row.startsWith(`${cookieName}=`))
        ?.split("=")[1];

      // If the cookie doesn't match the current resolved language, update it
      // This is crucial for cookie-based routing to work on the next reload
      if (currentCookie !== i18n.resolvedLanguage) {
        // biome-ignore lint/suspicious/noDocumentCookie: cookie needed for i18n
        document.cookie = `${cookieName}=${i18n.resolvedLanguage};path=/`;
      }
    }
  }, [i18n.resolvedLanguage]);

  return ret;
}
