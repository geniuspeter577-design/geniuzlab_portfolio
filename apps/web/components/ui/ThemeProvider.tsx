"use client";

import { createContext, useContext, useEffect, type ReactNode } from "react";

/**
 * Light theme has been removed entirely per the approved mockup — the site
 * is dark-only now, so there's no theme to toggle or persist. This file is
 * kept (same exports) only so anything still importing ThemeProvider /
 * useTheme / themeInitScript — e.g. layout.tsx wrapping <html> or injecting
 * a pre-paint script — doesn't need to change. All of it now just forces
 * "dark" and does nothing else.
 */
type Theme = "dark";

interface ThemeContextValue {
  theme: Theme;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

/**
 * Formerly the pre-paint inline script that picked light vs. dark from
 * localStorage/prefers-color-scheme. With only one theme left there's
 * nothing to decide before paint, so this just sets the attribute for any
 * leftover [data-theme="dark"] selectors and CSS reads directly off :root,
 * so even this attribute is optional. Kept as a no-op string so a
 * layout.tsx that injects it via dangerouslySetInnerHTML keeps working.
 */
export const themeInitScript = `
(function () {
  document.documentElement.setAttribute("data-theme", "dark");
})();
`;

export function ThemeProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "dark");
  }, []);

  return <ThemeContext.Provider value={{ theme: "dark" }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return ctx;
}
