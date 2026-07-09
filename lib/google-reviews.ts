import { CLINIC } from "@/lib/clinic";
import {
  getStaticTestimonials,
  type Testimonial,
  type TestimonialsData,
} from "@/lib/testimonials";

/** Show enough comment cards for a multi-page 3-up slideshow */
const DISPLAY_COUNT = 9;
const SCRAPE_PAGES = 4;
const MIN_COMMENT_LENGTH = 20;

type ScrapedReview = {
  review?: {
    rating?: number;
    text?: string | null;
  };
  author?: {
    name?: string;
  };
  time?: {
    published?: string;
  };
};

type NormalizedReview = {
  rating: number;
  text: string;
  name: string;
  published: string;
};

function cleanReviewText(raw: string): string {
  return raw
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function isMeaningfulComment(text: string | null | undefined): text is string {
  if (!text) return false;
  const cleaned = cleanReviewText(text);
  return cleaned.length >= MIN_COMMENT_LENGTH;
}

function pickBestTextFromRaw(row: unknown[]): string | null {
  // Common raw Google payload slots for review body (EN often at 26/27, CN at 33/34)
  const candidates: string[] = [];
  for (const idx of [26, 27, 33, 34]) {
    const value = row[idx];
    if (typeof value === "string" && value.trim().length >= MIN_COMMENT_LENGTH) {
      candidates.push(value.trim());
    }
  }

  if (candidates.length === 0) {
    for (const value of row) {
      if (
        typeof value === "string" &&
        value.trim().length >= MIN_COMMENT_LENGTH &&
        !value.startsWith("http") &&
        !value.startsWith("Ci") &&
        !value.includes("google.com")
      ) {
        candidates.push(value.trim());
      }
    }
  }

  if (candidates.length === 0) return null;

  // Prefer English / Latin-script comments for the English site
  const english = candidates.find((c) => /[A-Za-z]{8,}/.test(c));
  return cleanReviewText(english ?? candidates[0]);
}

/** Map cleaned scraper objects (when text is present) */
function fromCleanedScraped(reviews: ScrapedReview[]): NormalizedReview[] {
  return reviews
    .map((review) => {
      const text = review.review?.text
        ? cleanReviewText(review.review.text)
        : "";
      if (!isMeaningfulComment(text)) return null;
      return {
        rating: review.review?.rating ?? 5,
        text,
        name: review.author?.name?.trim() || "Google Reviewer",
        published: review.time?.published?.trim() || "Google Review",
      };
    })
    .filter((item): item is NormalizedReview => item != null);
}

/**
 * The scraper's `clean: true` mode often drops review text.
 * Parse the raw nested arrays so comments are kept.
 */
function fromRawScraped(reviews: unknown[]): NormalizedReview[] {
  return reviews
    .map((row) => {
      if (!Array.isArray(row)) return null;
      const rating = typeof row[1] === "number" ? row[1] : 5;
      const published =
        Array.isArray(row[2]) && typeof row[2][0] === "string"
          ? row[2][0]
          : "Google Review";
      const name =
        Array.isArray(row[3]) && typeof row[3][0] === "string"
          ? row[3][0]
          : "Google Reviewer";
      const text = pickBestTextFromRaw(row);
      if (!isMeaningfulComment(text)) return null;
      return { rating, text, name, published };
    })
    .filter((item): item is NormalizedReview => item != null);
}

function toTestimonialsData(
  reviews: NormalizedReview[],
  summary?: {
    rating?: number;
    userRatingCount?: number;
    googleMapsUri?: string;
  }
): TestimonialsData | null {
  if (reviews.length === 0) return null;

  // Prefer longer, higher-rated comments first
  const sorted = [...reviews].sort((a, b) => {
    if (b.rating !== a.rating) return b.rating - a.rating;
    return b.text.length - a.text.length;
  });

  const items: Testimonial[] = sorted.slice(0, DISPLAY_COUNT).map((review) => ({
    quote: review.text,
    name: review.name,
    role: review.published,
    rating: review.rating,
    source: "google" as const,
  }));

  const ratings = reviews.map((r) => r.rating);
  const averageRating =
    ratings.length > 0
      ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length
      : undefined;

  return {
    source: "google",
    items,
    summary: {
      rating: summary?.rating ?? averageRating,
      userRatingCount: summary?.userRatingCount ?? reviews.length,
      googleMapsUri: summary?.googleMapsUri ?? CLINIC.googleMapsUrl,
    },
  };
}

async function scrapeGoogleReviews(): Promise<TestimonialsData | null> {
  try {
    const { scraper } = await import("google-maps-review-scraper");

    // Raw scrape keeps comment text (clean mode often returns text: null)
    const raw = (await scraper(CLINIC.googleMapsPlaceUrl, {
      pages: SCRAPE_PAGES,
      clean: false,
      experimental: true,
      sort_type: "newest",
    })) as unknown;

    if (Array.isArray(raw) && raw.length > 0) {
      const fromRaw = fromRawScraped(raw);
      if (fromRaw.length > 0) {
        return toTestimonialsData(fromRaw);
      }
    }

    // Fallback: cleaned objects, if the library starts returning text again
    const cleaned = (await scraper(CLINIC.googleMapsPlaceUrl, {
      pages: SCRAPE_PAGES,
      clean: true,
      experimental: true,
      sort_type: "newest",
    })) as ScrapedReview[] | number;

    if (Array.isArray(cleaned) && cleaned.length > 0) {
      const fromClean = fromCleanedScraped(cleaned);
      if (fromClean.length > 0) {
        return toTestimonialsData(fromClean, {
          userRatingCount: cleaned.length,
        });
      }
    }

    return null;
  } catch (error) {
    console.error("Failed to scrape Google reviews:", error);
    return null;
  }
}

async function fetchGooglePlacesReviews(
  apiKey: string
): Promise<TestimonialsData | null> {
  try {
    const searchResponse = await fetch(
      "https://places.googleapis.com/v1/places:searchText",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": apiKey,
          "X-Goog-FieldMask": "places.id",
        },
        body: JSON.stringify({
          textQuery: CLINIC.name,
          locationBias: {
            circle: {
              center: {
                latitude: CLINIC.coordinates.lat,
                longitude: CLINIC.coordinates.lng,
              },
              radius: 500,
            },
          },
        }),
        cache: "no-store",
      }
    );

    if (!searchResponse.ok) return null;

    const searchData = (await searchResponse.json()) as {
      places?: Array<{ id?: string }>;
    };
    const placeId =
      process.env.GOOGLE_PLACE_ID ?? searchData.places?.[0]?.id ?? null;
    if (!placeId) return null;

    const detailsResponse = await fetch(
      `https://places.googleapis.com/v1/places/${placeId}`,
      {
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": apiKey,
          "X-Goog-FieldMask": "reviews,rating,userRatingCount,googleMapsUri",
        },
        cache: "no-store",
      }
    );

    if (!detailsResponse.ok) return null;

    const data = (await detailsResponse.json()) as {
      reviews?: Array<{
        rating?: number;
        text?: { text?: string };
        relativePublishTimeDescription?: string;
        authorAttribution?: { displayName?: string };
      }>;
      rating?: number;
      userRatingCount?: number;
      googleMapsUri?: string;
    };

    const reviews = (data.reviews ?? [])
      .map((review) => {
        const text = review.text?.text
          ? cleanReviewText(review.text.text)
          : "";
        if (!isMeaningfulComment(text)) return null;
        return {
          rating: review.rating ?? 5,
          text,
          name: review.authorAttribution?.displayName ?? "Google Reviewer",
          published:
            review.relativePublishTimeDescription ?? "Google Review",
        };
      })
      .filter((item): item is NormalizedReview => item != null);

    return toTestimonialsData(reviews, {
      rating: data.rating,
      userRatingCount: data.userRatingCount,
      googleMapsUri: data.googleMapsUri ?? CLINIC.googleMapsUrl,
    });
  } catch (error) {
    console.error("Failed to fetch Google Places reviews:", error);
    return null;
  }
}

export async function getTestimonials(): Promise<TestimonialsData> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;

  if (apiKey) {
    const placesReviews = await fetchGooglePlacesReviews(apiKey);
    if (placesReviews && placesReviews.items.length > 0) return placesReviews;
  }

  const scrapedReviews = await scrapeGoogleReviews();
  if (scrapedReviews && scrapedReviews.items.length > 0) return scrapedReviews;

  return getStaticTestimonials();
}
