# @geniuzlab/shared - Shared Types & Utilities

Shared TypeScript types, constants, and utility functions used across the GeniuzLab monorepo.

This package is designed to be imported by:
- `apps/web` - Frontend application
- `apps/backend` - Backend API
- `apps/mobile` - Future mobile application
- Any other apps in the monorepo

## Contents

### `src/types/` - TypeScript Interfaces

Domain models and interfaces shared across all apps:

- **Project** - Portfolio project interface
- **ProjectImage** - Project image/gallery interface
- **Category** - Portfolio category interface
- **CategorySlug** - Union type of category slugs
- **User** - Admin user interface
- **Tag** - Project tag interface

### `src/constants/` - Configuration

Site-wide configuration and constants:

- `siteConfig` - Brand name, tagline, contact info
- `mainNav` - Navigation menu structure
- `socialLinks` - Social media profiles
- `whatsappHref` - WhatsApp contact URL

### `src/utils/` - Helper Functions

Utility functions used across apps:

- String formatters
- Date helpers
- Array utilities
- Classification functions

## Installation

This package is already configured as a workspace in the monorepo.

### Import Types

```typescript
import type { Project, Category } from '@geniuzlab/shared/types';
```

### Import Constants

```typescript
import { siteConfig, mainNav, socialLinks } from '@geniuzlab/shared/constants';
```

### Import Utils

```typescript
import { formatDate, truncate } from '@geniuzlab/shared/utils';
```

### Import Everything

```typescript
import { 
  siteConfig, 
  type Project, 
  truncate 
} from '@geniuzlab/shared';
```

## File Structure

```
packages/shared/
├── src/
│   ├── types/
│   │   └── index.ts         # All type definitions
│   ├── constants/
│   │   └── index.ts         # Site configuration
│   ├── utils/
│   │   └── index.ts         # Helper functions
│   └── index.ts             # Main entry point
├── package.json
└── tsconfig.json
```

## Type Definitions

### Project

```typescript
interface Project {
  id: string;
  slug: string;
  title: string;
  client?: string;
  year: number;
  role?: string;
  summary: string;
  description: string;
  featured: boolean;
  published: boolean;
  categories: Category[];
  images: ProjectImage[];
  tags: Tag[];
  createdAt: Date;
  updatedAt: Date;
}
```

### ProjectImage

```typescript
interface ProjectImage {
  id: string;
  projectId: string;
  type: 'COVER' | 'GALLERY';
  url: string;
  altText: string;
  width: number;
  height: number;
  orderIndex: number;
  createdAt: Date;
  updatedAt: Date;
}
```

### Category

```typescript
interface Category {
  id: string;
  slug: CategorySlug;
  label: string;
  description: string;
}

type CategorySlug = 
  | 'graphic-design'
  | 'church-christian'
  | 'branding-identity'
  | 'social-media'
  | 'posters-flyers'
  | 'motion-video'
  | 'client-projects';
```

## Constants

### siteConfig

```typescript
const siteConfig = {
  name: 'GENIUZLAB',
  experienceName: 'GENIUZLAB EXPERIENCE',
  founder: 'Otsaje Genius Peter',
  founderTitle: 'CEO, GENIUZLAB',
  tagline: 'Design that holds attention.',
  description: '...',
  email: 'geniuzlab577@gmail.com',
  phones: ['09138955730', '09011141389'],
  whatsapp: '09138955730',
};
```

### mainNav

```typescript
const mainNav = [
  { label: 'Work', href: '/work' },
  { label: 'About', href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'Contact', href: '/contact' },
];
```

### socialLinks

```typescript
const socialLinks = [
  { label: 'Facebook', href: '...', handle: 'Geniuz Lab' },
  { label: 'Instagram', href: '...', handle: '@geniuz_lab' },
  { label: 'TikTok', href: '...', handle: 'Geniuzlab' },
];
```

## Usage Examples

### In Frontend

```typescript
// app/page.tsx
import { siteConfig, mainNav } from '@geniuzlab/shared/constants';
import type { Project } from '@geniuzlab/shared/types';

export default function Homepage() {
  const projects: Project[] = await fetchProjects();
  
  return (
    <div>
      <h1>{siteConfig.experienceName}</h1>
      <p>{siteConfig.tagline}</p>
      <nav>
        {mainNav.map(item => <a href={item.href}>{item.label}</a>)}
      </nav>
    </div>
  );
}
```

### In Backend

```typescript
// apps/backend/src/routes/projects.ts
import type { Project } from '@geniuzlab/shared/types';
import { siteConfig } from '@geniuzlab/shared/constants';

router.get('/projects', async (req, res) => {
  const projects: Project[] = await prisma.project.findMany({
    where: { published: true }
  });
  
  res.json({
    projects,
    site: siteConfig.name
  });
});
```

## Adding New Types

1. Edit `src/types/index.ts`
2. Add TypeScript interface or type
3. Export from the file
4. Automatically available in all apps via `@geniuzlab/shared/types`

Example:

```typescript
// src/types/index.ts
export interface NewType {
  // ...
}
```

## Adding New Constants

1. Edit `src/constants/index.ts`
2. Add constant definition
3. Export from the file
4. Automatically available in all apps via `@geniuzlab/shared/constants`

Example:

```typescript
// src/constants/index.ts
export const newConstant = {
  // ...
};
```

## Adding New Utils

1. Edit `src/utils/index.ts`
2. Add utility function
3. Export from the file
4. Automatically available in all apps via `@geniuzlab/shared/utils`

Example:

```typescript
// src/utils/index.ts
export function newHelper(input: string): string {
  // ...
}
```

## Package Configuration

### package.json

```json
{
  "name": "@geniuzlab/shared",
  "version": "1.0.0",
  "exports": {
    ".": "./src/index.ts",
    "./types": "./src/types/index.ts",
    "./constants": "./src/constants/index.ts",
    "./utils": "./src/utils/index.ts"
  }
}
```

This allows multiple import styles:

```typescript
// From main export
import { siteConfig, type Project } from '@geniuzlab/shared';

// From specific subpath
import type { Project } from '@geniuzlab/shared/types';
import { siteConfig } from '@geniuzlab/shared/constants';
import { formatDate } from '@geniuzlab/shared/utils';
```

## Building

The shared package is built as TypeScript source (no compilation step needed).

All apps import `.ts` files directly, and their own TypeScript/build process handles compilation.

## Type Safety

Always use `type` imports for types to ensure tree-shaking:

```typescript
// ✅ Good - Type-only import
import type { Project } from '@geniuzlab/shared/types';

// ❌ Avoid - Includes runtime import
import { Project } from '@geniuzlab/shared/types';
```

## Best Practices

1. **Keep it shared** - Only add types/utils used by multiple apps
2. **App-specific code** - Keep in individual apps (`lib/` folders)
3. **Type safety** - No `any` types
4. **Documentation** - Comment complex types
5. **Consistency** - Follow existing naming conventions
6. **Export everything** - Make all types/utils available

## Examples

### Frontend Usage

```typescript
// apps/web/components/ProjectCard.tsx
import type { Project } from '@geniuzlab/shared/types';
import { siteConfig } from '@geniuzlab/shared/constants';

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <div>
      <h3>{project.title}</h3>
      <p>{project.summary}</p>
      <footer>{siteConfig.name} © {new Date().getFullYear()}</footer>
    </div>
  );
}
```

### Backend Usage

```typescript
// apps/backend/src/lib/project-service.ts
import type { Project } from '@geniuzlab/shared/types';
import { prisma } from './prisma';

export async function getPublishedProjects(): Promise<Project[]> {
  return prisma.project.findMany({
    where: { published: true },
    include: {
      images: true,
      categories: true,
      tags: true
    }
  });
}
```

## Versioning

Currently at **v1.0.0** - follows monorepo versioning.

## Dependencies

- **zod** - For validation schemas (optional, used in types)

## Contributing

1. Keep types/constants/utils generic and reusable
2. Don't add app-specific logic here
3. Update documentation when adding new exports
4. Ensure all exports are used by at least 2 apps

## Support

- See [../../README.md](../../README.md) for monorepo overview
- See [../../DOCS/TECHNICAL.md](../../DOCS/TECHNICAL.md) for architecture
- Check individual app READMEs for usage examples

## License

MIT - See [../../LICENSE](../../LICENSE)
