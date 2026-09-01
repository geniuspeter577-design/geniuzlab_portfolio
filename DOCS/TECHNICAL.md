# GeniuzLab Portfolio - Technical Documentation

## 📚 Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Technology Stack](#technology-stack)
4. [Project Structure](#project-structure)
5. [Getting Started](#getting-started)
6. [Development Workflow](#development-workflow)
7. [Database Schema](#database-schema)
8. [API Endpoints](#api-endpoints)
9. [Frontend Structure](#frontend-structure)
10. [Authentication](#authentication)
11. [Deployment](#deployment)

---

## Project Overview

**GeniuzLab Portfolio** is a professional portfolio and content management system for GENIUZLAB, a design studio founded by Otsaje Genius Peter. The platform allows:

- **Public visitors** to browse and view portfolio projects organized by category
- **Admin users** to manage and publish portfolio work through a protected CMS
- **Visual storytelling** through case studies, gallery images, and project metadata

### Project Goals
- Showcase high-quality design work professionally
- Provide an admin interface for easy project management
- Support multiple project categories and tagging
- Enable image uploads and storage
- Maintain clean separation between frontend and backend

---

## Architecture

This is a **monorepo** with clear separation of concerns:

```
geniuzlab_portfolio (monorepo root)
├── apps/
│   ├── web/         # Next.js frontend (React 19, Tailwind CSS)
│   ├── backend/     # Express.js API server (Prisma ORM)
│   └── mobile/      # Future mobile application
├── packages/
│   └── shared/      # TypeScript types, constants, utilities
├── prisma/          # Database schema and migrations
├── DOCS/            # Technical documentation
└── HANDOVER_DOCS/   # Deployment and operational guides
```

### Why Monorepo?

- **Unified versioning** - Single source of truth for dependencies
- **Code sharing** - Types and utilities shared between apps
- **Easier refactoring** - Change shared code once, applies everywhere
- **Scalability** - Easy to add new apps (mobile, admin dashboard) later
- **Workspace management** - `npm` handles dependency installation across all apps

### Communication

```
┌─────────────────────────────────────────────────────────┐
│                      Browser (Public)                    │
└──────────────────────┬──────────────────────────────────┘
                       │ HTTP/REST
                       ▼
        ┌──────────────────────────────────┐
        │   Frontend (apps/web)            │
        │  - Next.js 16 + React 19         │
        │  - Tailwind CSS                  │
        │  - Client-side JWT auth          │
        └──────────────────┬───────────────┘
                           │ HTTP/JSON
                           ▼
        ┌──────────────────────────────────┐
        │   Backend API (apps/backend)     │
        │  - Express.js                    │
        │  - Prisma ORM                    │
        │  - PostgreSQL                    │
        │  - JWT authentication            │
        └──────────────────┬───────────────┘
                           │
                           ▼
        ┌──────────────────────────────────┐
        │      PostgreSQL Database         │
        │  - Projects, Categories, Users   │
        │  - Tags, Images, Relationships   │
        └──────────────────────────────────┘
```

---

## Technology Stack

### Frontend (apps/web)

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| **Framework** | Next.js | 16.3.3 | React meta-framework with SSR/SSG |
| **UI Library** | React | 19.2.8 | Component library |
| **Language** | TypeScript | 5 | Type safety |
| **Styling** | Tailwind CSS | 4 | Utility-first CSS |
| **Storage** | Vercel Blob | 2.8.0 | Serverless image storage |
| **Validation** | Zod | 4.5.1 | Schema validation |
| **Utils** | clsx | 2.1.1 | Class name utilities |

### Backend (apps/backend)

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| **Framework** | Express.js | 4.18.2 | Web server & routing |
| **Language** | TypeScript | 5 | Type safety |
| **ORM** | Prisma | 6.13.0 | Database access layer |
| **Database** | PostgreSQL | 15+ | Relational database |
| **Auth** | JWT (jsonwebtoken) | 9.1.2 | Token-based authentication |
| **Password** | bcryptjs | 3.0.3 | Password hashing |
| **CORS** | cors | 2.8.5 | Cross-origin requests |
| **Validation** | Zod | 4.5.1 | Schema validation |

### Shared (packages/shared)

| Package | Purpose |
|---------|---------|
| **Types** | TypeScript interfaces (Project, Category, User, etc.) |
| **Constants** | Site configuration, navigation, category definitions |
| **Utils** | Helper functions, formatting, validation |

### Dev Tools

| Tool | Purpose |
|------|---------|
| **eslint** | Code linting |
| **tsx** | TypeScript execution for backend |
| **ts-node** | TypeScript Node.js support |
| **concurrently** | Run multiple scripts in parallel |
| **Prisma CLI** | Database migrations and generation |

---

## Project Structure

### Root Directory

```
geniuzlab_portfolio/
├── apps/                    # Application containers
├── packages/                # Shared code
├── prisma/                  # Database schema
├── DOCS/                    # Technical docs (this file)
├── HANDOVER_DOCS/           # Operational guides
├── .env.local               # Environment variables
├── package.json             # Monorepo root config
├── tsconfig.json            # Root TypeScript config
├── LICENSE                  # Project license
├── README.md                # Project README
└── AGENTS.md, CLAUDE.md     # AI assistant notes
```

### apps/web (Frontend)

```
apps/web/
├── app/                     # Next.js App Router
│   ├── api/                 # API route stubs (calls backend)
│   ├── admin/               # Protected admin pages
│   │   ├── login/           # Login page
│   │   ├── projects/        # Project management interface
│   │   │   ├── new/         # Create project
│   │   │   └── [id]/        # Edit project
│   │   └── layout.tsx       # Admin layout wrapper
│   ├── category/            # Category browsing
│   │   └── [category]/      # Dynamic category pages
│   ├── work/                # Portfolio pages
│   │   ├── [slug]/          # Project case study
│   │   └── page.tsx         # Work grid view
│   ├── about/               # About page
│   ├── services/            # Services page
│   ├── contact/             # Contact page
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Homepage
│   └── globals.css          # Global styles
├── components/              # React components
│   ├── home/                # Homepage sections
│   │   ├── Hero.tsx
│   │   ├── FeaturedWork.tsx
│   │   └── CategoryShowcase.tsx
│   ├── layout/              # Persistent layout
│   │   ├── Navigation.tsx
│   │   ├── Footer.tsx
│   │   └── MobileNav.tsx
│   ├── sections/            # Page sections
│   │   └── CTASection.tsx
│   ├── ui/                  # Reusable components
│   │   ├── Button.tsx
│   │   ├── Tag.tsx
│   │   └── Reveal.tsx
│   └── work/                # Portfolio components
│       ├── ProjectCard.tsx
│       ├── ProjectGrid.tsx
│       ├── CategoryFilter.tsx
│       └── CaseStudyHeader.tsx
├── hooks/                   # Custom React hooks
│   └── useImageUpload.ts    # Image upload with progress
├── public/                  # Static assets
│   └── images/
│       ├── brand/
│       └── work/
├── package.json             # Web app dependencies
├── next.config.ts           # Next.js configuration
├── tsconfig.json            # TypeScript config
├── postcss.config.mjs       # PostCSS + Tailwind
├── eslint.config.mjs        # ESLint rules
└── next-env.d.ts            # Next.js types
```

### apps/backend (Backend API)

```
apps/backend/
├── src/
│   ├── index.ts             # Express server entry point
│   ├── env.ts               # Environment validation
│   ├── auth/                # Authentication logic
│   │   └── auth.ts          # Auth utilities
│   ├── lib/
│   │   └── prisma.ts        # Prisma client singleton
│   ├── admin-projects.ts    # Project CRUD logic
│   ├── projects.ts          # Project queries
│   ├── routes/              # API route handlers (to create)
│   │   ├── admin.ts
│   │   ├── auth.ts
│   │   ├── projects.ts
│   │   └── images.ts
│   └── middleware/          # Express middleware (to create)
│       ├── auth.ts          # JWT verification
│       └── errorHandler.ts  # Error handling
├── dist/                    # Compiled JavaScript (generated)
├── package.json             # Backend dependencies
├── tsconfig.json            # TypeScript config
└── .env.local               # Backend env vars
```

### packages/shared (Shared Code)

```
packages/shared/
├── src/
│   ├── index.ts             # Main export
│   ├── types/
│   │   ├── index.ts
│   │   └── types.ts         # Project, Category, User, etc.
│   ├── constants/
│   │   ├── index.ts
│   │   ├── constants.ts     # Site config, navigation
│   │   └── categories.ts    # Portfolio categories
│   └── utils/
│       ├── index.ts
│       └── utils.ts         # Helper functions
├── package.json             # Shared package config
└── tsconfig.json            # TypeScript config
```

### prisma/ (Database)

```
prisma/
├── schema.prisma            # Data model definition
├── migrations/              # Database version history
│   └── [timestamp]_init/
│       └── migration.sql
└── seed.ts                  # Database seeding script
```

---

## Getting Started

### Prerequisites

- **Node.js** 18+ (recommended 20+)
- **npm** 9+ or **yarn** 4+
- **PostgreSQL** 13+ (local or cloud)
- **Git**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/geniuspeter577-design/geniuzlab_portfolio.git
   cd geniuzlab_portfolio
   ```

2. **Install dependencies** (installs for all workspaces)
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Copy example file
   cp .env.example .env.local
   
   # Edit with your values
   nano .env.local
   ```

   **Required variables:**
   ```env
   # Database
   DATABASE_URL="postgresql://user:password@localhost:5432/geniuzlab"
   
   # Authentication
   AUTH_SECRET="generate-a-32-character-random-string"
   AUTH_URL="http://localhost:3000"
   
   # Admin credentials
   ADMIN_EMAIL="admin@geniuzlab.com"
   ADMIN_PASSWORD_HASH="bcrypt-hash-of-your-password"
   
   # Image storage
   BLOB_READ_WRITE_TOKEN="vercel-blob-token"
   
   # Backend
   BACKEND_URL="http://localhost:3001"
   ```

4. **Set up the database**
   ```bash
   npm run db:push
   # or for migrations:
   npm run db:migrate
   ```

5. **Start development servers**
   ```bash
   # Run both frontend and backend concurrently
   npm run dev
   
   # Or run separately:
   npm run dev:web      # Frontend on http://localhost:3000
   npm run dev:backend  # Backend on http://localhost:3001
   ```

6. **Verify everything works**
   - Frontend: http://localhost:3000
   - Backend health: http://localhost:3001/health
   - Admin panel: http://localhost:3000/admin/login

---

## Development Workflow

### Building

```bash
# Build all workspaces
npm run build

# Build specific workspace
cd apps/web && npm run build
cd apps/backend && npm run build
```

### Testing & Linting

```bash
# Lint all code
npm run lint

# Lint specific workspace
cd apps/web && npm run lint
```

### Database Changes

```bash
# Create a new migration
npm run db:migrate -- --name add_feature

# Push schema to database
npm run db:push

# Seed database with initial data
npm run db:seed
```

### Working with TypeScript

All code is written in TypeScript with strict mode enabled.

**Import paths use aliases:**
```typescript
// In apps/web or apps/backend
import { utils } from '@/lib/utils';
import type { Project } from '@geniuzlab/shared';

// In packages/shared
export * from './types';
export * from './constants';
export * from './utils';
```

### Adding Dependencies

```bash
# Add to all workspaces
npm install express --workspaces

# Add to specific workspace
cd apps/web && npm install axios

# Add dev dependency to backend
cd apps/backend && npm install --save-dev @types/express
```

---

## Database Schema

### ER Diagram

```
User (Admin)
  ├── id (UUID)
  ├── email (unique)
  └── passwordHash

Project
  ├── id (UUID)
  ├── slug (unique)
  ├── title
  ├── client?
  ├── year
  ├── role?
  ├── summary
  ├── description?
  ├── featured
  ├── published
  ├── orderIndex
  └── timestamps (createdAt, updatedAt)
  ├─→ ProjectCategory (many-to-many)
  ├─→ ProjectTag (many-to-many)
  └─→ ProjectImage (one-to-many)

Category
  ├── id (UUID)
  ├── slug (unique)
  ├── label
  ├── description
  └── timestamps
  └─→ ProjectCategory (many-to-many)

ProjectCategory (junction table)
  ├── projectId (FK)
  └── categoryId (FK)

Tag
  ├── id (UUID)
  ├── name
  └── timestamps
  └─→ ProjectTag (many-to-many)

ProjectTag (junction table)
  ├── projectId (FK)
  └── tagId (FK)

ProjectImage
  ├── id (UUID)
  ├── projectId (FK)
  ├── type (enum: COVER, GALLERY)
  ├── url (Vercel Blob URL)
  ├── altText
  ├── width
  ├── height
  ├── orderIndex
  └── timestamps
```

### Key Relations

- **1:N** Project → ProjectImage (cascade delete)
- **M:N** Project ↔ Category (via ProjectCategory)
- **M:N** Project ↔ Tag (via ProjectTag)
- **1:1** User → (owns all content, conceptually)

---

## API Endpoints

### Authentication Routes

```
POST /api/auth/login
  Request: { email, password }
  Response: { accessToken, user }

POST /api/auth/logout
  Response: { success: true }
```

### Admin Routes (Protected)

```
GET /api/admin/projects
  Response: { projects: AdminProjectListItem[] }

POST /api/admin/projects
  Request: { title, slug, summary, categories, ... }
  Response: { project: Project }

GET /api/admin/projects/:id
  Response: { project: Project }

PUT /api/admin/projects/:id
  Request: { title, summary, ... }
  Response: { project: Project }

DELETE /api/admin/projects/:id
  Response: { success: true }

POST /api/admin/upload-image
  Request: FormData with file
  Response: { url: string, filename: string }

GET /api/admin/categories
  Response: { categories: Category[] }
```

### Public Routes

```
GET /api/projects
  Response: { projects: Project[] }

GET /api/projects/:slug
  Response: { project: Project }

GET /api/categories
  Response: { categories: Category[] }

GET /api/categories/:slug/projects
  Response: { projects: Project[] }
```

---

## Frontend Structure

### Pages & Routes

| Route | Component | Purpose |
|-------|-----------|---------|
| `/` | `app/page.tsx` | Homepage with hero, featured work, categories |
| `/work` | `app/work/page.tsx` | Portfolio grid with filtering |
| `/work/[slug]` | `app/work/[slug]/page.tsx` | Project case study detail |
| `/category/[slug]` | `app/category/[slug]/page.tsx` | Category-filtered projects |
| `/about` | `app/about/page.tsx` | About page |
| `/services` | `app/services/page.tsx` | Services page |
| `/contact` | `app/contact/page.tsx` | Contact page |
| `/admin/login` | `app/admin/login/page.tsx` | Admin login |
| `/admin/projects` | `app/admin/projects/page.tsx` | Project list (admin) |
| `/admin/projects/new` | `app/admin/projects/new/page.tsx` | Create project |
| `/admin/projects/[id]` | `app/admin/projects/[id]/page.tsx` | Edit project |

### Component Hierarchy

```
Layout
├── Navigation
├── Page Content
│   ├── Hero (home)
│   ├── FeaturedWork (home)
│   ├── CategoryShowcase (home)
│   ├── ProjectGrid (work)
│   ├── CaseStudyHeader (project detail)
│   └── ...
└── Footer
```

### Styling

- **Tailwind CSS 4** with utility-first approach
- **PostCSS** for processing
- **globals.css** for global styles
- Component-level styling via Tailwind classes
- Animation component: `Reveal.tsx` for scroll animations

---

## Authentication

### Frontend (Client-side)

1. User logs in at `/admin/login`
2. Credentials sent to `/api/auth/login` on backend
3. Backend returns `accessToken` (JWT)
4. Token stored in localStorage or cookie
5. Included in `Authorization` header for protected requests

### Backend (Server-side)

1. Receives login request with email/password
2. Validates against ADMIN_EMAIL and ADMIN_PASSWORD_HASH
3. Generates JWT token with user ID
4. Returns token to client
5. Verifies JWT on protected endpoints

### JWT Structure

```
Header: { alg: "HS256", typ: "JWT" }
Payload: { userId: "...", email: "...", iat: ..., exp: ... }
Signature: HMAC-SHA256(header.payload, AUTH_SECRET)
```

### Protected Requests

```typescript
// Frontend
const response = await fetch('/api/admin/projects', {
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
  }
});

// Backend middleware validates token
```

---

## Deployment

See [HANDOVER_DOCS/DEPLOYMENT.md](../HANDOVER_DOCS/DEPLOYMENT.md) for comprehensive deployment instructions.

Quick summary:
- **Frontend**: Deploy to Vercel, Netlify, or any static host
- **Backend**: Deploy to Railway, Render, or own VPS
- **Database**: Cloud PostgreSQL (Supabase, Railway, AWS RDS)
- **Images**: Vercel Blob or S3-compatible storage

---

## Troubleshooting

### Port Already in Use

```bash
# Find process using port 3000
lsof -i :3000

# Kill process
kill -9 <PID>
```

### Database Connection Issues

```bash
# Verify PostgreSQL is running
psql --version

# Check connection string
echo $DATABASE_URL

# Test connection
npx prisma db execute --stdin < /dev/null
```

### TypeScript Errors

```bash
# Regenerate Prisma types
npx prisma generate

# Clear TypeScript cache
rm -rf .next dist
npm run build
```

### Module Not Found

```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Clear Next.js cache
rm -rf .next
```

---

## Next Steps

- Review [HANDOVER_DOCS](../HANDOVER_DOCS/) for deployment guides
- Set up CI/CD pipeline (GitHub Actions, GitLab CI, etc.)
- Configure monitoring and error tracking
- Plan content migration strategy
- Set up backup and recovery procedures

