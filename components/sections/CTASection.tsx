import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { siteConfig } from "@/lib/constants";

interface CTASectionProps {
  eyebrow?: string;
  heading?: string;
  buttonLabel?: string;
  buttonHref?: string;
}

/**
 * Closing statement used at the bottom of Home, Services, and About.
 * Shares the dark "cinema" treatment with the Hero and Footer so the page
 * bookends itself instead of trailing off into a generic contact block.
 */
export function CTASection({
  eyebrow = "Let's talk",
  heading = "Have a project in mind?",
  buttonLabel = "Get in touch",
  buttonHref = "/contact",
}: CTASectionProps) {
  return (
    <section className="cinema-grain relative overflow-hidden bg-cinema text-cinema-ink">
      <div aria-hidden className="glow-orb -right-16 top-1/2 hidden h-72 w-72 -translate-y-1/2 sm:block" />

      <div className="container-editorial section-padding flex flex-col items-start gap-8">
        <Reveal>
          <p className="eyebrow text-brass-dim">{eyebrow}</p>
        </Reveal>
        <Reveal delay={100}>
          <h2 className="max-w-3xl font-display text-display leading-[1.05]">{heading}</h2>
        </Reveal>
        <Reveal delay={200}>
          <div className="flex flex-wrap items-center gap-6">
            <Button href={buttonHref} variant="brand">
              {buttonLabel}
            </Button>
            <a href={`mailto:${siteConfig.email}`} className="eyebrow text-cinema-muted hover:text-cinema-ink">
              {siteConfig.email}
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
