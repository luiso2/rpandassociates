import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * Image proxy used by the customizer canvas.
 *
 * The catalog images live on rpacatalog.com which does not send CORS headers,
 * so when the LogoCanvas tries to `new Image()` them and later read the
 * canvas back via `toDataURL()` for the download button, the canvas becomes
 * "tainted" and throws a SecurityError. Routing the fetch through this proxy
 * keeps the image on our own origin and adds proper Access-Control-Allow-*
 * headers so the canvas remains readable.
 *
 * Strict allowlist: only catalog hosts we explicitly trust. Anything else
 * gets a 403.
 */
const ALLOWED_HOSTS = new Set(['www.rpacatalog.com', 'rpacatalog.com'])
const MAX_BYTES = 8 * 1024 * 1024 // 8 MB safety cap

export async function GET(req: NextRequest) {
  const src = req.nextUrl.searchParams.get('src')
  if (!src) {
    return NextResponse.json({ error: 'Missing src' }, { status: 400 })
  }
  let url: URL
  try {
    url = new URL(src)
  } catch {
    return NextResponse.json({ error: 'Invalid src' }, { status: 400 })
  }
  if (url.protocol !== 'https:' || !ALLOWED_HOSTS.has(url.hostname)) {
    return NextResponse.json({ error: 'Host not allowed' }, { status: 403 })
  }

  try {
    const upstream = await fetch(url.toString(), {
      headers: {
        // Use a real-browser UA — some Cloudflare/WAF rules at the
        // upstream reject identifiable bot UAs with a 400.
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15',
        Accept: 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        Referer: 'https://www.rpacatalog.com/',
      },
      cache: 'no-store',
    })
    if (!upstream.ok) {
      return NextResponse.json(
        { error: `Upstream ${upstream.status}` },
        { status: 502 },
      )
    }
    const contentType = upstream.headers.get('content-type') ?? 'image/jpeg'
    if (!contentType.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Upstream is not an image' },
        { status: 502 },
      )
    }
    const buffer = await upstream.arrayBuffer()
    if (buffer.byteLength > MAX_BYTES) {
      return NextResponse.json({ error: 'Image too large' }, { status: 413 })
    }

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Cross-Origin-Resource-Policy': 'cross-origin',
      },
    })
  } catch (err) {
    console.error('[/api/img] upstream fetch failed:', err)
    return NextResponse.json(
      { error: 'Upstream fetch failed' },
      { status: 502 },
    )
  }
}
