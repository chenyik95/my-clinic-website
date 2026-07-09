import { NextResponse } from "next/server";
import { getTestimonials } from "@/lib/google-reviews";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const testimonials = await getTestimonials();

  return NextResponse.json(testimonials, {
    headers: {
      // Shorter cache so refreshed Google comments appear sooner
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=3600",
    },
  });
}