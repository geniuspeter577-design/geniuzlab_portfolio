import type { Project } from "./types";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

async function backendFetch<T>(path: string): Promise<T> {
  const response = await fetch(`${BACKEND_URL}${path}`, {
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    throw new Error(`Backend request failed (${response.status})`);
  }

  return response.json() as Promise<T>;
}

export async function getAllProjects(): Promise<Project[]> {
  const { projects } = await backendFetch<{ projects: Project[] }>("/api/projects");
  return projects;
}

export async function getProjectBySlug(slug: string): Promise<Project | undefined> {
  const response = await fetch(`${BACKEND_URL}/api/projects/${encodeURIComponent(slug)}`, {
    next: { revalidate: 60 },
  });

  if (response.status === 404) return undefined;
  if (!response.ok) throw new Error(`Backend request failed (${response.status})`);

  const { project } = (await response.json()) as { project: Project };
  return project;
}

export async function getProjectsByCategory(categorySlug: string): Promise<Project[]> {
  const { projects } = await backendFetch<{ projects: Project[] }>(
    `/api/projects?category=${encodeURIComponent(categorySlug)}`
  );
  return projects;
}

export async function getFeaturedProjects(): Promise<Project[]> {
  const all = await getAllProjects();
  return all.filter((project) => project.featured);
}

export async function getAdjacentProject(slug: string): Promise<Project | undefined> {
  const all = await getAllProjects();
  const index = all.findIndex((project) => project.slug === slug);
  if (index === -1 || all.length === 0) return undefined;
  return all[(index + 1) % all.length];
}
