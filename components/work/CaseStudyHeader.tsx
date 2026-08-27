import Image from "next/image";
import type { Project } from "@/lib/types";
import { getCategoryBySlug } from "@/lib/categories";
import { Tag } from "@/components/ui/Tag";

interface CaseStudyHeaderProps {
  project: Project;
}

export function CaseStudyHeader({ project }: CaseStudyHeaderProps) {
  return (
    <header>
      <div className="container-editorial pt-12">
        {project.isPlaceholder && (
          <p className="eyebrow mb-6 inline-block border border-brass/40 px-3 py-1.5 text-brass">
            Placeholder project — replace with real case study content
          </p>
        )}

        <div className="flex flex-wrap items-center gap-2">
          {project.categories.map((slug) => {
            const category = getCategoryBySlug(slug);
            return category ? <Tag key={slug}>{category.label}</Tag> : null;
          })}
        </div>

        <h1 className="mt-6 max-w-4xl font-display text-hero leading-[0.95]">
          {project.title}
        </h1>

        <dl className="mt-8 grid grid-cols-2 gap-6 border-t border-line pt-6 text-sm sm:grid-cols-4">
          {project.client && (
            <div>
              <dt className="eyebrow text-ink-muted">Client</dt>
              <dd className="mt-1">{project.client}</dd>
            </div>
          )}
          <div>
            <dt className="eyebrow text-ink-muted">Year</dt>
            <dd className="mt-1">{project.year}</dd>
          </div>
          {project.role && (
            <div>
              <dt className="eyebrow text-ink-muted">Role</dt>
              <dd className="mt-1">{project.role}</dd>
            </div>
          )}
        </dl>
      </div>

      <div className="container-editorial mt-10">
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-surface">
          <Image
            src={project.coverImage.src}
            alt={project.coverImage.alt}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>
      </div>
    </header>
  );
}
