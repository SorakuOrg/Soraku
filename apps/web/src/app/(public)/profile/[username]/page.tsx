"use client";
export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft, Globe, Lock, Calendar, AlertCircle,
  Pencil, Instagram, Twitter, Youtube, ExternalLink,
  Share2, Check,
} from "lucide-react";
import { DiscordIcon } from "@/components/icons/custom-icons";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

interface PublicProfile {
  id: string;
  username: string | null;
  displayname: string | null;
  avatarurl: string | null;
  coverurl: string | null;
  bio: string | null;
  role: string;
  supporterrole: string | null;
  sociallinks?: Record<string, string>;
  isprivate: boolean;
  createdat?: string;
}

// ─── Color-coded sesuai instruksi Riu ────────────────────────────────────────
// Kuning       = Role badge
// Hijau Muda   = Supporter badge
// Hijau Tua    = Join date
// Merah        = Sosial media icons
// Putih        = Edit Profile button

const ROLE_META: Record<string, { label: string; cls: string; glow: string; crown?: boolean }> = {
  OWNER:   { label: "Owner",   cls: "text-yellow-300  bg-yellow-400/15  border-yellow-400/40",  glow: "from-yellow-500/10 to-transparent", crown: true },
  MANAGER: { label: "Manager", cls: "text-yellow-200  bg-yellow-300/10  border-yellow-300/30",  glow: "from-yellow-400/8  to-transparent" },
  ADMIN:   { label: "Admin",   cls: "text-yellow-100  bg-yellow-200/10  border-yellow-200/25",  glow: "from-yellow-300/5  to-transparent" },
  AGENSI:  { label: "Agensi",  cls: "text-yellow-400  bg-yellow-500/10  border-yellow-500/25",  glow: "from-yellow-500/6  to-transparent" },
  KREATOR: { label: "Kreator", cls: "text-yellow-300  bg-yellow-400/10  border-yellow-400/20",  glow: "from-yellow-400/4  to-transparent" },
  USER:    { label: "Member",  cls: "text-yellow-200/60 bg-yellow-400/6 border-yellow-400/12",  glow: "from-primary/4     to-transparent" },
};

const SUPPORT_META: Record<string, { label: string; cls: string }> = {
  VVIP:    { label: "✨ VVIP",    cls: "text-green-300 bg-green-400/15 border-green-400/40" },
  VIP:     { label: "💚 VIP",     cls: "text-green-300 bg-green-400/12 border-green-400/30" },
  DONATUR: { label: "💚 Donatur", cls: "text-green-400 bg-green-500/10 border-green-500/25" },
};

const SOCIAL_CONFIG = [
  { key: "discord",   label: "Discord",   Icon: DiscordIcon, getHref: (v: string) => `https://discord.com/users/${v}`                          },
  { key: "instagram", label: "Instagram", Icon: Instagram,   getHref: (v: string) => `https://instagram.com/${v.replace("@", "")}`             },
  { key: "x",         label: "X",         Icon: Twitter,     getHref: (v: string) => `https://x.com/${v.replace("@", "")}`                     },
  { key: "youtube",   label: "YouTube",   Icon: Youtube,     getHref: (v: string) => v.startsWith("http") ? v : `https://youtube.com/${v}`     },
  { key: "website",   label: "Website",   Icon: Globe,       getHref: (v: string) => v.startsWith("http") ? v : `https://${v}`                 },
] as const;

// ─── Share Button ─────────────────────────────────────────────────────────────

function ShareButton({ username }: { username: string }) {
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    const url = `${window.location.origin}/profile/${username}`;
    if (navigator.share) {
      navigator.share({ title: `Profil @${username} — Soraku`, url });
    } else {
      navigator.clipboard.writeText(url).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  return (
    <button onClick={handleShare}
      className="flex items-center gap-1.5 rounded-full border border-white/15 bg-white/8 px-3 py-1.5 text-[11px] font-semibold text-white/60 backdrop-blur-sm transition-all hover:bg-white/15 hover:text-white/90">
      {copied ? <Check className="h-3 w-3 text-green-400" /> : <Share2 className="h-3 w-3" />}
      {copied ? "Tersalin!" : "Bagikan"}
    </button>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function ProfileSkeleton() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:py-12 animate-pulse">
      <div className="h-3.5 w-20 rounded-lg bg-muted/30 mb-6" />
      <div className="glass-card rounded-3xl overflow-hidden">
        <div className="h-40 bg-gradient-to-r from-muted/20 to-muted/10" />
        <div className="px-6 pb-6">
          <div className="-mt-10 mb-5 flex items-end justify-between">
            <div className="h-20 w-20 rounded-2xl bg-muted/30 border-[3px] border-background" />
            <div className="flex gap-2 pb-1">
              <div className="h-6 w-16 rounded-full bg-muted/25" />
            </div>
          </div>
          <div className="space-y-2.5">
            <div className="h-6 w-44 rounded-lg bg-muted/30" />
            <div className="h-3.5 w-28 rounded-lg bg-muted/20" />
            <div className="h-3 w-32 rounded-lg bg-muted/15" />
          </div>
          <div className="mt-5 space-y-2">
            <div className="h-3.5 w-full rounded bg-muted/20" />
            <div className="h-3.5 w-3/4 rounded bg-muted/15" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── 404 ──────────────────────────────────────────────────────────────────────

function NotFound({ username, onBack }: { username: string; onBack: () => void }) {
  return (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center">
      <div className="mb-5 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-muted/20 border border-border/40">
        <AlertCircle className="h-7 w-7 text-muted-foreground/30" />
      </div>
      <h1 className="text-lg font-black">Profil tidak ditemukan</h1>
      <p className="mt-2 text-sm text-muted-foreground/50">
        User <span className="text-foreground/60 font-medium">@{username}</span> tidak ada atau sudah dihapus.
      </p>
      <button onClick={onBack}
        className="mt-7 inline-flex items-center gap-2 rounded-xl border border-border/50 px-5 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all">
        <ArrowLeft className="h-4 w-4" /> Kembali
      </button>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function PublicProfilePage() {
  const { username } = useParams<{ username: string }>();
  const router       = useRouter();

  const [profile,  setProfile]  = useState<PublicProfile | null>(null);
  const [loading,  setLoading]  = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [isSelf,   setIsSelf]   = useState(false);

  useEffect(() => {
    if (!username) return;

    fetch(`/api/users/${username}`)
      .then(r => r.json())
      .then(d => { if (d.error || !d.data) { setNotFound(true); return; } setProfile(d.data); })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));

    fetch("/api/auth/me", { cache: "no-store" })
      .then(r => r.json())
      .then(d => { if (d.data?.username === username) setIsSelf(true); })
      .catch(() => {});
  }, [username]);

  if (loading) return <ProfileSkeleton />;
  if (notFound || !profile) return <NotFound username={username} onBack={() => router.back()} />;

  const roleMeta    = ROLE_META[profile.role]    ?? ROLE_META.USER;
  const supportMeta = profile.supporterrole ? SUPPORT_META[profile.supporterrole] : null;
  const displayName = profile.displayname ?? profile.username ?? "—";
  const initial     = displayName.charAt(0).toUpperCase();
  const joinDate    = profile.createdat
    ? new Date(profile.createdat).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })
    : null;

  const activeSocials = SOCIAL_CONFIG.filter(s => profile.sociallinks?.[s.key]);

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:py-12">

      {/* Back */}
      <button onClick={() => router.back()}
        className="mb-6 flex items-center gap-1.5 text-xs text-muted-foreground/40 hover:text-muted-foreground/70 transition-colors group">
        <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
        Kembali
      </button>

      {/* ══════════ PROFILE CARD ══════════ */}
      <div className={cn(
        "glass-card rounded-3xl overflow-hidden shadow-2xl relative",
        "border border-border/60"
      )}>

        {/* Glow ambient dari role */}
        <div className={cn(
          "pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b opacity-60",
          roleMeta.glow
        )} />

        {/* Cover */}
        <div className="relative h-36 sm:h-48 overflow-hidden">
          {profile.coverurl ? (
            <Image src={profile.coverurl} alt="" fill className="object-cover" />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/8 to-accent/15" />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/70" />

          {/* Top-right actions — putih transparan */}
          <div className="absolute right-3 top-3 flex items-center gap-2">
            <ShareButton username={profile.username ?? username} />
            {isSelf && (
              <Link href="/dash/profile/me"
                className="flex items-center gap-1.5 rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-[11px] font-semibold text-white/80 backdrop-blur-sm transition-all hover:bg-white/20 hover:text-white">
                <Pencil className="h-3 w-3" /> Edit Profil
              </Link>
            )}
          </div>

          {/* Owner crown di cover */}
          {roleMeta.crown && (
            <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full border border-yellow-400/30 bg-yellow-400/15 px-3 py-1 text-[10px] font-black text-yellow-300 backdrop-blur-sm">
              👑 Owner Soraku
            </div>
          )}
        </div>

        {/* ── Body ── */}
        <div className="relative px-5 sm:px-6 pb-6">

          {/* Avatar + Badges row */}
          <div className="-mt-12 mb-4 flex items-end justify-between">
            {/* Avatar */}
            <div className="relative">
              <div className="h-24 w-24 rounded-2xl border-[3px] border-background overflow-hidden bg-card/80 shadow-2xl flex items-center justify-center">
                {profile.avatarurl ? (
                  <Image src={profile.avatarurl} alt={displayName} fill className="object-cover" />
                ) : (
                  <span className="text-3xl font-black text-primary/50">{initial}</span>
                )}
              </div>
              {/* Online dot (dekoratif) */}
              <span className="absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full border-2 border-background bg-green-400" />
            </div>

            {/* Badges */}
            <div className="flex flex-col items-end gap-1.5 pb-1">
              {/* KUNING: Role */}
              <span className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-widest",
                roleMeta.cls
              )}>
                {roleMeta.crown && <span className="text-[10px]">👑</span>}
                {roleMeta.label}
              </span>
              {/* HIJAU MUDA: Supporter */}
              {supportMeta && (
                <span className={cn("inline-flex items-center rounded-full border px-3 py-1 text-[10px] font-black", supportMeta.cls)}>
                  {supportMeta.label}
                </span>
              )}
              {profile.isprivate && (
                <span className="flex items-center gap-1 rounded-full border border-border/40 bg-muted/20 px-2.5 py-1 text-[10px] text-muted-foreground/50">
                  <Lock className="h-2.5 w-2.5" /> Privat
                </span>
              )}
            </div>
          </div>

          {/* Name + username */}
          <div className="mb-4">
            <h1 className="text-2xl font-black tracking-tight leading-tight">{displayName}</h1>
            <p className="mt-0.5 text-sm text-muted-foreground/50">@{profile.username}</p>
          </div>

          {/* Bio block atau private notice */}
          {profile.isprivate ? (
            <div className="flex items-center gap-3 rounded-2xl border border-border/30 bg-muted/10 px-4 py-3.5 mb-4">
              <Lock className="h-4 w-4 text-muted-foreground/25 flex-shrink-0" />
              <p className="text-sm text-muted-foreground/40 italic">Profil ini privat.</p>
            </div>
          ) : (
            <div className="rounded-2xl border border-border/40 bg-card/30 px-4 py-4 mb-4 space-y-3">
              {/* Bio */}
              {profile.bio ? (
                <p className="text-sm text-foreground/80 leading-relaxed">{profile.bio}</p>
              ) : (
                <p className="text-sm italic text-muted-foreground/30">Belum ada bio.</p>
              )}
              {/* HIJAU TUA: Join date di bawah bio */}
              {joinDate && (
                <p className="flex items-center gap-1.5 text-[11px] font-medium text-green-600/50 dark:text-green-400/40">
                  <Calendar className="h-3 w-3 flex-shrink-0" />
                  Bergabung {joinDate}
                </p>
              )}
            </div>
          )}

          {/* MERAH: Sosial media icons */}
          {!profile.isprivate && activeSocials.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {activeSocials.map(({ key, label, Icon, getHref }) => {
                const val  = profile.sociallinks![key]!;
                const href = getHref(val);
                return (
                  <a key={key} href={href} target="_blank" rel="noopener noreferrer"
                    className="group flex items-center gap-2 rounded-full border border-red-500/25 bg-red-500/8 px-3.5 py-2 text-xs font-semibold text-red-400/80 transition-all hover:bg-red-500/15 hover:text-red-300 hover:border-red-400/40 hover:-translate-y-0.5">
                    <Icon className="h-3.5 w-3.5 flex-shrink-0" />
                    {label}
                    <ExternalLink className="h-2.5 w-2.5 opacity-0 group-hover:opacity-60 transition-opacity" />
                  </a>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── Self edit hint ── */}
      {isSelf && (
        <p className="mt-4 text-center text-xs text-muted-foreground/30">
          Ini profil publik kamu —{" "}
          <Link href="/dash/profile/me" className="text-primary/50 hover:text-primary transition-colors">
            edit profil
          </Link>
        </p>
      )}
    </div>
  );
}
