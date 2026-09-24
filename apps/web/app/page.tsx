import { Hero } from "@/components/home/Hero";
import { AboutPreview } from "@/components/home/AboutPreview";
import { ContactPreview } from "@/components/home/ContactPreview";
import { FeaturedWork } from "@/components/home/FeaturedWork";
import { ServicesOverview } from "@/components/home/ServicesOverview";
import { Testimonials } from "@/components/home/Testimonials";
import type { Project } from "@/lib/types";

export const revalidate = 60;

export default async function Home() {
  let projects: Project[] = [];

  try {
    const { getAllProjects } = await import("@/lib/projects");
    projects = await getAllProjects();
  } catch {
    projects = [];
  }

  return (
    <>
      <Hero />
      <AboutPreview />
      <FeaturedWork projects={projects} />
      <Testimonials />
      <ServicesOverview />
      <ContactPreview />
    </>
  );
}
