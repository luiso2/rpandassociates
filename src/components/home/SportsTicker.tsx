'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { Trophy, Tv, Clock, ArrowUpRight } from 'lucide-react'
import { cn } from '@/lib/cn'

const LEAGUE_SLUG: Record<string, string> = {
  MLB: 'mlb',
  NFL: 'nfl',
  NBA: 'nba',
  NHL: 'nhl',
  MLS: 'mls',
}

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

const LEAGUE_COLORS: Record<NormalizedGame['league'], string> = {
  MLB: 'bg-blue-500/15 text-blue-300 border-blue-400/30',
  NFL: 'bg-emerald-500/15 text-emerald-300 border-emerald-400/30',
  NBA: 'bg-orange-500/15 text-orange-300 border-orange-400/30',
  NHL: 'bg-cyan-500/15 text-cyan-300 border-cyan-400/30',
  MLS: 'bg-pink-500/15 text-pink-300 border-pink-400/30',
}

/**
 * Live sports schedule strip — shows today's MLB/NFL/NBA/NHL/MLS games
 * with a real-time countdown to start. RP & Associates serves stadium
 * concessions and sports brands, so keeping this surfaced on the home
 * page reinforces relevance and gives the page a "live" pulse.
 */
export function SportsTicker() {
  const [games, setGames] = useState<NormalizedGame[] | null>(null)
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    let cancelled = false
    fetch('/api/sports')
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return
        setGames(data.games as NormalizedGame[])
      })
      .catch(() => {
        if (cancelled) return
        setGames([])
      })
    return () => {
      cancelled = true
    }
  }, [])

  // Tick every 30s for the countdown / "in N min"
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 30_000)
    return () => window.clearInterval(id)
  }, [])

  const visibleGames = useMemo(() => {
    if (!games) return []
    // Filter again on the client in case clock has moved past start while
    // viewing — and cap at a sensible number for the marquee.
    return games
      .filter((g) => {
        const start = new Date(g.startTime).getTime()
        // Keep in-progress games for ~4h after start; scheduled until they're done
        if (g.status === 'in') return now - start < 4 * 60 * 60 * 1000
        if (g.status === 'scheduled') return now < start + 4 * 60 * 60 * 1000
        return false
      })
      .slice(0, 24)
  }, [games, now])

  if (games === null) {
    return (
      <div className="bg-ink text-white/60 text-xs py-2 text-center font-mono">
        Loading today&apos;s lineup…
      </div>
    )
  }

  if (visibleGames.length === 0) return null

  // Duplicate the array so the marquee loops seamlessly
  const loopGames = [...visibleGames, ...visibleGames]

  return (
    <div
      className="relative bg-gradient-to-r from-ink via-ink-body to-ink text-white border-y border-white/5 overflow-hidden group"
      role="region"
      aria-label="Live sports schedule"
    >
      <div
        aria-hidden
        className="absolute left-0 top-0 bottom-0 w-12 z-10 bg-gradient-to-r from-ink to-transparent pointer-events-none"
      />
      <div
        aria-hidden
        className="absolute right-0 top-0 bottom-0 w-12 z-10 bg-gradient-to-l from-ink to-transparent pointer-events-none"
      />

      <div className="flex items-center">
        <div className="hidden md:flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-gold-dark to-gold text-ink font-bold text-[11px] uppercase tracking-[1.5px] whitespace-nowrap shrink-0 z-20">
          <Trophy className="w-3.5 h-3.5" />
          Today&apos;s Lineup
        </div>
        <div className="md:hidden px-3 py-2 text-gold text-[10px] font-bold uppercase tracking-[1.5px] whitespace-nowrap shrink-0 z-20 flex items-center gap-1.5">
          <Trophy className="w-3 h-3" />
          Live
        </div>

        <div className="flex-1 min-w-0 overflow-hidden">
          <div className="flex animate-marquee group-hover:[animation-play-state:paused] whitespace-nowrap py-2.5">
            {loopGames.map((g, i) => (
              <GameChip key={`${g.id}-${i}`} game={g} now={now} />
            ))}
          </div>
        </div>

        <Link
          href="/industries/sports"
          className="hidden lg:flex items-center gap-1.5 px-4 py-2.5 text-[11px] font-bold uppercase tracking-[1.5px] text-gold-light hover:text-gold transition whitespace-nowrap shrink-0 z-20"
        >
          Sports Programs <span aria-hidden>→</span>
        </Link>
      </div>
    </div>
  )
}

function GameChip({ game, now }: { game: NormalizedGame; now: number }) {
  const start = new Date(game.startTime).getTime()
  const minsUntil = Math.round((start - now) / 60_000)
  const isLive = game.status === 'in'
  const startLabel = formatStartLabel(game, minsUntil)
  const leagueSlug = LEAGUE_SLUG[game.league] ?? 'sports'

  return (
    <Link
      href={`/industries/sports/${leagueSlug}`}
      title={`${game.shortName} — see ${game.league} stadium programs`}
      className="group inline-flex items-center gap-2.5 px-4 mx-2 text-[12px] font-medium border-r border-white/5 hover:bg-white/[0.04] transition rounded-md"
    >
      <span
        className={cn(
          'inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold tracking-[1.5px] uppercase border',
          LEAGUE_COLORS[game.league],
        )}
      >
        {game.league}
      </span>

      <span className="text-white/95 font-semibold">
        <span className="text-white/60">{game.awayTeam.abbr || game.awayTeam.name}</span>
        {isLive && game.awayTeam.score != null && (
          <span className="ml-1.5 font-mono text-gold-light">{game.awayTeam.score}</span>
        )}
        <span className="text-white/40 mx-1.5">@</span>
        <span>{game.homeTeam.abbr || game.homeTeam.name}</span>
        {isLive && game.homeTeam.score != null && (
          <span className="ml-1.5 font-mono text-gold-light">{game.homeTeam.score}</span>
        )}
      </span>

      <span
        className={cn(
          'inline-flex items-center gap-1 text-[11px] font-mono',
          isLive ? 'text-red-400' : 'text-white/55',
        )}
      >
        {isLive ? (
          <>
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            LIVE
          </>
        ) : (
          <>
            <Clock className="w-3 h-3" />
            {startLabel}
          </>
        )}
      </span>

      {game.broadcast && (
        <span className="hidden md:inline-flex items-center gap-1 text-[10px] uppercase tracking-[1px] text-white/45">
          <Tv className="w-2.5 h-2.5" />
          {game.broadcast}
        </span>
      )}

      <ArrowUpRight className="w-3 h-3 text-white/25 group-hover:text-gold-light group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all" />
    </Link>
  )
}

function formatStartLabel(game: NormalizedGame, minsUntil: number): string {
  if (minsUntil <= 0) return 'About to start'
  if (minsUntil < 60) return `in ${minsUntil}m`
  if (minsUntil < 60 * 24) {
    const hours = Math.floor(minsUntil / 60)
    const mins = minsUntil % 60
    return mins === 0 ? `in ${hours}h` : `in ${hours}h ${mins}m`
  }
  // Fall back to local-time display for >24h
  const date = new Date(game.startTime)
  return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
}
