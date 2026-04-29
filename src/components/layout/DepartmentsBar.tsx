'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  Menu,
  FileText,
  Building2,
  Sparkles,
  ChevronDown,
  ArrowRight,
} from 'lucide-react'
import { categories } from '@/data/categories'
import { subcategoriesByCategory } from '@/data/subcategories'
import { Container } from '@/components/ui/Container'
import { cn } from '@/lib/cn'
import type { CategorySlug } from '@/types/category'

/**
 * Departments bar — dark horizontal strip with hover-mega-menu dropdowns
 * for each product category. Lives below the main header on desktop.
 */
export function DepartmentsBar() {
  const [active, setActive] = useState<CategorySlug | null>(null)

  return (
    <div className="block bg-gradient-to-b from-ink to-ink-body text-white border-t border-white/5 relative">
      <Container>
        {/* Mobile: horizontal scroll (overflow-x-auto + whitespace-nowrap children).
            Desktop (md+): no overflow so the hover mega-panels can extend below
            the bar without being clipped — CSS spec resets overflow-y:visible to
            auto whenever overflow-x is auto/scroll, so we drop overflow-x at md+. */}
        <div className="flex items-center gap-1 overflow-x-auto md:overflow-visible py-1 no-scrollbar text-[11px] font-semibold uppercase tracking-[1px]">
          <Link
            href="/products"
            className="flex items-center gap-1.5 px-3 py-2.5 rounded-md text-white/85 hover:text-gold-light hover:bg-white/5 transition whitespace-nowrap"
          >
            <Menu className="w-3.5 h-3.5" /> All Products
          </Link>
          <span className="w-px h-3 bg-white/10 mx-1" />

          {categories.map((cat) => {
            const isActive = active === cat.slug
            return (
              <div
                key={cat.slug}
                className="relative"
                onMouseEnter={() => setActive(cat.slug)}
                onMouseLeave={() => setActive(null)}
              >
                <Link
                  href={`/products/${cat.slug}`}
                  className={cn(
                    'flex items-center gap-1 px-3 py-2.5 rounded-md whitespace-nowrap transition',
                    isActive
                      ? 'text-gold-light bg-white/8'
                      : 'text-white/75 hover:text-gold-light hover:bg-white/5',
                  )}
                >
                  {cat.shortName}
                  <ChevronDown
                    className={cn(
                      'w-2.5 h-2.5 transition-transform opacity-60',
                      isActive && 'rotate-180 opacity-100',
                    )}
                  />
                </Link>
                <MegaPanel category={cat} open={isActive} />
              </div>
            )
          })}

          <span className="w-px h-3 bg-white/10 mx-1" />
          <Link
            href="/industries"
            className="flex items-center gap-1.5 px-3 py-2.5 rounded-md text-white/85 hover:text-gold-light hover:bg-white/5 transition whitespace-nowrap"
          >
            <Building2 className="w-3.5 h-3.5" /> Shop by Industry
          </Link>
          <Link
            href="/catalogs"
            className="flex items-center gap-1.5 px-3 py-2.5 rounded-md text-white/85 hover:text-gold-light hover:bg-white/5 transition whitespace-nowrap"
          >
            <FileText className="w-3.5 h-3.5" /> Catalogs
          </Link>
          <Link
            href="/customize"
            className="flex items-center gap-1.5 px-3 py-2.5 rounded-md text-gold hover:text-gold-light hover:bg-white/5 transition whitespace-nowrap font-bold"
          >
            <Sparkles className="w-3.5 h-3.5" /> Try Your Logo
          </Link>
        </div>
      </Container>
    </div>
  )
}

interface MegaPanelProps {
  category: (typeof categories)[number]
  open: boolean
}

function MegaPanel({ category, open }: MegaPanelProps) {
  const subs = subcategoriesByCategory[category.slug] ?? []
  const colCount = subs.length > 18 ? 3 : 2

  return (
    <div
      className={cn(
        'absolute top-full left-0 z-40 transition-all duration-200 ease-spring origin-top pt-1.5',
        open
          ? 'opacity-100 visible translate-y-0'
          : 'opacity-0 invisible translate-y-1.5 pointer-events-none',
      )}
    >
      <div className="bg-white text-ink-body rounded-lg shadow-soft-lg border border-black/5 min-w-[700px] grid grid-cols-[1fr_240px] gap-0 overflow-hidden">
        <div className="p-6">
          <Link
            href={`/products/${category.slug}`}
            className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-[1.5px] text-primary mb-4 hover:gap-2 transition-all"
          >
            View all {category.shortName}
            <ArrowRight className="w-3 h-3" />
          </Link>
          <ul
            className={cn(
              'grid gap-y-1 gap-x-3',
              colCount === 3 ? 'grid-cols-3' : 'grid-cols-2',
            )}
          >
            {subs.map((s) => (
              <li key={s.slug}>
                <Link
                  href={`/products/${category.slug}?sub=${s.slug}`}
                  className="block px-2 py-1.5 text-[12px] font-medium text-ink-muted hover:text-primary hover:bg-primary/5 rounded-md transition normal-case tracking-normal"
                >
                  {s.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <Link
          href={`/products/${category.slug}`}
          className="relative bg-ink overflow-hidden group"
          aria-label={`Explore ${category.name}`}
        >
          <Image
            src={category.heroImage}
            alt={category.name}
            fill
            sizes="240px"
            className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500 ease-spring"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            <div className="text-[10px] font-bold uppercase tracking-[1.5px] text-gold mb-1">
              Featured
            </div>
            <div className="text-white text-sm font-bold leading-tight normal-case tracking-normal">
              {category.name}
            </div>
            <div className="text-white/70 text-[11px] mt-1 line-clamp-2 normal-case font-normal tracking-normal">
              {category.description}
            </div>
          </div>
        </Link>
      </div>
    </div>
  )
}
