"use client";
export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { Shield, Loader2 } from "lucide-react";

interface AdminUser {
  id: string; username: string; displayname: string | null;
  role: string; supporter_role?: string | null; createdat: string;
}

const RC: Record<string, string> = {
  OWNER:   "text-amber-400 bg-amber-500/10",
  MANAGER: "text-violet-400 bg-violet-500/10",
  ADMIN:   "text-primary bg-primary/10",
  USER:    "text-muted-foreground bg-muted",
};
const SC: Record<string, string> = {
  VVIP: "text-amber-400", VIP: "text-primary", DONATUR: "text-blue-400",
};

export default function AdminUsersPage() {
  const [users,   setUsers]   = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [total,   setTotal]   = useState(0);

  useEffect(() => {
    fetch("/api/admin/users?limit=50")
      .then(r => r.json())
      .then(d => { setUsers(d.data ?? []); setTotal(d.total ?? d.data?.length ?? 0); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const fmt = (iso: string) =>
    new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Users</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {loading ? "Memuat…" : `${total} member terdaftar`}
        </p>
      </div>

      <div className="glass-card overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center gap-2 py-12 text-muted-foreground/50">
            <Loader2 className="h-5 w-5 animate-spin" /><span className="text-sm">Memuat data…</span>
          </div>
        ) : users.length === 0 ? (
          <p className="py-10 text-center text-sm text-muted-foreground/50">Belum ada user.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50 text-left">
                  {["User", "Role", "Supporter", "Sejak", "Aksi"].map(h => (
                    <th key={h} className="px-4 py-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground/60">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-primary/3 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
                          {(u.displayname ?? u.username ?? "U").charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium">{u.displayname ?? u.username}</p>
                          <p className="text-xs text-muted-foreground">@{u.username}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${RC[u.role] ?? RC.USER}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {u.supporter_role
                        ? <span className={`text-xs font-medium ${SC[u.supporter_role] ?? ""}`}>{u.supporter_role}</span>
                        : <span className="text-xs text-muted-foreground/50">—</span>}
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground/60">{fmt(u.createdat)}</td>
                    <td className="px-4 py-3">
                      <button className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs text-muted-foreground hover:border-primary/40 hover:text-primary transition-colors">
                        <Shield className="h-3 w-3" />Ubah Role
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <div className="rounded-xl border border-border/50 bg-muted/20 px-4 py-3 text-xs text-muted-foreground">
        💡 Fungsi ubah role aktif setelah Kaizo setup <code className="text-primary">PATCH /api/admin/users/[id]</code>
      </div>
    </div>
  );
}
