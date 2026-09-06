import type { Metadata } from "next";
import Image from "next/image";
import { CTASection } from "@/components/sections/CTASection";
import { siteConfig } from "@/lib/constants";

export const metadata: Metadata = {
  title: "About",
  description: `About ${siteConfig.founder}, the designer behind ${siteConfig.name}.`,
};

/**
 * Ported 1:1 from the mockup's pageProfile(): page-heading, a profile
 * photo, a 2x2 .stats grid, then the two page-sub bio paragraphs. Stats
 * are now filled in with your real numbers (600+ clients, 3000+ designs).
 * Still missing from you: the two bio paragraphs are the real ones you
 * sent — no placeholder text left on this page.
 */
export default function AboutPage() {
  return (
    <>
      <section className="frame" style={{ paddingBottom: 0 }}>
        <h1 className="page-heading">{siteConfig.founder}</h1>

        <div className="profile-photo-wrap">
          <Image
            src="/images/otsaje-genius-peter.jpg"
            alt={siteConfig.founder}
            width={128}
            height={128}
            className="profile-photo"
            priority
          />
        </div>

        <div className="stats">
          <div className="stat">
            <b>6+</b>
            <span>Years of Experience</span>
          </div>
          <div className="stat">
            <b>600+</b>
            <span>Clients Worldwide</span>
          </div>
          <div className="stat">
            <b>3000+</b>
            <span>Designs Delivered</span>
          </div>
          <div className="stat">
            <b>98%</b>
            <span>Client Satisfaction</span>
          </div>
        </div>

        <p className="page-sub" style={{ margin: "0 0 16px" }}>
          I&apos;m Otsaje Genius Peter, a creative designer, developer,
          educator, and entrepreneur from Nigeria. I started with graphic
          design and gradually expanded into video editing, web development,
          AI, and other areas of digital creativity. Today, I focus on using
          design and technology to create meaningful digital experiences,
          solve problems, and help other people develop practical digital
          skills.
        </p>
        <p className="page-sub" style={{ margin: "0 0 16px" }}>
          My approach is simple: understand the problem, think creatively,
          and build a solution that works. When I work with a client, I
          first understand their goals, audience, and vision before
          designing or building. I care about clean execution, strong
          visual communication, functionality, and delivering work that
          serves a real purpose rather than just looking good.
        </p>
      </section>

      <CTASection heading="Ready to start a project?" />
    </>
  );
}
