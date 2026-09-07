# GeniuzLab Portfolio - Development Setup Guide

## 📋 Quick Start (Local Development)

### Prerequisites
- Node.js 18+ 
- npm or yarn
- MongoDB (Atlas free tier or local)
- Git

### Step 1: Clone & Install

```bash
# Clone the repository
git clone https://github.com/geniuspeter577-design/geniuzlab_portfolio.git
cd geniuzlab_portfolio

# Install dependencies for all workspaces
npm install
```

### Step 2: Database Setup

```bash
# Set up MongoDB Atlas or local MongoDB
# Get connection string from MongoDB Atlas dashboard or use local: mongodb://localhost:27017

# Copy example env and configure per-app:
cp .env.example apps/web/.env.local
cp .env.example apps/backend/.env.local

# Edit each .env.local with your values:
# - DATABASE_URL: your MongoDB connection string
# - AUTH_SECRET: generate with openssl rand -hex 32
# - ADMIN_EMAIL / ADMIN_PASSWORD_HASH: your admin credentials

# Generate Prisma client
npx prisma generate

# Push schema to database
npm run db:push

# (Optional) Seed database with admin user
npm run db:seed
```

### Step 3: Configure Authentication

```bash
# Generate a secure 32-character AUTH_SECRET
openssl rand -hex 32

# Generate admin password hash (replace 'your-password' with desired password)
node -e "const bcrypt=require('bcryptjs'); console.log(bcrypt.hashSync('your-password', 10));"

# Update apps/web/.env.local and apps/backend/.env.local with:
AUTH_SECRET=<your-generated-secret>
AUTH_URL=http://localhost:3000
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD_HASH=<your-generated-hash>

# Note: The seed script (npm run db:seed) loads from prisma/.env
# Copy ADMIN_EMAIL and ADMIN_PASSWORD_HASH to prisma/.env as well
```

### Step 4: Run Development Servers

```bash
# Start both frontend and backend concurrently
npm run dev

# Or start them separately in different terminals:
npm run dev:web      # Frontend on http://localhost:3000
npm run dev:backend  # Backend API on http://localhost:3001
```

### Step 5: Access the Application

- **Frontend**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin/login
- **Backend API**: http://localhost:3001/api

---

## 🏗️ Project Structure

```
geniuzlab_portfolio/
├── apps/
│   ├── web/                 # Next.js Frontend
│   │   ├── app/            # App Router (pages, layouts)
│   │   ├── components/     # React components
│   │   ├── lib/            # Frontend utilities, API calls
│   │   ├── hooks/          # Custom React hooks
│   │   ├── public/         # Static assets
│   │   ├── auth.ts         # NextAuth configuration
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── backend/            # Express.js API Server
│   │   ├── src/
│   │   │   ├── index.ts    # Server entry point
│   │   │   ├── lib/        # Business logic
│   │   │   ├── routes/     # API endpoints
│   │   │   └── middleware/ # Express middleware
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── mobile/             # (Future) React Native mobile app
│
├── packages/
│   └── shared/             # Shared types, constants, utilities
│       ├── src/
│       │   ├── types/      # TypeScript interfaces
│       │   ├── constants/  # Site configuration
│       │   └── utils/      # Helper functions
│       └── package.json
│
├── prisma/
│   ├── schema.prisma       # Database schema
│   ├── migrations/         # Database migrations
│   └── seed.ts            # Database seeding
│
├── DOCS/                   # Technical documentation
├── HANDOVER_DOCS/         # Deployment & setup guides
└── package.json           # Monorepo root configuration
```

---

## 🔌 Frontend Setup Details (apps/web)

### Key Technologies
- **Next.js 16** - React meta-framework
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Styling
- **Auth.js v5** - Authentication (NextAuth v5)
- **Vercel Blob** - Image storage

### Environment Variables

Create `apps/web/.env.local`:

```env
# Database
DATABASE_URL=<same-as-backend>

# Auth.js v5
AUTH_SECRET=<generate-with-openssl-rand-hex-32>
AUTH_URL=http://localhost:3000

# Admin CMS
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD_HASH=<bcrypt-hash>

# Image storage (optional)
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
BLOB_READ_WRITE_TOKEN=

# Backend API
BACKEND_URL=http://localhost:3001
```

### Starting the Frontend

```bash
cd apps/web
npm run dev

# Runs on http://localhost:3000
```

### Building for Production

```bash
npm run build
npm start
```

---

## ⚙️ Backend Setup Details (apps/backend)

### Key Technologies
- **Express.js** - Web framework
- **Prisma** - ORM (MongoDB)
- **MongoDB** - Database
- **bcryptjs** - Password hashing

### Environment Variables

Create `apps/backend/.env.local`:

```env
# Server
NODE_ENV=development
PORT=3001

# Database (MongoDB)
DATABASE_URL=mongodb://localhost:27017/geniuzlab_dev

# Authentication
AUTH_SECRET=<from-apps/web-.env.local>
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD_HASH=<bcrypt-hash>

# API Configuration
CORS_ORIGIN=http://localhost:3000

# Image Storage
BLOB_READ_WRITE_TOKEN=<vercel-blob-token>
```

### Starting the Backend

```bash
cd apps/backend
npm run dev

# Runs on http://localhost:3001
```

### Available Backend Commands

```bash
npm run dev          # Start in watch mode
npm run build        # Build for production
npm run start        # Run production build
npm run lint         # Run ESLint
npm run db:migrate   # Create new migration
npm run db:push      # Push schema to database
npm run db:seed      # Seed database with data
```

---

## 📦 Shared Package (packages/shared)

The `@geniuzlab/shared` package contains:

### Types (`src/types/`)
- `CategorySlug` - Portfolio categories
- `Project` - Project interface
- `ProjectImage` - Image interface
- Authentication types

### Constants (`src/constants/`)
- `siteConfig` - Brand name, tagline, email
- `mainNav` - Navigation menu
- `socialLinks` - Social media profiles
- `whatsappHref` - WhatsApp contact

### Utils (`src/utils/`)
- Helper functions used across apps
- Formatting utilities
- API response handlers

### Usage in Other Apps

```typescript
// In apps/web or apps/backend
import { siteConfig, mainNav } from "@geniuzlab/shared/constants";
import type { Project, CategorySlug } from "@geniuzlab/shared/types";
```

---

## 🗄️ Database Setup

### Prisma Commands

```bash
# Generate Prisma Client
npx prisma generate

# Create a new migration
npm run db:migrate -- --name add_feature_name

# Preview migration (dry run)
npx prisma migrate diff --from-schema-datasource prisma/schema.prisma

# Push schema to database (development only)
npm run db:push

# View database in GUI
npx prisma studio

# Seed database
npm run db:seed
```

### Database Schema Overview

**Models:**
- `User` - Admin authentication
- `Category` - Portfolio categories
- `Project` - Portfolio projects
- `ProjectCategory` - Project-to-category relationship
- `Tag` - Project tags
- `ProjectTag` - Project-to-tag relationship
- `ProjectImage` - Project images/gallery

See `prisma/schema.prisma` for detailed schema.

---

## 🔐 Authentication

### How It Works

1. **Frontend** (NextAuth.js):
   - User logs in at `/admin/login`
   - NextAuth handles credential validation
   - JWT token stored in HTTP-only cookie
   - Token sent automatically with requests

2. **Backend** (Express + JWT):
   - Validates JWT tokens from requests
   - Returns 401 if invalid/expired
   - Protects `/api/admin/` routes

### Admin Login

- **Email**: Value from `ADMIN_EMAIL` env var
- **Password**: Must match `ADMIN_PASSWORD_HASH` (bcrypt)

### Generating Admin Credentials

```bash
# Generate bcrypt hash (use a strong password)
node -e "const bcrypt=require('bcryptjs'); console.log(bcrypt.hashSync('YourSecurePassword123!', 10));"

# Add to .env.local:
ADMIN_EMAIL=admin@geniuzlab.com
ADMIN_PASSWORD_HASH=<generated-hash>
```

---

## 📝 Development Workflow

### Making Changes

1. **Frontend changes** - Auto-reload via Next.js hot module replacement
2. **Backend changes** - Auto-reload via tsx watch
3. **Shared package changes** - May need to restart servers

### Debugging

```bash
# View Next.js build
npm run build:web

# View Express logs
npm run dev:backend

# View database
npx prisma studio
```

### Running Tests

```bash
# Frontend tests (configure as needed)
npm run test:web

# Backend tests (configure as needed)
npm run test:backend

# Lint all workspaces
npm run lint
```

---

## 🚀 Building for Production

### Full Build

```bash
# Build all workspaces
npm run build
```

### Frontend Build

```bash
cd apps/web
npm run build
npm start
```

### Backend Build

```bash
cd apps/backend
npm run build
npm start
```

---

## 🐛 Troubleshooting

### "Cannot find module '@geniuzlab/shared'"

```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Port 3000 or 3001 already in use

```bash
# Kill process using port
# macOS/Linux:
lsof -ti:3000 | xargs kill -9

# Or use different ports:
# Frontend: PORT=3002 npm run dev:web
# Backend: PORT=3002 npm run dev:backend
```

### Database connection error

```bash
# Check DATABASE_URL in .env.local and prisma/.env
# Ensure MongoDB is running or check Atlas dashboard
# Test connection: mongosh $DATABASE_URL
```

### Auth not working

```bash
# Ensure AUTH_SECRET is set (Auth.js v5 uses AUTH_URL, not NEXTAUTH_URL)
# Verify ADMIN_EMAIL and ADMIN_PASSWORD_HASH in apps/web/.env.local and prisma/.env
# Clear browser cookies and try again
```

---

## 📞 Support

For issues or questions, refer to:
- `DOCS/TECHNICAL.md` - Architecture and design details
- `HANDOVER_DOCS/DEPLOYMENT.md` - Production deployment
- Individual `README.md` files in each app
