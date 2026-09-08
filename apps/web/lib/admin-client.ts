"use client";

const TOKEN_KEY = "geniuzlab_admin_token";

export function getAdminToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function setAdminToken(token: string): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(TOKEN_KEY, token);
}

export function clearAdminToken(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(TOKEN_KEY);
}

/**
 * Route browser requests through the Next.js app so the browser
 * never tries to access localhost:3001 directly.
 */
export function backendUrl(path: string): string {
  return `/api/backend${path.startsWith("/") ? path : `/${path}`}`;
}

export async function adminFetch(
  path: string,
  init: RequestInit = {}
): Promise<Response> {
  const token = getAdminToken();
  const headers = new Headers(init.headers);

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(backendUrl(path), {
    ...init,
    headers,
  });

  if (response.status === 401) {
    clearAdminToken();

    if (typeof window !== "undefined") {
      window.location.href = "/admin/login";
    }
  }

  return response;
}
