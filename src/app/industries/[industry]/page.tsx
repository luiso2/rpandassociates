import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { industries, industryBySlug } from '@/data/industries'
import { categoryBySlug } from '@/data/categories'
import { productsByIndustry } from '@/lib/search-index'
import { Container } from '@/components/ui/Container'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { ProductCard } from '@/components/product/ProductCard'
import type { IndustrySlug } from '@/types/industry'

export const dynamicParams = false

export function generateStaticParams() {
  return industries.map((i) => ({ industry: i.slug }))
}

export function generateMetadata({
  params,
}: {
  params: { industry: string }
}): Metadata {
  const ind = industryBySlug[params.industry as IndustrySlug]
  if (!ind) return { title: 'Not Found' }
  return {
    title: `${ind.name} — ${ind.tagline}`,
    description: ind.description,
  }
}

export default function IndustryPage({
  params,
}: {
  params: { industry: string }
}) {
  const industry = industryBySlug[params.industry as IndustrySlug]
  if (!industry) notFound()

  const products = productsByIndustry[industry.slug] ?? []
  const featuredCategories = industry.featuredCategorySlugs
    .map((slug) => categoryBySlug[slug])
    .filter(Boolean)

  return (
    <main>
      <Breadcrumbs
        items={[
          { label: 'Industries', href: '/industries' },
          { label: industry.name },
        ]}
      />

      <section className="relative bg-ink text-white overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={industry.heroImage}
            alt={industry.name}
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/70 to-ink/30" />
        </div>
        <Container>
          <div className="relative z-10 py-14 md:py-24 max-w-2xl">
            <span className="inline-block mb-4 px-3 py-1 rounded-pill text-[10px] font-bold uppercase tracking-[2px] text-gold-light bg-white/10 border border-white/20 backdrop-blur-sm">
              Industry · {products.length} curated products
            </span>
            <h1 className="font-heading font-extrabold text-[clamp(2rem,5vw,3.4rem)] leading-tight mb-3 tracking-tighter">
              {industry.name}
            </h1>
            <p className="text-gold-light text-base font-semibold uppercase tracking-wider mb-5">
              {industry.tagline}
            </p>
            <p className="text-white/80 text-base md:text-lg leading-relaxed">
              {industry.description}
            </p>
          </div>
        </Container>
      </section>

      {featuredCategories.length > 0 && (
        <section className="py-14 bg-white">
          <Container>
            <h2 className="font-heading text-2xl font-bold mb-6 text-ink">
              Top Categories for {industry.name}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {featuredCategories.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/products/${cat.slug}`}
                  className="group flex items-center justify-between gap-4 p-5 rounded-xl bg-surface-light border border-black/5 hover:border-primary/30 hover:bg-white hover:shadow-soft-sm transition-all"
                >
                  <div>
                    <div className="font-heading text-base font-bold text-ink">
                      {cat.name}
                    </div>
                    <div className="text-xs text-ink-muted mt-1 line-clamp-1">
                      {cat.description}
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-ink-light group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0" />
                </Link>
              ))}
            </div>
          </Container>
        </section>
      )}

      <section className="py-14 bg-surface-light">
        <Container>
          <h2 className="font-heading text-2xl font-bold mb-6 text-ink">
            Curated for {industry.name}
          </h2>
          {products.length === 0 ? (
            <p className="text-ink-muted">
              No products specifically tagged for this industry yet — explore
              our catalog or request a quote.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {products.map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
            </div>
          )}
        </Container>
      </section>
    </main>
  )
}
