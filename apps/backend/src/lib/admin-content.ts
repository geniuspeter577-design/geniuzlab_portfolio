import { prisma } from "./prisma";

export type InquiryFilter = "all" | "unread" | "flagged" | "archived";

export async function getAdminDashboard() {
  const [totalProjects, publishedProjects, draftProjects, unreadInquiries, recentProjects, recentInquiries] = await Promise.all([
    prisma.project.count(),
    prisma.project.count({ where: { published: true } }),
    prisma.project.count({ where: { published: false } }),
    prisma.inquiry.count({ where: { isRead: false, isArchived: false } }),
    prisma.project.findMany({
      orderBy: [{ updatedAt: "desc" }],
      take: 6,
      include: {
        categories: { include: { category: true } },
        images: { orderBy: { orderIndex: "asc" } },
      },
    }),
    prisma.inquiry.findMany({
      where: { isArchived: false },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { id: true, name: true, email: true, disciplines: true, createdAt: true, isRead: true, isFlagged: true },
    }),
  ]);

  return {
    counts: { totalProjects, publishedProjects, draftProjects, unreadInquiries },
    recentProjects: recentProjects.map((project) => ({
      id: project.id,
      slug: project.slug,
      title: project.title,
      published: project.published,
      updatedAt: project.updatedAt,
      categories: project.categories.map(({ category }) => category.label),
      coverImage: project.images.find((image) => image.type === "COVER")?.url ?? null,
    })),
    recentInquiries,
  };
}

export async function listAdminInquiries(filter: InquiryFilter = "all") {
  const where = filter === "unread"
    ? { isRead: false, isArchived: false }
    : filter === "flagged"
      ? { isFlagged: true, isArchived: false }
      : filter === "archived"
        ? { isArchived: true }
        : {};

  return prisma.inquiry.findMany({ where, orderBy: [{ isRead: "asc" }, { createdAt: "desc" }] });
}

export async function updateAdminInquiry(id: string, changes: { isRead?: boolean; isFlagged?: boolean; isArchived?: boolean }) {
  return prisma.inquiry.update({ where: { id }, data: changes });
}

export async function listAdminMedia() {
  const media = await prisma.projectImage.findMany({
    orderBy: [{ createdAt: "desc" }, { orderIndex: "asc" }],
    include: { project: { select: { id: true, slug: true, title: true } } },
  });

  return media.map((item) => ({
    id: item.id,
    url: item.url,
    posterUrl: item.posterUrl,
    altText: item.altText,
    type: item.type,
    createdAt: item.createdAt,
    project: item.project,
  }));
}

export async function attachAdminMedia(input: {
  projectId: string;
  url: string;
  type: "GALLERY" | "VIDEO";
  posterUrl?: string | null;
  altText?: string;
}) {
  const project = await prisma.project.findUnique({
    where: { id: input.projectId },
    select: { id: true, title: true },
  });
  if (!project) throw new Error("Project not found.");

  if (input.type === "VIDEO") {
    const existingVideo = await prisma.projectImage.findFirst({
      where: { projectId: input.projectId, type: "VIDEO" },
      select: { id: true },
    });
    if (existingVideo) throw new Error("This project already has a video. Replace it from the project editor.");
  }

  const lastMedia = await prisma.projectImage.findFirst({
    where: { projectId: input.projectId },
    orderBy: { orderIndex: "desc" },
    select: { orderIndex: true },
  });

  return prisma.projectImage.create({
    data: {
      projectId: input.projectId,
      type: input.type,
      url: input.url,
      posterUrl: input.type === "VIDEO" ? input.posterUrl ?? null : null,
      altText: input.altText?.trim() || project.title,
      orderIndex: (lastMedia?.orderIndex ?? -1) + 1,
    },
  });
}
