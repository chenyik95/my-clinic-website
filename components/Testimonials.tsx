"use client";

import { useTranslations } from "next-intl";

export function Testimonials() {
  const t = useTranslations("testimonials");
  const items = t.raw("items") as Array<{ quote: string; name: string; role: string }>;

  return (
    <section className="section">
      <div className="container mx-auto px-6">
        <h2 className="heading mb-12 text-center">{t("title")}</h2>

        <div className="grid md:grid-cols-3 gap-6">
          {items.map((testimonial, index) => (
            <div key={index} className="card p-8 flex flex-col">
              <blockquote className="text-[15px] text-text-secondary leading-relaxed flex-1">
                “{testimonial.quote}”
              </blockquote>
              <div className="mt-8 pt-6 border-t border-border/50">
                <div className="font-medium text-secondary">{testimonial.name}</div>
                <div className="text-sm text-text-secondary">{testimonial.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
