"use client";

import Link from "next/link";
import { useState } from "react";
import { backendUrl } from "@/lib/admin-client";

export default function AdminForgotPasswordPage() {
  const [email, setEmail] = useState("admin@geniuzlab.com");
  const [step, setStep] = useState<"email" | "reset" | "complete">("email");
  const [recoveryKey, setRecoveryKey] = useState("");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleReset(event: React.FormEvent<HTMLFormElement>) {
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
        body: JSON.stringify({ email, recoveryKey, password }),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setError(data.error || "Unable to reset the admin password with those details.");
        return;
      }

      setStep("complete");
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
          <h1 className="mt-3 font-display text-3xl">
            {step === "complete" ? "Password updated" : "Reset admin password"}
          </h1>
        </div>

        {step === "email" ? (
          <form
            onSubmit={(event) => {
              event.preventDefault();
              setStep("reset");
            }}
            className="space-y-5"
          >
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
            <p className="text-sm text-ink-muted">
              Email delivery is not configured. A recovery key must be provided through your deployment configuration.
            </p>
            <button
              type="submit"
              className="w-full rounded-full bg-[image:var(--gradient-brand-button)] px-5 py-3 font-mono text-xs uppercase tracking-[0.18em] text-[#050505] transition hover:brightness-110"
            >
              Continue
            </button>
          </form>
        ) : null}

        {step === "reset" ? (
          <form onSubmit={handleReset} className="space-y-5">
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
            <div>
              <label htmlFor="recovery-key" className="mb-2 block text-sm text-ink-muted">
                Recovery key
              </label>
              <input
                id="recovery-key"
                type="password"
                value={recoveryKey}
                onChange={(event) => setRecoveryKey(event.target.value)}
                className="w-full rounded-md border border-line bg-paper px-4 py-3 text-ink outline-none transition focus:border-brass"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="mb-2 block text-sm text-ink-muted">
                New password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                minLength={12}
                maxLength={72}
                autoComplete="new-password"
                className="w-full rounded-md border border-line bg-paper px-4 py-3 text-ink outline-none transition focus:border-brass"
                required
              />
            </div>
            <div>
              <label htmlFor="confirm-password" className="mb-2 block text-sm text-ink-muted">
                Confirm new password
              </label>
              <input
                id="confirm-password"
                type="password"
                value={confirmation}
                onChange={(event) => setConfirmation(event.target.value)}
                minLength={12}
                maxLength={72}
                autoComplete="new-password"
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
              {isSubmitting ? "Updating password..." : "Set new password"}
            </button>
          </form>
        ) : null}

        {step === "complete" ? (
          <div className="space-y-5">
            <p className="text-sm text-ink-muted">Your admin password has been updated.</p>
            <Link
              href="/admin/login"
              className="block w-full rounded-full bg-[image:var(--gradient-brand-button)] px-5 py-3 text-center font-mono text-xs uppercase tracking-[0.18em] text-[#050505] transition hover:brightness-110"
            >
              Return to login
            </Link>
          </div>
        ) : null}

        {step !== "complete" ? (
          <Link href="/admin/login" className="mt-5 block text-sm text-ink-muted transition hover:text-brass">
            Back to login
          </Link>
        ) : null}
      </div>
    </div>
  );
}