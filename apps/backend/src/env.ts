import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().url("DATABASE_URL must be a valid PostgreSQL URL.").optional().default("postgresql://postgres:postgres@localhost:5432/geniuzlab"),
  AUTH_SECRET: z
    .string()
    .min(32, "AUTH_SECRET must be at least 32 characters long.")
    .default("development-secret-change-me-please-32-chars"),
  AUTH_URL: z.string().url("AUTH_URL must be a valid URL.").optional().or(z.literal("")).default("http://localhost:3000"),
  ADMIN_EMAIL: z.string().email("ADMIN_EMAIL must be a valid email.").default("admin@geniuzlab.com"),
  ADMIN_PASSWORD_HASH: z
    .string()
    .min(1, "ADMIN_PASSWORD_HASH cannot be empty.")
    .optional()
    .default(""),
});

export const env = envSchema.parse(process.env);
