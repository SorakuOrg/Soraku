"use client";
export const dynamic = "force-dynamic";

import { useEffect, useState, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Save, Loader2, CheckCircle2, AlertCircle, X, LogOut,
  User, AtSign, FileText, Globe, Lock, Camera, Link as LinkIcon,
  Shield, Sparkles, Eye, RefreshCw, Settings, UserCircle,
  Instagram, Twitter, Youtube, Calendar, ExternalLink, Pencil,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { DiscordIcon } from "@/components/icons/custom-icons";
import { Footer } from "@/components/layout/footer";
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

// ─── Color meta (sesuai instruksi Riu)
const ROLE_META: Record<string, { label: string; cls: string; glow: string }> = {
  OWNER:   { label: "Owner",   cls: "text-yellow-300  bg-yellow-400/15  border-yellow-400/40",  glow: "shadow-yellow-500/10" },
  MANAGER: { label: "Manager", cls: "text-yellow-200  bg-yellow-300/10  border-yellow-300/30",  glow: "shadow-yellow-400/8"  },
  ADMIN:   { label: "Admin",   cls: "text-yellow-100  bg-yellow-200/10  border-yellow-200/25",  glow: "shadow-yellow-300/5"  },
  AGENSI:  { label: "Agensi",  cls: "text-yellow-400  bg-yellow-500/10  border-yellow-500/25",  glow: ""                    },
  KREATOR: { label: "Kreator", cls: "text-yellow-300  bg-yellow-400/10  border-yellow-400/20",  glow: ""                    },
  USER:    { label: "Member",  cls: "text-yellow-200/70 bg-yellow-400/8 border-yellow-400/15",  glow: ""                    },
};

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

const SOCIAL_CONFIG = [
  { key: "discord",   Icon: DiscordIcon, getHref: (v: string) => `https://discord.com/users/${v}` },
  { key: "instagram", Icon: Instagram,   getHref: (v: string) => `https://instagram.com/${v.replace("@","")}` },
  { key: "x",         Icon: Twitter,     getHref: (v: string) => `https://x.com/${v.replace("@","")}` },
  { key: "youtube",   Icon: Youtube,     getHref: (v: string) => v.startsWith("http") ? v : `https://youtube.com/${v}` },
  { key: "website",   Icon: Globe,       getHref: (v: string) => v.startsWith("http") ? v : `https://${v}` },
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

// ─── Input + Field ────────────────────────────────────────────────────────────

function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input className={cn(
      "w-full rounded-xl border border-border/60 bg-card/40 px-4 py-2.5 text-sm",
      "outline-none placeholder:text-muted-foreground/25",
      "focus:border-primary/40 focus:bg-card/60 focus:ring-2 focus:ring-primary/10",
      "disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150",
      className
    )} {...props} />
  );
}

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

// ─── Tab types ────────────────────────────────────────────────────────────────

type Tab = "profile" | "settings";

// ─── Profile Tab Content ─────────────────────────────────────────────────────

function ProfileTab({
  profile, displayname, username, bio, avatarurl, coverurl,
  isprivate, socials, roleMeta, supportMeta, joinDate, onGoSettings
}: {
  profile: Profile;
  displayname: string; username: string; bio: string;
  avatarurl: string; coverurl: string; isprivate: boolean;
  socials: Record<string, string>;
  roleMeta: { label: string; cls: string; glow: string };
  supportMeta: { label: string; cls: string } | null;
  joinDate: string;
  onGoSettings: () => void;
}) {
  const displayName = displayname || profile.username || "Pengguna";
  const initial     = displayName.charAt(0).toUpperCase();
  const filledSocials = SOCIAL_CONFIG.filter(s => socials[s.key]);

  return (
    <div className="space-y-5">
      {/* ── Identity Card ── */}
      <div className={cn("glass-card rounded-3xl overflow-hidden shadow-2xl relative border border-border/60", roleMeta.glow)}>
        {/* Glow ambient */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-primary/8 to-transparent" />

        {/* Cover */}
        <div className="relative h-36 sm:h-44 overflow-hidden">
          {coverurl ? (
            <Image src={coverurl} alt="" fill className="object-cover" />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/8 to-accent/15" />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/70" />

          {/* Putih: Lihat Profil Publik */}
          {username && (
            <Link href={`/profile/${username}`}
              className="absolute right-3 top-3 flex items-center gap-1.5 rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-[11px] font-semibold text-white/80 backdrop-blur-sm hover:bg-white/20 hover:text-white transition-all">
              <ExternalLink className="h-3 w-3" /> Profil Publik
            </Link>
          )}

          {/* Owner crown */}
          {profile.role === "OWNER" && (
            <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full border border-yellow-400/30 bg-yellow-400/15 px-3 py-1 text-[10px] font-black text-yellow-300 backdrop-blur-sm">
              👑 Owner Soraku
            </div>
          )}
        </div>

        <div className="relative px-5 sm:px-6 pb-6">
          {/* Avatar + Badges */}
          <div className="-mt-12 mb-4 flex items-end justify-between">
            <div className="relative">
              <div className="h-24 w-24 rounded-2xl border-[3px] border-background overflow-hidden bg-card/80 shadow-2xl flex items-center justify-center">
                {avatarurl ? (
                  <Image src={avatarurl} alt={displayName} fill className="object-cover" />
                ) : (
                  <span className="text-3xl font-black text-primary/50">{initial}</span>
                )}
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full border-2 border-background bg-green-400" />
            </div>

            <div className="flex flex-col items-end gap-1.5 pb-1">
              {/* Kuning: Role */}
              <span className={cn("inline-flex items-center gap-1 rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-widest", roleMeta.cls)}>
                {profile.role === "OWNER" && <span>👑</span>}
                {roleMeta.label}
              </span>
              {/* Hijau muda: Supporter */}
              {supportMeta && (
                <span className={cn("inline-flex items-center rounded-full border px-3 py-1 text-[10px] font-black", supportMeta.cls)}>
                  {supportMeta.label}
                </span>
              )}
              {isprivate && (
                <span className="flex items-center gap-1 rounded-full border border-border/40 bg-muted/20 px-2.5 py-1 text-[10px] text-muted-foreground/50">
                  <Lock className="h-2.5 w-2.5" /> Privat
                </span>
              )}
            </div>
          </div>

          {/* Nama + username — klik username → publik */}
          <div className="mb-4">
            <p className="text-2xl font-black tracking-tight">{displayName}</p>
            {username ? (
              <Link href={`/profile/${username}`}
                className="mt-0.5 inline-flex items-center gap-1 text-sm text-muted-foreground/50 hover:text-primary/70 transition-colors group">
                @{username}
                <ExternalLink className="h-2.5 w-2.5 opacity-0 group-hover:opacity-60 transition-opacity" />
              </Link>
            ) : (
              <p className="mt-0.5 text-sm text-muted-foreground/40">@—</p>
            )}
          </div>

          {/* Bio block + hijau tua join date */}
          <div className="rounded-2xl border border-border/40 bg-card/30 px-4 py-4 mb-4 space-y-2.5">
            {bio ? (
              <p className="text-sm text-foreground/80 leading-relaxed">{bio}</p>
            ) : (
              <p className="text-sm italic text-muted-foreground/30">Belum ada bio. Isi di tab Settings →</p>
            )}
            {/* Hijau tua: join date */}
            <p className="flex items-center gap-1.5 text-[11px] font-medium text-green-600/50 dark:text-green-400/40">
              <Calendar className="h-3 w-3 flex-shrink-0" />
              Bergabung sejak {joinDate}
            </p>
          </div>

          {/* Merah: sosial media */}
          {filledSocials.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-5">
              {filledSocials.map(({ key, Icon, getHref }) => (
                <a key={key} href={getHref(socials[key]!)} target="_blank" rel="noopener noreferrer"
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-red-500/25 bg-red-500/8 text-red-400/80 hover:bg-red-500/18 hover:text-red-300 hover:-translate-y-0.5 transition-all">
                  <Icon className="h-3.5 w-3.5" />
                </a>
              ))}
            </div>
          )}

          {/* Putih: Edit Profil → Settings tab */}
          <button onClick={onGoSettings}
            className="flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/8 px-4 py-2 text-xs font-semibold text-white/70 backdrop-blur-sm transition-all hover:bg-white/15 hover:text-white">
            <Pencil className="h-3.5 w-3.5" /> Edit Profil
          </button>
        </div>
      </div>

      {/* ── Info tiles ── */}
      <div className="glass-card rounded-2xl overflow-hidden divide-y divide-border/20">
        {[
          { label: "Role",      value: roleMeta.label,       color: "text-yellow-300/80" },
          { label: "Supporter", value: supportMeta?.label,   color: "text-green-400/80"  },
          { label: "Status",    value: isprivate ? "Privat" : "Publik", color: isprivate ? "text-muted-foreground/60" : "text-green-400/70" },
          { label: "Bergabung", value: joinDate,              color: "text-green-500/50"  },
        ].filter(r => r.value).map(row => (
          <div key={row.label} className="flex items-center justify-between px-5 py-3">
            <span className="text-xs text-muted-foreground/40">{row.label}</span>
            <span className={cn("text-xs font-semibold", row.color)}>{row.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Settings Tab Content ─────────────────────────────────────────────────────

function SettingsTab({
  profile, roleMeta, supportMeta, joinDate,
  displayname, setDisplayname,
  username, setUsername,
  bio, setBio,
  avatarurl, setAvatarurl,
  coverurl, setCoverurl,
  isprivate, setIsprivate,
  socials, setSocials,
  setDirty,
  saving, dirty,
  onSave, onSignout,
  isStaff,
}: {
  profile: Profile;
  roleMeta: { label: string; cls: string; glow: string };
  supportMeta: { label: string; cls: string } | null;
  joinDate: string;
  displayname: string; setDisplayname: (v: string) => void;
  username: string;    setUsername:    (v: string) => void;
  bio: string;         setBio:         (v: string) => void;
  avatarurl: string;   setAvatarurl:   (v: string) => void;
  coverurl: string;    setCoverurl:    (v: string) => void;
  isprivate: boolean;  setIsprivate:   (fn: (p: boolean) => boolean) => void;
  socials: Record<string, string>; setSocials: (fn: (p: Record<string,string>) => Record<string,string>) => void;
  setDirty: (v: boolean) => void;
  saving: boolean; dirty: boolean;
  onSave: () => void; onSignout: () => void;
  isStaff: boolean;
}) {
  const displayName = displayname || profile.username || "Pengguna";
  const initial     = displayName.charAt(0).toUpperCase();

  return (
    <div className="space-y-5 pb-4">
      {/* Mini card preview */}
      <div className="flex items-center gap-4 glass-card rounded-2xl px-5 py-4">
        <div className="h-14 w-14 flex-shrink-0 rounded-xl overflow-hidden border-2 border-border/40 bg-card/80 flex items-center justify-center shadow-lg">
          {avatarurl ? (
            <Image src={avatarurl} alt={displayName} width={56} height={56} className="h-full w-full object-cover" onError={() => setAvatarurl("")} />
          ) : (
            <span className="text-xl font-black text-primary/50">{initial}</span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-bold truncate">{displayName}</p>
          <p className="text-xs text-muted-foreground/50">@{profile.username ?? "—"}</p>
        </div>
        <span className={cn("flex-shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-wider", roleMeta.cls)}>
          {roleMeta.label}
        </span>
      </div>

      {/* Grid form */}
      <div className="grid gap-5 lg:grid-cols-2">
        {/* Kiri */}
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
            className={cn("flex items-center justify-between w-full rounded-xl border px-4 py-3 text-left transition-all",
              isprivate ? "border-primary/25 bg-primary/5" : "border-border/40 bg-card/20 hover:border-border/70")}>
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

        {/* Kanan */}
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
              { label: "Role",      value: roleMeta.label,   color: "text-yellow-300/80" },
              { label: "Supporter", value: supportMeta?.label, color: "text-green-400/80" },
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

      {/* Sosial Media */}
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

      {/* Admin shortcut */}
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
              <Shield className="h-3.5 w-3.5" /> Admin Panel
            </Link>
          </div>
        </div>
      )}

      {/* Bottom actions */}
      <div className="flex items-center justify-between gap-3 flex-wrap pt-1">
        <button onClick={onSignout}
          className="flex items-center gap-1.5 rounded-xl border border-border/40 px-4 py-2.5 text-xs font-medium text-muted-foreground/60 hover:border-destructive/30 hover:text-destructive transition-all">
          <LogOut className="h-3.5 w-3.5" /> Keluar dari akun
        </button>
        <button onClick={onSave} disabled={saving || !dirty}
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
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function Skeleton() {
  return (
    <div className="space-y-5 pb-10 animate-pulse">
      <div className="glass-card h-12 rounded-2xl bg-muted/10" />
      <div className="glass-card h-72 rounded-3xl bg-muted/10" />
      <div className="grid gap-5 lg:grid-cols-2">
        <div className="glass-card h-64 rounded-2xl bg-muted/10" />
        <div className="glass-card h-64 rounded-2xl bg-muted/10" />
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

  // Active tab + swipe direction
  const [activeTab, setActiveTab]   = useState<Tab>("profile");
  const [direction, setDirection]   = useState<"left" | "right">("right");
  const [animating, setAnimating]   = useState(false);

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
    setLoading(true); setHasError(false);
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
    router.push("/"); router.refresh();
  };

  // Tab switch dengan animasi
  const switchTab = useCallback((tab: Tab) => {
    if (tab === activeTab || animating) return;
    setDirection(tab === "settings" ? "left" : "right");
    setAnimating(true);
    setTimeout(() => {
      setActiveTab(tab);
      setAnimating(false);
    }, 200);
  }, [activeTab, animating]);

  if (loading) return <><Skeleton /><Footer /></>;

  if (hasError || !profile) return (
    <>
      <div className="flex flex-col items-center gap-4 py-20 text-center">
        <AlertCircle className="h-10 w-10 text-destructive/30" />
        <p className="text-sm text-muted-foreground/60">Gagal memuat profil.</p>
        <div className="flex gap-2">
          <button onClick={load} className="flex items-center gap-1.5 rounded-xl border border-border px-4 py-2 text-xs font-medium text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all">
            <RefreshCw className="h-3.5 w-3.5" /> Coba Lagi
          </button>
          <Link href="/login" className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white hover:bg-primary/90 transition-all">Login Ulang</Link>
        </div>
      </div>
      <Footer />
    </>
  );

  const roleMeta    = ROLE_META[profile.role] ?? ROLE_META.USER;
  const supportMeta = profile.supporterrole ? SUPPORT_META[profile.supporterrole] : null;
  const isStaff     = ["OWNER","MANAGER","ADMIN"].includes(profile.role);
  const joinDate    = new Date(profile.createdat).toLocaleDateString("id-ID", { month: "long", year: "numeric" });

  const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: "profile",  label: "Profil",   icon: UserCircle },
    { id: "settings", label: "Settings", icon: Settings   },
  ];

  return (
    <>
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      <div className="space-y-5 pb-2">

        {/* ── Tab Bar with save indicator ── */}
        <div className="flex items-center justify-between gap-4">
          {/* Tabs */}
          <div className="relative flex gap-1 rounded-2xl border border-border/50 bg-card/30 p-1 backdrop-blur-sm">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => switchTab(tab.id)}
                className={cn(
                  "relative flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all duration-200",
                  activeTab === tab.id
                    ? "bg-primary text-white shadow-md shadow-primary/20"
                    : "text-muted-foreground/60 hover:text-foreground hover:bg-muted/30"
                )}
              >
                <tab.icon className="h-3.5 w-3.5" />
                {tab.label}
                {/* Dirty indicator di Settings tab */}
                {tab.id === "settings" && dirty && (
                  <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-amber-400 ring-2 ring-background" />
                )}
              </button>
            ))}
          </div>

          {/* Save button (visible kalau di settings dan dirty) */}
          {activeTab === "settings" && (
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
          )}
        </div>

        {/* ── Tab Content dengan slide animation ── */}
        <div className="relative overflow-hidden">
          <div
            className={cn(
              "transition-all duration-200",
              animating
                ? direction === "left"
                  ? "-translate-x-4 opacity-0"
                  : "translate-x-4 opacity-0"
                : "translate-x-0 opacity-100"
            )}
          >
            {activeTab === "profile" && (
              <ProfileTab
                profile={profile}
                displayname={displayname} username={username} bio={bio}
                avatarurl={avatarurl} coverurl={coverurl} isprivate={isprivate}
                socials={socials}
                roleMeta={roleMeta} supportMeta={supportMeta} joinDate={joinDate}
                onGoSettings={() => switchTab("settings")}
              />
            )}
            {activeTab === "settings" && (
              <SettingsTab
                profile={profile} roleMeta={roleMeta} supportMeta={supportMeta} joinDate={joinDate}
                displayname={displayname} setDisplayname={setDisplayname}
                username={username} setUsername={setUsername}
                bio={bio} setBio={setBio}
                avatarurl={avatarurl} setAvatarurl={setAvatarurl}
                coverurl={coverurl} setCoverurl={setCoverurl}
                isprivate={isprivate} setIsprivate={setIsprivate}
                socials={socials} setSocials={setSocials}
                setDirty={setDirty}
                saving={saving} dirty={dirty}
                onSave={handleSave} onSignout={handleSignout}
                isStaff={isStaff}
              />
            )}
          </div>
        </div>

      </div>

      <Footer />
    </>
  );
}
