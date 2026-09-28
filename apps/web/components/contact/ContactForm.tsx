"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { backendUrl } from "@/lib/admin-client";
import { categories } from "@/lib/categories";

type FormStatus = "idle" | "submitting" | "error";
type InquiryFields = {
  name: string;
  email: string;
  disciplines: string[];
  budgetRange: string;
  brief: string;
};

export function ContactForm() {
  const router = useRouter();
  const [form, setForm] = useState<InquiryFields>({ name: "", email: "", disciplines: [], budgetRange: "", brief: "" });
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errors, setErrors] = useState<Partial<Record<keyof InquiryFields, string>>>({});

  const update = (field: keyof InquiryFields, value: string | string[]) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    if (status === "error") setStatus("idle");
  };

  function toggleDiscipline(slug: string) {
    update("disciplines", form.disciplines.includes(slug)
      ? form.disciplines.filter((item) => item !== slug)
      : [...form.disciplines, slug]);
  }

  async function submitInquiry(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrors({});
    setStatus("submitting");

    try {
      const response = await fetch(backendUrl("/api/inquiries"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, budgetRange: form.budgetRange || null }),
      });
      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        setErrors(result.fields ?? {});
        throw new Error(result.error || "Your brief could not be sent. Please try again.");
      }

      router.push("/contact/success");
    } catch (error) {
      setErrors((current) => ({ ...current, brief: error instanceof Error ? error.message : "Your brief could not be sent. Please try again." }));
      setStatus("error");
    }
  }

  return (
    <form className="contact-form brief-form" onSubmit={submitInquiry} noValidate>
      <label className="contact-field">
        <span>01 / Name or organisation <b aria-hidden="true">*</b></span>
        <input
          name="name"
          type="text"
          autoComplete="name"
          placeholder="Your name"
          value={form.name}
          maxLength={120}
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? "inquiry-name-error" : undefined}
          onChange={(event) => update("name", event.target.value)}
          required
        />
        {errors.name && <small id="inquiry-name-error" className="field-error">{errors.name}</small>}
      </label>
      <label className="contact-field">
        <span>02 / Email address <b aria-hidden="true">*</b></span>
        <input
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={form.email}
          maxLength={320}
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? "inquiry-email-error" : undefined}
          onChange={(event) => update("email", event.target.value)}
          required
        />
        {errors.email && <small id="inquiry-email-error" className="field-error">{errors.email}</small>}
      </label>
      <fieldset className="brief-fieldset">
        <legend>03 / What do you need? <span>Select all that apply</span></legend>
        <div className="brief-choice-grid">
          {categories.map((category) => (
            <label key={category.slug} className={`brief-choice${form.disciplines.includes(category.slug) ? " is-selected" : ""}`}>
              <input type="checkbox" checked={form.disciplines.includes(category.slug)} onChange={() => toggleDiscipline(category.slug)} />
              <span>{category.label}</span>
            </label>
          ))}
        </div>
        {errors.disciplines && <small className="field-error">{errors.disciplines}</small>}
      </fieldset>
      <label className="contact-field">
        <span>04 / Estimated investment</span>
        <select value={form.budgetRange} onChange={(event) => update("budgetRange", event.target.value)}>
          <option value="">Choose a range (optional)</option>
          <option value="5k-10k">$5k–$10k</option>
          <option value="10k-25k">$10k–$25k</option>
          <option value="25k-plus">$25k+</option>
          <option value="to-discuss">Let&apos;s discuss</option>
        </select>
      </label>
      <label className="contact-field">
        <span>05 / Project brief <b aria-hidden="true">*</b></span>
        <textarea
          name="brief"
          placeholder="Share your goals, audience, timing, and what success looks like."
          rows={7}
          value={form.brief}
          maxLength={5000}
          aria-invalid={Boolean(errors.brief)}
          aria-describedby={errors.brief ? "inquiry-brief-error" : undefined}
          onChange={(event) => update("brief", event.target.value)}
          required
        />
        <span className="brief-counter">{form.brief.length} / 5000</span>
        {errors.brief && <small id="inquiry-brief-error" className="field-error" role="alert">{errors.brief}</small>}
      </label>
      <div className="contact-actions">
        <button type="submit" className="button-primary" disabled={status === "submitting"}>
          {status === "submitting" ? "Sending brief..." : "Send studio inquiry"}<ArrowUpRight aria-hidden="true" size={16} />
        </button>
        <span className="brief-privacy">Your brief is shared only with the studio.</span>
      </div>
      {status === "error" && <p className="form-status form-status-error" role="alert">Review the form and try again. Direct email and WhatsApp are also available above.</p>}
    </form>
  );
}
