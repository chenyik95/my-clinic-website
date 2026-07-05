"use client";

import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { useTranslations } from "next-intl";
import { getStaticTestimonials, type TestimonialsData } from "@/lib/testimonials";

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

function TestimonialSkeleton() {
  return (
    <div className="card p-8 flex flex-col animate-pulse">
      <div className="flex gap-1 mb-4">
        {Array.from({ length: 5 }, (_, index) => (
          <div key={index} className="h-4 w-4 rounded-full bg-border/60" />
        ))}
      </div>
      <div className="space-y-2 flex-1">
        <div className="h-3 bg-border/60 rounded w-full" />
        <div className="h-3 bg-border/60 rounded w-5/6" />
        <div className="h-3 bg-border/60 rounded w-4/6" />
      </div>
      <div className="mt-8 pt-6 border-t border-border/50 space-y-2">
        <div className="h-4 bg-border/60 rounded w-1/3" />
        <div className="h-3 bg-border/60 rounded w-1/4" />
      </div>
    </div>
  );
}

export function Testimonials() {
  const t = useTranslations("testimonials");
  const [data, setData] = useState<TestimonialsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadReviews() {
      try {
        const response = await fetch("/api/reviews");
        if (!response.ok) throw new Error("Failed to load reviews");
        const testimonials = (await response.json()) as TestimonialsData;
        if (!cancelled) setData(testimonials);
      } catch {
        if (!cancelled) setData(getStaticTestimonials());
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    loadReviews();
    return () => {
      cancelled = true;
    };
  }, []);

  const items = data?.items ?? [];
  const summary = data?.summary;
  const source = data?.source ?? "static";

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
          {isLoading
            ? Array.from({ length: 3 }, (_, index) => (
                <TestimonialSkeleton key={index} />
              ))
            : items.map((testimonial, index) => (
                <div key={index} className="card p-8 flex flex-col">
                  {testimonial.rating != null && (
                    <StarRating rating={testimonial.rating} />
                  )}
                  <blockquote className="text-[15px] text-text-secondary leading-relaxed flex-1">
                    {testimonial.quote.startsWith("Shared a") ? (
                      <span className="italic">{testimonial.quote}</span>
                    ) : (
                      <>“{testimonial.quote}”</>
                    )}
                  </blockquote>
                  <div className="mt-8 pt-6 border-t border-border/50">
                    <div className="font-medium text-secondary">{testimonial.name}</div>
                    <div className="text-sm text-text-secondary">{testimonial.role}</div>
                  </div>
                </div>
              ))}
        </div>

        {source === "google" && summary?.googleMapsUri && !isLoading && (
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