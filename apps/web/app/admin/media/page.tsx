"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { ArrowUpRight, Check, Copy, Film, ImagePlus, Upload } from "lucide-react";
import { adminFetch } from "@/lib/admin-client";
import { useImageUpload } from "@/hooks/useImageUpload";

type ProjectOption = { id: string; title: string; coverImage: { url: string; altText: string | null } | null };
type MediaItem = {
  id: string;
  url: string;
  posterUrl: string | null;
  altText: string | null;
  type: "COVER" | "GALLERY" | "VIDEO";
  createdAt: string;
  project: { id: string; slug: string; title: string };
};
type MediaFilter = "all" | "images" | "videos";

export default function AdminMediaPage() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [projects, setProjects] = useState<ProjectOption[]>([]);
  const [filter, setFilter] = useState<MediaFilter>("all");
  const [projectId, setProjectId] = useState("");
  const [kind, setKind] = useState<"GALLERY" | "VIDEO">("GALLERY");
  const [file, setFile] = useState<File | null>(null);
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [copiedId, setCopiedId] = useState("");
  const { uploadImage, uploading, progress } = useImageUpload();

  async function loadLibrary() {
    setLoading(true);
    try {
      const [mediaResponse, projectResponse] = await Promise.all([
        adminFetch("/api/admin/media"),
        adminFetch("/api/admin/projects"),
      ]);
      if (!mediaResponse.ok || !projectResponse.ok) throw new Error("The media library could not be loaded.");
      const mediaData = await mediaResponse.json();
      const projectData = await projectResponse.json();
      const projectOptions = (projectData.projects ?? []) as ProjectOption[];
      setMedia(mediaData.media ?? []);
      setProjects(projectOptions);
      setProjectId((current) => current || projectOptions[0]?.id || "");
      setError("");
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "The media library could not be loaded.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void loadLibrary(); }, []);

  const visibleMedia = useMemo(() => media.filter((item) => {
    const typeMatches = filter === "all" || (filter === "videos" ? item.type === "VIDEO" : item.type !== "VIDEO");
    const textMatches = !query || `${item.altText ?? ""} ${item.project.title} ${item.type}`.toLowerCase().includes(query.toLowerCase());
    return typeMatches && textMatches;
  }), [media, filter, query]);

  async function addMedia(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!file || !projectId) {
      setError("Choose a project and media file first.");
      return;
    }
    setSaving(true);
    setError("");
    setNotice("");
    try {
      const uploaded = await uploadImage(file, kind === "VIDEO");
      const response = await adminFetch("/api/admin/media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId, url: uploaded.url, type: kind, altText: file.name }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || "The uploaded asset could not be attached to the project.");
      setFile(null);
      const input = document.getElementById("media-upload-file") as HTMLInputElement | null;
      if (input) input.value = "";
      setNotice("Media uploaded and attached to the selected project.");
      await loadLibrary();
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Media upload failed.");
    } finally {
      setSaving(false);
    }
  }

  async function copyUrl(item: MediaItem) {
    try {
      await navigator.clipboard.writeText(item.url);
      setCopiedId(item.id);
      window.setTimeout(() => setCopiedId(""), 1600);
    } catch {
      setError("Clipboard access is unavailable in this browser.");
    }
  }

  const imageCount = media.filter((item) => item.type !== "VIDEO").length;
  const videoCount = media.filter((item) => item.type === "VIDEO").length;

  return (
    <div className="admin-page admin-media-page container-editorial">
      <header className="admin-page-heading"><div><p className="eyebrow">Assets // connected projects</p><h1>Media manager</h1></div><span className="admin-heading-count">{media.length} linked assets</span></header>
      {error && <p className="admin-alert" role="alert">{error}</p>}
      {notice && <p className="admin-notice" role="status">{notice}</p>}

      <form className="media-upload-panel" onSubmit={addMedia}>
        <div className="admin-panel-heading"><div><p className="eyebrow">Upload // existing storage</p><h2>Add project media</h2></div><ImagePlus size={22} aria-hidden="true" /></div>
        <div className="media-upload-fields">
          <label><span>Attach to project</span><select value={projectId} onChange={(event) => setProjectId(event.target.value)} required disabled={!projects.length}>
            {projects.length ? projects.map((project) => <option key={project.id} value={project.id}>{project.title}</option>) : <option value="">Create a project first</option>}
          </select></label>
          <label><span>Asset type</span><select value={kind} onChange={(event) => setKind(event.target.value as "GALLERY" | "VIDEO")}><option value="GALLERY">Gallery image</option><option value="VIDEO">Project video</option></select></label>
          <label className="media-file-picker"><span>Choose {kind === "VIDEO" ? "video" : "image"}</span><input id="media-upload-file" type="file" accept={kind === "VIDEO" ? "video/mp4,video/webm,video/quicktime,.mp4,.webm,.mov" : "image/*"} onChange={(event) => setFile(event.target.files?.[0] ?? null)} required /></label>
          <button type="submit" className="button-primary" disabled={saving || uploading || !projects.length}><Upload size={16} />{saving || uploading ? `Uploading ${progress}%` : "Upload and attach"}</button>
        </div>
        <p className="media-upload-note">Files use the configured studio storage provider and are linked to this project. Use the project editor to replace a cover or video poster.</p>
      </form>

      <div className="media-library-toolbar">
        <div className="inquiry-filters" role="group" aria-label="Filter media">
          <button type="button" className={filter === "all" ? "is-active" : ""} onClick={() => setFilter("all")}>All <span>{media.length}</span></button>
          <button type="button" className={filter === "images" ? "is-active" : ""} onClick={() => setFilter("images")}>Images <span>{imageCount}</span></button>
          <button type="button" className={filter === "videos" ? "is-active" : ""} onClick={() => setFilter("videos")}>Videos <span>{videoCount}</span></button>
        </div>
        <label className="media-search"><span className="sr-only">Search media</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search assets or projects" /></label>
      </div>

      {loading ? <p className="admin-loading" role="status">Loading linked media...</p> : visibleMedia.length ? <div className="media-grid">
        {visibleMedia.map((item) => <article className="media-card" key={item.id}>
          <div className="media-preview">
            {item.type === "VIDEO" && item.posterUrl ? <Image src={item.posterUrl} alt={item.altText ?? "Video poster"} fill sizes="(max-width: 700px) 100vw, 33vw" /> : item.type !== "VIDEO" ? <Image src={item.url} alt={item.altText ?? "Project media"} fill sizes="(max-width: 700px) 100vw, 33vw" /> : <div className="media-video-placeholder"><Film size={32} /><span>Video</span></div>}
            <span className="media-type-badge">{item.type === "VIDEO" ? "Video" : item.type === "COVER" ? "Cover" : "Image"}</span>
          </div>
          <div className="media-card-info"><div><strong>{item.project.title}</strong><span>{item.altText || "Project media"}</span></div><time dateTime={item.createdAt}>{new Date(item.createdAt).toLocaleDateString()}</time></div>
          <div className="media-card-actions"><button type="button" onClick={() => void copyUrl(item)}>{copiedId === item.id ? <Check size={15} /> : <Copy size={15} />}{copiedId === item.id ? "Copied" : "Copy URL"}</button><Link href={`/admin/projects/${item.project.id}`}>Open project <ArrowUpRight size={14} /></Link></div>
        </article>)}
      </div> : <div className="admin-empty admin-empty-large"><p className="eyebrow">Media library // clear</p><h2>{media.length ? "No matching assets." : "No project media yet."}</h2><p>Upload an image or video and attach it to a real portfolio project.</p></div>}
    </div>
  );
}
