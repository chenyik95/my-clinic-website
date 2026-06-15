"use client";

import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { DoctorSection } from "@/components/DoctorSection";
import { ServicesSection } from "@/components/ServicesSection";
import { WhyUs } from "@/components/WhyUs";
import { Testimonials } from "@/components/Testimonials";
import { BookingDialog } from "@/components/BookingDialog";
import { ContactSection } from "@/components/ContactSection";
import { Footer } from "@/components/Footer";

export default function EnglishHomePage() {
  const [bookingOpen, setBookingOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar onBookClick={() => setBookingOpen(true)} />

      <main className="flex-1">
        <Hero onBookClick={() => setBookingOpen(true)} />
        <ServicesSection />
        <DoctorSection />
        <WhyUs />
        <Testimonials />
        <ContactSection />
      </main>

      <Footer />

      <BookingDialog open={bookingOpen} onOpenChange={setBookingOpen} />
    </div>
  );
}
