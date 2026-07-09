"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

interface HeroProps {
  onBookClick: () => void;
}

export function Hero({ onBookClick }: HeroProps) {
  const t = useTranslations("hero");

  return (
    <section className="relative flex min-h-[92vh] items-center justify-center overflow-hidden">
      {/* Real clinic photography — warm, professional TCM environment */}
      <div className="absolute inset-0">
        <Image
          src="/images/hero-clinic.jpg"
          alt="Zen Pulse Acupuncture Medical Centre reception in Subang Jaya"
          fill
          priority
          className="hero-bg-image object-cover object-center"
          sizes="100vw"
        />
        {/* Soft warm wash so text stays readable and on-brand */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/88 via-background/72 to-background/90" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/55 via-transparent to-background/55" />
        {/* Gentle vignette — draws eye to center content */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,rgba(61,50,41,0.18)_100%)]" />
      </div>

      <div className="container relative z-10 mx-auto max-w-4xl px-6 pb-20 pt-12 text-center">
        <div className="mb-5 inline-flex items-center rounded-full border border-mocha/15 bg-white/70 px-3.5 py-1 text-xs font-medium tracking-wide text-mocha shadow-sm backdrop-blur-sm sm:text-[0.8125rem]">
          Subang Jaya, Selangor
        </div>

        <h1 className="mb-5 whitespace-pre-line font-serif text-[2rem] font-medium leading-[1.15] tracking-tight text-secondary sm:text-[2.5rem] md:text-[2.75rem] lg:text-[3rem]">
          {t("title")}
        </h1>

        <p className="mx-auto mb-8 max-w-xl text-[0.9375rem] leading-relaxed text-text-secondary sm:text-base md:text-lg md:leading-relaxed">
          {t("subtitle")}
        </p>

        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <Button
            size="lg"
            onClick={onBookClick}
            className="h-12 rounded-2xl px-8 text-sm shadow-md transition-all active:scale-[0.985] sm:text-[0.9375rem]"
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
            className="h-12 rounded-2xl border-mocha/25 bg-white/80 px-8 text-sm backdrop-blur-sm hover:bg-white sm:text-[0.9375rem]"
          >
            {t("ctaSecondary")}
          </Button>
        </div>

        <p className="mt-6 text-xs tracking-wide text-text-secondary/75 sm:text-[0.8125rem]">
          Appointments usually confirmed within 2 hours
        </p>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-mocha-light via-mocha-light/80 to-transparent" />
    </section>
  );
}
