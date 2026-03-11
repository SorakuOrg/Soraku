"use client";
export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { Shield, Loader2, Ban, RefreshCw, ChevronDown } from "lucide-react";

interface AdminUser {
  id: string;
  username: string | null;
  displayname: string | null;
  role: string;
  supporterrole: string | null;
  isbanned: boolean;
  createdat: string;
}

type UserRole = "OWNER" | "MANAGER" | "ADMIN" | "AGENSI" | "KREATOR" | "USER";

const ROLE_COLOR: Record<string, string> = {
  OWNER:   "text-amber-400 bg-amber-500/10 border-amber-500/20",
  MANAGER: "text-violet-400 bg-violet-500/10 border-violet-500/20",
  ADMIN:   "text-primary bg-primary/10 border-primary/20",
  AGENSI:  "text-pink-400 bg-pink-500/10 border-pink-500/20",
  KREATOR: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
  USER:    "text-muted-foreground bg-muted border-border",
};
const SUP_COLOR: Record<string, string> = {
  VVIP: "text-amber-400", VIP: "text-primary", DONATUR: "text-blue-400",
};
const ROLES: UserRole[] = ["OWNER","MANAGER","ADMIN","AGENSI","KREATOR","USER"];

export default function AdminUsersPage() {
  const [users,   setUsers]   = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [total,   setTotal]   = useState(0);
  const [acting,  setActing]  = useState<string | null>(null);
  const [search,  setSearch]  = useState("");
  const [openRole, setOpenRole] = useState<string | null>(null); // id user yg role dropdown-nya terbuka

  const load = (q = search) => {
    setLoading(true);
    const params = new URLSearchParams({ limit: "50" });
    if (q) params.set("q", q);
    fetch(`/api/admin/users?${params}`)
      .then(r => r.json())
      .then(d => {
        setUsers(d.data ?? []);
        setTotal(d.meta?.total ?? d.data?.length ?? 0); // ← fix: d.meta.total
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleRole = async (userId: string, role: UserRole) => {
    setActing(userId); setOpenRole(null);
    const res = await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: userId, role }),
    });
    if (res.ok) setUsers(prev => prev.map(u => u.id === userId ? { ...u, role } : u));
    setActing(null);
  };

  const handleBan = async (user: AdminUser) => {
    const action = user.isbanned ? "unban" : "ban";
    if (!confirm(`${action === "ban" ? "Ban" : "Unban"} user ${user.displayname ?? user.username}?`)) return;
    setActing(user.id);
    const res = await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: user.id, isbanned: !user.isbanned }),
    });
    if (res.ok) setUsers(prev => prev.map(u => u.id === user.id ? { ...u, isbanned: !u.isbanned } : u));
    setActing(null);
  };

  const fmt = (iso: string) =>
    new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold">Users</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {loading ? "Memuat…" : `${total} member terdaftar`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Cari username…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => e.key === "Enter" && load(search)}
            className="rounded-xl border border-border bg-card/50 px-3 py-2 text-sm placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-primary/40 w-48"
          />
          <button onClick={() => load(search)} className="flex items-center gap-1.5 rounded-xl border border-border px-3 py-2 text-xs text-muted-foreground hover:text-foreground transition-colors">
            <RefreshCw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center gap-2 py-16 text-muted-foreground/40">
          <Loader2 className="h-5 w-5 animate-spin" /><span className="text-sm">Memuat data…</span>
        </div>
      ) : users.length === 0 ? (
        <div className="glass-card py-16 text-center">
          <Shield className="mx-auto h-8 w-8 text-muted-foreground/20 mb-3" />
          <p className="text-sm text-muted-foreground/50">Tidak ada user ditemukan.</p>
        </div>
      ) : (
        <div className="glass-card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b border-border/50">
              <tr className="text-xs text-muted-foreground/60">
                <th className="px-4 py-3 text-left font-medium">User</th>
                <th className="px-4 py-3 text-left font-medium">Role</th>
                <th className="px-4 py-3 text-left font-medium hidden md:table-cell">Supporter</th>
                <th className="px-4 py-3 text-left font-medium hidden lg:table-cell">Bergabung</th>
                <th className="px-4 py-3 text-right font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30" onClick={() => setOpenRole(null)}>
              {users.map(u => (
                <tr key={u.id} className={`hover:bg-primary/3 transition-colors ${u.isbanned ? "opacity-50" : ""}`}>
                  <td className="px-4 py-3">
                    <p className="font-medium line-clamp-1">{u.displayname ?? u.username ?? "—"}</p>
                    <p className="text-xs text-muted-foreground/50">@{u.username ?? u.id.slice(0,8)}</p>
                  </td>
                  <td className="px-4 py-3">
                    {/* Role dropdown */}
                    <div className="relative" onClick={e => e.stopPropagation()}>
                      <button
                        onClick={() => setOpenRole(openRole === u.id ? null : u.id)}
                        disabled={acting === u.id}
                        className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors hover:opacity-80 ${ROLE_COLOR[u.role] ?? ROLE_COLOR.USER}`}
                      >
                        {acting === u.id ? <Loader2 className="h-2.5 w-2.5 animate-spin" /> : null}
                        {u.role}
                        <ChevronDown className="h-2.5 w-2.5" />
                      </button>
                      {openRole === u.id && (
                        <div className="absolute left-0 top-full z-20 mt-1 min-w-[120px] rounded-xl border border-border bg-card shadow-xl">
                          {ROLES.map(r => (
                            <button
                              key={r}
                              onClick={() => handleRole(u.id, r)}
                              className={`flex w-full items-center gap-2 px-3 py-2 text-xs hover:bg-primary/8 transition-colors first:rounded-t-xl last:rounded-b-xl ${r === u.role ? "text-primary font-semibold" : "text-muted-foreground"}`}
                            >
                              {r}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    {u.supporterrole
                      ? <span className={`text-xs font-semibold ${SUP_COLOR[u.supporterrole] ?? ""}`}>{u.supporterrole}</span>
                      : <span className="text-xs text-muted-foreground/30">—</span>
                    }
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground/60 hidden lg:table-cell">
                    {fmt(u.createdat)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end">
                      <button
                        onClick={() => handleBan(u)}
                        disabled={acting === u.id}
                        title={u.isbanned ? "Unban user" : "Ban user"}
                        className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors disabled:opacity-40 ${
                          u.isbanned
                            ? "text-green-400 hover:bg-green-500/10"
                            : "text-muted-foreground/60 hover:bg-destructive/10 hover:text-destructive"
                        }`}
                      >
                        {acting === u.id
                          ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          : <Ban className="h-3.5 w-3.5" />
                        }
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
