import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { categories, categoryBySlug } from '@/data/categories'
import { productsByCategory, allMaterials } from '@/lib/search-index'
import {
  parseFilters,
  moqMatches,
  type CategoryFilters,
} from '@/lib/url-state'
import type { Product } from '@/types/product'
import { Container } from '@/components/ui/Container'
import { ProductCard } from '@/components/product/ProductCard'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { CategoryHeader } from '@/components/category/CategoryHeader'
import { FilterSidebar } from '@/components/category/FilterSidebar'
import { SortDropdown } from '@/components/category/SortDropdown'
import type { CategorySlug } from '@/types/category'
import type { IndustrySlug } from '@/types/industry'

export const dynamicParams = false

export function generateStaticParams() {
  return categories.map((c) => ({ category: c.slug }))
}

export function generateMetadata({
  params,
}: {
  params: { category: string }
}): Metadata {
  const cat = categoryBySlug[params.category as CategorySlug]
  if (!cat) return { title: 'Not Found' }
  return {
    title: cat.seo.title,
    description: cat.seo.description,
  }
}

export default function CategoryPage({
  params,
  searchParams,
}: {
  params: { category: string }
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const category = categoryBySlug[params.category as CategorySlug]
  if (!category) notFound()

  const allInCategory = productsByCategory[category.slug] ?? []
  const filters = parseFilters(searchParams)
  const filtered = applyFilters(allInCategory, filters)
  const sorted = sortProducts(filtered, filters.sort)

  const availableMaterials = Array.from(
    new Set(allInCategory.flatMap((p) => p.materials)),
  )
    .sort()
    .filter((m) => allMaterials.includes(m))

  const availableIndustries: IndustrySlug[] = Array.from(
    new Set(allInCategory.flatMap((p) => p.industries)),
  ).sort() as IndustrySlug[]

  return (
    <main>
      <Breadcrumbs
        items={[
          { label: 'Products', href: '/products' },
          { label: category.name },
        ]}
      />
      <CategoryHeader category={category} productCount={allInCategory.length} />

      <section className="py-10 bg-white">
        <Container>
          <div className="grid lg:grid-cols-[260px_1fr] gap-8">
            <FilterSidebar
              availableMaterials={availableMaterials}
              availableIndustries={availableIndustries}
              totalCount={allInCategory.length}
              filteredCount={sorted.length}
            />
            <div>
              <div className="flex items-center justify-between mb-6">
                <p className="text-sm text-ink-muted">
                  Showing <strong className="text-ink">{sorted.length}</strong>{' '}
                  of <strong className="text-ink">{allInCategory.length}</strong>{' '}
                  products
                </p>
                <SortDropdown />
              </div>
              {sorted.length === 0 ? (
                <div className="text-center py-20 px-6 rounded-xl bg-surface-light border border-black/5">
                  <h3 className="font-heading text-xl font-bold mb-2">
                    No products match these filters.
                  </h3>
                  <p className="text-ink-muted">
                    Try removing a filter or contacting us — we may have what
                    you need that isn&apos;t in our catalog yet.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {sorted.map((p) => (
                    <ProductCard
                      key={p.slug}
                      product={p}
                      showCategory={false}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </Container>
      </section>
    </main>
  )
}

function applyFilters(input: Product[], f: CategoryFilters): Product[] {
  return input.filter((p) => {
    if (f.materials.length > 0) {
      if (!p.materials.some((m) => f.materials.includes(m))) return false
    }
    if (f.industries.length > 0) {
      if (!p.industries.some((i) => f.industries.includes(i))) return false
    }
    if (!moqMatches(p.minOrderQuantity, f.moq)) return false
    if (f.customizable && !p.customizable) return false
    return true
  })
}

function sortProducts(input: Product[], sort: CategoryFilters['sort']): Product[] {
  const copy = [...input]
  switch (sort) {
    case 'name-asc':
      return copy.sort((a, b) => a.name.localeCompare(b.name))
    case 'name-desc':
      return copy.sort((a, b) => b.name.localeCompare(a.name))
    case 'newest':
      return copy.sort((a, b) => {
        const aNew = a.tags.includes('new') ? 1 : 0
        const bNew = b.tags.includes('new') ? 1 : 0
        return bNew - aNew
      })
    case 'popular':
    default:
      return copy.sort((a, b) => {
        const score = (p: Product) =>
          (p.tags.includes('best-seller') ? 2 : 0) + (p.popular ? 1 : 0)
        return score(b) - score(a)
      })
  }
}
