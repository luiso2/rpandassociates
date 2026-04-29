import { NextResponse } from 'next/server'
import { buildSlimCatalog } from '@/lib/search-index'

export const runtime = 'nodejs'
export const revalidate = 86400 // 24 hours

/**
 * Slim catalog payload for client-side fuzzy search.
 * Cached aggressively (s-maxage 24h, SWR 7d) — catalog data is static at build time.
 */
export async function GET() {
  const catalog = buildSlimCatalog()
  return NextResponse.json(catalog, {
    headers: {
      'Cache-Control':
        'public, s-maxage=86400, stale-while-revalidate=604800',
    },
  })
}
