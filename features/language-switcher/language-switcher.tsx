"use client";

import { Globe } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/i18n/client";
import { languages } from "@/i18n/settings";
import { cn } from "@/utils/utils";

export function LanguageSwitcher({ lng }: { lng: string }) {
  const { t, i18n } = useTranslation(lng, "language_switcher");
  const router = useRouter();

  const handleLanguageChange = (language: string) => {
    i18n.changeLanguage(language);
    // Manually update the cookie before refreshing to ensure the server sees the new language
    // The useEffect in i18n/client.ts is too slow (runs after render) for immediate router.refresh()
    // biome-ignore lint/suspicious/noDocumentCookie: cookie needed for i18n immediate switch
    document.cookie = `i18next=${language};path=/`;
    // Since we are using cookie-based routing with rewrites, we need to refresh the page
    // to let the server rewrite the request to the new language folder
    router.refresh();
  };

  return (
    <div className={cn("flex flex-col gap-4 rounded-lg border p-4 shadow-sm")}>
      <div className="flex items-center gap-2">
        <Globe className="h-4 w-4" />
        <h2 className="font-semibold">{t("title")}</h2>
      </div>
      <p className="text-muted-foreground text-sm">{t("description")}</p>
      <div className="flex flex-wrap gap-2">
        {languages.map((language) => (
          <Button
            key={language}
            onClick={() => handleLanguageChange(language)}
            size="sm"
            variant={i18n.resolvedLanguage === language ? "default" : "outline"}
          >
            {t(`languages.${language}`)}
          </Button>
        ))}
      </div>
      <div className="mt-2 text-muted-foreground text-xs">
        {t("current_language")}:{" "}
        <span className="font-medium font-mono">{i18n.resolvedLanguage}</span>
      </div>
    </div>
  );
}
