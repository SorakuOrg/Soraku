/**
 * services/bot — API Client (inline, tidak pakai @soraku/utils)
 * Docker standalone build tidak resolve workspace packages.
 */

const API_URL     = process.env.SORAKU_API_URL    ?? "http://localhost:4000"
const BOT_SECRET  = process.env.SORAKU_API_SECRET ?? ""
const BOT_API_KEY = process.env.BOT_API_KEY       ?? ""

async function fetcher<T>(
  path: string,
  token?: string,
  secret?: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_URL.replace(/\/$/, "")}${path}`
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> ?? {}),
  }
  if (token)  headers["Authorization"]   = `Bearer ${token}`
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

/** Client bot — pakai API Key */
export const api = {
  health:   ()                   => fetcher("/api",                              undefined, BOT_SECRET),
  users: {
    get:    (id: string)         => fetcher(`/api/users/${id}`,                  BOT_API_KEY),
    update: (id: string, d: unknown) => fetcher(`/api/users/${id}`,             BOT_API_KEY, undefined, { method: "PATCH", body: JSON.stringify(d) }),
  },
  events:  {
    list:   (p?: { status?: string; page?: number; limit?: number }) =>
      fetcher(`/api/events${qs(p)}`, BOT_API_KEY),
    get:    (slug: string)       => fetcher(`/api/events/${slug}`,               BOT_API_KEY),
  },
  vtubers: {
    list:   ()                   => fetcher("/api/vtubers",                       BOT_API_KEY),
    get:    (slug: string)       => fetcher(`/api/vtubers/${slug}`,              BOT_API_KEY),
  },
  premium: {
    leaderboard: ()              => fetcher("/api/premium?leaderboard=true",      BOT_API_KEY),
  },
}

/** Client internal — untuk webhook ke web */
export const apiInternal = {
  post: <T>(path: string, body: unknown) =>
    fetcher<T>(path, undefined, BOT_SECRET, { method: "POST", body: JSON.stringify(body) }),
}
