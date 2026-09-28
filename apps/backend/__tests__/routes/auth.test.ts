import express from "express";
import bcrypt from "bcryptjs";
import { createHash } from "node:crypto";
import request from "supertest";
import { prisma } from "../../src/lib/prisma";
import { env } from "../../src/lib/env";
import { hasSmtpConfiguration, sendAdminPasswordResetEmail } from "../../src/lib/email";
import { signAdminToken } from "../../src/lib/jwt";
import { requireAuth } from "../../src/middleware/requireAuth";
import authRoutes from "../../src/routes/auth";

jest.mock("../../src/lib/env", () => ({
  env: {
    ADMIN_EMAIL: "geniuzlab577@gmail.com",
    ADMIN_PASSWORD_HASH: "",
    SMTP_HOST: "smtp.example.test",
    SMTP_PORT: 587,
    SMTP_SECURE: false,
    SMTP_USER: "mailer@example.test",
    SMTP_PASSWORD: "test-only-password",
    SMTP_FROM: "GENIUZLAB <mailer@example.test>",
    CORS_ORIGIN: ["http://localhost:3000"],
    AUTH_SECRET: "test-auth-secret-that-is-at-least-32-chars",
  },
}));

jest.mock("../../src/lib/email", () => ({
  hasSmtpConfiguration: jest.fn(() => true),
  sendAdminPasswordResetEmail: jest.fn(),
}));

jest.mock("../../src/lib/prisma", () => ({
  prisma: {
    adminAuthState: {
      findUnique: jest.fn(),
      upsert: jest.fn(),
      updateMany: jest.fn(),
    },
  },
}));

type StoredAuthState = {
  id: string;
  usedResetKeyHashes: string[];
  resetUsedAt: Date | null;
  resetTokenHash: string | null;
  resetTokenExpiresAt: Date | null;
  passwordHash: string;
  passwordHashSource: string;
};

const authState = prisma.adminAuthState as unknown as {
  findUnique: jest.Mock;
  upsert: jest.Mock;
  updateMany: jest.Mock;
};

const mockedHasSmtpConfiguration = jest.mocked(hasSmtpConfiguration);
const mockedSendResetEmail = jest.mocked(sendAdminPasswordResetEmail);

const app = express();
app.use(express.json());
app.use("/api/auth", authRoutes);
app.get("/protected", requireAuth, (_req, res) => res.json({ ok: true }));

let storedState: StoredAuthState | null;
let configuredPasswordHash: string;

beforeAll(async () => {
  configuredPasswordHash = await bcrypt.hash("ConfiguredPassword123!", 4);
});

beforeEach(() => {
  storedState = null;
  env.ADMIN_PASSWORD_HASH = "";
  mockedHasSmtpConfiguration.mockReturnValue(true);
  mockedSendResetEmail.mockResolvedValue(undefined);
  authState.findUnique.mockImplementation(async () => storedState);
  authState.upsert.mockImplementation(async ({ create, update }) => {
    storedState = storedState ? { ...storedState, ...update } : create;
    return storedState;
  });
  authState.updateMany.mockImplementation(async ({ where, data }) => {
    const expiry = where.resetTokenExpiresAt?.gt as Date | undefined;
    if (
      !storedState ||
      storedState.resetTokenHash !== where.resetTokenHash ||
      !storedState.resetTokenExpiresAt ||
      (expiry && storedState.resetTokenExpiresAt <= expiry)
    ) {
      return { count: 0 };
    }
    storedState = { ...storedState, ...data };
    return { count: 1 };
  });
});

describe("admin authentication routes", () => {
  it("continues to accept the configured password hash and rejects a wrong password", async () => {
    env.ADMIN_PASSWORD_HASH = configuredPasswordHash;

    const valid = await request(app)
      .post("/api/auth/login")
      .send({ email: "geniuzlab577@gmail.com", password: "ConfiguredPassword123!" });
    const invalid = await request(app)
      .post("/api/auth/login")
      .send({ email: "geniuzlab577@gmail.com", password: "wrong-password" });

    expect(valid.status).toBe(200);
    expect(valid.body.token).toBeTruthy();
    expect(invalid.status).toBe(401);
  });

  it("emails a hashed one-use reset token and keeps protected routes guarded", async () => {
    env.ADMIN_PASSWORD_HASH = configuredPasswordHash;
    const requestReset = await request(app)
      .post("/api/auth/forgot-password")
      .send({ email: "geniuzlab577@gmail.com" });

    const resetUrl = new URL(mockedSendResetEmail.mock.calls[0][1]);
    const token = resetUrl.searchParams.get("token");

    expect(requestReset.status).toBe(200);
    expect(mockedSendResetEmail).toHaveBeenCalledWith("geniuzlab577@gmail.com", expect.stringContaining("/admin/reset-password"));
    expect(token).toBeTruthy();
    expect(requestReset.text).not.toContain(token);
    expect(storedState?.resetTokenHash).toBe(createHash("sha256").update(token!).digest("hex"));
    expect(storedState?.resetTokenExpiresAt?.getTime()).toBeGreaterThan(Date.now());

    const reset = await request(app)
      .post("/api/auth/reset-password")
      .send({ token, password: "NewAdminPassword123!" });
    expect(reset.status).toBe(200);
    expect(storedState?.passwordHash).not.toBe("NewAdminPassword123!");
    expect(await bcrypt.compare("NewAdminPassword123!", storedState!.passwordHash)).toBe(true);

    const replay = await request(app)
      .post("/api/auth/reset-password")
      .send({ token, password: "AnotherAdminPassword123!" });
    const oldPassword = await request(app)
      .post("/api/auth/login")
      .send({ email: "geniuzlab577@gmail.com", password: "ConfiguredPassword123!" });
    const login = await request(app)
      .post("/api/auth/login")
      .send({ email: "geniuzlab577@gmail.com", password: "NewAdminPassword123!" });
    const denied = await request(app).get("/protected");
    const allowed = await request(app)
      .get("/protected")
      .set("Authorization", `Bearer ${login.body.token}`);

    expect(replay.status).toBe(400);
    expect(oldPassword.status).toBe(401);
    expect(login.status).toBe(200);
    expect(denied.status).toBe(401);
    expect(allowed.status).toBe(200);
  });

  it("does not reveal whether a non-admin email exists", async () => {
    const response = await request(app)
      .post("/api/auth/forgot-password")
      .send({ email: "someone@example.com" });

    expect(response.status).toBe(200);
    expect(response.body.message).toMatch(/If this is the configured admin address/);
    expect(mockedSendResetEmail).not.toHaveBeenCalled();
  });

  it("requires SMTP configuration without exposing account existence", async () => {
    mockedHasSmtpConfiguration.mockReturnValue(false);

    const response = await request(app)
      .post("/api/auth/forgot-password")
      .send({ email: "someone@example.com" });

    expect(response.status).toBe(503);
    expect(response.body.error).toBe("Password reset email is not configured.");
    expect(mockedSendResetEmail).not.toHaveBeenCalled();
  });

  it("rejects expired reset tokens", async () => {
    const token = "expired-token-for-auth-regression-test-0123456789";
    storedState = {
      id: "admin",
      usedResetKeyHashes: [],
      resetUsedAt: null,
      resetTokenHash: createHash("sha256").update(token).digest("hex"),
      resetTokenExpiresAt: new Date(Date.now() - 1000),
      passwordHash: configuredPasswordHash,
      passwordHashSource: configuredPasswordHash,
    };

    const response = await request(app)
      .post("/api/auth/reset-password")
      .send({ token, password: "NewAdminPassword123!" });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("This password reset link is invalid or expired.");
    expect(storedState.passwordHash).toBe(configuredPasswordHash);
  });

  it("keeps the existing logout endpoint behavior", async () => {
    const response = await request(app).post("/api/auth/logout");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ success: true });
  });
});