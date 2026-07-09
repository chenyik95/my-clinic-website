/**
 * Gallery images for the Team & Clinic section.
 *
 * Order here is display order (team first, then reception/clinic).
 *
 * To add more photos:
 * 1. Drop optimised images into `public/images/gallery/`
 * 2. Add an entry below
 * 3. Add matching caption/alt keys under `gallery.items` in messages/en.json
 */

export type GalleryCategory = "team" | "clinic";

export type GalleryItem = {
  /** Key used for i18n caption/alt under gallery.items.<id> */
  id: string;
  src: string;
  category: GalleryCategory;
  /** Optional layout hint for the grid */
  span?: "normal" | "wide";
};

export const GALLERY_ITEMS: GalleryItem[] = [
  // Team first
  {
    id: "team1",
    src: "/images/gallery/Team_1.jpg",
    category: "team",
    span: "normal",
  },
  {
    id: "team2",
    src: "/images/gallery/Team_2.jpg",
    category: "team",
    span: "normal",
  },
  // Reception / clinic next
  {
    id: "reception1",
    src: "/images/gallery/reception_1.jpg",
    category: "clinic",
    span: "wide",
  },
  {
    id: "reception2",
    src: "/images/gallery/reception_2.jpg",
    category: "clinic",
    span: "normal",
  },
  {
    id: "reception3",
    src: "/images/gallery/reception_3.jpg",
    category: "clinic",
    span: "normal",
  },
];

export const GALLERY_FILTERS: Array<"all" | GalleryCategory> = [
  "all",
  "team",
  "clinic",
];
