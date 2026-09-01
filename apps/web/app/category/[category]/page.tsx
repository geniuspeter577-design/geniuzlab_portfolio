import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllCategories, getCategoryBySlug } from "@/lib/categories";
import { getProjectsByCategory } from "@/lib/projects";
import { CategoryFilter } from "@/components/work/CategoryFilter";
import { ProjectGrid } from "@/components/work/ProjectGrid";

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

  const projects = getProjectsByCategory(category.slug);

  return (
    <>
      <div className="container-editorial pt-16 pb-10">
        <p className="eyebrow text-brass">Category</p>
        <h1 className="mt-3 max-w-2xl font-display text-display">{category.label}</h1>
        <p className="mt-4 max-w-xl text-lead text-ink-muted">{category.description}</p>
      </div>

      <CategoryFilter />

      <div className="container-editorial section-padding">
        <ProjectGrid
          projects={projects}
          emptyMessage={`No ${category.label.toLowerCase()} projects published yet.`}
        />
      </div>
    </>
  );
}
