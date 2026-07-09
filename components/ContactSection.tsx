"use client";

import { useTranslations } from "next-intl";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { CLINIC } from "@/lib/clinic";

function InfoBlock({
  label,
  children,
  icon,
}: {
  label: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
}) {
  return (
    <div className="min-w-0">
      <div className="mb-1.5 flex items-center gap-2 text-sm font-medium tracking-tight text-secondary">
        {icon}
        <span>{label}</span>
      </div>
      <div className="break-words text-sm leading-relaxed text-text-secondary sm:text-[0.9375rem]">
        {children}
      </div>
    </div>
  );
}

export function ContactSection() {
  const t = useTranslations("contact");

  return (
    <section id="contact" className="section section-warm">
      <div className="container mx-auto px-6">
        <div className="mb-10 max-w-2xl">
          <h2 className="heading">{t("title")}</h2>
        </div>

        <div className="grid items-stretch gap-8 lg:grid-cols-2">
          {/* Info card — stacked sections, no overlapping grids */}
          <div className="form-surface flex min-w-0 flex-col overflow-hidden p-6 sm:p-8">
            <div className="space-y-6">
              <InfoBlock
                label="Address"
                icon={<MapPin className="h-3.5 w-3.5 shrink-0 text-mocha" aria-hidden />}
              >
                <p className="whitespace-pre-line">{t("address")}</p>
              </InfoBlock>

              <div className="border-t border-mocha-muted/70" />

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-x-8">
                <InfoBlock
                  label="Phone"
                  icon={<Phone className="h-3.5 w-3.5 shrink-0 text-mocha" aria-hidden />}
                >
                  <a
                    href={`tel:${t("phone").replace(/\s/g, "")}`}
                    className="inline-block hover:text-mocha transition-colors"
                  >
                    {t("phone")}
                  </a>
                </InfoBlock>

                <InfoBlock
                  label="WhatsApp"
                  icon={<Phone className="h-3.5 w-3.5 shrink-0 text-mocha" aria-hidden />}
                >
                  <a
                    href={`https://wa.me/${CLINIC.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block hover:text-mocha transition-colors"
                  >
                    {CLINIC.whatsappDisplay}
                  </a>
                </InfoBlock>
              </div>

              <InfoBlock
                label="Email"
                icon={<Mail className="h-3.5 w-3.5 shrink-0 text-mocha" aria-hidden />}
              >
                <a
                  href={`mailto:${t("email")}`}
                  className="inline-block break-all hover:text-mocha transition-colors"
                >
                  {t("email")}
                </a>
              </InfoBlock>

              <div className="border-t border-mocha-muted/70" />

              {/* Hours on its own full-width row — multi-line text no longer fights email */}
              <InfoBlock
                label="Hours"
                icon={<Clock className="h-3.5 w-3.5 shrink-0 text-mocha" aria-hidden />}
              >
                <p className="whitespace-pre-line leading-relaxed">{t("hours")}</p>
              </InfoBlock>
            </div>

            <p className="mt-8 border-t border-mocha-muted/70 pt-5 text-sm leading-relaxed text-text-secondary">
              {t("mapNote")}{" "}
              <a
                href={CLINIC.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-mocha underline underline-offset-4 transition-colors hover:text-mocha-dark"
              >
                {t("openInGoogleMaps")}
              </a>
            </p>
          </div>

          {/* Map — fixed min height so iframe never collapses into the info card */}
          <div className="relative min-h-[280px] overflow-hidden rounded-3xl border border-mocha-muted bg-white shadow-sm sm:min-h-[320px] lg:min-h-[360px]">
            <iframe
              title="Zen Pulse Clinic Location"
              src={CLINIC.googleMapsEmbedUrl}
              className="absolute inset-0 h-full w-full border-0"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
