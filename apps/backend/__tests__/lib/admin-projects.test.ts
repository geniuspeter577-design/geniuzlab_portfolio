import { adminProjectSchema, createProject, updateProject } from "../../src/lib/admin-projects";
import { listPublicProjects } from "../../src/lib/public-projects";
import { prisma } from "../../src/lib/prisma";

jest.mock("../../src/lib/prisma", () => ({
  prisma: {
    project: { create: jest.fn(), update: jest.fn(), findMany: jest.fn() },
    $transaction: jest.fn(),
    category: { findUnique: jest.fn() },
    projectCategory: { createMany: jest.fn() },
    tag: { upsert: jest.fn() },
    projectTag: { createMany: jest.fn() },
    projectImage: { createMany: jest.fn() },
  },
}));

beforeEach(() => {
  jest.clearAllMocks();
  jest.mocked(prisma.project.create).mockResolvedValue({ id: "project-1" } as never);
  jest.mocked(prisma.category.findUnique).mockResolvedValue({ id: "category-1" } as never);
});

const validProject = {
  title: "Portfolio project",
  summary: "A portfolio project",
  categorySlugs: ["motion-video"],
};

describe("admin project media persistence", () => {
  it("accepts and stores video with poster, cover, and gallery media", async () => {
    const payload = adminProjectSchema.parse({
      ...validProject,
      coverImage: { url: "https://media.example.test/cover.jpg", altText: "Cover" },
      galleryImages: [{ url: "https://media.example.test/gallery.jpg", altText: "Gallery" }],
      video: {
        url: "https://media.example.test/project.mp4",
        posterUrl: "https://media.example.test/poster.jpg",
      },
    });

    await createProject(payload);

    expect(prisma.projectImage.createMany).toHaveBeenCalledWith({
      data: [
        expect.objectContaining({ type: "COVER", url: "https://media.example.test/cover.jpg" }),
        expect.objectContaining({ type: "GALLERY", url: "https://media.example.test/gallery.jpg" }),
        expect.objectContaining({
          type: "VIDEO",
          url: "https://media.example.test/project.mp4",
          posterUrl: "https://media.example.test/poster.jpg",
        }),
      ],
    });
  });

  it("keeps legacy image-only project payloads valid", async () => {
    const payload = adminProjectSchema.parse({
      ...validProject,
      coverImage: { url: "https://media.example.test/cover.jpg" },
      galleryImages: [],
    });

    await createProject(payload);

    expect(prisma.projectImage.createMany).toHaveBeenCalledWith({
      data: [expect.objectContaining({ type: "COVER", url: "https://media.example.test/cover.jpg" })],
    });
  });

  it("preserves the submitted video URL through create and public mapping", async () => {
    const payload = adminProjectSchema.parse({
      ...validProject,
      coverImage: { url: "https://media.example.test/cover.jpg", altText: "Cover" },
      galleryImages: [],
      video: {
        url: "https://media.example.test/roundtrip.mp4",
        posterUrl: "https://media.example.test/roundtrip-poster.jpg",
      },
    });

    await createProject(payload);

    const createdImages = jest.mocked(prisma.projectImage.createMany).mock.calls.at(-1)?.[0]?.data as Array<Record<string, unknown>>;
    const videoRow = createdImages.find((image) => image.type === "VIDEO");

    expect(videoRow).toEqual(expect.objectContaining({
      type: "VIDEO",
      url: "https://media.example.test/roundtrip.mp4",
      posterUrl: "https://media.example.test/roundtrip-poster.jpg",
    }));

    jest.mocked(prisma.project.findMany).mockResolvedValue([
      {
        slug: "roundtrip-project",
        title: "Roundtrip project",
        client: null,
        year: 2026,
        role: null,
        summary: "A roundtrip project",
        description: null,
        featured: false,
        published: true,
        orderIndex: 0,
        categories: [],
        tags: [],
        images: [
          {
            type: "VIDEO",
            url: "https://media.example.test/roundtrip.mp4",
            posterUrl: "https://media.example.test/roundtrip-poster.jpg",
            altText: "Roundtrip video",
            width: null,
            height: null,
          },
        ],
      },
    ] as never);

    const [project] = await listPublicProjects();

    expect(project.videoUrl).toBe("https://media.example.test/roundtrip.mp4");
    expect(project.videoPosterUrl).toBe("https://media.example.test/roundtrip-poster.jpg");
  });

  it("preserves existing video on legacy updates that omit the video field", async () => {
    const transactionClient = {
      projectCategory: { deleteMany: jest.fn(), createMany: jest.fn() },
      projectTag: { deleteMany: jest.fn(), createMany: jest.fn() },
      projectImage: {
        findFirst: jest.fn().mockResolvedValue({
          url: "https://media.example.test/existing.mp4",
          posterUrl: "https://media.example.test/existing-poster.jpg",
        }),
        deleteMany: jest.fn(),
        createMany: jest.fn(),
      },
      project: { update: jest.fn() },
      category: { findUnique: jest.fn().mockResolvedValue({ id: "category-1" }) },
      tag: { upsert: jest.fn() },
    };
    const transaction = prisma.$transaction as unknown as jest.Mock;
    transaction.mockImplementation(async (callback: (client: unknown) => Promise<unknown>) => callback(transactionClient));
    const payload = adminProjectSchema.parse({ ...validProject, galleryImages: [] });

    await updateProject("project-1", payload);

    expect(transactionClient.projectImage.findFirst).toHaveBeenCalledWith({
      where: { projectId: "project-1", type: "VIDEO" },
    });
    expect(transactionClient.projectImage.createMany).toHaveBeenCalledWith({
      data: [expect.objectContaining({
        type: "VIDEO",
        url: "https://media.example.test/existing.mp4",
        posterUrl: "https://media.example.test/existing-poster.jpg",
      })],
    });
  });
});