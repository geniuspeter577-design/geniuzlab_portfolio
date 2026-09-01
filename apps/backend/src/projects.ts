import type { Project } from "./types";

/**
 * ============================================================================
 *  PLACEHOLDER PORTFOLIO DATA — REPLACE BEFORE LAUNCH
 * ============================================================================
 * Every entry below is a structural placeholder, NOT real work. They exist
 * only so the grid, filters, homepage, and case-study template have
 * something real to render and can be visually reviewed.
 *
 * Each placeholder:
 *   - sets `isPlaceholder: true`
 *   - uses generic, clearly-labelled copy ("Placeholder project")
 *   - points at /images/placeholder.svg instead of real artwork
 *
 * To add real work: copy the shape of an entry below, fill in real fields,
 * point `coverImage`/`gallery` at real files under /public/images/work/,
 * and delete the `isPlaceholder` flag (or leave it `false`).
 * ============================================================================
 */

const PLACEHOLDER_IMAGE = "/images/placeholder.svg";

function placeholderImage(alt: string): Project["coverImage"] {
  return { src: PLACEHOLDER_IMAGE, alt, width: 1600, height: 2000 };
}

export const projects: Project[] = [
  {
    slug: "placeholder-graphic-design-01",
    title: "Placeholder Project — Graphic Design",
    categories: ["graphic-design"],
    year: new Date().getFullYear(),
    summary: "Placeholder summary. Replace with a one-line description of the real project.",
    description:
      "Placeholder case-study copy. Replace with real project context: the brief, the approach, and the outcome.",
    coverImage: placeholderImage("Placeholder cover — graphic design project"),
    gallery: [placeholderImage("Placeholder gallery image 1")],
    featured: true,
    isPlaceholder: true,
  },
  {
    slug: "placeholder-church-christian-01",
    title: "Placeholder Project — Church & Christian",
    categories: ["church-christian"],
    year: new Date().getFullYear(),
    summary: "Placeholder summary. Replace with a one-line description of the real project.",
    description:
      "Placeholder case-study copy. Replace with real project context: the brief, the approach, and the outcome.",
    coverImage: placeholderImage("Placeholder cover — church & Christian design project"),
    gallery: [placeholderImage("Placeholder gallery image 1")],
    isPlaceholder: true,
  },
  {
    slug: "placeholder-branding-identity-01",
    title: "Placeholder Project — Branding & Identity",
    categories: ["branding-identity"],
    year: new Date().getFullYear(),
    role: "Placeholder role, e.g. Brand Identity, Art Direction",
    summary: "Placeholder summary. Replace with a one-line description of the real project.",
    description:
      "Placeholder case-study copy. Replace with real project context: the brief, the approach, and the outcome.",
    coverImage: placeholderImage("Placeholder cover — branding & identity project"),
    gallery: [placeholderImage("Placeholder gallery image 1")],
    featured: true,
    isPlaceholder: true,
  },
  {
    slug: "placeholder-social-media-01",
    title: "Placeholder Project — Social Media",
    categories: ["social-media"],
    year: new Date().getFullYear(),
    summary: "Placeholder summary. Replace with a one-line description of the real project.",
    coverImage: placeholderImage("Placeholder cover — social media design project"),
    gallery: [placeholderImage("Placeholder gallery image 1")],
    isPlaceholder: true,
  },
  {
    slug: "placeholder-posters-flyers-01",
    title: "Placeholder Project — Posters & Flyers",
    categories: ["posters-flyers"],
    year: new Date().getFullYear(),
    summary: "Placeholder summary. Replace with a one-line description of the real project.",
    coverImage: placeholderImage("Placeholder cover — poster/flyer design project"),
    gallery: [placeholderImage("Placeholder gallery image 1")],
    isPlaceholder: true,
  },
  {
    slug: "placeholder-motion-video-01",
    title: "Placeholder Project — Motion & Video",
    categories: ["motion-video"],
    year: new Date().getFullYear(),
    summary: "Placeholder summary. Replace with a one-line description of the real project.",
    coverImage: placeholderImage("Placeholder cover — motion & video project"),
    gallery: [placeholderImage("Placeholder gallery image 1")],
    isPlaceholder: true,
  },
  {
    slug: "placeholder-client-projects-01",
    title: "Placeholder Project — Client Work",
    client: "Placeholder Client Name",
    categories: ["client-projects", "branding-identity"],
    year: new Date().getFullYear(),
    summary: "Placeholder summary. Replace with a one-line description of the real project.",
    coverImage: placeholderImage("Placeholder cover — client project"),
    gallery: [placeholderImage("Placeholder gallery image 1")],
    isPlaceholder: true,
  },
  {
    slug: "wowo-empire",
    title: "Wowo Empire",
    categories: ["branding-identity"],
    year: new Date().getFullYear(),
    summary: "Wowo Empire brand identity.",
    coverImage: {
      src: "/images/work/branding-identity/wowo_empire/cover.jpg",
      alt: "Wowo Empire cover",
      width: 3264,
      height: 3264,
    },
    gallery: [
      {
        src: "/images/work/branding-identity/wowo_empire/01.jpg",
        alt: "Wowo Empire gallery image 01",
        width: 3264,
        height: 3264,
      },
      {
        src: "/images/work/branding-identity/wowo_empire/02.jpg",
        alt: "Wowo Empire gallery image 02",
        width: 3264,
        height: 3264,
      },
      {
        src: "/images/work/branding-identity/wowo_empire/03.jpg",
        alt: "Wowo Empire gallery image 03",
        width: 3264,
        height: 3264,
      },
      {
        src: "/images/work/branding-identity/wowo_empire/04.jpg",
        alt: "Wowo Empire gallery image 04",
        width: 3264,
        height: 3264,
      },
    ],
    isPlaceholder: false,
  },
];

/** Returns all projects, sorted by explicit `order` then by year (newest first). */
export function getAllProjects(): Project[] {
  return [...projects].sort((a, b) => {
    if (a.order !== null && b.order !== null) return a.order - b.order;
    if (a.order !== null) return -1;
    if (b.order !== null) return 1;
    return b.year - a.year;
  });
}

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}

export function getProjectsByCategory(categorySlug: string): Project[] {
  return getAllProjects().filter((project) =>
    project.categories.includes(categorySlug as Project["categories"][number])
  );
}

export function getFeaturedProjects(): Project[] {
  return getAllProjects().filter((project) => project.featured);
}

/** Adjacent project helper, used for "next project" links on case-study pages. */
export function getAdjacentProject(slug: string): Project | undefined {
  const all = getAllProjects();
  const index = all.findIndex((project) => project.slug === slug);
  if (index === -1) return undefined;
  return all[(index + 1) % all.length];
}
