/**
 * Backend Project Type Definitions
 * Shared types for backend project operations
 */

export interface ProjectImage {
  id: string;
  url: string;
  altText: string | null;
  width?: number;
  height?: number;
  type: 'COVER' | 'GALLERY';
  orderIndex: number;
}

export interface ProjectCategory {
  id: string;
  slug: string;
  label: string;
  description?: string;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  client: string | null;
  year: number | null;
  role: string | null;
  summary: string;
  description: string;
  featured: boolean;
  published: boolean;
  orderIndex: number;
  createdAt: Date;
  updatedAt: Date;
  categories: ProjectCategory[];
  tags: string[];
  images: ProjectImage[];
  coverImage?: ProjectImage;
}

export interface AdminSession {
  user?: {
    email?: string;
    name?: string;
  };
}
