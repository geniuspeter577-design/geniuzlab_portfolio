import { listPublicProjects } from "../../src/lib/public-projects";
import { prisma } from "../../src/lib/prisma";

jest.mock("../../src/lib/prisma", () => ({
  prisma: {
    project: {
      findMany: jest.fn(),
    },
  },
}));

const projectRecord = {
  slug: "motion-project",
  title: "Motion project",
  client: null,
  year: 2026,
  role: null,
  summary: "A motion project",
  description: null,
  featured: false,
  orderIndex: 0,
  categories: [],
  tags: [],
  images: [
    {
      type: "COVER",
      url: "https://media.example.test/cover.jpg",
      posterUrl: null,
      altText: "Cover image",
      width: 1600,
      height: 1000,
    },
    {
      type: "VIDEO",
      url: "https://media.example.test/project.mp4",
      posterUrl: "https://media.example.test/poster.jpg",
      altText: null,
      width: null,
      height: null,
    },
    {
      type: "GALLERY",
      url: "https://media.example.test/gallery.jpg",
      posterUrl: null,
      altText: "Gallery image",
      width: 1600,
      height: 1000,
    },
  ],
};

describe("public project media mapping", () => {
  it("returns video and poster metadata while keeping gallery images", async () => {
    jest.mocked(prisma.project.findMany).mockResolvedValue([projectRecord] as never);

    const [project] = await listPublicProjects();

    expect(project.videoUrl).toBe("https://media.example.test/project.mp4");
    expect(project.videoPosterUrl).toBe("https://media.example.test/poster.jpg");
    expect(project.coverImage.src).toBe("https://media.example.test/poster.jpg");
    expect(project.gallery).toHaveLength(1);
    expect(project.gallery[0].src).toBe("https://media.example.test/gallery.jpg");
  });
});