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
import { industries } from '@/data/industries'
import { cn } from '@/lib/cn'

interface FilterSidebarProps {
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
  const hasActive =
    filters.materials.length > 0 ||
    filters.industries.length > 0 ||
    filters.moq !== 'any' ||
    filters.customizable

  return (
    <>
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className="lg:hidden inline-flex items-center gap-2 px-4 py-2.5 rounded-pill bg-ink text-white text-sm font-bold uppercase tracking-wider"
      >
        <Filter className="w-4 h-4" />
        Filters{hasActive && ` (${filters.materials.length + filters.industries.length + (filters.moq !== 'any' ? 1 : 0) + (filters.customizable ? 1 : 0)})`}
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
        <div className="flex items-center justify-between mb-6 lg:mb-4">
          <div>
            <h3 className="font-heading text-lg font-bold text-ink">Filters</h3>
            <p className="text-xs text-ink-muted mt-0.5">
              {filteredCount} of {totalCount} products
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

        <FilterGroup label="Material">
          {availableMaterials.map((m) => (
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
          ))}
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
    <div className="border-t border-black/5 py-4">
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
