"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import {
  Menu, X, Moon, Sun, ChevronDown,
  Bell, Settings, LogOut, LayoutDashboard, Shield, CheckCheck,
} from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { useNotifications } from "@/hooks/use-notifications";
import { NOTIF_CONFIG, type Notification } from "@/lib/notifications";

// ─── Nav items ────────────────────────────────────────────────────────────────

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
      { label: "Tentang Kami", href: "/about",                desc: "Filosofi & tim Soraku"    },
      { label: "Blog",         href: "/blog",                 desc: "Artikel & ulasan anime"   },
      { label: "Event",        href: "/events",               desc: "Acara & gathering"        },
      { label: "Galeri",       href: "/gallery",              desc: "Karya anggota"            },
      { label: "Showcase",     href: "/community/showcase",   desc: "Karya terbaik komunitas"  },
      { label: "Sosial Media", href: "/social",               desc: "Semua platform Soraku"    },
    ],
  },
  {
    type: "dropdown",
    label: "Agensi",
    children: [
      { label: "VTuber", href: "/agensi/vtuber", desc: "Virtual YouTuber Soraku" },
      { label: "Talent", href: "/agensi",        desc: "Profil kreator & talent" },
    ],
  },
  { type: "link", label: "Premium", href: "/premium" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  if (diff < 60_000)     return "Baru saja";
  if (diff < 3_600_000)  return `${Math.floor(diff / 60_000)} mnt lalu`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)} jam lalu`;
  return `${Math.floor(diff / 86_400_000)} hari lalu`;
}

function useClickOutside(ref: React.RefObject<HTMLElement | null>, fn: () => void) {
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) fn();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [ref, fn]);
}

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

// ─── Notification Bell ────────────────────────────────────────────────────────

function NotificationBell() {
  // TODO Sora: ganti dengan IS_LOGGED_IN dari auth session nyata
  const IS_LOGGED_IN = true;
  const { notifications, unreadCount, markRead, markAllRead } = useNotifications(IS_LOGGED_IN);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useClickOutside(ref, () => setOpen(false));

  const handleClick = (n: Notification) => {
    if (!n.read) markRead([n.id]);
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "relative flex h-9 w-9 items-center justify-center rounded-xl border transition-colors",
          open
            ? "border-primary/50 bg-primary/10 text-primary"
            : "border-border bg-card/50 text-muted-foreground hover:border-primary/40 hover:text-primary"
        )}
        aria-label={`Notifikasi${unreadCount ? ` (${unreadCount})` : ""}`}
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white leading-none">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-80 overflow-hidden rounded-2xl border border-border/80 bg-background/98 shadow-2xl shadow-black/30 backdrop-blur-xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border/50 px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold">Notifikasi</span>
              {unreadCount > 0 && (
                <span className="rounded-full bg-primary/15 px-2 py-0.5 text-xs font-semibold text-primary">
                  {unreadCount} baru
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="flex items-center gap-1 text-xs text-muted-foreground/60 hover:text-primary transition-colors"
              >
                <CheckCheck className="h-3.5 w-3.5" />
                Tandai semua
              </button>
            )}
          </div>

          {/* List */}
          <ul className="max-h-[360px] overflow-y-auto">
            {notifications.length === 0 ? (
              <li className="py-10 text-center text-sm text-muted-foreground/50">
                Tidak ada notifikasi
              </li>
            ) : notifications.map((n) => {
              const cfg = NOTIF_CONFIG[n.type];
              const content = (
                <button
                  onClick={() => handleClick(n)}
                  className={cn(
                    "flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-primary/5",
                    !n.read && "bg-primary/[0.04]"
                  )}
                >
                  <span className={cn("mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl text-base", cfg.bg)}>
                    {cfg.emoji}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className={cn("text-xs font-semibold leading-tight", !n.read ? "text-foreground" : "text-muted-foreground")}>
                        {n.title}
                      </p>
                      {!n.read && <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />}
                    </div>
                    <p className="mt-0.5 text-xs leading-snug text-muted-foreground/70 line-clamp-2">{n.body}</p>
                    <p className="mt-1 text-[10px] text-muted-foreground/40">{timeAgo(n.created_at)}</p>
                  </div>
                </button>
              );
              return n.href ? (
                <li key={n.id}><Link href={n.href}>{content}</Link></li>
              ) : (
                <li key={n.id}>{content}</li>
              );
            })}
          </ul>

          {/* Footer */}
          <div className="border-t border-border/40 p-2">
            <Link
              href="/dashboard/notifications"
              onClick={() => setOpen(false)}
              className="block w-full rounded-xl py-2 text-center text-xs text-muted-foreground/60 transition-colors hover:bg-primary/8 hover:text-primary"
            >
              Lihat semua notifikasi →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── User Dropdown ────────────────────────────────────────────────────────────

// TODO Sora: ganti MOCK_USER dengan data dari useAuth() / session
const MOCK_USER = {
  name:   "Anon Weebs",
  username: "anon",
  avatar: null as string | null,
  role:   "USER" as "USER" | "ADMIN" | "OWNER",
};

function UserDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useClickOutside(ref, () => setOpen(false));
  const user = MOCK_USER;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "flex items-center gap-2 rounded-xl border px-2 py-1.5 transition-all",
          open ? "border-primary/50 bg-primary/8" : "border-border bg-card/50 hover:border-primary/40"
        )}
        aria-label="Menu akun"
      >
        <div className="h-6 w-6 overflow-hidden rounded-full bg-primary/20 flex-shrink-0 flex items-center justify-center">
          {user.avatar ? (
            <Image src={user.avatar} alt={user.name} width={24} height={24} className="h-full w-full object-cover" />
          ) : (
            <span className="text-[10px] font-bold text-primary">{user.name.charAt(0).toUpperCase()}</span>
          )}
        </div>
        <span className="hidden text-sm font-medium text-foreground/90 sm:block max-w-[80px] truncate">
          {user.name}
        </span>
        <ChevronDown className={cn("h-3.5 w-3.5 text-muted-foreground transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-52 overflow-hidden rounded-2xl border border-border/80 bg-background/98 shadow-2xl shadow-black/30 backdrop-blur-xl">
          {/* User info */}
          <div className="border-b border-border/50 px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 overflow-hidden rounded-xl bg-primary/20 flex-shrink-0 flex items-center justify-center">
                {user.avatar ? (
                  <Image src={user.avatar} alt={user.name} width={40} height={40} className="h-full w-full object-cover" />
                ) : (
                  <span className="text-sm font-bold text-primary">{user.name.charAt(0).toUpperCase()}</span>
                )}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{user.name}</p>
                <p className="truncate text-xs text-muted-foreground/60">@{user.username}</p>
              </div>
            </div>
          </div>

          {/* Links */}
          <div className="p-1.5">
            <Link href="/profile/me" onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-primary/8 hover:text-foreground">
              <LayoutDashboard className="h-4 w-4" />Profil Saya
            </Link>
            <Link href="/profile/settings" onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-primary/8 hover:text-foreground">
              <Settings className="h-4 w-4" />Pengaturan
            </Link>
            {(user.role === "ADMIN" || user.role === "OWNER") && (
              <Link href="/admin" onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-primary/8 hover:text-foreground">
                <Shield className="h-4 w-4" />Admin Panel
              </Link>
            )}
          </div>
          <div className="border-t border-border/40 p-1.5">
            <button
              onClick={() => { setOpen(false); /* TODO Sora: signout() */ }}
              className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
            >
              <LogOut className="h-4 w-4" />Keluar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Nav Dropdown ─────────────────────────────────────────────────────────────

function Dropdown({ item, pathname }: { item: Extract<NavItem, { type: "dropdown" }>; pathname: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useClickOutside(ref, () => setOpen(false));
  const isActive = item.children.some((c) => pathname === c.href || pathname.startsWith(c.href + "/"));

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "flex items-center gap-1 rounded-xl px-3 py-2 text-sm font-medium transition-colors",
          isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-primary/8 hover:text-foreground"
        )}
      >
        {item.label}
        <ChevronDown className={cn("h-3.5 w-3.5 transition-transform duration-200", open && "rotate-180")} />
      </button>

      {open && (
        <div className="absolute left-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-2xl border border-border/80 bg-background/95 shadow-xl shadow-black/20 backdrop-blur-xl">
          <div className="p-1.5">
            {item.children.map((child) => (
              <Link key={child.href} href={child.href} onClick={() => setOpen(false)}
                className={cn(
                  "flex flex-col rounded-xl px-3.5 py-2.5 transition-colors",
                  pathname === child.href ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-primary/8 hover:text-foreground"
                )}
              >
                <span className="text-sm font-medium">{child.label}</span>
                {child.desc && <span className="mt-0.5 text-xs text-muted-foreground/60">{child.desc}</span>}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────

// TODO Sora: ganti konstanta ini dengan hook useAuth()
const IS_LOGGED_IN = true;

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="absolute inset-0 border-b border-border/50 bg-background/80 backdrop-blur-xl" />

      <nav className="relative mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="h-9 w-9 flex-shrink-0 overflow-hidden rounded-xl border border-border/60 bg-[#1a1c20]">
            <Image
              src="/logo.png"
              alt="Soraku mascot"
              width={36}
              height={36}
              className="h-full w-full object-cover object-top transition-transform group-hover:scale-110 duration-300"
              priority
            />
          </div>
          <span className="text-foreground/90 text-base font-bold tracking-wide group-hover:text-primary transition-colors">
            Soraku
          </span>
          <span className="hidden text-muted-foreground/50 text-xs font-medium uppercase tracking-widest sm:block">
            Community
          </span>
        </Link>

        {/* Desktop nav */}
        <ul className="hidden items-center gap-0.5 md:flex">
          {NAV_ITEMS.map((item) => (
            <li key={item.label}>
              {item.type === "dropdown" ? (
                <Dropdown item={item} pathname={pathname} />
              ) : (
                <Link href={item.href}
                  className={cn(
                    "rounded-xl px-3 py-2 text-sm font-medium transition-colors",
                    pathname === item.href ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-primary/8 hover:text-foreground"
                  )}>
                  {item.label}
                </Link>
              )}
            </li>
          ))}
        </ul>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          <ThemeToggle />

          {IS_LOGGED_IN ? (
            <>
              <NotificationBell />
              <UserDropdown />
            </>
          ) : (
            <>
              <Link href="/login"
                className="hidden rounded-xl border border-border px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary sm:block">
                Masuk
              </Link>
              <Link href="/register"
                className="hidden rounded-xl bg-primary px-4 py-2 text-sm font-bold text-white shadow-md shadow-primary/20 transition-all hover:-translate-y-0.5 hover:shadow-primary/30 sm:block">
                Daftar
              </Link>
            </>
          )}

          {/* Hamburger */}
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
                      <ChevronDown className={cn("h-3.5 w-3.5 transition-transform duration-200", expanded === item.label && "rotate-180")} />
                    </button>
                    {expanded === item.label && (
                      <ul className="ml-3 mt-0.5 flex flex-col gap-0.5 border-l border-border/50 pl-3">
                        {item.children.map((child) => (
                          <li key={child.href}>
                            <Link href={child.href} onClick={() => setMobileOpen(false)}
                              className={cn("block rounded-xl px-3 py-2 text-sm transition-colors",
                                pathname === child.href ? "font-medium text-primary" : "text-muted-foreground hover:text-foreground")}>
                              {child.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                ) : (
                  <Link href={item.href} onClick={() => setMobileOpen(false)}
                    className={cn("block rounded-xl px-4 py-2.5 text-sm font-medium transition-colors",
                      pathname === item.href ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-primary/8 hover:text-foreground")}>
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>

          {IS_LOGGED_IN ? (
            <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-xl bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                  {MOCK_USER.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-medium">{MOCK_USER.name}</p>
                  <p className="text-xs text-muted-foreground/60">@{MOCK_USER.username}</p>
                </div>
              </div>
              <Link href="/profile/me" onClick={() => setMobileOpen(false)}
                className="rounded-xl border border-border px-3 py-2 text-xs font-medium text-muted-foreground">
                Profil
              </Link>
            </div>
          ) : (
            <div className="mt-3 flex gap-2 border-t border-border pt-3">
              <Link href="/login" onClick={() => setMobileOpen(false)}
                className="flex-1 rounded-xl border border-border py-2.5 text-center text-sm font-medium text-muted-foreground">
                Masuk
              </Link>
              <Link href="/register" onClick={() => setMobileOpen(false)}
                className="flex-1 rounded-xl bg-primary py-2.5 text-center text-sm font-bold text-white">
                Daftar
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
