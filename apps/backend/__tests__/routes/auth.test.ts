import express from "express";
import bcrypt from "bcryptjs";
import request from "supertest";
import { prisma } from "../../src/lib/prisma";
import { env } from "../../src/lib/env";
import { signAdminToken } from "../../src/lib/jwt";
import { requireAuth } from "../../src/middleware/requireAuth";
import authRoutes from "../../src/routes/auth";

jest.mock("../../src/lib/env", () => ({
  env: {
    ADMIN_EMAIL: "admin@geniuzlab.com",
    ADMIN_PASSWORD_HASH: "",
    ADMIN_PASSWORD_RESET_KEY: "test-recovery-key-0123456789012345",
    ADMIN_PASSWORD_RESET_EXPIRES_AT: "2099-01-01T00:00:00.000Z",
    AUTH_SECRET: "test-auth-secret-that-is-at-least-32-chars",
  },
}));

jest.mock("../../src/lib/prisma", () => ({
  prisma: {
    adminAuthState: {
      findUnique: jest.fn(),
      create: jest.fn(),
      updateMany: jest.fn(),
    },
  },
}));

type StoredAuthState = {
  id: string;
  usedResetKeyHashes: string[];
  resetUsedAt: Date;
  passwordHash: string;
  passwordHashSource: string;
};

const authState = prisma.adminAuthState as unknown as {
  findUnique: jest.Mock;
  create: jest.Mock;
  updateMany: jest.Mock;
};

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
  authState.findUnique.mockImplementation(async () => storedState);
  authState.create.mockImplementation(async ({ data }) => {
    if (storedState) throw new Error("Admin auth state already exists");
    storedState = data;
    return data;
  });
  authState.updateMany.mockImplementation(async ({ where, data }) => {
    if (!storedState || storedState.usedResetKeyHashes.includes(where.NOT.usedResetKeyHashes.has)) {
      return { count: 0 };
    }
    storedState = {
      ...storedState,
      ...data,
      usedResetKeyHashes: [...storedState.usedResetKeyHashes, ...data.usedResetKeyHashes.push],
    };
    return { count: 1 };
  });
});

describe("admin authentication routes", () => {
  it("continues to accept the configured password hash and rejects a wrong password", async () => {
    env.ADMIN_PASSWORD_HASH = configuredPasswordHash;

    const valid = await request(app)
      .post("/api/auth/login")
      .send({ email: "admin@geniuzlab.com", password: "ConfiguredPassword123!" });
    const invalid = await request(app)
      .post("/api/auth/login")
      .send({ email: "admin@geniuzlab.com", password: "wrong-password" });

    expect(valid.status).toBe(200);
    expect(valid.body.token).toBeTruthy();
    expect(invalid.status).toBe(401);
  });

  it("changes the admin password once and keeps protected routes guarded", async () => {
    const reset = await request(app)
      .post("/api/auth/reset-password")
      .send({
        email: "admin@geniuzlab.com",
        recoveryKey: "test-recovery-key-0123456789012345",
        password: "NewAdminPassword123!",
      });

    expect(reset.status).toBe(200);
    expect(storedState?.passwordHash).not.toBe("NewAdminPassword123!");
    expect(await bcrypt.compare("NewAdminPassword123!", storedState!.passwordHash)).toBe(true);

    const replay = await request(app)
      .post("/api/auth/reset-password")
      .send({
        email: "admin@geniuzlab.com",
        recoveryKey: "test-recovery-key-0123456789012345",
        password: "AnotherAdminPassword123!",
      });
    const oldPassword = await request(app)
      .post("/api/auth/login")
      .send({ email: "admin@geniuzlab.com", password: "wrong-password" });
    const login = await request(app)
      .post("/api/auth/login")
      .send({ email: "admin@geniuzlab.com", password: "NewAdminPassword123!" });
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
      .post("/api/auth/reset-password")
      .send({
        email: "someone@example.com",
        recoveryKey: "test-recovery-key-0123456789012345",
        password: "NewAdminPassword123!",
      });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("Unable to reset the admin password with those details.");
    expect(authState.create).not.toHaveBeenCalled();
  });

  it("never accepts a recovery key again after it was rotated out", async () => {
    await request(app)
      .post("/api/auth/reset-password")
      .send({
        email: "admin@geniuzlab.com",
        recoveryKey: "test-recovery-key-0123456789012345",
        password: "FirstAdminPassword123!",
      });

    env.ADMIN_PASSWORD_RESET_KEY = "second-recovery-key-012345678901234567";
    const secondReset = await request(app)
      .post("/api/auth/reset-password")
      .send({
        email: "admin@geniuzlab.com",
        recoveryKey: "second-recovery-key-012345678901234567",
        password: "SecondAdminPassword123!",
      });

    env.ADMIN_PASSWORD_RESET_KEY = "test-recovery-key-0123456789012345";
    const replay = await request(app)
      .post("/api/auth/reset-password")
      .send({
        email: "admin@geniuzlab.com",
        recoveryKey: "test-recovery-key-0123456789012345",
        password: "ThirdAdminPassword123!",
      });

    expect(secondReset.status).toBe(200);
    expect(replay.status).toBe(400);
    env.ADMIN_PASSWORD_RESET_KEY = "test-recovery-key-0123456789012345";
  });
});