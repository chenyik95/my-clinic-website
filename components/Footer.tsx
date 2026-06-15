"use client";

import { useTranslations } from "next-intl";

export function Footer() {
  const t = useTranslations("footer");
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border/50 bg-background py-12">
      <div className="container mx-auto px-6 text-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-y-6">
          <div>
            <div className="font-semibold tracking-tight text-secondary">Zen Pulse</div>
            <p className="mt-2 max-w-md text-text-secondary">{t("tagline")}</p>
          </div>

          <div className="text-text-secondary space-y-1 md:text-right">
            <div>{t("licensed")}</div>
            <div>{t("copyright").replace("{year}", String(year))}</div>
          </div>
        </div>
      </div>
    </footer>
  );
}
