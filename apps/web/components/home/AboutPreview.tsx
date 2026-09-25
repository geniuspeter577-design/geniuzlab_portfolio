import Link from "next/link";
import { ArrowDown, ArrowUpRight } from "lucide-react";

export function AboutPreview() {
  return (
    <section id="about" className="section">
      <div className="site-container about-grid">
        <article className="about-card">
          <h2 className="about-card-title">About me</h2>
          <div className="about-copy">
            <p>
              I&apos;m Otsaje Genius Peter, a creative designer, developer,
              educator, and entrepreneur from Nigeria.
            </p>
          </div>
          <Link href="/about" className="about-card-link">Read more <ArrowUpRight aria-hidden="true" size={16} /></Link>
        </article>
        <p className="scroll-hint"><span>Scroll down</span><ArrowDown aria-hidden="true" size={16} /></p>
      </div>
    </section>
  );
}
