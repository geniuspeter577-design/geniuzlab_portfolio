"use client";

import { useState, type FormEvent } from "react";
import { siteConfig, whatsappHref } from "@/lib/constants";

type FormStatus = "idle" | "submitting" | "success" | "error";

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [details, setDetails] = useState("");
  const [status, setStatus] = useState<FormStatus>("idle");

  const message = `Name: ${name}\nEmail: ${email}\n\nProject details:\n${details}`;

  function openEmail(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    try {
      const subject = encodeURIComponent(`Project enquiry from ${name}`);
      setStatus("success");
      window.location.href = `mailto:${siteConfig.email}?subject=${subject}&body=${encodeURIComponent(message)}`;
    } catch {
      setStatus("error");
    }
  }

  function openWhatsApp() {
    setStatus("submitting");
    try {
      window.open(`${whatsappHref}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return (
    <form className="contact-form" onSubmit={openEmail}>
      <label className="contact-field">
        <span>What&apos;s your name?</span>
        <input
          name="name"
          type="text"
          autoComplete="name"
          placeholder="Your name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
        />
      </label>
      <label className="contact-field">
        <span>Where can I reach you?</span>
        <input
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
      </label>
      <label className="contact-field">
        <span>What are you working on?</span>
        <textarea
          name="details"
          placeholder="Tell me about the project"
          rows={6}
          value={details}
          onChange={(event) => setDetails(event.target.value)}
          required
        />
      </label>
      <div className="contact-actions">
        <button type="submit" className="button-primary" disabled={status === "submitting"}>{status === "submitting" ? "Transmitting..." : "Email me"}</button>
        <button type="button" className="button-secondary" onClick={openWhatsApp} disabled={status === "submitting"}>WhatsApp</button>
      </div>
      <div className={`form-status form-status-${status}`} role="status" aria-live="polite">
        {status === "submitting" && "Preparing your brief..."}
        {status === "success" && "Your brief is ready. Complete the handoff in your email or WhatsApp app."}
        {status === "error" && "The handoff could not be opened. Please use the direct contact links above."}
      </div>
    </form>
  );
}
