import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { siteConfig } from "@/lib/constants";

export function Hero() {
  return (
    <section className="hero-section">
      <div className="site-container hero-grid">
        <div className="hero-copy-panel">
          <div className="hero-badge">
            <span className="hero-badge-dot" aria-hidden="true" />
            <span>Atelier dispatch // 04.2025 edition</span>
          </div>

          <p className="eyebrow">Independent creative studio // Nigeria + worldwide</p>
          <h1 className="hero-title">
            <span>Ideas.</span>
            <span className="hero-title-accent">Design.</span>
            <span>Impact.</span>
          </h1>
          <p className="hero-copy">{siteConfig.description}</p>

          <div className="hero-pills" aria-label="GeniuzLab services">
            <Link href="/work" className="button-primary">Explore selected work</Link>
            <Link href="/services" className="button-secondary">Studio capabilities</Link>
          </div>

          <p className="hero-manifesto">
            <span>
              <small>Studio status</small>
              <strong>Open for considered collaborations</strong>
            </span>
            <ArrowUpRight aria-hidden="true" size={22} />
          </p>

          <div className="hero-stats" aria-label="Studio metrics">
            <div className="hero-stat">
              <strong>14+</strong>
              <span>Awards won &amp; SOTD</span>
            </div>
            <div className="hero-stat">
              <strong>0.24<span>s</span></strong>
              <span>Core web vitals</span>
            </div>
            <div className="hero-stat">
              <strong>100%</strong>
              <span>Studio independence</span>
            </div>
          </div>
        </div>

        <aside className="hero-panel" aria-label="Recent highlights preview">
          <div className="hero-panel-head">
            <span>// recent highlights preview</span>
            <span>Q1–Q2 reel</span>
          </div>

          <div className="hero-feature-card">
            <div className="hero-feature-art">
              <div className="hero-feature-glow" aria-hidden="true" />
              <div className="hero-feature-metrics">
                <span>Brand systems</span>
                <strong>Creative growth</strong>
              </div>
            </div>
            <div className="hero-feature-copy">
              <p className="hero-feature-label">Featured focus</p>
              <h2>Strategy-led design for brands with ambition.</h2>
            </div>
          </div>

          <div className="hero-preview-row">
            <div className="hero-preview-box">
              <span className="small-label">Campaign</span>
              <strong>Editorial</strong>
            </div>
            <div className="hero-preview-box accent">
              <span className="small-label">Experience</span>
              <strong>Motion</strong>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
