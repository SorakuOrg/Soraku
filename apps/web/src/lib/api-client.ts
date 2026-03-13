/**
 * apps/web — API Client
 * Koneksi ke services/api sebagai sumber data utama.
 *
 * Pakai di Server Components atau API Routes:
 *   import { api } from "@/lib/api-client"
 *   const { data } = await api.blog.list({ tag: "anime" })
 *
 * Pakai dengan auth user (Server Component):
 *   import { apiWithToken } from "@/lib/api-client"
 *   const session = await getSession()
 *   const { data } = await apiWithToken(session?.accessToken).premium.status()
 */
import { createApiClient } from "@soraku/utils"
import { env } from "@/env"

/** Client publik — untuk data yang tidak perlu auth */
export const api = createApiClient({ baseUrl: env.API_URL })

/** Client dengan Supabase JWT user — untuk data private/premium */
export function apiWithToken(token: string | undefined) {
  return createApiClient({ baseUrl: env.API_URL, token })
}

/** Client internal — untuk komunikasi web ↔ bot via secret */
export function apiInternal() {
  return createApiClient({
    baseUrl:        env.API_URL,
    internalSecret: env.SORAKU_API_SECRET ?? "",
  })
}
