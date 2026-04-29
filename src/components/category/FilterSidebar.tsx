'use client'

import { useCallback, useState } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { Filter, X } from 'lucide-react'
import {
  parseFilters,
  stringifyFilters,
  moqLabel,
  defaultFilters,
  type CategoryFilters,
} from '@/lib/url-state'
import type { Material } from '@/types/product'
import type { IndustrySlug } from '@/types/industry'
import type { Subcategory } from '@/types/category'
import { industries } from '@/data/industries'
import { cn } from '@/lib/cn'

interface SubcategoryWithCount extends Subcategory {
  productCount: number
}

interface FilterSidebarProps {
  availableSubcategories: SubcategoryWithCount[]
  availableMaterials: Material[]
  availableIndustries: IndustrySlug[]
  totalCount: number
  filteredCount: number
}

const materialLabels: Record<Material, string> = {
  plastic: 'Plastic',
  glass: 'Glass',
  aluminum: 'Aluminum',
  'stainless-steel': 'Stainless Steel',
  copper: 'Copper',
  wood: 'Wood',
  silicone: 'Silicone',
  fabric: 'Fabric',
  cardboard: 'Cardboard',
  melamine: 'Melamine',
  ceramic: 'Ceramic',
  acrylic: 'Acrylic',
}

export function FilterSidebar({
  availableSubcategories,
  availableMaterials,
  availableIndustries,
  totalCount,
  filteredCount,
}: FilterSidebarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [mobileOpen, setMobileOpen] = useState(false)
  const filters = parseFilters(searchParams)

  const update = useCallback(
    (next: CategoryFilters) => {
      const qs = stringifyFilters(next)
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
    },
    [pathname, router],
  )

  const toggleArray = <T extends string>(arr: T[], v: T): T[] =>
    arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]

  const reset = () => update(defaultFilters)
  const activeCount =
    filters.subcategories.length +
    filters.materials.length +
    filters.industries.length +
    (filters.moq !== 'any' ? 1 : 0) +
    (filters.customizable ? 1 : 0)
  const hasActive = activeCount > 0

  // Sort subcategories: those with products first, alphabetical
  const sortedSubcategories = [...availableSubcategories].sort((a, b) => {
    if (a.productCount !== b.productCount) return b.productCount - a.productCount
    return a.name.localeCompare(b.name)
  })

  return (
    <>
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className="lg:hidden inline-flex items-center gap-2 px-4 py-2.5 rounded-pill bg-ink text-white text-sm font-bold uppercase tracking-wider"
      >
        <Filter className="w-4 h-4" />
        Filters{hasActive ? ` (${activeCount})` : ''}
      </button>

      <aside
        className={cn(
          'lg:block lg:relative lg:translate-x-0',
          'fixed top-0 left-0 h-full w-[320px] max-w-[85vw] bg-white z-[1003] overflow-y-auto p-6 shadow-soft-lg transition-transform duration-300 ease-spring lg:p-0 lg:shadow-none lg:bg-transparent lg:overflow-visible',
          mobileOpen
            ? 'translate-x-0'
            : '-translate-x-full lg:translate-x-0',
        )}
      >
        <div className="flex items-center justify-between mb-6 lg:mb-4 pb-4 border-b border-black/5">
          <div>
            <h3 className="font-heading text-lg font-bold text-ink">Filters</h3>
            <p className="text-xs text-ink-muted mt-0.5">
              <strong className="text-ink">{filteredCount}</strong> of{' '}
              {totalCount} products
            </p>
          </div>
          <div className="flex items-center gap-2">
            {hasActive && (
              <button
                type="button"
                onClick={reset}
                className="text-xs text-primary font-semibold hover:underline"
              >
                Reset
              </button>
            )}
            <button
              type="button"
              aria-label="Close filters"
              onClick={() => setMobileOpen(false)}
              className="lg:hidden w-8 h-8 rounded-full hover:bg-surface-section flex items-center justify-center"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {sortedSubcategories.length > 0 && (
          <FilterGroup label="Type">
            <div className="max-h-72 overflow-y-auto pr-1 -mr-1 space-y-1">
              {sortedSubcategories.map((s) => {
                const checked = filters.subcategories.includes(s.slug)
                const empty = s.productCount === 0
                return (
                  <label
                    key={s.slug}
                    className={cn(
                      'flex items-center gap-2.5 cursor-pointer text-sm transition py-1 group',
                      empty && 'opacity-50',
                      checked
                        ? 'text-primary font-semibold'
                        : 'text-ink-body hover:text-ink',
                    )}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() =>
                        update({
                          ...filters,
                          subcategories: toggleArray(filters.subcategories, s.slug),
                        })
                      }
                      className="w-4 h-4 rounded border-black/15 text-primary focus:ring-primary/30"
                    />
                    <span className="flex-1 leading-tight">{s.name}</span>
                    <span
                      className={cn(
                        'text-[10px] font-semibold tabular-nums px-1.5 rounded',
                        empty
                          ? 'text-ink-light/60'
                          : checked
                            ? 'text-primary bg-primary/10'
                            : 'text-ink-light bg-surface-section group-hover:bg-primary/10 group-hover:text-primary',
                      )}
                    >
                      {s.productCount}
                    </span>
                  </label>
                )
              })}
            </div>
          </FilterGroup>
        )}

        <FilterGroup label="Material">
          {availableMaterials.length === 0 ? (
            <p className="text-xs text-ink-light italic">No materials filtered yet.</p>
          ) : (
            availableMaterials.map((m) => (
              <Checkbox
                key={m}
                checked={filters.materials.includes(m)}
                onChange={() =>
                  update({
                    ...filters,
                    materials: toggleArray(filters.materials, m),
                  })
                }
                label={materialLabels[m] ?? m}
              />
            ))
          )}
        </FilterGroup>

        <FilterGroup label="Minimum Order Qty">
          {(['any', 'lt-500', '500-1000', 'gt-1000'] as const).map((v) => (
            <Radio
              key={v}
              name="moq"
              checked={filters.moq === v}
              onChange={() => update({ ...filters, moq: v })}
              label={moqLabel(v)}
            />
          ))}
        </FilterGroup>

        {availableIndustries.length > 0 && (
          <FilterGroup label="Industry">
            {availableIndustries.map((slug) => {
              const ind = industries.find((i) => i.slug === slug)
              if (!ind) return null
              return (
                <Checkbox
                  key={slug}
                  checked={filters.industries.includes(slug)}
                  onChange={() =>
                    update({
                      ...filters,
                      industries: toggleArray(filters.industries, slug),
                    })
                  }
                  label={ind.name}
                />
              )
            })}
          </FilterGroup>
        )}

        <FilterGroup label="Customization">
          <Checkbox
            checked={filters.customizable}
            onChange={() =>
              update({ ...filters, customizable: !filters.customizable })
            }
            label="Customizable products only"
          />
        </FilterGroup>
      </aside>

      {mobileOpen && (
        <div
          aria-hidden
          onClick={() => setMobileOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-[1002]"
        />
      )}
    </>
  )
}

function FilterGroup({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="border-t border-black/5 py-4 first:border-t-0 first:pt-0">
      <h4 className="text-[11px] font-bold uppercase tracking-[1.5px] text-ink-light mb-3">
        {label}
      </h4>
      <div className="space-y-2">{children}</div>
    </div>
  )
}

function Checkbox({
  checked,
  onChange,
  label,
}: {
  checked: boolean
  onChange: () => void
  label: string
}) {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer text-sm text-ink-body hover:text-ink transition py-1">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="w-4 h-4 rounded border-black/15 text-primary focus:ring-primary/30"
      />
      {label}
    </label>
  )
}

function Radio({
  name,
  checked,
  onChange,
  label,
}: {
  name: string
  checked: boolean
  onChange: () => void
  label: string
}) {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer text-sm text-ink-body hover:text-ink transition py-1">
      <input
        type="radio"
        name={name}
        checked={checked}
        onChange={onChange}
        className="w-4 h-4 border-black/15 text-primary focus:ring-primary/30"
      />
      {label}
    </label>
  )
}
