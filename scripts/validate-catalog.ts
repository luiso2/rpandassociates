/**
 * Build-time data validator. Catches broken references before deploy:
 * - subcategorySlugs[] referencing non-existent subcategory
 * - relatedProductSlugs[] referencing non-existent product
 * - duplicate slugs
 * - subcategories without a category
 *
 * Run with: pnpm validate:data
 * Exits non-zero on error so CI can gate deploys.
 */
import { products } from '../src/data/products'
import { categories } from '../src/data/categories'
import { subcategories } from '../src/data/subcategories'
import { industries } from '../src/data/industries'
import { catalogs } from '../src/data/catalogs'

const errors: string[] = []

const categorySlugs = new Set(categories.map((c) => c.slug))
const subcategorySlugs = new Set(subcategories.map((s) => s.slug))
const productSlugs = new Set(products.map((p) => p.slug))
const industrySlugs = new Set(industries.map((i) => i.slug))

// 1. Duplicate slugs
const seenCat = new Set<string>()
for (const c of categories) {
  if (seenCat.has(c.slug)) errors.push(`Duplicate category slug: ${c.slug}`)
  seenCat.add(c.slug)
}
const seenSub = new Set<string>()
for (const s of subcategories) {
  if (seenSub.has(s.slug)) errors.push(`Duplicate subcategory slug: ${s.slug}`)
  seenSub.add(s.slug)
}
const seenProd = new Set<string>()
for (const p of products) {
  if (seenProd.has(p.slug)) errors.push(`Duplicate product slug: ${p.slug}`)
  seenProd.add(p.slug)
}

// 2. Subcategory has valid category
for (const s of subcategories) {
  if (!categorySlugs.has(s.categorySlug)) {
    errors.push(
      `Subcategory "${s.slug}" references unknown category "${s.categorySlug}"`,
    )
  }
}

// 3. Product references
for (const p of products) {
  if (!categorySlugs.has(p.categorySlug)) {
    errors.push(
      `Product "${p.slug}" references unknown category "${p.categorySlug}"`,
    )
  }
  for (const sub of p.subcategorySlugs) {
    if (!subcategorySlugs.has(sub)) {
      errors.push(
        `Product "${p.slug}" references unknown subcategory "${sub}"`,
      )
    }
  }
  for (const ind of p.industries) {
    if (!industrySlugs.has(ind)) {
      errors.push(`Product "${p.slug}" references unknown industry "${ind}"`)
    }
  }
  for (const rel of p.relatedProductSlugs ?? []) {
    if (!productSlugs.has(rel)) {
      errors.push(
        `Product "${p.slug}" relates to unknown product "${rel}"`,
      )
    }
  }
  if (p.images.length === 0) {
    errors.push(`Product "${p.slug}" has no images`)
  }
}

// 4. Category featured product references
for (const c of categories) {
  for (const slug of c.featuredProductSlugs) {
    if (!productSlugs.has(slug)) {
      errors.push(
        `Category "${c.slug}" features unknown product "${slug}"`,
      )
    }
  }
  for (const sub of c.subcategorySlugs) {
    if (!subcategorySlugs.has(sub)) {
      errors.push(
        `Category "${c.slug}" lists unknown subcategory "${sub}"`,
      )
    }
  }
}

// 5. Industry featured category references
for (const i of industries) {
  for (const cat of i.featuredCategorySlugs) {
    if (!categorySlugs.has(cat)) {
      errors.push(
        `Industry "${i.slug}" features unknown category "${cat}"`,
      )
    }
  }
}

// 6. Catalog URLs sanity
for (const c of catalogs) {
  if (!c.url.startsWith('https://')) {
    errors.push(`Catalog "${c.slug}" URL must use https:`)
  }
}

if (errors.length > 0) {
  console.error('\n❌ Catalog validation failed:\n')
  for (const e of errors) console.error('  · ' + e)
  console.error(`\n${errors.length} error${errors.length === 1 ? '' : 's'}\n`)
  process.exit(1)
} else {
  const counts = `${categories.length} categories · ${subcategories.length} subcategories · ${products.length} products · ${industries.length} industries · ${catalogs.length} catalogs`
  console.log(`✓ Catalog validated — ${counts}`)
}
