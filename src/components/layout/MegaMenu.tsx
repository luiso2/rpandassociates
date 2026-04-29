'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronDown, ArrowRight } from 'lucide-react'
import { categories } from '@/data/categories'
import { subcategoriesByCategory } from '@/data/subcategories'
import { cn } from '@/lib/cn'
import type { CategorySlug } from '@/types/category'

/**
 * Amazon-inspired mega-menu: hover open per category, three-column subcategory list,
 * featured imagery panel on the right (visual signature of RP — premium glassmorphism).
 */
export function MegaMenu() {
  const [activeCat, setActiveCat] = useState<CategorySlug | null>(null)

  return (
    <ul className="flex items-center gap-0">
      <li className="relative">
        <Link
          href="/"
          className="block px-3 py-4 text-[12px] font-semibold uppercase tracking-[0.6px] text-ink-body hover:text-primary transition"
        >
          Home
        </Link>
      </li>
      {categories.map((cat) => {
        const isActive = activeCat === cat.slug
        const subs = subcategoriesByCategory[cat.slug] ?? []
        const colCount = subs.length > 18 ? 3 : 2
        return (
          <li
            key={cat.slug}
            className="relative"
            onMouseEnter={() => setActiveCat(cat.slug)}
            onMouseLeave={() => setActiveCat(null)}
          >
            <Link
              href={`/products/${cat.slug}`}
              className={cn(
                'flex items-center gap-1 px-3 py-4 text-[12px] font-semibold uppercase tracking-[0.6px] transition relative',
                isActive ? 'text-primary' : 'text-ink-body hover:text-primary',
              )}
            >
              {cat.shortName}
              <ChevronDown
                className={cn(
                  'w-2.5 h-2.5 opacity-60 transition-transform',
                  isActive && 'rotate-180 opacity-100',
                )}
              />
              <span
                className={cn(
                  'absolute bottom-2 left-1/2 -translate-x-1/2 h-[2.5px] bg-gradient-to-r from-primary to-primary-light rounded-full transition-all duration-300 ease-spring',
                  isActive ? 'w-[55%]' : 'w-0',
                )}
              />
            </Link>

            {/* Mega panel */}
            <div
              className={cn(
                'absolute top-full left-0 z-40 transition-all duration-200 ease-spring origin-top',
                isActive
                  ? 'opacity-100 visible translate-y-0'
                  : 'opacity-0 invisible translate-y-2 pointer-events-none',
              )}
            >
              <div className="glass-strong rounded-b-lg shadow-soft-lg border-t-2 border-primary min-w-[700px] grid grid-cols-[1fr_240px] gap-0 overflow-hidden">
                <div className="p-6">
                  <Link
                    href={`/products/${cat.slug}`}
                    className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-[1.5px] text-primary mb-4 hover:gap-2 transition-all"
                  >
                    View All {cat.shortName}
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                  <ul
                    className={cn(
                      'grid gap-y-1.5 gap-x-4',
                      colCount === 3 ? 'grid-cols-3' : 'grid-cols-2',
                    )}
                  >
                    {subs.map((s) => (
                      <li key={s.slug}>
                        <Link
                          href={`/products/${cat.slug}/${s.slug}`}
                          className="block px-2 py-1.5 text-[12px] text-ink-muted hover:text-primary hover:bg-primary/5 rounded-md transition"
                        >
                          {s.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                <Link
                  href={`/products/${cat.slug}`}
                  className="relative bg-ink overflow-hidden group"
                  aria-label={`Explore ${cat.name}`}
                >
                  <Image
                    src={cat.heroImage}
                    alt={cat.name}
                    fill
                    sizes="240px"
                    className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500 ease-spring"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/50 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="text-[10px] font-bold uppercase tracking-[1.5px] text-gold mb-1">
                      Featured
                    </div>
                    <div className="text-white text-sm font-bold leading-tight">
                      {cat.name}
                    </div>
                    <div className="text-white/70 text-[11px] mt-1 line-clamp-2">
                      {cat.description}
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </li>
        )
      })}
      <li className="relative">
        <Link
          href="/industries"
          className="block px-3 py-4 text-[12px] font-semibold uppercase tracking-[0.6px] text-ink-body hover:text-primary transition"
        >
          Industries
        </Link>
      </li>
      <li className="relative">
        <Link
          href="/catalogs"
          className="block px-3 py-4 text-[12px] font-semibold uppercase tracking-[0.6px] text-ink-body hover:text-primary transition"
        >
          Catalogs
        </Link>
      </li>
    </ul>
  )
}
