"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, FolderKanban, Plus, LogOut } from "lucide-react";
import { clearAdminToken, getAdminToken } from "@/lib/admin-client";

const adminNavItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Projects", href: "/admin/projects", icon: FolderKanban },
  { label: "New", href: "/admin/projects/new", icon: Plus },
] as const;

const publicAdminPaths = [
  "/admin/login",
  "/admin/forgot-password",
  "/admin/reset-password",
];

function handleSignOut(router: ReturnType<typeof useRouter>) {
  clearAdminToken();
  router.push("/admin/login");
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (publicAdminPaths.includes(pathname)) {
      return;
    }

    if (!getAdminToken()) {
      router.replace(`/admin/login?callbackUrl=${encodeURIComponent(pathname)}`);
      return;
    }

    // The localStorage token check must complete before protected children render.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setChecked(true);
  }, [pathname, router]);

  if (publicAdminPaths.includes(pathname)) {
    return <>{children}</>;
  }

  if (!checked) {
    return <div className="flex min-h-screen items-center justify-center bg-paper text-ink-muted">Checking access...</div>;
  }

  return (
    <div className="admin-shell min-h-screen bg-paper text-ink">
      <header className="sticky top-3 z-40 flex justify-center px-3 sm:top-4">
        <nav
          aria-label="Admin"
          className="admin-nav flex max-w-full items-center gap-1 rounded-full border border-cinema-line bg-cinema/90 px-2 py-2 text-cinema-ink shadow-[0_8px_32px_-8px_rgba(0,0,0,0.5),0_0_0_1px_rgba(126,217,87,0.08)] backdrop-blur-xl sm:gap-1.5"
        >
          <span className="mr-1 hidden shrink-0 items-center gap-1.5 pl-2 pr-1 sm:flex">
            <span className="eyebrow text-brass">GENIUZLAB</span>
            <span className="text-xs text-cinema-muted">Admin</span>
          </span>

          {adminNavItems.map((item) => {
            const isActive = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={`flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-medium transition-all duration-300 sm:px-3.5 ${
                  isActive
                    ? "-translate-y-0.5 bg-brass text-cinema shadow-[0_2px_12px_-2px_rgba(126,217,87,0.5)]"
                    : "translate-y-0 text-cinema-muted hover:bg-white/10 hover:text-cinema-ink"
                }`}
              >
                <Icon size={16} strokeWidth={2} />
                <span className={isActive ? "inline" : "hidden sm:inline"}>{item.label}</span>
              </Link>
            );
          })}

          <div className="ml-1 flex items-center gap-1 border-l border-cinema-line pl-1.5">
            <button
              onClick={() => handleSignOut(router)}
              aria-label="Log out"
              className="flex h-9 w-9 items-center justify-center rounded-full text-cinema-muted transition-colors hover:bg-red-500/15 hover:text-red-400"
            >
              <LogOut size={16} strokeWidth={2} />
            </button>
          </div>
        </nav>
      </header>

      <main className="admin-main container-editorial py-8 sm:py-10">{children}</main>
    </div>
  );
}
