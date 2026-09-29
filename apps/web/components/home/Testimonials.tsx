const clientTestimonials = [
  {
    headline: "Strong concepts, seamless approval",
    quote: "Your concepts are very well done. I shared them with my colleagues, and they approved them. We’re ready to move forward with the letterhead. You’re good to go.",
    attribution: "Client · Nigeria",
  },
  {
    headline: "Top-notch creative work",
    quote: "Both of them are top-notch, beloved.",
    attribution: "Client · Australia",
  },
  {
    headline: "Brilliant work that brings clients back",
    quote: "Oh wow! Well done. This is brilliant. I love it. We’ll be seeing more of you.",
    attribution: "Client · France",
  },
  {
    headline: "A gift for the craft",
    quote: "Guy, your hands are blessed!",
    attribution: "Client · Ghana",
  },
  {
    headline: "Skill recognized, growth encouraged",
    quote: "You’ve mastered your art. Keep growing, Peter.",
    attribution: "Client · Uganda",
  },
  {
    headline: "Fast revisions, a result worth celebrating",
    quote: "Wow! This is awesome. Please change the time to 6:30 a.m. Wow, thank you, sir. I’m grateful.",
    attribution: "Design client",
  },
  {
    headline: "Powerful creative direction",
    quote: "Powerful! Thank you, sir.",
    attribution: "Design client",
  },
  {
    headline: "A clear, confident design",
    quote: "This is it, sir. Powerful.",
    attribution: "Design client",
  },
  {
    headline: "Referred through standout work",
    quote: "I’m Daddy Grant’s son. I’m reaching out from Sokoto. I saw what you created for him and really liked it, so I got in touch.",
    attribution: "Client from Sokoto",
  },
  {
    headline: "A beautiful final design",
    quote: "That’s right! This is beautiful.",
    attribution: "Design client",
  },
  {
    headline: "A client delighted with the result",
    quote: "You are the best! Thank you.",
    attribution: "Design client",
  },
  {
    headline: "Options worth choosing between",
    quote: "These options are so good, I’m not sure which one to choose. Thank you, Genius.",
    attribution: "Apst Francis",
  },
  {
    headline: "A design that gets an instant reaction",
    quote: "This is too beautiful! Thank you so much.",
    attribution: "Design client",
  },
];

const studentTestimonials = [
  {
    headline: "Guidance that makes a difference",
    quote: "Even though I wasn’t always able to attend, the training was amazing. Thank you for everything you did for me. You’ve been wonderful, and I’m grateful to have been part of it. May the Lord’s grace always be with you.",
    attribution: "Student · Zimbabwe",
  },
  {
    headline: "Building confidence with PixelLab",
    quote: "I truly appreciate you. God bless you! I’m getting better at using PixelLab.",
    attribution: "Student · Turkey",
  },
  {
    headline: "Encouragement throughout the learning journey",
    quote: "Thanks, boss. I really appreciate your kindness and guidance throughout the training, even though I wasn’t consistent enough to see it through to the end.",
    attribution: "Student · Nigeria",
  },
  {
    headline: "Practical skills with lasting impact",
    quote: "This training has been truly enlightening. I’ve gained valuable insights, practical skills, and a fresh perspective that will support my personal and professional growth. I highly recommend it.",
    attribution: "Training participant",
  },
  {
    headline: "From learning to real-world capability",
    quote: "Now I can create logos and brand guidelines, manage a company’s social media, set up a business, and much more. Meeting you at a Piscine programme in 2026 ignited the fire in me.",
    attribution: "Piscine programme student · 2026",
  },
];

function TestimonialGroup({
  id,
  title,
  kind,
  testimonials,
}: {
  id: string;
  title: string;
  kind: "Client" | "Student";
  testimonials: readonly { headline: string; quote: string; attribution: string }[];
}) {
  return (
    <section className="testimonial-group" aria-labelledby={id}>
      <div className="testimonial-group-heading">
        <p className="section-kicker">{kind} feedback</p>
        <h3 id={id} className="section-title">{title}</h3>
      </div>
      <div className="testimonial-grid">
        {testimonials.map((testimonial) => (
          <article className="testimonial-card" key={testimonial.headline}>
            <p className="testimonial-headline">{testimonial.headline}</p>
            <blockquote>{testimonial.quote}</blockquote>
            <footer><cite>{testimonial.attribution}</cite></footer>
          </article>
        ))}
      </div>
    </section>
  );
}

export function Testimonials() {
  return (
    <section id="testimonials" className="section section-muted" aria-labelledby="testimonials-title">
      <div className="site-container">
        <header className="section-heading">
          <p className="section-kicker">Words from the community</p>
          <h2 id="testimonials-title" className="section-title">Good work should feel good to work on.</h2>
        </header>
        <TestimonialGroup
          id="client-testimonials-title"
          title="Client projects & branding"
          kind="Client"
          testimonials={clientTestimonials}
        />
        <TestimonialGroup
          id="student-testimonials-title"
          title="Training, mentorship & student success"
          kind="Student"
          testimonials={studentTestimonials}
        />
      </div>
    </section>
  );
}
