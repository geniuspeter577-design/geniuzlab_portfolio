"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { backendUrl } from "@/lib/admin-client";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (password !== confirmation) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(backendUrl("/api/auth/reset-password"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setError(data.error || "This password reset link is invalid or expired.");
        return;
      }

      router.replace("/admin/login?passwordReset=1");
    } catch {
      setError("Could not reach the server. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="admin-login flex min-h-screen items-center justify-center bg-paper px-6 py-16 text-ink">
      <div className="admin-login-card w-full max-w-md rounded-2xl border border-line bg-surface p-8 shadow-[0_0_0_1px_rgba(126,217,87,0.12)]">
        <div className="mb-8">
          <p className="eyebrow text-brass">Private access</p>
          <h1 className="mt-3 font-display text-3xl">Set a new password</h1>
        </div>

        {!token ? (
          <div className="space-y-5">
            <p className="text-sm text-red-400">This password reset link is invalid or expired.</p>
            <Link href="/admin/forgot-password" className="block text-sm text-ink-muted transition hover:text-brass">
              Request another reset link
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <label className="block space-y-2 text-sm text-ink-muted">
              <span>New password</span>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                minLength={12}
                maxLength={72}
                autoComplete="new-password"
                className="w-full rounded-md border border-line bg-paper px-4 py-3 text-ink outline-none transition focus:border-brass"
                required
              />
            </label>
            <label className="block space-y-2 text-sm text-ink-muted">
              <span>Confirm new password</span>
              <input
                type="password"
                value={confirmation}
                onChange={(event) => setConfirmation(event.target.value)}
                minLength={12}
                maxLength={72}
                autoComplete="new-password"
                className="w-full rounded-md border border-line bg-paper px-4 py-3 text-ink outline-none transition focus:border-brass"
                required
              />
            </label>

            {error ? <p className="text-sm text-red-400">{error}</p> : null}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-full bg-[image:var(--gradient-brand-button)] px-5 py-3 font-mono text-xs uppercase tracking-[0.18em] text-[#050505] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? "Updating password..." : "Set new password"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default function AdminResetPasswordPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-paper text-ink">Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}