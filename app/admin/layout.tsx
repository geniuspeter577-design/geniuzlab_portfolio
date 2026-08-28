export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <header className="border-b border-white/10 bg-[#000000]/80 backdrop-blur-md">
        <div className="container-editorial flex items-center justify-between py-4">
          <div>
            <p className="eyebrow text-[#7ed957]">GENIUZLAB</p>
            <p className="text-sm text-white/60">Admin</p>
          </div>
        </div>
      </header>

      <main>{children}</main>
    </div>
  );
}
