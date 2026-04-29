import type { MetadataRoute } from 'next'
import { categories } from '@/data/categories'
import { products } from '@/data/products'
import { industries } from '@/data/industries'

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://rpandassociates.com'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/`, lastModified: now, priority: 1.0, changeFrequency: 'weekly' },
    { url: `${BASE_URL}/products`, lastModified: now, priority: 0.9, changeFrequency: 'weekly' },
    { url: `${BASE_URL}/industries`, lastModified: now, priority: 0.8, changeFrequency: 'monthly' },
    { url: `${BASE_URL}/catalogs`, lastModified: now, priority: 0.7, changeFrequency: 'monthly' },
    { url: `${BASE_URL}/about`, lastModified: now, priority: 0.6, changeFrequency: 'monthly' },
    { url: `${BASE_URL}/quote`, lastModified: now, priority: 0.7, changeFrequency: 'monthly' },
    { url: `${BASE_URL}/customize`, lastModified: now, priority: 0.85, changeFrequency: 'monthly' },
  ]

  const categoryRoutes: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${BASE_URL}/products/${cat.slug}`,
    lastModified: now,
    priority: 0.85,
    changeFrequency: 'weekly',
  }))

  const productRoutes: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${BASE_URL}/products/${p.categorySlug}/${p.slug}`,
    lastModified: now,
    priority: 0.7,
    changeFrequency: 'monthly',
  }))

  const industryRoutes: MetadataRoute.Sitemap = industries.map((ind) => ({
    url: `${BASE_URL}/industries/${ind.slug}`,
    lastModified: now,
    priority: 0.7,
    changeFrequency: 'monthly',
  }))

  return [
    ...staticRoutes,
    ...categoryRoutes,
    ...productRoutes,
    ...industryRoutes,
  ]
}
