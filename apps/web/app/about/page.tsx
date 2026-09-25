import type { Metadata } from "next";
import Image from "next/image";
import { CTASection } from "@/components/sections/CTASection";
import { Testimonials } from "@/components/home/Testimonials";
import { siteConfig } from "@/lib/constants";
import { categories } from "@/lib/categories";

export const metadata: Metadata = {
  title: "About",
  description: `About ${siteConfig.founder}, the designer behind ${siteConfig.name}.`,
};

/**
 * Ported 1:1 from the updated mockup's pageProfile(): a .profile-header
 * row (rounded-square photo on the left, name + one-line blurb on the
 * right) replaces the old standalone heading + circular photo. The full
 * bio paragraphs now come first, with the 2x2 .stats grid moved below
 * them — matching the mockup's new order (bio, then stats, then CTA).
 */
export default function AboutPage() {
  return (
    <>
      <section className="frame" style={{ paddingBottom: 0 }}>
        <div className="profile-header">
          <Image
            src="/images/otsaje-genius-peter.jpg"
            alt={siteConfig.founder}
            width={96}
            height={96}
            className="profile-photo"
            priority
          />
          <div>
            <p className="profile-name">{siteConfig.founder}</p>
            <p className="profile-blurb">
              Creative designer, developer, and entrepreneur from Nigeria,
              blending design and technology to build meaningful digital
              experiences.
            </p>
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
      </section>

      <section className="section" aria-labelledby="about-capabilities-title">
        <div className="site-container">
          <div className="section-heading-row">
            <div>
              <p className="section-kicker">Capabilities</p>
              <h2 id="about-capabilities-title" className="section-title">A practical creative practice.</h2>
            </div>
          </div>
          <div className="capability-list">
            {categories.map((category) => (
              <div key={category.slug} className="capability-row">
                <span>{category.label}</span>
                <span>{category.description}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Testimonials />
      <CTASection heading="Ready to start a project?" />
    </>
  );
}
