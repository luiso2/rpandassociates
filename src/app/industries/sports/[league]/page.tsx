import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { Trophy, Calendar, Building2, ArrowRight } from 'lucide-react'
import {
  sportsLeagues,
  leagueBySlug,
  curateProductsForLeague,
  type LeagueSlug,
} from '@/data/sports-leagues'
import { products } from '@/data/products'
import { Container } from '@/components/ui/Container'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { ProductCard } from '@/components/product/ProductCard'
import { LeagueScheduleStrip } from '@/components/sports/LeagueScheduleStrip'

export const dynamicParams = false

export function generateStaticParams() {
  return sportsLeagues.map((l) => ({ league: l.slug }))
}

export function generateMetadata({
  params,
}: {
  params: { league: string }
}): Metadata {
  const league = leagueBySlug[params.league as LeagueSlug]
  if (!league) return { title: 'Not Found' }
  return {
    title: `${league.fullName} Stadium Programs — Custom Concession Drinkware`,
    description: `${league.tagline}. Custom branded shakers, mugs, glassware, and concession programs trusted by ${league.shortName} stadiums and concessionaires.`,
  }
}

export default function LeagueIndustryPage({
  params,
}: {
  params: { league: string }
}) {
  const league = leagueBySlug[params.league as LeagueSlug]
  if (!league) notFound()

  const curated = curateProductsForLeague(league, products, 12)

  return (
    <main>
      <Breadcrumbs
        items={[
          { label: 'Industries', href: '/industries' },
          { label: 'Sports', href: '/industries/sports' },
          { label: league.shortName },
        ]}
      />

      {/* League hero */}
      <section
        className={`relative overflow-hidden bg-gradient-to-br ${league.accentGradient} text-white`}
      >
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none opacity-50"
          style={{
            backgroundImage:
              'radial-gradient(circle at 25% 20%, rgba(255,255,255,0.18), transparent 55%), radial-gradient(circle at 80% 70%, rgba(0,0,0,0.25), transparent 60%)',
          }}
        />
        <Container>
          <div className="relative z-10 py-16 md:py-24 max-w-3xl">
            <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-pill bg-white/15 border border-white/25 backdrop-blur-sm text-[10px] font-bold uppercase tracking-[2px]">
              <Trophy className="w-3 h-3 text-gold" />
              {league.shortName} Programs
            </div>
            <h1 className="font-heading font-extrabold text-[clamp(2.2rem,5.5vw,3.8rem)] leading-tight mb-4 tracking-tight drop-shadow-md">
              {league.fullName}
            </h1>
            <p className="text-white/85 text-base md:text-lg leading-relaxed mb-8 max-w-2xl">
              {league.intro}
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href={`/quote?products=${encodeURIComponent(`${league.shortName} stadium concession program`)}`}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-pill bg-gold text-ink text-sm font-bold uppercase tracking-wider shadow-gold hover:bg-gold-light hover:-translate-y-0.5 transition-all"
              >
                Get a {league.shortName} Stadium Quote
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/customize"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-pill bg-white/10 text-white text-sm font-bold uppercase tracking-wider border border-white/30 backdrop-blur-md hover:bg-white/20 transition"
              >
                Try Your Logo
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* Today's games for this league */}
      <Suspense fallback={null}>
        <LeagueScheduleStrip
          leagueApiName={league.apiName}
          accentColor={league.accentColor}
        />
      </Suspense>

      {/* Curated products */}
      <section className="py-16 bg-white">
        <Container>
          <div className="mb-10 flex items-end justify-between flex-wrap gap-4">
            <div>
              <span className="inline-block mb-3 px-3 py-1 rounded-pill text-[10px] font-bold uppercase tracking-[2px] bg-primary/10 text-primary border border-primary/15">
                Curated for {league.shortName}
              </span>
              <h2 className="font-heading font-extrabold text-3xl md:text-4xl tracking-tight text-ink">
                Best-sellers in {league.shortName} venues
              </h2>
            </div>
            <Link
              href="/products"
              className="inline-flex items-center gap-1.5 text-sm font-bold uppercase tracking-wider text-primary hover:gap-2.5 transition-all"
            >
              View all products <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {curated.length === 0 ? (
            <div className="text-center py-16 px-6 rounded-xl bg-surface-light border border-black/5">
              <p className="text-ink-muted">
                No featured items yet — request a custom program below.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {curated.map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
            </div>
          )}
        </Container>
      </section>

      {/* Case study */}
      <section className="py-16 bg-surface-light">
        <Container>
          <div className="grid lg:grid-cols-[1fr_360px] gap-10 items-start">
            <div>
              <span className="inline-flex items-center gap-1.5 mb-4 px-3 py-1 rounded-pill text-[10px] font-bold uppercase tracking-[2px] bg-ink text-white">
                <Building2 className="w-3 h-3" />
                Case Study
              </span>
              <h3 className="font-heading text-2xl md:text-3xl font-extrabold text-ink mb-6 leading-tight">
                {league.caseStudy.venue}
              </h3>
              <blockquote className="text-xl md:text-2xl font-heading font-bold text-ink leading-snug mb-6 border-l-4 border-gold pl-5 italic">
                {league.caseStudy.quote}
              </blockquote>
              <p className="text-sm font-semibold text-ink-muted uppercase tracking-wider">
                — {league.caseStudy.attendee}
              </p>
            </div>
            <div className="lg:sticky lg:top-32 space-y-4">
              <div
                className="rounded-xl p-7 text-white"
                style={{
                  background: `linear-gradient(135deg, ${league.accentColor}, rgba(0,0,0,0.85))`,
                }}
              >
                <div className="text-[10px] font-bold uppercase tracking-[2px] opacity-80 mb-2">
                  Program metric
                </div>
                <div className="font-heading text-3xl md:text-4xl font-extrabold leading-tight mb-3">
                  {league.caseStudy.metric}
                </div>
              </div>
              <Link
                href={`/quote?products=${encodeURIComponent(`${league.shortName} stadium / concession program — looking for similar SKUs`)}`}
                className="block w-full text-center px-7 py-3.5 rounded-pill bg-ink text-white text-sm font-bold uppercase tracking-wider hover:bg-primary transition"
              >
                Replicate this program →
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* Switch league strip */}
      <section className="py-12 bg-white border-t border-black/5">
        <Container>
          <div className="flex items-center gap-2 mb-6">
            <Calendar className="w-4 h-4 text-ink-light" />
            <h3 className="font-heading text-base font-bold uppercase tracking-[1.5px] text-ink-light">
              Other Leagues
            </h3>
          </div>
          <div className="flex flex-wrap gap-3">
            {sportsLeagues
              .filter((l) => l.slug !== league.slug)
              .map((l) => (
                <Link
                  key={l.slug}
                  href={`/industries/sports/${l.slug}`}
                  className="group inline-flex items-center gap-3 px-5 py-3 rounded-xl bg-surface-light border border-black/5 hover:border-primary/30 hover:shadow-soft-sm transition"
                >
                  <span
                    aria-hidden
                    className="w-9 h-9 rounded-lg flex items-center justify-center text-white font-heading font-bold text-xs"
                    style={{ background: l.accentColor }}
                  >
                    {l.shortName}
                  </span>
                  <span className="font-heading text-sm font-bold text-ink-body group-hover:text-primary transition">
                    {l.fullName}
                  </span>
                  <ArrowRight className="w-4 h-4 text-ink-light group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </Link>
              ))}
          </div>
        </Container>
      </section>
    </main>
  )
}
