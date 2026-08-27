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
          "relative overflow-hidden bg-surface",
          size === "large" ? "aspect-[4/5] md:aspect-[16/11]" : "aspect-[4/5]"
        )}
      >
        <Image
          src={project.coverImage.src}
          alt={project.coverImage.alt}
          fill
          priority={priority}
          sizes={size === "large" ? "(min-width: 768px) 60vw, 100vw" : "(min-width: 768px) 33vw, 100vw"}
          className="object-cover transition-transform duration-700 ease-[var(--ease-cinema)] group-hover:scale-[1.03]"
        />

        {project.isPlaceholder && (
          <span className="eyebrow absolute left-3 top-3 bg-cinema/90 px-2 py-1 text-cinema-ink">
            Placeholder
          </span>
        )}

        <span className="absolute bottom-3 right-3 flex h-9 w-9 -translate-y-1 items-center justify-center rounded-full bg-paper text-ink opacity-0 transition-all duration-300 ease-[var(--ease-cinema)] group-hover:translate-y-0 group-hover:opacity-100">
          <span aria-hidden className="text-sm">
            ↗
          </span>
        </span>
      </div>

      <div className="mt-4 flex items-start justify-between gap-4 border-t border-line pt-3">
        <div>
          <h3 className="font-display text-xl leading-snug text-ink group-hover:text-brass">
            {project.title}
          </h3>
          {project.client && (
            <p className="mt-0.5 text-sm text-ink-muted">{project.client}</p>
          )}
        </div>
        <div className="eyebrow shrink-0 text-right text-ink-muted">
          <p>{primaryCategory?.label}</p>
          <p>{project.year}</p>
        </div>
      </div>
    </Link>
  );
}
