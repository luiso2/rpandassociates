import { products } from '@/data/products'
import { categories } from '@/data/categories'
import { subcategories } from '@/data/subcategories'
import { industries } from '@/data/industries'
import type { Product, Material } from '@/types/product'
import type { CategorySlug } from '@/types/category'
import type { IndustrySlug } from '@/types/industry'

/**
 * Pre-computed lookup indexes built once at module load. Used everywhere
 * that needs O(1) access by category, industry, subcategory, or slug.
 *
 * Phase 7 build-time validator verifies every productSlug + subcategorySlug
 * + industries[] reference resolves before deploy.
 */

export const productsByCategory: Record<CategorySlug, Product[]> = {
  barware: [],
  'beverage-bags': [],
  drinkware: [],
  'glacier-bags': [],
  'grub-tubs': [],
  'mule-mugs': [],
  vaps: [],
}
for (const p of products) productsByCategory[p.categorySlug].push(p)

export const productsByIndustry = industries.reduce<
  Record<IndustrySlug, Product[]>
>(
  (acc, ind) => {
    acc[ind.slug] = products.filter((p) => p.industries.includes(ind.slug))
    return acc
  },
  {} as Record<IndustrySlug, Product[]>,
)

export const productsBySubcategory = subcategories.reduce<
  Record<string, Product[]>
>((acc, sub) => {
  acc[sub.slug] = products.filter((p) =>
    p.subcategorySlugs.includes(sub.slug),
  )
  return acc
}, {})

export const allMaterials: Material[] = Array.from(
  new Set(products.flatMap((p) => p.materials)),
).sort() as Material[]

/**
 * Slim catalog payload for client-side fuzzy search (Phase 6).
 * Keep this fast and small — sent over the wire on first search-overlay open.
 */
export interface SlimProduct {
  slug: string
  name: string
  category: CategorySlug
  categoryName: string
  image: string
  keywords: string
}

export function buildSlimCatalog(): SlimProduct[] {
  return products.map((p) => ({
    slug: p.slug,
    name: p.name,
    category: p.categorySlug,
    categoryName: categories.find((c) => c.slug === p.categorySlug)?.name ?? '',
    image: p.images[0]?.src ?? '',
    keywords: [
      p.name,
      p.description,
      ...p.subcategorySlugs,
      ...p.tags,
      ...p.materials,
      ...p.industries,
    ].join(' '),
  }))
}
