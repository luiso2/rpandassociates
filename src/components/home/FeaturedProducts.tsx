import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { featuredProducts } from '@/data/products'
import { Container } from '@/components/ui/Container'
import { SectionTitle } from '@/components/ui/SectionTitle'
import { ProductCard } from '@/components/product/ProductCard'
import { Reveal } from '@/components/ui/Reveal'

export function FeaturedProducts() {
  return (
    <section id="products" className="py-28 bg-white">
      <Container>
        <SectionTitle
          eyebrow="Featured"
          title="Our Most Loved Products"
          description="A curated selection of best-sellers and signature pieces our partners reorder year after year."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProducts.slice(0, 12).map((p, i) => (
            <Reveal key={p.slug} variant="scale" delay={(i % 3) * 60}>
              <ProductCard product={p} />
            </Reveal>
          ))}
        </div>
        <div className="text-center mt-12">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-pill bg-ink text-white text-sm font-bold uppercase tracking-wider shadow-soft-md hover:bg-primary hover:-translate-y-1 transition-all"
          >
            View All Products <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </Container>
    </section>
  )
}
