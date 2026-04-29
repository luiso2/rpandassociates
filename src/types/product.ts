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

export interface ProductDimensions {
  /** Width in millimetres */
  widthMm?: number
  /** Depth (front-to-back) in millimetres */
  depthMm?: number
  /** Height in millimetres */
  heightMm?: number
  /** Diameter for cylindrical products in millimetres */
  diameterMm?: number
}

export interface ProductSpecs {
  /** Volume capacity in fluid ounces */
  capacityOz?: number
  /** Volume capacity in millilitres */
  capacityMl?: number
  dimensions?: ProductDimensions
  /** Weight per unit in grams */
  weightG?: number
  /** Production lead time range in business days */
  leadTimeDays?: { min: number; max: number }
  /** Available decoration / customization techniques */
  customizationOptions?: Array<
    | 'pad-print'
    | 'screen-print'
    | 'laser-engraving'
    | 'sublimation'
    | 'embossing'
    | 'silkscreen'
    | 'wrap'
    | 'sticker'
    | 'in-mold-label'
  >
  /** Country of origin / manufacture */
  origin?: string
  /** Free-form notes shown on the spec table */
  notes?: string
}

export interface ProductVariant {
  /** Stable id, unique within the product */
  id: string
  /** Display label, e.g. "Copper", "Silver", "Black" */
  label: string
  /** CSS color or gradient for the swatch chip */
  swatchColor?: string
  /** Primary image when this variant is selected */
  image: ProductImage
  /** Additional gallery images for this variant (optional) */
  additionalImages?: ProductImage[]
  /** SKU or internal code if applicable */
  sku?: string
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
  /** Structured product specifications */
  specs?: ProductSpecs
  /** Color/finish variants — first variant's image becomes the gallery cover */
  variants?: ProductVariant[]
  /** Optional logo placement zone for the customizer */
  logoZone?: LogoZone
  /** Direct link back to the source catalog entry, if any */
  catalogSourceUrl?: string
  seo: { title: string; description: string }
}
