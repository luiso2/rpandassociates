import type { Material } from '@/types/product'
import type { IndustrySlug } from '@/types/industry'

/**
 * Filter state for category pages. Synchronized with URL search params
 * so filters are bookmarkable and shareable.
 */
export interface CategoryFilters {
  subcategories: string[]
  materials: Material[]
  industries: IndustrySlug[]
  moq: 'any' | 'lt-500' | '500-1000' | 'gt-1000'
  customizable: boolean
  sort: 'popular' | 'name-asc' | 'name-desc' | 'newest'
}

export const defaultFilters: CategoryFilters = {
  subcategories: [],
  materials: [],
  industries: [],
  moq: 'any',
  customizable: false,
  sort: 'popular',
}

export function parseFilters(
  params: URLSearchParams | { [key: string]: string | string[] | undefined },
): CategoryFilters {
  const get = (key: string): string | undefined => {
    if (params instanceof URLSearchParams) return params.get(key) ?? undefined
    const value = params[key]
    return Array.isArray(value) ? value[0] : value
  }

  const subcategories = (get('sub')?.split(',') ?? []).filter(Boolean)
  const materials = (get('material')?.split(',') ?? []).filter(Boolean) as Material[]
  const industries = (get('industry')?.split(',') ?? []).filter(
    Boolean,
  ) as IndustrySlug[]
  const moqRaw = get('moq') ?? 'any'
  const moq: CategoryFilters['moq'] = (
    ['any', 'lt-500', '500-1000', 'gt-1000'].includes(moqRaw)
      ? moqRaw
      : 'any'
  ) as CategoryFilters['moq']
  const customizable = get('custom') === '1'
  const sortRaw = get('sort') ?? 'popular'
  const sort: CategoryFilters['sort'] = (
    ['popular', 'name-asc', 'name-desc', 'newest'].includes(sortRaw)
      ? sortRaw
      : 'popular'
  ) as CategoryFilters['sort']

  return { subcategories, materials, industries, moq, customizable, sort }
}

export function stringifyFilters(filters: CategoryFilters): string {
  const params = new URLSearchParams()
  if (filters.subcategories.length)
    params.set('sub', filters.subcategories.join(','))
  if (filters.materials.length) params.set('material', filters.materials.join(','))
  if (filters.industries.length) params.set('industry', filters.industries.join(','))
  if (filters.moq !== 'any') params.set('moq', filters.moq)
  if (filters.customizable) params.set('custom', '1')
  if (filters.sort !== 'popular') params.set('sort', filters.sort)
  return params.toString()
}

export function moqLabel(value: CategoryFilters['moq']): string {
  switch (value) {
    case 'lt-500':
      return 'Under 500'
    case '500-1000':
      return '500 – 1,000'
    case 'gt-1000':
      return 'Over 1,000'
    default:
      return 'Any quantity'
  }
}

export function moqMatches(
  productMoq: number | undefined,
  filter: CategoryFilters['moq'],
): boolean {
  if (filter === 'any') return true
  if (productMoq === undefined) return true
  if (filter === 'lt-500') return productMoq < 500
  if (filter === '500-1000') return productMoq >= 500 && productMoq <= 1000
  if (filter === 'gt-1000') return productMoq > 1000
  return true
}
