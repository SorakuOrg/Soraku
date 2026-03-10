import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { LayoutDashboard, User, BookOpen, Image, Settings, LogOut, Shield } from "lucide-react";

export const metadata: Metadata = { title: "Dashboard — Soraku Community" };

// TODO: Sora — tambah auth check di sini setelah middleware ready
// const user = await getServerUser(); if (!user) redirect("/login");

const SIDEBAR_LINKS = [
  { href: "/dashboard",           label: "Beranda",  icon: LayoutDashboard },
  { href: "/dashboard/profile",   label: "Profil",   icon: User },
  { href: "/dashboard/posts",     label: "Postingan",icon: BookOpen },
  { href: "/dashboard/gallery",   label: "Galeri",   icon: Image },
  { href: "/dashboard/settings",  label: "Pengaturan",icon: Settings },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl px-4 py-8 sm:px-6 lg:px-8 gap-8">
      {/* Sidebar */}
      <aside className="hidden w-56 flex-shrink-0 lg:block">
        <div className="sticky top-24 glass-card p-4">
          {/* User info placeholder */}
          <div className="mb-4 flex items-center gap-3 pb-4 border-b border-border/50">
            <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary font-bold">
              S
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">Member</p>
              <p className="text-xs text-muted-foreground truncate">@user</p>
            </div>
          </div>

          <nav className="space-y-0.5">
            {SIDEBAR_LINKS.map(({ href, label, icon: Icon }) => (
              <Link key={href} href={href}
                className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-primary/8 hover:text-foreground transition-colors">
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            ))}
            <div className="pt-2 border-t border-border/50 mt-2">
              <Link href="/admin"
                className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-primary/8 hover:text-foreground transition-colors">
                <Shield className="h-4 w-4" />
                Admin Panel
              </Link>
              <button className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors">
                <LogOut className="h-4 w-4" />
                Keluar
              </button>
            </div>
          </nav>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 min-w-0">{children}</main>
    </div>
  );
}
