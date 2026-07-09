"use client";

import { useTranslations } from "next-intl";

export function WhyUs() {
  const t = useTranslations("whyUs");
  const items = t.raw("items") as Array<{ title: string; description: string }>;

  return (
    <section className="section section-white">
      <div className="container mx-auto px-6">
        <div className="max-w-2xl mb-12">
          <h2 className="heading">{t("title")}</h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item, index) => (
            <div key={index} className="card p-7">
              <div className="card-title mb-2.5">
                {item.title}
              </div>
              <p className="text-sm leading-relaxed text-text-secondary sm:text-[0.9375rem]">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
