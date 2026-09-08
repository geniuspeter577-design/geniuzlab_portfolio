import { z } from "zod";

export const adminProjectSchema = z.object({
  id: z.string().optional(),
  slug: z.string().trim().min(1).optional(),
  title: z.string().trim().min(1, "Title is required."),
  client: z.string().trim().nullable().optional().or(z.literal("")),
  categorySlugs: z.array(z.string()).default([]),
  year: z.coerce.number().int().min(1900).max(2100).nullable().optional().or(z.literal("")),
  role: z.string().trim().nullable().optional().or(z.literal("")),
  summary: z.string().trim().min(1, "Summary is required."),
  description: z.string().trim().nullable().optional().or(z.literal("")),
  tags: z.array(z.string().trim().min(1)).default([]),
  featured: z.boolean().default(false),
  published: z.boolean().default(true),
  orderIndex: z.coerce.number().int().default(0),
  coverImage: z
    .object({
      url: z.string().url(),
      altText: z.string().optional().or(z.literal("")),
    })
    .nullable()
    .optional(),
  galleryImages: z
    .array(
      z.object({
        url: z.string().url(),
        altText: z.string().optional().or(z.literal("")),
      })
    )
    .default([]),
});
