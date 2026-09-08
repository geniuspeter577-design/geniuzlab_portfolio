import * as path from "path";
import { config } from "dotenv";
import { fileURLToPath } from "url";
import { PrismaClient } from "@prisma/client";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Database seed script.
 * Creates (or updates) the single admin user from env vars.
 *
 * Requires ADMIN_EMAIL and ADMIN_PASSWORD_HASH to be set in the environment
 * (see apps/backend/.env.example — generate the hash with the bcrypt
 * command in DOCS/README-admin.md before running this).
 *
 * Loads env from apps/backend/.env.local — the backend is the source of
 * truth for these secrets now that auth lives there. Run with:
 *   npm run db:seed   (from repo root or apps/backend)
 */

config({ path: path.resolve(__dirname, "../apps/backend/.env.local") });

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL;
  const passwordHash = process.env.ADMIN_PASSWORD_HASH;

  if (!email || !passwordHash) {
    throw new Error(
      "ADMIN_EMAIL and ADMIN_PASSWORD_HASH must be set in the environment before seeding. " +
        "Generate a hash with: node -e \"const bcrypt=require('bcryptjs'); console.log(bcrypt.hashSync('your-password', 10));\"",
    );
  }

  const user = await prisma.user.upsert({
    where: { email: email.toLowerCase() },
    update: { passwordHash },
    create: {
      email: email.toLowerCase(),
      passwordHash,
    },
  });

  console.warn(`Seeded admin user: ${user.email}`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
