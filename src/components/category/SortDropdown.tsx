'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { ChevronDown } from 'lucide-react'
import { parseFilters, stringifyFilters } from '@/lib/url-state'
import type { CategoryFilters } from '@/lib/url-state'

const options: Array<{ value: CategoryFilters['sort']; label: string }> = [
  { value: 'popular', label: 'Most Popular' },
  { value: 'name-asc', label: 'Name A → Z' },
  { value: 'name-desc', label: 'Name Z → A' },
  { value: 'newest', label: 'Newest First' },
]

export function SortDropdown() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const filters = parseFilters(searchParams)

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const sort = e.target.value as CategoryFilters['sort']
    const qs = stringifyFilters({ ...filters, sort })
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
  }

  return (
    <div className="relative">
      <select
        value={filters.sort}
        onChange={handleChange}
        aria-label="Sort products"
        className="appearance-none pl-4 pr-9 py-2.5 rounded-pill border border-black/10 bg-white text-sm font-semibold text-ink-body cursor-pointer hover:border-primary/30 focus:outline-none focus:ring-2 focus:ring-primary/30 transition"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            Sort: {o.label}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-light pointer-events-none" />
    </div>
  )
}
