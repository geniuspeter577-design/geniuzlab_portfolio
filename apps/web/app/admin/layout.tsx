"use client";

import { signOut } from "next-auth/react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <header className="border-b border-white/10 bg-[#000000]/80 backdrop-blur-md">
        <div className="container-editorial flex items-center justify-between py-4">
          <div>
            <p className="eyebrow text-[#7ed957]">GENIUZLAB</p>
            <p className="text-sm text-white/60">Admin</p>
          </div>

          <button
            onClick={() => signOut({ redirectTo: "/admin/login" })}
            className="rounded-full border border-white/10 px-4 py-2 text-xs uppercase tracking-[0.18em] text-white transition hover:border-red-500 hover:text-red-500"
          >
            Log out
          </button>
        </div>
      </header>

      <main>{children}</main>
    </div>
  );
}
