'use client'

import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Fuse from 'fuse.js'
import Link from 'next/link'
import { Search } from 'lucide-react'
import type { SlimProduct } from '@/lib/search-index'
import { Container } from '@/components/ui/Container'
import { ProductCard } from '@/components/product/ProductCard'
import { products as fullProducts } from '@/data/products'

export function SearchResults() {
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get('q') ?? ''
  const [query, setQuery] = useState(initialQuery)
  const [catalog, setCatalog] = useState<SlimProduct[] | null>(null)

  useEffect(() => {
    fetch('/api/search')
      .then((r) => r.json())
      .then((data: SlimProduct[]) => setCatalog(data))
      .catch(() => setCatalog([]))
  }, [])

  const fuse = useMemo(() => {
    if (!catalog) return null
    return new Fuse(catalog, {
      keys: [
        { name: 'name', weight: 2 },
        { name: 'keywords', weight: 1 },
        { name: 'categoryName', weight: 0.5 },
      ],
      threshold: 0.4,
      includeScore: true,
    })
  }, [catalog])

  const results = useMemo(() => {
    if (!fuse || !query.trim()) return []
    return fuse.search(query.trim())
  }, [fuse, query])

  return (
    <section className="py-12 bg-surface-light">
      <Container>
        <div className="max-w-2xl mx-auto mb-10">
          <div className="relative">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-ink-muted" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products, materials, industries…"
              className="w-full pl-14 pr-6 py-4 rounded-pill border-2 border-primary/20 bg-white shadow-soft-sm outline-none focus:border-primary transition text-base"
              autoFocus
            />
          </div>
          {query.trim() && (
            <p className="text-sm text-ink-muted mt-3 text-center">
              {results.length} results for{' '}
              <strong className="text-ink">&ldquo;{query.trim()}&rdquo;</strong>
            </p>
          )}
        </div>

        {!query.trim() && (
          <div className="text-center py-16">
            <h2 className="font-heading text-2xl font-bold text-ink mb-2">
              Search our catalog
            </h2>
            <p className="text-ink-muted mb-8">
              Find the right product across all categories and industries.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-pill bg-primary text-white text-sm font-bold uppercase tracking-wider hover:bg-primary-dark transition"
            >
              Browse All Products
            </Link>
          </div>
        )}

        {query.trim() && results.length === 0 && catalog !== null && (
          <div className="text-center py-16 px-6 max-w-md mx-auto">
            <h2 className="font-heading text-xl font-bold text-ink mb-2">
              No results for &ldquo;{query.trim()}&rdquo;
            </h2>
            <p className="text-ink-muted mb-6">
              Try a different keyword or browse by category — we may have it
              under a different name.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-pill bg-primary text-white text-sm font-bold uppercase tracking-wider hover:bg-primary-dark transition"
            >
              Browse Categories
            </Link>
          </div>
        )}

        {results.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {results.map(({ item }) => {
              const fullProduct = fullProducts.find((p) => p.slug === item.slug)
              if (!fullProduct) return null
              return <ProductCard key={item.slug} product={fullProduct} />
            })}
          </div>
        )}
      </Container>
    </section>
  )
}
