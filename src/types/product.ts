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

/**
 * Defines where a customer's logo should be applied on a product image.
 * Coordinates are normalized (0–1) relative to the image dimensions.
 * `tilt` and `curve` add 3D-feel perspective for cylindrical/curved surfaces.
 */
export interface LogoZone {
  /** Horizontal center of the logo placement, 0 = left edge, 1 = right edge */
  centerX: number
  /** Vertical center of the logo placement, 0 = top, 1 = bottom */
  centerY: number
  /** Maximum width of the logo as fraction of product image width (0–1) */
  maxWidth: number
  /** Maximum height of the logo as fraction of product image height (0–1) */
  maxHeight: number
  /** Perspective tilt in degrees: positive = top tilted away (cylinders, mugs) */
  tilt?: number
  /** Curvature factor (0–0.3) for wrapping around curved surfaces */
  curve?: number
  /** Surface type for shader hints */
  surface?: 'flat' | 'cylinder' | 'sphere' | 'fabric'
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
  /** Optional logo placement zone for the customizer */
  logoZone?: LogoZone
  seo: { title: string; description: string }
}
