import { z } from "zod";
import { prisma } from "./prisma";

// Kept in sync with apps/web/lib/categories.ts (the seven fixed work
// categories). Duplicated here so the backend can seed/serve categories
// without importing frontend code. If you add/change a category, update
// both places.
const categorySeed = [
  { slug: "graphic-design", label: "Graphic Design", description: "General visual design work across print and digital." },
  { slug: "church-christian", label: "Church & Christian Designs", description: "Visual identity and campaign design for churches and ministries." },
  { slug: "branding-identity", label: "Branding & Identity", description: "Logos, identity systems, and brand guidelines." },
  { slug: "social-media", label: "Social Media Designs", description: "Content design for social platforms and campaigns." },
  { slug: "posters-flyers", label: "Posters & Flyers", description: "Event, promotional, and announcement design." },
  { slug: "motion-video", label: "Motion & Video", description: "Animated and video-based creative work." },
  { slug: "client-projects", label: "Client Projects", description: "Selected commissioned work for real clients." },
];

export type AdminProjectListItem = {
  id: string;
  slug: string;
  title: string;
  client: string | null;
  year: number | null;
  summary: string;
  featured: boolean;
  published: boolean;
  orderIndex: number;
  createdAt: Date;
  updatedAt: Date;
  categories: { slug: string; label: string }[];
  tags: string[];
  coverImage: { url: string; altText: string | null } | null;
  video: { url: string; posterUrl: string | null } | null;
};

export const adminProjectSchema = z.object({
  id: z.string().optional(),
  slug: z.string().trim().min(1).optional(),
  title: z.string().trim().min(1, "Title is required."),
  client: z.string().trim().nullable().optional().or(z.literal("")),
  categorySlugs: z.array(z.string()).default([]),
  year: z.coerce.number().int().min(1900).max(2100).nullable().optional().or(z.literal("")),
  role: z.string().trim().nullable().optional().or(z.literal("")),
  summary: z.string().trim().min(1, "Summary is required."),
  description: z.string().trim().nullable().optional().or(z.literal("")),
  tags: z.array(z.string().trim().min(1)).default([]),
  featured: z.boolean().default(false),
  published: z.boolean().default(true),
  orderIndex: z.coerce.number().int().default(0),
  coverImage: z
    .object({
      url: z.string().url(),
      altText: z.string().optional().or(z.literal("")),
    })
    .nullable()
    .optional(),
  video: z
    .object({
      url: z.string().url(),
      posterUrl: z.string().url().nullable().optional(),
    })
    .nullable()
    .optional(),
  galleryImages: z
    .array(
      z.object({
        url: z.string().url(),
        altText: z.string().optional().or(z.literal("")),
      })
    )
    .default([]),
});

export async function ensureCategories() {
  await Promise.all(
    categorySeed.map(async (category) => {
      await prisma.category.upsert({
        where: { slug: category.slug },
        update: { label: category.label, description: category.description },
        create: { slug: category.slug, label: category.label, description: category.description },
      });
    })
  );
}

export async function getAdminCategories() {
  await ensureCategories();
  return prisma.category.findMany({ orderBy: { label: "asc" } });
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);
}

const uniqueNonEmptyTags = (tags: string[]) =>
  Array.from(new Set(tags.map((tag) => tag.trim()).filter(Boolean)));

async function attachProjectCategories(
  tx: Parameters<typeof prisma.$transaction>[0] extends (tx: infer T) => unknown ? T : never,
  projectId: string,
  categorySlugs: string[]
) {
  const uniqueSlugs = Array.from(new Set(categorySlugs.filter(Boolean)));
  if (!uniqueSlugs.length) return;

  const categories = await Promise.all(
    uniqueSlugs.map(async (slug) => {
      const category = await tx.category.findUnique({ where: { slug } });
      if (!category) throw new Error(`Category not found: ${slug}`);
      return category;
    })
  );

  await tx.projectCategory.createMany({
    data: categories.map((category) => ({ projectId, categoryId: category.id })),
  });
}

async function attachProjectTags(
  tx: Parameters<typeof prisma.$transaction>[0] extends (tx: infer T) => unknown ? T : never,
  projectId: string,
  tags: string[]
) {
  const uniqueTags = uniqueNonEmptyTags(tags);
  if (!uniqueTags.length) return;

  const tagRecords = await Promise.all(
    uniqueTags.map((tagName) =>
      tx.tag.upsert({ where: { name: tagName }, update: {}, create: { name: tagName } })
    )
  );

  await tx.projectTag.createMany({
    data: tagRecords.map((tag) => ({ projectId, tagId: tag.id })),
  });
}

async function attachProjectImages(
  tx: Parameters<typeof prisma.$transaction>[0] extends (tx: infer T) => unknown ? T : never,
  projectId: string,
  title: string,
  coverImage: { url: string; altText?: string } | null,
  galleryImages: { url: string; altText?: string }[],
  video: { url: string; posterUrl?: string | null } | null
) {
  const imageRows = [
    ...(coverImage
      ? [{ projectId, type: "COVER" as const, url: coverImage.url, altText: coverImage.altText?.trim() || title, orderIndex: 0 }]
      : []),
    ...galleryImages.map((image, index) => ({
      projectId,
      type: "GALLERY" as const,
      url: image.url,
      altText: image.altText?.trim() || `${title} gallery ${index + 1}`,
      orderIndex: index + 1,
    })),
    ...(video
      ? [{
          projectId,
          type: "VIDEO" as const,
          url: video.url,
          posterUrl: video.posterUrl || null,
          altText: title,
          orderIndex: galleryImages.length + 1,
        }]
      : []),
  ];

  if (!imageRows.length) return;
  await tx.projectImage.createMany({ data: imageRows });
}

export async function listProjectsForAdmin(): Promise<AdminProjectListItem[]> {
  await ensureCategories();

  const projects = await prisma.project.findMany({
    orderBy: { orderIndex: "asc" },
    include: {
      categories: { include: { category: true } },
      tags: { include: { tag: true } },
      images: { orderBy: { orderIndex: "asc" } },
    },
  });

  return projects.map((project) => {
    const coverImage = project.images.find((image) => image.type === "COVER");
    return {
      id: project.id,
      slug: project.slug,
      title: project.title,
      client: project.client,
      year: project.year,
      summary: project.summary,
      featured: project.featured,
      published: project.published,
      orderIndex: project.orderIndex,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
      categories: project.categories.map(({ category }) => ({ slug: category.slug, label: category.label })),
      tags: project.tags.map(({ tag }) => tag.name),
      coverImage: coverImage ? { url: coverImage.url, altText: coverImage.altText } : null,
      video: (() => {
        const video = project.images.find((image) => image.type === "VIDEO");
        return video ? { url: video.url, posterUrl: video.posterUrl } : null;
      })(),
    };
  });
}

export async function getProjectForAdmin(projectId: string) {
  await ensureCategories();

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      categories: { include: { category: true } },
      tags: { include: { tag: true } },
      images: { orderBy: { orderIndex: "asc" } },
    },
  });

  if (!project) return null;

  return {
    ...project,
    categorySlugs: project.categories.map(({ category }) => category.slug),
    tags: project.tags.map(({ tag }) => tag.name),
    coverImage: project.images.find((image) => image.type === "COVER")
      ? {
          url: project.images.find((image) => image.type === "COVER")?.url ?? "",
          altText: project.images.find((image) => image.type === "COVER")?.altText ?? "",
        }
      : null,
    video: project.images.find((image) => image.type === "VIDEO")
      ? {
          url: project.images.find((image) => image.type === "VIDEO")!.url,
          posterUrl: project.images.find((image) => image.type === "VIDEO")!.posterUrl,
        }
      : null,
    galleryImages: project.images
      .filter((image) => image.type === "GALLERY")
      .map((image) => ({ url: image.url, altText: image.altText ?? "" })),
  };
}

export async function createProject(input: z.infer<typeof adminProjectSchema>) {
  const parsed = adminProjectSchema.parse(input);
  const title = parsed.title.trim();
  const slugBase = parsed.slug?.trim() || slugify(title) || `project-${Date.now()}`;
  const projectSlug = `${slugBase}-${Date.now().toString(36)}`;

  const project = await prisma.project.create({
    data: {
      slug: projectSlug,
      title,
      client: parsed.client?.trim() || null,
      year: parsed.year ? Number(parsed.year) : null,
      role: parsed.role?.trim() || null,
      summary: parsed.summary.trim(),
      description: parsed.description?.trim() || null,
      featured: Boolean(parsed.featured),
      published: Boolean(parsed.published),
      orderIndex: Number(parsed.orderIndex ?? 0),
    },
  });

  await attachProjectCategories(prisma, project.id, parsed.categorySlugs);
  await attachProjectTags(prisma, project.id, parsed.tags);
  await attachProjectImages(
    prisma,
    project.id,
    title,
    parsed.coverImage ?? null,
    parsed.galleryImages,
    parsed.video ?? null
  );

  return project;
}

export async function updateProject(projectId: string, input: z.infer<typeof adminProjectSchema>) {
  const parsed = adminProjectSchema.parse(input);
  const title = parsed.title.trim();
  const slugBase = parsed.slug?.trim() || slugify(title) || `project-${projectId}`;

  await prisma.$transaction(async (tx) => {
    const existingVideo = parsed.video === undefined
      ? await tx.projectImage.findFirst({ where: { projectId, type: "VIDEO" } })
      : null;
    await tx.projectCategory.deleteMany({ where: { projectId } });
    await tx.projectTag.deleteMany({ where: { projectId } });
    await tx.projectImage.deleteMany({ where: { projectId } });

    await tx.project.update({
      where: { id: projectId },
      data: {
        slug: slugBase,
        title,
        client: parsed.client?.trim() || null,
        year: parsed.year ? Number(parsed.year) : null,
        role: parsed.role?.trim() || null,
        summary: parsed.summary.trim(),
        description: parsed.description?.trim() || null,
        featured: Boolean(parsed.featured),
        published: Boolean(parsed.published),
        orderIndex: Number(parsed.orderIndex ?? 0),
      },
    });

    await attachProjectCategories(tx, projectId, parsed.categorySlugs);
    await attachProjectTags(tx, projectId, parsed.tags);
    await attachProjectImages(
      tx,
      projectId,
      title,
      parsed.coverImage ?? null,
      parsed.galleryImages,
      parsed.video === undefined
        ? existingVideo
          ? { url: existingVideo.url, posterUrl: existingVideo.posterUrl }
          : null
        : parsed.video
    );
  });

  return { success: true };
}

export async function deleteProject(projectId: string) {
  await prisma.project.delete({ where: { id: projectId } });
  return { success: true };
}
