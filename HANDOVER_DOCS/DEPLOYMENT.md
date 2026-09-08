# GeniuzLab Portfolio — Current Deployment Guide

## Architecture

- **Frontend:** Next.js on Vercel
- **Backend:** Express + Prisma on Render
- **Database:** MongoDB Atlas
- **Storage:** Cloudinary (preferred) or Vercel Blob fallback
- **Auth:** Backend-issued JWT for the admin panel

The browser talks to the Render API for admin actions and public project data. The frontend no longer needs `DATABASE_URL` or any storage/auth secret.

## 1. Local environment

Create exactly these two local files (do not commit them):

### `apps/backend/.env.local`

```env
NODE_ENV=development
PORT=3001
CORS_ORIGIN=http://localhost:3000
DATABASE_URL=YOUR_MONGODB_URI
AUTH_SECRET=YOUR_32_PLUS_CHARACTER_SECRET
ADMIN_EMAIL=admin@geniuzlab.com
ADMIN_PASSWORD_HASH=YOUR_BCRYPT_HASH
CLOUDINARY_CLOUD_NAME=YOUR_CLOUD_NAME
CLOUDINARY_API_KEY=YOUR_API_KEY
CLOUDINARY_API_SECRET=YOUR_API_SECRET
BLOB_READ_WRITE_TOKEN=YOUR_BLOB_TOKEN
```

Only the storage provider you use is required.

### `apps/web/.env.local`

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
```

Do not put `DATABASE_URL`, `AUTH_SECRET`, admin credentials, Cloudinary secrets, or Blob tokens in the frontend env file.

## 2. Run locally

```bash
npm install
npm run db:push
npm run db:seed
npm run dev
```

- Frontend: `http://localhost:3000`
- Backend health: `http://localhost:3001/health`
- Admin: `http://localhost:3000/admin/login`

## 3. Vercel frontend

Create a Vercel project from the repository. Because this is a workspace monorepo, keep the repository root as the project root and set the frontend build command to build `apps/web` from the workspace, or configure the Vercel project for the `apps/web` workspace as appropriate for your Vercel setup.

Set only this environment variable in Vercel:

```env
NEXT_PUBLIC_BACKEND_URL=https://YOUR-BACKEND.onrender.com
```

If you attach a custom frontend domain, keep this variable pointed at the Render API URL.

## 4. Render backend

Create a Render **Web Service** for the Express backend. Use the repository root so npm workspaces can resolve `packages/shared`.

Recommended commands:

```text
Build Command: npm install && npm run build --workspace=@geniuzlab/backend
Start Command: npm run start --workspace=@geniuzlab/backend
```

Render supplies `PORT`; the backend reads `process.env.PORT` through its environment validator and falls back to `3001` only for local development.

Set these Render environment variables:

```env
NODE_ENV=production
DATABASE_URL=YOUR_MONGODB_URI
AUTH_SECRET=YOUR_PRODUCTION_SECRET
ADMIN_EMAIL=admin@geniuzlab.com
ADMIN_PASSWORD_HASH=YOUR_BCRYPT_HASH
CORS_ORIGIN=https://YOUR-FRONTEND.vercel.app
CLOUDINARY_CLOUD_NAME=YOUR_CLOUD_NAME
CLOUDINARY_API_KEY=YOUR_API_KEY
CLOUDINARY_API_SECRET=YOUR_API_SECRET
BLOB_READ_WRITE_TOKEN=YOUR_BLOB_TOKEN
```

Do not manually set `PORT` on Render unless you have a specific reason; Render provides it.

## 5. MongoDB Atlas

Allow the deployed backend to connect to the cluster and use the production database/credentials you intend for the site. Keep the MongoDB connection string only in Render.

## 6. CORS

Set `CORS_ORIGIN` to the exact public frontend origin. Multiple origins may be comma-separated, for example:

```env
CORS_ORIGIN=https://YOUR-FRONTEND.vercel.app,https://www.yourdomain.com
```

## 7. Deploy order

1. Deploy the Render backend.
2. Open `/health` and confirm `{ "status": "ok" }`.
3. Set `NEXT_PUBLIC_BACKEND_URL` in Vercel to the live Render URL.
4. Deploy the Vercel frontend.
5. Test `/work`, a project detail page, `/admin/login`, project CRUD, and image upload.

## 8. Security checklist

- Never commit `.env.local` or production secrets.
- Rotate credentials that were exposed during development before production.
- Keep database/auth/storage secrets exclusively on Render.
- Only `NEXT_PUBLIC_BACKEND_URL` belongs in the frontend environment.
