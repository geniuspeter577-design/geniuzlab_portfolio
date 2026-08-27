"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  /** Optional stagger delay in ms, for revealing a sequence of items. */
  delay?: number;
  className?: string;
}

/**
 * Fades + lifts its children into place the first time they enter the
 * viewport. Dependency-free (IntersectionObserver only) — see the
 * `[data-reveal]` rules in app/globals.css for the actual transition,
 * which also respects prefers-reduced-motion.
 */
export function Reveal({ children, delay = 0, className }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      data-reveal={visible ? "visible" : "hidden"}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      className={className}
    >
      {children}
    </div>
  );
}
