import type { Project } from "@/lib/types";
import { ProjectCard } from "./ProjectCard";
import { Reveal } from "@/components/ui/Reveal";

interface ProjectGridProps {
  projects: Project[];
  emptyMessage?: string;
}

/**
 * The primary browsing grid for /work and /category/[category].
 * Deliberately a plain, even grid — restraint here keeps the imagery (not
 * the layout) doing the work. The signature editorial moment lives in the
 * homepage "Index" section, not here.
 */
export function ProjectGrid({
  projects,
  emptyMessage = "No projects here yet.",
}: ProjectGridProps) {
  if (projects.length === 0) {
    return (
      <div className="portfolio-empty-state">
        <p className="eyebrow">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="portfolio-grid">
      {projects.map((project, index) => (
        <Reveal key={project.slug} delay={(index % 3) * 80}>
          <ProjectCard project={project} priority={index < 3} />
        </Reveal>
      ))}
    </div>
  );
}
