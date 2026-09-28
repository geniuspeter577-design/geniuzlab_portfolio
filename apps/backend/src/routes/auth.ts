import { Router } from "express";
import bcrypt from "bcryptjs";
import { createHash, randomBytes } from "node:crypto";
import { z } from "zod";
import { env } from "../lib/env";
import { hasSmtpConfiguration, sendAdminPasswordResetEmail } from "../lib/email";
import { signAdminToken } from "../lib/jwt";
import { prisma } from "../lib/prisma";
import { requireAuth } from "../middleware/requireAuth";

const router = Router();

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const forgotPasswordSchema = z.object({ email: z.string().email() });

const resetSchema = z.object({
  token: z.string().min(32).max(128),
  password: z
    .string()
    .min(12)
    .max(72)
    .refine((password) => Buffer.byteLength(password, "utf8") <= 72),
});

const resetFailure = { error: "This password reset link is invalid or expired." };

router.post("/login", async (req, res) => {
  const parsed = credentialsSchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({ error: "Email and password are required." });
    return;
  }

  const email = parsed.data.email.toLowerCase();
  const { password } = parsed.data;

  if (email !== env.ADMIN_EMAIL.toLowerCase()) {
    res.status(401).json({ error: "Invalid email or password." });
    return;
  }

  let authState;
  try {
    authState = await prisma.adminAuthState.findUnique({ where: { id: "admin" } });
  } catch {
    res.status(503).json({ error: "Authentication is temporarily unavailable." });
    return;
  }

  const passwordHash =
    authState?.passwordHashSource === env.ADMIN_PASSWORD_HASH
      ? authState.passwordHash
      : env.ADMIN_PASSWORD_HASH;

  if (!passwordHash) {
    res.status(500).json({ error: "Admin password is not configured." });
    return;
  }

  const isValid = await bcrypt.compare(password, passwordHash);

  if (!isValid) {
    res.status(401).json({ error: "Invalid email or password." });
    return;
  }

  const token = signAdminToken({ email });
  res.json({ token, user: { email } });
});

router.post("/forgot-password", async (req, res) => {
  const parsed = forgotPasswordSchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({ error: "Enter a valid email address." });
    return;
  }

  if (!hasSmtpConfiguration()) {
    res.status(503).json({ error: "Password reset email is not configured." });
    return;
  }

  if (parsed.data.email.toLowerCase() !== env.ADMIN_EMAIL.toLowerCase()) {
    res.json({ message: "If this is the configured admin address, a password reset email will be sent." });
    return;
  }

  const token = randomBytes(32).toString("base64url");
  const tokenHash = createHash("sha256").update(token).digest("hex");
  const expiresAt = new Date(Date.now() + 30 * 60 * 1000);
  let tokenStored = false;

  try {
    const currentState = await prisma.adminAuthState.findUnique({ where: { id: "admin" } });
    const currentPasswordHash = currentState?.passwordHash || env.ADMIN_PASSWORD_HASH;
    const currentPasswordHashSource = currentState?.passwordHashSource || env.ADMIN_PASSWORD_HASH;

    if (currentPasswordHash) {
      await prisma.adminAuthState.upsert({
        where: { id: "admin" },
        create: {
          id: "admin",
          usedResetKeyHashes: [],
          resetUsedAt: null,
          resetTokenHash: tokenHash,
          resetTokenExpiresAt: expiresAt,
          passwordHash: currentPasswordHash,
          passwordHashSource: currentPasswordHashSource,
        },
        update: { resetTokenHash: tokenHash, resetTokenExpiresAt: expiresAt },
      });
      tokenStored = true;

      const resetUrl = new URL("/admin/reset-password", env.CORS_ORIGIN[0]);
      resetUrl.searchParams.set("token", token);
      await sendAdminPasswordResetEmail(env.ADMIN_EMAIL, resetUrl.toString());
    }
  } catch {
    if (tokenStored) {
      await prisma.adminAuthState.updateMany({
        where: { id: "admin", resetTokenHash: tokenHash },
        data: { resetTokenHash: null, resetTokenExpiresAt: null },
      }).catch(() => undefined);
    }
    console.error("Admin password reset email delivery failed.");
  }

  res.json({ message: "If this is the configured admin address, a password reset email will be sent." });
});

router.post("/reset-password", async (req, res) => {
  const parsed = resetSchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json(resetFailure);
    return;
  }

  const tokenHash = createHash("sha256").update(parsed.data.token).digest("hex");
  const passwordHash = await bcrypt.hash(parsed.data.password, 12);

  try {
    const updated = await prisma.adminAuthState.updateMany({
      where: {
        id: "admin",
        resetTokenHash: tokenHash,
        resetTokenExpiresAt: { gt: new Date() },
      },
      data: {
        resetTokenHash: null,
        resetTokenExpiresAt: null,
        resetUsedAt: new Date(),
        passwordHash,
        passwordHashSource: env.ADMIN_PASSWORD_HASH,
      },
    });

    if (updated.count !== 1) {
      res.status(400).json(resetFailure);
      return;
    }

    res.json({ success: true });
  } catch {
    res.status(503).json({ error: "Password reset is temporarily unavailable." });
  }
});

router.get("/me", requireAuth, (req, res) => {
  res.json({ user: { email: req.admin?.email } });
});

// Stateless JWTs: logout is a client-side concern (discard the token).
// This route exists so the client has a consistent endpoint to call.
router.post("/logout", (_req, res) => {
  res.json({ success: true });
});

export default router;
