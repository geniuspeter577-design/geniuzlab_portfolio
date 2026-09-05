import type { Metadata } from "next";
import Image from "next/image";
import { CTASection } from "@/components/sections/CTASection";
import { siteConfig } from "@/lib/constants";

export const metadata: Metadata = {
  title: "About",
  description: `About ${siteConfig.founder}, the designer behind ${siteConfig.name}.`,
};

/**
 * Ported 1:1 from the mockup's pageProfile(): page-heading, a 2x2 .stats
 * grid, then an .assumption note flagging the two unknown numbers, then
 * two page-sub bio paragraphs. The real bio text you already have (below)
 * is kept as-is — only the styling/structure changed to match the mockup.
 * Still need from you: clients-worked-with count and designs-delivered
 * count (shown as "[X]+" below, exactly as the mockup left them).
 * No .frame wrapper — see Hero.tsx note.
 */
export default function AboutPage() {
  return (
    <>
      <section>
        <h1 className="page-heading">{siteConfig.founder}</h1>

        <div className="stats">
          <div className="stat">
            <b>6+</b>
            <span>Years of Experience</span>
          </div>
          <div className="stat">
            <b>[X]+</b>
            <span>Clients Worldwide</span>
          </div>
          <div className="stat">
            <b>[X]+</b>
            <span>Designs Delivered</span>
          </div>
          <div className="stat">
            <b>98%</b>
            <span>Client Satisfaction</span>
          </div>
        </div>

        <div className="assumption">
          Years and satisfaction are set (6+, 98%) — still need real numbers
          for clients worked with worldwide and designs delivered, shown as
          [X] above.
        </div>

        <div className="relative aspect-[4/5] w-full max-w-xs overflow-hidden rounded-2xl bg-surface mb-6">
          <Image
            src="/images/placeholder.svg"
            alt="Placeholder portrait — replace with a real photo"
            fill
            sizes="(min-width: 900px) 40vw, 100vw"
            className="object-cover"
          />
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
