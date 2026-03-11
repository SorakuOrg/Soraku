import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";
import { Youtube, ArrowLeft } from "lucide-react";
import { XIcon } from "@/components/icons/custom-icons";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { data } = await (await db())
    .from("vtubers")
    .select("name,charactername,description")
    .eq("slug", slug)
    .eq("ispublished", true)
    .single();
  if (!data) return { title: "VTuber Not Found" };
  return {
    title: `${data.charactername ?? data.name} — Soraku VTubers`,
    description: data.description ?? undefined,
  };
}

export default async function VTuberDetailPage({ params }: Props) {
  const { slug } = await params;
  const { data: vt } = await (await db())
    .from("vtubers")
    .select("*")
    .eq("slug", slug)
    .eq("ispublished", true)
    .single();

  if (!vt) notFound();

  const socials = (vt.sociallinks ?? {}) as Record<string, string>;

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <Link href="/vtubers"
        className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4" /> Kembali ke VTubers
      </Link>

      <div className="glass-card overflow-hidden">
        {/* Cover */}
        {vt.coverurl && (
          <div className="relative h-48 w-full sm:h-64">
            <Image src={vt.coverurl} alt={vt.name} fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-card/90 to-transparent" />
          </div>
        )}

        <div className="p-6 sm:p-8">
          <div className="flex items-start gap-6">
            {/* Avatar */}
            {vt.avatarurl && (
              <div className={`relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-2xl border-2 border-primary/30 ${vt.coverurl ? "-mt-14" : ""}`}>
                <Image src={vt.avatarurl} alt={vt.charactername ?? vt.name} fill className="object-cover" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-black tracking-tight">{vt.charactername ?? vt.name}</h1>
              {vt.charactername && <p className="text-sm text-muted-foreground">CV: {vt.name}</p>}
              {vt.debutdate && (
                <p className="mt-1 text-xs text-muted-foreground/60">Debut: {formatDate(vt.debutdate)}</p>
              )}
              {vt.subscribercount && (
                <p className="mt-1 text-xs text-primary/80">{vt.subscribercount.toLocaleString("id-ID")} subscriber</p>
              )}
            </div>
          </div>

          {vt.description && (
            <p className="mt-6 text-sm leading-relaxed text-muted-foreground">{vt.description}</p>
          )}

          {/* Tags */}
          {vt.tags?.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {vt.tags.map((t: string) => (
                <span key={t} className="rounded-full bg-primary/10 px-3 py-1 text-xs text-primary">{t}</span>
              ))}
            </div>
          )}

          {/* Live badge */}
          {vt.islive && vt.liveurl && (
            <a href={vt.liveurl} target="_blank" rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-red-500/15 px-4 py-2.5 text-sm font-bold text-red-400 hover:bg-red-500/25 transition-colors">
              🔴 Sedang Live — Tonton Sekarang
            </a>
          )}

          {/* Social links */}
          {Object.keys(socials).length > 0 && (
            <div className="mt-6 flex items-center gap-3">
              {socials.youtube && (
                <a href={socials.youtube} target="_blank" rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card/50 text-muted-foreground hover:border-red-500/40 hover:text-red-400 transition-colors">
                  <Youtube className="h-4 w-4" />
                </a>
              )}
              {socials.twitter && (
                <a href={socials.twitter} target="_blank" rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card/50 text-muted-foreground hover:border-primary/40 hover:text-primary transition-colors">
                  <XIcon className="h-4 w-4" />
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
