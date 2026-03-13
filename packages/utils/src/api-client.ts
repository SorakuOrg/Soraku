/**
 * @soraku/utils — Shared API Client
 *
 * Dipakai oleh semua apps dan services:
 *   - apps/web     → import { createApiClient } from "@soraku/utils"
 *   - apps/stream  → import { createApiClient } from "@soraku/utils"
 *   - apps/mobile  → import { createApiClient } from "@soraku/utils"
 *   - services/bot → import { createApiClient } from "@soraku/utils"
 */

import type {
  ApiResponse,
  PaginatedResponse,
  User,
  Post,
  Event,
  GalleryItem,
  VTuber,
  StreamContent,
  Donatur,
  PremiumStatus,
} from "@soraku/types"

// ── Config ────────────────────────────────────────────────────
export interface ApiClientConfig {
  /** Base URL services/api — e.g. https://soraku-api.vercel.app */
  baseUrl: string
  /**
   * Token auth — salah satu dari:
   * - Supabase JWT (user login)
   * - API Key bot/mobile (sk_xxx / bot_xxx)
   * - Internal secret (x-soraku-secret)
   */
  token?: string
  /** Untuk bot/internal — pakai x-soraku-secret header */
  internalSecret?: string
}

// ── Core Fetcher ──────────────────────────────────────────────
async function fetcher<T>(
  config: ApiClientConfig,
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${config.baseUrl}${path}`

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> ?? {}),
  }

  if (config.token) {
    headers["Authorization"] = `Bearer ${config.token}`
  }

  if (config.internalSecret) {
    headers["x-soraku-secret"] = config.internalSecret
  }

  const res = await fetch(url, { ...options, headers })

  if (!res.ok && res.status !== 404) {
    throw new Error(`API error ${res.status}: ${path}`)
  }

  return res.json() as Promise<T>
}

// ── Client Factory ────────────────────────────────────────────
export function createApiClient(config: ApiClientConfig) {
  const get  = <T>(path: string) => fetcher<T>(config, path)
  const post = <T>(path: string, body: unknown) =>
    fetcher<T>(config, path, { method: "POST", body: JSON.stringify(body) })
  const patch = <T>(path: string, body: unknown) =>
    fetcher<T>(config, path, { method: "PATCH", body: JSON.stringify(body) })

  return {
    // ── Health ──────────────────────────────────────────────
    health: () =>
      get<{ status: string; version: string }>("/api"),

    // ── Users ───────────────────────────────────────────────
    users: {
      get: (username: string) =>
        get<ApiResponse<User>>(`/api/users/${username}`),
      update: (username: string, data: Partial<User>) =>
        patch<ApiResponse<User>>(`/api/users/${username}`, data),
    },

    // ── Premium ─────────────────────────────────────────────
    premium: {
      status: () =>
        get<ApiResponse<PremiumStatus>>("/api/premium"),
      leaderboard: () =>
        get<ApiResponse<Donatur[]>>("/api/premium?leaderboard=true"),
    },

    // ── VTubers ─────────────────────────────────────────────
    vtubers: {
      list: () =>
        get<ApiResponse<VTuber[]>>("/api/vtubers"),
      get: (slug: string) =>
        get<ApiResponse<VTuber>>(`/api/vtubers/${slug}`),
    },

    // ── Events ──────────────────────────────────────────────
    events: {
      list: (params?: { status?: string; page?: number; limit?: number }) => {
        const q = new URLSearchParams(params as Record<string, string>).toString()
        return get<ApiResponse<Event[]>>(`/api/events${q ? "?" + q : ""}`)
      },
      get: (slug: string) =>
        get<ApiResponse<Event>>(`/api/events/${slug}`),
    },

    // ── Blog ────────────────────────────────────────────────
    blog: {
      list: (params?: { search?: string; tag?: string; page?: number; limit?: number }) => {
        const q = new URLSearchParams(params as Record<string, string>).toString()
        return get<ApiResponse<Post[]>>(`/api/blog${q ? "?" + q : ""}`)
      },
      get: (slug: string) =>
        get<ApiResponse<Post>>(`/api/blog/${slug}`),
    },

    // ── Gallery ─────────────────────────────────────────────
    gallery: {
      list: (params?: { tag?: string; page?: number; limit?: number }) => {
        const q = new URLSearchParams(params as Record<string, string>).toString()
        return get<ApiResponse<GalleryItem[]>>(`/api/gallery${q ? "?" + q : ""}`)
      },
    },

    // ── Stream ──────────────────────────────────────────────
    stream: {
      list: (params?: { type?: string; vtuberid?: string; ispremium?: boolean; page?: number; limit?: number }) => {
        const q = new URLSearchParams(params as Record<string, string>).toString()
        return get<ApiResponse<StreamContent[]>>(`/api/stream${q ? "?" + q : ""}`)
      },
      get: (slug: string) =>
        get<ApiResponse<StreamContent>>(`/api/stream/${slug}`),
    },

    // ── Donate ──────────────────────────────────────────────
    donate: {
      createXendit: (data: { amount: number; displayname: string; tier: string; message?: string }) =>
        post<ApiResponse<{ invoiceUrl: string; externalId: string }>>("/api/donate/xendit/create", data),
    },
  }
}

// ── Type export ───────────────────────────────────────────────
export type SorakuApiClient = ReturnType<typeof createApiClient>
