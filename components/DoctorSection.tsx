"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";

type SpecialtyItem = {
  title: string;
  description: string;
};

export function DoctorSection() {
  const t = useTranslations("doctors");
  const kowSpecialties = t.raw("kow.specialtyItems") as SpecialtyItem[];

  return (
    <section id="doctor" className="section bg-card-muted">
      <div className="container mx-auto px-6">
        <div className="text-center mb-10">
          <h2 className="heading">{t("title")}</h2>
          <p className="mt-2 text-text-secondary max-w-md mx-auto">
            {t("subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-12">
          {/* Dr. Goh Sze Chin */}
          <div>
            <div className="aspect-[4/3] rounded-3xl bg-white shadow-sm border border-border/50 overflow-hidden relative mb-6">
              <Image
                src="/images/019A3495.jpg"
                alt="Dr. Goh Sze Chin, Traditional Chinese Medicine practitioner at Zen Pulse Clinic"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 45vw"
              />
            </div>

            <div>
              <div className="uppercase tracking-[3px] text-xs font-medium text-primary mb-3">
                {t("goh.credentials")}
              </div>
              <h3 className="text-2xl font-semibold text-secondary tracking-tight mb-4">
                {t("goh.name")}
              </h3>

              <div className="prose prose-slate max-w-none text-[15px] leading-relaxed text-text-secondary space-y-5">
                {t("goh.bio")
                  .split("\n\n")
                  .map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
              </div>

              <blockquote className="mt-6 border-l-4 border-primary pl-5 italic text-secondary">
                {t("goh.philosophy")}
              </blockquote>

              <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm">
                <div>
                  <div className="font-semibold text-secondary tracking-tight">
                    {t("goh.experience")}
                  </div>
                  <div className="text-text-secondary">{t("experienceLabel")}</div>
                </div>
                <div>
                  <div className="font-semibold text-secondary tracking-tight">
                    {t("goh.patients")}
                  </div>
                  <div className="text-text-secondary">{t("patientsLabel")}</div>
                </div>
                <div>
                  <div className="font-semibold text-secondary tracking-tight mb-1">
                    {t("specialtiesLabel")}
                  </div>
                  <div className="text-text-secondary leading-snug">
                    {t("goh.specialties")}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Dr. Kow Jaw Lin */}
          <div>
            <div className="aspect-[4/3] rounded-3xl bg-white shadow-sm border border-border/50 overflow-hidden relative mb-6">
              <Image
                src="/images/019A3770.jpg"
                alt="Dr. Kow Jaw Lin, Traditional Chinese Medicine practitioner at Zen Pulse Clinic"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 45vw"
              />
            </div>

            <div>
              <div className="uppercase tracking-[3px] text-xs font-medium text-primary mb-3">
                {t("kow.credentials")}
              </div>
              <h3 className="text-2xl font-semibold text-secondary tracking-tight mb-4">
                {t("kow.name")}
              </h3>

              <div className="prose prose-slate max-w-none text-[15px] leading-relaxed text-text-secondary space-y-5">
                {t("kow.bio")
                  .split("\n\n")
                  .map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
              </div>

              <div className="mt-8 space-y-5">
                <div className="text-sm font-semibold text-secondary tracking-tight">
                  {t("specialtiesLabel")}
                </div>
                <ul className="space-y-4">
                  {kowSpecialties.map((specialty) => (
                    <li key={specialty.title} className="text-sm">
                      <div className="font-medium text-secondary mb-1">
                        {specialty.title}
                      </div>
                      <p className="text-text-secondary leading-relaxed">
                        {specialty.description}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 text-sm">
                <div className="font-semibold text-secondary tracking-tight">
                  {t("kow.experience")}
                </div>
                <div className="text-text-secondary">{t("experienceLabel")}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}