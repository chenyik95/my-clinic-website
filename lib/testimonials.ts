import enMessages from "@/messages/en.json";

export type Testimonial = {
  quote: string;
  name: string;
  role: string;
  rating?: number;
  source: "google" | "static";
};

export type GoogleReviewsSummary = {
  rating?: number;
  userRatingCount?: number;
  googleMapsUri?: string;
};

export type TestimonialsData = {
  items: Testimonial[];
  summary?: GoogleReviewsSummary;
  source: "google" | "static";
};

export function getStaticTestimonials(): TestimonialsData {
  const items = enMessages.testimonials.items as Array<{
    quote: string;
    name: string;
    role: string;
  }>;

  return {
    source: "static",
    items: items.map((item) => ({
      ...item,
      source: "static" as const,
    })),
  };
}