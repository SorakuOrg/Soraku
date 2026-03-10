"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "Beranda",  href: "/" },
  { label: "Blog",     href: "/blog" },
  { label: "Event",    href: "/events" },
  { label: "Galeri",   href: "/gallery" },
  { label: "Agensi",   href: "/agensi" },
  { label: "Tentang",  href: "/about" },
] as const;

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

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Backdrop */}
      <div className="absolute inset-0 border-b border-border/50 bg-background/80 backdrop-blur-xl" />

      <nav className="relative mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="group flex items-center gap-2.5 font-bold"
        >
          <span className="text-gradient block text-xl font-black leading-none tracking-tight">
            空
          </span>
          <span className="text-foreground/90 text-base font-bold tracking-wide">
            Soraku
          </span>
          <span className="text-muted-foreground/50 text-xs font-medium tracking-widest uppercase hidden sm:block">
            Community
          </span>
        </Link>

        {/* Desktop Nav */}
        <ul className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map(({ label, href }) => (
            <li key={href}>
              <Link
                href={href}
                className={cn(
                  "rounded-xl px-3 py-2 text-sm font-medium transition-colors",
                  pathname === href
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-primary/8 hover:text-foreground"
                )}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right side */}
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

          {/* Mobile menu toggle */}
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
          <ul className="flex flex-col gap-1 pt-2">
            {NAV_LINKS.map(({ label, href }) => (
              <li key={href}>
                <Link
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "block rounded-xl px-4 py-2.5 text-sm font-medium transition-colors",
                    pathname === href
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-primary/8 hover:text-foreground"
                  )}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex gap-2 pt-3 border-t border-border">
            <Link href="/login" onClick={() => setMobileOpen(false)}
              className="flex-1 rounded-xl border border-border py-2.5 text-center text-sm font-medium text-muted-foreground">
              Masuk
            </Link>
            <Link href="/register" onClick={() => setMobileOpen(false)}
              className="flex-1 rounded-xl bg-primary py-2.5 text-center text-sm font-bold text-white">
              Daftar
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
