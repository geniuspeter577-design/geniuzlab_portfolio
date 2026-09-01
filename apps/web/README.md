# GeniuzLab Portfolio - Frontend (Next.js)

Frontend application for the GeniuzLab Portfolio website. Built with Next.js 16, React 19, and Tailwind CSS.

## Features

- 🎨 **Portfolio Showcase** - Beautiful project gallery with case studies
- 📱 **Responsive Design** - Mobile-first approach with Tailwind CSS
- 🔐 **Admin Panel** - Protected admin area for project management
- 🖼️ **Image Management** - Upload and organize project images
- ⚡ **Performance** - Static generation (SSG) and incremental static regeneration (ISR)
- 🔍 **SEO** - Server-side rendering for search engine optimization
- 🎯 **TypeScript** - Full type safety across the application

## Tech Stack

- **Framework**: Next.js 16
- **UI Library**: React 19
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **Authentication**: NextAuth.js
- **Form Validation**: Zod
- **Image Storage**: Vercel Blob
- **Utilities**: clsx, tailwind-merge

## Prerequisites

- Node.js 18+
- npm 8+
- PostgreSQL 14+ (for backend)
- Git

## Getting Started

### 1. Environment Setup

```bash
# From project root, environment is shared
cp .env.example .env.local

# Frontend-specific variables (optional, already in .env.local)
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=<from-root-.env.local>
BLOB_READ_WRITE_TOKEN=<vercel-blob-token>
```

### 2. Installation

```bash
# From root directory
npm install

# Install frontend-specific dependencies
cd apps/web
npm install
```

### 3. Start Development Server

```bash
# From root
npm run dev:web

# Or from apps/web
npm run dev
```

Opens [http://localhost:3000](http://localhost:3000)

## Project Structure

```
apps/web/
├── app/                      # Next.js App Router
│   ├── admin/               # Admin routes (protected)
│   │   ├── layout.tsx       # Admin layout
│   │   ├── page.tsx         # Admin dashboard
│   │   ├── login/
│   │   │   └── page.tsx     # Admin login
│   │   └── projects/        # Project management
│   │       ├── page.tsx     # Project list
│   │       ├── new/
│   │       │   └── page.tsx # Create project
│   │       └── [id]/
│   │           └── page.tsx # Edit project
│   ├── api/                 # API routes
│   │   ├── admin/          # Admin endpoints
│   │   ├── auth/           # NextAuth routes
│   │   └── [...]           # Other routes
│   ├── category/            # Category pages (dynamic)
│   ├── work/                # Portfolio pages
│   │   ├── page.tsx         # All projects
│   │   └── [slug]/          # Project detail
│   ├── about/
│   ├── services/
│   ├── contact/
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Homepage
│   └── globals.css          # Global styles
│
├── components/              # React components
│   ├── home/               # Homepage sections
│   │   ├── Hero.tsx
│   │   ├── FeaturedWork.tsx
│   │   └── CategoryShowcase.tsx
│   ├── layout/             # Layout components
│   │   ├── Navigation.tsx
│   │   ├── Footer.tsx
│   │   └── MobileNav.tsx
│   ├── work/               # Portfolio components
│   │   ├── ProjectCard.tsx
│   │   ├── ProjectGrid.tsx
│   │   ├── CaseStudyHeader.tsx
│   │   └── CategoryFilter.tsx
│   ├── sections/           # Page sections
│   │   └── CTASection.tsx
│   └── ui/                 # Reusable UI
│       ├── Button.tsx
│       ├── Tag.tsx
│       └── Reveal.tsx
│
├── lib/                     # Business logic & utilities
│   ├── api.ts              # API call helpers
│   ├── auth.ts             # Auth utilities
│   ├── projects.ts         # Project queries
│   ├── categories.ts       # Category definitions
│   ├── constants.ts        # Constants
│   ├── env.ts              # Environment config
│   ├── prisma.ts           # Prisma client
│   ├── admin-projects.ts   # Admin project schemas
│   └── utils.ts            # Helper functions
│
├── hooks/                   # Custom React hooks
│   └── useImageUpload.ts   # Image upload hook
│
├── public/                  # Static assets
│   └── images/
│       ├── brand/          # Brand assets
│       └── work/           # Portfolio images
│
├── auth.ts                  # NextAuth configuration
├── next.config.ts          # Next.js configuration
├── tsconfig.json           # TypeScript config
├── package.json            # Dependencies
└── README.md              # This file
```

## Key Files

### `auth.ts` - Authentication Configuration

Configures NextAuth.js for credential-based authentication:

```typescript
export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      async authorize(credentials) {
        // Validates email and password against admin credentials
      }
    })
  ],
  pages: {
    signIn: "/admin/login"
  }
});
```

### `lib/api.ts` - API Client

Centralized utility functions for backend API calls:

```typescript
export const api = {
  getProjects: () => fetch('/api/projects'),
  getProject: (slug: string) => fetch(`/api/projects/${slug}`),
  admin: {
    getProjects: (token) => fetchWithAuth('/api/admin/projects', token),
    createProject: (data, token) => fetchWithAuth(...),
    uploadImage: (file, token) => uploadToVercelBlob(...)
  }
};
```

### `components/layout/Navigation.tsx` - Main Navigation

Persistent navigation bar with logo, menu, and mobile nav toggle.

### `app/admin/projects/[id]/page.tsx` - Edit Project

Admin form to edit project details with image gallery management.

## Available Commands

```bash
# Development
npm run dev              # Start dev server (http://localhost:3000)

# Building
npm run build            # Build for production
npm start                # Start production server

# Code Quality
npm run lint             # Run ESLint
npm run type-check       # Check TypeScript (if configured)

# Other
npm run type-check       # Validate TypeScript
```

## Environment Variables

### Required

```env
# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-32-character-secret

# API
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Optional

```env
# Image Storage
BLOB_READ_WRITE_TOKEN=your-vercel-blob-token

# Analytics
NEXT_PUBLIC_GA_ID=your-google-analytics-id
```

See `.env.example` for all variables.

## Authentication Flow

### Public Access

1. User visits portfolio site (geniuzlab.com)
2. NextAuth not required
3. Public project data fetched from backend API

### Admin Access

1. User navigates to `/admin/login`
2. Enters email and password
3. NextAuth validates via backend
4. JWT token returned and stored in HTTP-only cookie
5. User redirected to `/admin/projects`
6. Token automatically sent with admin requests

### Protected Routes

```typescript
// Route protection example
import { auth } from "@/auth";

export default async function AdminPage() {
  const session = await auth();
  
  if (!session?.user) {
    redirect("/admin/login");
  }
  
  return <AdminDashboard />;
}
```

## Image Upload

Images are uploaded to Vercel Blob:

1. Admin selects image in `/admin/projects/new` or `/admin/projects/[id]`
2. Frontend sends image to `/api/admin/upload-image`
3. Vercel Blob stores image and returns URL
4. URL stored in project data in PostgreSQL
5. Image displayed via CDN

**Limits:**
- Max file size: 50MB
- Allowed types: JPEG, PNG, WebP
- Stored in Vercel Blob (not database)

## Styling

Uses Tailwind CSS 4 with custom configuration:

```tailwind
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### Fonts

- **Geist Sans** - Main font
- **Geist Mono** - Monospace
- **Outfit** - Display font (fallback to Creato Display)

### Dark Mode

Configured but not enforced (light mode by default).

## Performance Optimization

### Static Generation (SSG)

Homepage and category pages are statically generated at build time:

```typescript
export const revalidate = 3600; // ISR: revalidate every hour
```

### Image Optimization

All images optimized via Next.js Image component:

```tsx
<Image
  src={imageUrl}
  alt="Project image"
  width={1200}
  height={800}
  className="w-full h-auto"
/>
```

### Code Splitting

Admin routes are lazy-loaded only when needed, reducing initial bundle size.

## API Integration

### Fetching Projects

```typescript
// In app/work/page.tsx
const projects = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/projects`).then(r => r.json());
```

### Admin Operations

```typescript
// In app/admin/projects/new/page.tsx
const createProject = async (formData) => {
  const session = await auth();
  const token = session?.user?.token;
  
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/projects`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(formData)
  });
  
  return response.json();
};
```

## Type Safety

All components and pages are fully typed with TypeScript:

```typescript
interface Project {
  id: string;
  slug: string;
  title: string;
  description: string;
  images: ProjectImage[];
  categories: Category[];
  year: number;
}

export default function ProjectDetail({ project }: { project: Project }) {
  // ...
}
```

Import shared types from `@geniuzlab/shared`:

```typescript
import type { Project, Category } from '@geniuzlab/shared/types';
```

## Troubleshooting

### Port 3000 Already in Use

```bash
# Find and kill process
lsof -ti:3000 | xargs kill -9

# Or use different port
PORT=3002 npm run dev
```

### Module Not Found Errors

```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### NextAuth Not Working

- Verify `NEXTAUTH_SECRET` is set
- Check `NEXTAUTH_URL` matches domain
- Clear browser cookies
- Check browser console for errors

### Images Not Loading

- Verify `BLOB_READ_WRITE_TOKEN` is set
- Check image URL is correct
- Ensure Vercel Blob is configured
- Check CORS settings on backend

## Deployment

### Vercel (Recommended)

```bash
# Connect repository to Vercel
# Vercel auto-deploys on push to main

# Set environment variables in Vercel dashboard
# Deploy automatically
```

### Other Platforms

```bash
npm run build
npm start
```

See [HANDOVER_DOCS/DEPLOYMENT.md](../../HANDOVER_DOCS/DEPLOYMENT.md) for detailed deployment.

## Development Best Practices

1. **Use TypeScript** - No `any` types
2. **Component Composition** - Keep components small and focused
3. **Custom Hooks** - Extract reusable logic to hooks
4. **API Layer** - Use `lib/api.ts` for all API calls
5. **Styling** - Use Tailwind CSS classes, avoid inline styles
6. **Performance** - Use `next/image` for images, lazy-load when possible
7. **Testing** - Write tests for critical flows (auth, uploads)

## Contributing

1. Create feature branch: `git checkout -b feature/new-feature`
2. Make changes in `apps/web/`
3. Run lint: `npm run lint`
4. Build and test: `npm run build`
5. Commit and push
6. Create pull request

## Support

- See [../../DOCS/TECHNICAL.md](../../DOCS/TECHNICAL.md) for architecture
- See [../../DOCS/API.md](../../DOCS/API.md) for API documentation
- See [../../README.md](../../README.md) for monorepo overview

## License

MIT - See [../../LICENSE](../../LICENSE)
