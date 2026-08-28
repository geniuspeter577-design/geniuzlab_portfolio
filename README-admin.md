# GENIUZLAB Admin Foundation

This repository now includes the protected admin foundation required for a private portfolio CMS.

## Required environment variables

Create a local `.env.local` file using the values from `.env.example`.

```bash
cp .env.example .env.local
```

Then replace these values:

- `DATABASE_URL` - PostgreSQL connection string
- `AUTH_SECRET` - Long random secret (minimum 32 characters)
- `AUTH_URL` - Local app URL, e.g. `http://localhost:3000`
- `ADMIN_EMAIL` - Your admin email
- `ADMIN_PASSWORD_HASH` - bcrypt hash of the admin password

## Generate a bcrypt hash locally

```bash
node -e "const bcrypt=require('bcryptjs'); console.log(bcrypt.hashSync('your-password', 10));"
```

## Generate Prisma client

```bash
npx prisma generate
```

## Run Prisma migrations

```bash
npx prisma migrate dev --name init
```

## Admin URL

- Local: `http://localhost:3000/admin/login`
- Production: `https://your-domain.com/admin/login`

## Notes

- The public portfolio remains unchanged and continues to use the static `projects.ts` source.
- The admin foundation is protected server-side.
- Database and auth are not exposed to browser code.
