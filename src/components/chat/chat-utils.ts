import { z } from 'zod'

const formFillSchema = z.object({
  firstName: z.string().trim().min(1).max(80),
  lastName: z.string().trim().min(1).max(80),
  company: z.string().trim().min(1).max(150),
  email: z.email().trim().max(200),
  phone: z.string().trim().min(7).max(40),
  products: z.string().trim().max(500).optional(),
})

export type FormFillData = z.infer<typeof formFillSchema>

const FORM_FILL_REGEX = /\[FORM_FILL:([^|]+)\|([^|]+)\|([^|]+)\|([^|]+)\|([^|]+)(?:\|([^\]]*))?\]/

/**
 * Parses an AI reply for the [FORM_FILL:firstName|lastName|company|email|phone|products] pattern.
 * Returns validated data + cleaned reply (with the pattern stripped) or null if no match / invalid.
 *
 * Defense-in-depth: every captured group is validated before being applied — never trust the LLM.
 */
export function parseFormFill(
  reply: string,
): { data: FormFillData; cleanedReply: string } | null {
  const match = reply.match(FORM_FILL_REGEX)
  if (!match) return null
  const [, firstName, lastName, company, email, phone, products] = match
  const parsed = formFillSchema.safeParse({
    firstName,
    lastName,
    company,
    email,
    phone,
    products: products?.trim() || undefined,
  })
  if (!parsed.success) return null
  const cleanedReply = reply.replace(FORM_FILL_REGEX, '').trim()
  return {
    data: parsed.data,
    cleanedReply: cleanedReply || 'I have filled the form for you. Please review and submit when ready.',
  }
}

/**
 * Sets a value on an input element with a typing animation effect.
 * Used for the chat → form auto-fill feature. Returns a cleanup function
 * that cancels the in-progress typing.
 */
export function typeIntoField(
  el: HTMLInputElement | HTMLTextAreaElement,
  text: string,
  speedMs = 18,
): () => void {
  let i = 0
  let cancelled = false
  el.value = ''
  const tick = () => {
    if (cancelled) return
    if (i <= text.length) {
      el.value = text.slice(0, i)
      el.dispatchEvent(new Event('input', { bubbles: true }))
      i += 1
      window.setTimeout(tick, speedMs)
    }
  }
  tick()
  return () => {
    cancelled = true
  }
}
