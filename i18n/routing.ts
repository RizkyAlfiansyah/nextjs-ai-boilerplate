import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "zh", "es", "id"],
  defaultLocale: "en",
  localePrefix: "never",
});
