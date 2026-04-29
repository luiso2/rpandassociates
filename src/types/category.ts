export type CategorySlug =
  | 'barware'
  | 'beverage-bags'
  | 'drinkware'
  | 'glacier-bags'
  | 'grub-tubs'
  | 'mule-mugs'
  | 'vaps'

export interface Category {
  slug: CategorySlug
  name: string
  shortName: string
  description: string
  longDescription: string
  heroImage: string
  iconImage?: string
  featuredProductSlugs: string[]
  subcategorySlugs: string[]
  seo: { title: string; description: string }
}

export interface Subcategory {
  slug: string
  categorySlug: CategorySlug
  name: string
  description?: string
  image?: string
  productSlugs: string[]
}
