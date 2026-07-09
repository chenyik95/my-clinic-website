"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

import {
  GALLERY_FILTERS,
  GALLERY_ITEMS,
  type GalleryCategory,
  type GalleryItem,
} from "@/lib/gallery";
import { cn } from "@/lib/utils";

type FilterKey = "all" | GalleryCategory;

type ItemCopy = {
  caption: string;
  alt: string;
};

const AUTOPLAY_MS = 5500;

export function GallerySection() {
  const t = useTranslations("gallery");
  const [filter, setFilter] = useState<FilterKey>("all");
  const [index, setIndex] = useState(0);
  const [active, setActive] = useState<GalleryItem | null>(null);
  const [paused, setPaused] = useState(false);

  const itemsByCategory = useMemo(() => {
    return {
      team: GALLERY_ITEMS.some((i) => i.category === "team"),
      clinic: GALLERY_ITEMS.some((i) => i.category === "clinic"),
    };
  }, []);

  const visibleFilters = GALLERY_FILTERS.filter((key) => {
    if (key === "all") return true;
    return itemsByCategory[key];
  });

  const slides = useMemo(() => {
    if (filter === "all") return GALLERY_ITEMS;
    return GALLERY_ITEMS.filter((item) => item.category === filter);
  }, [filter]);

  const getCopy = useCallback(
    (id: string): ItemCopy => t.raw(`items.${id}`) as ItemCopy,
    [t]
  );

  // Reset slide when filter changes
  useEffect(() => {
    setIndex(0);
  }, [filter]);

  // Keep index in range if slide list shrinks
  useEffect(() => {
    if (slides.length === 0) return;
    setIndex((i) => Math.min(i, slides.length - 1));
  }, [slides.length]);

  const goTo = useCallback(
    (next: number) => {
      if (slides.length === 0) return;
      const len = slides.length;
      setIndex(((next % len) + len) % len);
    },
    [slides.length]
  );

  const goPrev = useCallback(() => goTo(index - 1), [goTo, index]);
  const goNext = useCallback(() => goTo(index + 1), [goTo, index]);

  // Autoplay (pauses on hover / when lightbox open)
  useEffect(() => {
    if (paused || active || slides.length <= 1) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [paused, active, slides.length]);

  // Keyboard when section focused via buttons
  useEffect(() => {
    if (active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, goPrev, goNext]);

  const current = slides[index];
  const currentCopy = current ? getCopy(current.id) : null;
  const activeCopy = active ? getCopy(active.id) : null;

  return (
    <section id="gallery" className="section section-white">
      <div className="container mx-auto px-6">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <h2 className="heading">{t("title")}</h2>
          <p className="lead mx-auto mt-2.5 max-w-lg">{t("subtitle")}</p>
        </div>

        {visibleFilters.length > 2 && (
          <div className="mb-8 flex flex-wrap justify-center gap-2">
            {visibleFilters.map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setFilter(key)}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                  filter === key
                    ? "bg-mocha text-white shadow-sm"
                    : "bg-mocha-light text-mocha hover:bg-beige"
                )}
              >
                {t(`filters.${key}`)}
              </button>
            ))}
          </div>
        )}

        {slides.length > 0 && current && currentCopy ? (
          <div
            className="relative mx-auto max-w-5xl"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            {/* Single-row slideshow track */}
            <div className="overflow-hidden rounded-3xl border border-mocha-muted bg-white shadow-sm">
              <div
                className="flex transition-transform duration-500 ease-out"
                style={{ transform: `translateX(-${index * 100}%)` }}
              >
                {slides.map((item) => {
                  const copy = getCopy(item.id);
                  return (
                    <div
                      key={item.id}
                      className="relative min-w-full shrink-0"
                    >
                      <button
                        type="button"
                        onClick={() => setActive(item)}
                        className="group relative block w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mocha focus-visible:ring-inset"
                        aria-label={`${copy.caption} — open larger view`}
                      >
                        <div className="relative aspect-[16/10] w-full bg-mocha-light sm:aspect-[21/10]">
                          <Image
                            src={item.src}
                            alt={copy.alt}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                            sizes="(max-width: 1024px) 100vw, 1024px"
                            priority={item.id === slides[0]?.id}
                          />
                          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-secondary/60 via-secondary/10 to-transparent" />
                          <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/80">
                              {t(`filters.${item.category}`)}
                            </p>
                            <p className="mt-1 font-serif text-lg font-medium tracking-tight text-white sm:text-xl">
                              {copy.caption}
                            </p>
                          </div>
                        </div>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Controls */}
            {slides.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={goPrev}
                  className="absolute left-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-mocha-muted bg-white/95 text-mocha shadow-sm transition hover:bg-white sm:left-4 sm:h-11 sm:w-11"
                  aria-label="Previous photo"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={goNext}
                  className="absolute right-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-mocha-muted bg-white/95 text-mocha shadow-sm transition hover:bg-white sm:right-4 sm:h-11 sm:w-11"
                  aria-label="Next photo"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>

                {/* Dots */}
                <div className="mt-5 flex items-center justify-center gap-2">
                  {slides.map((item, i) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => goTo(i)}
                      aria-label={`Go to slide ${i + 1}`}
                      aria-current={i === index}
                      className={cn(
                        "h-2 rounded-full transition-all",
                        i === index
                          ? "w-6 bg-mocha"
                          : "w-2 bg-mocha-muted hover:bg-mocha/40"
                      )}
                    />
                  ))}
                </div>

                <p className="mt-3 text-center text-xs text-text-secondary/80">
                  {index + 1} / {slides.length}
                </p>
              </>
            )}
          </div>
        ) : (
          <p className="text-center text-text-secondary">{t("empty")}</p>
        )}
      </div>

      {/* Lightbox */}
      {active && activeCopy && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={activeCopy.caption}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-secondary/80 p-4 backdrop-blur-sm"
          onClick={() => setActive(null)}
        >
          <div
            className="relative w-full max-w-4xl overflow-hidden rounded-3xl bg-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setActive(null)}
              className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-secondary shadow-sm transition hover:bg-white"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="relative aspect-[16/10] w-full bg-mocha-light">
              <Image
                src={active.src}
                alt={activeCopy.alt}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 896px"
                priority
              />
            </div>
            <div className="border-t border-mocha-muted/60 px-5 py-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-mocha">
                {t(`filters.${active.category}`)}
              </p>
              <p className="mt-1 font-serif text-lg font-medium tracking-tight text-secondary sm:text-xl">
                {activeCopy.caption}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
