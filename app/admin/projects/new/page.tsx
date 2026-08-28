"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { adminProjectSchema } from "@/lib/admin-projects";

type CategoryOption = {
  slug: string;
  label: string;
};

export default function NewProjectPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [form, setForm] = useState({
    title: "",
    client: "",
    categorySlugs: ["branding-identity"],
    year: new Date().getFullYear(),
    role: "",
    summary: "",
    description: "",
    tags: "",
    featured: false,
    published: true,
    orderIndex: 0,
    coverImageUrl: "",
    coverImageAlt: "",
    galleryImages: [] as { url: string; altText: string }[],
  });

  useEffect(() => {
    async function loadCategories() {
      const response = await fetch("/api/admin/categories");
      if (response.ok) {
        const data = await response.json();
        setCategories(data.categories ?? []);
      }
    }

    void loadCategories();
  }, []);

  const handleChange = (field: string, value: string | boolean | number | string[]) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSaving(true);

    try {
      const payload = adminProjectSchema.parse({
        title: form.title,
        client: form.client,
        categorySlugs: form.categorySlugs,
        year: form.year,
        role: form.role,
        summary: form.summary,
        description: form.description,
        tags: form.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
        featured: form.featured,
        published: form.published,
        orderIndex: form.orderIndex,
        coverImage: form.coverImageUrl
          ? {
              url: form.coverImageUrl,
              altText: form.coverImageAlt,
            }
          : null,
        galleryImages: form.galleryImages,
      });

      const response = await fetch("/api/admin/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || "Could not create project.");
      }

      router.push("/admin/projects");
      router.refresh();
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : "Could not create project.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container-editorial section-padding">
      <div className="mb-8">
        <p className="eyebrow text-[#7ed957]">Portfolio</p>
        <h1 className="mt-3 font-display text-display">Create new project</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl border border-white/10 bg-[#131313] p-6 sm:p-8">
        {error ? <p className="text-sm text-red-400">{error}</p> : null}

        <div className="grid gap-6 md:grid-cols-2">
          <label className="space-y-2 text-sm text-white/80">
            <span>Project title</span>
            <input
              value={form.title}
              onChange={(event) => handleChange("title", event.target.value)}
              className="w-full rounded-md border border-white/10 bg-black px-4 py-3 text-white outline-none focus:border-[#7ed957]"
              required
            />
          </label>

          <label className="space-y-2 text-sm text-white/80">
            <span>Client</span>
            <input
              value={form.client}
              onChange={(event) => handleChange("client", event.target.value)}
              className="w-full rounded-md border border-white/10 bg-black px-4 py-3 text-white outline-none focus:border-[#7ed957]"
            />
          </label>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <label className="space-y-2 text-sm text-white/80">
            <span>Category</span>
            <select
              multiple
              value={form.categorySlugs}
              onChange={(event) => {
                const selected = Array.from(event.target.selectedOptions, (option) => option.value);
                handleChange("categorySlugs", selected);
              }}
              className="min-h-36 w-full rounded-md border border-white/10 bg-black px-4 py-3 text-white outline-none focus:border-[#7ed957]"
            >
              {categories.map((category) => (
                <option key={category.slug} value={category.slug}>
                  {category.label}
                </option>
              ))}
            </select>
          </label>

          <div className="grid gap-6 sm:grid-cols-2">
            <label className="space-y-2 text-sm text-white/80">
              <span>Year</span>
              <input
                type="number"
                value={form.year}
                onChange={(event) => handleChange("year", Number(event.target.value))}
                className="w-full rounded-md border border-white/10 bg-black px-4 py-3 text-white outline-none focus:border-[#7ed957]"
              />
            </label>

            <label className="space-y-2 text-sm text-white/80">
              <span>Display order</span>
              <input
                type="number"
                value={form.orderIndex}
                onChange={(event) => handleChange("orderIndex", Number(event.target.value))}
                className="w-full rounded-md border border-white/10 bg-black px-4 py-3 text-white outline-none focus:border-[#7ed957]"
              />
            </label>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <label className="space-y-2 text-sm text-white/80">
            <span>Role</span>
            <input
              value={form.role}
              onChange={(event) => handleChange("role", event.target.value)}
              className="w-full rounded-md border border-white/10 bg-black px-4 py-3 text-white outline-none focus:border-[#7ed957]"
            />
          </label>

          <label className="space-y-2 text-sm text-white/80">
            <span>Tags (comma-separated)</span>
            <input
              value={form.tags}
              onChange={(event) => handleChange("tags", event.target.value)}
              className="w-full rounded-md border border-white/10 bg-black px-4 py-3 text-white outline-none focus:border-[#7ed957]"
            />
          </label>
        </div>

        <label className="block space-y-2 text-sm text-white/80">
          <span>Summary</span>
          <textarea
            value={form.summary}
            onChange={(event) => handleChange("summary", event.target.value)}
            rows={3}
            className="w-full rounded-md border border-white/10 bg-black px-4 py-3 text-white outline-none focus:border-[#7ed957]"
            required
          />
        </label>

        <label className="block space-y-2 text-sm text-white/80">
          <span>Description</span>
          <textarea
            value={form.description}
            onChange={(event) => handleChange("description", event.target.value)}
            rows={6}
            className="w-full rounded-md border border-white/10 bg-black px-4 py-3 text-white outline-none focus:border-[#7ed957]"
          />
        </label>

        <div className="grid gap-6 md:grid-cols-2">
          <label className="space-y-2 text-sm text-white/80">
            <span>Cover image URL</span>
            <input
              value={form.coverImageUrl}
              onChange={(event) => handleChange("coverImageUrl", event.target.value)}
              className="w-full rounded-md border border-white/10 bg-black px-4 py-3 text-white outline-none focus:border-[#7ed957]"
            />
          </label>

          <label className="space-y-2 text-sm text-white/80">
            <span>Cover alt text</span>
            <input
              value={form.coverImageAlt}
              onChange={(event) => handleChange("coverImageAlt", event.target.value)}
              className="w-full rounded-md border border-white/10 bg-black px-4 py-3 text-white outline-none focus:border-[#7ed957]"
            />
          </label>
        </div>

        <div className="flex flex-wrap gap-4 text-sm text-white/80">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(event) => handleChange("featured", event.target.checked)}
            />
            Featured
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.published}
              onChange={(event) => handleChange("published", event.target.checked)}
            />
            Published
          </label>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-full border border-white/10 px-5 py-3 text-xs uppercase tracking-[0.18em] text-white transition hover:border-[#7ed957] hover:text-[#7ed957]"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="rounded-full bg-[image:var(--gradient-brand-button)] px-5 py-3 font-mono text-xs uppercase tracking-[0.18em] text-[#050505] transition hover:brightness-110 disabled:opacity-70"
          >
            {saving ? "Saving..." : "Save project"}
          </button>
        </div>
      </form>
    </div>
  );
}
