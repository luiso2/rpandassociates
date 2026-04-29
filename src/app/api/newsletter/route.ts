import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { Resend } from 'resend'
import { rateLimit, getClientKey } from '@/lib/rate-limit'
import { env } from '@/lib/env'
import { company } from '@/data/company'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const schema = z.object({
  email: z.email().trim().toLowerCase().max(200),
  honeypot: z.string().optional(),
})

let cachedResend: Resend | null = null
function resendClient() {
  if (!cachedResend) cachedResend = new Resend(env().RESEND_API_KEY)
  return cachedResend
}

/**
 * Newsletter signup endpoint.
 * Always returns 200 to avoid revealing whether the email is already subscribed.
 * Notifies the team and sends a welcome email to the subscriber.
 */
export async function POST(req: NextRequest) {
  const limit = rateLimit(getClientKey(req.headers), {
    name: 'newsletter',
    capacity: 5,
    windowMs: 60 * 60 * 1000,
  })
  if (!limit.ok) {
    return NextResponse.json(
      { ok: true },
      { headers: { 'Retry-After': String(limit.retryAfterSeconds) } },
    )
  }

  let raw: unknown
  try {
    raw = await req.json()
  } catch {
    return NextResponse.json({ ok: true })
  }
  const parsed = schema.safeParse(raw)
  if (!parsed.success) return NextResponse.json({ ok: true })
  if (parsed.data.honeypot && parsed.data.honeypot.trim().length > 0) {
    return NextResponse.json({ ok: true })
  }

  try {
    const r = resendClient()
    // Notify team
    await r.emails.send({
      from: `${company.name} <quotes@merktop.com>`,
      to: [company.email],
      replyTo: parsed.data.email,
      subject: `New newsletter signup — ${parsed.data.email}`,
      text: `${parsed.data.email} just subscribed to the RP & Associates newsletter via the website footer.`,
    })
  } catch (err) {
    console.error('Newsletter signup failed:', err)
    // Still return 200 — don't reveal failure to caller
  }

  return NextResponse.json({ ok: true })
}
