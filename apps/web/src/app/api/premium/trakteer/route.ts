import { adminDb } from '@/lib/supabase/admin'
import { NextRequest, NextResponse } from 'next/server'
import { env } from '@/env'

export const dynamic = 'force-dynamic'

// ─── Trakteer Webhook Format ────────────────────────────────────────────────
// Docs: https://trakteer.id/dashboard/webhook
// Header: trakteer-token (secret dari Trakteer Dashboard → Settings → Webhook)
// Body: { creator_id, supporter_name, supporter_email, amount, quantity,
//         unit_name, message, supporter_discord_id?, order_id, order_status }

const TIER_MAP: Record<number, 'DONATUR' | 'VIP' | 'VVIP'> = {
  10000:  'DONATUR',
  50000:  'VIP',
  100000: 'VVIP',
}

function resolveTier(amount: number): 'DONATUR' | 'VIP' | 'VVIP' {
  if (amount >= 100000) return 'VVIP'
  if (amount >= 50000)  return 'VIP'
  return 'DONATUR'
}

// POST /api/premium/trakteer
export async function POST(req: NextRequest) {
  try {
    // Verifikasi header Trakteer menggunakan TRAKTEER_WEBHOOK_SECRET
    const token = req.headers.get('trakteer-token') ?? req.headers.get('x-trakteer-token')
    if (!env.TRAKTEER_WEBHOOK_SECRET || token !== env.TRAKTEER_WEBHOOK_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()

    // Hanya proses order yang sukses
    if (body.order_status !== 'success' && body.order_status !== 'paid') {
      return NextResponse.json({ received: true, action: 'skipped' })
    }

    const amount      = Number(body.amount) * Number(body.quantity ?? 1)
    const tier        = resolveTier(amount)
    const discordId   = body.supporter_discord_id ?? null
    const displayName = body.supporter_name ?? 'Anonim'
    const orderId     = body.order_id ?? null

    // Cari user berdasarkan discord_id jika ada
    let userId: string | null = null
    if (discordId) {
      const { data: found } = await adminDb()
        .from('users')
        .select('id')
        .eq('sociallinks->>discord', discordId)
        .maybeSingle()
      userId = found?.id ?? null
    }

    const now    = new Date()
    const expiry = new Date(now)
    expiry.setMonth(expiry.getMonth() + 1)

    // Update supporter_tier jika user ditemukan
    if (userId) {
      await adminDb().from('users').update({
        supporterrole:   tier,
        supportersince:  now.toISOString(),
        supporteruntil:  expiry.toISOString(),
        supportersource: 'trakteer',
      }).eq('id', userId)

      // Catat supporterhistory
      await adminDb().from('supporterhistory').insert({
        userid:      userId,
        action:      'grant',
        tier,
        source:      'trakteer' as const,
        amount,
        referenceid: orderId,
        expiresat:   expiry.toISOString(),
      })

      // Kirim notif in-app
      await adminDb().from('notifications').insert({
        userid: userId,
        type:   'premium',
        title:  `Terima kasih, ${tier} kamu aktif!`,
        body:   `Donasi ${new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(amount)} via Trakteer berhasil. Role ${tier} aktif hingga ${expiry.toLocaleDateString('id-ID')}.`,
        href:   '/premium',
        isread: false,
      })
    }

    // Catat ke tabel donatur (public leaderboard)
    await adminDb().from('donatur').insert({
      userid:      userId,
      displayname: displayName,
      amount,
      tier,
      message:  body.message ?? null,
      ispublic: true,
    })

    // Trigger bot Discord jika discordId ada
    const botUrl    = process.env.BOT_WEBHOOK_URL
    const botSecret = process.env.BOT_WEBHOOK_SECRET

    if (botUrl && botSecret && discordId) {
      const roleId = {
        DONATUR: '1436534227708543046',
        VIP:     '1447194092965728307',
        VVIP:    '1447194196401459320',
      }[tier]

      // Update role Discord
      await fetch(`${botUrl}/webhook/role-update`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', 'x-soraku-secret': botSecret },
        body:    JSON.stringify({ discordId, addRoleId: roleId }),
      }).catch(e => console.error('[trakteer] bot role-update error:', e))

      // Kirim DM
      const rupiah = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(amount)
      const msg = [
        `✨ **Terima kasih sudah mendukung Soraku, ${displayName}!**`,
        '',
        `Kamu sekarang adalah **${tier}** member Soraku 💜`,
        `Donasi: **${rupiah}** via Trakteer`,
        body.message ? `Pesan: _${body.message}_` : '',
        '',
        `Role Discord kamu akan diupdate dalam beberapa detik.`,
        `🌐 https://soraku.vercel.app/premium`,
      ].filter(l => l !== undefined).join('\n')

      await fetch(`${botUrl}/webhook/notify`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', 'x-soraku-secret': botSecret },
        body:    JSON.stringify({ discordId, message: msg }),
      }).catch(e => console.error('[trakteer] bot notify error:', e))
    }

    return NextResponse.json({ received: true, tier, userId })
  } catch (e) {
    console.error('[trakteer/webhook]', e)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
