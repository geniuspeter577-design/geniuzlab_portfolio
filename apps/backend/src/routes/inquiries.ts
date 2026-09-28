import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";

const router = Router();

const inquirySchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(320),
  disciplines: z.array(z.string().trim().min(1).max(80)).min(1).max(7),
  budgetRange: z.string().trim().max(80).optional().nullable(),
  brief: z.string().trim().min(10).max(5000),
});

router.post("/", async (req, res) => {
  const parsed = inquirySchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({ error: "Review the highlighted fields and send your brief again.", fields: parsed.error.flatten().fieldErrors });
    return;
  }

  try {
    const inquiry = await prisma.inquiry.create({
      data: {
        ...parsed.data,
        email: parsed.data.email.toLowerCase(),
      },
      select: { id: true, createdAt: true },
    });
    res.status(201).json({ inquiry });
  } catch {
    res.status(503).json({ error: "Your brief could not be saved right now. Please try again or use the direct contact links." });
  }
});

export default router;