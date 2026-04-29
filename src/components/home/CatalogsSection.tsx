import { ExternalLink } from 'lucide-react'
import { catalogs } from '@/data/catalogs'
import { Container } from '@/components/ui/Container'
import { SectionTitle } from '@/components/ui/SectionTitle'
import { Reveal } from '@/components/ui/Reveal'

export function CatalogsSection() {
  return (
    <section id="catalogs" className="py-24 bg-white">
      <Container>
        <SectionTitle
          eyebrow="Catalogs"
          title="Browse Our Catalogs"
          description="Download our digital catalogs across drinkware, barware, packaging, glassware, and specialty programs."
        />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {catalogs.map((cat, i) => (
            <Reveal
              key={cat.slug}
              variant="up"
              delay={(i % 5) * 50}
              className="block"
            >
              <a
                href={cat.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-center text-center p-5 min-h-[68px] rounded-md bg-ink text-white text-[12px] font-semibold tracking-wide leading-tight border border-white/5 shadow-soft-sm hover:bg-primary hover:-translate-y-1 hover:shadow-soft-md transition-all duration-300 ease-spring relative overflow-hidden"
              >
                <span className="absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white/8 to-transparent group-hover:left-full transition-all duration-700" />
                <span className="relative flex items-center gap-1.5">
                  {cat.title}
                  <ExternalLink className="w-3 h-3 opacity-50 group-hover:opacity-100" />
                </span>
              </a>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  )
}
