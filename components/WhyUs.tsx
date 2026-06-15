"use client";

import { useTranslations } from "next-intl";

export function WhyUs() {
  const t = useTranslations("whyUs");
  const items = t.raw("items") as Array<{ title: string; description: string }>;

  return (
    <section className="section bg-card-muted">
      <div className="container mx-auto px-6">
        <div className="max-w-2xl mb-12">
          <h2 className="heading">{t("title")}</h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item, index) => (
            <div key={index} className="card p-7">
              <div className="font-semibold text-xl text-secondary tracking-tight mb-3">
                {item.title}
              </div>
              <p className="text-[15px] text-text-secondary leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
