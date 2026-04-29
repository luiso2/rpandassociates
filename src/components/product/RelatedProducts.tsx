import { products } from '@/data/products'
import { Container } from '@/components/ui/Container'
import { ProductCard } from './ProductCard'
import type { Product } from '@/types/product'

interface RelatedProductsProps {
  product: Product
  limit?: number
}

export function RelatedProducts({ product, limit = 4 }: RelatedProductsProps) {
  const explicit = (product.relatedProductSlugs ?? [])
    .map((slug) => products.find((p) => p.slug === slug))
    .filter((p): p is Product => Boolean(p))

  const sameCategoryFallback = products.filter(
    (p) => p.categorySlug === product.categorySlug && p.slug !== product.slug,
  )

  const related = [...explicit, ...sameCategoryFallback]
    .filter((p, i, arr) => arr.findIndex((x) => x.slug === p.slug) === i)
    .slice(0, limit)

  if (related.length === 0) return null

  return (
    <section className="py-20 bg-surface-light">
      <Container>
        <h2 className="font-heading text-2xl md:text-3xl font-extrabold mb-8 text-ink">
          Related Products
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {related.map((p) => (
            <ProductCard key={p.slug} product={p} showCategory={false} />
          ))}
        </div>
      </Container>
    </section>
  )
}
