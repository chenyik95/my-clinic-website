# Images & Assets

This folder contains placeholder images for the Zen Pulse website (English-first build).

## Current Placeholders Used
We are currently using high-quality, free-to-use images from Unsplash and Picsum for development. All images have descriptive alt text in the components.

## Hero background

- `hero-clinic.jpg` — full-bleed hero image (currently the clinic reception photo)
- Swap this file anytime to change the homepage hero look; keep ~2000px wide, optimised JPEG/WebP

## Gallery (Team & Clinic section)

Add store / clinic photos under `public/images/gallery/`, then register them in `lib/gallery.ts` and `messages/en.json` → `gallery.items`.

Suggested filenames:
- `gallery/reception.jpg` – reception / waiting area
- `gallery/treatment-room.jpg` – treatment room
- `gallery/exterior.jpg` – clinic exterior or entrance

Example entry in `lib/gallery.ts`:

```ts
{
  id: "reception",
  src: "/images/gallery/reception.jpg",
  category: "clinic",
  span: "wide", // optional: wider grid cell
}
```

And in `messages/en.json` under `gallery.items`:

```json
"reception": {
  "caption": "Reception",
  "alt": "Zen Pulse Clinic reception area in Subang Jaya"
}
```

## Images Needed (replace these placeholders)
- `hero.jpg` or similar – welcoming, calm treatment room or serene doctor portrait (hero background)
- `doctor.jpg` – professional, warm headshot or 3/4 portrait of Dr. Goh Sze Chin
- `acupuncture.jpg` – clean, calm acupuncture treatment scene
- `clinic.jpg` – exterior or welcoming reception area
- `treatment-*.jpg` – various treatment photos if you want richer service cards
- `gallery/*` – team & store photos for the Gallery section

## Recommended Specifications
- Format: JPG or WebP
- Hero: ~2000px wide, 16:9 or 3:2
- Doctor portrait: 800–1200px, portrait orientation
- Keep file sizes reasonable (< 300KB after optimisation)

## How to Replace
1. Add your real photos here with clear names.
2. Update the `src` props in the components (Hero, DoctorSection, etc.).
3. Update alt text to be accurate and SEO-friendly.

## Credits for Current Placeholders
- Photos currently referenced via Unsplash (https://unsplash.com) or Picsum.
- Please replace with your own or properly licensed professional medical/clinic photography before going live.

Thank you — beautiful, calm imagery will greatly strengthen patient trust.
