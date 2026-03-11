import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Youtube, Instagram, Twitter } from "lucide-react";
import { db } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Agensi — Soraku Community",
  description: "Talent management Soraku Community — VTuber, kreator, cosplayer, dan musisi Indonesia.",
};

type VtuberRow = {
  id: string; slug: string; name: string; charactername: string | null;
  avatarurl: string | null; description: string | null; debutdate: string | null;
  tags: string[] | null; sociallinks: Record<string, string> | null;
  isactive: boolean; islive: boolean;
};

function VtuberCard({ v }: { v: VtuberRow }) {
  const socials = v.sociallinks ?? {};
  return (
    <div className="glass-card overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
      <div className="h-28 bg-gradient-to-br from-primary/15 via-accent/8 to-violet-500/10 relative">
        <span className="absolute inset-0 flex items-center justify-center text-4xl opacity-10">空</span>
        <div className="absolute bottom-0 left-6 translate-y-1/2">
          {v.avatarurl ? (
            <div className="h-16 w-16 rounded-2xl border-4 border-background overflow-hidden shadow-lg relative">
              <Image src={v.avatarurl} alt={v.charactername ?? v.name} fill className="object-cover" sizes="64px" />
            </div>
          ) : (
            <div className="h-16 w-16 rounded-2xl border-4 border-background bg-gradient-to-br from-violet-500/30 to-accent/20 flex items-center justify-center text-2xl shadow-lg">
              ✨
            </div>
          )}
        </div>
        <div className="absolute top-3 right-3">
          <span className="rounded-full border px-2.5 py-0.5 text-xs font-semibold text-violet-400 border-violet-500/30 bg-violet-500/8">
            VTuber
          </span>
        </div>
        {v.islive && (
          <div className="absolute top-3 left-3">
            <span className="flex items-center gap-1 rounded-full bg-red-500/90 px-2 py-0.5 text-[10px] font-bold text-white">
              <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" /> LIVE
            </span>
          </div>
        )}
      </div>

      <div className="px-6 pb-6 pt-10">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-bold group-hover:text-primary transition-colors">
              {v.charactername ?? v.name}
            </h3>
            {v.debutdate && (
              <p className="text-xs text-muted-foreground">Sejak {new Date(v.debutdate).getFullYear()}</p>
            )}
          </div>
          <span className={`text-xs font-medium ${v.isactive ? "text-green-400" : "text-muted-foreground"}`}>
            {v.isactive ? "● Aktif" : "○ Tidak aktif"}
          </span>
        </div>

        <p className="mt-3 text-sm text-muted-foreground/80 line-clamp-2 leading-relaxed">{v.description}</p>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {(v.tags ?? []).slice(0, 3).map((t) => (
            <span key={t} className="rounded-full border border-border px-2 py-0.5 text-xs text-muted-foreground">{t}</span>
          ))}
        </div>

        <div className="mt-4 flex items-center gap-2">
          {socials.youtube && (
            <a href={socials.youtube} target="_blank" rel="noopener noreferrer"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-500/30 bg-red-500/8 text-red-400 hover:bg-red-500/15 transition-colors">
              <Youtube className="h-3.5 w-3.5" />
            </a>
          )}
          {socials.instagram && (
            <a href={socials.instagram} target="_blank" rel="noopener noreferrer"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-rose-500/30 bg-rose-500/8 text-rose-400 hover:bg-rose-500/15 transition-colors">
              <Instagram className="h-3.5 w-3.5" />
            </a>
          )}
          {socials.twitter && (
            <a href={socials.twitter} target="_blank" rel="noopener noreferrer"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-sky-500/30 bg-sky-500/8 text-sky-400 hover:bg-sky-500/15 transition-colors">
              <Twitter className="h-3.5 w-3.5" />
            </a>
          )}
          <Link href={`/vtubers/${v.slug}`}
            className="ml-auto rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/20 transition-colors">
            Profil VTuber
          </Link>
        </div>
      </div>
    </div>
  );
}

export default async function AgensiPage() {
  const { data: vtubers } = await (await db())
    .from("vtubers")
    .select("id,slug,name,charactername,avatarurl,description,debutdate,tags,sociallinks,isactive,islive")
    .eq("ispublished", true)
    .order("createdat", { ascending: true });

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-12 text-center">
        <p className="mb-3 text-xs font-bold uppercase tracking-widest text-primary/70">Platform</p>
        <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
          Agensi <span className="text-gradient">Soraku</span>
        </h1>
        <p className="mt-4 max-w-xl mx-auto text-muted-foreground">
          Talent management Soraku Community — mendukung kreator, VTuber, cosplayer, dan musisi Indonesia.
        </p>
        <Link href="/vtubers"
          className="mt-5 inline-flex items-center gap-2 rounded-xl border border-violet-500/30 bg-violet-500/8 px-5 py-2.5 text-sm font-medium text-violet-300 hover:bg-violet-500/15 transition-colors">
          ✨ Lihat VTuber →
        </Link>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {(vtubers ?? []).map((v) => <VtuberCard key={v.id} v={v} />)}
        <div className="glass-card flex flex-col items-center justify-center p-8 text-center border-dashed border-2 border-border hover:border-primary/30 transition-colors">
          <span className="text-4xl mb-3">🌸</span>
          <p className="font-medium text-muted-foreground">Talent Baru</p>
          <p className="text-xs text-muted-foreground/50 mt-1">Segera bergabung</p>
        </div>
      </div>

      <div className="mt-16 glass-card px-8 py-10 text-center">
        <p className="text-xs font-bold uppercase tracking-widest text-primary/70 mb-3">Bergabung</p>
        <h2 className="text-2xl font-bold">Ingin Menjadi Talent Soraku?</h2>
        <p className="mt-2 text-muted-foreground">Kami selalu terbuka untuk kreator baru. Hubungi kami di Discord!</p>
        <a href="https://discord.gg/qm3XJvRa6B" target="_blank" rel="noopener noreferrer"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white hover:bg-indigo-700 transition-colors">
          Hubungi via Discord
        </a>
      </div>
    </div>
  );
}
