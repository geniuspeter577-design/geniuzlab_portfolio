import express from "express";
import request from "supertest";
import { signAdminToken } from "../../src/lib/jwt";
import { attachAdminMedia, getAdminDashboard, listAdminInquiries, listAdminMedia, updateAdminInquiry } from "../../src/lib/admin-content";
import adminRoutes from "../../src/routes/admin";

jest.mock("../../src/lib/admin-content", () => ({
  attachAdminMedia: jest.fn(),
  getAdminDashboard: jest.fn(),
  listAdminInquiries: jest.fn(),
  listAdminMedia: jest.fn(),
  updateAdminInquiry: jest.fn(),
}));

jest.mock("../../src/lib/admin-projects", () => ({
  adminProjectSchema: { parse: jest.fn() },
  createProject: jest.fn(),
  deleteProject: jest.fn(),
  getAdminCategories: jest.fn(),
  getProjectForAdmin: jest.fn(),
  listProjectsForAdmin: jest.fn(),
  updateProject: jest.fn(),
}));

const app = express();
app.use(express.json());
app.use("/api/admin", adminRoutes);
const token = signAdminToken({ email: "admin@example.test" });
const authorized = (path: string) => request(app).get(path).set("Authorization", `Bearer ${token}`);

beforeEach(() => jest.clearAllMocks());

describe("authenticated admin content endpoints", () => {
  it("protects the dashboard and serves real aggregate data to an admin", async () => {
    const dashboard = { counts: { totalProjects: 3, publishedProjects: 2, draftProjects: 1, unreadInquiries: 0 }, recentProjects: [], recentInquiries: [] };
    jest.mocked(getAdminDashboard).mockResolvedValue(dashboard as never);

    const denied = await request(app).get("/api/admin/dashboard");
    const response = await authorized("/api/admin/dashboard");

    expect(denied.status).toBe(401);
    expect(response.status).toBe(200);
    expect(response.body).toEqual(dashboard);
  });

  it("filters real inquiry records and accepts only status updates", async () => {
    jest.mocked(listAdminInquiries).mockResolvedValue([] as never);
    jest.mocked(updateAdminInquiry).mockResolvedValue({ id: "inquiry-1", isFlagged: true } as never);

    const list = await authorized("/api/admin/inquiries?filter=flagged");
    const updated = await request(app)
      .patch("/api/admin/inquiries/inquiry-1")
      .set("Authorization", `Bearer ${token}`)
      .send({ isFlagged: true });
    const invalid = await request(app)
      .patch("/api/admin/inquiries/inquiry-1")
      .set("Authorization", `Bearer ${token}`)
      .send({ isFlagged: "yes" });

    expect(list.status).toBe(200);
    expect(listAdminInquiries).toHaveBeenCalledWith("flagged");
    expect(updated.status).toBe(200);
    expect(updateAdminInquiry).toHaveBeenCalledWith("inquiry-1", { isFlagged: true });
    expect(invalid.status).toBe(400);
  });

  it("lists uploaded project media and attaches only valid media to an existing project", async () => {
    jest.mocked(listAdminMedia).mockResolvedValue([] as never);
    jest.mocked(attachAdminMedia).mockResolvedValue({ id: "media-1" } as never);

    const listed = await authorized("/api/admin/media");
    const attached = await request(app)
      .post("/api/admin/media")
      .set("Authorization", `Bearer ${token}`)
      .send({ projectId: "project-1", url: "https://media.example.test/gallery.jpg", type: "GALLERY" });
    const invalid = await request(app)
      .post("/api/admin/media")
      .set("Authorization", `Bearer ${token}`)
      .send({ projectId: "project-1", url: "not-a-url", type: "GALLERY" });

    expect(listed.status).toBe(200);
    expect(attached.status).toBe(201);
    expect(attachAdminMedia).toHaveBeenCalledWith({ projectId: "project-1", url: "https://media.example.test/gallery.jpg", type: "GALLERY" });
    expect(invalid.status).toBe(400);
  });
});
