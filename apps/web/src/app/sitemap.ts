import type { MetadataRoute } from "next";
import { MOCK_POSTS, MOCK_EVENTS } from "@/lib/mock-data";

const BASE = process.env.NEXT_PUBLIC_APP_URL ?? "https://soraku.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    { url: BASE, priority: 1.0 },
    { url: `${BASE}/about`, priority: 0.8 },
    { url: `${BASE}/blog`, priority: 0.9 },
    { url: `${BASE}/events`, priority: 0.9 },
    { url: `${BASE}/gallery`, priority: 0.8 },
    { url: `${BASE}/agensi`, priority: 0.7 },
    { url: `${BASE}/agensi/vtuber`, priority: 0.7 },
    { url: `${BASE}/premium`, priority: 0.7 },
    { url: `${BASE}/donate`, priority: 0.6 },
    { url: `${BASE}/premium/donatur`, priority: 0.6 },
  ].map((p) => ({ ...p, lastModified: new Date(), changeFrequency: "weekly" as const }));

  const blogPages = MOCK_POSTS.map((p) => ({
    url: `${BASE}/blog/${p.slug}`,
    lastModified: new Date(p.published_at),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const eventPages = MOCK_EVENTS.map((e) => ({
    url: `${BASE}/events/${e.slug}`,
    lastModified: new Date(e.starts_at),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...blogPages, ...eventPages];
}
