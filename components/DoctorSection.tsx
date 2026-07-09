"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import {
  Activity,
  Dumbbell,
  HeartPulse,
  ScanFace,
  Salad,
  type LucideIcon,
} from "lucide-react";

type SpecialtyIconKey = "pain" | "skin" | "sports" | "pain-advanced" | "digestive";

type SpecialtyItem = {
  title: string;
  description: string;
  icon: SpecialtyIconKey;
};

const specialtyIcons: Record<SpecialtyIconKey, LucideIcon> = {
  pain: Activity,
  skin: ScanFace,
  sports: Dumbbell,
  "pain-advanced": HeartPulse,
  digestive: Salad,
};

type DoctorProfileProps = {
  imageSrc: string;
  imageAlt: string;
  namespace: "goh" | "kow";
  specialties: SpecialtyItem[];
};

function DoctorProfile({
  imageSrc,
  imageAlt,
  namespace,
  specialties,
}: DoctorProfileProps) {
  const t = useTranslations("doctors");

  return (
    <div>
      <div className="aspect-[4/3] rounded-3xl bg-white shadow-sm border border-mocha-muted overflow-hidden relative mb-6">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 45vw"
        />
      </div>

      <div>
        <div className="mb-2.5 text-[0.6875rem] font-medium uppercase tracking-[0.16em] text-mocha">
          {t(`${namespace}.credentials`)}
        </div>
        <h3 className="mb-3 font-serif text-xl font-medium tracking-tight text-secondary md:text-[1.375rem]">
          {t(`${namespace}.name`)}
        </h3>

        <div className="prose prose-slate max-w-none space-y-4 text-sm leading-relaxed text-text-secondary sm:text-[0.9375rem]">
          {t(`${namespace}.bio`)
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
            {specialties.map((specialty) => {
              const Icon = specialtyIcons[specialty.icon];

              return (
                <li key={specialty.title} className="flex gap-3 text-sm">
                  <div
                    className="icon-badge-sm mt-0.5"
                    aria-hidden="true"
                  >
                    <Icon className="w-4 h-4 text-mocha" />
                  </div>
                  <div>
                    <div className="font-medium text-secondary mb-1">
                      {specialty.title}
                    </div>
                    <p className="text-text-secondary leading-relaxed">
                      {specialty.description}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="mt-8 text-sm">
          <div className="font-semibold text-secondary tracking-tight">
            {t(`${namespace}.experience`)}
          </div>
          <div className="text-text-secondary">{t("experienceLabel")}</div>
        </div>
      </div>
    </div>
  );
}

export function DoctorSection() {
  const t = useTranslations("doctors");
  const gohSpecialties = t.raw("goh.specialtyItems") as SpecialtyItem[];
  const kowSpecialties = t.raw("kow.specialtyItems") as SpecialtyItem[];

  return (
    <section id="doctor" className="section section-accent">
      <div className="container mx-auto px-6">
        <div className="text-center mb-10">
          <h2 className="heading">{t("title")}</h2>
          <p className="lead mx-auto mt-2.5 max-w-md">
            {t("subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-12">
          <DoctorProfile
            imageSrc="/images/019A3495.jpg"
            imageAlt="Dr. Goh Sze Chin (Gwen), Traditional Chinese Medicine practitioner at Zen Pulse Clinic"
            namespace="goh"
            specialties={gohSpecialties}
          />
          <DoctorProfile
            imageSrc="/images/019A3770.jpg"
            imageAlt="Dr. Kow Jaw Lin, Traditional Chinese Medicine practitioner at Zen Pulse Clinic"
            namespace="kow"
            specialties={kowSpecialties}
          />
        </div>
      </div>
    </section>
  );
}