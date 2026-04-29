import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import {
  BedDouble,
  Wine,
  Store,
  Trophy,
  Stethoscope,
  Briefcase,
  PartyPopper,
  UtensilsCrossed,
  ArrowUpRight,
  type LucideIcon,
} from 'lucide-react'
import { industries } from '@/data/industries'
import { productsByIndustry } from '@/lib/search-index'
import { Container } from '@/components/ui/Container'
import { SectionTitle } from '@/components/ui/SectionTitle'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { Reveal } from '@/components/ui/Reveal'

export const metadata: Metadata = {
  title: 'Industries We Serve',
  description:
    'Custom promotional products curated for hospitality, beverage, retail, sports, healthcare, corporate, events, and restaurants.',
}

const iconMap: Record<string, LucideIcon> = {
  BedDouble,
  Wine,
  Store,
  Trophy,
  Stethoscope,
  Briefcase,
  PartyPopper,
  UtensilsCrossed,
}

export default function IndustriesPage() {
  return (
    <main>
      <Breadcrumbs items={[{ label: 'Industries' }]} />

      <section className="py-14 bg-white">
        <Container>
          <SectionTitle
            eyebrow="Verticals"
            title="Industries We Serve"
            description="Curated programs for every industry we partner with — proven solutions trusted by leaders in your space."
            align="left"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {industries.map((ind, i) => {
              const Icon = iconMap[ind.iconName] ?? Briefcase
              const count = productsByIndustry[ind.slug]?.length ?? 0
              return (
                <Reveal key={ind.slug} variant="up" delay={(i % 4) * 60}>
                  <Link
                    href={`/industries/${ind.slug}`}
                    className="group relative block aspect-square rounded-xl overflow-hidden shadow-soft-sm hover:shadow-soft-md transition-shadow"
                  >
                    <Image
                      src={ind.heroImage}
                      alt={ind.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 25vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500 ease-spring"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/95 via-ink/40 to-transparent" />
                    <div className="absolute inset-0 p-5 flex flex-col justify-between">
                      <div className="w-11 h-11 rounded-full bg-white/15 backdrop-blur-md border border-white/25 flex items-center justify-center text-gold-light group-hover:bg-gold group-hover:text-ink transition-all">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-[10px] font-bold uppercase tracking-[1.5px] text-gold-light mb-1">
                          {count} products · {ind.tagline}
                        </div>
                        <h3 className="font-heading text-xl font-bold text-white tracking-tight flex items-center gap-1.5">
                          {ind.name}
                          <ArrowUpRight className="w-4 h-4 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                        </h3>
                        <p className="text-white/70 text-xs mt-1.5 line-clamp-2">
                          {ind.description}
                        </p>
                      </div>
                    </div>
                  </Link>
                </Reveal>
              )
            })}
          </div>
        </Container>
      </section>
    </main>
  )
}
