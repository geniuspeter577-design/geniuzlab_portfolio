"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { adminProjectSchema } from "@/lib/admin-schema";
import { adminFetch } from "@/lib/admin-client";
import { useImageUpload } from "@/hooks/useImageUpload";

type CategoryOption = {
  slug: string;
  label: string;
};

type GalleryImage = {
  url: string;
  altText: string;
};

type VideoMedia = {
  url: string;
  posterUrl: string | null;
};

export default function NewProjectPage() {
  const router = useRouter();
  const { uploadImage, uploading: uploadingImage, error: uploadError, progress: uploadProgress } = useImageUpload();
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [coverImagePreview, setCoverImagePreview] = useState("");
  const [galleryImagePreviews, setGalleryImagePreviews] = useState<string[]>([]);
  const [mediaMode, setMediaMode] = useState<"image" | "video" | "mixed">("image");
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
    galleryImages: [] as GalleryImage[],
    video: null as VideoMedia | null,
  });

  useEffect(() => {
    async function loadCategories() {
      const response = await adminFetch("/api/admin/categories");
      if (response.ok) {
        const data = await response.json();
        setCategories(data.categories ?? []);
      }
    }

    void loadCategories();
  }, []);

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
        coverImageUrl: url,
        coverImageAlt: current.title || filename,
      }));
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload cover image");
    }
  };

  const handleGalleryImageSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.currentTarget.files ?? []);
    event.currentTarget.value = "";

    for (const file of files) {
      try {
        const reader = new FileReader();
        const previewUrl = await new Promise<string>((resolve) => {
          reader.onload = (e) => resolve((e.target?.result as string) ?? "");
          reader.readAsDataURL(file);
        });
        const { url } = await uploadImage(file);

        setForm((current) => ({
          ...current,
          galleryImages: [
            ...current.galleryImages,
            { url, altText: `${current.title || "Project"} - ${current.galleryImages.length + 1}` },
          ],
        }));
        setGalleryImagePreviews((current) => [...current, previewUrl]);
        setError("");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to upload gallery image");
        break;
      }
    }
  };

  const handleVideoSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0];
    event.currentTarget.value = "";
    if (!file) return;

    try {
      const { url } = await uploadImage(file, true);
      setForm((current) => ({
        ...current,
        video: { url, posterUrl: current.video?.posterUrl ?? null },
      }));
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload video");
    }
  };

  const handleVideoPosterSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0];
    event.currentTarget.value = "";
    if (!file || !form.video) return;

    try {
      const { url } = await uploadImage(file);
      setForm((current) => current.video
        ? { ...current, video: { ...current.video, posterUrl: url } }
        : current);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload video poster");
    }
  };

  const removeGalleryImage = (index: number) => {
    setForm((current) => ({
      ...current,
      galleryImages: current.galleryImages.filter((_, i) => i !== index),
    }));
    setGalleryImagePreviews((current) => current.filter((_, i) => i !== index));
  };

  const removeCoverImage = () => {
    setForm((current) => ({
      ...current,
      coverImageUrl: "",
      coverImageAlt: "",
    }));
    setCoverImagePreview("");
  };

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
        video: form.video,
      });

      const response = await adminFetch("/api/admin/projects", {
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
    <div className="admin-page container-editorial section-padding">
      <div className="mb-8">
        <p className="eyebrow text-brass">Portfolio</p>
        <h1 className="mt-3 font-display text-display">Create new project</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl border border-line bg-surface p-6 sm:p-8">
        {error && <p className="text-sm text-red-400">{error}</p>}
        {uploadError && <p className="text-sm text-red-400">Upload error: {uploadError}</p>}
        {uploadingImage && <p className="text-sm text-brass">Uploading... {uploadProgress}%</p>}

        <div className="grid gap-6 md:grid-cols-2">
          <label className="space-y-2 text-sm text-ink-muted">
            <span>Project title</span>
            <input
              value={form.title}
              onChange={(event) => handleChange("title", event.target.value)}
              className="w-full rounded-md border border-line bg-paper px-4 py-3 text-ink outline-none focus:border-brass"
              required
            />
          </label>

          <label className="space-y-2 text-sm text-ink-muted">
            <span>Client</span>
            <input
              value={form.client}
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
              value={form.categorySlugs}
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
                value={form.year}
                onChange={(event) => handleChange("year", Number(event.target.value))}
                className="w-full rounded-md border border-line bg-paper px-4 py-3 text-ink outline-none focus:border-brass"
              />
            </label>

            <label className="space-y-2 text-sm text-ink-muted">
              <span>Display order</span>
              <input
                type="number"
                value={form.orderIndex}
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
              value={form.role}
              onChange={(event) => handleChange("role", event.target.value)}
              className="w-full rounded-md border border-line bg-paper px-4 py-3 text-ink outline-none focus:border-brass"
            />
          </label>

          <label className="space-y-2 text-sm text-ink-muted">
            <span>Tags (comma-separated)</span>
            <input
              value={form.tags}
              onChange={(event) => handleChange("tags", event.target.value)}
              className="w-full rounded-md border border-line bg-paper px-4 py-3 text-ink outline-none focus:border-brass"
            />
          </label>
        </div>

        <label className="block space-y-2 text-sm text-ink-muted">
          <span>Summary</span>
          <textarea
            value={form.summary}
            onChange={(event) => handleChange("summary", event.target.value)}
            rows={3}
            className="w-full rounded-md border border-line bg-paper px-4 py-3 text-ink outline-none focus:border-brass"
            required
          />
        </label>

        <label className="block space-y-2 text-sm text-ink-muted">
          <span>Description</span>
          <textarea
            value={form.description}
            onChange={(event) => handleChange("description", event.target.value)}
            rows={6}
            className="w-full rounded-md border border-line bg-paper px-4 py-3 text-ink outline-none focus:border-brass"
          />
        </label>

        <section className="space-y-4 rounded-lg border border-line bg-surface p-4" aria-labelledby="project-media-heading">
          <div>
            <h2 id="project-media-heading" className="text-sm font-medium text-ink-muted">UPLOAD PROJECT MEDIA</h2>
            <div className="mt-3 flex flex-wrap gap-2" role="tablist" aria-label="Project media view">
              {(["image", "video", "mixed"] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  role="tab"
                  aria-selected={mediaMode === mode}
                  onClick={() => setMediaMode(mode)}
                  className={`rounded-md border px-4 py-2 text-xs uppercase text-ink transition ${mediaMode === mode ? "border-brass bg-brass/10 text-brass" : "border-line hover:border-brass"}`}
                >
                  {mode === "mixed" ? "Mixed" : mode === "image" ? "Image" : "Video"}
                </button>
              ))}
            </div>
          </div>
        </section>

        {(mediaMode === "image" || mediaMode === "mixed") && <>
        {/* Cover Image Section */}
        <div className="space-y-4 rounded-lg border border-line bg-surface p-4">
          <div>
            <label className="text-sm font-medium text-ink-muted">Cover Image</label>
            <p className="mt-1 text-xs text-ink-muted">{form.coverImageUrl ? "✓ Uploaded" : "No image selected"}</p>
          </div>

          {coverImagePreview && (
            <div className="overflow-hidden rounded-md">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={coverImagePreview} alt="Cover preview" className="block h-auto w-full object-contain" />
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
            <span className="block cursor-pointer rounded-md border border-line px-4 py-3 text-center text-xs uppercase tracking-[0.18em] text-ink transition hover:border-brass hover:text-brass">
              {form.coverImageUrl ? "Change image" : "Upload cover image"}
            </span>
            <input
              type="file"
              accept="image/*"
              onChange={handleCoverImageSelect}
              className="hidden"
              disabled={uploadingImage}
            />
          </label>

          {form.coverImageUrl && (
            <label className="space-y-2 text-sm text-ink-muted">
              <span>Alt text</span>
              <input
                value={form.coverImageAlt}
                onChange={(event) => handleChange("coverImageAlt", event.target.value)}
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
              {form.galleryImages.length} image{form.galleryImages.length !== 1 ? "s" : ""} added
            </p>
          </div>

          {form.galleryImages.length > 0 && (
            <div className="grid gap-4 sm:grid-cols-3">
              {galleryImagePreviews.map((preview, index) => (
                <div key={index} className="relative overflow-hidden rounded-md">
                  <div className="aspect-square">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={preview} alt={`Gallery preview ${index + 1}`} className="block h-auto w-full object-contain" />
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
            <span className="block cursor-pointer rounded-md border border-line px-4 py-3 text-center text-xs uppercase tracking-[0.18em] text-ink transition hover:border-brass hover:text-brass">
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
        </>}

        {(mediaMode === "video" || mediaMode === "mixed") && (
          <section className="space-y-4 rounded-lg border border-line bg-surface p-4" aria-label="Project video">
            <div>
              <h2 className="text-sm font-medium text-ink-muted">Video</h2>
              <p className="mt-1 text-xs text-ink-muted">MP4, WebM, or MOV. Maximum file size 50MB.</p>
            </div>

            {form.video ? (
              <div className="space-y-3">
                <video
                  controls
                  playsInline
                  preload="metadata"
                  poster={form.video.posterUrl || form.coverImageUrl || undefined}
                  src={form.video.url}
                  className="aspect-video w-full rounded-md bg-black object-contain"
                />
                <div className="flex flex-wrap gap-3">
                  <label className="block">
                    <span className="block cursor-pointer rounded-md border border-line px-4 py-2 text-center text-xs uppercase text-ink transition hover:border-brass hover:text-brass">Replace video</span>
                    <input type="file" accept="video/mp4,video/webm,video/quicktime,.mp4,.webm,.mov" onChange={handleVideoSelect} className="hidden" disabled={uploadingImage} />
                  </label>
                  <button type="button" onClick={() => setForm((current) => ({ ...current, video: null }))} className="rounded-md border border-red-500/40 px-4 py-2 text-xs uppercase text-red-400 hover:border-red-500">Remove video</button>
                </div>
              </div>
            ) : (
              <label className="block">
                <span className="block cursor-pointer rounded-md border border-line px-4 py-3 text-center text-xs uppercase tracking-[0.18em] text-ink transition hover:border-brass hover:text-brass">Select video</span>
                <input type="file" accept="video/mp4,video/webm,video/quicktime,.mp4,.webm,.mov" onChange={handleVideoSelect} className="hidden" disabled={uploadingImage} />
              </label>
            )}

            {form.video && (
              <div className="space-y-3 border-t border-line pt-4">
                <p className="text-sm text-ink-muted">Video poster / thumbnail</p>
                {form.video.posterUrl ? (
                  <div className="space-y-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={form.video.posterUrl} alt="Video poster preview" className="max-h-64 w-full rounded-md object-contain" />
                    <button type="button" onClick={() => setForm((current) => current.video ? { ...current, video: { ...current.video, posterUrl: null } } : current)} className="text-xs text-red-400 hover:text-red-300">Remove poster</button>
                  </div>
                ) : null}
                <div className="flex flex-wrap gap-3">
                  <label className="block">
                    <span className="block cursor-pointer rounded-md border border-line px-4 py-2 text-center text-xs uppercase text-ink transition hover:border-brass hover:text-brass">{form.video.posterUrl ? "Replace poster" : "Upload poster"}</span>
                    <input type="file" accept="image/*" onChange={handleVideoPosterSelect} className="hidden" disabled={uploadingImage} />
                  </label>
                  {form.coverImageUrl && form.video.posterUrl !== form.coverImageUrl && (
                    <button type="button" onClick={() => setForm((current) => current.video ? { ...current, video: { ...current.video, posterUrl: current.coverImageUrl || null } } : current)} className="rounded-md border border-line px-4 py-2 text-xs uppercase text-ink hover:border-brass">Use cover image</button>
                  )}
                </div>
              </div>
            )}
          </section>
        )}

        <div className="flex flex-wrap gap-4 text-sm text-ink-muted">
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
            className="rounded-full border border-line px-5 py-3 text-xs uppercase tracking-[0.18em] text-ink transition hover:border-brass hover:text-brass"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving || uploadingImage}
            className="rounded-full bg-[image:var(--gradient-brand-button)] px-5 py-3 font-mono text-xs uppercase tracking-[0.18em] text-[#050505] transition hover:brightness-110 disabled:opacity-70"
          >
            {saving ? "Saving..." : "Save project"}
          </button>
        </div>
      </form>
    </div>
  );
}
