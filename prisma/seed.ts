/**
 * Database seed script.
 * Creates (or updates) the single admin user from env vars.
 *
 * Requires ADMIN_EMAIL and ADMIN_PASSWORD_HASH to be set in the environment
 * (see .env.example — generate the hash with the bcrypt command in
 * DOCS/README-admin.md before running this).
 *
 * Run with: npm run db:seed
 */
import { PrismaClient } from "@prisma/client";

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
