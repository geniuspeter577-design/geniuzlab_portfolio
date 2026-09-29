"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowUpRight, ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import type { Project } from "@/lib/types";

type SlideKind = "video" | "brand" | "mixed";

interface HeroSlide {
  kind: SlideKind;
  kicker: string;
  title: string;
  description: string;
  project?: Project;
}

function createHeroSlides(projects: Project[]): HeroSlide[] {
  const usedProjects = new Set<string>();
  const chooseProject = (matches: (project: Project) => boolean) => {
    const available = projects.filter((project) => !usedProjects.has(project.slug));
    const project = available.find(matches) ?? available[0] ?? projects[0];
    if (project) usedProjects.add(project.slug);
    return project;
  };

  return [
    {
      kind: "video",
      kicker: "Motion & video",
      title: "Make every frame move the story forward.",
      description: "Video editing and motion design that bring campaigns, stories, and ideas to life.",
      project: chooseProject((project) => Boolean(project.videoUrl)),
    },
    {
      kind: "brand",
      kicker: "Brand identity",
      title: "Build a brand people recognize and remember.",
      description: "Distinctive logo systems and visual identities designed to stay clear, consistent, and memorable.",
      project: chooseProject((project) => project.categories.includes("branding-identity")),
    },
    {
      kind: "mixed",
      kicker: "Connected brand experiences",
      title: "Bring every brand touchpoint together.",
      description: "Social, digital, and campaign design working together to help businesses show up with intent.",
      project: chooseProject((project) => project.categories.includes("social-media") || project.categories.includes("client-projects")),
    },
  ];
}

export function Hero({ projects }: { projects: Project[] }) {
  const slides = createHeroSlides(projects);
  const slideCount = slides.length;
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const activeSlide = slides[activeIndex] ?? slides[0];
  const shouldPause = isHovered || isPaused;

  useEffect(() => {
    if (shouldPause || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const timeout = window.setTimeout(() => {
      setActiveIndex((current) => (current + 1) % slideCount);
    }, 3000);

    return () => window.clearTimeout(timeout);
  }, [activeIndex, shouldPause, slideCount]);

  function showSlide(index: number) {
    setActiveIndex((index + slideCount) % slideCount);
  }

  const projectHref = activeSlide.project ? `/work/${activeSlide.project.slug}` : "/work";

  return (
    <section
      className="hero-section hero-slider-section"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="site-container hero-slider" role="region" aria-roledescription="carousel" aria-label="Featured portfolio work">
        <div className="hero-slider-copy" key={`copy-${activeIndex}`}>
          <p className="eyebrow hero-slider-kicker">{activeSlide.kicker} <span aria-hidden="true">/</span> GeniuzLab</p>
          <h1 className="hero-slider-title">{activeSlide.title}</h1>
          <p className="hero-slider-description">{activeSlide.description}</p>
          {activeSlide.project && <p className="hero-slider-project">Featured project: {activeSlide.project.title}</p>}

          <div className="hero-slider-actions">
            <Link href={projectHref} className="button-primary">View project <ArrowUpRight size={16} aria-hidden="true" /></Link>
            <Link href="/work" className="button-secondary">Browse all work</Link>
          </div>

          <div className="hero-slider-controls" aria-label="Carousel controls">
            <button type="button" className="hero-slider-arrow" aria-label="Previous slide" onClick={() => showSlide(activeIndex - 1)}>
              <ChevronLeft size={18} aria-hidden="true" />
            </button>
            <div className="hero-slider-indicators" role="group" aria-label="Choose a featured project">
              {slides.map((slide, index) => (
                <button
                  type="button"
                  key={slide.kind}
                  className={`hero-slider-indicator${index === activeIndex ? " is-active" : ""}`}
                  aria-label={`Show slide ${index + 1}: ${slide.kicker}`}
                  aria-current={index === activeIndex ? "true" : undefined}
                  onClick={() => showSlide(index)}
                >
                  <span className="hero-slider-progress-track" aria-hidden="true">
                    <span className={`hero-slider-progress-fill${index === activeIndex ? " is-active" : ""}${shouldPause ? " is-paused" : ""}`} />
                  </span>
                </button>
              ))}
            </div>
            <button type="button" className="hero-slider-arrow" aria-label="Next slide" onClick={() => showSlide(activeIndex + 1)}>
              <ChevronRight size={18} aria-hidden="true" />
            </button>
            <button
              type="button"
              className="hero-slider-pause"
              aria-label={isPaused ? "Resume carousel" : "Pause carousel"}
              aria-pressed={isPaused}
              onClick={() => {
                setIsPaused((paused) => !paused);
                setIsHovered(false);
              }}
            >
              {isPaused ? <Play size={15} aria-hidden="true" /> : <Pause size={15} aria-hidden="true" />}
            </button>
          </div>
        </div>

        <div className={`hero-slider-media hero-slider-media-${activeSlide.kind}`} key={`media-${activeIndex}`}>
          {activeSlide.project?.videoUrl && activeSlide.kind === "video" ? (
            <video
              className="hero-slider-video"
              src={activeSlide.project.videoUrl}
              poster={activeSlide.project.videoPosterUrl || activeSlide.project.coverImage.src}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              aria-hidden="true"
            />
          ) : activeSlide.project ? (
            <Image
              src={activeSlide.project.coverImage.src}
              alt={activeSlide.project.coverImage.alt}
              fill
              priority
              sizes="(max-width: 900px) 100vw, 56vw"
              className="hero-slider-image"
            />
          ) : (
            <div className="hero-slider-empty" aria-label="Portfolio media preview unavailable">
              <span>G</span>
              <p>Creative work, made with intent.</p>
            </div>
          )}
          {activeSlide.project && <p className="hero-slider-media-caption">{activeSlide.project.title}</p>}
        </div>
      </div>
    </section>
  );
}
