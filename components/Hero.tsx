"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

interface HeroProps {
  onBookClick: () => void;
}

export function Hero({ onBookClick }: HeroProps) {
  const t = useTranslations("hero");
  const tCommon = useTranslations("common");

  return (
    <section className="relative min-h-[92vh] flex items-center justify-center bg-background overflow-hidden">
      {/* Subtle background accent */}
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_0.8px,transparent_1px)] bg-[length:4px_4px] opacity-40" />

      <div className="container relative z-10 mx-auto px-6 pt-12 pb-20 text-center max-w-4xl">
        <div className="inline-flex items-center rounded-full bg-secondary/10 px-4 py-1 text-sm font-medium text-secondary mb-6">
          Subang Jaya, Selangor
        </div>

        <h1 className="text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tighter text-secondary leading-[1.05] mb-6 whitespace-pre-line">
          {t("title")}
        </h1>

        <p className="text-xl md:text-2xl text-text-secondary max-w-2xl mx-auto mb-10">
          {t("subtitle")}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            onClick={onBookClick}
            className="h-14 px-10 text-base rounded-2xl bg-primary hover:bg-primary-dark text-secondary shadow-sm active:scale-[0.985] transition-all"
          >
            {t("ctaPrimary")}
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => {
              const el = document.getElementById("services");
              el?.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
            className="h-14 px-10 text-base rounded-2xl border-secondary/30 hover:bg-secondary/5"
          >
            {t("ctaSecondary")}
          </Button>
        </div>

        <p className="mt-8 text-sm text-text-secondary/70">
          Appointments usually confirmed within 2 hours
        </p>
      </div>

      {/* Gentle bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
