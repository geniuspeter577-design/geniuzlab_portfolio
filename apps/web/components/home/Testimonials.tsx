export function Testimonials() {
  const testimonials: never[] = [];

  if (testimonials.length === 0) {
    return null;
  }

  return (
    <section id="testimonials" className="section section-muted" aria-labelledby="testimonials-title">
      <div className="site-container">
        <p className="section-kicker">Client notes</p>
        <h2 id="testimonials-title" className="section-title">Good work should feel good to work on.</h2>
      </div>
    </section>
  );
}
