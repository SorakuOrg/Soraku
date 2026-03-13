/**
 * apps/stream — API Client
 * Koneksi ke services/api untuk data streaming.
 *
 * Pakai di Server Components:
 *   import { api } from "@/lib/api-client"
 *   const { data } = await api.stream.list({ type: "vod" })
 *   const { data: content } = await api.stream.get(slug)
 *   // content.hlsurl → feed ke HLS.js player
 */
import { createApiClient } from "@soraku/utils"

const API_URL = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000"

/** Client publik — konten non-premium */
export const api = createApiClient({ baseUrl: API_URL })

/** Client dengan JWT user — untuk akses konten premium */
export function apiWithToken(token: string) {
  return createApiClient({ baseUrl: API_URL, token })
}
