import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Play } from "lucide-react";
import type { Project } from "@/lib/types";
import { getCategoryBySlug } from "@/lib/categories";
import { cn } from "@/lib/utils";

interface ProjectCardProps {
  project: Project;
  /** "large" is used for featured/hero-style placements. */
  size?: "default" | "large";
  priority?: boolean;
}

export function ProjectCard({ project, size = "default", priority = false }: ProjectCardProps) {
  const primaryCategory = getCategoryBySlug(project.categories[0]);

  return (
    <Link href={`/work/${project.slug}`} className="group block">
      <div className="project-card">
        <div className="project-card-heading">
          <p className="project-card-label">{project.client || primaryCategory?.label}</p>
          <h2>{project.title}</h2>
        </div>
        <div
          className={cn("project-card-image relative w-full overflow-hidden", "transition-all duration-500 ease-[var(--ease-cinema)]")}
          style={{ aspectRatio: `${project.coverImage.width} / ${project.coverImage.height}` }}
        >
          <Image
            src={project.coverImage.src}
            alt={project.coverImage.alt}
            priority={priority}
            sizes={size === "large" ? "(min-width: 768px) 60vw, 100vw" : "(min-width: 768px) 70vw, 100vw"}
            className="absolute inset-0 h-full w-full object-cover"
            fill
          />
          <div className="project-card-tags">
            {primaryCategory && <span>{primaryCategory.label}</span>}
            {project.isPlaceholder && <span>Placeholder</span>}
          </div>
          {project.videoUrl && (
            <span className="absolute left-3 top-3 z-10 inline-flex items-center gap-1.5 rounded-full bg-black/75 px-3 py-1.5 text-xs text-white">
              <Play size={12} fill="currentColor" aria-hidden="true" />
              Video
            </span>
          )}
          <span className="project-card-action" aria-hidden="true"><ArrowUpRight size={18} /></span>
        </div>
      </div>
    </Link>
  );
}
