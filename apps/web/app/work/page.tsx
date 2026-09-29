import type { Metadata } from "next";
import Link from "next/link";
import { CategoryFilter } from "@/components/work/CategoryFilter";
import { ProjectGrid } from "@/components/work/ProjectGrid";
import { getAllProjects } from "@/lib/projects";
import type { Project } from "@/lib/types";

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
export const revalidate = 60;

export default async function WorkPage() {
  let projects: Project[] = [];

  try {
    projects = await getAllProjects();
  } catch {
    projects = [];
  }

  return (
    <>
      <section className="work-page-shell">
        <div className="site-container work-page-heading">
          <div className="work-page-header-row">
            <div>
              <p className="eyebrow">Portfolio archive // {projects.length.toString().padStart(2, "0")} entries</p>
              <h1>Our Work</h1>
            </div>
            <Link href="/services" className="button-secondary">Explore services</Link>
          </div>

          <div className="work-heading-meta">
            <p>Selected work across the studio archive, presented from the live portfolio.</p>
            <span className="status-badge"><span aria-hidden="true" /> live archive</span>
          </div>
        </div>

        <CategoryFilter />

        <div className="site-container work-grid-shell">
          <ProjectGrid projects={projects} />
        </div>
      </section>
    </>
  );
}
