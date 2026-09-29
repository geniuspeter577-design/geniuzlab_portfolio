import Link from "next/link";
import { ArrowUpRight, ShieldCheck, SlidersHorizontal } from "lucide-react";

export default function AdminSettingsPage() {
  return (
    <div className="admin-page container-editorial section-padding">
      <header className="mb-8">
        <p className="eyebrow text-brass">Studio settings</p>
        <h1 className="mt-3 text-4xl font-black tracking-[-0.05em] sm:text-5xl">Site configuration</h1>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-line bg-surface p-6">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <p className="eyebrow text-brass">Brand</p>
              <h2 className="mt-2 text-2xl font-display tracking-[-0.04em]">Content settings</h2>
            </div>
            <SlidersHorizontal className="text-brass" size={18} />
          </div>

          <div className="space-y-4 text-sm text-ink-muted">
            <div className="rounded-xl border border-line bg-paper p-4">
              <p className="font-medium text-ink">Studio name</p>
              <p className="mt-1">GeniuzLab</p>
            </div>
            <div className="rounded-xl border border-line bg-paper p-4">
              <p className="font-medium text-ink">Founder</p>
              <p className="mt-1">Otsaje Genius Peter</p>
            </div>
            <div className="rounded-xl border border-line bg-paper p-4">
              <p className="font-medium text-ink">Portfolio focus</p>
              <p className="mt-1">Brand systems, product stories, digital experiences, and editorial visuals.</p>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-line bg-surface p-6">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <p className="eyebrow text-brass">Access</p>
              <h2 className="mt-2 text-2xl font-display tracking-[-0.04em]">Security</h2>
            </div>
            <ShieldCheck className="text-brass" size={18} />
          </div>

          <div className="space-y-4 text-sm text-ink-muted">
            <div className="rounded-xl border border-line bg-paper p-4">
              <p className="font-medium text-ink">Admin session</p>
              <p className="mt-1">Protected with JWT-based access and backend route checks.</p>
            </div>
            <div className="rounded-xl border border-line bg-paper p-4">
              <p className="font-medium text-ink">API status</p>
              <p className="mt-1">All project and inquiry routes are live and connected to the studio data source.</p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/admin/projects" className="button-primary inline-flex items-center gap-2">
              Review projects <ArrowUpRight size={15} />
            </Link>
            <Link href="/admin/inquiries" className="button-secondary inline-flex items-center gap-2">
              Open inbox
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
