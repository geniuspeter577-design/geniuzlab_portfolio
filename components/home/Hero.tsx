import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { siteConfig } from "@/lib/constants";
import { categories } from "@/lib/categories";

/**
 * Full-bleed "cinema" opening statement. This is the thesis of the site:
 * before any project grid, the visitor gets one confident, unhurried
 * typographic moment — the opposite of a SaaS hero with a product
 * screenshot and a gradient button.
 */
export function Hero() {
  return (
    <section className="cinema-grain relative flex min-h-[92svh] flex-col justify-between overflow-hidden bg-cinema text-cinema-ink">
      {/* Ambient emerald glow blooms — decorative, static, hidden on small
          screens to keep the mobile hero clean and fast. */}
      <div
        aria-hidden
        className="glow-orb -right-24 -top-24 hidden h-96 w-96 sm:block"
      />
      <div
        aria-hidden
        className="glow-orb -bottom-32 -left-20 hidden h-80 w-80 opacity-70 sm:block"
      />

      <div className="container-editorial flex flex-1 flex-col justify-center pt-16 pb-16">
        <Reveal>
          <Image
            src="/images/brand/geniuzlab-mark.png"
            alt=""
            width={703}
            height={844}
            className="h-10 w-auto sm:h-12"
          />
        </Reveal>

        <Reveal delay={80}>
          <p className="pill eyebrow mt-8 text-brass-dim">
            {siteConfig.founder} — {siteConfig.founderTitle}
          </p>
        </Reveal>

        <Reveal delay={150}>
          <h1 className="mt-4 max-w-5xl font-display text-hero leading-[0.95]">
            {siteConfig.experienceName}
          </h1>
        </Reveal>

        <Reveal delay={220}>
          <p className="mt-8 max-w-md text-lg text-cinema-muted">
            {siteConfig.tagline} A design studio working across branding,
            church &amp; Christian design, social media, print, and motion —
            built to make real work easy to explore.
          </p>
        </Reveal>

        <Reveal delay={300}>
          <div className="mt-10 flex flex-wrap items-center gap-6">
            <Button href="/work" variant="brand">
              View the work
            </Button>
            <Button
              href="/contact"
              variant="ghost"
              className="rounded-full border-cinema-line text-cinema-ink hover:bg-cinema-ink hover:text-cinema"
            >
              Get in touch
            </Button>
          </div>
        </Reveal>
      </div>

      <div className="container-editorial flex items-center justify-between gap-4 border-t border-cinema-line py-6">
        <p className="eyebrow text-cinema-muted">Scroll</p>
        <p className="eyebrow hidden text-right text-cinema-muted sm:block">
          {categories.map((category) => category.label).join(" — ")}
        </p>
      </div>
    </section>
  );
}
