'use client'

import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import { Clock, Tv } from 'lucide-react'
import { cn } from '@/lib/cn'

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

interface LeagueScheduleStripProps {
  leagueApiName: 'MLB' | 'NFL' | 'NBA' | 'NHL' | 'MLS'
  accentColor: string
}

/**
 * League-scoped version of the homepage SportsTicker. Pulls the same
 * /api/sports payload but filters to a single league and renders a
 * static (non-marquee) responsive grid — better for a landing page
 * where users want to scan today's full slate, not watch a tape loop.
 */
export function LeagueScheduleStrip({
  leagueApiName,
  accentColor,
}: LeagueScheduleStripProps) {
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

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 30_000)
    return () => window.clearInterval(id)
  }, [])

  const leagueGames = useMemo(() => {
    if (!games) return []
    return games
      .filter((g) => g.league === leagueApiName)
      .filter((g) => {
        const start = new Date(g.startTime).getTime()
        if (g.status === 'in') return now - start < 4 * 60 * 60 * 1000
        if (g.status === 'scheduled') return now < start + 4 * 60 * 60 * 1000
        return false
      })
  }, [games, leagueApiName, now])

  if (games === null) return null
  if (leagueGames.length === 0) return null

  return (
    <section className="py-10 bg-ink text-white border-b border-white/5">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="flex items-center justify-between flex-wrap gap-3 mb-5">
          <div className="flex items-center gap-3">
            <span
              aria-hidden
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ background: accentColor }}
            />
            <h2 className="font-heading text-lg md:text-xl font-bold tracking-tight">
              Today&apos;s {leagueApiName} games
            </h2>
          </div>
          <span className="text-[11px] uppercase tracking-[1.5px] text-white/50">
            Live data · ESPN
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {leagueGames.map((g) => (
            <GameCard key={g.id} game={g} now={now} accentColor={accentColor} />
          ))}
        </div>
      </div>
    </section>
  )
}

function GameCard({
  game,
  now,
  accentColor,
}: {
  game: NormalizedGame
  now: number
  accentColor: string
}) {
  const start = new Date(game.startTime).getTime()
  const minsUntil = Math.round((start - now) / 60_000)
  const isLive = game.status === 'in'
  const startLabel = formatStartLabel(game, minsUntil)

  return (
    <div
      className="rounded-lg bg-white/[0.04] border border-white/10 hover:border-white/25 hover:bg-white/[0.07] p-4 transition group"
      style={
        isLive
          ? { borderColor: `${accentColor}55`, boxShadow: `0 0 0 1px ${accentColor}22` }
          : undefined
      }
    >
      <div className="flex items-center justify-between mb-3">
        <span
          className={cn(
            'inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-[1.5px]',
            isLive
              ? 'bg-red-500/20 text-red-300 border border-red-500/30'
              : 'bg-white/5 text-white/55 border border-white/10',
          )}
        >
          {isLive ? (
            <>
              <span className="w-1 h-1 rounded-full bg-red-500 animate-pulse" />
              LIVE
            </>
          ) : (
            <>
              <Clock className="w-2.5 h-2.5" />
              {startLabel}
            </>
          )}
        </span>
        {game.broadcast && (
          <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-[1px] text-white/45">
            <Tv className="w-2.5 h-2.5" />
            {game.broadcast}
          </span>
        )}
      </div>
      <div className="space-y-1.5">
        <TeamRow team={game.awayTeam} accent={isLive} />
        <TeamRow team={game.homeTeam} accent={isLive} />
      </div>
      {game.venue && (
        <div className="mt-3 pt-3 border-t border-white/5 text-[11px] text-white/40 truncate">
          {game.venue}
        </div>
      )}
    </div>
  )
}

function TeamRow({
  team,
  accent,
}: {
  team: NormalizedGame['homeTeam']
  accent: boolean
}) {
  return (
    <div className="flex items-center justify-between text-sm gap-3">
      <span className="flex items-center gap-2.5 font-semibold text-white/95 truncate min-w-0">
        {team.logo ? (
          <span className="relative w-7 h-7 shrink-0">
            <Image
              src={team.logo}
              alt={`${team.name} logo`}
              fill
              sizes="28px"
              className="object-contain drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]"
            />
          </span>
        ) : (
          <span
            aria-hidden
            className="w-7 h-7 rounded-full bg-white/10 shrink-0"
          />
        )}
        <span className="text-white/55 font-mono text-[11px] tabular-nums shrink-0">
          {team.abbr}
        </span>
        <span className="truncate">{team.name}</span>
      </span>
      {accent && team.score != null && (
        <span className="font-mono font-extrabold text-gold-light text-base tabular-nums shrink-0">
          {team.score}
        </span>
      )}
    </div>
  )
}

function formatStartLabel(game: NormalizedGame, minsUntil: number): string {
  if (minsUntil <= 0) return 'Starting'
  if (minsUntil < 60) return `in ${minsUntil}m`
  if (minsUntil < 60 * 24) {
    const hours = Math.floor(minsUntil / 60)
    const mins = minsUntil % 60
    return mins === 0 ? `in ${hours}h` : `in ${hours}h${mins}m`
  }
  const date = new Date(game.startTime)
  return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
}
