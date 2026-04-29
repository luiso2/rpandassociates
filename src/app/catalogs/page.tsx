import type { Metadata } from 'next'
import { ExternalLink } from 'lucide-react'
import { catalogs } from '@/data/catalogs'
import { Container } from '@/components/ui/Container'
import { SectionTitle } from '@/components/ui/SectionTitle'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'

export const metadata: Metadata = {
  title: 'Catalogs',
  description:
    'Download our digital catalogs across drinkware, barware, packaging, glassware, and specialty programs.',
}

export default function CatalogsPage() {
  return (
    <main>
      <Breadcrumbs items={[{ label: 'Catalogs' }]} />

      <section className="py-14 bg-white">
        <Container>
          <SectionTitle
            eyebrow="Catalogs"
            title="Browse Our Catalogs"
            description="Download our digital catalogs across every product family. Click any tile to view on Issuu."
            align="left"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {catalogs.map((cat) => (
              <a
                key={cat.slug}
                href={cat.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group block p-6 rounded-xl bg-gradient-to-br from-ink to-ink-body text-white border border-white/5 hover:border-gold/40 hover:shadow-soft-md hover:-translate-y-1 transition-all relative overflow-hidden"
              >
                <span className="absolute -top-1/2 -right-1/2 w-full h-full bg-gold/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative">
                  <div className="text-[10px] font-bold uppercase tracking-[1.5px] text-gold-light mb-3">
                    Catalog
                  </div>
                  <h3 className="font-heading text-lg font-bold mb-2 flex items-center gap-2">
                    {cat.title}
                    <ExternalLink className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100 transition" />
                  </h3>
                  <p className="text-sm text-white/65 leading-relaxed">
                    {cat.description}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </Container>
      </section>
    </main>
  )
}
