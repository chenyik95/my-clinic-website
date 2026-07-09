"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Menu, X } from "lucide-react";
import { ClinicLogo } from "@/components/ClinicLogo";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const navLinks = [
  { href: "#services", key: "services" as const },
  { href: "#doctor", key: "doctors" as const },
  { href: "#gallery", key: "gallery" as const },
  { href: "#contact", key: "contact" as const },
];

interface NavbarProps {
  onBookClick: () => void;
}

export function Navbar({ onBookClick }: NavbarProps) {
  const t = useTranslations("nav");
  const tCommon = useTranslations("common");
  const [isOpen, setIsOpen] = useState(false);

  const scrollTo = (href: string) => {
    const id = href.replace("#", "");
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition - bodyRect - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
    setIsOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-mocha-muted shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between gap-3 px-6">
        <ClinicLogo size="sm" showName className="min-w-0 flex-1 md:flex-none" />

        {/* Desktop Navigation */}
        <div className="hidden shrink-0 md:flex items-center gap-6 lg:gap-8 text-sm">
          {navLinks.map((link) => (
            <button
              key={link.key}
              onClick={() => scrollTo(link.href)}
              className="text-text-secondary hover:text-mocha transition-colors font-medium"
            >
              {t(link.key)}
            </button>
          ))}
          <Button 
            onClick={onBookClick}
            className="rounded-2xl px-6"
          >
            {tCommon("bookAppointment")}
          </Button>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <div className="flex flex-col gap-6 mt-8">
                {navLinks.map((link) => (
                  <button
                    key={link.key}
                    onClick={() => scrollTo(link.href)}
                    className="text-left text-lg text-text-secondary hover:text-mocha transition-colors font-medium py-1"
                  >
                    {t(link.key)}
                  </button>
                ))}
                <Button 
                  onClick={() => {
                    setIsOpen(false);
                    onBookClick();
                  }}
                  className="mt-4 rounded-2xl h-11"
                >
                  {tCommon("bookAppointment")}
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
