import { Prisma } from "@prisma/client";
import { prisma } from "./prisma";

const projectInclude = {
  categories: { include: { category: true } },
  tags: { include: { tag: true } },
  images: { orderBy: { orderIndex: "asc" as const } },
} satisfies Prisma.ProjectInclude;

type PublicProject = Prisma.ProjectGetPayload<{ include: typeof projectInclude }>;

function mapImage(
  image: { url: string; altText: string | null; width: number | null; height: number | null },
  fallbackAlt: string
) {
  return {
    src: image.url,
    alt: image.altText || fallbackAlt,
    width: image.width ?? 1600,
    height: image.height ?? 2000,
  };
}

function mapProject(project: PublicProject) {
  const coverImage = project.images.find((image) => image.type === "COVER");
  const galleryImages = project.images.filter((image) => image.type === "GALLERY");

  return {
    slug: project.slug,
    title: project.title,
    client: project.client ?? undefined,
    categories: project.categories.map(({ category }) => category.slug),
    year: project.year ?? new Date().getFullYear(),
    role: project.role ?? undefined,
    summary: project.summary,
    description: project.description ?? undefined,
    coverImage: coverImage ? mapImage(coverImage, project.title) : {
      src: "/images/placeholder.svg",
      alt: "Project image",
      width: 1600,
      height: 2000,
    },
    gallery: galleryImages.map((image, index: number) =>
      mapImage(image, `${project.title} gallery ${index + 1}`)
    ),
    tags: project.tags.map(({ tag }) => tag.name),
    featured: project.featured,
    order: project.orderIndex,
    isPlaceholder: false,
  };
}

export async function listPublicProjects(categorySlug?: string) {
  const projects = await prisma.project.findMany({
    where: {
      published: true,
      ...(categorySlug
        ? { categories: { some: { category: { slug: categorySlug } } } }
        : {}),
    },
    orderBy: [{ orderIndex: "asc" }, { year: "desc" }],
    include: projectInclude,
  });

  return projects.map(mapProject);
}

export async function getPublicProjectBySlug(slug: string) {
  const project = await prisma.project.findFirst({
    where: { slug, published: true },
    include: projectInclude,
  });

  return project ? mapProject(project) : undefined;
}
