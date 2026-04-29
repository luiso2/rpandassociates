import { z } from 'zod'

/**
 * Server-side environment validation. Fails fast at first read if any
 * required variable is missing or malformed — this prevents shipping
 * a build that crashes on the first user request.
 *
 * NEVER export `process.env` directly — always go through `env`.
 */
const schema = z.object({
  OPENAI_API_KEY: z
    .string()
    .min(20, 'OPENAI_API_KEY is required for /api/chat')
    .startsWith('sk-', 'OPENAI_API_KEY must start with "sk-"'),
  RESEND_API_KEY: z
    .string()
    .min(10, 'RESEND_API_KEY is required for /api/quote')
    .startsWith('re_', 'RESEND_API_KEY must start with "re_"'),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  NEXT_PUBLIC_SITE_URL: z.url().optional(),
})

type Env = z.infer<typeof schema>

let cached: Env | null = null

export function env(): Env {
  if (cached) return cached
  const parsed = schema.safeParse(process.env)
  if (!parsed.success) {
    const issues = parsed.error.issues
      .map((i) => `  · ${i.path.join('.')}: ${i.message}`)
      .join('\n')
    throw new Error(`Invalid environment variables:\n${issues}`)
  }
  cached = parsed.data
  return cached
}
