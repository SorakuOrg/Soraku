import type { Metadata } from "next";
import Link from "next/link";
import { LayoutDashboard, BookOpen, Calendar, Image, Users, Shield, ChevronRight } from "lucide-react";

export const metadata: Metadata = { title: "Admin — Soraku Community" };

// TODO: Sora — middleware protection: role ADMIN/MANAGER/OWNER only

const ADMIN_NAV = [
  { href: "/admin",          label: "Dashboard",  icon: LayoutDashboard },
  { href: "/admin/blog",     label: "Blog",        icon: BookOpen },
  { href: "/admin/events",   label: "Event",       icon: Calendar },
  { href: "/admin/gallery",  label: "Galeri",      icon: Image },
  { href: "/admin/users",    label: "Users",       icon: Users },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl px-4 py-8 sm:px-6 lg:px-8 gap-8">
      {/* Sidebar */}
      <aside className="hidden w-52 flex-shrink-0 lg:block">
        <div className="sticky top-24 glass-card p-4 border-primary/20">
          <div className="mb-4 flex items-center gap-2 pb-4 border-b border-border/50">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15">
              <Shield className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-bold">Admin</p>
              <p className="text-xs text-muted-foreground">Panel</p>
            </div>
          </div>
          <nav className="space-y-0.5">
            {ADMIN_NAV.map(({ href, label, icon: Icon }) => (
              <Link key={href} href={href}
                className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-primary/8 hover:text-foreground transition-colors">
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            ))}
          </nav>
          <div className="mt-4 pt-4 border-t border-border/50">
            <Link href="/dashboard" className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors">
              ← Dashboard User
            </Link>
          </div>
        </div>
      </aside>
      <main className="flex-1 min-w-0">{children}</main>
    </div>
  );
}
