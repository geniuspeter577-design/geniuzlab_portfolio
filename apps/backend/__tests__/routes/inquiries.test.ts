import express from "express";
import request from "supertest";
import { prisma } from "../../src/lib/prisma";
import inquiryRoutes from "../../src/routes/inquiries";

jest.mock("../../src/lib/prisma", () => ({
  prisma: {
    inquiry: { create: jest.fn() },
  },
}));

const app = express();
app.use(express.json());
app.use("/api/inquiries", inquiryRoutes);

beforeEach(() => {
  jest.clearAllMocks();
  jest.mocked(prisma.inquiry.create).mockResolvedValue({
    id: "inquiry-1",
    createdAt: new Date("2026-09-28T12:00:00.000Z"),
  } as never);
});

describe("public inquiry submissions", () => {
  const validInquiry = {
    name: "A real visitor",
    email: "VISITOR@example.com",
    disciplines: ["graphic-design", "branding-identity"],
    budgetRange: "open-to-discussion",
    brief: "We need a brand identity for an upcoming launch.",
  };

  it("persists a validated brief and normalizes the email", async () => {
    const response = await request(app).post("/api/inquiries").send(validInquiry);

    expect(response.status).toBe(201);
    expect(response.body.inquiry.id).toBe("inquiry-1");
    expect(prisma.inquiry.create).toHaveBeenCalledWith({
      data: { ...validInquiry, email: "visitor@example.com" },
      select: { id: true, createdAt: true },
    });
  });

  it("rejects incomplete or overlong briefs without writing them", async () => {
    const response = await request(app).post("/api/inquiries").send({ ...validInquiry, brief: "short" });

    expect(response.status).toBe(400);
    expect(response.body.fields.brief).toBeTruthy();
    expect(prisma.inquiry.create).not.toHaveBeenCalled();
  });

  it("returns a retryable response when persistence is unavailable", async () => {
    jest.mocked(prisma.inquiry.create).mockRejectedValueOnce(new Error("database unavailable"));

    const response = await request(app).post("/api/inquiries").send(validInquiry);

    expect(response.status).toBe(503);
    expect(response.body.error).toContain("could not be saved");
  });
});
