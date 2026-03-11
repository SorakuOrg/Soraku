/**
 * src/middleware.ts
 * Next.js Edge Middleware — route protection Soraku
 * 
 * Next.js HANYA membaca file ini, bukan proxy.ts.
 * Logika auth diimport dari proxy.ts agar tetap modular.
 */

export { proxy as middleware, config } from '@/proxy'
