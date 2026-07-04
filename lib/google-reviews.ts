import { CLINIC } from "@/lib/clinic";
import {
  getStaticTestimonials,
  type GoogleReviewsSummary,
  type Testimonial,
  type TestimonialsData,
} from "@/lib/testimonials";

type GooglePlaceReview = {
  rating?: number;
  text?: { text?: string };
  relativePublishTimeDescription?: string;
  authorAttribution?: {
    displayName?: string;
  };
};

type GooglePlaceResponse = {
  reviews?: GooglePlaceReview[];
  rating?: number;
  userRatingCount?: number;
  googleMapsUri?: string;
};

type GoogleTextSearchResponse = {
  places?: Array<{ id?: string }>;
};

const REVALIDATE_SECONDS = 60 * 60 * 24; // 24 hours

function mapGoogleReviews(data: GooglePlaceResponse): TestimonialsData {
  const items: Testimonial[] = (data.reviews ?? [])
    .filter((review) => review.text?.text)
    .map((review) => ({
      quote: review.text!.text!,
      name: review.authorAttribution?.displayName ?? "Google Reviewer",
      role: review.relativePublishTimeDescription ?? "Google Review",
      rating: review.rating,
      source: "google" as const,
    }));

  const summary: GoogleReviewsSummary | undefined =
    data.rating != null || data.userRatingCount != null || data.googleMapsUri
      ? {
          rating: data.rating,
          userRatingCount: data.userRatingCount,
          googleMapsUri: data.googleMapsUri ?? CLINIC.googleMapsUrl,
        }
      : undefined;

  return {
    source: "google",
    items,
    summary,
  };
}

async function resolvePlaceId(apiKey: string): Promise<string | null> {
  try {
    const response = await fetch(
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
        next: { revalidate: REVALIDATE_SECONDS * 30 },
      }
    );

    if (!response.ok) {
      console.error(
        `Google Text Search error: ${response.status} ${response.statusText}`
      );
      return null;
    }

    const data = (await response.json()) as GoogleTextSearchResponse;
    return data.places?.[0]?.id ?? null;
  } catch (error) {
    console.error("Failed to resolve Google Place ID:", error);
    return null;
  }
}

export async function getTestimonials(): Promise<TestimonialsData> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;

  if (!apiKey) {
    return getStaticTestimonials();
  }

  const placeId =
    process.env.GOOGLE_PLACE_ID ?? (await resolvePlaceId(apiKey));

  if (!placeId) {
    return getStaticTestimonials();
  }

  try {
    const response = await fetch(
      `https://places.googleapis.com/v1/places/${placeId}`,
      {
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": apiKey,
          "X-Goog-FieldMask": "reviews,rating,userRatingCount,googleMapsUri",
        },
        next: { revalidate: REVALIDATE_SECONDS },
      }
    );

    if (!response.ok) {
      console.error(
        `Google Places API error: ${response.status} ${response.statusText}`
      );
      return getStaticTestimonials();
    }

    const data = (await response.json()) as GooglePlaceResponse;
    const testimonials = mapGoogleReviews(data);

    if (testimonials.items.length === 0) {
      return getStaticTestimonials();
    }

    return testimonials;
  } catch (error) {
    console.error("Failed to fetch Google reviews:", error);
    return getStaticTestimonials();
  }
}