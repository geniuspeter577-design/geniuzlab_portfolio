import { Hero } from "@/components/home/Hero";
import { AboutPreview } from "@/components/home/AboutPreview";
import { BibleVerseToast } from "@/components/home/BibleVerseToast";
import { FeaturedWork } from "@/components/home/FeaturedWork";
import { ServicesOverview } from "@/components/home/ServicesOverview";
import { ContactPreview } from "@/components/home/ContactPreview";
import { getAllProjects } from "@/lib/projects";
import type { Project } from "@/lib/types";

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
      <BibleVerseToast />
      <Hero projects={projects} />
      <AboutPreview />
      <FeaturedWork projects={projects.filter((project) => project.featured)} />
      <ServicesOverview />
      <ContactPreview />
    </>
  );
}
