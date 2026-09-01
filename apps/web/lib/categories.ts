import type { CategoryMeta, CategorySlug } from "./types";

/**
 * The seven fixed work categories for GENIUZLAB.
 * This is the single source of truth for category labels/descriptions —
 * nav, footer, homepage index, and category pages all read from here.
 */
export const categories: CategoryMeta[] = [
  {
    slug: "graphic-design",
    label: "Graphic Design",
    description: "General visual design work across print and digital.",
  },
  {
    slug: "church-christian",
    label: "Church & Christian Designs",
    description: "Visual identity and campaign design for churches and ministries.",
  },
  {
    slug: "branding-identity",
    label: "Branding & Identity",
    description: "Logos, identity systems, and brand guidelines.",
  },
  {
    slug: "social-media",
    label: "Social Media Designs",
    description: "Content design for social platforms and campaigns.",
  },
  {
    slug: "posters-flyers",
    label: "Posters & Flyers",
    description: "Event, promotional, and announcement design.",
  },
  {
    slug: "motion-video",
    label: "Motion & Video",
    description: "Animated and video-based creative work.",
  },
  {
    slug: "client-projects",
    label: "Client Projects",
    description: "Selected commissioned work for real clients.",
  },
];

export function getAllCategories(): CategoryMeta[] {
  return categories;
}

export function getCategoryBySlug(slug: string): CategoryMeta | undefined {
  return categories.find((category) => category.slug === slug);
}

export function isValidCategorySlug(slug: string): slug is CategorySlug {
  return categories.some((category) => category.slug === slug);
}
