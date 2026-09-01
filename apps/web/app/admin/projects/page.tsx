import Link from "next/link";
import Image from "next/image";
import { listProjectsForAdmin } from "@/lib/admin-projects";

export const dynamic = "force-dynamic";

export default async function AdminProjectsPage() {
  const projects = await listProjectsForAdmin();

  return (
    <div className="container-editorial section-padding">
      <div className="flex flex-col gap-4 border-b border-white/10 pb-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow text-[#7ed957]">Portfolio</p>
          <h1 className="mt-3 font-display text-display">Projects</h1>
        </div>

        <Link
          href="/admin/projects/new"
          className="inline-flex items-center justify-center rounded-full bg-[image:var(--gradient-brand-button)] px-5 py-3 font-mono text-xs uppercase tracking-[0.18em] text-[#050505] transition hover:brightness-110"
        >
          Add project
        </Link>
      </div>

      <div className="mt-8 space-y-4">
        {projects.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/10 bg-[#131313] p-8 text-white/70">
            No projects yet.
          </div>
        ) : (
          projects.map((project) => (
            <div key={project.id} className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-[#131313] p-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
                {project.coverImage && (
                  <div className="relative h-24 w-32 flex-shrink-0 overflow-hidden rounded-lg bg-white/10 sm:h-20 sm:w-28">
                    <Image
                      src={project.coverImage.url}
                      alt={project.coverImage.altText || project.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-display text-xl">{project.title}</h2>
                    {!project.published ? (
                      <span className="rounded-full border border-white/10 px-2 py-1 text-[10px] uppercase tracking-[0.14em] text-white/60">
                        Draft
                      </span>
                    ) : null}
                    {project.featured ? (
                      <span className="rounded-full border border-[#7ed957]/40 bg-[#7ed957]/10 px-2 py-1 text-[10px] uppercase tracking-[0.14em] text-[#7ed957]">
                        Featured
                      </span>
                    ) : null}
                  </div>
                  <p className="text-sm text-white/70">{project.summary}</p>
                  <div className="flex flex-wrap gap-2 text-[10px] uppercase tracking-[0.14em] text-white/50">
                    {project.categories.map((category) => (
                      <span key={category.slug} className="rounded-full border border-white/10 px-2 py-1">
                        {category.label}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  href={`/admin/projects/${project.id}`}
                  className="rounded-full border border-white/10 px-4 py-2 text-xs uppercase tracking-[0.18em] text-white transition hover:border-[#7ed957] hover:text-[#7ed957]"
                >
                  Edit
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
