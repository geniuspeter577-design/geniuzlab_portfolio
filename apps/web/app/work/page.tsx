import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getAllProjects } from "@/lib/projects";
import type { Project } from "@/lib/types";
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
      <section className="work-page-heading">
        <p className="eyebrow">Portfolio archive // {projects.length.toString().padStart(2, "0")} entries</p>
        <div className="work-page-title-row">
          <h1>Our Work</h1>
          <ArrowUpRight aria-hidden="true" size={28} />
        </div>
        <div className="section-underline" />
        <div className="work-heading-meta">
          <p>Selected work across the studio archive, presented from the live portfolio.</p>
          <Link href="/services" className="work-services-link">Explore services</Link>
        </div>
      </section>

      <ProjectGrid projects={projects} />
    </>
  );
}
