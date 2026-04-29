import Link from 'next/link'
import Image from 'next/image'
import { popularBanners } from '@/data/popular-banners'
import { Container } from '@/components/ui/Container'
import { SectionTitle } from '@/components/ui/SectionTitle'
import { Reveal } from '@/components/ui/Reveal'

export function PopularBanners() {
  return (
    <section id="popular" className="py-24 bg-surface-light">
      <Container>
        <SectionTitle
          eyebrow="Popular"
          title="Trending Right Now"
          description="Our most-requested programs across categories."
        />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {popularBanners.map((b, i) => (
            <Reveal
              key={b.image}
              variant="scale"
              delay={(i % 5) * 50}
              className="block"
            >
              <Link
                href={b.href}
                className="block relative aspect-[4/3] rounded-lg overflow-hidden group shadow-soft-sm hover:shadow-soft-md transition-shadow"
                aria-label={b.alt}
              >
                <Image
                  src={b.image}
                  alt={b.alt}
                  fill
                  sizes="(max-width: 768px) 50vw, 20vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500 ease-spring"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  )
}
