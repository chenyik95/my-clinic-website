import { CLINIC } from "@/lib/clinic";
import {
  getStaticTestimonials,
  type Testimonial,
  type TestimonialsData,
} from "@/lib/testimonials";

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

const DISPLAY_COUNT = 3;
const SCRAPE_PAGES = 2;

function ratingOnlyQuote(rating: number): string {
  return `Shared a ${rating}-star review on Google`;
}

function mapScrapedReviews(reviews: ScrapedReview[]): TestimonialsData {
  const sorted = [...reviews].sort((a, b) => {
    const aHasText = Boolean(a.review?.text?.trim());
    const bHasText = Boolean(b.review?.text?.trim());
    if (aHasText !== bHasText) return aHasText ? -1 : 1;
    return (b.review?.rating ?? 0) - (a.review?.rating ?? 0);
  });

  const items: Testimonial[] = sorted.slice(0, DISPLAY_COUNT).map((review) => {
    const rating = review.review?.rating ?? 5;
    const text = review.review?.text?.trim();

    return {
      quote: text || ratingOnlyQuote(rating),
      name: review.author?.name ?? "Google Reviewer",
      role: review.time?.published ?? "Google Review",
      rating,
      source: "google" as const,
    };
  });

  const ratings = reviews
    .map((review) => review.review?.rating)
    .filter((rating): rating is number => rating != null);

  const averageRating =
    ratings.length > 0
      ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length
      : undefined;

  return {
    source: "google",
    items,
    summary: {
      rating: averageRating,
      userRatingCount: reviews.length,
      googleMapsUri: CLINIC.googleMapsUrl,
    },
  };
}

async function scrapeGoogleReviews(): Promise<TestimonialsData | null> {
  try {
    const { scraper } = await import("google-maps-review-scraper");
    const reviews = (await scraper(CLINIC.googleMapsPlaceUrl, {
      pages: SCRAPE_PAGES,
      clean: true,
      experimental: true,
      sort_type: "newest",
    })) as ScrapedReview[] | number;

    if (!Array.isArray(reviews) || reviews.length === 0) {
      return null;
    }

    return mapScrapedReviews(reviews);
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

    const reviews = data.reviews ?? [];
    if (reviews.length === 0) return null;

    const items: Testimonial[] = reviews.slice(0, DISPLAY_COUNT).map((review) => {
      const rating = review.rating ?? 5;
      const text = review.text?.text?.trim();

      return {
        quote: text || ratingOnlyQuote(rating),
        name: review.authorAttribution?.displayName ?? "Google Reviewer",
        role: review.relativePublishTimeDescription ?? "Google Review",
        rating,
        source: "google" as const,
      };
    });

    return {
      source: "google",
      items,
      summary: {
        rating: data.rating,
        userRatingCount: data.userRatingCount,
        googleMapsUri: data.googleMapsUri ?? CLINIC.googleMapsUrl,
      },
    };
  } catch (error) {
    console.error("Failed to fetch Google Places reviews:", error);
    return null;
  }
}

export async function getTestimonials(): Promise<TestimonialsData> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;

  if (apiKey) {
    const placesReviews = await fetchGooglePlacesReviews(apiKey);
    if (placesReviews) return placesReviews;
  }

  const scrapedReviews = await scrapeGoogleReviews();
  if (scrapedReviews) return scrapedReviews;

  return getStaticTestimonials();
}