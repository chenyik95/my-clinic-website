"use client";

import { useTranslations } from "next-intl";
import { 
  Syringe, 
  Hand, 
  Leaf, 
  Flame, 
  Sun, 
  Sparkles 
} from "lucide-react";

const icons = [Syringe, Hand, Leaf, Flame, Sun, Sparkles];

export function ServicesSection() {
  const t = useTranslations("services");

  const services = t.raw("items") as Array<{ title: string; description: string }>;

  return (
    <section id="services" className="section section-cool">
      <div className="container mx-auto px-6">
        <div className="max-w-2xl mb-12">
          <h2 className="heading">{t("title")}</h2>
          <p className="lead mt-3 max-w-xl">{t("subtitle")}</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => {
            const Icon = icons[index % icons.length];
            return (
              <div key={index} className="card p-7 group">
                <div className="icon-badge mb-5">
                  <Icon className="w-5 h-5 text-mocha" />
                </div>
                <h3 className="card-title mb-2.5">
                  {service.title}
                </h3>
                <p className="text-sm leading-relaxed text-text-secondary sm:text-[0.9375rem]">
                  {service.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
