"use client";
export const dynamic = "force-dynamic";

import { useEffect, useState, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Save, Loader2, CheckCircle2, AlertCircle, X, LogOut,
  User, AtSign, FileText, Globe, Lock, Camera, Link as LinkIcon,
  Shield, Sparkles, Eye, ExternalLink, RefreshCw, Plus,
} from "lucide-react";
import { Instagram, Twitter, Youtube } from "lucide-react";
import { useRouter } from "next/navigation";
import { DiscordIcon } from "@/components/icons/custom-icons";
import { cn } from "@/lib/utils";

interface Profile {
  id: string;
  username: string | null;
  displayname: string | null;
  avatarurl: string | null;
  coverurl: string | null;
  bio: string | null;
  role: string;
  supporterrole: string | null;
  sociallinks: Record<string, string>;
  isprivate: boolean;
  createdat: string;
}

const ROLE_META: Record<string, { label: string; cls: string; glow: string }> = {
  OWNER:   { label: "Owner",   cls: "text-yellow-300 bg-yellow-400/10 border-yellow-400/30", glow: "shadow-yellow-500/10" },
  MANAGER: { label: "Manager", cls: "text-violet-300 bg-violet-500/10 border-violet-500/30", glow: "shadow-violet-500/10" },
  ADMIN:   { label: "Admin",   cls: "text-primary   bg-primary/10     border-primary/30",    glow: "shadow-primary/10"   },
  AGENSI:  { label: "Agensi",  cls: "text-green-300 bg-green-500/10   border-green-500/30",  glow: ""                   },
  KREATOR: { label: "Kreator", cls: "text-accent    bg-accent/10      border-accent/30",     glow: ""                   },
  USER:    { label: "Member",  cls: "text-muted-foreground bg-muted/50 border-border/40",    glow: ""                   },
};

const SUPPORT_META: Record<string, { label: string; cls: string }> = {
  VVIP:    { label: "✨ VVIP",    cls: "text-yellow-300 bg-yellow-400/10 border-yellow-400/30" },
  VIP:     { label: "💜 VIP",     cls: "text-violet-300 bg-violet-500/10 border-violet-500/30" },
  DONATUR: { label: "💙 Donatur", cls: "text-blue-300   bg-blue-500/10   border-blue-500/30"   },
};

const SOCIAL_FIELDS = [
  { key: "discord",   label: "Discord",     placeholder: "username",            Icon: DiscordIcon },
  { key: "instagram", label: "Instagram",   placeholder: "@username",            Icon: Instagram   },
  { key: "x",         label: "X / Twitter", placeholder: "@username",            Icon: Twitter     },
  { key: "youtube",   label: "YouTube",     placeholder: "channel URL",          Icon: Youtube     },
  { key: "website",   label: "Website",     placeholder: "https://yoursite.id",  Icon: Globe       },
] as const;

// ── Toast ──────────────────────────────────────────────────────────────────────
function Toast({ msg, type, onClose }: { msg: string; type: "ok" | "err"; onClose: () => void }) {
  return (
    <div className={cn(
      "fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl border px-5 py-3.5 max-w-sm",
      "shadow-2xl text-sm font-medium backdrop-blur-xl",
      "animate-in slide-in-from-bottom-3 fade-in duration-200",
      type === "ok"
        ? "border-green-500/30 bg-card/95 text-green-400"
        : "border-destructive/30 bg-card/95 text-destructive"
    )}>
      {type === "ok" ? <CheckCircle2 className="h-4 w-4 flex-shrink-0" /> : <AlertCircle className="h-4 w-4 flex-shrink-0" />}
      <span className="flex-1">{msg}</span>
      <button onClick={onClose} className="opacity-40 hover:opacity-80 transition-opacity"><X className="h-3.5 w-3.5" /></button>
    </div>
  );
}

// ── Section Card ───────────────────────────────────────────────────────────────
function SectionCard({ title, icon: Icon, children, className }: {
  title: string; icon: React.ElementType; children: React.ReactNode; className?: string;
}) {
  return (
    <div className={cn("glass-card rounded-2xl p-6 space-y-5", className)}>
      <div className="flex items-center gap-2 pb-4 border-b border-border/40">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="h-3.5 w-3.5" />
        </div>
        <h2 className="text-xs font-bold uppercase tracking-widest text-foreground/60">{title}</h2>
      </div>
      {children}
    </div>
  );
}

// ── Field + Input ──────────────────────────────────────────────────────────────
function Field({ label, icon: Icon, hint, children }: {
  label: string; icon: React.ElementType; hint?: string; children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/50">
        <Icon className="h-3 w-3" />{label}
      </label>
      {children}
      {hint && <p className="text-[11px] text-muted-foreground/35 leading-relaxed">{hint}</p>}
    </div>
  );
}

function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input className={cn(
      "w-full rounded-xl border border-border/60 bg-card/40 px-4 py-2.5 text-sm",
      "outline-none placeholder:text-muted-foreground/25",
      "focus:border-primary/40 focus:bg-card/60 focus:ring-2 focus:ring-primary/10",
      "disabled:opacity-40 disabled:cursor-not-allowed disabled:bg-muted/20",
      "transition-all duration-150", className,
    )} {...props} />
  );
}

// ── Loading Skeleton ───────────────────────────────────────────────────────────
function Skeleton() {
  return (
    <div className="space-y-5 animate-pulse pb-8">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="h-6 w-32 rounded-lg bg-muted/30" />
          <div className="h-3 w-48 rounded bg-muted/20" />
        </div>
        <div className="flex gap-2">
          <div className="h-8 w-28 rounded-xl bg-muted/20" />
          <div className="h-8 w-20 rounded-xl bg-muted/30" />
        </div>
      </div>
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-muted/20 to-muted/10" />
        <div className="p-5 space-y-3">
          <div className="-mt-8 flex gap-4 items-end">
            <div className="h-16 w-16 rounded-2xl bg-muted/30 border-[3px] border-background flex-shrink-0" />
            <div className="space-y-1.5 pb-1">
              <div className="h-4 w-36 rounded bg-muted/30" />
              <div className="h-3 w-24 rounded bg-muted/20" />
            </div>
          </div>
        </div>
      </div>
      <div className="grid gap-5 lg:grid-cols-2">
        <div className="h-80 glass-card rounded-2xl" />
        <div className="h-80 glass-card rounded-2xl" />
      </div>
    </div>
  );
}

// ── Error State ────────────────────────────────────────────────────────────────
function ProfileError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center gap-5 py-32 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10 border border-destructive/20">
        <AlertCircle className="h-7 w-7 text-destructive/50" />
      </div>
      <div>
        <p className="text-sm font-semibold text-foreground/70">Gagal memuat profil</p>
        <p className="mt-1 text-xs text-muted-foreground/50">Terjadi kesalahan saat mengambil data. Coba refresh atau login ulang.</p>
      </div>
      <div className="flex items-center gap-2">
        <button onClick={onRetry}
          className="flex items-center gap-1.5 rounded-xl border border-border px-4 py-2 text-xs font-medium text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all">
          <RefreshCw className="h-3.5 w-3.5" /> Coba Lagi
        </button>
        <Link href="/login"
          className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white hover:bg-primary/90 transition-all">
          Login Ulang
        </Link>
      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────────
export default function ProfilePage() {
  const router   = useRouter();
  const toastRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mountRef = useRef(false);

  const [profile,  setProfile]  = useState<Profile | null>(null);
  const [loading,  setLoading]  = useState(true);
  const [hasError, setHasError] = useState(false);
  const [saving,   setSaving]   = useState(false);
  const [dirty,    setDirty]    = useState(false);
  const [toast,    setToast]    = useState<{ msg: string; type: "ok" | "err" } | null>(null);

  const [displayname, setDisplayname] = useState("");
  const [bio,         setBio]         = useState("");
  const [avatarurl,   setAvatarurl]   = useState("");
  const [coverurl,    setCoverurl]    = useState("");
  const [isprivate,   setIsprivate]   = useState(false);
  const [socials,     setSocials]     = useState<Record<string, string>>({});

  const showToast = useCallback((msg: string, type: "ok" | "err") => {
    if (toastRef.current) clearTimeout(toastRef.current);
    setToast({ msg, type });
    toastRef.current = setTimeout(() => setToast(null), 4000);
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    setHasError(false);
    try {
      const r = await fetch("/api/profile", { cache: "no-store" });
      if (r.status === 401) { router.push("/login"); return; }
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const d = await r.json();
      if (!d.data) throw new Error("no data");
      const p: Profile = d.data;
      setProfile(p);
      setDisplayname(p.displayname ?? "");
      setBio(p.bio ?? "");
      setAvatarurl(p.avatarurl ?? "");
      setCoverurl(p.coverurl ?? "");
      setIsprivate(p.isprivate ?? false);
      setSocials(p.sociallinks ?? {});
      setTimeout(() => setDirty(false), 0);
    } catch {
      setHasError(true);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => { load(); }, [load]);

  // Mark dirty setelah initial load selesai
  useEffect(() => {
    if (!mountRef.current) { mountRef.current = false; return; }
    if (!loading) setDirty(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [displayname, bio, avatarurl, coverurl, isprivate, socials]);

  useEffect(() => { if (!loading) mountRef.current = true; }, [loading]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res  = await fetch("/api/profile", {
        method:  "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ displayname: displayname || undefined, bio: bio || undefined, avatarurl: avatarurl || undefined, coverurl: coverurl || undefined, isprivate, sociallinks: socials }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        showToast(data.error?.message ?? "Gagal menyimpan.", "err");
      } else {
        setProfile(prev => prev ? { ...prev, ...data.data } : prev);
        setDirty(false);
        showToast("Profil berhasil disimpan!", "ok");
      }
    } catch {
      showToast("Koneksi gagal. Coba lagi.", "err");
    } finally { setSaving(false); }
  };

  const handleSignout = async () => {
    await fetch("/api/auth/signout", { method: "POST" }).catch(() => {});
    router.push("/");
    router.refresh();
  };

  if (loading) return <Skeleton />;
  if (hasError || !profile) return <ProfileError onRetry={load} />;

  const roleMeta    = ROLE_META[profile.role] ?? ROLE_META.USER;
  const supportMeta = profile.supporterrole ? SUPPORT_META[profile.supporterrole] : null;
  const isStaff     = ["OWNER","MANAGER","ADMIN"].includes(profile.role);
  const displayName = displayname || profile.username || "Pengguna";
  const initial     = displayName.charAt(0).toUpperCase();
  const joinDate    = new Date(profile.createdat).toLocaleDateString("id-ID", { month: "long", year: "numeric" });

  return (
    <>
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      <div className="space-y-5 pb-10">

        {/* ── Header ── */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-xl font-bold tracking-tight">Profil Saya</h1>
            <p className="mt-0.5 text-xs text-muted-foreground/50">Kelola tampilan dan informasi akun</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {profile.username && (
              <Link href={`/profile/${profile.username}`}
                className="flex items-center gap-1.5 rounded-xl border border-border/60 px-3.5 py-2 text-xs font-medium text-muted-foreground hover:border-primary/30 hover:text-foreground transition-all">
                <ExternalLink className="h-3.5 w-3.5" /> Lihat Publik
              </Link>
            )}
            {isStaff && (
              <Link href="/dash/admin"
                className="flex items-center gap-1.5 rounded-xl border border-primary/30 bg-primary/8 px-3.5 py-2 text-xs font-semibold text-primary hover:bg-primary/15 transition-all">
                <Shield className="h-3.5 w-3.5" /> Admin Panel
              </Link>
            )}
            <button onClick={handleSave} disabled={saving || !dirty}
              className={cn(
                "flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition-all",
                dirty && !saving
                  ? "bg-primary text-white shadow-lg shadow-primary/20 hover:-translate-y-0.5"
                  : "bg-muted/30 text-muted-foreground/30 cursor-not-allowed"
              )}>
              {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
              {saving ? "Menyimpan…" : "Simpan"}
            </button>
          </div>
        </div>

        {/* ── Identity Card ── */}
        <div className={cn("glass-card rounded-2xl overflow-hidden shadow-xl", roleMeta.glow)}>
          {/* Cover */}
          <div className="relative h-28 sm:h-36 overflow-hidden bg-gradient-to-br from-primary/15 via-primary/5 to-accent/10">
            {coverurl && (
              <Image src={coverurl} alt="" fill className="object-cover" onError={() => setCoverurl("")} />
            )}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/30" />
            {profile.role === "OWNER" && (
              <div className="absolute top-3 right-3 flex items-center gap-1.5 rounded-xl bg-yellow-400/15 border border-yellow-400/30 px-2.5 py-1 text-[10px] font-black text-yellow-300 backdrop-blur-sm">
                👑 OWNER
              </div>
            )}
          </div>

          <div className="px-5 pb-5">
            <div className="-mt-8 flex items-end justify-between mb-4">
              {/* Avatar */}
              <div className="relative h-16 w-16 rounded-2xl border-[3px] border-background overflow-hidden bg-card/80 shadow-lg flex items-center justify-center">
                {avatarurl ? (
                  <Image src={avatarurl} alt={displayName} fill className="object-cover" onError={() => setAvatarurl("")} />
                ) : (
                  <span className="text-xl font-black text-primary/60">{initial}</span>
                )}
              </div>
              {/* Badges */}
              <div className="flex items-center gap-1.5 flex-wrap justify-end pb-1">
                <span className={cn("rounded-lg border px-2 py-0.5 text-[10px] font-black uppercase tracking-wider", roleMeta.cls)}>
                  {roleMeta.label}
                </span>
                {supportMeta && (
                  <span className={cn("rounded-lg border px-2 py-0.5 text-[10px] font-black", supportMeta.cls)}>
                    {supportMeta.label}
                  </span>
                )}
                {isprivate && (
                  <span className="flex items-center gap-1 rounded-lg border border-border/40 bg-muted/20 px-2 py-0.5 text-[10px] font-medium text-muted-foreground/60">
                    <Lock className="h-2.5 w-2.5" /> Privat
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-base font-bold truncate">{displayName}</p>
                <p className="text-xs text-muted-foreground/50 mt-0.5">@{profile.username ?? "—"}</p>
                {bio && <p className="mt-2 text-xs text-muted-foreground/60 leading-relaxed line-clamp-2 max-w-sm">{bio}</p>}
              </div>
              <p className="flex-shrink-0 text-[10px] text-muted-foreground/35 mt-0.5">Sejak {joinDate}</p>
            </div>
          </div>
        </div>

        {/* ── Grid ── */}
        <div className="grid gap-5 lg:grid-cols-2">

          {/* Kiri — Info Dasar */}
          <SectionCard title="Info Dasar" icon={User}>
            <Field label="Nama Tampilan" icon={Sparkles}>
              <Input value={displayname} onChange={e => { setDisplayname(e.target.value); setDirty(true); }} placeholder="Nama yang tampil ke orang lain" maxLength={50} />
            </Field>

            <Field label="Username" icon={AtSign} hint="Username tidak bisa diubah sendiri. Hubungi admin.">
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs text-muted-foreground/30 select-none">@</span>
                <Input value={profile.username ?? ""} disabled className="pl-7" />
              </div>
            </Field>

            <Field label="Bio" icon={FileText}>
              <div className="relative">
                <textarea
                  value={bio}
                  onChange={e => { setBio(e.target.value); setDirty(true); }}
                  rows={3} maxLength={300}
                  placeholder="Ceritakan sedikit tentang dirimu…"
                  className="w-full resize-none rounded-xl border border-border/60 bg-card/40 px-4 py-2.5 text-sm outline-none placeholder:text-muted-foreground/25 focus:border-primary/40 focus:bg-card/60 focus:ring-2 focus:ring-primary/10 transition-all duration-150"
                />
                <span className="absolute bottom-2.5 right-3 text-[10px] text-muted-foreground/25 tabular-nums">{bio.length}/300</span>
              </div>
            </Field>

            {/* Privacy toggle */}
            <button type="button" onClick={() => { setIsprivate(p => !p); setDirty(true); }}
              className={cn(
                "flex items-center justify-between w-full rounded-xl border px-4 py-3 text-left transition-all",
                isprivate ? "border-primary/25 bg-primary/5" : "border-border/40 bg-card/20 hover:border-border/70"
              )}>
              <div className="flex items-center gap-3">
                <div className={cn("flex h-7 w-7 items-center justify-center rounded-lg transition-colors",
                  isprivate ? "bg-primary/15 text-primary" : "bg-muted/40 text-muted-foreground/40")}>
                  {isprivate ? <Lock className="h-3.5 w-3.5" /> : <Globe className="h-3.5 w-3.5" />}
                </div>
                <div>
                  <p className="text-sm font-medium">{isprivate ? "Profil Privat" : "Profil Publik"}</p>
                  <p className="text-[11px] text-muted-foreground/40 mt-0.5">
                    {isprivate ? "Hanya kamu yang bisa lihat detail" : "Semua orang bisa melihat profilmu"}
                  </p>
                </div>
              </div>
              <div className={cn("relative flex h-5 w-9 items-center rounded-full transition-colors flex-shrink-0",
                isprivate ? "bg-primary" : "bg-muted/50")}>
                <span className={cn("absolute h-3.5 w-3.5 rounded-full bg-white shadow transition-transform duration-200",
                  isprivate ? "translate-x-[18px]" : "translate-x-[3px]")} />
              </div>
            </button>
          </SectionCard>

          {/* Kanan — Foto & Media */}
          <SectionCard title="Foto & Media" icon={Camera}>
            <Field label="Avatar" icon={User} hint="URL gambar publik (jpg/png/webp). Rasio 1:1.">
              <div className="flex gap-2.5">
                <div className="h-10 w-10 flex-shrink-0 rounded-xl overflow-hidden border border-border/40 bg-muted/20 flex items-center justify-center">
                  {avatarurl ? (
                    <Image src={avatarurl} alt="" width={40} height={40} className="h-full w-full object-cover" onError={() => setAvatarurl("")} />
                  ) : (
                    <User className="h-4 w-4 text-muted-foreground/20" />
                  )}
                </div>
                <div className="flex flex-1 gap-1.5">
                  <Input type="url" value={avatarurl} onChange={e => { setAvatarurl(e.target.value); setDirty(true); }} placeholder="https://cdn.example.com/avatar.jpg" className="flex-1" />
                  {avatarurl && (
                    <button type="button" onClick={() => { setAvatarurl(""); setDirty(true); }}
                      className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-border/40 text-muted-foreground/40 hover:border-destructive/30 hover:text-destructive transition-colors">
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </Field>

            <Field label="Cover / Banner" icon={Camera} hint="Saran: 1280×360px, rasio 16:9.">
              <Input type="url" value={coverurl} onChange={e => { setCoverurl(e.target.value); setDirty(true); }} placeholder="https://cdn.example.com/cover.jpg" />
              {coverurl && (
                <div className="relative mt-2 h-20 overflow-hidden rounded-xl border border-border/40 bg-muted/10">
                  <Image src={coverurl} alt="preview" fill className="object-cover" onError={() => setCoverurl("")} />
                  <button type="button" onClick={() => { setCoverurl(""); setDirty(true); }}
                    className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-lg bg-background/80 text-muted-foreground hover:text-destructive transition-colors backdrop-blur-sm">
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}
            </Field>

            {/* Account info tiles */}
            <div className="rounded-xl border border-border/30 bg-card/20 divide-y divide-border/20 overflow-hidden">
              {[
                { label: "Role",      value: roleMeta.label,     color: roleMeta.cls.split(" ")[0] },
                { label: "Supporter", value: supportMeta?.label, color: supportMeta?.cls.split(" ")[0] },
                { label: "Bergabung", value: joinDate,           color: "text-muted-foreground/60" },
              ].filter(r => r.value).map(row => (
                <div key={row.label} className="flex items-center justify-between px-4 py-2.5">
                  <span className="text-xs text-muted-foreground/40">{row.label}</span>
                  <span className={cn("text-xs font-semibold", row.color)}>{row.value}</span>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>

        {/* ── Sosial Media ── */}
        <SectionCard title="Sosial Media" icon={LinkIcon}>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SOCIAL_FIELDS.map(({ key, label, placeholder, Icon }) => (
              <Field key={key} label={label} icon={Icon}>
                <div className="relative flex items-center">
                  <Input
                    value={socials[key] ?? ""}
                    onChange={e => { setSocials(prev => ({ ...prev, [key]: e.target.value })); setDirty(true); }}
                    placeholder={placeholder}
                    className="pr-9"
                  />
                  {socials[key] && (
                    <button type="button"
                      onClick={() => { setSocials(prev => { const n = {...prev}; delete n[key]; return n; }); setDirty(true); }}
                      className="absolute right-3 text-muted-foreground/30 hover:text-muted-foreground/70 transition-colors">
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </Field>
            ))}
          </div>
        </SectionCard>

        {/* ── Admin Panel Shortcut (staff only) ── */}
        {isStaff && (
          <div className="glass-card rounded-2xl p-5 border-primary/15 bg-primary/3">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 border border-primary/20">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-bold">Panel Admin</p>
                  <p className="text-xs text-muted-foreground/50">Kelola blog, event, galeri, dan pengguna platform</p>
                </div>
              </div>
              <Link href="/dash/admin"
                className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-white hover:bg-primary/90 hover:-translate-y-0.5 transition-all shadow-lg shadow-primary/20">
                <Shield className="h-3.5 w-3.5" /> Buka Admin Panel
              </Link>
            </div>
          </div>
        )}

        {/* ── Actions Bar ── */}
        <div className="flex items-center justify-between gap-3 flex-wrap pt-1">
          <button onClick={handleSignout}
            className="flex items-center gap-1.5 rounded-xl border border-border/40 px-4 py-2.5 text-xs font-medium text-muted-foreground/60 hover:border-destructive/30 hover:text-destructive transition-all">
            <LogOut className="h-3.5 w-3.5" /> Keluar dari akun
          </button>
          <div className="flex items-center gap-2">
            {profile.username && (
              <Link href={`/profile/${profile.username}`}
                className="flex items-center gap-1.5 rounded-xl border border-border/60 px-4 py-2.5 text-xs font-medium text-muted-foreground hover:border-primary/30 hover:text-foreground transition-all">
                <Eye className="h-3.5 w-3.5" /> Lihat Profil
              </Link>
            )}
            <button onClick={handleSave} disabled={saving || !dirty}
              className={cn(
                "flex items-center gap-1.5 rounded-xl px-5 py-2.5 text-xs font-bold transition-all",
                dirty && !saving
                  ? "bg-primary text-white shadow-lg shadow-primary/20 hover:-translate-y-0.5"
                  : "bg-muted/30 text-muted-foreground/30 cursor-not-allowed"
              )}>
              {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
              {saving ? "Menyimpan…" : "Simpan Perubahan"}
            </button>
          </div>
        </div>

      </div>
    </>
  );
}
