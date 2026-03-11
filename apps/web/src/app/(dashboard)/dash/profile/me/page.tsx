"use client";
export const dynamic = "force-dynamic";

import { useEffect, useState, useRef, useCallback } from "react";
import Image from "next/image";
import {
  Save, Camera, Pencil, Globe, Lock, Loader2, CheckCircle2,
  AlertCircle, Instagram, Twitter, Youtube, X, Link,
  User, AtSign, FileText, Eye, EyeOff, ShieldCheck,
  Sparkles, LogOut, ExternalLink,
} from "lucide-react";
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

// ─── Constants ────────────────────────────────────────────────────────────────
const ROLE_META: Record<string, { label: string; cls: string }> = {
  OWNER:   { label: "Owner",   cls: "text-yellow-300 bg-yellow-400/10 border-yellow-400/20" },
  MANAGER: { label: "Manager", cls: "text-violet-300 bg-violet-500/10 border-violet-500/20" },
  ADMIN:   { label: "Admin",   cls: "text-primary   bg-primary/10     border-primary/20"    },
  AGENSI:  { label: "Agensi",  cls: "text-green-300 bg-green-500/10   border-green-500/20"  },
  KREATOR: { label: "Kreator", cls: "text-accent    bg-accent/10      border-accent/20"     },
  USER:    { label: "Member",  cls: "text-muted-foreground bg-muted/60 border-border/40"    },
};
const SUPPORT_META: Record<string, { label: string; cls: string }> = {
  VVIP:    { label: "VVIP",    cls: "text-yellow-300 bg-yellow-400/10" },
  VIP:     { label: "VIP",     cls: "text-violet-300 bg-violet-500/10" },
  DONATUR: { label: "Donatur", cls: "text-blue-300   bg-blue-500/10"   },
};
const SOCIAL_FIELDS = [
  { key: "discord",   label: "Discord",    placeholder: "username",          Icon: DiscordIcon  },
  { key: "instagram", label: "Instagram",  placeholder: "@username",          Icon: Instagram    },
  { key: "x",         label: "X / Twitter",placeholder: "@username",          Icon: Twitter      },
  { key: "youtube",   label: "YouTube",    placeholder: "channel URL",        Icon: Youtube      },
  { key: "website",   label: "Website",    placeholder: "https://yoursite.id",Icon: Globe        },
] as const;

// ─── Toast ────────────────────────────────────────────────────────────────────
function Toast({ msg, type, onClose }: { msg: string; type: "ok" | "err"; onClose: () => void }) {
  return (
    <div className={cn(
      "fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl border px-5 py-3.5",
      "shadow-2xl text-sm font-medium backdrop-blur-xl",
      "animate-in slide-in-from-bottom-3 fade-in duration-200",
      type === "ok"
        ? "border-green-500/20 bg-green-500/10 text-green-400 shadow-green-500/10"
        : "border-destructive/20 bg-destructive/10 text-destructive shadow-destructive/10"
    )}>
      {type === "ok"
        ? <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
        : <AlertCircle   className="h-4 w-4 flex-shrink-0" />}
      <span>{msg}</span>
      <button onClick={onClose} className="ml-1 opacity-50 hover:opacity-100 transition-opacity">
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

// ─── Input Field ──────────────────────────────────────────────────────────────
function Field({
  label, icon: Icon, children, hint,
}: {
  label: string;
  icon: React.ElementType;
  children: React.ReactNode;
  hint?: string;
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
    <input
      className={cn(
        "w-full rounded-xl border border-border/60 bg-card/40 px-4 py-2.5 text-sm",
        "outline-none placeholder:text-muted-foreground/25",
        "focus:border-primary/40 focus:bg-card/60 focus:ring-2 focus:ring-primary/10",
        "disabled:cursor-not-allowed disabled:opacity-40 disabled:bg-muted/20",
        "transition-all duration-150",
        className
      )}
      {...props}
    />
  );
}

// ─── Section Card ─────────────────────────────────────────────────────────────
function Section({
  title, icon: Icon, children, className,
}: {
  title: string; icon: React.ElementType; children: React.ReactNode; className?: string;
}) {
  return (
    <div className={cn("glass-card rounded-2xl p-6 space-y-5", className)}>
      <div className="flex items-center gap-2.5 pb-1 border-b border-border/40">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="h-3.5 w-3.5" />
        </div>
        <h2 className="text-xs font-bold uppercase tracking-widest text-foreground/70">{title}</h2>
      </div>
      {children}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ProfilePage() {
  const router  = useRouter();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [profile,  setProfile]  = useState<Profile | null>(null);
  const [loading,  setLoading]  = useState(true);
  const [saving,   setSaving]   = useState(false);
  const [dirty,    setDirty]    = useState(false);
  const [toast,    setToast]    = useState<{ msg: string; type: "ok" | "err" } | null>(null);
  const [previewCover, setPreviewCover] = useState(false);

  // Form fields
  const [displayname, setDisplayname] = useState("");
  const [bio,         setBio]         = useState("");
  const [avatarurl,   setAvatarurl]   = useState("");
  const [coverurl,    setCoverurl]    = useState("");
  const [isprivate,   setIsprivate]   = useState(false);
  const [socials,     setSocials]     = useState<Record<string, string>>({});

  const showToast = useCallback((msg: string, type: "ok" | "err") => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setToast({ msg, type });
    timerRef.current = setTimeout(() => setToast(null), 4000);
  }, []);

  // Fetch
  useEffect(() => {
    fetch("/api/profile")
      .then(r => r.json())
      .then(d => {
        if (d.data) {
          const p: Profile = d.data;
          setProfile(p);
          setDisplayname(p.displayname ?? "");
          setBio(p.bio ?? "");
          setAvatarurl(p.avatarurl ?? "");
          setCoverurl(p.coverurl ?? "");
          setIsprivate(p.isprivate);
          setSocials(p.sociallinks ?? {});
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Track dirty state
  useEffect(() => { setDirty(true); }, [displayname, bio, avatarurl, coverurl, isprivate, socials]);
  useEffect(() => { setDirty(false); }, [profile]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res  = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          displayname: displayname || undefined,
          bio:         bio         || undefined,
          avatarurl:   avatarurl   || undefined,
          coverurl:    coverurl    || undefined,
          isprivate,
          sociallinks: socials,
        }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        showToast(data.error ?? "Gagal menyimpan.", "err");
      } else {
        setProfile(prev => prev ? { ...prev, ...data.data } : prev);
        setDirty(false);
        showToast("Profil tersimpan!", "ok");
      }
    } catch {
      showToast("Koneksi gagal. Coba lagi.", "err");
    } finally {
      setSaving(false);
    }
  };

  const handleSignout = async () => {
    await fetch("/api/auth/signout", { method: "POST" }).catch(() => {});
    router.push("/");
    router.refresh();
  };

  const handleViewProfile = () => {
    if (profile?.username) router.push(`/profile/${profile.username}`);
  };

  // ── Loading ──
  if (loading) {
    return (
      <div className="space-y-5 animate-pulse">
        <div className="h-9 w-48 rounded-xl bg-muted/30" />
        <div className="h-56 rounded-2xl bg-muted/20" />
        <div className="grid gap-5 lg:grid-cols-2">
          <div className="h-80 rounded-2xl bg-muted/20" />
          <div className="h-80 rounded-2xl bg-muted/20" />
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex flex-col items-center gap-4 py-24 text-center">
        <AlertCircle className="h-10 w-10 text-destructive/40" />
        <p className="text-sm text-muted-foreground/60">Gagal memuat profil. Pastikan kamu sudah login.</p>
      </div>
    );
  }

  const roleMeta    = ROLE_META[profile.role]    ?? ROLE_META.USER;
  const supportMeta = profile.supporterrole ? SUPPORT_META[profile.supporterrole] : null;
  const displayName = displayname || profile.username || "—";
  const initial     = displayName.charAt(0).toUpperCase();
  const joinDate    = new Date(profile.createdat).toLocaleDateString("id-ID", { month: "long", year: "numeric" });

  return (
    <>
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      <div className="space-y-5 pb-8">

        {/* ── Page Header ─────────────────────────────────────────────────── */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold tracking-tight">Profil</h1>
            <p className="mt-0.5 text-xs text-muted-foreground/50">Kelola tampilan dan informasi akun kamu</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleViewProfile}
              className="flex items-center gap-1.5 rounded-xl border border-border/60 px-3.5 py-2 text-xs font-medium text-muted-foreground hover:border-primary/30 hover:text-foreground transition-all"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Lihat Publik
            </button>
            <button
              onClick={handleSave}
              disabled={saving || !dirty}
              className={cn(
                "flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition-all",
                dirty && !saving
                  ? "bg-primary text-white shadow-lg shadow-primary/20 hover:-translate-y-0.5"
                  : "bg-muted/40 text-muted-foreground/40 cursor-not-allowed"
              )}
            >
              {saving
                ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                : <Save className="h-3.5 w-3.5" />}
              {saving ? "Menyimpan…" : "Simpan"}
            </button>
          </div>
        </div>

        {/* ── Identity Card ───────────────────────────────────────────────── */}
        <div className="glass-card rounded-2xl overflow-hidden">
          {/* Cover strip */}
          <div className="relative h-24 sm:h-32 bg-gradient-to-r from-primary/15 via-primary/8 to-accent/10">
            {coverurl && (
              <Image src={coverurl} alt="" fill className="object-cover" onError={() => setCoverurl("")} />
            )}
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/30" />
          </div>

          <div className="px-5 pb-5">
            <div className="-mt-9 flex items-end justify-between mb-4">
              {/* Avatar */}
              <div className="relative">
                <div className="relative h-[4.5rem] w-[4.5rem] rounded-2xl border-[3px] border-background overflow-hidden bg-card flex items-center justify-center shadow-lg">
                  {avatarurl ? (
                    <Image src={avatarurl} alt={displayName} fill className="object-cover" onError={() => setAvatarurl("")} />
                  ) : (
                    <span className="text-xl font-black text-primary/70">{initial}</span>
                  )}
                </div>
              </div>

              {/* Badges */}
              <div className="flex items-center gap-1.5 pb-1">
                <span className={cn("rounded-lg border px-2 py-0.5 text-[10px] font-black uppercase tracking-wider", roleMeta.cls)}>
                  {roleMeta.label}
                </span>
                {supportMeta && (
                  <span className={cn("rounded-lg px-2 py-0.5 text-[10px] font-black", supportMeta.cls)}>
                    {supportMeta.label}
                  </span>
                )}
                {isprivate && (
                  <span className="rounded-lg border border-border/40 bg-muted/30 px-2 py-0.5 text-[10px] font-semibold text-muted-foreground/60 flex items-center gap-1">
                    <Lock className="h-2.5 w-2.5" />Privat
                  </span>
                )}
              </div>
            </div>

            {/* Name & info */}
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-base font-bold leading-tight truncate">{displayName}</p>
                <p className="text-xs text-muted-foreground/50 mt-0.5">@{profile.username ?? "—"}</p>
                {bio && <p className="mt-2 text-xs text-muted-foreground/60 leading-relaxed line-clamp-2 max-w-sm">{bio}</p>}
              </div>
              <p className="flex-shrink-0 text-[10px] text-muted-foreground/35 mt-0.5">Sejak {joinDate}</p>
            </div>
          </div>
        </div>

        {/* ── Grid ────────────────────────────────────────────────────────── */}
        <div className="grid gap-5 lg:grid-cols-2">

          {/* Kiri — Info Dasar */}
          <Section title="Info Dasar" icon={User}>
            <Field label="Nama Tampilan" icon={Sparkles}>
              <Input
                value={displayname}
                onChange={e => setDisplayname(e.target.value)}
                placeholder="Nama yang tampil ke orang lain"
                maxLength={50}
              />
            </Field>

            <Field label="Username" icon={AtSign} hint="Username tidak bisa diubah setelah daftar.">
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs text-muted-foreground/30 font-medium">@</span>
                <Input
                  value={profile.username ?? ""}
                  disabled
                  className="pl-7"
                />
              </div>
            </Field>

            <Field label="Bio" icon={FileText}>
              <div className="relative">
                <textarea
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  rows={3}
                  maxLength={300}
                  placeholder="Ceritakan sedikit tentang dirimu…"
                  className="w-full resize-none rounded-xl border border-border/60 bg-card/40 px-4 py-2.5 text-sm outline-none placeholder:text-muted-foreground/25 focus:border-primary/40 focus:bg-card/60 focus:ring-2 focus:ring-primary/10 transition-all duration-150"
                />
                <span className="absolute bottom-2.5 right-3 text-[10px] text-muted-foreground/25 tabular-nums">
                  {bio.length}/300
                </span>
              </div>
            </Field>

            {/* Privacy toggle */}
            <button
              type="button"
              onClick={() => setIsprivate(p => !p)}
              className={cn(
                "flex items-center justify-between w-full rounded-xl border px-4 py-3 transition-all text-left",
                isprivate
                  ? "border-primary/20 bg-primary/5"
                  : "border-border/40 bg-card/30 hover:border-border/70"
              )}
            >
              <div className="flex items-center gap-3">
                <div className={cn("flex h-7 w-7 items-center justify-center rounded-lg transition-colors", isprivate ? "bg-primary/15 text-primary" : "bg-muted/40 text-muted-foreground/40")}>
                  {isprivate ? <Lock className="h-3.5 w-3.5" /> : <Globe className="h-3.5 w-3.5" />}
                </div>
                <div>
                  <p className="text-sm font-medium">{isprivate ? "Profil Privat" : "Profil Publik"}</p>
                  <p className="text-[11px] text-muted-foreground/40 mt-0.5">
                    {isprivate ? "Hanya kamu yang bisa lihat detail" : "Semua orang bisa melihat profilmu"}
                  </p>
                </div>
              </div>
              {/* Toggle pill */}
              <div className={cn("relative flex h-5 w-9 items-center rounded-full transition-colors flex-shrink-0", isprivate ? "bg-primary" : "bg-muted/60")}>
                <span className={cn("absolute h-3.5 w-3.5 rounded-full bg-white shadow transition-transform duration-200", isprivate ? "translate-x-[18px]" : "translate-x-[3px]")} />
              </div>
            </button>
          </Section>

          {/* Kanan — Foto */}
          <Section title="Foto & Media" icon={Camera}>
            {/* Avatar URL */}
            <Field label="Avatar" icon={User} hint="Gunakan URL gambar publik (jpg/png/webp).">
              <div className="flex gap-2.5">
                <div className="h-10 w-10 flex-shrink-0 rounded-xl overflow-hidden border border-border/40 bg-muted/20 flex items-center justify-center">
                  {avatarurl ? (
                    <Image src={avatarurl} alt="" width={40} height={40} className="h-full w-full object-cover" onError={() => setAvatarurl("")} />
                  ) : (
                    <User className="h-4 w-4 text-muted-foreground/20" />
                  )}
                </div>
                <div className="flex flex-1 gap-1.5">
                  <Input
                    type="url"
                    value={avatarurl}
                    onChange={e => setAvatarurl(e.target.value)}
                    placeholder="https://cdn.example.com/avatar.jpg"
                    className="flex-1"
                  />
                  {avatarurl && (
                    <button
                      type="button"
                      onClick={() => setAvatarurl("")}
                      className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-border/40 text-muted-foreground/40 hover:border-destructive/30 hover:text-destructive transition-colors"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </Field>

            {/* Cover URL */}
            <Field label="Cover / Banner" icon={Camera} hint="Saran: rasio 16:9, min 1280×360px.">
              <Input
                type="url"
                value={coverurl}
                onChange={e => setCoverurl(e.target.value)}
                placeholder="https://cdn.example.com/cover.jpg"
              />
              {coverurl && (
                <div className="relative mt-2 h-20 overflow-hidden rounded-xl border border-border/40 bg-muted/10">
                  <Image
                    src={coverurl}
                    alt="Cover preview"
                    fill
                    className="object-cover"
                    onError={() => setCoverurl("")}
                  />
                  <button
                    type="button"
                    onClick={() => setCoverurl("")}
                    className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-lg bg-background/80 text-muted-foreground hover:text-destructive transition-colors backdrop-blur-sm"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}
            </Field>

            {/* Account info */}
            <div className="mt-1 rounded-xl border border-border/30 bg-muted/10 divide-y divide-border/30">
              {[
                { label: "Role",      value: roleMeta.label,       cls: roleMeta.cls },
                { label: "Supporter", value: supportMeta?.label,   cls: supportMeta?.cls },
                { label: "Bergabung", value: joinDate,             cls: "text-muted-foreground/60" },
              ].filter(r => r.value).map(row => (
                <div key={row.label} className="flex items-center justify-between px-4 py-2.5">
                  <span className="text-xs text-muted-foreground/40">{row.label}</span>
                  <span className={cn("text-xs font-semibold", row.cls)}>{row.value}</span>
                </div>
              ))}
            </div>
          </Section>
        </div>

        {/* ── Social Links ─────────────────────────────────────────────────── */}
        <Section title="Sosial Media" icon={Link}>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SOCIAL_FIELDS.map(({ key, label, placeholder, Icon }) => (
              <Field key={key} label={label} icon={Icon}>
                <div className="relative flex items-center">
                  <Input
                    type="text"
                    value={socials[key] ?? ""}
                    onChange={e => setSocials(prev => ({ ...prev, [key]: e.target.value }))}
                    placeholder={placeholder}
                    className="pr-9"
                  />
                  {socials[key] && (
                    <button
                      type="button"
                      onClick={() => setSocials(prev => { const n = { ...prev }; delete n[key]; return n; })}
                      className="absolute right-3 text-muted-foreground/30 hover:text-muted-foreground/70 transition-colors"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </Field>
            ))}
          </div>
        </Section>

        {/* ── Actions ──────────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between gap-3 pt-1">
          <button
            onClick={handleSignout}
            className="flex items-center gap-1.5 rounded-xl border border-border/40 px-4 py-2.5 text-xs font-medium text-muted-foreground/60 hover:border-destructive/30 hover:text-destructive transition-all"
          >
            <LogOut className="h-3.5 w-3.5" />
            Keluar dari akun
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleViewProfile}
              className="flex items-center gap-1.5 rounded-xl border border-border/60 px-4 py-2.5 text-xs font-medium text-muted-foreground hover:border-primary/30 hover:text-foreground transition-all"
            >
              <Eye className="h-3.5 w-3.5" />
              Lihat Profil
            </button>
            <button
              onClick={handleSave}
              disabled={saving || !dirty}
              className={cn(
                "flex items-center gap-1.5 rounded-xl px-5 py-2.5 text-xs font-bold transition-all",
                dirty && !saving
                  ? "bg-primary text-white shadow-lg shadow-primary/20 hover:-translate-y-0.5 hover:shadow-primary/30"
                  : "bg-muted/30 text-muted-foreground/30 cursor-not-allowed"
              )}
            >
              {saving
                ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                : <Save className="h-3.5 w-3.5" />}
              {saving ? "Menyimpan…" : "Simpan Perubahan"}
            </button>
          </div>
        </div>

      </div>
    </>
  );
}
