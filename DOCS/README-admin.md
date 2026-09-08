# GENIUZLAB Admin

The admin CMS is served by `apps/backend` (Express + JWT auth). `apps/web`
only calls it — it holds no secrets and does not touch the database for
writes.

## Environment variables

Two files, not one — see `apps/web/.env.example` and
`apps/backend/.env.example` for the full list. In short:

- `apps/web/.env.local` needs `DATABASE_URL` (read-only, for public pages)
  and `NEXT_PUBLIC_BACKEND_URL`.
- `apps/backend/.env.local` needs `DATABASE_URL`, `AUTH_SECRET`,
  `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH`, the Cloudinary/Blob keys, `PORT`,
  and `CORS_ORIGIN`.

```bash
cp apps/web/.env.example apps/web/.env.local
cp apps/backend/.env.example apps/backend/.env.local
```

## Generate a bcrypt hash for the admin password

```bash
node -e "const bcrypt=require('bcryptjs'); console.log(bcrypt.hashSync('your-password', 10));"
```

Put the result in `ADMIN_PASSWORD_HASH` in `apps/backend/.env.local`.

## Generate Prisma client & push schema

```bash
npx prisma generate
npm run db:push
npm run db:seed   # creates/updates the admin user from ADMIN_EMAIL/ADMIN_PASSWORD_HASH
```

## How login works

1. The admin login page (`apps/web/app/admin/login`) POSTs email/password
   directly to `apps/backend`'s `POST /api/auth/login`.
2. The backend checks the credentials against `ADMIN_EMAIL` /
   `ADMIN_PASSWORD_HASH` and returns a JWT signed with `AUTH_SECRET`.
3. The frontend stores that JWT in `localStorage` and attaches it as
   `Authorization: Bearer <token>` on every subsequent call to the
   backend's `/api/admin/*` routes (see `apps/web/lib/admin-client.ts`).
4. The backend's `requireAuth` middleware verifies the token on every
   protected route.

## Admin URL

- Local: `http://localhost:3000/admin/login`
- Production: `https://your-frontend-domain.com/admin/login`

## Notes

- Public portfolio pages read from MongoDB directly via Prisma in
  `apps/web` (see `apps/web/lib/projects.ts`) — no auth involved, no
  change from before.
- All writes (create/update/delete project, image upload) go through
  `apps/backend`, protected by the JWT middleware.
