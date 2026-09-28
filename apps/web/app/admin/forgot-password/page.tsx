"use client";

import Link from "next/link";
import { useState } from "react";
import { backendUrl } from "@/lib/admin-client";

export default function AdminForgotPasswordPage() {
  const [email, setEmail] = useState("geniuzlab577@gmail.com");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch(backendUrl("/api/auth/forgot-password"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setError(data.error || "Could not send a password reset email.");
        return;
      }

      setSent(true);
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
          <h1 className="mt-3 font-display text-3xl">Forgot password?</h1>
        </div>

        {sent ? (
          <div className="space-y-5">
            <p className="text-sm text-ink-muted">
              If this is the configured admin address, a reset link will be sent. Check your inbox.
            </p>
            <Link
              href="/admin/login"
              className="block w-full rounded-full bg-[image:var(--gradient-brand-button)] px-5 py-3 text-center font-mono text-xs uppercase tracking-[0.18em] text-[#050505] transition hover:brightness-110"
            >
              Return to login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="mb-2 block text-sm text-ink-muted">
                Admin email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-md border border-line bg-paper px-4 py-3 text-ink outline-none transition focus:border-brass"
                required
              />
            </div>

            {error ? <p className="text-sm text-red-400">{error}</p> : null}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-full bg-[image:var(--gradient-brand-button)] px-5 py-3 font-mono text-xs uppercase tracking-[0.18em] text-[#050505] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? "Sending..." : "Send reset link"}
            </button>
          </form>
        )}

        {!sent ? (
          <Link href="/admin/login" className="mt-5 block text-sm text-ink-muted transition hover:text-brass">
            Back to login
          </Link>
        ) : null}
      </div>
    </div>
  );
}