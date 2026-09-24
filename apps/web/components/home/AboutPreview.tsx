const stats = [
  { value: "6+", label: "Years of Experience" },
  { value: "600+", label: "Clients Worldwide" },
  { value: "3000+", label: "Designs Delivered" },
  { value: "98%", label: "Client Satisfaction" },
];

export function AboutPreview() {
  return (
    <section id="about" className="section">
      <div className="site-container about-grid">
        <div className="section-heading">
          <p className="section-kicker">A little about me</p>
          <h2 className="section-title">Thoughtful design, built for a real purpose.</h2>
          <div className="about-copy">
            <p>
              I&apos;m Otsaje Genius Peter, a creative designer, developer,
              educator, and entrepreneur from Nigeria. I started with graphic
              design and gradually expanded into video editing, web development,
              AI, and other areas of digital creativity. Today, I focus on using
              design and technology to create meaningful digital experiences,
              solve problems, and help other people develop practical digital
              skills.
            </p>
            <p>
              My approach is simple: understand the problem, think creatively,
              and build a solution that works. When I work with a client, I
              first understand their goals, audience, and vision before
              designing or building. I care about clean execution, strong
              visual communication, functionality, and delivering work that
              serves a real purpose rather than just looking good.
            </p>
          </div>
        </div>
        <div className="stats-grid" aria-label="GeniuzLab at a glance">
          {stats.map((stat) => (
            <div key={stat.label} className="stat-item">
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
