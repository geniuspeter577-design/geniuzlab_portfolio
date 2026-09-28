import express from "express";
import request from "supertest";
import { signAdminToken } from "../../src/lib/jwt";
import adminRoutes from "../../src/routes/admin";
import { uploadImage } from "../../src/lib/image-upload";

jest.mock("../../src/lib/image-upload", () => ({
  ...jest.requireActual("../../src/lib/image-upload"),
  uploadImage: jest.fn(),
}));

jest.mock("../../src/lib/admin-projects", () => ({
  ...jest.requireActual("../../src/lib/admin-projects"),
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

const authorization = `Bearer ${signAdminToken({ email: "geniuzlab577@gmail.com" })}`;
const mockedUploadImage = jest.mocked(uploadImage);

function validVideoBytes(contentType: string): Buffer {
  if (contentType === "video/webm") {
    return Buffer.from([0x1a, 0x45, 0xdf, 0xa3, 0x93, 0x42]);
  }

  const brand = contentType === "video/quicktime" ? "qt  " : "isom";
  return Buffer.concat([Buffer.from([0, 0, 0, 24]), Buffer.from("ftyp"), Buffer.from(brand), Buffer.alloc(8)]);
}

beforeEach(() => {
  mockedUploadImage.mockResolvedValue({
    url: "https://media.example.test/video.mp4",
    filename: "video.mp4",
    provider: "cloudinary",
    resourceType: "video",
  });
});

describe("admin project media upload", () => {
  it("requires the existing admin bearer token", async () => {
    const response = await request(app)
      .post("/api/admin/upload-image")
      .attach("file", Buffer.from("video"), { filename: "clip.mp4", contentType: "video/mp4" });

    expect(response.status).toBe(401);
    expect(mockedUploadImage).not.toHaveBeenCalled();
  });

  it.each([
    ["clip.mp4", "video/mp4"],
    ["clip.webm", "video/webm"],
    ["clip.mov", "video/quicktime"],
  ])("stores supported video %s through the existing provider", async (filename, contentType) => {
    const response = await request(app)
      .post("/api/admin/upload-image")
      .set("Authorization", authorization)
      .attach("file", validVideoBytes(contentType), { filename, contentType });

    expect(response.status).toBe(200);
    expect(response.body.url).toMatch(/^https:\/\//);
    expect(mockedUploadImage).toHaveBeenCalledWith(
      expect.any(Buffer),
      filename,
      undefined,
      expect.objectContaining({ isVideo: true, mimeType: contentType })
    );
  });

  it("rejects unsupported or mismatched media before storage", async () => {
    const unsupported = await request(app)
      .post("/api/admin/upload-image")
      .set("Authorization", authorization)
      .attach("file", Buffer.from("video"), { filename: "clip.avi", contentType: "video/x-msvideo" });
    const mismatched = await request(app)
      .post("/api/admin/upload-image")
      .set("Authorization", authorization)
      .attach("file", Buffer.from("video"), { filename: "clip.mov", contentType: "video/mp4" });

    expect(unsupported.status).toBe(415);
    expect(mismatched.status).toBe(415);
    expect(mockedUploadImage).not.toHaveBeenCalled();
  });
});