import Link from "next/link";
import { categories } from "@/lib/categories";

export function ServicesOverview() {
  return (
    <section id="services" className="section section-muted">
      <div className="site-container">
        <div className="section-heading">
          <p className="section-kicker">What I do</p>
          <h2 className="section-title">Creative services for brands with something to say.</h2>
        </div>

        <div className="services-grid">
          {categories.slice(0, 6).map((category, index) => (
            <Link key={category.slug} href={`/category/${category.slug}`} className="service-card">
              <div className="service-card-top">
                <span className="service-card-index">{String(index + 1).padStart(2, "0")}</span>
                <span className="service-card-arrow">↗</span>
              </div>
              <div className="service-card-body">
                <h3>{category.label}</h3>
                <p>{category.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
