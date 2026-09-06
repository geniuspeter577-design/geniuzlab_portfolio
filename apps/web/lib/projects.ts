import type { CategorySlug, Project, ProjectImage } from "./types";
import { prisma } from "./prisma";
import type { Prisma } from "@prisma/client";

const FALLBACK_IMAGE: ProjectImage = {
  src: "/images/placeholder.svg",
  alt: "Project image",
  width: 1600,
  height: 2000,
};

const projectInclude = {
  categories: { include: { category: true } },
  tags: { include: { tag: true } },
  images: { orderBy: { orderIndex: "asc" as const } },
} satisfies Prisma.ProjectInclude;

type DbProject = Prisma.ProjectGetPayload<{ include: typeof projectInclude }>;

function mapImage(
  image: { url: string; altText: string | null; width: number | null; height: number | null },
  fallbackAlt: string
): ProjectImage {
  return {
    src: image.url,
    alt: image.altText || fallbackAlt,
    width: image.width ?? FALLBACK_IMAGE.width,
    height: image.height ?? FALLBACK_IMAGE.height,
  };
}

function mapProject(project: DbProject): Project {
  const coverImage = project.images.find((image) => image.type === "COVER");
  const galleryImages = project.images.filter((image) => image.type === "GALLERY");

  return {
    slug: project.slug,
    title: project.title,
    client: project.client ?? undefined,
    categories: project.categories.map(({ category }) => category.slug as CategorySlug),
    year: project.year ?? new Date().getFullYear(),
    role: project.role ?? undefined,
    summary: project.summary,
    description: project.description ?? undefined,
    coverImage: coverImage ? mapImage(coverImage, project.title) : FALLBACK_IMAGE,
    gallery: galleryImages.map((image, index) =>
      mapImage(image, `${project.title} gallery ${index + 1}`)
    ),
    tags: project.tags.map(({ tag }) => tag.name),
    featured: project.featured,
    order: project.orderIndex,
    isPlaceholder: false,
  };
}

/** Returns all published projects, sorted by explicit order then by year (newest first). */
export async function getAllProjects(): Promise<Project[]> {
  const projects = await prisma.project.findMany({
    where: { published: true },
    orderBy: [{ orderIndex: "asc" }, { year: "desc" }],
    include: projectInclude,
  });

  return projects.map(mapProject);
}

export async function getProjectBySlug(slug: string): Promise<Project | undefined> {
  const project = await prisma.project.findFirst({
    where: { slug, published: true },
    include: projectInclude,
  });

  return project ? mapProject(project) : undefined;
}

export async function getProjectsByCategory(categorySlug: string): Promise<Project[]> {
  const all = await getAllProjects();
  return all.filter((project) =>
    project.categories.includes(categorySlug as CategorySlug)
  );
}

export async function getFeaturedProjects(): Promise<Project[]> {
  const all = await getAllProjects();
  return all.filter((project) => project.featured);
}

/** Adjacent project helper, used for "next project" links on case-study pages. */
export async function getAdjacentProject(slug: string): Promise<Project | undefined> {
  const all = await getAllProjects();
  const index = all.findIndex((project) => project.slug === slug);
  if (index === -1) return undefined;
  return all[(index + 1) % all.length];
}
