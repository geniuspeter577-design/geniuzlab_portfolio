"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowUpRight, ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { getCategoryBySlug } from "@/lib/categories";
import { shuffleItems } from "@/lib/shuffle";
import type { Project } from "@/lib/types";

type SlideKind = "video" | "brand" | "mixed";

interface HeroSlide {
  kind: SlideKind;
  kicker: string;
  title: string;
  highlight: string;
  description: string;
  project?: Project;
}

function createHeroSlides(projects: Project[], shouldShuffle = false): HeroSlide[] {
  const orderedProjects = shouldShuffle ? shuffleItems(projects) : [...projects];
  const firstVideoIndex = orderedProjects.findIndex((project) => Boolean(project.videoUrl));

  if (firstVideoIndex > 0) {
    [orderedProjects[0], orderedProjects[firstVideoIndex]] = [orderedProjects[firstVideoIndex], orderedProjects[0]];
  }

  if (!orderedProjects.length) {
    return [{
      kind: "video",
      kicker: "Motion & video",
      title: "Make every frame",
      highlight: "move the story forward.",
      description: "Video and design projects will appear here as they are added to the portfolio.",
    }];
  }

  return orderedProjects.map((project) => {
    const isVideo = Boolean(project.videoUrl);
    const isBrand = project.categories.includes("branding-identity");
    const category = getCategoryBySlug(project.categories[0]);
    const kind: SlideKind = isVideo ? "video" : isBrand ? "brand" : "mixed";

    return {
      kind,
      kicker: isVideo ? "Motion & video" : category?.label ?? "Selected work",
      title: project.title,
      highlight: project.client ? `for ${project.client}` : `${project.year}`,
      description: project.summary,
      project,
    };
  });
}

export function Hero({ projects }: { projects: Project[] }) {
  const [slides, setSlides] = useState(() => createHeroSlides(projects));
  const slideCount = slides.length;
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const activeSlide = slides[activeIndex] ?? slides[0];
  const shouldPause = isHovered || isPaused;

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSlides(createHeroSlides(projects, true));
    setActiveIndex(0);
  }, [projects]);

  useEffect(() => {
    if (shouldPause || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const timeout = window.setTimeout(() => {
      setActiveIndex((current) => (current + 1) % slideCount);
    }, 15000);

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
          <h1 className="hero-slider-title">
            {activeSlide.title} <span className="hero-slider-highlight">{activeSlide.highlight}</span>
          </h1>
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
                  key={slide.project?.slug ?? slide.kind}
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
