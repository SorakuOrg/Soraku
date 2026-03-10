import Link from "next/link";

const FOOTER_LINKS = {
  Komunitas: [
    { label: "Blog",         href: "/blog" },
    { label: "Event",        href: "/events" },
    { label: "Galeri",       href: "/gallery" },
    { label: "Tentang Kami", href: "/about" },
  ],
  Platform: [
    { label: "Agensi",       href: "/agensi" },
    { label: "Premium",      href: "/premium" },
    { label: "Donasi",       href: "/donate" },
  ],
  Akun: [
    { label: "Daftar",       href: "/register" },
    { label: "Masuk",        href: "/login" },
    { label: "Dashboard",    href: "/dashboard" },
  ],
};

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border/50">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2">
              <span className="text-gradient text-2xl font-black leading-none">空</span>
              <span className="text-lg font-bold">Soraku</span>
            </div>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed max-w-[220px]">
              Komunitas anime & budaya Jepang non-profit berbasis Indonesia.
            </p>
            <div className="mt-4 flex items-center gap-3">
              <a
                href="https://discord.gg/qm3XJvRa6B"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-indigo-500/30 bg-indigo-500/8 text-indigo-400 transition-colors hover:border-indigo-400/50 hover:bg-indigo-500/15"
                aria-label="Discord"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Links */}
          {Object.entries(FOOTER_LINKS).map(([group, links]) => (
            <div key={group}>
              <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground/60">
                {group}
              </h3>
              <ul className="space-y-2.5">
                {links.map(({ label, href }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border/50 pt-6 text-xs text-muted-foreground/50 sm:flex-row">
          <p>© 2023 – {new Date().getFullYear()} Soraku Community · Non-profit</p>
          <p className="flex items-center gap-1">
            Dibangun dengan <span className="text-rose-400">♥</span> untuk komunitas Indonesia
          </p>
        </div>
      </div>
    </footer>
  );
}
