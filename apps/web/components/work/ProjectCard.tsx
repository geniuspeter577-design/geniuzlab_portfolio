import Image from "next/image";
import Link from "next/link";
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
      <div
        className={cn(
          "relative bg-surface transition-all duration-500 ease-[var(--ease-cinema)]",
          "border border-line/50 hover:border-brass/50"
        )}
      >
        <Image
          src={project.coverImage.src}
          alt={project.coverImage.alt}
          width={project.coverImage.width}
          height={project.coverImage.height}
          priority={priority}
          sizes={size === "large" ? "(min-width: 768px) 60vw, 100vw" : "(min-width: 768px) 33vw, 100vw"}
          className="block h-auto w-full object-contain"
        />

        {project.isPlaceholder && (
          <span className="eyebrow absolute left-3 top-3 bg-cinema/90 px-2 py-1 text-cinema-ink">
            Placeholder
          </span>
        )}

        <span className="absolute bottom-4 right-4 flex h-10 w-10 -translate-y-2 items-center justify-center rounded-full bg-brass text-cinema opacity-0 transition-all duration-300 ease-[var(--ease-cinema)] group-hover:translate-y-0 group-hover:opacity-100 shadow-lg">
          <span aria-hidden className="text-sm font-bold">
            ↗
          </span>
        </span>
      </div>

      <div className="mt-5 flex items-start justify-between gap-4 border-t border-line/50 pt-4">
        <div className="flex-1 min-w-0">
          <h3 className="font-display text-lg sm:text-xl leading-snug text-ink group-hover:text-brass transition-colors">
            {project.title}
          </h3>
          {project.client && (
            <p className="mt-1 text-sm text-ink-muted">{project.client}</p>
          )}
        </div>
        <div className="eyebrow shrink-0 text-right text-ink-muted text-xs">
          <p className="font-semibold text-brass/70">{primaryCategory?.label}</p>
          <p>{project.year}</p>
        </div>
      </div>
    </Link>
  );
}
