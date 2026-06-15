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
    <section id="services" className="section">
      <div className="container mx-auto px-6">
        <div className="max-w-2xl mb-12">
          <h2 className="heading">{t("title")}</h2>
          <p className="mt-4 text-lg text-text-secondary">{t("subtitle")}</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => {
            const Icon = icons[index % icons.length];
            return (
              <div key={index} className="card p-8 group">
                <div className="w-11 h-11 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/15 transition-colors">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold text-xl text-secondary tracking-tight mb-3">
                  {service.title}
                </h3>
                <p className="text-[15px] leading-relaxed text-text-secondary">
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
