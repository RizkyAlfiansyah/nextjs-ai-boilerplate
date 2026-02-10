"use client";

import { Globe } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { routing } from "@/i18n/routing";
import { cn } from "@/utils/utils";

export function LanguageSwitcher() {
  const t = useTranslations("LanguageSwitcher");
  const locale = useLocale();

  const handleLanguageChange = (language: string) => {
    // biome-ignore lint: Required for client-side locale switching
    document.cookie = `NEXT_LOCALE=${language}; path=/; max-age=31536000; SameSite=Lax`;
    globalThis.location.reload();
  };

  return (
    <div className={cn("flex flex-col gap-4 rounded-lg border p-4 shadow-sm")}>
      <div className="flex items-center gap-2">
        <Globe className="h-4 w-4" />
        <h2 className="font-semibold">{t("title")}</h2>
      </div>
      <p className="text-muted-foreground text-sm">{t("description")}</p>
      <div className="flex flex-wrap gap-2">
        {routing.locales.map((language) => (
          <Button
            key={language}
            onClick={() => handleLanguageChange(language)}
            size="sm"
            variant={locale === language ? "default" : "outline"}
          >
            {t(`languages.${language}`)}
          </Button>
        ))}
      </div>
      <div className="mt-2 text-muted-foreground text-xs">
        {t("current_language")}:{" "}
        <span className="font-medium font-mono">{locale}</span>
      </div>
    </div>
  );
}
