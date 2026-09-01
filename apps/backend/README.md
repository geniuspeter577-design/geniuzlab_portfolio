# GeniuzLab Portfolio - Backend API (Express.js)

Backend API server for the GeniuzLab Portfolio. Built with Express.js, Prisma ORM, and PostgreSQL.

## Features

- 🔐 **Authentication** - JWT-based API authentication
- 📦 **Project Management** - Full CRUD operations for projects
- 🏷️ **Categories & Tags** - Organize projects by category and tags
- 🖼️ **Image Management** - Store and manage project images
- ✅ **Validation** - Zod schema validation for all inputs
- 🗄️ **Database** - Prisma ORM with PostgreSQL
- 📝 **Type Safety** - Full TypeScript support
- 🔍 **Error Handling** - Comprehensive error responses

## Tech Stack

- **Framework**: Express.js 4.18
- **Language**: TypeScript 5
- **Database**: PostgreSQL 14+
- **ORM**: Prisma 6
- **Authentication**: JWT (jsonwebtoken)
- **Validation**: Zod
- **Password Hashing**: bcryptjs
- **CORS**: cors middleware
- **Environment**: dotenv

## Prerequisites

- Node.js 18+
- npm 8+
- PostgreSQL 14+
- Vercel Blob token (optional, for image storage)

## Getting Started

### 1. Environment Setup

```bash
# From project root
cp .env.example .env.local

# Backend environment variables should be set in .env.local:
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/geniuzlab_dev
AUTH_SECRET=your-32-character-secret
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD_HASH=bcrypt-hash-of-password
PORT=3001
NODE_ENV=development
BLOB_READ_WRITE_TOKEN=vercel-blob-token
```

### 2. Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Create/migrate database
npm run db:push

# (Optional) Seed with sample data
npm run db:seed

# View database in GUI
npx prisma studio
```

### 3. Installation

```bash
# From root directory
npm install

# Install backend-specific dependencies
cd apps/backend
npm install
```

### 4. Start Development Server

```bash
# From root
npm run dev:backend

# Or from apps/backend
npm run dev
```

Runs on [http://localhost:3001](http://localhost:3001)

## Project Structure

```
apps/backend/
├── src/
│   ├── index.ts              # Server entry point
│   ├── lib/
│   │   ├── env.ts            # Environment validation
│   │   ├── prisma.ts         # Prisma client singleton
│   │   ├── auth.ts           # JWT utilities
│   │   └── validators.ts     # Zod schemas
│   ├── routes/               # API endpoints
│   │   ├── projects.ts       # /api/projects routes
│   │   ├── categories.ts     # /api/categories routes
│   │   ├── admin.ts          # /api/admin routes
│   │   └── index.ts          # Route registration
│   ├── middleware/
│   │   ├── auth.ts           # JWT verification
│   │   ├── errorHandler.ts   # Error handling
│   │   └── cors.ts           # CORS configuration
│   └── types/                # TypeScript types
├── prisma/
│   ├── schema.prisma         # Database schema
│   ├── migrations/           # Database migrations
│   └── seed.ts               # Sample data
├── dist/                     # Built JavaScript (generated)
├── tsconfig.json             # TypeScript config
├── package.json              # Dependencies
└── README.md                 # This file
```

## Key Files

### `src/index.ts` - Express Server

Main server setup:

```typescript
const app = express();

// Middleware
app.use(cors({ origin: process.env.CORS_ORIGIN }));
app.use(express.json());

// Routes
app.use('/api', routes);

// Start server
app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
```

### `src/middleware/auth.ts` - JWT Verification

Middleware for protecting admin routes:

```typescript
export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.AUTH_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
};
```

### `src/lib/validators.ts` - Zod Schemas

Input validation schemas:

```typescript
export const createProjectSchema = z.object({
  title: z.string().min(1),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  year: z.number().int().min(2000).max(2100),
  summary: z.string().min(10),
  categories: z.array(z.string()),
  // ... other fields
});
```

### `prisma/schema.prisma` - Database Schema

Defines all database models and relationships.

## Available Commands

```bash
# Development
npm run dev              # Start dev server with auto-reload

# Building
npm run build            # Compile TypeScript to JavaScript
npm start                # Run compiled production build

# Database
npm run db:migrate       # Create new migration
npm run db:push          # Sync schema to database
npm run db:seed          # Seed database with sample data
npm run db:studio        # Open Prisma Studio GUI

# Code Quality
npm run lint             # Run ESLint
npm run type-check       # Type check TypeScript
```

## API Endpoints

### Public Endpoints

```
GET /api/projects              # Get all projects
GET /api/projects/:slug        # Get single project
GET /api/categories            # Get all categories
```

### Admin Endpoints (Require JWT)

```
POST /api/admin/login          # Get JWT token
GET /api/admin/projects        # Get all projects (admin)
POST /api/admin/projects       # Create project
GET /api/admin/projects/:id    # Get project (admin)
PUT /api/admin/projects/:id    # Update project
DELETE /api/admin/projects/:id # Delete project
POST /api/admin/upload-image   # Upload image to Vercel Blob
GET /api/admin/categories      # Get categories (admin)
POST /api/admin/categories     # Create category
```

See [../../DOCS/API.md](../../DOCS/API.md) for detailed API documentation.

## Environment Variables

### Required

```env
# Server
NODE_ENV=development
PORT=3001

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/geniuzlab_dev

# Authentication
AUTH_SECRET=your-secure-32-character-secret
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD_HASH=bcrypt-hash-of-password

# CORS
CORS_ORIGIN=http://localhost:3000
```

### Optional

```env
# Image Storage
BLOB_READ_WRITE_TOKEN=vercel-blob-token

# Database Logging (development)
DATABASE_LOG_LEVEL=query

# Logging
LOG_LEVEL=info
```

## Authentication

### JWT Flow

1. **Login** - POST `/api/admin/login` with email + password
2. **Response** - Server returns JWT token
3. **Storage** - Frontend stores token (NextAuth manages)
4. **Usage** - Include token in `Authorization: Bearer <token>` header
5. **Validation** - Backend verifies token signature and expiry
6. **Access** - If valid, user can access admin routes

### Generate Admin Credentials

```bash
# Generate bcrypt hash
node -e "const bcrypt=require('bcryptjs'); console.log(bcrypt.hashSync('your-password', 10));"

# Output:
# $2a$10$XQs2E...

# Add to .env.local:
ADMIN_PASSWORD_HASH=$2a$10$XQs2E...
```

## Database Schema

### Models

1. **User** - Admin credentials
2. **Project** - Portfolio projects
3. **Category** - Project categories
4. **ProjectCategory** - Many-to-many junction table
5. **ProjectImage** - Project images/gallery
6. **Tag** - Project tags
7. **ProjectTag** - Many-to-many junction table

### Relationships

```
User (1:many) Project
Project (many:many) Category → ProjectCategory
Project (one:many) ProjectImage
Project (many:many) Tag → ProjectTag
```

## Error Handling

All errors return consistent JSON format:

```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": {
    "field": "error details"
  }
}
```

### Common Error Codes

- `UNAUTHORIZED` (401) - Missing/invalid JWT
- `INVALID_INPUT` (400) - Validation failure
- `NOT_FOUND` (404) - Resource not found
- `CONFLICT` (409) - Resource already exists
- `FILE_TOO_LARGE` (413) - Upload exceeds size limit
- `INTERNAL_ERROR` (500) - Server error

## Image Storage

Images uploaded to Vercel Blob:

1. Admin uploads image at `/api/admin/upload-image`
2. Backend receives FormData with file
3. Validates file type and size
4. Uploads to Vercel Blob
5. Returns blob URL
6. Frontend stores URL in database
7. Public serves from Vercel CDN

**Limits:**
- Max size: 50MB
- Allowed types: image/jpeg, image/png, image/webp
- Stored in Vercel Blob (not database)

## Development Workflow

### Adding a New Endpoint

1. **Create route handler** - `src/routes/new-resource.ts`
   ```typescript
   import { Router } from 'express';
   
   const router = Router();
   
   router.get('/', async (req, res) => {
     // Handler logic
   });
   
   export default router;
   ```

2. **Add to main routes** - `src/routes/index.ts`
   ```typescript
   import newResource from './new-resource';
   app.use('/api/new-resource', newResource);
   ```

3. **Add validation schema** - `src/lib/validators.ts`
   ```typescript
   export const createResourceSchema = z.object({ ... });
   ```

4. **Test with curl or Postman**
   ```bash
   curl http://localhost:3001/api/new-resource
   ```

### Database Migrations

```bash
# Create new migration after schema change
npm run db:migrate -- --name add_new_field

# Apply migration
npm run db:push

# View schema changes
git diff prisma/schema.prisma
```

### Debugging

```bash
# View database
npx prisma studio

# Check queries with logging
DATABASE_LOG_LEVEL=query npm run dev

# Test API with curl
curl -X POST http://localhost:3001/api/admin/projects \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Test"}'
```

## Performance Optimization

### Database Indexes

Prisma automatically indexes:
- Primary keys (id)
- Foreign keys (relationships)
- Unique fields (slug, email)

Manual indexes in `schema.prisma`:

```prisma
model Project {
  // ...
  @@index([published])
  @@index([year])
  @@fulltext([title, description])  // Full-text search
}
```

### Connection Pooling

Prisma handles connection pooling automatically. For high concurrency:

```env
DATABASE_CONNECTION_LIMIT=20
DATABASE_POOL_TIMEOUT=30000
```

### Caching (Future)

Consider Redis for:
- Frequently accessed projects
- Category lists
- Admin session data

```typescript
// Example with Redis
const projects = await redis.get('projects');
if (!projects) {
  const data = await prisma.project.findMany();
  await redis.set('projects', JSON.stringify(data), 'EX', 3600);
  return data;
}
```

## Testing

### Manual Testing with cURL

```bash
# Login
TOKEN=$(curl -s -X POST http://localhost:3001/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password"}' \
  | jq -r '.token')

# Get projects
curl http://localhost:3001/api/admin/projects \
  -H "Authorization: Bearer $TOKEN"

# Create project
curl -X POST http://localhost:3001/api/admin/projects \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "New Project",
    "slug": "new-project",
    "year": 2024,
    "summary": "A great project"
  }'
```

### Automated Testing (Setup Recommended)

Create `src/__tests__/projects.test.ts`:

```typescript
import request from 'supertest';
import app from '../index';

describe('Projects API', () => {
  it('should get all public projects', async () => {
    const res = await request(app)
      .get('/api/projects')
      .expect(200);
    
    expect(res.body.projects).toBeInstanceOf(Array);
  });
});
```

Run: `npm test`

## Deployment

### Build for Production

```bash
npm run build
npm start
```

### Environment for Production

Set these variables on your hosting platform:

```env
NODE_ENV=production
PORT=3001
DATABASE_URL=<production-postgres-url>
AUTH_SECRET=<secure-32-char-secret>
ADMIN_EMAIL=<admin-email>
ADMIN_PASSWORD_HASH=<bcrypt-hash>
CORS_ORIGIN=https://geniuzlab.com
BLOB_READ_WRITE_TOKEN=<vercel-blob-token>
```

### Hosting Options

- **Railway** - Easy Node.js deployment
- **Heroku** - Classic platform-as-a-service
- **Vercel** - Serverless option
- **AWS EC2/ECS** - More control
- **DigitalOcean App Platform** - Affordable VPS

See [../../HANDOVER_DOCS/DEPLOYMENT.md](../../HANDOVER_DOCS/DEPLOYMENT.md).

## Troubleshooting

### Database Connection Error

```bash
# Test connection
psql $DATABASE_URL -c "SELECT 1"

# Check DATABASE_URL format
echo $DATABASE_URL
```

### Migration Fails

```bash
# Reset database (development only)
npx prisma migrate reset

# Or manually
npx prisma db push --force-reset
```

### Port Already in Use

```bash
# Find and kill process
lsof -ti:3001 | xargs kill -9

# Or use different port
PORT=3002 npm run dev
```

### Prisma Client Issues

```bash
# Regenerate Prisma client
npx prisma generate

# Clear cache
rm -rf node_modules/.prisma
npm install
```

## Security Checklist

- ✅ Passwords hashed with bcryptjs
- ✅ JWT tokens for API authentication
- ✅ CORS limited to trusted origins
- ✅ Input validation with Zod
- ✅ SQL injection prevented by Prisma
- ✅ Secrets in environment variables (not code)
- ✅ HTTPS enforced in production
- ✅ Rate limiting recommended

## Best Practices

1. **Always validate input** - Use Zod schemas
2. **Handle errors gracefully** - Return clear error messages
3. **Use TypeScript** - No `any` types
4. **Database indexes** - Index frequently queried fields
5. **Logging** - Log important operations
6. **API versioning** - Plan for v2 API early
7. **Documentation** - Keep API docs current
8. **Testing** - Unit and integration tests

## Contributing

1. Create feature branch: `git checkout -b feature/new-feature`
2. Make changes in `apps/backend/`
3. Test thoroughly: `npm run dev`
4. Run linting: `npm run lint`
5. Build: `npm run build`
6. Commit and push
7. Create pull request

## Support

- See [../../DOCS/TECHNICAL.md](../../DOCS/TECHNICAL.md) for architecture
- See [../../DOCS/API.md](../../DOCS/API.md) for API documentation
- See [../../README.md](../../README.md) for monorepo overview

## License

MIT - See [../../LICENSE](../../LICENSE)
