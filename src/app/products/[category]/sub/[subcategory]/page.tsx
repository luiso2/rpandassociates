import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { categoryBySlug } from '@/data/categories'
import {
  subcategories as allSubcategories,
  subcategoryBySlug,
} from '@/data/subcategories'
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

/**
 * Generate static params only for (category, subcategory) combinations
 * that have at least one product — keeps the build small and avoids
 * generating empty pages.
 */
export function generateStaticParams() {
  const params: Array<{ category: string; subcategory: string }> = []
  for (const sub of allSubcategories) {
    const productsInSub = (productsByCategory[sub.categorySlug] ?? []).filter(
      (p) => p.subcategorySlugs.includes(sub.slug),
    )
    if (productsInSub.length > 0) {
      params.push({ category: sub.categorySlug, subcategory: sub.slug })
    }
  }
  return params
}

export function generateMetadata({
  params,
}: {
  params: { category: string; subcategory: string }
}): Metadata {
  const category = categoryBySlug[params.category as CategorySlug]
  const subcategory = subcategoryBySlug[params.subcategory]
  if (!category || !subcategory || subcategory.categorySlug !== category.slug) {
    return { title: 'Not Found' }
  }
  return {
    title: `${subcategory.name} — ${category.name}`,
    description: `Custom ${subcategory.name.toLowerCase()} for ${category.name.toLowerCase()}. Real photography, structured specs, instant logo preview, and same-day quote response from RP & Associates.`,
  }
}

export default function SubcategoryPage({
  params,
  searchParams,
}: {
  params: { category: string; subcategory: string }
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const category = categoryBySlug[params.category as CategorySlug]
  const subcategory = subcategoryBySlug[params.subcategory]
  if (!category || !subcategory || subcategory.categorySlug !== category.slug) {
    notFound()
  }

  const allInCategory = productsByCategory[category.slug] ?? []
  const productsInSub = allInCategory.filter((p) =>
    p.subcategorySlugs.includes(subcategory.slug),
  )

  const filters = parseFilters(searchParams)
  // Subcategory page = pre-filtered. Drop any `sub=` from URL filters
  // since the subcategory is determined by the route.
  const sidebarFilters: CategoryFilters = { ...filters, subcategories: [] }
  const filtered = applyFilters(productsInSub, sidebarFilters)
  const sorted = sortProducts(filtered, filters.sort)

  // Sibling subcategories with non-zero counts — for the chip nav
  const siblings = (allSubcategories.filter((s) => s.categorySlug === category.slug) ?? [])
    .map((s) => ({
      ...s,
      productCount: allInCategory.filter((p) => p.subcategorySlugs.includes(s.slug))
        .length,
    }))
    .filter((s) => s.productCount > 0)
    .sort((a, b) => b.productCount - a.productCount)

  const availableMaterials = Array.from(
    new Set(productsInSub.flatMap((p) => p.materials)),
  )
    .sort()
    .filter((m) => allMaterials.includes(m))

  const availableIndustries: IndustrySlug[] = Array.from(
    new Set(productsInSub.flatMap((p) => p.industries)),
  ).sort() as IndustrySlug[]

  return (
    <main>
      <Breadcrumbs
        items={[
          { label: 'Products', href: '/products' },
          { label: category.name, href: `/products/${category.slug}` },
          { label: subcategory.name },
        ]}
      />
      <CategoryHeader category={category} productCount={productsInSub.length} />

      {/* Subcategory chip nav — Amazon-style sub-aisle picker */}
      {siblings.length > 1 && (
        <div className="bg-white border-b border-black/5">
          <Container>
            <div className="flex items-center gap-2 py-3 overflow-x-auto no-scrollbar">
              <Link
                href={`/products/${category.slug}`}
                className="px-3.5 py-1.5 rounded-pill bg-surface-section text-xs font-bold uppercase tracking-wider text-ink-muted hover:bg-ink hover:text-white transition whitespace-nowrap"
              >
                All {category.shortName}
              </Link>
              {siblings.map((s) => {
                const active = s.slug === subcategory.slug
                return (
                  <Link
                    key={s.slug}
                    href={`/products/${category.slug}/sub/${s.slug}`}
                    className={`px-3.5 py-1.5 rounded-pill text-xs font-bold uppercase tracking-wider transition whitespace-nowrap ${
                      active
                        ? 'bg-primary text-white shadow-primary'
                        : 'bg-surface-section text-ink-muted hover:bg-ink hover:text-white'
                    }`}
                  >
                    {s.name}
                    <span className="ml-1.5 opacity-70">{s.productCount}</span>
                  </Link>
                )
              })}
            </div>
          </Container>
        </div>
      )}

      <section className="py-10 bg-white">
        <Container>
          <div className="grid lg:grid-cols-[260px_1fr] gap-8">
            <FilterSidebar
              availableSubcategories={[]}
              availableMaterials={availableMaterials}
              availableIndustries={availableIndustries}
              totalCount={productsInSub.length}
              filteredCount={sorted.length}
            />
            <div>
              <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                <p className="text-sm text-ink-muted">
                  Showing <strong className="text-ink">{sorted.length}</strong>{' '}
                  of{' '}
                  <strong className="text-ink">{productsInSub.length}</strong>{' '}
                  {subcategory.name}
                </p>
                <SortDropdown />
              </div>
              {sorted.length === 0 ? (
                <EmptyState category={category.shortName} subcategoryName={subcategory.name} />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {sorted.map((p) => (
                    <ProductCard key={p.slug} product={p} showCategory={false} />
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

function EmptyState({
  category,
  subcategoryName,
}: {
  category: string
  subcategoryName: string
}) {
  return (
    <div className="text-center py-20 px-6 rounded-xl bg-surface-light border border-black/5">
      <h3 className="font-heading text-xl font-bold mb-2">
        No {subcategoryName.toLowerCase()} match these filters.
      </h3>
      <p className="text-ink-muted mb-6">
        We may carry it as part of our extended {category.toLowerCase()} program — just ask.
      </p>
      <Link
        href={`/quote?products=${encodeURIComponent(`${subcategoryName} (${category})`)}`}
        className="inline-flex items-center gap-2 px-6 py-3 rounded-pill bg-primary text-white text-sm font-bold uppercase tracking-wider hover:bg-primary-dark transition"
      >
        Request {subcategoryName} <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
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
