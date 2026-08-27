import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getAllProjects, getAdjacentProject, getProjectBySlug } from "@/lib/projects";
import { CaseStudyHeader } from "@/components/work/CaseStudyHeader";
import { Reveal } from "@/components/ui/Reveal";

export function generateStaticParams() {
  return getAllProjects().map((project) => ({ slug: project.slug }));
}

export async function generateMetadata(
  props: PageProps<"/work/[slug]">
): Promise<Metadata> {
  const { slug } = await props.params;
  const project = getProjectBySlug(slug);

  if (!project) return {};

  return {
    title: project.title,
    description: project.summary,
  };
}

export default async function ProjectPage(props: PageProps<"/work/[slug]">) {
  const { slug } = await props.params;
  const project = getProjectBySlug(slug);

  if (!project) notFound();

  const next = getAdjacentProject(slug);

  return (
    <>
      <CaseStudyHeader project={project} />

      <div className="container-editorial section-padding">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          {project.description && (
            <div className="lg:col-span-7">
              <p className="eyebrow text-ink-muted">About the project</p>
              <p className="mt-4 max-w-2xl text-lead leading-relaxed">{project.description}</p>
            </div>
          )}

          {project.tags && project.tags.length > 0 && (
            <div className="lg:col-span-4 lg:col-start-9">
              <p className="eyebrow text-ink-muted">Tags</p>
              <p className="mt-4 text-sm text-ink-muted">{project.tags.join(" · ")}</p>
            </div>
          )}
        </div>

        {project.gallery.length > 0 && (
          <div className="mt-16 flex flex-col gap-8">
            {project.gallery.map((image, index) => (
              <Reveal key={`${image.src}-${index}`}>
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-surface">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    sizes="100vw"
                    className="object-cover"
                  />
                </div>
              </Reveal>
            ))}
          </div>
        )}
      </div>

      {next && (
        <Link
          href={`/work/${next.slug}`}
          className="cinema-grain group flex items-center justify-between border-t border-cinema-line bg-cinema px-6 py-10 text-cinema-ink sm:px-10 md:py-16"
        >
          <span className="eyebrow text-cinema-muted">Next project</span>
          <span className="font-display text-2xl transition-colors group-hover:text-brass-dim sm:text-4xl">
            {next.title} →
          </span>
        </Link>
      )}
    </>
  );
}
