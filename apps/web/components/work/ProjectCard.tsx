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
    <Link href={`/work/${project.slug}`} className="project-card-link group">
      <article className="project-card">
        <div className="project-card-heading">
          <p className="project-card-label">{project.client || primaryCategory?.label}</p>
          <span className="project-card-year">{project.year}</span>
        </div>

        <div className={cn("project-card-image", project.videoUrl && "project-card-image-video", "transition-all duration-500 ease-[var(--ease-cinema)]")}>
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
            <span className="project-card-video-badge" aria-label="Video project">
              <Play size={12} fill="currentColor" aria-hidden="true" />
              Video
            </span>
          )}

          <span className="project-card-action" aria-hidden="true"><ArrowUpRight size={18} /></span>
        </div>

        <div className="project-card-footer">
          <h2>{project.title}</h2>
          <span className="project-card-arrow">↗</span>
        </div>
      </article>
    </Link>
  );
}
