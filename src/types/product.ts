import type { CategorySlug } from './category'
import type { IndustrySlug } from './industry'

export type Material =
  | 'plastic'
  | 'glass'
  | 'aluminum'
  | 'stainless-steel'
  | 'copper'
  | 'wood'
  | 'silicone'
  | 'fabric'
  | 'cardboard'
  | 'melamine'
  | 'ceramic'
  | 'acrylic'

export interface ProductImage {
  src: string
  alt: string
  width: number
  height: number
}

export interface Product {
  slug: string
  name: string
  shortName?: string
  description: string
  longDescription?: string
  categorySlug: CategorySlug
  subcategorySlugs: string[]
  industries: IndustrySlug[]
  images: ProductImage[]
  materials: Material[]
  minOrderQuantity?: number
  customizable: boolean
  tags: string[]
  featured: boolean
  popular: boolean
  catalogPdfUrl?: string
  relatedProductSlugs?: string[]
  seo: { title: string; description: string }
}
