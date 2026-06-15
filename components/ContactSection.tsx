"use client";

import { useTranslations } from "next-intl";

export function ContactSection() {
  const t = useTranslations("contact");

  return (
    <section id="contact" className="section bg-card-muted">
      <div className="container mx-auto px-6">
        <div className="max-w-2xl mb-10">
          <h2 className="heading">{t("title")}</h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-10">
          {/* Info */}
          <div className="space-y-8 text-[15px]">
            <div>
              <div className="font-medium text-secondary mb-2 tracking-tight">Address</div>
              <p className="text-text-secondary whitespace-pre-line leading-relaxed">
                {t("address")}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
              <div>
                <div className="font-medium text-secondary mb-1.5">Phone</div>
                <a href={`tel:${t("phone").replace(/\s/g, "")}`} className="text-text-secondary hover:text-primary transition-colors">
                  {t("phone")}
                </a>
              </div>
              <div>
                <div className="font-medium text-secondary mb-1.5">WhatsApp</div>
                <a href={`https://wa.me/${t("whatsapp").replace(/[^0-9]/g, "")}`} target="_blank" className="text-text-secondary hover:text-primary transition-colors">
                  {t("whatsapp")}
                </a>
              </div>
              <div>
                <div className="font-medium text-secondary mb-1.5">Email</div>
                <a href={`mailto:${t("email")}`} className="text-text-secondary hover:text-primary transition-colors">
                  {t("email")}
                </a>
              </div>
              <div>
                <div className="font-medium text-secondary mb-1.5">Hours</div>
                <p className="text-text-secondary whitespace-pre-line leading-snug">{t("hours")}</p>
              </div>
            </div>

            <p className="text-sm text-text-secondary pt-2">{t("mapNote")}</p>
          </div>

          {/* Map */}
          <div className="rounded-3xl overflow-hidden border border-border/50 shadow-sm aspect-video lg:aspect-auto bg-white">
            <iframe
              title="Zen Pulse Clinic Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3983.732!2d101.588!3d3.082!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zM8KwMDQnNTMuNiJOIDEwMcKwMzUnMTYuOCJF!5e0!3m2!1sen!2smy!4v1700000000000"
              width="100%"
              height="100%"
              style={{ border: 0 }}
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
