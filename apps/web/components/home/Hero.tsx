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
          <p className="eyebrow">Independent creative studio // Nigeria + worldwide</p>
          <h1 className="hero-title"><span>Ideas.</span><span>Design.</span><span>Impact.</span></h1>
          <p className="hero-copy">{siteConfig.description}</p>
          <div className="hero-pills" aria-label="GeniuzLab services">
            <Link href="/work" className="button-primary">Explore selected work</Link>
            <Link href="/services" className="button-secondary">Studio capabilities</Link>
          </div>
          <p className="hero-manifesto"><span><small>Studio status</small><strong>Open for considered collaborations</strong></span><ArrowUpRight aria-hidden="true" size={22} /></p>
        </div>
      </div>
    </section>
  );
}
