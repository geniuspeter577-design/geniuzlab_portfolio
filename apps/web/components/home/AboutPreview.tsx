import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export function AboutPreview() {
  return (
    <section id="about" className="section">
      <div className="site-container">
        <article className="about-card">
          <p className="section-kicker">About the studio</p>
          <h2 className="about-card-title">Creative systems for brands that want to move with intent.</h2>
          <div className="about-copy">
            <p>
              I&apos;m Otsaje Genius Peter, a creative designer, developer,
              educator, and entrepreneur from Nigeria, building visual identities,
              digital experiences, and growth-focused storytelling for ambitious teams.
            </p>
          </div>

          <div className="about-meta">
            <div>
              <span>Based in</span>
              <strong>Abuja, Nigeria</strong>
            </div>
            <div>
              <span>Working with</span>
              <strong>Brands &amp; founders</strong>
            </div>
          </div>

          <Link href="/about" className="about-card-link">Read more <ArrowUpRight aria-hidden="true" size={16} /></Link>
        </article>

      </div>
    </section>
  );
}
