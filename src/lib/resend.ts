import { Resend } from 'resend'
import { env } from './env'
import { company } from '@/data/company'
import type { QuoteFormPayload } from '@/types/quote'

let cachedClient: Resend | null = null
function client() {
  if (!cachedClient) cachedClient = new Resend(env().RESEND_API_KEY)
  return cachedClient
}

/**
 * Sender domain. merktop.com is verified on Resend (per Jose's setup).
 * Once rpandassociates.com DNS is verified, swap to a quotes@rpassociates.us sender.
 */
const SENDER = `${company.name} <quotes@merktop.com>`
const INTERNAL_RECIPIENT = company.quoteEmail

export async function sendQuoteRequest(payload: QuoteFormPayload) {
  const r = client()

  // If the user came from /customize, the rendered canvas arrives as a
  // base64 data URL. Decode it once into a Buffer for the Resend
  // attachment field, derive the filename + mime, and embed it inline
  // in the HTML via a Content-ID so it shows up alongside the form
  // data instead of as just an attachment icon.
  const designAttachment = payload.customDesign
    ? buildDesignAttachment(payload.customDesign)
    : null

  // 1) Internal notification — to the team
  const internalResult = await r.emails.send({
    from: SENDER,
    to: [INTERNAL_RECIPIENT],
    replyTo: payload.email,
    subject: `New Quote Request — ${payload.firstName} ${payload.lastName} (${payload.company})`,
    html: renderInternalEmail(payload, designAttachment?.cid),
    text: renderInternalEmailText(payload),
    ...(designAttachment
      ? {
          attachments: [
            {
              filename: designAttachment.filename,
              content: designAttachment.buffer,
              contentType: designAttachment.mime,
            },
          ],
        }
      : {}),
  })
  if (internalResult.error) throw internalResult.error

  // 2) Confirmation to the user — non-blocking
  await r.emails
    .send({
      from: SENDER,
      to: [payload.email],
      replyTo: INTERNAL_RECIPIENT,
      subject: `We got it — your ${company.name} quote request`,
      html: renderConfirmationEmail(payload),
      text: renderConfirmationEmailText(payload),
    })
    .catch((err) => {
      console.error('Confirmation email failed:', err)
    })

  return { ok: true as const, ticketId: internalResult.data?.id ?? null }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

/**
 * Decode a "data:image/png;base64,..." URL into the bits we need to
 * pass to Resend's attachments field, plus a stable filename derived
 * from the product slug.
 */
function buildDesignAttachment(d: NonNullable<QuoteFormPayload['customDesign']>) {
  const match = d.dataUrl.match(/^data:image\/(png|jpeg|webp);base64,(.*)$/)
  if (!match) return null
  const [, ext, b64] = match
  const buffer = Buffer.from(b64, 'base64')
  const safeSlug = d.productSlug.replace(/[^a-z0-9-]/gi, '').slice(0, 60) || 'design'
  return {
    filename: `rp-${safeSlug}-design.${ext === 'jpeg' ? 'jpg' : ext}`,
    mime: `image/${ext}`,
    buffer,
    cid: `rp-design-${safeSlug}@rpandassociates`,
  }
}

function renderInternalEmail(p: QuoteFormPayload, designCid?: string): string {
  const fields: Array<[string, string | undefined]> = [
    ['Name', `${p.firstName} ${p.lastName}`],
    ['Company', p.company],
    ['Title', p.title],
    ['Email', p.email],
    ['Phone', p.phone],
    ['Source', p.source],
    ['Products of Interest', p.productsOfInterest],
  ]
  const rows = fields
    .filter(([, v]) => v && v.trim())
    .map(
      ([k, v]) => `
      <tr>
        <td style="padding:10px 14px;border-bottom:1px solid #eee;font-weight:600;color:#555;width:160px;">${k}</td>
        <td style="padding:10px 14px;border-bottom:1px solid #eee;color:#1a1a2e;white-space:pre-wrap;">${escapeHtml(v ?? '')}</td>
      </tr>
    `,
    )
    .join('')
  const cartRows = (p.cartItems ?? [])
    .map(
      (it) => `
      <tr>
        <td style="padding:8px 14px;color:#1a1a2e;">${escapeHtml(it.productName)}</td>
        <td style="padding:8px 14px;color:#1a1a2e;text-align:right;">${it.quantity.toLocaleString()}</td>
      </tr>
    `,
    )
    .join('')
  const cartBlock = cartRows
    ? `
    <h3 style="font-family:Inter,Arial,sans-serif;color:#0029cc;margin:24px 0 8px;">Quote Cart Items</h3>
    <table style="width:100%;border-collapse:collapse;border:1px solid #eee;font-family:Inter,Arial,sans-serif;font-size:14px;">
      <thead><tr style="background:#f5f6fb;"><th style="padding:8px 14px;text-align:left;">Product</th><th style="padding:8px 14px;text-align:right;">Qty</th></tr></thead>
      <tbody>${cartRows}</tbody>
    </table>
  `
    : ''
  const designBlock =
    p.customDesign && designCid
      ? `
    <h3 style="font-family:Inter,Arial,sans-serif;color:#0029cc;margin:24px 0 8px;">Custom Design Preview</h3>
    <div style="font-family:Inter,Arial,sans-serif;font-size:13px;color:#1a1a2e;margin-bottom:10px;">
      Product: <strong>${escapeHtml(p.customDesign.productName)}</strong> — rendered from the visualizer.
    </div>
    <img src="cid:${designCid}" alt="Custom design preview" style="max-width:100%;border:1px solid #eee;border-radius:8px;display:block;" />
  `
      : ''
  return `
    <!DOCTYPE html>
    <html><body style="font-family:Inter,Arial,sans-serif;background:#f5f6fb;padding:32px;color:#1a1a2e;">
      <div style="max-width:640px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 16px rgba(0,0,0,0.06);">
        <div style="background:linear-gradient(135deg,#0029cc,#4466ff);padding:24px 28px;color:#fff;">
          <div style="font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#DFC06A;margin-bottom:6px;">New Quote Request</div>
          <h1 style="margin:0;font-size:24px;font-weight:800;">${escapeHtml(p.firstName)} ${escapeHtml(p.lastName)}</h1>
          <div style="opacity:.85;margin-top:4px;">${escapeHtml(p.company)}</div>
        </div>
        <table style="width:100%;border-collapse:collapse;font-size:14px;">${rows}</table>
        <div style="padding:0 14px 24px;">${cartBlock}${designBlock}</div>
        <div style="padding:18px 28px;background:#f5f6fb;font-size:12px;color:#7a7a96;border-top:1px solid #eee;">
          Reply directly to this email to reach <strong>${escapeHtml(p.firstName)}</strong>.
        </div>
      </div>
    </body></html>
  `
}

function renderInternalEmailText(p: QuoteFormPayload): string {
  const lines = [
    `New Quote Request`,
    ``,
    `Name: ${p.firstName} ${p.lastName}`,
    `Company: ${p.company}`,
    p.title ? `Title: ${p.title}` : null,
    `Email: ${p.email}`,
    `Phone: ${p.phone}`,
    `Source: ${p.source}`,
    p.productsOfInterest ? `\nProducts of Interest:\n${p.productsOfInterest}` : null,
  ].filter(Boolean) as string[]
  if (p.cartItems?.length) {
    lines.push('\nQuote Cart Items:')
    for (const it of p.cartItems) {
      lines.push(`  · ${it.productName} — qty ${it.quantity}`)
    }
  }
  if (p.customDesign) {
    lines.push(
      `\nCustom Design: ${p.customDesign.productName} (preview attached as image).`,
    )
  }
  return lines.join('\n')
}

function renderConfirmationEmail(p: QuoteFormPayload): string {
  return `
    <!DOCTYPE html>
    <html><body style="font-family:Inter,Arial,sans-serif;background:#f5f6fb;padding:32px;color:#1a1a2e;">
      <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 16px rgba(0,0,0,0.06);">
        <div style="background:linear-gradient(135deg,#0029cc,#4466ff);padding:32px 28px;color:#fff;text-align:center;">
          <h1 style="margin:0;font-size:26px;font-weight:800;">Thanks, ${escapeHtml(p.firstName)}.</h1>
          <p style="margin:10px 0 0;opacity:.9;font-size:15px;">We got your quote request.</p>
        </div>
        <div style="padding:28px;font-size:15px;line-height:1.65;color:#1a1a2e;">
          <p>A specialist will follow up within <strong>one business day</strong> with options, MOQs, and timelines for your project.</p>
          <p>Need to talk sooner? Reach us at <a href="tel:${company.phoneTel}" style="color:#0029cc;font-weight:600;">${escapeHtml(company.phone)}</a> or <a href="mailto:${company.email}" style="color:#0029cc;font-weight:600;">${escapeHtml(company.email)}</a>.</p>
          <p style="margin-top:24px;color:#7a7a96;font-size:13px;">— The ${escapeHtml(company.name)} Team</p>
        </div>
      </div>
    </body></html>
  `
}

function renderConfirmationEmailText(p: QuoteFormPayload): string {
  return [
    `Thanks, ${p.firstName}.`,
    ``,
    `We got your quote request. A specialist will follow up within one business day with options, MOQs, and timelines.`,
    ``,
    `Need to talk sooner? Reach us at ${company.phone} or ${company.email}.`,
    ``,
    `— The ${company.name} Team`,
  ].join('\n')
}
