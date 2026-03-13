import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { donatur } from "@/lib/db/schema"
import { XenditCreateSchema, TrakteerWebhookSchema } from "@/lib/validators"
import { verifyAuth, verifySecret, unauthorized } from "@/lib/auth"
import { env } from "@/env"
import { createHash } from "crypto"
import { desc, eq } from "drizzle-orm"

export const dynamic = "force-dynamic"

// POST /api/donate/xendit/create — buat invoice Xendit
export async function createXendit(req: NextRequest) {
  const auth = await verifyAuth(req)
  if ("error" in auth) return unauthorized()

  const body = await req.json()
  const parsed = XenditCreateSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ data: null, error: parsed.error.issues[0]?.message }, { status: 400 })

  if (!env.XENDIT_SECRET_KEY) return NextResponse.json({ data: null, error: "Payment not configured" }, { status: 503 })

  const { amount, displayname, message, tier } = parsed.data
  const externalId = `soraku-${Date.now()}`

  const xenditRes = await fetch("https://api.xendit.co/v2/invoices", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${Buffer.from(env.XENDIT_SECRET_KEY + ":").toString("base64")}`,
    },
    body: JSON.stringify({
      external_id: externalId,
      amount,
      description: `Soraku ${tier} - ${displayname}`,
      customer: { given_names: displayname },
      success_redirect_url: `${process.env.NEXT_PUBLIC_SITE_URL}/donate?status=success`,
      failure_redirect_url: `${process.env.NEXT_PUBLIC_SITE_URL}/donate?status=failed`,
    }),
  })

  const invoice = await xenditRes.json()
  return NextResponse.json({ data: { invoiceUrl: invoice.invoice_url, externalId }, error: null })
}

// POST /api/donate/xendit/webhook — Xendit callback setelah bayar
export async function xenditWebhook(req: NextRequest) {
  const token = req.headers.get("x-callback-token")
  if (token !== env.XENDIT_SECRET_KEY) return NextResponse.json({ error: "Invalid token" }, { status: 401 })

  const body = await req.json()
  if (body.status !== "PAID") return NextResponse.json({ ok: true })

  // Insert ke tabel donatur
  await db.insert(donatur).values({
    displayname: body.customer?.given_names ?? "Anon",
    amount:      body.paid_amount,
    ispublic:    true,
  })

  return NextResponse.json({ ok: true })
}

// POST /api/donate/trakteer — Trakteer webhook
export async function trakteerWebhook(req: NextRequest) {
  if (!env.TRAKTEER_WEBHOOK_TOKEN) return NextResponse.json({ error: "Not configured" }, { status: 503 })

  const sig = req.headers.get("x-trakteer-signature") ?? ""
  const body = await req.text()
  const expected = createHash("sha256").update(env.TRAKTEER_WEBHOOK_TOKEN + body).digest("hex")
  if (sig !== expected) return NextResponse.json({ error: "Invalid signature" }, { status: 401 })

  const parsed = TrakteerWebhookSchema.safeParse(JSON.parse(body))
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 })

  const { supporter_name, supporter_message, total } = parsed.data
  await db.insert(donatur).values({
    displayname: supporter_name,
    amount:      Math.round(total * 1000), // Trakteer dalam unit coffee → konvert ke IDR
    message:     supporter_message,
    ispublic:    true,
  })

  return NextResponse.json({ ok: true })
}
