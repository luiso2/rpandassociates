/**
 * In-memory token bucket rate limiter.
 *
 * Single-instance Railway deployment makes this sufficient — for horizontal
 * scaling, swap with an Upstash Redis-backed implementation that exposes
 * the same `tryConsume(key)` interface.
 *
 * Each bucket refills at `rate` tokens per `windowMs`. A request consumes
 * one token. Idle entries are swept every 5 min to bound memory.
 */

interface Bucket {
  tokens: number
  lastRefill: number
}

interface LimiterOptions {
  /** Tokens per window (e.g. 20). */
  capacity: number
  /** Window size in milliseconds (e.g. 60_000 for "per minute"). */
  windowMs: number
  /** Map identifier — used to namespace separate limiters. */
  name: string
}

interface LimiterResult {
  ok: boolean
  retryAfterSeconds: number
  remaining: number
}

const limiters = new Map<string, Map<string, Bucket>>()
const MAX_KEYS = 10_000
const SWEEP_INTERVAL_MS = 5 * 60 * 1000
const IDLE_TTL_MS = 60 * 60 * 1000

let sweeperStarted = false
function startSweeper() {
  if (sweeperStarted) return
  sweeperStarted = true
  setInterval(() => {
    const now = Date.now()
    for (const buckets of limiters.values()) {
      for (const [key, bucket] of buckets) {
        if (now - bucket.lastRefill > IDLE_TTL_MS) {
          buckets.delete(key)
        }
      }
    }
  }, SWEEP_INTERVAL_MS).unref?.()
}

export function rateLimit(
  key: string,
  options: LimiterOptions,
): LimiterResult {
  startSweeper()
  let buckets = limiters.get(options.name)
  if (!buckets) {
    buckets = new Map()
    limiters.set(options.name, buckets)
  }
  // Cap memory: drop oldest if we're at limit
  if (buckets.size >= MAX_KEYS && !buckets.has(key)) {
    const firstKey = buckets.keys().next().value
    if (firstKey !== undefined) buckets.delete(firstKey)
  }

  const now = Date.now()
  const refillRatePerMs = options.capacity / options.windowMs
  let bucket = buckets.get(key)
  if (!bucket) {
    bucket = { tokens: options.capacity, lastRefill: now }
    buckets.set(key, bucket)
  } else {
    const elapsed = now - bucket.lastRefill
    bucket.tokens = Math.min(
      options.capacity,
      bucket.tokens + elapsed * refillRatePerMs,
    )
    bucket.lastRefill = now
  }

  if (bucket.tokens < 1) {
    const tokensNeeded = 1 - bucket.tokens
    const retryAfterMs = tokensNeeded / refillRatePerMs
    return {
      ok: false,
      retryAfterSeconds: Math.ceil(retryAfterMs / 1000),
      remaining: 0,
    }
  }

  bucket.tokens -= 1
  return {
    ok: true,
    retryAfterSeconds: 0,
    remaining: Math.floor(bucket.tokens),
  }
}

/**
 * Best-effort client identification — checks common proxy headers,
 * falls back to a constant for environments without forwarding.
 */
export function getClientKey(headers: Headers): string {
  const xff = headers.get('x-forwarded-for')
  if (xff) return xff.split(',')[0].trim()
  const realIp = headers.get('x-real-ip')
  if (realIp) return realIp
  return 'unknown'
}
