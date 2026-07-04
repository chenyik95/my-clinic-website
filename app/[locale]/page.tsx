import { HomePageClient } from "@/components/HomePageClient";
import { getTestimonials } from "@/lib/google-reviews";

export default async function EnglishHomePage() {
  const testimonials = await getTestimonials();

  return <HomePageClient testimonials={testimonials} />;
}