import type { Metadata } from "next";
import { getAllProjects } from "@/lib/projects";
import { CategoryFilter } from "@/components/work/CategoryFilter";
import { ProjectGrid } from "@/components/work/ProjectGrid";

export const metadata: Metadata = {
  title: "Work",
  description: "The full body of work — graphic design, branding, church design, social, motion, and client projects.",
};

export default function WorkPage() {
  const projects = getAllProjects();

  return (
    <>
      <div className="container-editorial pt-16 pb-10">
        <p className="eyebrow text-brass">Portfolio</p>
        <h1 className="mt-3 max-w-2xl font-display text-display">All work</h1>
      </div>

      <CategoryFilter />

      <div className="container-editorial section-padding">
        <ProjectGrid projects={projects} />
      </div>
    </>
  );
}
