import Link from "next/link";
import { categories } from "@/lib/categories";

/**
 * Ported 1:1 from the mockup's SERVICES.map(...) card list on the home
 * page: a heading line, then a stack of .card elements — each a
 * .card-title plus a .card-photo icon slot (photo/image glyph). No .frame
 * wrapper — see Hero.tsx note.
 */
export function CategoryShowcase() {
  return (
    <section style={{ marginTop: 28 }}>
      <h2
        style={{
          fontSize: 15,
          fontWeight: 700,
          color: "var(--chip-text)",
          margin: "0 0 4px",
        }}
      >
        Seven ways into the work
      </h2>
      <div className="services">
        {categories.map((category) => (
          <Link key={category.slug} href={`/category/${category.slug}`} className="card">
            <div className="card-title">{category.label}</div>
            <div className="card-photo">
              <PhotoIcon />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

/** Same "photo" glyph path used throughout the mockup's card-photo slots. */
function PhotoIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="2" fill="none" />
      <circle cx="9" cy="10" r="1.5" fill="currentColor" />
      <path
        d="m4 17 5-5 4 4 3-3 4 4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}
