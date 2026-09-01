# Contributing to GeniuzLab Portfolio

Thank you for considering contributing to GeniuzLab Portfolio! This document provides guidelines and instructions for contributing to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Code Standards](#code-standards)
- [Commit Messages](#commit-messages)
- [Pull Requests](#pull-requests)
- [Testing](#testing)
- [Documentation](#documentation)

---

## Code of Conduct

This project adheres to the Contributor Covenant Code of Conduct. By participating, you are expected to uphold this code.

**Be respectful**, **be inclusive**, and **be professional**.

---

## Getting Started

### 1. Fork & Clone

```bash
# Fork the repository on GitHub
# Clone your fork
git clone https://github.com/YOUR_USERNAME/geniuzlab_portfolio.git
cd geniuzlab_portfolio

# Add upstream remote
git remote add upstream https://github.com/geniuspeter577-design/geniuzlab_portfolio.git
```

### 2. Setup Development Environment

```bash
# Install dependencies
npm install

# Setup database
cp .env.example .env.local
# Edit .env.local with your database URL

npm run db:push

# Start development servers
npm run dev
```

### 3. Create Feature Branch

```bash
# Update main
git checkout main
git pull upstream main

# Create feature branch
git checkout -b feature/your-feature-name

# Or for bug fixes
git checkout -b fix/bug-description

# Or for documentation
git checkout -b docs/documentation-update
```

---

## Development Workflow

### Before You Start

1. **Check existing issues** - Ensure your feature isn't already in progress
2. **Create an issue** - Discuss major changes before implementing
3. **Read documentation** - Familiarize yourself with the architecture
4. **Set up IDE** - Use TypeScript-aware editor (VS Code recommended)

### Development Process

1. **Make changes** in appropriate location:
   - Frontend changes → `apps/web/`
   - Backend changes → `apps/backend/`
   - Shared code → `packages/shared/`

2. **Keep commits atomic** - One feature per commit

3. **Test your changes**:
   ```bash
   # Run linter
   npm run lint
   
   # Type check
   npx tsc --noEmit
   
   # Build
   npm run build
   
   # Manual testing
   npm run dev
   ```

4. **Run the full development suite**:
   ```bash
   # Frontend tests (if implemented)
   npm run test:web
   
   # Backend tests (if implemented)
   npm run test:backend
   ```

### File Organization

**Frontend Structure** (`apps/web/`):
```
app/               # Next.js App Router pages
components/        # React components
lib/              # Utilities, API calls
hooks/            # Custom React hooks
public/           # Static assets
```

**Backend Structure** (`apps/backend/`):
```
src/
  index.ts        # Server entry point
  routes/         # API endpoints
  lib/            # Business logic
  middleware/     # Express middleware
```

**Shared Structure** (`packages/shared/`):
```
src/
  types/          # TypeScript interfaces
  constants/      # Site configuration
  utils/          # Helper functions
```

---

## Code Standards

### TypeScript

- ✅ **Use TypeScript** - No `any` types allowed
- ✅ **Strict mode** - TypeScript strict mode is enabled
- ✅ **Type imports** - Use `import type` for types
- ✅ **Interfaces over types** - Prefer `interface` for object shapes

**Bad:**
```typescript
const project: any = await getProject();
```

**Good:**
```typescript
import type { Project } from '@geniuzlab/shared/types';
const project: Project = await getProject();
```

### Frontend (React)

- ✅ **Functional components** - Use function components, not classes
- ✅ **Hooks** - Extract reusable logic to custom hooks
- ✅ **Component composition** - Keep components small and focused
- ✅ **Props interfaces** - Define props with interfaces
- ✅ **Tailwind CSS** - Use Tailwind for styling

**Bad:**
```tsx
export function Card(props) {
  return <div style={{ padding: '1rem' }}>{props.title}</div>;
}
```

**Good:**
```tsx
interface CardProps {
  title: string;
}

export function Card({ title }: CardProps) {
  return <div className="p-4">{title}</div>;
}
```

### Backend (Express)

- ✅ **Routes** - Organize routes in separate files
- ✅ **Middleware** - Use middleware for common logic
- ✅ **Error handling** - Consistent error responses
- ✅ **Validation** - Validate all inputs with Zod
- ✅ **Type safety** - Use TypeScript throughout

**Bad:**
```typescript
app.post('/api/projects', (req, res) => {
  const project = req.body;
  db.save(project);
  res.json(project);
});
```

**Good:**
```typescript
const createProjectSchema = z.object({
  title: z.string().min(1),
  // ...
});

router.post('/', async (req, res) => {
  const parsed = createProjectSchema.safeParse(req.body);
  
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid input' });
  }
  
  const project = await prisma.project.create({
    data: parsed.data
  });
  
  res.status(201).json(project);
});
```

### Naming Conventions

**Files & Folders:**
- Components: PascalCase (`ProjectCard.tsx`)
- Utilities: camelCase (`formatDate.ts`)
- Routes: kebab-case (`/api/admin/projects`)
- Types: PascalCase (`Project`, `Category`)

**Variables & Functions:**
- Variables: camelCase (`projectList`, `isActive`)
- Constants: UPPER_SNAKE_CASE (`MAX_FILE_SIZE`)
- Functions: camelCase (`getProjects()`, `formatDate()`)
- Booleans: prefix with `is`, `has`, `can` (`isPublished`, `hasImage`)

**Example:**
```typescript
// ✅ Good
interface ProjectCardProps {
  project: Project;
  isHighlighted?: boolean;
}

const MAX_IMAGE_SIZE = 50 * 1024 * 1024;

function ProjectCard({ project, isHighlighted }: ProjectCardProps) {
  // ...
}

// ❌ Bad
interface ProjectCardProps {
  p: any;
}

const maxImageSize = 50 * 1024 * 1024;

function projectcard(p) {
  // ...
}
```

### Imports

**Type imports:**
```typescript
import type { Project, Category } from '@geniuzlab/shared/types';
import type { Request, Response } from 'express';
```

**Regular imports:**
```typescript
import { siteConfig } from '@geniuzlab/shared/constants';
import express from 'express';
```

**Monorepo imports:**
```typescript
// ✅ Good - Import from workspace
import type { Project } from '@geniuzlab/shared/types';

// ❌ Bad - Don't import across apps
import type { User } from '../../backend/src/lib/types';
```

---

## Commit Messages

Write clear, descriptive commit messages following the conventional commits format:

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation
- `style:` - Code style (formatting, missing semicolons, etc.)
- `refactor:` - Code refactoring
- `perf:` - Performance improvements
- `test:` - Adding or updating tests
- `chore:` - Dependency updates, maintenance

### Scopes

- `web` - Frontend (apps/web)
- `backend` - Backend API (apps/backend)
- `shared` - Shared package (packages/shared)
- `docs` - Documentation
- `ci` - CI/CD configuration

### Examples

```bash
# Good
git commit -m "feat(web): add project filter by category"
git commit -m "fix(backend): correct project slug validation"
git commit -m "docs(shared): update type documentation"
git commit -m "refactor(web): extract ProjectCard component"
git commit -m "perf(backend): add database indexes on published field"

# Bad
git commit -m "Update stuff"
git commit -m "Fixed bugs"
git commit -m "WIP: new feature"
```

---

## Pull Requests

### Before Creating a PR

1. **Sync with upstream:**
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Ensure all tests pass:**
   ```bash
   npm run lint
   npm run build
   ```

3. **Update documentation** if needed

### Creating a PR

1. **Push your branch:**
   ```bash
   git push origin feature/your-feature-name
   ```

2. **Create PR on GitHub** with:
   - **Clear title** - What does this change?
   - **Description** - Why and how?
   - **Related issues** - Links to related issues
   - **Testing** - How to test the changes
   - **Screenshots** - For UI changes

3. **PR Title Format:**
   ```
   feat(web): add project filtering by category
   fix(backend): correct admin authentication
   docs: update deployment guide
   ```

### PR Description Template

```markdown
## Description
Brief description of what this PR does.

## Related Issues
Closes #123

## Type of Change
- [x] New feature
- [ ] Bug fix
- [ ] Documentation update

## Changes Made
- Specific change 1
- Specific change 2

## Testing
How to test these changes:
1. Step 1
2. Step 2

## Screenshots (if applicable)
[Add screenshots for UI changes]

## Checklist
- [x] TypeScript compiles without errors
- [x] Lint passes (`npm run lint`)
- [x] Tests pass (if applicable)
- [x] Documentation updated
- [x] Commits are atomic and well-described
```

### PR Review Process

- At least one review required
- Address feedback promptly
- Keep PR focused (one feature per PR)
- No force-pushing after review starts

---

## Testing

### Frontend Testing

```bash
# If tests are configured
npm run test:web

# Manual testing
npm run dev:web
# Navigate to affected pages and test functionality
```

### Backend Testing

```bash
# If tests are configured
npm run test:backend

# Manual API testing with curl
curl -X GET http://localhost:3001/api/projects
```

### What to Test

- **Functionality** - Does it work as intended?
- **Edge cases** - Empty data, invalid input?
- **Performance** - No obvious slowdowns?
- **Types** - TypeScript catches issues?
- **Styling** - Looks good on mobile and desktop?
- **Error handling** - Proper error messages?

---

## Documentation

### When to Document

- New features → Update relevant docs
- API changes → Update API.md
- Database changes → Update schema docs
- New environment variables → Update .env.example

### Documentation Files

- **README.md** - Project overview
- **DOCS/TECHNICAL.md** - Architecture and design
- **DOCS/API.md** - Backend API endpoints
- **DOCS/ARCHITECTURE.md** - System design
- **HANDOVER_DOCS/SETUP.md** - Development setup
- **HANDOVER_DOCS/DEPLOYMENT.md** - Production deployment
- **apps/web/README.md** - Frontend specifics
- **apps/backend/README.md** - Backend specifics

### Code Comments

Comment complex logic but keep it minimal:

```typescript
// ✅ Good - Explains why
// Batch update to reduce database round-trips
const projects = await Promise.all(
  projectIds.map(id => updateProject(id))
);

// ❌ Bad - States the obvious
// Loop through projects
for (const project of projects) {
```

---

## Common Tasks

### Adding a New Page

```bash
# Frontend
1. Create app/your-page/page.tsx
2. Add to navigation if needed (components/layout/Navigation.tsx)
3. Add route to constants if needed (lib/constants.ts)
4. Test navigation and page loading
```

### Adding an API Endpoint

```bash
# Backend
1. Create route in apps/backend/src/routes/new-resource.ts
2. Add to router in apps/backend/src/routes/index.ts
3. Add Zod validation schema
4. Test with curl or Postman
5. Update DOCS/API.md
```

### Updating Database Schema

```bash
# Backend
1. Update prisma/schema.prisma
2. Create migration: npm run db:migrate
3. Test locally: npm run db:push
4. Document changes in commit message
5. Update DOCS/TECHNICAL.md if needed
```

### Adding a Shared Type

```bash
# Shared
1. Edit packages/shared/src/types/index.ts
2. Export the new type
3. Use in apps with: import type { NewType } from '@geniuzlab/shared/types'
4. Update packages/shared/README.md if complex
```

---

## Performance Guidelines

### Frontend

- ✅ Use `next/image` for images
- ✅ Lazy load non-critical components
- ✅ Avoid inline styles (use Tailwind)
- ✅ Use React.memo for expensive components
- ✅ Split large components

### Backend

- ✅ Use database indexes
- ✅ Validate early (reject invalid input quickly)
- ✅ Use pagination for large lists
- ✅ Cache frequently accessed data
- ✅ Minimize database queries

---

## Security Guidelines

- ✅ Never commit secrets (.env.local files)
- ✅ Validate all user input
- ✅ Sanitize database queries (use Prisma)
- ✅ Use HTTPS in production
- ✅ Hash passwords with bcryptjs
- ✅ Validate JWT tokens
- ✅ Use environment variables for secrets
- ✅ Review dependencies for vulnerabilities

---

## Getting Help

- **Questions?** - Create a discussion on GitHub
- **Bugs?** - Create an issue with reproduction steps
- **Ideas?** - Start a discussion before creating an issue
- **Chat?** - Contact maintainers directly

---

## Recognition

All contributors will be recognized in:
- Git history
- GitHub contributor page
- Project changelog

Thank you for contributing! 🎉
