/**
 * apps/web — API Client
 * Koneksi ke services/api sebagai sumber data utama.
 *
 * Pakai di Server Components atau API Routes:
 *   import { api } from "@/lib/api-client"
 *   const { data } = await api.blog.list({ tag: "anime" })
 */
import { createApiClient } from "@soraku/utils"

const API_URL = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000"

/** Client tanpa auth — untuk data publik */
export const api = createApiClient({ baseUrl: API_URL })

/** Client dengan Supabase JWT — untuk data private/premium */
export function apiWithToken(token: string) {
  return createApiClient({ baseUrl: API_URL, token })
}

/** Client dengan internal secret — untuk komunikasi bot/webhook */
export function apiInternal() {
  return createApiClient({
    baseUrl: API_URL,
    internalSecret: process.env.SORAKU_API_SECRET ?? "",
  })
}
