import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const base =
  "inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.16em] transition-colors duration-300 focus-visible:outline-2";

const variants = {
  primary: "bg-ink text-paper px-6 py-3.5 hover:bg-brass",
  ghost:
    "border border-ink/25 text-ink px-6 py-3.5 hover:border-ink hover:bg-ink hover:text-paper",
  inverse: "bg-paper text-ink px-6 py-3.5 hover:bg-brass hover:text-cinema-ink",
  link: "text-ink underline underline-offset-4 decoration-ink/30 hover:decoration-brass hover:text-brass px-0 py-0",
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
