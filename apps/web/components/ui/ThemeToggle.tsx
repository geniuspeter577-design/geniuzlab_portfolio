"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "./ThemeProvider";

/**
 * Rendered inside Navigation's `.theme-toggle` div, which already sets
 * size/position/background/border and `color: var(--toggle-icon)` per the
 * mockup's CSS. This just needs to be an unstyled icon button that
 * inherits that color — the mockup's icon is 18x18 (was 16), and the old
 * `text-cinema-ink` override is dropped so the parent's --toggle-icon
 * color actually applies instead of being overridden.
 */
export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
      className={`flex h-full w-full items-center justify-center ${className}`}
    >
      {theme === "dark" ? <Sun size={18} strokeWidth={2} /> : <Moon size={18} strokeWidth={2} />}
    </button>
  );
}
