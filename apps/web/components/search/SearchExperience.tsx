"use client";

import { useDeferredValue, useEffect, useState } from "react";
import Link from "next/link";
import { Search, X } from "lucide-react";
import type { Project } from "@/lib/types";
import { categories } from "@/lib/categories";
import { ProjectCard } from "@/components/work/ProjectCard";
import { shuffleItems } from "@/lib/shuffle";

interface SearchExperienceProps {
  projects: Project[];
}

export function SearchExperience({ projects }: SearchExperienceProps) {
  const [shuffledProjects, setShuffledProjects] = useState(projects);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [year, setYear] = useState("all");
  const deferredQuery = useDeferredValue(query.trim().toLocaleLowerCase());
  const years = Array.from(new Set(shuffledProjects.map((project) => project.year).filter(Boolean))).sort((a, b) => b - a);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setShuffledProjects(shuffleItems(projects));
  }, [projects]);

  const results = shuffledProjects.filter((project) => {
    const categoryMatches = category === "all" || project.categories.includes(category as Project["categories"][number]);
    const yearMatches = year === "all" || String(project.year) === year;
    const searchable = [project.title, project.client, project.summary, project.description, ...project.tags ?? []]
      .filter(Boolean)
      .join(" ")
      .toLocaleLowerCase();
    return categoryMatches && yearMatches && (!deferredQuery || searchable.includes(deferredQuery));
  });

  const clearFilters = () => {
    setQuery("");
    setCategory("all");
    setYear("all");
  };

  return (
    <section className="search-page site-container" aria-labelledby="search-title">
      <header className="search-heading">
        <p className="eyebrow">GeniuzLab // archive index</p>
        <h1 id="search-title">Search the archive.</h1>
        <p>Explore published work and the disciplines behind it.</p>
      </header>

      <div className="search-controls">
        <label className="search-input-wrap">
          <Search aria-hidden="true" size={20} />
          <span className="sr-only">Search projects</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search projects, clients, or capabilities"
            autoComplete="off"
          />
          {query && <button type="button" className="icon-button" aria-label="Clear search" onClick={() => setQuery("")}><X size={16} /></button>}
        </label>
        <div className="search-filter-row">
          <div className="search-category-filters" role="group" aria-label="Filter by category">
            <button type="button" className={category === "all" ? "is-active" : ""} onClick={() => setCategory("all")}>All work <span>{shuffledProjects.length}</span></button>
            {categories.map((item) => (
              <button key={item.slug} type="button" className={category === item.slug ? "is-active" : ""} onClick={() => setCategory(item.slug)}>{item.label}</button>
            ))}
          </div>
          <label className="search-year-filter">
            <span className="sr-only">Filter by year</span>
            <select value={year} onChange={(event) => setYear(event.target.value)}>
              <option value="all">All years</option>
              {years.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </label>
        </div>
      </div>

      <div className="search-results-heading" aria-live="polite">
        <p>{results.length} {results.length === 1 ? "result" : "results"}</p>
        {(query || category !== "all" || year !== "all") && <button type="button" onClick={clearFilters}>Clear filters <X size={14} /></button>}
      </div>

      {results.length ? (
        <div className="work-grid search-results-grid">
          {results.map((project, index) => <ProjectCard key={project.slug} project={project} priority={index < 2} />)}
        </div>
      ) : (
        <div className="search-empty">
          <p className="eyebrow">No matching projects</p>
          <h2>Nothing in the archive matches those filters.</h2>
          <p>Try another phrase or browse all published work.</p>
          <button type="button" className="button-secondary" onClick={clearFilters}>Reset search</button>
        </div>
      )}

      <Link href="/work" className="search-all-link">Browse every project <span aria-hidden="true">↗</span></Link>
    </section>
  );
}
