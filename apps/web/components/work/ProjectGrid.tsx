"use client";

import { useEffect, useState } from "react";
import type { Project } from "@/lib/types";
import { ProjectCard } from "./ProjectCard";
import { Reveal } from "@/components/ui/Reveal";
import { shuffleItems } from "@/lib/shuffle";

interface ProjectGridProps {
  projects: Project[];
  emptyMessage?: string;
  limit?: number;
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
  limit,
}: ProjectGridProps) {
  const [shuffledProjects, setShuffledProjects] = useState(projects);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setShuffledProjects(shuffleItems(projects));
  }, [projects]);

  if (projects.length === 0) {
    return (
      <div className="portfolio-empty-state">
        <p className="eyebrow">{emptyMessage}</p>
      </div>
    );
  }

  const visibleProjects = shuffledProjects.slice(0, limit);

  return (
    <div className="portfolio-grid">
      {visibleProjects.map((project, index) => (
        <Reveal key={project.slug} delay={(index % 3) * 80}>
          <ProjectCard project={project} priority={index < 3} />
        </Reveal>
      ))}
    </div>
  );
}
