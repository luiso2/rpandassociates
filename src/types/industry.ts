import type { CategorySlug } from './category'

export type IndustrySlug =
  | 'hospitality'
  | 'beverage'
  | 'retail'
  | 'sports'
  | 'healthcare'
  | 'corporate'
  | 'events'
  | 'restaurants'

export interface Industry {
  slug: IndustrySlug
  name: string
  tagline: string
  description: string
  heroImage: string
  iconName: string
  featuredCategorySlugs: CategorySlug[]
}
