"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type EditProjectForm = {
  id?: string;
  title?: string;
  client?: string;
  summary?: string;
  year?: number;
  description?: string;
  featured?: boolean;
  published?: boolean;
};

export default function EditProjectPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [project, setProject] = useState<EditProjectForm | null>(null);

  useEffect(() => {
    async function loadProject() {
      try {
        const response = await fetch(`/api/admin/projects/${params.id}`);
        if (!response.ok) {
          throw new Error("Could not load project.");
        }
        const data = await response.json();
        setProject(data.project);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Could not load project.");
      } finally {
        setLoading(false);
      }
    }

    if (params?.id) {
      loadProject();
    }
  }, [params?.id]);

  const handleInputChange = (field: keyof EditProjectForm, value: string | boolean | number | string[]) => {
    setProject((current) => ({
      ...(current ?? {}),
      [field]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const response = await fetch(`/api/admin/projects/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(project),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || "Update failed.");
      }

      router.push("/admin/projects");
      router.refresh();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Update failed.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="container-editorial section-padding text-white/70">Loading project...</div>;
  }

  if (!project) {
    return <div className="container-editorial section-padding text-red-400">{error || "Project not found."}</div>;
  }

  return (
    <div className="container-editorial section-padding">
      <div className="mb-8">
        <p className="eyebrow text-[#7ed957]">Portfolio</p>
        <h1 className="mt-3 font-display text-display">Edit project</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl border border-white/10 bg-[#131313] p-6 sm:p-8">
        {error ? <p className="text-sm text-red-400">{error}</p> : null}

        <div className="grid gap-6 md:grid-cols-2">
          <label className="space-y-2 text-sm text-white/80">
            <span>Title</span>
            <input
              value={project.title ?? ""}
              onChange={(event) => handleInputChange("title", event.target.value)}
              className="w-full rounded-md border border-white/10 bg-black px-4 py-3 text-white"
              required
            />
          </label>

          <label className="space-y-2 text-sm text-white/80">
            <span>Client</span>
            <input
              value={project.client ?? ""}
              onChange={(event) => handleInputChange("client", event.target.value)}
              className="w-full rounded-md border border-white/10 bg-black px-4 py-3 text-white"
            />
          </label>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <label className="space-y-2 text-sm text-white/80">
            <span>Summary</span>
            <textarea
              rows={3}
              value={project.summary ?? ""}
              onChange={(event) => handleInputChange("summary", event.target.value)}
              className="w-full rounded-md border border-white/10 bg-black px-4 py-3 text-white"
              required
            />
          </label>

          <label className="space-y-2 text-sm text-white/80">
            <span>Year</span>
            <input
              type="number"
              value={project.year ?? new Date().getFullYear()}
              onChange={(event) => handleInputChange("year", Number(event.target.value))}
              className="w-full rounded-md border border-white/10 bg-black px-4 py-3 text-white"
            />
          </label>
        </div>

        <label className="block space-y-2 text-sm text-white/80">
          <span>Description</span>
          <textarea
            rows={6}
            value={project.description ?? ""}
            onChange={(event) => handleInputChange("description", event.target.value)}
            className="w-full rounded-md border border-white/10 bg-black px-4 py-3 text-white"
          />
        </label>

        <div className="flex flex-wrap gap-4 text-sm text-white/80">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={Boolean(project.featured)}
              onChange={(event) => handleInputChange("featured", event.target.checked)}
            />
            Featured
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={Boolean(project.published)}
              onChange={(event) => handleInputChange("published", event.target.checked)}
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
            disabled={submitting}
            className="rounded-full bg-[image:var(--gradient-brand-button)] px-5 py-3 font-mono text-xs uppercase tracking-[0.18em] text-[#050505] transition hover:brightness-110 disabled:opacity-70"
          >
            {submitting ? "Saving..." : "Save changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
