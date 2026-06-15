import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/sonner';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  metadataBase: new URL("https://zenpulseclinic.my"),
  title: {
    default: "Zen Pulse Acupuncture Medical Centre",
    template: "%s | Zen Pulse Acupuncture",
  },
  description: "Professional Traditional Chinese Medicine care in Subang Jaya, Malaysia. Acupuncture, Tuina, and holistic healing by Dr. Goh Sze Chin. Restore balance with personalised, compassionate TCM treatments.",
  keywords: [
    "acupuncture Subang Jaya",
    "Traditional Chinese Medicine Malaysia",
    "Tuina massage",
    "herbal medicine Subang Jaya",
    "Dr Goh Sze Chin",
    "pain management TCM",
    "women's health acupuncture",
  ],
  authors: [{ name: "Zen Pulse Acupuncture Medical Centre" }],
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Zen Pulse Acupuncture Medical Centre",
    description: "Expert Traditional Chinese Medicine by Dr. Goh Sze Chin in Subang Jaya. Calm, personalised care for pain, stress, and holistic wellness.",
    images: [{ url: "/images/hero.jpg" }],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased bg-background text-text-primary">
        {children}
        <Toaster position="top-center" richColors closeButton />
      </body>
    </html>
  );
}
