"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight, Archive, Flag, Mail, MailOpen } from "lucide-react";
import { adminFetch } from "@/lib/admin-client";

type Inquiry = {
  id: string;
  name: string;
  email: string;
  disciplines: string[];
  budgetRange: string | null;
  brief: string;
  isRead: boolean;
  isFlagged: boolean;
  isArchived: boolean;
  createdAt: string;
};

type Filter = "all" | "unread" | "flagged" | "archived";

const filters: { key: Filter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "unread", label: "Unread" },
  { key: "flagged", label: "Flagged" },
  { key: "archived", label: "Archived" },
];

export default function AdminInquiriesPage() {
  const [items, setItems] = useState<Inquiry[]>([]);
  const [filter, setFilter] = useState<Filter>("all");
  const [selectedId, setSelectedId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState(false);

  async function loadInquiries() {
    setLoading(true);
    try {
      const response = await adminFetch("/api/admin/inquiries?filter=all");
      if (!response.ok) throw new Error("The inquiry inbox could not be loaded.");
      const result = await response.json();
      const inquiries = (result.inquiries ?? []) as Inquiry[];
      setItems(inquiries);
      setError("");
      setSelectedId((current) => current && inquiries.some((item) => item.id === current) ? current : inquiries[0]?.id ?? "");
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "The inquiry inbox could not be loaded.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void loadInquiries(); }, []);

  const counts = useMemo(() => ({
    all: items.length,
    unread: items.filter((item) => !item.isRead && !item.isArchived).length,
    flagged: items.filter((item) => item.isFlagged && !item.isArchived).length,
    archived: items.filter((item) => item.isArchived).length,
  }), [items]);
  const visible = items.filter((item) => filter === "all"
    ? !item.isArchived
    : filter === "unread"
      ? !item.isRead && !item.isArchived
      : filter === "flagged"
        ? item.isFlagged && !item.isArchived
        : item.isArchived);
  const selected = visible.find((item) => item.id === selectedId) ?? visible[0] ?? null;

  async function updateInquiry(id: string, changes: Partial<Pick<Inquiry, "isRead" | "isFlagged" | "isArchived">>) {
    setUpdating(true);
    setError("");
    try {
      const response = await adminFetch(`/api/admin/inquiries/${encodeURIComponent(id)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(changes),
      });
      if (!response.ok) throw new Error("That inquiry could not be updated.");
      const result = await response.json();
      setItems((current) => current.map((item) => item.id === id ? { ...item, ...result.inquiry } : item));
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : "That inquiry could not be updated.");
    } finally {
      setUpdating(false);
    }
  }

  function selectInquiry(inquiry: Inquiry) {
    setSelectedId(inquiry.id);
    if (!inquiry.isRead) void updateInquiry(inquiry.id, { isRead: true });
  }

  return (
    <div className="admin-page admin-inbox container-editorial">
      <header className="admin-page-heading">
        <div><p className="eyebrow">Studio dispatches // private</p><h1>Inquiries</h1></div>
        <p className="admin-heading-count">{counts.unread} unread</p>
      </header>
      <nav className="inquiry-filters" aria-label="Filter inquiries">
        {filters.map((item) => <button key={item.key} type="button" className={filter === item.key ? "is-active" : ""} onClick={() => setFilter(item.key)}>
          {item.label}<span>{counts[item.key]}</span>
        </button>)}
      </nav>
      {error && <p className="admin-alert" role="alert">{error}</p>}
      {loading ? <p className="admin-loading" role="status">Loading inquiries...</p> : visible.length ? (
        <div className="inquiry-workspace">
          <section className="inquiry-list" aria-label="Inquiry list">
            {visible.map((inquiry) => <button key={inquiry.id} type="button" className={`inquiry-list-item${selected?.id === inquiry.id ? " is-selected" : ""}${!inquiry.isRead ? " is-unread" : ""}`} onClick={() => selectInquiry(inquiry)}>
              <span className={`admin-unread-dot${inquiry.isRead ? " is-read" : ""}`} aria-hidden="true" />
              <span className="inquiry-list-copy"><strong>{inquiry.name}</strong><span>{inquiry.disciplines.join(" / ")}</span><small>{inquiry.brief}</small></span>
              <span className="inquiry-list-meta">{inquiry.isFlagged && <Flag size={14} aria-label="Flagged" />}<time dateTime={inquiry.createdAt}>{new Date(inquiry.createdAt).toLocaleDateString()}</time></span>
            </button>)}
          </section>
          {selected && <article className="inquiry-detail">
            <div className="inquiry-detail-heading"><div><p className="eyebrow">Inquiry // {new Date(selected.createdAt).toLocaleDateString()}</p><h2>{selected.name}</h2><a href={`mailto:${selected.email}`}>{selected.email}</a></div>
              <div className="inquiry-actions">
                <button type="button" title={selected.isRead ? "Mark unread" : "Mark read"} aria-label={selected.isRead ? "Mark unread" : "Mark read"} disabled={updating} onClick={() => void updateInquiry(selected.id, { isRead: !selected.isRead })}>{selected.isRead ? <Mail size={17} /> : <MailOpen size={17} />}</button>
                <button type="button" title={selected.isFlagged ? "Remove flag" : "Flag inquiry"} aria-label={selected.isFlagged ? "Remove flag" : "Flag inquiry"} disabled={updating} onClick={() => void updateInquiry(selected.id, { isFlagged: !selected.isFlagged })}><Flag size={17} /></button>
                <button type="button" title="Archive inquiry" aria-label="Archive inquiry" disabled={updating || selected.isArchived} onClick={() => void updateInquiry(selected.id, { isArchived: true })}><Archive size={17} /></button>
              </div>
            </div>
            <dl className="inquiry-meta"><div><dt>Discipline</dt><dd>{selected.disciplines.join(", ")}</dd></div><div><dt>Estimated investment</dt><dd>{selected.budgetRange || "Not provided"}</dd></div></dl>
            <div className="inquiry-brief"><p className="eyebrow">Project brief</p><p>{selected.brief}</p></div>
            <a className="button-primary inquiry-reply" href={`mailto:${selected.email}?subject=${encodeURIComponent("Re: Your GeniuzLab project inquiry")}`}>Reply by email <ArrowUpRight size={15} /></a>
          </article>}
        </div>
      ) : <div className="admin-empty admin-empty-large"><p className="eyebrow">Inbox // clear</p><h2>{filter === "archived" ? "No archived inquiries." : "No inquiries to show."}</h2><p>Submitted briefs will appear here once a visitor sends one.</p></div>}
    </div>
  );
}
