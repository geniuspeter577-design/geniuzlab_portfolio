import { Hero } from "@/components/home/Hero";
import { AboutPreview } from "@/components/home/AboutPreview";
import { FeaturedWork } from "@/components/home/FeaturedWork";
import { ServicesOverview } from "@/components/home/ServicesOverview";
import { ContactPreview } from "@/components/home/ContactPreview";
import { getAllProjects } from "@/lib/projects";
import type { Project } from "@/lib/types";
import { categories } from "@/lib/categories";

export const revalidate = 60;

export default async function Home() {
  let projects: Project[] = [];

  try {
    projects = await getAllProjects();
  } catch {
    projects = [];
  }

  return (
    <>
      <Hero />
      <AboutPreview />
      <section className="section" aria-labelledby="studio-metrics-title">
        <div className="site-container">
          <div className="section-heading-row">
            <div>
              <p className="section-kicker">Studio telemetry</p>
              <h2 id="studio-metrics-title" className="section-title">A living archive of the work.</h2>
            </div>
            <span className="eyebrow">Active // {new Date().getFullYear()}</span>
          </div>
          <div className="metrics-strip">
            <div className="metric-card"><strong>{projects.length}</strong><span>Published projects</span></div>
            <div className="metric-card"><strong>{categories.length}</strong><span>Work categories</span></div>
            <div className="metric-card"><strong>{projects.filter((project) => project.featured).length}</strong><span>Featured projects</span></div>
          </div>
        </div>
      </section>
      <FeaturedWork projects={projects.filter((project) => project.featured)} />
      <ServicesOverview />
      <ContactPreview />
    </>
  );
}
