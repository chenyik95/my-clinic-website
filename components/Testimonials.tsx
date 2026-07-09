"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  getStaticTestimonials,
  type Testimonial,
  type TestimonialsData,
} from "@/lib/testimonials";
import { cn } from "@/lib/utils";

const AUTOPLAY_MS = 6500;
/** Three review cards per slideshow page */
const CARDS_PER_SLIDE = 3;

function chunkReviews(items: Testimonial[], size: number): Testimonial[][] {
  if (items.length === 0) return [];
  const pages: Testimonial[][] = [];
  for (let i = 0; i < items.length; i += size) {
    pages.push(items.slice(i, i + size));
  }
  return pages;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div
      className="mb-3 flex gap-0.5"
      aria-label={`${rating} out of 5 stars`}
    >
      {Array.from({ length: 5 }, (_, index) => (
        <Star
          key={index}
          className={`h-3.5 w-3.5 ${
            index < rating
              ? "fill-amber-400 text-amber-400"
              : "fill-transparent text-border"
          }`}
        />
      ))}
    </div>
  );
}

/** Short summary for card UI — first N words, with ellipsis when clipped */
function summarizeQuote(quote: string, wordLimit = 10): string {
  const words = quote
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .filter(Boolean);

  if (words.length <= wordLimit) {
    return words.join(" ");
  }

  return `${words.slice(0, wordLimit).join(" ")}…`;
}

function ReviewCard({ testimonial }: { testimonial: Testimonial }) {
  const summary = summarizeQuote(testimonial.quote, 10);

  return (
    <div className="card flex h-full min-h-[180px] flex-col p-6 sm:min-h-[200px] sm:p-7">
      {testimonial.rating != null && <StarRating rating={testimonial.rating} />}
      <blockquote className="flex-1 text-sm leading-relaxed text-text-secondary sm:text-[0.9375rem]">
        {testimonial.quote.startsWith("Shared a") ? (
          <span className="italic">{summary}</span>
        ) : (
          <span title={testimonial.quote}>“{summary}”</span>
        )}
      </blockquote>
      <div className="mt-6 border-t border-border/50 pt-5">
        <div className="text-sm font-medium text-secondary">
          {testimonial.name}
        </div>
        <div className="mt-0.5 text-xs text-text-secondary sm:text-sm">
          {testimonial.role}
        </div>
      </div>
    </div>
  );
}

function TestimonialSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
      {Array.from({ length: CARDS_PER_SLIDE }, (_, index) => (
        <div
          key={index}
          className="card flex min-h-[240px] animate-pulse flex-col p-6 sm:p-7"
        >
          <div className="mb-3 flex gap-1">
            {Array.from({ length: 5 }, (_, i) => (
              <div key={i} className="h-3.5 w-3.5 rounded-full bg-border/60" />
            ))}
          </div>
          <div className="flex-1 space-y-2">
            <div className="h-3 w-full rounded bg-border/60" />
            <div className="h-3 w-5/6 rounded bg-border/60" />
            <div className="h-3 w-4/6 rounded bg-border/60" />
          </div>
          <div className="mt-6 space-y-2 border-t border-border/50 pt-5">
            <div className="h-3.5 w-1/3 rounded bg-border/60" />
            <div className="h-3 w-1/4 rounded bg-border/60" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function Testimonials() {
  const t = useTranslations("testimonials");
  const [data, setData] = useState<TestimonialsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pageIndex, setPageIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadReviews() {
      try {
        // Bust browser/CDN cache so refreshed Google comments appear
        const response = await fetch(`/api/reviews?t=${Date.now()}`, {
          cache: "no-store",
        });
        if (!response.ok) throw new Error("Failed to load reviews");
        const testimonials = (await response.json()) as TestimonialsData;
        // Prefer items that still have real comment text
        const withComments = {
          ...testimonials,
          items: (testimonials.items ?? []).filter(
            (item) =>
              item.quote?.trim().length >= 20 &&
              !item.quote.startsWith("Shared a")
          ),
        };
        if (!cancelled) {
          setData(
            withComments.items.length > 0 ? withComments : getStaticTestimonials()
          );
        }
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

  // Each slideshow page = up to 3 cards in one row
  const pages = useMemo(
    () => chunkReviews(items, CARDS_PER_SLIDE),
    [items]
  );
  const pageCount = pages.length;
  const showControls = pageCount > 1;

  const goTo = useCallback(
    (next: number) => {
      if (pageCount === 0) return;
      setPageIndex(((next % pageCount) + pageCount) % pageCount);
    },
    [pageCount]
  );

  const goPrev = useCallback(() => goTo(pageIndex - 1), [goTo, pageIndex]);
  const goNext = useCallback(() => goTo(pageIndex + 1), [goTo, pageIndex]);

  useEffect(() => {
    if (pageCount === 0) return;
    setPageIndex((i) => Math.min(i, pageCount - 1));
  }, [pageCount]);

  useEffect(() => {
    if (paused || isLoading || !showControls) return;
    const id = window.setInterval(() => {
      setPageIndex((i) => (i + 1) % pageCount);
    }, AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [paused, isLoading, showControls, pageCount]);

  return (
    <section className="section section-cool">
      <div className="container mx-auto px-6">
        <div className="mb-10 text-center">
          <h2 className="heading">{t("title")}</h2>

          {source === "google" && summary?.rating != null && (
            <p className="lead mt-3">
              {summary.rating.toFixed(1)} ★
              {summary.userRatingCount != null && (
                <> · {summary.userRatingCount} Google reviews</>
              )}
            </p>
          )}
        </div>

        {isLoading ? (
          <TestimonialSkeleton />
        ) : pages.length > 0 ? (
          <div
            className="relative"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            {/* Slideshow: each page is a full-width row of 3 cards */}
            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-500 ease-out"
                style={{ transform: `translateX(-${pageIndex * 100}%)` }}
              >
                {pages.map((page, pageIdx) => (
                  <div
                    key={`page-${pageIdx}`}
                    className="grid min-w-full shrink-0 grid-cols-1 gap-5 md:grid-cols-3"
                  >
                    {page.map((testimonial, cardIdx) => (
                      <ReviewCard
                        key={`${testimonial.name}-${pageIdx}-${cardIdx}`}
                        testimonial={testimonial}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {showControls && (
              <>
                <button
                  type="button"
                  onClick={goPrev}
                  className="absolute left-0 top-1/2 z-10 flex h-10 w-10 -translate-x-1 -translate-y-1/2 items-center justify-center rounded-full border border-mocha-muted bg-white/95 text-mocha shadow-sm transition hover:bg-white sm:-translate-x-3 sm:h-11 sm:w-11"
                  aria-label="Previous reviews"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={goNext}
                  className="absolute right-0 top-1/2 z-10 flex h-10 w-10 translate-x-1 -translate-y-1/2 items-center justify-center rounded-full border border-mocha-muted bg-white/95 text-mocha shadow-sm transition hover:bg-white sm:translate-x-3 sm:h-11 sm:w-11"
                  aria-label="Next reviews"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>

                <div className="mt-6 flex items-center justify-center gap-2">
                  {pages.map((_, i) => (
                    <button
                      key={`dot-${i}`}
                      type="button"
                      onClick={() => goTo(i)}
                      aria-label={`Go to review page ${i + 1}`}
                      aria-current={i === pageIndex}
                      className={cn(
                        "h-2 rounded-full transition-all",
                        i === pageIndex
                          ? "w-6 bg-mocha"
                          : "w-2 bg-mocha-muted hover:bg-mocha/40"
                      )}
                    />
                  ))}
                </div>

                <p className="mt-2 text-center text-xs text-text-secondary/80">
                  {pageIndex + 1} / {pageCount}
                </p>
              </>
            )}
          </div>
        ) : null}

        {source === "google" && summary?.googleMapsUri && !isLoading && (
          <p className="mt-8 text-center text-sm text-text-secondary">
            <a
              href={summary.googleMapsUri}
              target="_blank"
              rel="noopener noreferrer"
              className="text-mocha underline underline-offset-4 transition-colors hover:text-mocha-dark"
            >
              {t("viewAllOnGoogle")}
            </a>
          </p>
        )}
      </div>
    </section>
  );
}
