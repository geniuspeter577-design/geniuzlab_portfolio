import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getAllProjects, getAdjacentProject, getProjectBySlug, getProjectsByCategory } from "@/lib/projects";
import type { Project } from "@/lib/types";
import { CaseStudyHeader } from "@/components/work/CaseStudyHeader";
import { ProjectCard } from "@/components/work/ProjectCard";
import { Reveal } from "@/components/ui/Reveal";

export const revalidate = 60;

export async function generateStaticParams() {
  let projects: Project[] = [];

  try {
    projects = await getAllProjects();
  } catch {
    projects = [];
  }

  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata(
  props: PageProps<"/work/[slug]">
): Promise<Metadata> {
  const { slug } = await props.params;
  let project: Project | undefined;

  try {
    project = await getProjectBySlug(slug);
  } catch {
    project = undefined;
  }

  if (!project) return {};

  return {
    title: project.title,
    description: project.summary,
  };
}

export default async function ProjectPage(props: PageProps<"/work/[slug]">) {
  const { slug } = await props.params;
  let project: Project | undefined;

  try {
    project = await getProjectBySlug(slug);
  } catch {
    project = undefined;
  }

  if (!project) notFound();

  let next: Project | undefined;
  let related: Project[] = [];

  try {
    next = await getAdjacentProject(slug);
  } catch {
    next = undefined;
  }

  try {
    related = await getProjectsByCategory(project.categories[0]);
  } catch {
    related = [];
  }

  related = related.filter((item) => item.slug !== project.slug).slice(0, 2);

  return (
    <>
      <CaseStudyHeader project={project} />

      <div className="site-container section-padding case-study-body">
        <div className="case-study-intro">
          {project.description && (
            <div>
              <p className="eyebrow">About the project</p>
              <p>{project.description}</p>
            </div>
          )}

          {project.tags && project.tags.length > 0 && (
            <div>
              <p className="eyebrow">Tags</p>
              <div className="case-study-tags">
                {project.tags.map((tag) => <span key={tag}>{tag}</span>)}
              </div>
            </div>
          )}
        </div>

        {project.gallery.length > 0 && (
          <div className="case-study-gallery">
            {project.gallery.map((image, index) => (
              <Reveal key={`${image.src}-${index}`}>
                <div className="case-study-gallery-item">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    width={image.width}
                    height={image.height}
                    sizes="100vw"
                    className="block h-auto w-full object-contain"
                  />
                </div>
              </Reveal>
            ))}
          </div>
        )}

        {related.length > 0 && (
          <section className="related-projects" aria-labelledby="related-projects-title">
            <div className="section-heading-row">
              <div>
                <p className="section-kicker">Related artifacts</p>
                <h2 id="related-projects-title" className="section-title">More from this category.</h2>
              </div>
            </div>
            <div className="work-grid">
              {related.map((item) => <ProjectCard key={item.slug} project={item} />)}
            </div>
          </section>
        )}
      </div>

      {next && (
        <Link
          href={`/work/${next.slug}`}
          className="next-project group"
        >
          <span className="eyebrow">Next project</span>
          <span>{next.title} <ArrowUpRight aria-hidden="true" size={22} /></span>
        </Link>
      )}
    </>
  );
}
