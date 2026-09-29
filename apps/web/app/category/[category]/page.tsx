import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllCategories, getCategoryBySlug } from "@/lib/categories";
import { getProjectsByCategory } from "@/lib/projects";
import type { Project } from "@/lib/types";
import { CategoryFilter } from "@/components/work/CategoryFilter";
import { ProjectGrid } from "@/components/work/ProjectGrid";

export const revalidate = 60;

export function generateStaticParams() {
  return getAllCategories().map((category) => ({ category: category.slug }));
}

export async function generateMetadata(
  props: PageProps<"/category/[category]">
): Promise<Metadata> {
  const { category: slug } = await props.params;
  const category = getCategoryBySlug(slug);

  if (!category) return {};

  return {
    title: category.label,
    description: category.description,
  };
}

export default async function CategoryPage(props: PageProps<"/category/[category]">) {
  const { category: slug } = await props.params;
  const category = getCategoryBySlug(slug);

  if (!category) notFound();

  let projects: Project[] = [];

  try {
    projects = await getProjectsByCategory(category.slug);
  } catch {
    projects = [];
  }

  return (
    <>
      <div className="category-heading site-container">
        <div className="category-heading-top">
          <p className="eyebrow">Category // active archive</p>
          <span className="status-badge"><span aria-hidden="true" /> {projects.length} projects</span>
        </div>
        <h1>{category.label}</h1>
        <p>{category.description}</p>
      </div>

      <CategoryFilter />

      <div className="site-container section-padding category-grid-shell">
        <ProjectGrid
          projects={projects}
          emptyMessage={`No ${category.label.toLowerCase()} projects published yet.`}
        />
      </div>
    </>
  );
}
