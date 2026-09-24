import Link from "next/link";
import { siteConfig } from "@/lib/constants";

export function Hero() {
  return (
    <section className="hero-section">
      <div className="site-container hero-grid">
        <div>
          <p className="section-kicker">{siteConfig.founderTitle}</p>
          <h1 className="hero-title">{siteConfig.tagline} <span>with purpose.</span></h1>
          <p className="hero-copy">
            I&apos;m {siteConfig.founder}, a designer and developer creating clear,
            memorable visual work for people and brands.
          </p>
          <div className="button-row">
            <Link href="/work" className="button-primary">View my work</Link>
            <Link href="/contact" className="button-secondary">Contact me</Link>
          </div>
        </div>
        <div className="hero-aside">
          <strong>GENIUZLAB</strong>
          <span>Branding, digital design, social content, motion, and more for work that deserves attention.</span>
        </div>
      </div>
    </section>
  );
}
