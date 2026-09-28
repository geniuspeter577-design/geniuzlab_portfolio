import dotenv from "dotenv";
import path from "node:path";

dotenv.config({ path: path.resolve(process.cwd(), "../../.env") });

import { z } from "zod";

// Render/production provides environment variables directly. For local development
// load the backend-only .env.local file before validating them.
dotenv.config({ path: ".env.local" });

const envSchema = z.object({
  DATABASE_URL: z.string().url("DATABASE_URL must be a valid MongoDB URL.").default("mongodb://localhost:27017/geniuzlab"),
  AUTH_SECRET: z.string().min(32, "AUTH_SECRET must be at least 32 characters long.").default("development-secret-change-me-please-32-chars"),
  ADMIN_EMAIL: z.string().email("ADMIN_EMAIL must be a valid email.").default("admin@geniuzlab.com"),
  ADMIN_PASSWORD_HASH: z.string().min(1, "ADMIN_PASSWORD_HASH cannot be empty.").optional().default(""),
  ADMIN_PASSWORD_RESET_KEY: z.union([z.literal(""), z.string().min(32)]).default(""),
  ADMIN_PASSWORD_RESET_EXPIRES_AT: z.union([z.literal(""), z.string().datetime()]).default(""),
  PORT: z.coerce.number().int().positive().default(3001),
  CORS_ORIGIN: z
    .string()
    .optional()
    .default("http://localhost:3000")
    .transform((value) => value.split(",").map((origin) => origin.trim()).filter(Boolean)),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),
  BLOB_READ_WRITE_TOKEN: z.string().optional(),
});

export const env = envSchema.parse(process.env);
