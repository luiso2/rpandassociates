import Link from 'next/link'
import Image from 'next/image'
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
import { Container } from '@/components/ui/Container'
import { SectionTitle } from '@/components/ui/SectionTitle'
import { Reveal } from '@/components/ui/Reveal'

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

export function IndustriesGrid() {
  return (
    <section className="py-24 bg-surface-light">
      <Container>
        <SectionTitle
          eyebrow="Shop by Industry"
          title="Built for Your Vertical"
          description="Curated programs for every industry we serve. Discover proven solutions trusted by leaders in your space."
        />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {industries.map((ind, i) => {
            const Icon = iconMap[ind.iconName] ?? Briefcase
            return (
              <Reveal
                key={ind.slug}
                variant="up"
                delay={(i % 4) * 60}
                className="block"
              >
                <Link
                  href={`/industries/${ind.slug}`}
                  className="group relative block aspect-square rounded-xl overflow-hidden shadow-soft-sm hover:shadow-soft-md transition-shadow"
                >
                  <Image
                    src={ind.heroImage}
                    alt={ind.name}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500 ease-spring"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/95 via-ink/40 to-transparent" />
                  <div className="absolute inset-0 p-4 flex flex-col justify-between">
                    <div className="w-10 h-10 rounded-full bg-white/15 backdrop-blur-md border border-white/25 flex items-center justify-center text-gold-light group-hover:bg-gold group-hover:text-ink transition-all">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-[1.5px] text-gold-light mb-1">
                        {ind.tagline}
                      </div>
                      <h3 className="font-heading text-lg font-bold text-white tracking-tight flex items-center gap-1.5">
                        {ind.name}
                        <ArrowUpRight className="w-4 h-4 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                      </h3>
                    </div>
                  </div>
                </Link>
              </Reveal>
            )
          })}
        </div>
      </Container>
    </section>
  )
}
