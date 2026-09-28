"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { ArrowUpRight, Plus } from "lucide-react";
import { adminFetch } from "@/lib/admin-client";

type DashboardData = {
  counts: { totalProjects: number; publishedProjects: number; draftProjects: number; unreadInquiries: number };
  recentProjects: { id: string; slug: string; title: string; published: boolean; updatedAt: string; categories: string[]; coverImage: string | null }[];
  recentInquiries: { id: string; name: string; email: string; disciplines: string[]; createdAt: string; isRead: boolean; isFlagged: boolean }[];
};

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState("");

  async function loadDashboard() {
    try {
      const response = await adminFetch("/api/admin/dashboard");
      if (!response.ok) throw new Error("The dashboard data could not be loaded.");
      setData(await response.json());
      setError("");
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "The dashboard data could not be loaded.");
    }
  }

  useEffect(() => { void loadDashboard(); }, []);

  return (
    <div className="admin-page admin-dashboard container-editorial">
      <header className="admin-page-heading">
        <div><p className="eyebrow">Studio console // overview</p><h1>Dashboard</h1></div>
        <Link href="/admin/projects/new" className="button-primary"><Plus size={16} /> New project</Link>
      </header>
      {error && <p className="admin-alert" role="alert">{error} <button type="button" onClick={() => void loadDashboard()}>Retry</button></p>}
      {!data && !error ? <p className="admin-loading" role="status">Loading studio activity...</p> : null}
      {data && <>
        <section className="admin-metrics" aria-label="Portfolio counts">
          <article><span>Published projects</span><strong>{data.counts.publishedProjects}</strong><Link href="/admin/projects">View projects <ArrowUpRight size={14} /></Link></article>
          <article><span>Draft projects</span><strong>{data.counts.draftProjects}</strong><Link href="/admin/projects">Review drafts <ArrowUpRight size={14} /></Link></article>
          <article><span>All projects</span><strong>{data.counts.totalProjects}</strong><Link href="/admin/projects">Open portfolio <ArrowUpRight size={14} /></Link></article>
          <article><span>Unread inquiries</span><strong>{data.counts.unreadInquiries}</strong><Link href="/admin/inquiries?filter=unread">Open inbox <ArrowUpRight size={14} /></Link></article>
        </section>

        <div className="admin-dashboard-columns">
          <section className="admin-panel">
            <div className="admin-panel-heading"><div><p className="eyebrow">Portfolio // updated</p><h2>Recent projects</h2></div><Link href="/admin/projects">All projects <ArrowUpRight size={14} /></Link></div>
            {data.recentProjects.length ? <div className="admin-record-list">
              {data.recentProjects.map((project) => <article key={project.id} className="admin-project-row">
                <Link href={`/admin/projects/${project.id}`} className="admin-project-thumb" aria-label={`Edit ${project.title}`}>
                  {project.coverImage ? <Image src={project.coverImage} alt="" fill sizes="72px" /> : <span aria-hidden="true">GL</span>}
                </Link>
                <div className="admin-record-copy"><Link href={`/admin/projects/${project.id}`}><strong>{project.title}</strong></Link><span>{project.categories.join(" / ") || "Uncategorized"}</span></div>
                <span className={`admin-status${project.published ? " is-live" : ""}`}>{project.published ? "Published" : "Draft"}</span>
              </article>)}
            </div> : <p className="admin-empty">No projects yet. Create the first project to populate your portfolio.</p>}
          </section>

          <section className="admin-panel">
            <div className="admin-panel-heading"><div><p className="eyebrow">Studio dispatches</p><h2>Recent inquiries</h2></div><Link href="/admin/inquiries">Inbox <ArrowUpRight size={14} /></Link></div>
            {data.recentInquiries.length ? <div className="admin-record-list">
              {data.recentInquiries.map((inquiry) => <Link key={inquiry.id} href={`/admin/inquiries?id=${encodeURIComponent(inquiry.id)}`} className="admin-inquiry-row">
                <span className={`admin-unread-dot${inquiry.isRead ? " is-read" : ""}`} aria-label={inquiry.isRead ? "Read" : "Unread"} />
                <span className="admin-record-copy"><strong>{inquiry.name}</strong><span>{inquiry.disciplines.join(" / ")}</span></span>
                <time dateTime={inquiry.createdAt}>{new Date(inquiry.createdAt).toLocaleDateString()}</time>
              </Link>)}
            </div> : <p className="admin-empty">No inquiries have been received.</p>}
          </section>
        </div>
      </>}
      </div>
  );
}
