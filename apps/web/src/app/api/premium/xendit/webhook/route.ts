import { adminDb } from '@/lib/supabase/admin'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// POST /api/premium/xendit/webhook
export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get('x-callback-token')
    if (token !== process.env.XENDIT_WEBHOOK_TOKEN)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body   = await req.json()
    if (body.status !== 'PAID') return NextResponse.json({ received: true })

    // external_id: soraku-VIP-{userId}-{timestamp}
    const parts  = (body.external_id as string).split('-')
    const tier   = parts[1] as 'VIP' | 'VVIP'
    const userId = parts[2]

    if (!userId || !['VIP','VVIP'].includes(tier))
      return NextResponse.json({ error: 'Invalid external_id' }, { status: 400 })

    const now    = new Date()
    const expiry = new Date(now)
    expiry.setMonth(expiry.getMonth() + 1)

    // Update users.supporterrole
    await adminDb().from('users').update({
      supporterrole:   tier,
      supportersince:  now.toISOString(),
      supporteruntil:  expiry.toISOString(),
      supportersource: 'xendit',
    }).eq('id', userId)

    // Catat donatur
    await adminDb().from('donatur').insert({
      userid:      userId,
      displayname: body.customer?.given_names ?? 'Member',
      amount:      body.amount,
      tier,
      ispublic:    true,
    })

    // Catat supporterhistory
    await adminDb().from('supporterhistory').insert({
      userid: userId, action: 'grant', tier,
      source: 'xendit', amount: body.amount,
      referenceid: body.id, expiresat: expiry.toISOString(),
    })

    return NextResponse.json({ received: true })
  } catch (e) {
    console.error('[xendit/webhook]', e)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
