"use client";
export const dynamic = "force-dynamic";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import {
  Save, Camera, User, Link2, Globe, Lock, Loader2,
  CheckCircle2, AlertCircle, Instagram, Twitter, Youtube,
} from "lucide-react";
import { DiscordIcon } from "@/components/icons/custom-icons";

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

const ROLE_LABEL: Record<string, string> = {
  OWNER: "Owner",  MANAGER: "Manager", ADMIN: "Admin",
  AGENSI: "Agensi", KREATOR: "Kreator", USER: "Member",
};
const ROLE_COLOR: Record<string, string> = {
  OWNER:   "bg-yellow-400/15 text-yellow-300 border-yellow-400/25",
  MANAGER: "bg-violet-500/15 text-violet-300 border-violet-500/20",
  ADMIN:   "bg-primary/15 text-primary border-primary/20",
  AGENSI:  "bg-green-500/15 text-green-300 border-green-500/20",
  KREATOR: "bg-accent/15 text-accent border-accent/20",
  USER:    "bg-muted text-muted-foreground border-border/50",
};
const SUPPORT_COLOR: Record<string, string> = {
  VVIP:    "bg-yellow-400/15 text-yellow-300",
  VIP:     "bg-violet-500/15 text-violet-300",
  DONATUR: "bg-blue-500/15 text-blue-300",
};

// ─── Social link fields ───────────────────────────────────────────────────────
const SOCIAL_FIELDS = [
  { key: "discord",   label: "Discord",   placeholder: "username#0000", Icon: DiscordIcon },
  { key: "instagram", label: "Instagram", placeholder: "@username",     Icon: Instagram },
  { key: "x",         label: "X / Twitter", placeholder: "@username",   Icon: Twitter },
  { key: "youtube",   label: "YouTube",   placeholder: "URL channel",   Icon: Youtube },
  { key: "website",   label: "Website",   placeholder: "https://",      Icon: Globe },
] as const;

// ─── Toast ────────────────────────────────────────────────────────────────────
function Toast({ msg, type }: { msg: string; type: "ok" | "err" }) {
  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-2xl border px-5 py-3 shadow-xl text-sm font-medium backdrop-blur-xl animate-in slide-in-from-bottom-2 ${
      type === "ok"
        ? "border-green-500/30 bg-green-500/10 text-green-400"
        : "border-destructive/30 bg-destructive/10 text-destructive"
    }`}>
      {type === "ok" ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
      {msg}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ProfilePage() {
  const [profile,  setProfile]  = useState<Profile | null>(null);
  const [loading,  setLoading]  = useState(true);
  const [saving,   setSaving]   = useState(false);
  const [toast,    setToast]    = useState<{ msg: string; type: "ok" | "err" } | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Form state (diisi setelah fetch)
  const [displayname, setDisplayname] = useState("");
  const [bio,         setBio]         = useState("");
  const [avatarurl,   setAvatarurl]   = useState("");
  const [coverurl,    setCoverurl]    = useState("");
  const [isprivate,   setIsprivate]   = useState(false);
  const [socials,     setSocials]     = useState<Record<string, string>>({});

  const showToast = (msg: string, type: "ok" | "err") => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast({ msg, type });
    toastTimer.current = setTimeout(() => setToast(null), 3500);
  };

  // Fetch profile
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

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/profile", {
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
        showToast(data.error ?? "Gagal menyimpan perubahan.", "err");
      } else {
        setProfile(prev => prev ? { ...prev, ...data.data } : prev);
        showToast("Profil berhasil disimpan! ✨", "ok");
      }
    } catch {
      showToast("Koneksi gagal. Coba lagi.", "err");
    } finally {
      setSaving(false);
    }
  };

  // ── Skeleton ──
  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-40 rounded-xl bg-muted/40" />
        <div className="glass-card h-64 rounded-3xl" />
        <div className="glass-card h-80 rounded-3xl" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex flex-col items-center gap-4 py-20 text-center">
        <AlertCircle className="h-10 w-10 text-destructive/50" />
        <p className="text-muted-foreground">Gagal memuat profil. Pastikan kamu sudah login.</p>
      </div>
    );
  }

  const initial = (profile.displayname ?? profile.username ?? "U").charAt(0).toUpperCase();
  const joinDate = new Date(profile.createdat).toLocaleDateString("id-ID", { month: "long", year: "numeric" });

  return (
    <>
      {toast && <Toast msg={toast.msg} type={toast.type} />}

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Profil Saya</h1>
            <p className="mt-1 text-sm text-muted-foreground">Kelola informasi dan tampilan profilmu</p>
          </div>
          <button onClick={handleSave} disabled={saving}
            className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 disabled:opacity-60 disabled:pointer-events-none">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {saving ? "Menyimpan…" : "Simpan"}
          </button>
        </div>

        {/* Preview Card */}
        <div className="glass-card overflow-hidden rounded-3xl">
          {/* Cover */}
          <div className="relative h-28 sm:h-36 bg-gradient-to-br from-primary/20 via-primary/10 to-accent/10">
            {coverurl && (
              <Image src={coverurl} alt="Cover" fill className="object-cover" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent" />
          </div>
          {/* Avatar + info */}
          <div className="relative px-5 pb-5">
            <div className="relative -mt-10 mb-4 flex items-end justify-between">
              <div className="relative">
                <div className="h-20 w-20 overflow-hidden rounded-2xl border-4 border-background bg-primary/20 flex items-center justify-center">
                  {avatarurl ? (
                    <Image src={avatarurl} alt="Avatar" fill className="object-cover" />
                  ) : (
                    <span className="text-2xl font-black text-primary">{initial}</span>
                  )}
                </div>
              </div>
              <div className="flex gap-2 pb-1">
                <span className={`rounded-full border px-2.5 py-1 text-[11px] font-black uppercase tracking-wider ${ROLE_COLOR[profile.role] ?? ROLE_COLOR.USER}`}>
                  {ROLE_LABEL[profile.role] ?? profile.role}
                </span>
                {profile.supporterrole && (
                  <span className={`rounded-full px-2.5 py-1 text-[11px] font-black ${SUPPORT_COLOR[profile.supporterrole]}`}>
                    {profile.supporterrole}
                  </span>
                )}
              </div>
            </div>
            <p className="text-lg font-black leading-none">{profile.displayname ?? profile.username ?? "—"}</p>
            <p className="text-sm text-muted-foreground/60 mt-0.5">@{profile.username ?? "—"}</p>
            <p className="text-xs text-muted-foreground/40 mt-1">Bergabung sejak {joinDate}</p>
            {profile.bio && <p className="mt-2 text-sm text-muted-foreground/70 leading-relaxed">{profile.bio}</p>}
          </div>
        </div>

        {/* Edit form */}
        <div className="grid gap-5 lg:grid-cols-2">
          {/* Info dasar */}
          <div className="glass-card rounded-3xl p-6 space-y-5">
            <div className="flex items-center gap-2 mb-2">
              <User className="h-4 w-4 text-primary" />
              <h2 className="text-sm font-bold uppercase tracking-widest text-foreground/80">Info Dasar</h2>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-muted-foreground/60">Nama Tampilan</label>
              <input type="text" value={displayname} onChange={e => setDisplayname(e.target.value)}
                placeholder="Nama yang tampil ke orang lain"
                className="w-full rounded-xl border border-border bg-card/50 px-4 py-2.5 text-sm outline-none placeholder:text-muted-foreground/40 focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-colors" />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-muted-foreground/60">Username</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground/40">@</span>
                <input type="text" value={profile.username ?? ""} disabled
                  className="w-full rounded-xl border border-border/40 bg-muted/20 pl-8 pr-4 py-2.5 text-sm text-muted-foreground/60 cursor-not-allowed" />
              </div>
              <p className="mt-1 text-[11px] text-muted-foreground/40">Username tidak bisa diubah setelah daftar.</p>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-muted-foreground/60">Bio</label>
              <textarea value={bio} onChange={e => setBio(e.target.value)} rows={3}
                placeholder="Ceritakan sedikit tentang dirimu… (maks 300 karakter)"
                maxLength={300}
                className="w-full resize-none rounded-xl border border-border bg-card/50 px-4 py-2.5 text-sm outline-none placeholder:text-muted-foreground/40 focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-colors" />
              <p className="mt-1 text-right text-[11px] text-muted-foreground/40">{bio.length}/300</p>
            </div>

            {/* Privasi */}
            <div className="flex items-center justify-between rounded-xl border border-border/50 bg-card/40 px-4 py-3">
              <div className="flex items-center gap-2">
                {isprivate ? <Lock className="h-4 w-4 text-muted-foreground" /> : <Globe className="h-4 w-4 text-muted-foreground" />}
                <div>
                  <p className="text-sm font-medium">{isprivate ? "Profil Privat" : "Profil Publik"}</p>
                  <p className="text-xs text-muted-foreground/55">{isprivate ? "Hanya kamu yang bisa lihat detailnya" : "Semua orang bisa melihat profilmu"}</p>
                </div>
              </div>
              <button type="button" onClick={() => setIsprivate(p => !p)}
                className={`relative flex h-6 w-11 items-center rounded-full transition-colors ${isprivate ? "bg-primary" : "bg-muted"}`}>
                <span className={`absolute h-4 w-4 rounded-full bg-white shadow transition-transform ${isprivate ? "translate-x-6" : "translate-x-1"}`} />
              </button>
            </div>
          </div>

          {/* Foto */}
          <div className="glass-card rounded-3xl p-6 space-y-5">
            <div className="flex items-center gap-2 mb-2">
              <Camera className="h-4 w-4 text-primary" />
              <h2 className="text-sm font-bold uppercase tracking-widest text-foreground/80">Foto Profil</h2>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-muted-foreground/60">URL Avatar</label>
              <div className="flex gap-2">
                {avatarurl && (
                  <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-xl border border-border/50">
                    <Image src={avatarurl} alt="Avatar preview" width={40} height={40} className="h-full w-full object-cover" onError={() => setAvatarurl("")} />
                  </div>
                )}
                <input type="url" value={avatarurl} onChange={e => setAvatarurl(e.target.value)}
                  placeholder="https://cdn.example.com/avatar.jpg"
                  className="flex-1 rounded-xl border border-border bg-card/50 px-4 py-2.5 text-sm outline-none placeholder:text-muted-foreground/40 focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-colors" />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-muted-foreground/60">URL Cover / Banner</label>
              <div className="space-y-2">
                {coverurl && (
                  <div className="relative h-20 overflow-hidden rounded-xl border border-border/50 bg-muted/20">
                    <Image src={coverurl} alt="Cover preview" fill className="object-cover" onError={() => setCoverurl("")} />
                  </div>
                )}
                <input type="url" value={coverurl} onChange={e => setCoverurl(e.target.value)}
                  placeholder="https://cdn.example.com/cover.jpg"
                  className="w-full rounded-xl border border-border bg-card/50 px-4 py-2.5 text-sm outline-none placeholder:text-muted-foreground/40 focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-colors" />
              </div>
              <p className="mt-1 text-[11px] text-muted-foreground/40">Saran: rasio 16:9, minimal 1280×360px</p>
            </div>

            {/* Info akun */}
            <div className="rounded-xl border border-border/40 bg-card/30 p-4 space-y-2">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground/50 mb-3">Info Akun</p>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground/60">Role</span>
                <span className={`rounded-full border px-2 py-0.5 text-[10px] font-black ${ROLE_COLOR[profile.role] ?? ROLE_COLOR.USER}`}>
                  {ROLE_LABEL[profile.role] ?? profile.role}
                </span>
              </div>
              {profile.supporterrole && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground/60">Supporter</span>
                  <span className={`text-xs font-bold ${SUPPORT_COLOR[profile.supporterrole]}`}>{profile.supporterrole}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground/60">Bergabung</span>
                <span className="text-xs text-muted-foreground/70">{joinDate}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="glass-card rounded-3xl p-6">
          <div className="flex items-center gap-2 mb-5">
            <Link2 className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-bold uppercase tracking-widest text-foreground/80">Sosial Media</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {SOCIAL_FIELDS.map(({ key, label, placeholder, Icon }) => (
              <div key={key}>
                <label className="mb-1.5 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground/60">
                  <Icon className="h-3.5 w-3.5" />{label}
                </label>
                <input type="text"
                  value={socials[key] ?? ""}
                  onChange={e => setSocials(prev => ({ ...prev, [key]: e.target.value }))}
                  placeholder={placeholder}
                  className="w-full rounded-xl border border-border bg-card/50 px-4 py-2.5 text-sm outline-none placeholder:text-muted-foreground/40 focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-colors" />
              </div>
            ))}
          </div>
        </div>

        {/* Save button (bottom) */}
        <div className="flex justify-end">
          <button onClick={handleSave} disabled={saving}
            className="flex items-center gap-2 rounded-xl bg-primary px-7 py-3 text-sm font-bold text-white shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 disabled:opacity-60 disabled:pointer-events-none">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {saving ? "Menyimpan…" : "Simpan Perubahan"}
          </button>
        </div>
      </div>
    </>
  );
}
