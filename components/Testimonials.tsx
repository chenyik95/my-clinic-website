"use client";

import { Star } from "lucide-react";
import { useTranslations } from "next-intl";
import type { TestimonialsData } from "@/lib/testimonials";

type TestimonialsProps = {
  data: TestimonialsData;
};

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5 mb-4" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, index) => (
        <Star
          key={index}
          className={`h-4 w-4 ${
            index < rating
              ? "fill-amber-400 text-amber-400"
              : "fill-transparent text-border"
          }`}
        />
      ))}
    </div>
  );
}

export function Testimonials({ data }: TestimonialsProps) {
  const t = useTranslations("testimonials");
  const { items, summary, source } = data;

  return (
    <section className="section">
      <div className="container mx-auto px-6">
        <div className="mb-12 text-center">
          <h2 className="heading">{t("title")}</h2>

          {source === "google" && summary?.rating != null && (
            <p className="mt-4 text-text-secondary">
              {summary.rating.toFixed(1)} ★
              {summary.userRatingCount != null && (
                <> · {summary.userRatingCount} Google reviews</>
              )}
            </p>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {items.map((testimonial, index) => (
            <div key={index} className="card p-8 flex flex-col">
              {testimonial.rating != null && (
                <StarRating rating={testimonial.rating} />
              )}
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

        {source === "google" && summary?.googleMapsUri && (
          <p className="mt-8 text-center text-sm text-text-secondary">
            <a
              href={summary.googleMapsUri}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4 hover:text-secondary transition-colors"
            >
              {t("viewAllOnGoogle")}
            </a>
          </p>
        )}
      </div>
    </section>
  );
}