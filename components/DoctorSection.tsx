"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";

export function DoctorSection() {
  const t = useTranslations("doctor");

  return (
    <section id="doctor" className="section bg-card-muted">
      <div className="container mx-auto px-6">
        <div className="text-center mb-10">
          <h2 className="heading">Meet Our Doctors</h2>
          <p className="mt-2 text-text-secondary max-w-md mx-auto">
            Experienced practitioners dedicated to restoring balance through Traditional Chinese Medicine.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-12">
          {/* Doctor 1 - Dr. Goh Sze Chin */}
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
                {t("credentials")}
              </div>
              <h3 className="text-2xl font-semibold text-secondary tracking-tight mb-4">
                Dr. Goh Sze Chin
              </h3>

              <div className="prose prose-slate max-w-none text-[15px] leading-relaxed text-text-secondary space-y-5">
                {t("bio")
                  .split("\n\n")
                  .map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
              </div>

              <blockquote className="mt-6 border-l-4 border-primary pl-5 italic text-secondary">
                {t("philosophy")}
              </blockquote>

              {/* Quick stats */}
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm">
                <div>
                  <div className="font-semibold text-secondary tracking-tight">{t("experience")}</div>
                  <div className="text-text-secondary">Clinical practice</div>
                </div>
                <div>
                  <div className="font-semibold text-secondary tracking-tight">{t("patients")}</div>
                  <div className="text-text-secondary">Across Malaysia</div>
                </div>
                <div>
                  <div className="font-semibold text-secondary tracking-tight mb-1">Specialties</div>
                  <div className="text-text-secondary leading-snug">{t("specialties")}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Doctor 2 - New doctor (photo just uploaded) */}
          <div>
            <div className="aspect-[4/3] rounded-3xl bg-white shadow-sm border border-border/50 overflow-hidden relative mb-6">
              <Image
                src="/images/019A3770.jpg"
                alt="Dr. [Second Doctor Name], Traditional Chinese Medicine practitioner at Zen Pulse Clinic"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 45vw"
              />
            </div>

            <div>
              <div className="uppercase tracking-[3px] text-xs font-medium text-primary mb-3">
                {/* TODO: Update credentials for the second doctor */}
                Registered TCM Practitioner • Ministry of Health Malaysia
              </div>
              <h3 className="text-2xl font-semibold text-secondary tracking-tight mb-4">
                {/* TODO: Replace with actual doctor name */}
                Dr. Ahmad bin Hassan
              </h3>

              <div className="prose prose-slate max-w-none text-[15px] leading-relaxed text-text-secondary space-y-5">
                {/* TODO: Replace with real bio for the second doctor */}
                <p>
                  Dr. Ahmad bin Hassan has over 12 years of dedicated practice in Traditional Chinese Medicine. He specializes in pain management, musculoskeletal conditions, and holistic approaches to chronic illness.
                </p>
                <p>
                  Known for his thorough consultations and gentle techniques, Dr. Ahmad combines classical acupuncture and Tuina with modern diagnostic insights to deliver personalized care that addresses both symptoms and root causes.
                </p>
              </div>

              <div className="mt-6 text-sm">
                <div className="font-medium text-secondary mb-1.5">Specialties</div>
                <div className="text-text-secondary">
                  {/* TODO: Update specialties */}
                  Pain Management • Sports Injuries • Stress & Sleep Disorders • Postpartum Care
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
