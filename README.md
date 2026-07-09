# Zen Pulse Acupuncture Medical Centre

A modern, calming website for a Traditional Chinese Medicine (TCM) clinic in Subang Jaya, Selangor, Malaysia.

**Live purpose**: Professional online presence with easy online appointment booking.

## Features

- **English-first** fully built experience (Traditional Chinese structure ready via next-intl)
- Beautiful, calm design using the clinic's signature warm beige color (`#e5d5bf`)
- Responsive navigation with mobile menu
- Detailed doctor profile for Dr. Goh Sze Chin
- Services showcase (Acupuncture, Tuina, Herbal Medicine, Cupping, Moxibustion, Facial Rejuvenation)
- Trust-building sections (Why Us + Testimonials)
- Fully functional **booking system**:
  - Modal form with date picker
  - Validation with Zod + React Hook Form
  - Server Action that sends professional confirmation emails via Resend
- Contact & location section with embedded map
- Bilingual-ready architecture (English + 中文)

## Tech Stack

- **Framework**: Next.js 15 (App Router + Turbopack)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 + custom design system
- **Internationalization**: next-intl
- **UI Components**: shadcn/ui
- **Forms**: React Hook Form + Zod
- **Date Picker**: react-day-picker
- **Email**: Resend
- **Icons**: lucide-react

## Getting Started

### Prerequisites

- Node.js 18+
- npm (or pnpm/yarn)

### Installation

```bash
# Clone the repository
git clone https://github.com/chenyik95/my-clinic-website.git
cd my-clinic-website

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
```

### Environment Variables

Create a `.env.local` file (already ignored by git):

```env
# Required for the booking form to send real emails
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxx

# Optional - override the sender address (use onboarding@resend.dev for testing)
RESEND_FROM_EMAIL=onboarding@resend.dev
```

> Get a free Resend API key at [resend.com](https://resend.com)

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Available Scripts

| Command         | Description                     |
|-----------------|---------------------------------|
| `npm run dev`   | Start development server (Turbopack) |
| `npm run build` | Create production build         |
| `npm run start` | Start production server         |
| `npm run lint`  | Run ESLint                      |

## Project Structure

```
my-clinic-website/
├── app/
│   ├── [locale]/          # Localized pages & layouts
│   ├── actions.ts         # Server actions (booking)
│   ├── globals.css        # Design tokens + styles
│   └── layout.tsx
├── components/            # Reusable UI components
│   ├── ui/                # shadcn/ui primitives
│   └── *.tsx              # Hero, Navbar, BookingDialog, etc.
├── i18n/                  # next-intl configuration
├── lib/                   # Utilities + booking schema
├── messages/              # Translation files (en.json, zh.json)
├── public/                # Static assets (images)
└── ...
```

## Color Theme

The site uses a dual beige pairing (no cool blue):

- **Pairing 1 — Soft cream & sand**: background `#f7f2ea`, sand beige `#e4d4be`
- **Pairing 2 — Taupe & mocha**: borders `#d9ccb8`, primary mocha `#6b5544`
- Full palette is defined in `app/globals.css` under `@theme`.

## Deployment

This project is optimized for **Vercel**.

1. Push to GitHub
2. Import the repository in Vercel
3. Add your `RESEND_API_KEY` (and optional `RESEND_FROM_EMAIL`) in Vercel environment variables
4. Deploy

## Notes

- The booking form currently works in **demo mode** if no `RESEND_API_KEY` is provided (it logs submissions to the terminal).
- Chinese (Traditional) translations can be added by populating `messages/zh.json`.
- All form submissions are validated on both client and server.

## License

Private project for Zen Pulse Acupuncture Medical Centre.

---

Built with care for patient trust and calm aesthetics. 🌿

**Dr. Goh Sze Chin** — Subang Jaya, Malaysia
