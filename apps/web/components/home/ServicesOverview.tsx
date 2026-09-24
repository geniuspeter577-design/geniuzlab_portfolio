import Link from "next/link";
import { categories } from "@/lib/categories";

export function ServicesOverview() {
  return (
    <section id="services" className="section">
      <div className="site-container">
        <div className="section-heading">
          <p className="section-kicker">What I do</p>
          <h2 className="section-title">Creative services for brands with something to say.</h2>
        </div>
        <div className="service-list">
          {categories.map((category) => (
            <Link key={category.slug} href={`/category/${category.slug}`} className="service-link">
              {category.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
