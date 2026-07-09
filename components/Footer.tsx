"use client";

import { useTranslations } from "next-intl";
import { ClinicLogo } from "@/components/ClinicLogo";

export function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="border-t border-mocha-dark/20 bg-mocha-dark text-white py-12">
      <div className="container mx-auto px-6 text-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-y-6">
          <div>
            <ClinicLogo
              size="md"
              showName
              href="/"
              className="[&_span]:text-white"
            />
            <p className="mt-3 max-w-md text-white/75">{t("tagline")}</p>
          </div>

          <div className="text-white/75 space-y-1 md:text-right">
            <div>{t("licensed")}</div>
          </div>
        </div>
      </div>
    </footer>
  );
}