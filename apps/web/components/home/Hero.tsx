import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { siteConfig } from "@/lib/constants";

export function Hero() {
  return (
    <section className="hero-section">
      <div className="site-container hero-grid">
        <div>
          <Image
            src="/images/otsaje-genius-peter.jpg"
            alt={siteConfig.founder}
            width={64}
            height={64}
            className="hero-avatar"
            priority
          />
          <p className="eyebrow">Avant-garde atelier // active lab</p>
          <h1 className="hero-title"><span>Hey,</span><span>We&apos;re</span><span>GeniuzLab.</span></h1>
          <p className="hero-copy">Autonomous creative direction, tactile digital artifacts, and bespoke visual architectures.</p>
          <div className="hero-pills" aria-label="GeniuzLab services">
            <Link href="/work" className="hero-pill is-accent">Explore the archive</Link>
            <Link href="/services" className="hero-pill">Capabilities</Link>
          </div>
          <Link href="/about" className="hero-manifesto">
            <span><small>Studio manifesto</small><strong>Creating what matters through design, motion, technology and strategy.</strong></span>
            <ArrowUpRight aria-hidden="true" size={22} />
          </Link>
        </div>
      </div>
    </section>
  );
}
