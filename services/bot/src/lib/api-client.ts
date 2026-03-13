/**
 * services/bot — API Client
 * Konek ke services/api. ENV Railway yang relevan:
 *   SORAKU_API_SECRET — internal secret
 *   SORAKU_WEB_URL    — URL web (fallback jika SORAKU_API_URL tidak diset)
 */

// SORAKU_API_URL belum ada di Railway → fallback ke SORAKU_WEB_URL
// Setelah Kaizo set SORAKU_API_URL di Railway, otomatis terbaca
const API_URL     = process.env.SORAKU_API_URL
                 ?? process.env.SORAKU_WEB_URL
                 ?? "http://localhost:3000"
const BOT_SECRET  = process.env.SORAKU_API_SECRET ?? ""

async function fetcher<T>(
  path: string,
  secret?: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_URL.replace(/\/$/, "")}${path}`
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> ?? {}),
  }
  if (secret) headers["x-soraku-secret"] = secret
  const res = await fetch(url, { ...options, headers })
  return res.json() as Promise<T>
}

function qs(p?: Record<string, string | number | boolean | undefined>): string {
  if (!p) return ""
  const s = new URLSearchParams()
  for (const [k, v] of Object.entries(p)) if (v !== undefined) s.set(k, String(v))
  const q = s.toString()
  return q ? `?${q}` : ""
}

export const api = {
  health:   () => fetcher("/api", BOT_SECRET),
  users: {
    get:    (id: string) => fetcher(`/api/users/${id}`, BOT_SECRET),
    update: (id: string, d: unknown) => fetcher(`/api/users/${id}`, BOT_SECRET, {
      method: "PATCH", body: JSON.stringify(d),
    }),
  },
  events: {
    list: (p?: { status?: string; page?: number; limit?: number }) =>
      fetcher(`/api/events${qs(p)}`, BOT_SECRET),
    get: (slug: string) => fetcher(`/api/events/${slug}`, BOT_SECRET),
  },
  vtubers: {
    list: () => fetcher("/api/vtubers", BOT_SECRET),
    get:  (slug: string) => fetcher(`/api/vtubers/${slug}`, BOT_SECRET),
  },
  premium: {
    leaderboard: () => fetcher("/api/premium?leaderboard=true", BOT_SECRET),
  },
}

export const apiInternal = {
  post: <T>(path: string, body: unknown) =>
    fetcher<T>(path, BOT_SECRET, { method: "POST", body: JSON.stringify(body) }),
}
