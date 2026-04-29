import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { categories } from '@/data/categories'
import { featuredProducts } from '@/data/products'
import { productsByCategory } from '@/lib/search-index'
import { Container } from '@/components/ui/Container'
import { SectionTitle } from '@/components/ui/SectionTitle'
import { ProductCard } from '@/components/product/ProductCard'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { Reveal } from '@/components/ui/Reveal'

export const metadata: Metadata = {
  title: 'All Products — Custom Promotional Products',
  description:
    'Browse our full catalog: barware, drinkware, beverage bags, glacier bags, grub tubs, Moscow Mule mugs, and value-added packaging programs.',
}

export default function ProductsPage() {
  return (
    <main>
      <Breadcrumbs items={[{ label: 'Products' }]} />

      <section className="py-12 bg-white">
        <Container>
          <SectionTitle
            eyebrow="Catalog"
            title="Shop by Category"
            description="Seven product families. Hundreds of customizable options. One vertically integrated partner."
            align="left"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {categories.map((cat, i) => {
              const count = productsByCategory[cat.slug].length
              return (
                <Reveal key={cat.slug} variant="up" delay={(i % 3) * 60}>
                  <Link
                    href={`/products/${cat.slug}`}
                    className="group relative block aspect-[4/3] rounded-xl overflow-hidden shadow-soft-sm hover:shadow-soft-md transition-shadow"
                  >
                    <Image
                      src={cat.heroImage}
                      alt={cat.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500 ease-spring"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/95 via-ink/40 to-transparent" />
                    <div className="absolute inset-0 p-6 flex flex-col justify-end">
                      <span className="text-[10px] font-bold uppercase tracking-[1.5px] text-gold-light mb-1">
                        {count > 0 ? `${count} Featured` : 'Browse'}
                      </span>
                      <h3 className="font-heading text-2xl font-bold text-white tracking-tight mb-1 flex items-center gap-2">
                        {cat.name}
                        <ArrowUpRight className="w-5 h-5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                      </h3>
                      <p className="text-white/75 text-sm line-clamp-2">
                        {cat.description}
                      </p>
                    </div>
                  </Link>
                </Reveal>
              )
            })}
          </div>
        </Container>
      </section>

      <section className="py-20 bg-surface-light">
        <Container>
          <div className="flex items-end justify-between mb-10">
            <div>
              <span className="inline-block mb-3 px-3 py-1 rounded-pill text-[10px] font-bold uppercase tracking-[2px] bg-gold/15 text-gold-dark border border-gold/30">
                Bestsellers
              </span>
              <h2 className="font-heading font-extrabold text-3xl md:text-4xl tracking-tight">
                Our Most Loved Products
              </h2>
            </div>
            <Link
              href="/quote"
              className="hidden md:inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-primary hover:gap-3 transition-all"
            >
              Request a Quote <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {featuredProducts.slice(0, 8).map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </Container>
      </section>
    </main>
  )
}
