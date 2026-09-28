import type { Metadata } from "next";
import { SearchExperience } from "@/components/search/SearchExperience";
import { getAllProjects } from "@/lib/projects";
import type { Project } from "@/lib/types";

export const metadata: Metadata = {
  title: "Search the archive",
  description: "Search published GeniuzLab projects and categories.",
};

export const revalidate = 60;

export default async function SearchPage() {
  let projects: Project[] = [];
  try {
    projects = await getAllProjects();
  } catch {
    projects = [];
  }

  return <SearchExperience projects={projects} />;
}
