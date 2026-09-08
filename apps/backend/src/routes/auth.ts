import { Router } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { env } from "../lib/env";
import { signAdminToken } from "../lib/jwt";
import { requireAuth } from "../middleware/requireAuth";

const router = Router();

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

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

  if (!env.ADMIN_PASSWORD_HASH) {
    res.status(500).json({ error: "Admin password is not configured." });
    return;
  }

  const isValid = await bcrypt.compare(password, env.ADMIN_PASSWORD_HASH);

  if (!isValid) {
    res.status(401).json({ error: "Invalid email or password." });
    return;
  }

  const token = signAdminToken({ email });
  res.json({ token, user: { email } });
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
