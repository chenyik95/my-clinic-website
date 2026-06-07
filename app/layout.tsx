import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/sonner';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Zen Pulse Acupuncture Medical Centre',
  description: 'Professional Traditional Chinese Medicine care in Subang Jaya, Malaysia. Acupuncture, Tuina, and holistic healing by Dr. Goh Sze Chin.',
  icons: {
    icon: '/favicon.ico',
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
