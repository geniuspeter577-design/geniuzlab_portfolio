"use client";

import { Suspense, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("admin@geniuzlab.com");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setIsSubmitting(false);

    if (result?.error) {
      setError("Invalid email or password.");
      return;
    }

    const callbackUrl = searchParams.get("callbackUrl") ?? "/admin";
    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-paper px-6 py-16 text-ink">
      <div className="w-full max-w-md rounded-2xl border border-line bg-surface p-8 shadow-[0_0_0_1px_rgba(126,217,87,0.12)]">
        <div className="mb-8">
          <p className="eyebrow text-brass">Private access</p>
          <h1 className="mt-3 font-display text-3xl">Admin login</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="mb-2 block text-sm text-ink-muted">
              Email
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
            <label htmlFor="password" className="mb-2 block text-sm text-ink-muted">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-md border border-line bg-paper px-4 py-3 text-ink outline-none transition focus:border-brass"
              required
            />
          </div>

          {error ? (
            <p className="text-sm text-red-400">{error}</p>
          ) : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-full bg-[image:var(--gradient-brand-button)] px-5 py-3 font-mono text-xs uppercase tracking-[0.18em] text-[#050505] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? "Signing in..." : "Log in"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-paper text-ink">Loading...</div>}>
      <AdminLoginForm />
    </Suspense>
  );
}
