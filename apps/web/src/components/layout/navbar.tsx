"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { Menu, X, Moon, Sun, ChevronDown } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

// ─── Nav structure ────────────────────────────────────────────────────────────

type NavChild = { label: string; href: string; desc?: string };
type NavItem =
  | { type: "link";     label: string; href: string }
  | { type: "dropdown"; label: string; children: NavChild[] };

const NAV_ITEMS: NavItem[] = [
  { type: "link", label: "Beranda", href: "/" },
  {
    type: "dropdown",
    label: "Komunitas",
    children: [
      { label: "Tentang Kami",  href: "/about",   desc: "Filosofi & tim Soraku" },
      { label: "Blog",          href: "/blog",    desc: "Artikel & ulasan anime" },
      { label: "Event",         href: "/events",  desc: "Acara & gathering" },
      { label: "Galeri",        href: "/gallery", desc: "Karya anggota" },
    ],
  },
  {
    type: "dropdown",
    label: "Agensi",
    children: [
      { label: "VTuber",  href: "/agensi/vtuber", desc: "Virtual YouTuber Soraku" },
      { label: "Talent",  href: "/agensi",        desc: "Profil kreator & talent" },
    ],
  },
];

// ─── Theme toggle ─────────────────────────────────────────────────────────────

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-card/50 text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
      aria-label="Toggle tema"
    >
      <Sun  className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    </button>
  );
}

// ─── Dropdown ─────────────────────────────────────────────────────────────────

function Dropdown({ item, pathname }: { item: Extract<NavItem, { type: "dropdown" }>; pathname: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isActive = item.children.some((c) => pathname === c.href || pathname.startsWith(c.href + "/"));

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "flex items-center gap-1 rounded-xl px-3 py-2 text-sm font-medium transition-colors",
          isActive
            ? "bg-primary/10 text-primary"
            : "text-muted-foreground hover:bg-primary/8 hover:text-foreground"
        )}
      >
        {item.label}
        <ChevronDown className={cn("h-3.5 w-3.5 transition-transform duration-200", open && "rotate-180")} />
      </button>

      {open && (
        <div className="absolute left-0 top-full z-50 mt-2 w-52 overflow-hidden rounded-2xl border border-border/80 bg-background/95 shadow-xl shadow-black/20 backdrop-blur-xl">
          <div className="p-1.5">
            {item.children.map((child) => (
              <Link
                key={child.href}
                href={child.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex flex-col rounded-xl px-3.5 py-2.5 transition-colors",
                  pathname === child.href
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-primary/8 hover:text-foreground"
                )}
              >
                <span className="text-sm font-medium">{child.label}</span>
                {child.desc && (
                  <span className="mt-0.5 text-xs text-muted-foreground/60">{child.desc}</span>
                )}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="absolute inset-0 border-b border-border/50 bg-background/80 backdrop-blur-xl" />

      <nav className="relative mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 font-bold">
          <span className="text-gradient block text-xl font-black leading-none tracking-tight">空</span>
          <span className="text-foreground/90 text-base font-bold tracking-wide">Soraku</span>
          <span className="text-muted-foreground/50 hidden text-xs font-medium uppercase tracking-widest sm:block">
            Community
          </span>
        </Link>

        {/* Desktop Nav */}
        <ul className="hidden items-center gap-0.5 md:flex">
          {NAV_ITEMS.map((item) => (
            <li key={item.label}>
              {item.type === "dropdown" ? (
                <Dropdown item={item} pathname={pathname} />
              ) : (
                <Link
                  href={item.href}
                  className={cn(
                    "rounded-xl px-3 py-2 text-sm font-medium transition-colors",
                    pathname === item.href
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-primary/8 hover:text-foreground"
                  )}
                >
                  {item.label}
                </Link>
              )}
            </li>
          ))}
        </ul>

        {/* Right */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link
            href="/login"
            className="hidden rounded-xl border border-border px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary sm:block"
          >
            Masuk
          </Link>
          <Link
            href="/register"
            className="hidden rounded-xl bg-primary px-4 py-2 text-sm font-bold text-white shadow-md shadow-primary/20 transition-all hover:-translate-y-0.5 hover:shadow-primary/30 sm:block"
          >
            Daftar
          </Link>
          <button
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-border text-muted-foreground md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Buka menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="relative border-b border-border bg-background/95 px-4 pb-4 backdrop-blur-xl md:hidden">
          <ul className="flex flex-col gap-0.5 pt-2">
            {NAV_ITEMS.map((item) => (
              <li key={item.label}>
                {item.type === "dropdown" ? (
                  <>
                    <button
                      onClick={() => setExpanded(expanded === item.label ? null : item.label)}
                      className="flex w-full items-center justify-between rounded-xl px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-primary/8 hover:text-foreground"
                    >
                      {item.label}
                      <ChevronDown
                        className={cn(
                          "h-3.5 w-3.5 transition-transform duration-200",
                          expanded === item.label && "rotate-180"
                        )}
                      />
                    </button>
                    {expanded === item.label && (
                      <ul className="ml-3 mt-0.5 flex flex-col gap-0.5 border-l border-border/50 pl-3">
                        {item.children.map((child) => (
                          <li key={child.href}>
                            <Link
                              href={child.href}
                              onClick={() => setMobileOpen(false)}
                              className={cn(
                                "block rounded-xl px-3 py-2 text-sm transition-colors",
                                pathname === child.href
                                  ? "font-medium text-primary"
                                  : "text-muted-foreground hover:text-foreground"
                              )}
                            >
                              {child.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                ) : (
                  <Link
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "block rounded-xl px-4 py-2.5 text-sm font-medium transition-colors",
                      pathname === item.href
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-primary/8 hover:text-foreground"
                    )}
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
          <div className="mt-3 flex gap-2 border-t border-border pt-3">
            <Link
              href="/login"
              onClick={() => setMobileOpen(false)}
              className="flex-1 rounded-xl border border-border py-2.5 text-center text-sm font-medium text-muted-foreground"
            >
              Masuk
            </Link>
            <Link
              href="/register"
              onClick={() => setMobileOpen(false)}
              className="flex-1 rounded-xl bg-primary py-2.5 text-center text-sm font-bold text-white"
            >
              Daftar
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
