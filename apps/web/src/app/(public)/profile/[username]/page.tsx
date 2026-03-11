"use client";
export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft, Globe, Lock, ShieldCheck, Sparkles,
  Instagram, Twitter, Youtube, ExternalLink,
  Calendar, Loader2, AlertCircle, Pencil,
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
const SOCIAL_CONFIG = [
  { key: "discord",   label: "Discord",   Icon: DiscordIcon, base: ""                        },
  { key: "instagram", label: "Instagram", Icon: Instagram,   base: "https://instagram.com/"  },
  { key: "x",         label: "X",         Icon: Twitter,     base: "https://x.com/"          },
  { key: "youtube",   label: "YouTube",   Icon: Youtube,     base: ""                        },
  { key: "website",   label: "Website",   Icon: Globe,       base: ""                        },
] as const;

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function PublicProfilePage() {
  const { username } = useParams<{ username: string }>();
  const router = useRouter();
  const [profile,   setProfile]   = useState<PublicProfile | null>(null);
  const [loading,   setLoading]   = useState(true);
  const [notFound,  setNotFound]  = useState(false);
  const [isSelf,    setIsSelf]    = useState(false);

  useEffect(() => {
    if (!username) return;

    // Fetch public profile
    fetch(`/api/users/${username}`)
      .then(r => r.json())
      .then(d => {
        if (d.error || !d.data) { setNotFound(true); return; }
        setProfile(d.data);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));

    // Cek apakah ini profil sendiri
    fetch("/api/auth/me", { cache: "no-store" })
      .then(r => r.json())
      .then(d => { if (d.data?.username === username) setIsSelf(true); })
      .catch(() => {});
  }, [username]);

  // ── Loading ──
  if (loading) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12">
        <div className="space-y-5 animate-pulse">
          <div className="h-4 w-24 rounded-lg bg-muted/30" />
          <div className="glass-card rounded-3xl overflow-hidden">
            <div className="h-36 bg-muted/20" />
            <div className="px-6 pb-6 pt-3 space-y-3">
              <div className="h-6 w-40 rounded-lg bg-muted/30" />
              <div className="h-4 w-24 rounded-lg bg-muted/20" />
              <div className="h-3 w-64 rounded-lg bg-muted/15" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── 404 ──
  if (notFound || !profile) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <AlertCircle className="mx-auto h-10 w-10 text-muted-foreground/20 mb-4" />
        <h1 className="text-lg font-bold">Profil tidak ditemukan</h1>
        <p className="mt-1 text-sm text-muted-foreground/50">User @{username} tidak ada atau sudah dihapus.</p>
        <button onClick={() => router.back()}
          className="mt-6 flex items-center gap-2 rounded-xl border border-border/50 px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors mx-auto">
          <ArrowLeft className="h-4 w-4" />Kembali
        </button>
      </div>
    );
  }

  const roleMeta    = ROLE_META[profile.role]    ?? ROLE_META.USER;
  const supportMeta = profile.supporterrole ? SUPPORT_META[profile.supporterrole] : null;
  const displayName = profile.displayname ?? profile.username ?? "—";
  const initial     = displayName.charAt(0).toUpperCase();
  const joinDate    = profile.createdat
    ? new Date(profile.createdat).toLocaleDateString("id-ID", { month: "long", year: "numeric" })
    : null;

  // Socials yang terisi
  const activeSocials = SOCIAL_CONFIG.filter(s => profile.sociallinks?.[s.key]);

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:py-12">

      {/* Back */}
      <button onClick={() => router.back()}
        className="mb-6 flex items-center gap-1.5 text-xs text-muted-foreground/50 hover:text-muted-foreground transition-colors">
        <ArrowLeft className="h-3.5 w-3.5" />Kembali
      </button>

      {/* ── Profile Card ─────────────────────────────────────────────────── */}
      <div className="glass-card rounded-3xl overflow-hidden">
        {/* Cover */}
        <div className="relative h-32 sm:h-40 bg-gradient-to-r from-primary/15 via-primary/8 to-accent/10">
          {profile.coverurl && (
            <Image src={profile.coverurl} alt="" fill className="object-cover" />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/20" />
        </div>

        <div className="px-5 sm:px-6 pb-6">
          {/* Avatar row */}
          <div className="-mt-10 mb-4 flex items-end justify-between">
            <div className="relative h-20 w-20 rounded-2xl border-[3px] border-background overflow-hidden bg-card flex items-center justify-center shadow-xl">
              {profile.avatarurl ? (
                <Image src={profile.avatarurl} alt={displayName} fill className="object-cover" />
              ) : (
                <span className="text-2xl font-black text-primary/60">{initial}</span>
              )}
            </div>

            <div className="flex items-center gap-2 pb-1">
              {isSelf && (
                <Link href="/profile/me"
                  className="flex items-center gap-1.5 rounded-xl border border-border/50 px-3 py-1.5 text-xs font-medium text-muted-foreground hover:border-primary/30 hover:text-foreground transition-all">
                  <Pencil className="h-3 w-3" />Edit Profil
                </Link>
              )}
              <span className={cn("rounded-xl border px-2.5 py-1 text-[10px] font-black uppercase tracking-wider", roleMeta.cls)}>
                {roleMeta.label}
              </span>
              {supportMeta && (
                <span className={cn("rounded-xl px-2.5 py-1 text-[10px] font-black", supportMeta.cls)}>
                  {supportMeta.label}
                </span>
              )}
            </div>
          </div>

          {/* Name */}
          <div className="mb-4">
            <h1 className="text-xl font-black leading-tight">{displayName}</h1>
            <p className="text-sm text-muted-foreground/50 mt-0.5">@{profile.username}</p>
            {joinDate && (
              <p className="flex items-center gap-1.5 mt-1.5 text-xs text-muted-foreground/35">
                <Calendar className="h-3 w-3" />Bergabung {joinDate}
              </p>
            )}
          </div>

          {/* Private or Bio */}
          {profile.isprivate ? (
            <div className="flex items-center gap-2.5 rounded-2xl border border-border/30 bg-muted/10 px-4 py-3">
              <Lock className="h-4 w-4 text-muted-foreground/30 flex-shrink-0" />
              <p className="text-sm text-muted-foreground/40">Profil ini privat.</p>
            </div>
          ) : (
            <>
              {profile.bio && (
                <p className="text-sm text-muted-foreground/70 leading-relaxed mb-5 max-w-lg">{profile.bio}</p>
              )}

              {/* Social links */}
              {activeSocials.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-border/30">
                  {activeSocials.map(({ key, label, Icon, base }) => {
                    const val = profile.sociallinks![key]!;
                    const href = val.startsWith("http") ? val : `${base}${val}`;
                    return (
                      <a key={key}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 rounded-xl border border-border/40 bg-card/40 px-3.5 py-2 text-xs font-medium text-muted-foreground hover:border-primary/30 hover:text-foreground hover:-translate-y-0.5 transition-all group"
                      >
                        <Icon className="h-3.5 w-3.5 text-muted-foreground/50 group-hover:text-primary transition-colors" />
                        {label}
                        <ExternalLink className="h-2.5 w-2.5 opacity-0 group-hover:opacity-50 transition-opacity" />
                      </a>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Edit shortcut if own profile */}
      {isSelf && (
        <p className="mt-4 text-center text-xs text-muted-foreground/35">
          Ini profil kamu —{" "}
          <Link href="/profile/me" className="text-primary/60 hover:text-primary transition-colors">
            edit profil
          </Link>
        </p>
      )}
    </div>
  );
}
