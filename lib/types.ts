/**
 * Core content types for the GENIUZLAB EXPERIENCE portfolio.
 *
 * This is a plain, statically-typed data model (no CMS). It is intentionally
 * shaped so that migrating to a headless CMS later (Sanity, Contentful, etc.)
 * is a data-layer swap, not a redesign:
 *   - `lib/projects.ts` and `lib/categories.ts` are the ONLY files that know
 *     where content comes from right now (a local array).
 *   - Every component consumes these types, never the raw data files
 *     directly where avoidable, and always goes through the accessor
 *     functions in `lib/projects.ts`.
 *   - When a CMS is introduced, only the accessor functions need to change
 *     to fetch remotely instead of filtering a local array.
 */

/** The seven top-level work categories for the portfolio. */
export type CategorySlug =
  | "graphic-design"
  | "church-christian"
  | "branding-identity"
  | "social-media"
  | "posters-flyers"
  | "motion-video"
  | "client-projects";

export interface CategoryMeta {
  slug: CategorySlug;
  /** Display label, e.g. "Church & Christian Designs" */
  label: string;
  /** Short line shown on category index pages and the homepage index. */
  description: string;
}

export interface ProjectImage {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export interface Project {
  /** URL-safe identifier, used at /work/[slug] */
  slug: string;
  title: string;
  /** Optional — only set for real client engagements. */
  client?: string;
  categories: CategorySlug[];
  year: number;
  /** e.g. "Brand Identity, Art Direction" */
  role?: string;
  /** Short teaser shown on cards / grids. */
  summary: string;
  /** Longer case-study copy shown on the project detail page. */
  description?: string;
  coverImage: ProjectImage;
  gallery: ProjectImage[];
  /** For Motion & Video entries. */
  videoUrl?: string;
  tags?: string[];
  /** Include in the homepage "Featured Work" selection. */
  featured?: boolean;
  /** Manual sort order within a category (lower = earlier). */
  order?: number;
  /**
   * True for seed/placeholder entries only. Every placeholder project in
   * lib/projects.ts sets this to `true` so it can never be mistaken for
   * real portfolio work, and so it can be filtered out programmatically
   * once real projects are added.
   */
  isPlaceholder?: boolean;
}
