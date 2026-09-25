"use client";

import { useEffect, useState } from "react";
import { adminFetch } from "@/lib/admin-client";

export default function AdminDashboardPage() {
  const [email, setEmail] = useState("");

  useEffect(() => {
    async function loadMe() {
      const response = await adminFetch("/api/auth/me");
      if (response.ok) {
        const data = await response.json();
        setEmail(data.user?.email ?? "");
      }
    }
    loadMe();
  }, []);

  return (
    <div className="admin-page container-editorial section-padding">
      <p className="eyebrow text-brass">Private dashboard</p>
      <h1 className="mt-4 font-display text-display">Welcome back</h1>
      <p className="mt-4 max-w-xl text-lead text-ink-muted">
        The portfolio management foundation is now active. Project management
        workflows will be added here in the next implementation phase.
      </p>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        <div className="rounded-2xl border border-line bg-surface p-6">
          <p className="eyebrow text-ink-muted">Status</p>
          <p className="mt-4 text-2xl font-display">Online</p>
        </div>
        <div className="rounded-2xl border border-line bg-surface p-6">
          <p className="eyebrow text-ink-muted">Access</p>
          <p className="mt-4 text-2xl font-display">Protected</p>
        </div>
        <div className="rounded-2xl border border-line bg-surface p-6">
          <p className="eyebrow text-ink-muted">User</p>
          <p className="mt-4 text-2xl font-display">{email || "..."}</p>
        </div>
      </div>
    </div>
  );
}
