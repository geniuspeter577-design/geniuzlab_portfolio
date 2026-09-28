import { Router } from "express";
import bcrypt from "bcryptjs";
import { createHash, timingSafeEqual } from "node:crypto";
import { z } from "zod";
import { env } from "../lib/env";
import { signAdminToken } from "../lib/jwt";
import { prisma } from "../lib/prisma";
import { requireAuth } from "../middleware/requireAuth";

const router = Router();

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const resetSchema = z.object({
  email: z.string().email(),
  recoveryKey: z.string().min(32).max(256),
  password: z
    .string()
    .min(12)
    .max(72)
    .refine((password) => Buffer.byteLength(password, "utf8") <= 72),
});

const resetFailure = { error: "Unable to reset the admin password with those details." };

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

router.post("/reset-password", async (req, res) => {
  const parsed = resetSchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json(resetFailure);
    return;
  }

  const { email, recoveryKey, password } = parsed.data;
  const configuredKey = env.ADMIN_PASSWORD_RESET_KEY;
  const expiresAt = Date.parse(env.ADMIN_PASSWORD_RESET_EXPIRES_AT);

  if (!configuredKey || !Number.isFinite(expiresAt) || expiresAt <= Date.now()) {
    res.status(503).json({ error: "Admin password reset is not configured or has expired." });
    return;
  }

  const submittedKey = Buffer.from(recoveryKey);
  const expectedKey = Buffer.from(configuredKey);
  const keyMatches =
    submittedKey.length === expectedKey.length && timingSafeEqual(submittedKey, expectedKey);

  if (email.toLowerCase() !== env.ADMIN_EMAIL.toLowerCase() || !keyMatches) {
    res.status(400).json(resetFailure);
    return;
  }

  const resetKeyHash = createHash("sha256").update(configuredKey).digest("hex");
  const passwordHash = await bcrypt.hash(password, 12);

  try {
    const currentState = await prisma.adminAuthState.findUnique({ where: { id: "admin" } });

    if (currentState?.usedResetKeyHashes.includes(resetKeyHash)) {
      res.status(400).json(resetFailure);
      return;
    }

    const data = {
      usedResetKeyHashes: { push: resetKeyHash },
      resetUsedAt: new Date(),
      passwordHash,
      passwordHashSource: env.ADMIN_PASSWORD_HASH,
    };

    if (currentState) {
      const claimed = await prisma.adminAuthState.updateMany({
        where: {
          id: "admin",
          NOT: { usedResetKeyHashes: { has: resetKeyHash } },
        },
        data,
      });

      if (claimed.count !== 1) {
        res.status(400).json(resetFailure);
        return;
      }
    } else {
      await prisma.adminAuthState.create({
        data: {
          id: "admin",
          usedResetKeyHashes: [resetKeyHash],
          resetUsedAt: new Date(),
          passwordHash,
          passwordHashSource: env.ADMIN_PASSWORD_HASH,
        },
      });
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
