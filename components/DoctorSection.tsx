"use client";

import { useTranslations } from "next-intl";

export function DoctorSection() {
  const t = useTranslations("doctor");

  return (
    <section id="doctor" className="section bg-card-muted">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-12 gap-x-12 gap-y-10 items-center">
          {/* Image placeholder */}
          <div className="md:col-span-5">
            <div className="aspect-[4/3] rounded-3xl bg-white shadow-sm border border-border/50 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=1200&auto=format&fit=crop"
                alt="Dr. Goh Sze Chin, Traditional Chinese Medicine practitioner"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Content */}
          <div className="md:col-span-7">
            <div className="uppercase tracking-[3px] text-xs font-medium text-primary mb-3">
              {t("credentials")}
            </div>
            <h2 className="heading mb-6">{t("title")}</h2>

            <div className="prose prose-slate max-w-none text-[15px] leading-relaxed text-text-secondary space-y-5">
              {t("bio")
                .split("\n\n")
                .map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
            </div>

            <blockquote className="mt-8 border-l-4 border-primary pl-5 italic text-secondary text-lg">
              {t("philosophy")}
            </blockquote>

            {/* Quick stats */}
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div>
                <div className="text-3xl font-semibold text-secondary tracking-tight">{t("experience")}</div>
                <div className="text-sm text-text-secondary mt-1">Clinical practice</div>
              </div>
              <div>
                <div className="text-3xl font-semibold text-secondary tracking-tight">{t("patients")}</div>
                <div className="text-sm text-text-secondary mt-1">Across Malaysia</div>
              </div>
              <div className="sm:col-span-1">
                <div className="text-sm font-medium text-secondary mb-1.5">Specialties</div>
                <div className="text-sm text-text-secondary leading-snug">{t("specialties")}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
