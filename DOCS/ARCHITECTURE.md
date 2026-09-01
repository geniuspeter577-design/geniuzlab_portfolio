# GeniuzLab Portfolio - Architecture & Design

## System Architecture Overview

```mermaid
graph TB
    Client["🌐 Browser / Client<br/>(Desktop, Tablet, Mobile)"]
    
    subgraph Frontend["Frontend (apps/web)"]
        NextApp["Next.js + React 19<br/>• Pages<br/>• Components<br/>• Tailwind CSS"]
        NextAPI["Next.js API Routes<br/>• Authentication<br/>• Image Upload<br/>• API Proxy"]
    end
    
    subgraph Backend["Backend (apps/backend)"]
        API["Express.js API<br/>• Projects CRUD<br/>• Categories<br/>• User Auth<br/>• JWT Validation"]
    end
    
    Database["🗄️ PostgreSQL<br/>• Projects<br/>• Categories<br/>• Users<br/>• Images<br/>• Relationships"]
    
    Storage["☁️ Vercel Blob<br/>Image Storage"]
    
    Client -->|HTTP/HTTPS| NextApp
    NextApp <-->|Client Routes| NextAPI
    NextAPI -->|REST API| API
    API <-->|SQL| Database
    API <-->|Upload/Download| Storage
    NextApp -->|Image URLs| Storage
    
    style Client fill:#4f46e5,color:#fff
    style NextApp fill:#6366f1,color:#fff
    style NextAPI fill:#818cf8,color:#fff
    style API fill:#8b5cf6,color:#fff
    style Database fill:#ec4899,color:#fff
    style Storage fill:#f59e0b,color:#fff
```

---

## Monorepo Structure

### Why Monorepo?

1. **Shared Code** - Types, constants, utilities shared across apps
2. **Unified Versioning** - Single package-lock.json for consistency
3. **Easier Refactoring** - Change shared code once, applies everywhere
4. **Scalability** - Easy to add mobile app, multiple backends, etc.
5. **Single Repo** - One git history, simpler CI/CD

### Workspace Layout

```
packages/
└── shared/                    # Shared types, constants, utils
    └── src/
        ├── types/            # TypeScript interfaces
        ├── constants/        # Site configuration
        └── utils/            # Helper functions

apps/
├── web/                       # Frontend (Next.js + React)
│   ├── app/                  # App Router (pages, layouts, API routes)
│   ├── components/           # React components
│   ├── lib/                  # Frontend business logic
│   ├── hooks/                # Custom React hooks
│   ├── public/               # Static assets (images, fonts)
│   ├── auth.ts               # NextAuth configuration
│   └── package.json
│
├── backend/                   # Backend API (Express.js)
│   ├── src/
│   │   ├── index.ts          # Server entry point
│   │   ├── lib/              # Business logic, services
│   │   ├── routes/           # API endpoints
│   │   └── middleware/       # Express middleware
│   └── package.json
│
└── mobile/                    # Future: React Native or Flutter
    └── (placeholder)
```

---

## Technology Decisions

### Frontend: Next.js 16 + React 19

**Why?**
- ✅ Full-stack capabilities (frontend + API routes)
- ✅ Server-side rendering (SSR) for SEO-friendly portfolio
- ✅ Static generation (SSG) for fast portfolio pages
- ✅ Built-in image optimization
- ✅ TypeScript first-class support
- ✅ Excellent developer experience (hot reload)

**Alternatives Considered:**
- Vite + React - Simpler but lacks full-stack features
- Remix - Good alternative but heavier learning curve

### Backend: Express.js (Separate)

**Why?**
- ✅ Full control over API design and authentication
- ✅ Independent scaling from frontend
- ✅ Better for future mobile app API
- ✅ Clean separation of concerns
- ✅ Easier testing and deployment

**Frontend stays on Next.js** because:
- Portfolio pages need SSR/SSG for SEO
- Admin routes can use Next.js API routes as proxy
- Simpler deployment of frontend

### Database: PostgreSQL + Prisma

**Why?**
- ✅ Type-safe ORM with TypeScript support
- ✅ Excellent migration system
- ✅ Works with PostgreSQL (enterprise-grade)
- ✅ Built-in schema validation
- ✅ Great developer experience

### Authentication: NextAuth.js + JWT

**Strategy:**
1. **Frontend auth** - NextAuth.js (Session management)
2. **Backend auth** - JWT tokens (API validation)
3. **Credentials flow** - Email + password (no external providers needed)
4. **Token storage** - HTTP-only cookies (secure, XSS-proof)

**Authentication Flow:**

```mermaid
sequenceDiagram
    participant User
    participant Browser
    participant Next.js as Next.js Frontend
    participant NextAuth
    participant Backend as Express API
    participant Database
    
    User->>Browser: Visit /admin/login
    Browser->>Next.js: GET /admin/login
    Next.js->>Browser: Display login form
    
    User->>Browser: Enter credentials & submit
    Browser->>Next.js: POST /api/auth/callback/credentials
    Next.js->>NextAuth: Validate credentials
    NextAuth->>Backend: POST /auth/login with credentials
    Backend->>Database: Query user by email
    Backend->>Backend: Verify password
    Backend->>NextAuth: Return JWT token
    NextAuth->>NextAuth: Store in HTTP-only cookie
    NextAuth->>Browser: Redirect to /admin/dashboard
    
    Browser->>Next.js: GET /admin/dashboard
    Next.js->>NextAuth: Check session
    NextAuth->>Browser: Render dashboard
    
    User->>Browser: Navigate to projects page
    Browser->>Next.js: GET /admin/projects
    Next.js->>Backend: GET /api/admin/projects<br/>(with JWT cookie)
    Backend->>Backend: Verify JWT token
    Backend->>Database: Query projects
    Backend->>Next.js: Return projects
    Next.js->>Browser: Display projects
```

---

## Data Flow

### Public Portfolio Browsing

```mermaid
graph TD
    A["👤 User visits geniuzlab.com"] --> B["📱 Browser requests homepage"]
    B --> C["🔄 Next.js renders page<br/>SSR or SSG"]
    C --> D["📡 Next.js fetches<br/>projects from Backend"]
    D --> E["🗄️ Backend queries<br/>PostgreSQL"]
    E --> F["📊 Backend returns<br/>project data"]
    F --> G["🎨 Next.js renders<br/>React components"]
    G --> H["🌐 Browser displays<br/>portfolio"]
    
    H --> I["👆 User clicks on project"]
    I --> J["📡 Next.js fetches<br/>project details"]
    J --> K["🗄️ Backend queries by slug"]
    K --> L["📸 Returns project<br/>with images"]
    L --> M["📄 Next.js renders<br/>case study page"]
    M --> N["✨ Browser displays<br/>case study"]
    
    style A fill:#4f46e5,color:#fff
    style H fill:#10b981,color:#fff
    style N fill:#10b981,color:#fff
```

### Admin Publishing a Project

```mermaid
graph TD
    A["👨‍💼 Admin navigates<br/>to /admin/projects"] --> B["🔐 NextAuth checks<br/>JWT token"]
    B --> C{Token valid?}
    C -->|No| D["🚫 Redirect to login"]
    C -->|Yes| E["📊 Load admin<br/>dashboard"]
    
    E --> F["➕ Admin clicks<br/>Create Project"]
    F --> G["📝 Admin fills form<br/>and selects images"]
    G --> H["☁️ Upload images<br/>to Vercel Blob"]
    H --> I["✅ Blob returns URLs"]
    
    I --> J["🖱️ Admin submits form"]
    J --> K["📤 Next.js API route<br/>receives request"]
    K --> L["🔐 Verify JWT token"]
    L --> M["✔️ Validate with<br/>Zod schema"]
    M --> N["📡 Forward to<br/>Backend API"]
    
    N --> O["🔐 Backend verifies<br/>JWT token"]
    O --> P["💾 Save to<br/>PostgreSQL"]
    P --> Q["✅ Project saved"]
    
    Q --> R["📊 Project appears<br/>in dashboard"]
    R --> S{Published?}
    S -->|Yes| T["🌐 Project on<br/>public portfolio"]
    S -->|No| U["🔒 Draft mode"]
    
    style A fill:#4f46e5,color:#fff
    style Q fill:#10b981,color:#fff
    style T fill:#10b981,color:#fff
```

---

## Key Design Patterns

### 1. API Layer Abstraction

**Frontend** has utility functions in `lib/api.ts`:

```typescript
// Encapsulates all API calls
export const api = {
  getProjects: () => fetch('/api/projects'),
  getProject: (slug: string) => fetch(`/api/projects/${slug}`),
  admin: {
    createProject: (data) => fetch('/api/admin/projects', { method: 'POST', body: JSON.stringify(data) }),
  }
}
```

**Benefits:**
- Centralized API logic
- Easy to change endpoints
- Type-safe requests

### 2. Type Sharing via Shared Package

**packages/shared/src/types/index.ts:**

```typescript
export interface Project {
  id: string;
  slug: string;
  title: string;
  // ... other fields
}
```

**Usage in Frontend:**
```typescript
import type { Project } from '@geniuzlab/shared/types';

const project: Project = await api.getProject('slug');
```

**Usage in Backend:**
```typescript
import type { Project } from '@geniuzlab/shared/types';

router.get('/projects/:slug', (req, res) => {
  const project: Project = db.projects.findOne({ slug: req.params.slug });
  res.json(project);
});
```

**Benefits:**
- Single source of truth for types
- Prevents frontend/backend desync
- Type-safe API contracts

### 3. Environment Configuration

**Each app has its own .env file:**

- `apps/web/.env.local` - Frontend config (NEXT_PUBLIC_*)
- `apps/backend/.env.local` - Backend config
- `.env.local` - Shared config (DATABASE_URL, AUTH_SECRET)

**Why separate?**
- Frontend only needs public URLs
- Backend needs database, secrets
- Prevents accidental secret exposure

### 4. Authentication Middleware

**NextAuth.js Middleware** (Frontend):
```typescript
// apps/web/auth.ts
export const { handlers, auth } = NextAuth({
  providers: [Credentials(...)],
  callbacks: {
    jwt: ({ token, user }) => ({ ...token, userId: user.id }),
    session: ({ session, token }) => ({ ...session, userId: token.userId })
  }
});

// Usage in pages/middleware
import { auth } from '@/auth';
const session = await auth();
if (!session) return redirect('/admin/login');
```

**Express Middleware** (Backend):
```typescript
// apps/backend/src/middleware/auth.ts
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  
  const decoded = jwt.verify(token, process.env.AUTH_SECRET);
  req.user = decoded;
  next();
};

// Usage in routes
router.get('/admin/projects', verifyToken, (req, res) => {
  // req.user is now available
});
```

### 5. Image Handling

**Upload flow:**
1. Admin selects image in browser
2. Next.js API route receives request
3. Forwards to Vercel Blob (from backend)
4. Blob returns URL
5. URL stored in database
6. Public display: direct URL from Vercel CDN

**Benefits:**
- No large files in database
- CDN distribution (fast globally)
- Reduced server load
- Scalable image storage

---

## Database Schema

### Entity Relationship Diagram

```mermaid
erDiagram
    USER ||--o{ PROJECT : creates
    PROJECT ||--o{ PROJECT-CATEGORY : belongs_to
    CATEGORY ||--o{ PROJECT-CATEGORY : contains
    PROJECT ||--o{ PROJECT-IMAGE : has
    PROJECT ||--o{ PROJECT-TAG : has
    TAG ||--o{ PROJECT-TAG : contains

    USER {
        string id PK
        string email UK
        string passwordHash
        datetime createdAt
        datetime updatedAt
    }

    PROJECT {
        string id PK
        string slug UK
        string title
        string client
        int year
        string role
        string summary
        text description
        boolean featured
        boolean published
        int orderIndex
        datetime createdAt
        datetime updatedAt
    }

    CATEGORY {
        string id PK
        string slug UK
        string label
        text description
    }

    PROJECT-CATEGORY {
        string projectId PK_FK
        string categoryId PK_FK
    }

    PROJECT-IMAGE {
        string id PK
        string projectId FK
        string type
        string url
        string altText
        int width
        int height
        int orderIndex
        datetime createdAt
    }

    TAG {
        string id PK
        string name UK
        datetime createdAt
    }

    PROJECT-TAG {
        string projectId PK_FK
        string tagId PK_FK
    }
```

**Key Design Decisions:**
- **Project-Category Many-to-Many** - A project can belong to multiple categories
- **ProjectImage** - Separate model for gallery images (supports multiple images per project)
- **Tags** - Optional, for future filtering
- **Published flag** - Draft/published status for projects
- **Featured flag** - Homepage featured projects selection

---

## Security Architecture

### Authentication & Authorization

1. **Registration** - Admin credentials stored as bcrypt hashes
2. **Login** - Email + password → JWT token
3. **Token Storage** - HTTP-only cookie (XSS-proof)
4. **Token Validation** - Checked on every admin API call
5. **Session** - JWT expires (configurable)

### API Security

- **HTTPS only** - All production traffic encrypted
- **CORS** - Limited to trusted origins
- **Request Validation** - Zod schemas validate input
- **Rate Limiting** - Optional, recommended for production
- **SQL Injection** - Prevented by Prisma parameterized queries
- **XSS** - Prevented by Next.js automatic escaping

### Environment Secrets

- ✅ Never committed to Git
- ✅ Stored in `.env.local` (development)
- ✅ Stored in platform secrets (Vercel, Railway, etc.)
- ✅ Rotated regularly in production

---

## Performance Considerations

### Frontend Optimization

1. **Static Generation (SSG)**
   - Homepage, category pages generated at build time
   - Updated on new project publish (ISR)
   - Served instantly from CDN

2. **Image Optimization**
   - Next.js automatic image optimization
   - WebP format for modern browsers
   - Responsive images (srcset)
   - Lazy loading by default

3. **Code Splitting**
   - Admin routes lazy-loaded only when needed
   - Reduces initial bundle size

### Backend Optimization

1. **Database Indexes**
   - slug fields indexed for fast lookups
   - published flag indexed for queries
   - Foreign keys indexed automatically

2. **Caching Strategy**
   - Static pages cached by CDN
   - API responses could use Redis (future)
   - Vercel Blob provides CDN-distributed images

3. **Connection Pooling**
   - Prisma handles connection pooling
   - Configurable pool size for scaling

---

## Development Workflow

### Feature Development

```
1. Create feature branch
   git checkout -b feature/new-feature

2. Make changes in appropriate app/package
   - Frontend: apps/web/
   - Backend: apps/backend/
   - Shared: packages/shared/

3. Run tests and lint
   npm run lint
   npm run test

4. Start dev servers
   npm run dev

5. Test manually
   - Frontend: http://localhost:3000
   - Backend: http://localhost:3001
   - API: http://localhost:3001/api

6. Commit and push
   git add .
   git commit -m "feature: add new feature"
   git push origin feature/new-feature

7. Create pull request
   - Describe changes
   - Link related issues
   - Request reviews

8. Merge to main after approval
```

### Deployment

```
1. Code merged to main branch
2. CI/CD pipeline triggered (if configured)
3. Tests run
4. Build production bundle
5. Deploy frontend to Vercel
6. Deploy backend to Railway/Heroku
7. Database migrations applied (if any)
8. Health checks performed
9. Rollback plan ready (if issues)
```

---

## Future Architecture Enhancements

### Planned

- [ ] **Mobile App** - React Native sharing `@geniuzlab/shared` types
- [ ] **Admin Dashboard** - Separate Next.js admin panel (better UX)
- [ ] **Analytics** - Google Analytics, Hotjar for insights
- [ ] **CDN Caching** - Redis for frequently accessed data
- [ ] **Email Notifications** - Nodemailer for project updates
- [ ] **Search** - Elasticsearch or Algolia for project search
- [ ] **API Versioning** - Support multiple API versions
- [ ] **GraphQL** - Alternative to REST API
- [ ] **Multi-language** - i18n support for international reach

### Scalability Roadmap

```
Phase 1 (Current)
├─ Single frontend + backend
├─ PostgreSQL single instance
└─ Vercel + Railway hosting

Phase 2 (Next)
├─ Mobile app (React Native)
├─ Admin dashboard (separate Next.js app)
├─ Redis caching layer
└─ Database read replicas

Phase 3 (Future)
├─ Microservices architecture
├─ Message queue (RabbitMQ, Redis)
├─ Event-driven architecture
├─ GraphQL API
└─ Multi-region deployment
```

---

## Monitoring & Observability

### Recommended Tools

- **Error Tracking** - Sentry
- **Performance** - Vercel Analytics, New Relic
- **Logging** - LogRocket, ELK stack
- **Uptime** - UptimeRobot, Pingdom
- **Database** - pgAdmin, DataGrip

### Key Metrics to Monitor

- Page load times (frontend)
- API response times (backend)
- Database query performance
- Error rates
- Server uptime
- User engagement
- Image upload success rate

---

## References

- [Next.js App Router](https://nextjs.org/docs/app)
- [Prisma Documentation](https://www.prisma.io/docs)
- [NextAuth.js v5](https://authjs.dev/getting-started/installation?framework=next.js)
- [Express.js Guide](https://expressjs.com/en/starter/basic-routing.html)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Vercel Blob Documentation](https://vercel.com/docs/storage/vercel-blob)

