"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { adminProjectSchema } from "@/lib/admin-projects";
import { useImageUpload } from "@/hooks/useImageUpload";

type CategoryOption = {
  slug: string;
  label: string;
};

type GalleryImage = {
  url: string;
  altText: string;
};

type ProjectData = {
  id: string;
  slug: string;
  title: string;
  client: string | null;
  year: number | null;
  role: string | null;
  summary: string;
  description: string | null;
  featured: boolean;
  published: boolean;
  orderIndex: number;
  categorySlugs: string[];
  tags: string[];
  coverImage: { url: string; altText: string } | null;
  galleryImages: GalleryImage[];
};

export default function EditProjectPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { uploadImage, uploading: uploadingImage, error: uploadError, progress: uploadProgress } = useImageUpload();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [coverImagePreview, setCoverImagePreview] = useState("");
  const [galleryImagePreviews, setGalleryImagePreviews] = useState<string[]>([]);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [form, setForm] = useState<Partial<ProjectData>>({});

  useEffect(() => {
    async function loadProject() {
      try {
        const response = await fetch(`/api/admin/projects/${params.id}`);
        if (!response.ok) {
          throw new Error("Could not load project.");
        }
        const data = await response.json();
        setForm(data.project);
        if (data.project.coverImage?.url) {
          setCoverImagePreview(data.project.coverImage.url);
        }
        setGalleryImagePreviews(data.project.galleryImages?.map((img: GalleryImage) => img.url) ?? []);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Could not load project.");
      } finally {
        setLoading(false);
      }
    }

    async function loadCategories() {
      try {
        const response = await fetch("/api/admin/categories");
        if (response.ok) {
          const data = await response.json();
          setCategories(data.categories ?? []);
        }
      } catch {
        // Silently fail
      }
    }

    if (params?.id) {
      loadProject();
      loadCategories();
    }
  }, [params?.id]);

  const handleChange = (field: string, value: string | boolean | number | string[] | null) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleCoverImageSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0];
    if (!file) return;

    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCoverImagePreview((e.target?.result as string) ?? "");
      };
      reader.readAsDataURL(file);

      const { url, filename } = await uploadImage(file);
      setForm((current) => ({
        ...current,
        coverImage: {
          url,
          altText: (current?.title as string) || filename,
        },
      }));
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload cover image");
    }
  };

  const handleGalleryImageSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0];
    if (!file) return;

    try {
      const reader = new FileReader();
      const previewUrl = await new Promise<string>((resolve) => {
        reader.onload = (e) => {
          resolve((e.target?.result as string) ?? "");
        };
        reader.readAsDataURL(file);
      });

      const { url } = await uploadImage(file);

      setForm((current) => ({
        ...current,
        galleryImages: [
          ...(current?.galleryImages ?? []),
          {
            url,
            altText: `${(current?.title as string) || "Project"} - ${(current?.galleryImages?.length ?? 0) + 1}`,
          },
        ],
      }));

      setGalleryImagePreviews((current) => [...current, previewUrl]);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload gallery image");
    }
  };

  const removeGalleryImage = (index: number) => {
    setForm((current) => ({
      ...current,
      galleryImages: current?.galleryImages?.filter((_, i) => i !== index) ?? [],
    }));
    setGalleryImagePreviews((current) => current.filter((_, i) => i !== index));
  };

  const removeCoverImage = () => {
    setForm((current) => ({
      ...current,
      coverImage: null,
    }));
    setCoverImagePreview("");
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const payload = adminProjectSchema.parse({
        id: form.id,
        slug: form.slug,
        title: form.title,
        client: form.client,
        categorySlugs: form.categorySlugs,
        year: form.year,
        role: form.role,
        summary: form.summary,
        description: form.description,
        tags: (form.tags ?? []).filter(Boolean),
        featured: form.featured ?? false,
        published: form.published ?? true,
        orderIndex: form.orderIndex ?? 0,
        coverImage: form.coverImage,
        galleryImages: form.galleryImages,
      });

      const response = await fetch(`/api/admin/projects/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
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

  const handleDelete = async () => {
    setDeleting(true);
    setError("");

    try {
      const response = await fetch(`/api/admin/projects/${params.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || "Delete failed.");
      }

      router.push("/admin/projects");
      router.refresh();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Delete failed.");
      setDeleting(false);
    }
  };

  if (loading) {
    return <div className="container-editorial section-padding text-ink-muted">Loading project...</div>;
  }

  if (!form?.id) {
    return <div className="container-editorial section-padding text-red-400">{error || "Project not found."}</div>;
  }

  return (
    <div className="container-editorial section-padding">
      <div className="mb-8">
        <p className="eyebrow text-brass">Portfolio</p>
        <h1 className="mt-3 font-display text-display">Edit project</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl border border-line bg-surface p-6 sm:p-8">
        {error && <p className="text-sm text-red-400">{error}</p>}
        {uploadError && <p className="text-sm text-red-400">Upload error: {uploadError}</p>}
        {uploadingImage && <p className="text-sm text-brass">Uploading... {uploadProgress}%</p>}

        <div className="grid gap-6 md:grid-cols-2">
          <label className="space-y-2 text-sm text-ink-muted">
            <span>Project title</span>
            <input
              value={form.title ?? ""}
              onChange={(event) => handleChange("title", event.target.value)}
              className="w-full rounded-md border border-line bg-paper px-4 py-3 text-ink outline-none focus:border-brass"
              required
            />
          </label>

          <label className="space-y-2 text-sm text-ink-muted">
            <span>Client</span>
            <input
              value={form.client ?? ""}
              onChange={(event) => handleChange("client", event.target.value)}
              className="w-full rounded-md border border-line bg-paper px-4 py-3 text-ink outline-none focus:border-brass"
            />
          </label>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <label className="space-y-2 text-sm text-ink-muted">
            <span>Category</span>
            <select
              multiple
              value={form.categorySlugs ?? []}
              onChange={(event) => {
                const selected = Array.from(event.target.selectedOptions, (option) => option.value);
                handleChange("categorySlugs", selected);
              }}
              className="min-h-36 w-full rounded-md border border-line bg-paper px-4 py-3 text-ink outline-none focus:border-brass"
            >
              {categories.map((category) => (
                <option key={category.slug} value={category.slug}>
                  {category.label}
                </option>
              ))}
            </select>
          </label>

          <div className="grid gap-6 sm:grid-cols-2">
            <label className="space-y-2 text-sm text-ink-muted">
              <span>Year</span>
              <input
                type="number"
                value={form.year ?? new Date().getFullYear()}
                onChange={(event) => handleChange("year", Number(event.target.value))}
                className="w-full rounded-md border border-line bg-paper px-4 py-3 text-ink outline-none focus:border-brass"
              />
            </label>

            <label className="space-y-2 text-sm text-ink-muted">
              <span>Display order</span>
              <input
                type="number"
                value={form.orderIndex ?? 0}
                onChange={(event) => handleChange("orderIndex", Number(event.target.value))}
                className="w-full rounded-md border border-line bg-paper px-4 py-3 text-ink outline-none focus:border-brass"
              />
            </label>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <label className="space-y-2 text-sm text-ink-muted">
            <span>Role</span>
            <input
              value={form.role ?? ""}
              onChange={(event) => handleChange("role", event.target.value)}
              className="w-full rounded-md border border-line bg-paper px-4 py-3 text-ink outline-none focus:border-brass"
            />
          </label>

          <label className="space-y-2 text-sm text-ink-muted">
            <span>Tags (comma-separated)</span>
            <input
              value={(form.tags ?? []).join(", ")}
              onChange={(event) => handleChange("tags", event.target.value.split(",").map((tag) => tag.trim()).filter(Boolean))}
              className="w-full rounded-md border border-line bg-paper px-4 py-3 text-ink outline-none focus:border-brass"
            />
          </label>
        </div>

        <label className="block space-y-2 text-sm text-ink-muted">
          <span>Summary</span>
          <textarea
            value={form.summary ?? ""}
            onChange={(event) => handleChange("summary", event.target.value)}
            rows={3}
            className="w-full rounded-md border border-line bg-paper px-4 py-3 text-ink outline-none focus:border-brass"
            required
          />
        </label>

        <label className="block space-y-2 text-sm text-ink-muted">
          <span>Description</span>
          <textarea
            value={form.description ?? ""}
            onChange={(event) => handleChange("description", event.target.value)}
            rows={6}
            className="w-full rounded-md border border-line bg-paper px-4 py-3 text-ink outline-none focus:border-brass"
          />
        </label>

        {/* Cover Image Section */}
        <div className="space-y-4 rounded-lg border border-line bg-surface p-4">
          <div>
            <label className="text-sm font-medium text-ink-muted">Cover Image</label>
            <p className="mt-1 text-xs text-ink-muted">
              {form.coverImage?.url ? "✓ Uploaded" : "No image selected"}
            </p>
          </div>

          {coverImagePreview && (
            <div className="relative aspect-video overflow-hidden rounded-md">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={coverImagePreview} alt="Cover preview" className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={removeCoverImage}
                className="absolute right-2 top-2 rounded-full bg-red-600 px-3 py-1 text-xs text-white hover:bg-red-700"
              >
                Remove
              </button>
            </div>
          )}

          <label className="block">
            <span className="cursor-pointer rounded-md border border-line px-4 py-3 text-xs uppercase tracking-[0.18em] text-ink transition hover:border-brass hover:text-brass">
              {form.coverImage?.url ? "Change image" : "Upload cover image"}
            </span>
            <input
              type="file"
              accept="image/*"
              onChange={handleCoverImageSelect}
              className="hidden"
              disabled={uploadingImage}
            />
          </label>

          {form.coverImage?.url && (
            <label className="space-y-2 text-sm text-ink-muted">
              <span>Alt text</span>
              <input
                value={form.coverImage.altText ?? ""}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    coverImage: current?.coverImage ? { ...current.coverImage, altText: event.target.value } : null,
                  }))
                }
                className="w-full rounded-md border border-line bg-paper px-4 py-3 text-ink outline-none focus:border-brass"
                placeholder="Describe the image"
              />
            </label>
          )}
        </div>

        {/* Gallery Images Section */}
        <div className="space-y-4 rounded-lg border border-line bg-surface p-4">
          <div>
            <label className="text-sm font-medium text-ink-muted">Gallery Images</label>
            <p className="mt-1 text-xs text-ink-muted">
              {(form.galleryImages?.length ?? 0)} image{(form.galleryImages?.length ?? 0) !== 1 ? "s" : ""} added
            </p>
          </div>

          {(form.galleryImages?.length ?? 0) > 0 && (
            <div className="grid gap-4 sm:grid-cols-3">
              {galleryImagePreviews.map((preview, index) => (
                <div key={index} className="relative overflow-hidden rounded-md">
                  <div className="aspect-square">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={preview} alt={`Gallery preview ${index + 1}`} className="h-full w-full object-cover" />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeGalleryImage(index)}
                    className="absolute right-1 top-1 rounded-full bg-red-600 px-2 py-1 text-xs text-white hover:bg-red-700"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          <label className="block">
            <span className="cursor-pointer rounded-md border border-line px-4 py-3 text-xs uppercase tracking-[0.18em] text-ink transition hover:border-brass hover:text-brass">
              Add gallery image
            </span>
            <input
              type="file"
              accept="image/*"
              onChange={handleGalleryImageSelect}
              className="hidden"
              disabled={uploadingImage}
              multiple
            />
          </label>
        </div>

        <div className="flex flex-wrap gap-4 text-sm text-ink-muted">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.featured ?? false}
              onChange={(event) => handleChange("featured", event.target.checked)}
            />
            Featured
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.published ?? true}
              onChange={(event) => handleChange("published", event.target.checked)}
            />
            Published
          </label>
        </div>

        <div className="flex justify-between gap-3 pt-4">
          <div className="flex gap-3">
            {deleteConfirm ? (
              <>
                <button
                  type="button"
                  onClick={() => setDeleteConfirm(false)}
                  className="rounded-full border border-line px-4 py-2 text-xs uppercase tracking-[0.18em] text-ink transition hover:border-brass hover:text-brass"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={deleting}
                  className="rounded-full border border-red-600 bg-red-600/10 px-4 py-2 text-xs uppercase tracking-[0.18em] text-red-600 transition hover:bg-red-600/20 disabled:opacity-70"
                >
                  {deleting ? "Deleting..." : "Confirm delete"}
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setDeleteConfirm(true)}
                className="rounded-full border border-red-600/30 px-4 py-2 text-xs uppercase tracking-[0.18em] text-red-600/70 transition hover:border-red-600 hover:text-red-600"
              >
                Delete
              </button>
            )}
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="rounded-full border border-line px-5 py-3 text-xs uppercase tracking-[0.18em] text-ink transition hover:border-brass hover:text-brass"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || uploadingImage}
              className="rounded-full bg-[image:var(--gradient-brand-button)] px-5 py-3 font-mono text-xs uppercase tracking-[0.18em] text-[#050505] transition hover:brightness-110 disabled:opacity-70"
            >
              {submitting ? "Saving..." : "Save changes"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
