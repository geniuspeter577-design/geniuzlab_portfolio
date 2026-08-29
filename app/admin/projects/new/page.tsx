"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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

export default function NewProjectPage() {
  const router = useRouter();
  const { uploadImage, uploading: uploadingImage, error: uploadError, progress: uploadProgress } = useImageUpload();
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [coverImagePreview, setCoverImagePreview] = useState("");
  const [galleryImagePreviews, setGalleryImagePreviews] = useState<string[]>([]);
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
          ...current.galleryImages,
          {
            url,
            altText: `${current.title || "Project"} - ${current.galleryImages.length + 1}`,
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
        {error && <p className="text-sm text-red-400">{error}</p>}
        {uploadError && <p className="text-sm text-red-400">Upload error: {uploadError}</p>}
        {uploadingImage && <p className="text-sm text-[#7ed957]">Uploading... {uploadProgress}%</p>}

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

        {/* Cover Image Section */}
        <div className="space-y-4 rounded-lg border border-white/10 bg-black/50 p-4">
          <div>
            <label className="text-sm font-medium text-white/80">Cover Image</label>
            <p className="mt-1 text-xs text-white/50">{form.coverImageUrl ? "✓ Uploaded" : "No image selected"}</p>
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
            <span className="cursor-pointer rounded-md border border-white/10 px-4 py-3 text-xs uppercase tracking-[0.18em] text-white transition hover:border-[#7ed957] hover:text-[#7ed957]">
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
            <label className="space-y-2 text-sm text-white/80">
              <span>Alt text</span>
              <input
                value={form.coverImageAlt}
                onChange={(event) => handleChange("coverImageAlt", event.target.value)}
                className="w-full rounded-md border border-white/10 bg-black px-4 py-3 text-white outline-none focus:border-[#7ed957]"
                placeholder="Describe the image"
              />
            </label>
          )}
        </div>

        {/* Gallery Images Section */}
        <div className="space-y-4 rounded-lg border border-white/10 bg-black/50 p-4">
          <div>
            <label className="text-sm font-medium text-white/80">Gallery Images</label>
            <p className="mt-1 text-xs text-white/50">
              {form.galleryImages.length} image{form.galleryImages.length !== 1 ? "s" : ""} added
            </p>
          </div>

          {form.galleryImages.length > 0 && (
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
            <span className="cursor-pointer rounded-md border border-white/10 px-4 py-3 text-xs uppercase tracking-[0.18em] text-white transition hover:border-[#7ed957] hover:text-[#7ed957]">
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
