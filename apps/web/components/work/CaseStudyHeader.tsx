import Image from "next/image";
import type { Project } from "@/lib/types";
import { getCategoryBySlug } from "@/lib/categories";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";

interface CaseStudyHeaderProps {
  project: Project;
}

export function CaseStudyHeader({ project }: CaseStudyHeaderProps) {
  const primaryCategory = getCategoryBySlug(project.categories[0]);

  return (
    <header className="case-study-header">
      <div className="site-container case-study-header-inner">
        <div className="case-study-topline">
          <Link href="/work" className="case-study-back"><ArrowLeft aria-hidden="true" size={16} /> Back to work</Link>
          <span className="eyebrow">Case study // {primaryCategory?.label ?? "Portfolio"}</span>
        </div>

        {project.isPlaceholder && (
          <p className="eyebrow case-study-placeholder">
            Placeholder project — replace with real case study content
          </p>
        )}

        <div className="case-study-hero-copy">
          <div>
            <h1>{project.title}</h1>
            <p className="case-study-summary">{project.summary}</p>
          </div>

          <dl className="case-study-meta">
            {project.client && (
              <div>
                <dt>Client</dt>
                <dd>{project.client}</dd>
              </div>
            )}
            <div>
              <dt>Year</dt>
              <dd>{project.year}</dd>
            </div>
            {project.role && (
              <div>
                <dt>Role</dt>
                <dd>{project.role}</dd>
              </div>
            )}
          </dl>
        </div>
      </div>

      <div className="site-container case-study-cover-wrap">
        <div className="case-study-cover">
          {project.videoUrl ? (
            <video
              src={project.videoUrl}
              poster={project.videoPosterUrl || project.coverImage.src}
              controls
              playsInline
              preload="metadata"
              aria-label={`${project.title} video`}
              className="block aspect-video w-full max-w-full bg-black object-contain"
            />
          ) : (
            <Image
              src={project.coverImage.src}
              alt={project.coverImage.alt}
              width={project.coverImage.width}
              height={project.coverImage.height}
              priority
              sizes="(min-width: 1024px) 1180px, 100vw"
              className="block h-auto w-full"
            />
          )}
        </div>
      </div>
    </header>
  );
}
