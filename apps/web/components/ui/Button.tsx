import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const base =
  "inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.16em] transition-colors duration-300 focus-visible:outline-2 whitespace-nowrap";

const variants = {
  primary: "bg-ink text-paper px-5 py-3 sm:px-6 sm:py-3.5 hover:bg-brass transition-all hover:shadow-[0_2px_8px_rgba(126,217,87,0.2)]",
  ghost:
    "border border-ink/25 text-ink px-5 py-3 sm:px-6 sm:py-3.5 hover:border-ink hover:bg-ink hover:text-paper transition-all",
  inverse: "bg-paper text-ink px-5 py-3 sm:px-6 sm:py-3.5 hover:bg-brass hover:text-cinema-ink transition-all",
  link: "text-ink underline underline-offset-4 decoration-ink/30 hover:decoration-brass hover:text-brass px-0 py-0 transition-colors",
  /**
   * The site's one gradient moment — reserved for the single primary
   * action on cinema (dark) sections: Hero and the closing CTA. Everywhere
   * else keeps the flat, editorial button language above.
   */
  brand:
    "rounded-full bg-[image:var(--gradient-brand-button)] text-cinema px-6 py-3 sm:px-7 sm:py-3.5 shadow-[0_0_0_1px_rgba(126,217,87,0.35),0_8px_28px_-8px_rgba(126,217,87,0.55)] transition-[filter,box-shadow,transform] hover:brightness-110 hover:shadow-[0_0_0_1px_rgba(126,217,87,0.5),0_10px_34px_-6px_rgba(126,217,87,0.7)] hover:scale-105 active:scale-95",
} as const;

type Variant = keyof typeof variants;

interface CommonProps {
  variant?: Variant;
  className?: string;
}

type ButtonAsButton = CommonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

type ButtonAsLink = CommonProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

type ButtonProps = ButtonAsButton | ButtonAsLink;

/**
 * Single button primitive used everywhere in the site. Renders a Next.js
 * <Link> when `href` is passed, otherwise a native <button>. Variants are
 * intentionally minimal — this is not a generic UI-kit component, just the
 * one shape the site actually needs.
 */
export function Button({ variant = "primary", className, ...props }: ButtonProps) {
  const classes = cn(base, variants[variant], className);

  if ("href" in props && props.href) {
    const { href, ...rest } = props as ButtonAsLink;
    return (
      <Link href={href} className={classes} {...rest}>
        {props.children}
      </Link>
    );
  }

  return (
    <button className={classes} {...(props as ButtonAsButton)}>
      {props.children}
    </button>
  );
}
