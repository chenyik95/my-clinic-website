import { NextResponse } from "next/server";
import { getTestimonials } from "@/lib/google-reviews";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const testimonials = await getTestimonials();

  return NextResponse.json(testimonials, {
    headers: {
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}