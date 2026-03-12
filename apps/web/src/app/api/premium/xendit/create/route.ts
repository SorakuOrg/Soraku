import { getSession } from '@/lib/auth'
import { ok, err, UNAUTHORIZED, SERVER_ERROR } from '@/lib/api'
import { NextRequest } from 'next/server'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

const TIERS = {
  VIP:  { amount: 50000,  label: 'Soraku VIP'  },
  VVIP: { amount: 100000, label: 'Soraku VVIP' },
} as const

const Schema = z.object({ tier: z.enum(['VIP','VVIP']) })

// POST /api/premium/xendit/create
export async function POST(req: NextRequest) {
  try {
    const session = await getSession()
    if (!session) return UNAUTHORIZED()

    const body   = await req.json()
    const parsed = Schema.safeParse(body)
    if (!parsed.success) return err(parsed.error.message)

    const { tier } = parsed.data
    const config   = TIERS[tier]
    const extId    = `soraku-${tier}-${session.id}-${Date.now()}`

    const res = await fetch('https://api.xendit.co/v2/invoices', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${Buffer.from(process.env.XENDIT_SECRET_KEY + ':').toString('base64')}`,
      },
      body: JSON.stringify({
        external_id:  extId,
        amount:       config.amount,
        description:  `${config.label} Membership — Soraku Community`,
        customer: { given_names: session.displayname ?? session.username ?? 'Member', email: session.email },
        invoice_duration:    86400,
        success_redirect_url: `${process.env.NEXT_PUBLIC_SITE_URL}/premium?status=success`,
        failure_redirect_url: `${process.env.NEXT_PUBLIC_SITE_URL}/premium?status=failed`,
      }),
    })

    if (!res.ok) return err('Gagal membuat invoice Xendit')
    const invoice = await res.json()
    return ok({ payment_url: invoice.invoice_url, external_id: extId })
  } catch { return SERVER_ERROR() }
}
