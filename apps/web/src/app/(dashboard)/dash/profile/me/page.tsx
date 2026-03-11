"use client";
export const dynamic = "force-dynamic";

import { useEffect, useState, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Save, Loader2, CheckCircle2, AlertCircle, X, LogOut,
  User, AtSign, FileText, Globe, Lock, Camera, Link as LinkIcon,
  Shield, Sparkles, Eye, RefreshCw, Pencil, Calendar,
} from "lucide-react";
import { Instagram, Twitter, Youtube } from "lucide-react";
import { useRouter } from "next/navigation";
import { DiscordIcon } from "@/components/icons/custom-icons";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

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

// ─── Color-coded meta (Instruksi Riu)
// Kuning (Yellow) = Role badge
// Hijau Muda (Light Green) = Supporter badge (Donatur/VIP/VVIP)
// Hijau Tua (Dark Green) = Join date text
// Merah (Red) = Sosial media icons
// Putih (White) = Edit Profile button

const ROLE_META: Record<string, { label: string; cls: string; glow: string }> = {
  OWNER:   { label: "Owner",   cls: "text-yellow-300  bg-yellow-400/15  border-yellow-400/40",  glow: "shadow-yellow-500/10" },
  MANAGER: { label: "Manager", cls: "text-yellow-200  bg-yellow-300/10  border-yellow-300/30",  glow: "shadow-yellow-400/8"  },
  ADMIN:   { label: "Admin",   cls: "text-yellow-100  bg-yellow-200/10  border-yellow-200/25",  glow: "shadow-yellow-300/5"  },
  AGENSI:  { label: "Agensi",  cls: "text-yellow-400  bg-yellow-500/10  border-yellow-500/25",  glow: ""                    },
  KREATOR: { label: "Kreator", cls: "text-yellow-300  bg-yellow-400/10  border-yellow-400/20",  glow: ""                    },
  USER:    { label: "Member",  cls: "text-yellow-200/70 bg-yellow-400/8 border-yellow-400/15",  glow: ""                    },
};

// Hijau Muda untuk Supporter
const SUPPORT_META: Record<string, { label: string; cls: string }> = {
  VVIP:    { label: "✨ VVIP",    cls: "text-green-300 bg-green-400/15 border-green-400/40" },
  VIP:     { label: "💚 VIP",     cls: "text-green-300 bg-green-400/12 border-green-400/30" },
  DONATUR: { label: "💚 Donatur", cls: "text-green-400 bg-green-500/10 border-green-500/25" },
};

const SOCIAL_FIELDS = [
  { key: "discord",   label: "Discord",     placeholder: "username",           Icon: DiscordIcon },
  { key: "instagram", label: "Instagram",   placeholder: "@username",           Icon: Instagram   },
  { key: "x",         label: "X / Twitter", placeholder: "@username",           Icon: Twitter     },
  { key: "youtube",   label: "YouTube",     placeholder: "channel URL",         Icon: Youtube     },
  { key: "website",   label: "Website",     placeholder: "https://yoursite.id", Icon: Globe       },
] as const;

// ─── Toast ────────────────────────────────────────────────────────────────────

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

// ─── Section Card ─────────────────────────────────────────────────────────────

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

// ─── Field ────────────────────────────────────────────────────────────────────

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
      "transition-all duration-150",
      className
    )} {...props} />
  );
}

// ─── Profile Error ────────────────────────────────────────────────────────────

function ProfileError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center gap-4 py-20 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/10 border border-destructive/20">
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

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function Skeleton() {
  return (
    <div className="space-y-5 pb-10 animate-pulse">
      <div className="glass-card h-64 rounded-2xl bg-muted/10" />
      <div className="grid gap-5 lg:grid-cols-2">
        <div className="glass-card h-80 rounded-2xl bg-muted/10" />
        <div className="glass-card h-80 rounded-2xl bg-muted/10" />
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

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
  const [username,    setUsername]    = useState("");
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
      setUsername(p.username ?? "");
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

  useEffect(() => {
    if (!mountRef.current) { mountRef.current = false; return; }
    if (!loading) setDirty(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [displayname, username, bio, avatarurl, coverurl, isprivate, socials]);

  useEffect(() => { if (!loading) mountRef.current = true; }, [loading]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res  = await fetch("/api/profile", {
        method:  "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username || undefined, displayname: displayname || undefined, bio: bio || undefined, avatarurl: avatarurl || undefined, coverurl: coverurl || undefined, isprivate, sociallinks: socials }),
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

  // Sosial media yang sudah diisi
  const filledSocials = SOCIAL_FIELDS.filter(f => socials[f.key]);

  return (
    <>
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      <div className="space-y-5 pb-10">

        {/* ── Page header ── */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-xl font-bold tracking-tight">Profil Saya</h1>
            <p className="mt-0.5 text-xs text-muted-foreground/50">Kelola tampilan dan informasi akun</p>
          </div>
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

        {/* ═══════════════════════════════════════════════════════
            IDENTITY CARD — Redesign sesuai instruksi Riu
            ═══════════════════════════════════════════════════════ */}
        <div className={cn("glass-card rounded-3xl overflow-hidden shadow-2xl relative", roleMeta.glow)}>

          {/* Cover / Background */}
          <div className="relative h-32 sm:h-40 overflow-hidden bg-gradient-to-br from-primary/20 via-primary/8 to-accent/15">
            {coverurl ? (
              <Image src={coverurl} alt="" fill className="object-cover" onError={() => setCoverurl("")} />
            ) : null}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/60" />

            {/* PUTIH: Edit Profile button — top right */}
            {profile.username && (
              <Link href={`/profile/${profile.username}`}
                className="absolute right-3 top-3 flex items-center gap-1.5 rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-[11px] font-semibold text-white/80 backdrop-blur-sm transition-all hover:bg-white/20 hover:text-white">
                <Eye className="h-3 w-3" /> Lihat Profil
              </Link>
            )}
          </div>

          {/* Body */}
          <div className="px-5 pb-5 sm:px-6">
            {/* Avatar row + badges */}
            <div className="-mt-10 flex items-end justify-between mb-5">
              {/* Avatar */}
              <div className="relative h-20 w-20 rounded-2xl border-[3px] border-background overflow-hidden bg-card/80 shadow-xl flex items-center justify-center">
                {avatarurl ? (
                  <Image src={avatarurl} alt={displayName} fill className="object-cover" onError={() => setAvatarurl("")} />
                ) : (
                  <span className="text-2xl font-black text-primary/60">{initial}</span>
                )}
              </div>

              {/* Badges — kanan atas */}
              <div className="flex flex-col items-end gap-1.5 pb-1">
                {/* KUNING: Role badge */}
                <span className={cn(
                  "inline-flex items-center rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-widest",
                  roleMeta.cls
                )}>
                  {profile.role === "OWNER" && <span className="mr-1">👑</span>}
                  {roleMeta.label}
                </span>
                {/* HIJAU MUDA: Supporter badge */}
                {supportMeta && (
                  <span className={cn("inline-flex items-center rounded-full border px-3 py-1 text-[10px] font-black", supportMeta.cls)}>
                    {supportMeta.label}
                  </span>
                )}
                {isprivate && (
                  <span className="flex items-center gap-1 rounded-full border border-border/40 bg-muted/20 px-2.5 py-1 text-[10px] font-medium text-muted-foreground/60">
                    <Lock className="h-2.5 w-2.5" /> Privat
                  </span>
                )}
              </div>
            </div>

            {/* Display name + username */}
            <div className="mb-3">
              <p className="text-xl font-black tracking-tight leading-none">{displayName}</p>
              <p className="mt-1 text-xs text-muted-foreground/50">@{profile.username ?? "—"}</p>
            </div>

            {/* Bio block — menyatu dengan profil */}
            <div className="rounded-2xl border border-border/40 bg-card/30 px-4 py-3.5 space-y-2">
              {bio ? (
                <p className="text-sm text-foreground/80 leading-relaxed">{bio}</p>
              ) : (
                <p className="text-sm italic text-muted-foreground/35">Belum ada bio. Tulis sesuatu tentang dirimu!</p>
              )}
              {/* HIJAU TUA: Join date — di bawah bio, sedikit redup */}
              <p className="flex items-center gap-1.5 text-[11px] text-green-600/50 dark:text-green-400/40 font-medium">
                <Calendar className="h-3 w-3 flex-shrink-0" />
                <span>Bergabung sejak {joinDate}</span>
              </p>
            </div>

            {/* MERAH: Sosial media icons — di bawah bio block */}
            {filledSocials.length > 0 && (
              <div className="mt-3.5 flex flex-wrap gap-2">
                {filledSocials.map(({ key, Icon }) => (
                  <a key={key}
                    href={
                      key === "website" ? socials[key]
                      : key === "youtube" ? socials[key]
                      : key === "discord" ? `https://discord.com/users/${socials[key]}`
                      : `https://${key === "x" ? "x.com" : `${key}.com`}/${socials[key].replace("@","")}`
                    }
                    target="_blank" rel="noopener noreferrer"
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-red-500/25 bg-red-500/10 text-red-400 transition-all hover:bg-red-500/20 hover:text-red-300 hover:-translate-y-0.5">
                    <Icon className="h-3.5 w-3.5" />
                  </a>
                ))}
              </div>
            )}

            {/* PUTIH: Edit Profile button — di bawah, aksi langsung */}
            <div className="mt-4 flex items-center gap-2 flex-wrap">
              <Link href={profile.username ? `/profile/${profile.username}` : "#"}
                className="flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/8 px-4 py-2 text-xs font-semibold text-white/70 backdrop-blur-sm transition-all hover:bg-white/15 hover:text-white">
                <Pencil className="h-3.5 w-3.5" /> Edit Profil
              </Link>
              {isStaff && (
                <Link href="/dash/admin"
                  className="flex items-center gap-1.5 rounded-xl border border-primary/30 bg-primary/8 px-4 py-2 text-xs font-semibold text-primary hover:bg-primary/15 transition-all">
                  <Shield className="h-3.5 w-3.5" /> Admin Panel
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* ── Edit Form Grid ── */}
        <div className="grid gap-5 lg:grid-cols-2">

          {/* Kiri — Info Dasar */}
          <SectionCard title="Info Dasar" icon={User}>
            <Field label="Nama Tampilan" icon={Sparkles}>
              <Input value={displayname} onChange={e => { setDisplayname(e.target.value); setDirty(true); }} placeholder="Nama yang tampil ke orang lain" maxLength={50} />
            </Field>

            <Field label="Username" icon={AtSign} hint="3–30 karakter. Huruf kecil, angka, underscore.">
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs text-muted-foreground/30 select-none">@</span>
                <Input value={username} onChange={e => { setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, "")); setDirty(true); }} placeholder="username_kamu" maxLength={30} className="pl-7" />
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
                { label: "Role",      value: roleMeta.label,     color: "text-yellow-300/80" },
                { label: "Supporter", value: supportMeta?.label, color: "text-green-400/80"  },
                { label: "Bergabung", value: joinDate,           color: "text-green-500/50"  },
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

        {/* ── Admin shortcut (staff only) ── */}
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

        {/* ── Bottom Actions ── */}
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
