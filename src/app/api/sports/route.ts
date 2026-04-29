import { NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const revalidate = 300 // 5 min — fresh enough for a ticker

/**
 * Live sports schedule for the homepage ticker.
 *
 * Pulls today's MLB/NFL/NBA/NHL/MLS games from ESPN's public scoreboard
 * endpoints (no auth, no rate limit for casual usage). Filters to games
 * that haven't ended yet, normalises the shape, and caches for 5 min.
 *
 * Why server-side: keeps the upstream URLs out of the browser, lets us
 * pin a CSP that doesn't whitelist espn.com, and survives if ESPN ever
 * blocks the customer's network egress.
 */

interface NormalizedGame {
  id: string
  league: 'MLB' | 'NFL' | 'NBA' | 'NHL' | 'MLS'
  status: 'scheduled' | 'in' | 'post'
  startTime: string
  shortName: string
  homeTeam: { name: string; abbr: string; logo?: string; score?: string }
  awayTeam: { name: string; abbr: string; logo?: string; score?: string }
  venue?: string
  broadcast?: string
  detail?: string
}

const SOURCES: Array<{ league: NormalizedGame['league']; url: string }> = [
  { league: 'MLB', url: 'https://site.api.espn.com/apis/site/v2/sports/baseball/mlb/scoreboard' },
  { league: 'NFL', url: 'https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard' },
  { league: 'NBA', url: 'https://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard' },
  { league: 'NHL', url: 'https://site.api.espn.com/apis/site/v2/sports/hockey/nhl/scoreboard' },
  { league: 'MLS', url: 'https://site.api.espn.com/apis/site/v2/sports/soccer/usa.1/scoreboard' },
]

interface EspnTeam {
  name?: string
  abbreviation?: string
  shortDisplayName?: string
  logo?: string
}
interface EspnCompetitor {
  id: string
  homeAway: 'home' | 'away'
  team: EspnTeam
  score?: string
}
interface EspnEvent {
  id: string
  date: string
  shortName: string
  competitions?: Array<{
    competitors?: EspnCompetitor[]
    venue?: { fullName?: string }
    broadcasts?: Array<{ names?: string[] }>
    status?: {
      type?: { state?: string; detail?: string; shortDetail?: string }
    }
  }>
}

async function fetchScoreboard(league: NormalizedGame['league'], url: string): Promise<NormalizedGame[]> {
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (compatible; RPAssociates/1.0; +https://rpandassociates.com)',
      },
      next: { revalidate: 300 },
    })
    if (!res.ok) return []
    const data = (await res.json()) as { events?: EspnEvent[] }
    if (!data.events) return []
    return data.events
      .map((event): NormalizedGame | null => {
        const comp = event.competitions?.[0]
        const home = comp?.competitors?.find((c) => c.homeAway === 'home')
        const away = comp?.competitors?.find((c) => c.homeAway === 'away')
        if (!home || !away) return null
        const state = (comp?.status?.type?.state ?? 'pre').toLowerCase()
        // Skip games that have ended already
        if (state === 'post') return null
        return {
          id: `${league}-${event.id}`,
          league,
          status: state === 'in' ? 'in' : state === 'post' ? 'post' : 'scheduled',
          startTime: event.date,
          shortName: event.shortName,
          homeTeam: {
            name: home.team.name ?? home.team.shortDisplayName ?? '',
            abbr: home.team.abbreviation ?? '',
            logo: home.team.logo,
            score: home.score,
          },
          awayTeam: {
            name: away.team.name ?? away.team.shortDisplayName ?? '',
            abbr: away.team.abbreviation ?? '',
            logo: away.team.logo,
            score: away.score,
          },
          venue: comp?.venue?.fullName,
          broadcast: comp?.broadcasts?.[0]?.names?.[0],
          detail: comp?.status?.type?.shortDetail,
        }
      })
      .filter((g): g is NormalizedGame => g !== null)
  } catch (err) {
    console.error(`[/api/sports] ${league} fetch failed:`, err)
    return []
  }
}

export async function GET() {
  const allGames = (
    await Promise.all(SOURCES.map((s) => fetchScoreboard(s.league, s.url)))
  ).flat()

  // Sort: in-progress first, then scheduled by start time
  allGames.sort((a, b) => {
    if (a.status !== b.status) return a.status === 'in' ? -1 : 1
    return new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
  })

  return NextResponse.json(
    { games: allGames, fetchedAt: new Date().toISOString() },
    {
      headers: {
        'Cache-Control':
          'public, s-maxage=300, stale-while-revalidate=600',
      },
    },
  )
}
