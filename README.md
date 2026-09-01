# GeniuzLab Portfolio - Monorepo

A professional portfolio and CMS for **GENIUZLAB**, a design studio by Otsaje Genius Peter. Built as a scalable monorepo with separate frontend and backend applications.

## 🎨 Features

- **Public Portfolio Site** - Browse design work by category with detailed case studies
- **Admin CMS** - Protected admin panel to manage and publish projects
- **Project Management** - Create, edit, and organize portfolio projects
- **Image Uploads** - Upload and manage project images with Vercel Blob
- **Authentication** - Secure credential-based admin login
- **Responsive Design** - Mobile-friendly interface with Tailwind CSS
- **Type-Safe** - Full TypeScript across all apps and packages
- **Scalable** - Monorepo structure ready for mobile app and additional services

---

## 📦 Monorepo Structure

```mermaid
graph TB
    subgraph root["GeniuzLab Portfolio<br/>(Monorepo)"]
        subgraph apps["apps/"]
            web["🌐 web<br/>Next.js Frontend<br/>React 19 + Tailwind"]
            backend["⚙️ backend<br/>Express API<br/>Prisma + PostgreSQL"]
            mobile["📱 mobile (future)<br/>React Native / Flutter"]
        end
        
        subgraph packages["packages/"]
            shared["🔗 shared<br/>Types, Constants<br/>Utilities"]
        end
        
        subgraph data["Database"]
            prisma["prisma/<br/>Schema & Migrations"]
        end
        
        subgraph docs["Documentation"]
            technical["DOCS/<br/>Technical & Testing"]
            handover["HANDOVER_DOCS/<br/>Setup & Deployment"]
        end
    end
    
    style root fill:#1e293b,color:#fff,stroke:#4f46e5,stroke-width:3px
    style web fill:#3b82f6,color:#fff
    style backend fill:#8b5cf6,color:#fff
    style mobile fill:#ec4899,color:#fff
    style shared fill:#10b981,color:#fff
    style prisma fill:#f59e0b,color:#fff
    style technical fill:#06b6d4,color:#fff
    style handover fill:#06b6d4,color:#fff
```

### Why Monorepo?

✅ **Unified Dependencies** - Single npm install for all apps  
✅ **Code Sharing** - Share types, constants, and utilities  
✅ **Easier Refactoring** - Changes propagate to all consumers  
✅ **Single Repo** - Easier to manage and deploy  
✅ **Scalable** - Simple to add new apps (mobile, admin dashboard, API clients)

---

## 🏗️ System Architecture

```mermaid
graph TB
    Browser["👤 Browser<br/>User / Admin"]
    
    subgraph Frontend["Frontend Layer"]
        Public["🌐 Public Portfolio<br/>SSR/SSG Pages"]
        Admin["🔐 Admin CMS<br/>Protected UI"]
    end
    
    subgraph Middleware["API Middleware"]
        NextAPI["Next.js API Routes<br/>Auth & Upload"]
        Auth["🔐 NextAuth.js<br/>Session Management"]
    end
    
    subgraph Backend["Backend API"]
        Express["⚙️ Express Server<br/>REST Endpoints"]
        Validation["✔️ Zod Validation<br/>Type Safety"]
    end
    
    subgraph Data["Data Layer"]
        Database["🗄️ PostgreSQL<br/>Prisma ORM"]
        Storage["☁️ Vercel Blob<br/>Image Storage"]
    end
    
    Browser -->|HTTP/HTTPS| Public
    Browser -->|Authenticated| Admin
    Public & Admin -->|API Calls| NextAPI
    NextAPI --> Auth
    Auth -->|JWT Verification| Express
    Express --> Validation
    Validation -->|SQL Queries| Database
    Express -->|Upload/Download| Storage
    
    style Frontend fill:#6366f1,color:#fff
    style Backend fill:#8b5cf6,color:#fff
    style Data fill:#ec4899,color:#fff
    style Auth fill:#f59e0b,color:#fff
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm 8+
- PostgreSQL 14+
- Git

### Development Setup (5 minutes)

```bash
# 1. Clone and install
git clone https://github.com/geniuspeter577-design/geniuzlab_portfolio.git
cd geniuzlab_portfolio
npm install

# 2. Setup environment
cp .env.example .env.local
# Edit .env.local with your database URL and auth secret

# 3. Setup database
npm run db:push

# 4. Start development servers
npm run dev

# Servers run on:
# - Frontend: http://localhost:3000
# - Backend API: http://localhost:3001
```

For detailed setup instructions, see [HANDOVER_DOCS/SETUP.md](HANDOVER_DOCS/SETUP.md).

---

## 📚 Documentation

### Getting Started
- **[HANDOVER_DOCS/SETUP.md](HANDOVER_DOCS/SETUP.md)** - Complete local development setup
- **[HANDOVER_DOCS/DEPLOYMENT.md](HANDOVER_DOCS/DEPLOYMENT.md)** - Production deployment guide
- **[DOCS/TECHNICAL.md](DOCS/TECHNICAL.md)** - Technical architecture and design details
- **[DOCS/API.md](DOCS/API.md)** - Backend API endpoints documentation
- **[DOCS/TESTING.md](DOCS/TESTING.md)** - Comprehensive testing guide (Jest, Vitest, Playwright, MSW)

### App-Specific
- **[apps/web/README.md](apps/web/README.md)** - Frontend setup and development
- **[apps/backend/README.md](apps/backend/README.md)** - Backend setup and development

---

## 🛠️ Development

### Available Commands

```bash
# Development
npm run dev              # Start both frontend and backend
npm run dev:web         # Start frontend only
npm run dev:backend     # Start backend only

# Building
npm run build           # Build all apps

# Database
npm run db:migrate      # Create a new migration
npm run db:push         # Sync schema to database
npm run db:seed         # Seed database with sample data

# Linting
npm run lint            # Lint all workspaces

# Production
npm start               # Start production builds
```

### Project Structure

#### Frontend (apps/web)

```
apps/web/
├── app/                # Next.js App Router
│   ├── admin/         # Protected admin routes
│   ├── api/           # API routes (NextAuth, uploads)
│   ├── work/          # Public portfolio pages
│   └── layout.tsx     # Root layout
├── components/        # React components
├── lib/               # Utilities, API calls
├── hooks/             # Custom hooks
├── public/            # Static assets
├── auth.ts            # NextAuth configuration
├── next.config.ts     # Next.js config
└── package.json
```

#### Backend (apps/backend)

```
apps/backend/
├── src/
│   ├── index.ts       # Express server
│   ├── lib/           # Business logic
│   ├── routes/        # API endpoints
│   └── middleware/    # Express middleware
├── prisma/            # (shared from root)
└── package.json
```

#### Shared (packages/shared)

```
packages/shared/src/
├── types/             # TypeScript interfaces
├── constants/         # Site configuration
└── utils/             # Helper functions
```

---

## 🧪 Testing

This project implements comprehensive testing across multiple layers:

### Testing Frameworks

- **Jest** - Backend unit & integration tests
- **Vitest** - Frontend component & unit tests
- **React Testing Library** - React component testing
- **Playwright** - End-to-end testing
- **MSW** - API mocking for tests
- **ESLint** - Code quality linting

### Quick Test & Lint Commands

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Generate coverage reports
npm run test:coverage

# Lint code
npm run lint

# Run E2E tests
npm run test:e2e

# Run E2E tests with UI
npm run test:e2e:ui
```

### Test Files

- **Backend:** `apps/backend/__tests__/`
- **Frontend:** `apps/web/__tests__/`
- **E2E:** `e2e/`

### Writing Tests

- Backend: [Unit & Integration Testing Guide](DOCS/TESTING.md#backend-testing-jest--supertest)
- Frontend: [Component Testing Guide](DOCS/TESTING.md#frontend-testing-vitest--react-testing-library)
- E2E: [End-to-End Testing Guide](DOCS/TESTING.md#e2e-testing-playwright)

### Code Quality

- Linting: [ESLint Guide](DOCS/TESTING.md#code-linting-eslint)
- Run linter: `npm run lint`

**Full testing documentation:** [DOCS/TESTING.md](DOCS/TESTING.md)

---

## 🔐 Authentication

The platform uses **NextAuth.js** for frontend authentication with credential-based login.

### Admin Access

1. Navigate to `/admin/login`
2. Use credentials from environment variables:
   - **Email**: `ADMIN_EMAIL`
   - **Password**: Match against `ADMIN_PASSWORD_HASH` (bcrypt)

### Generate Admin Password

```bash
node -e "const bcrypt=require('bcryptjs'); console.log(bcrypt.hashSync('your-password', 10));"
```

---

## 🗄️ Database

Uses **PostgreSQL** with **Prisma ORM**. Schema includes:

- **User** - Admin credentials
- **Project** - Portfolio projects with metadata
- **Category** - Portfolio categories (graphic design, branding, etc.)
- **ProjectCategory** - Many-to-many relationship
- **ProjectImage** - Project gallery images
- **Tag** - Project tags
- **ProjectTag** - Many-to-many relationship

View the full schema in [prisma/schema.prisma](prisma/schema.prisma).

---

## 🖼️ Image Storage

Uses **Vercel Blob** for image uploads:

1. Get a Vercel Blob token
2. Set `BLOB_READ_WRITE_TOKEN` in `.env.local`
3. Images uploaded via `/api/admin/upload-image`

---

## 🌐 Technology Stack

| Category | Technology | Version |
|----------|-----------|---------|
| **Runtime** | Node.js | 18+ |
| **Language** | TypeScript | 5 |
| **Frontend Framework** | Next.js | 16 |
| **UI Library** | React | 19 |
| **Styling** | Tailwind CSS | 4 |
| **Backend** | Express.js | 4.18 |
| **Database** | PostgreSQL | 14+ |
| **ORM** | Prisma | 6 |
| **Auth** | NextAuth.js | 5 (beta) |
| **Image Storage** | Vercel Blob | 2 |

---

## 📋 Environment Variables

### Required

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/geniuzlab

# Authentication (minimum 32 characters)
AUTH_SECRET=your-secure-secret-key-32-chars-min

# Admin credentials
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD_HASH=bcryptjs-generated-hash
```

### Optional

```env
# Image storage
BLOB_READ_WRITE_TOKEN=vercel-blob-token

# API URLs (development)
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXTAUTH_URL=http://localhost:3000
```

See `.env.example` for all available variables.

---

## 🚀 Deployment

### Quick Deploy

- **Frontend**: Deploy `apps/web` to Vercel, Netlify, or any Node.js hosting
- **Backend**: Deploy `apps/backend` to Heroku, Railway, or any Node.js hosting
- **Database**: PostgreSQL on Supabase, Railway, or AWS RDS

See [HANDOVER_DOCS/DEPLOYMENT.md](HANDOVER_DOCS/DEPLOYMENT.md) for detailed deployment instructions.

### Environment Variables for Production

Set these in your hosting platform:

```env
DATABASE_URL=<production-db-url>
AUTH_SECRET=<secure-32-char-secret>
ADMIN_EMAIL=<admin-email>
ADMIN_PASSWORD_HASH=<bcrypt-hash>
BLOB_READ_WRITE_TOKEN=<vercel-blob-token>
NEXTAUTH_URL=https://yourdomain.com
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

---

## 📝 Project Files

### Key Configuration Files
- `package.json` - Monorepo root with workspace configuration
- `tsconfig.json` - TypeScript configuration with path aliases
- `prisma/schema.prisma` - Database schema
- `.env.example` - Example environment variables

### Key Entry Points
- **Frontend**: `apps/web/app/layout.tsx` (root layout)
- **Backend**: `apps/backend/src/index.ts` (Express server)
- **Shared**: `packages/shared/src/index.ts` (exports)

---

## 🤝 Contributing

### Development Workflow

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make changes in the appropriate app or package
3. Run linting: `npm run lint`
4. Build and test: `npm run build`
5. Commit with clear messages
6. Push and create a pull request

### Code Standards

- Write TypeScript (no `any` types)
- Use Tailwind CSS for styling in frontend
- Follow the existing folder structure
- Add comments for complex logic
- Keep components small and focused

---

## 🐛 Troubleshooting

### Common Issues

**Port already in use**
```bash
# Kill existing process
lsof -ti:3000 | xargs kill -9
```

**Database connection error**
```bash
# Verify DATABASE_URL in .env.local
# Ensure PostgreSQL is running
psql $DATABASE_URL -c "SELECT 1"
```

**Module not found**
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

**NextAuth issues**
- Verify `NEXTAUTH_SECRET` is set
- Check `NEXTAUTH_URL` matches your domain
- Clear browser cookies

See [HANDOVER_DOCS/SETUP.md](HANDOVER_DOCS/SETUP.md) for more troubleshooting.

---

## 📞 Support & Contact

- **Portfolio**: [geniuzlab.com](https://geniuzlab.com)
- **Email**: geniuzlab577@gmail.com
- **WhatsApp**: [+234 913 895 5730](https://wa.me/234913895570)
- **Instagram**: [@geniuz_lab](https://instagram.com/geniuz_lab)

---

## 📄 License

MIT - See [LICENSE](LICENSE) for details.

---

## 🎯 Project Status

- ✅ Production ready monorepo structure
- ✅ Frontend & backend separation
- ✅ Type-safe shared packages
- 🚀 Ready to scale with mobile app
- 📈 Monitoring and analytics integration (in progress)

---

**Built with ❤️ by GeniuzLab**
