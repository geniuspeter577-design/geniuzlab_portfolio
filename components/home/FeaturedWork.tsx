import { getFeaturedProjects } from "@/lib/projects";
import { ProjectCard } from "@/components/work/ProjectCard";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";

export function FeaturedWork() {
  const featured = getFeaturedProjects();

  if (featured.length === 0) return null;

  return (
    <section className="section-padding">
      <div className="container-editorial">
        <Reveal>
          <div className="flex flex-col gap-4 border-b border-line pb-8 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="eyebrow text-brass">Selected Work</p>
              <h2 className="mt-3 font-display text-display">Featured projects</h2>
            </div>
            <Button href="/work" variant="link">
              View all work →
            </Button>
          </div>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-x-8 gap-y-14 md:grid-cols-2">
          {featured.map((project, index) => (
            <Reveal key={project.slug} delay={index * 100}>
              <ProjectCard project={project} size="large" priority={index === 0} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
