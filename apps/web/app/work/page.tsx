import type { Metadata } from "next";
import { getAllProjects } from "@/lib/projects";
import { CategoryFilter } from "@/components/work/CategoryFilter";
import { ProjectGrid } from "@/components/work/ProjectGrid";

export const metadata: Metadata = {
  title: "Work",
  description: "The full body of work — graphic design, branding, church design, social, motion, and client projects.",
};

/**
 * Heading restyled to match the mockup's page-heading ("All Work"). The
 * mockup's pageWork() body is just a .portfolio-grid of placeholder
 * .tile cards (one per category) — it has no real project data at all.
 * Your CategoryFilter and ProjectGrid components render real projects,
 * which is worth more than the mockup's placeholders, so they're left
 * untouched here rather than replaced with placeholder tiles. Send me
 * those two files (and lib/projects) if you want their card styling
 * (rounded corners, gradient fill) brought in line with .tile/.card too.
 */
export default function WorkPage() {
  const projects = getAllProjects();

  return (
    <>
      <section>
        <h1 className="page-heading">All Work</h1>
      </section>

      <CategoryFilter />

      <ProjectGrid projects={projects} />
    </>
  );
}
