"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const navLinks = [
  { href: "#services", key: "services" as const },
  { href: "#doctor", key: "doctors" as const },
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
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border/50">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-semibold text-xl text-secondary">
          <span className="text-primary">Zen</span> Pulse
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8 text-sm">
          {navLinks.map((link) => (
            <button
              key={link.key}
              onClick={() => scrollTo(link.href)}
              className="text-text-secondary hover:text-secondary transition-colors font-medium"
            >
              {t(link.key)}
            </button>
          ))}
          <Button 
            onClick={onBookClick}
            className="bg-primary hover:bg-primary-dark text-secondary rounded-2xl px-6"
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
                    className="text-left text-lg text-text-secondary hover:text-secondary transition-colors font-medium py-1"
                  >
                    {t(link.key)}
                  </button>
                ))}
                <Button 
                  onClick={() => {
                    setIsOpen(false);
                    onBookClick();
                  }}
                  className="mt-4 bg-primary hover:bg-primary-dark text-secondary rounded-2xl h-11"
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
