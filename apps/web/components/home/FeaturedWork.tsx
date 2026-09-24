import Link from "next/link";
import type { Project } from "@/lib/types";
import { ProjectGrid } from "@/components/work/ProjectGrid";

interface FeaturedWorkProps {
  projects: Project[];
}

export function FeaturedWork({ projects }: FeaturedWorkProps) {
  const visibleProjects = projects.slice(0, 6);

  return (
    <section id="work" className="section section-muted">
      <div className="site-container">
        <div className="section-heading section-heading-row">
          <div>
            <p className="section-kicker">Selected work</p>
            <h2 className="section-title">A selection of work worth a closer look.</h2>
          </div>
          <Link href="/work" className="button-secondary">View all work</Link>
        </div>
        {visibleProjects.length > 0 ? (
          <ProjectGrid projects={visibleProjects} />
        ) : (
          <p className="section-lead">New projects are on the way. Browse the work archive for the latest updates.</p>
        )}
      </div>
    </section>
  );
}
