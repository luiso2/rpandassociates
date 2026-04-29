import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { rateLimit, getClientKey } from '@/lib/rate-limit'
import { sendQuoteRequest } from '@/lib/resend'
import type { QuoteFormPayload } from '@/types/quote'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const cartItemSchema = z.object({
  productSlug: z.string().min(1).max(120),
  productName: z.string().min(1).max(200),
  productImage: z.string().min(1).max(500),
  quantity: z.number().int().min(1).max(1_000_000),
  notes: z.string().max(500).optional(),
  addedAt: z.number().int().nonnegative(),
})

const payloadSchema = z.object({
  firstName: z.string().trim().min(1).max(80),
  lastName: z.string().trim().min(1).max(80),
  company: z.string().trim().min(1).max(150),
  title: z.string().trim().max(120).optional().or(z.literal('')),
  email: z.email().trim().toLowerCase().max(200),
  phone: z.string().trim().min(7).max(40),
  productsOfInterest: z.string().trim().max(2000).optional().or(z.literal('')),
  cartItems: z.array(cartItemSchema).max(50).optional(),
  source: z.enum([
    'homepage',
    'quote-page',
    'cart-drawer',
    'chat-form-fill',
    'product-page',
  ]),
  honeypot: z.string().optional(),
})

export async function POST(req: NextRequest) {
  // Rate limit — 5 submissions per IP per hour
  const limit = rateLimit(getClientKey(req.headers), {
    name: 'quote',
    capacity: 5,
    windowMs: 60 * 60 * 1000,
  })
  if (!limit.ok) {
    return NextResponse.json(
      { ok: false, error: 'Too many requests. Please try again later.' },
      {
        status: 429,
        headers: { 'Retry-After': String(limit.retryAfterSeconds) },
      },
    )
  }

  let raw: unknown
  try {
    raw = await req.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON' }, { status: 400 })
  }

  const parsed = payloadSchema.safeParse(raw)
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: 'Invalid payload', issues: z.flattenError(parsed.error) },
      { status: 400 },
    )
  }

  // Honeypot — silently 200 to confuse bots
  if (parsed.data.honeypot && parsed.data.honeypot.trim().length > 0) {
    return NextResponse.json({ ok: true, ticketId: 'noop' })
  }

  try {
    const result = await sendQuoteRequest(parsed.data as QuoteFormPayload)
    return NextResponse.json(result)
  } catch (err) {
    console.error('Quote send failed:', err)
    return NextResponse.json(
      {
        ok: false,
        error:
          'Could not send your request. Please try again or call us directly.',
      },
      { status: 502 },
    )
  }
}
