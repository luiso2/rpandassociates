'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import Fuse from 'fuse.js'
import { Search, ChevronDown, ArrowUpRight, Loader2, X } from 'lucide-react'
import type { SlimProduct } from '@/lib/search-index'
import { categories } from '@/data/categories'
import type { CategorySlug } from '@/types/category'
import { cn } from '@/lib/cn'

let cachedCatalog: SlimProduct[] | null = null

interface HeaderSearchProps {
  /** When true, hides the category selector (mobile compact). */
  compact?: boolean
}

export function HeaderSearch({ compact = false }: HeaderSearchProps) {
  const router = useRouter()
  const wrapperRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [query, setQuery] = useState('')
  const [scope, setScope] = useState<'all' | CategorySlug>('all')
  const [scopeOpen, setScopeOpen] = useState(false)
  const [focused, setFocused] = useState(false)
  const [catalog, setCatalog] = useState<SlimProduct[] | null>(cachedCatalog)
  const [loading, setLoading] = useState(false)

  // Click outside closes results + scope dropdown
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!wrapperRef.current?.contains(e.target as Node)) {
        setFocused(false)
        setScopeOpen(false)
      }
    }
    window.addEventListener('mousedown', onClick)
    return () => window.removeEventListener('mousedown', onClick)
  }, [])

  // Lazy-fetch the slim catalog the first time the input is focused
  useEffect(() => {
    if (!focused || catalog) return
    setLoading(true)
    fetch('/api/search')
      .then((r) => r.json())
      .then((data: SlimProduct[]) => {
        cachedCatalog = data
        setCatalog(data)
      })
      .catch(() => {
        /* fall back to full submit to /search */
      })
      .finally(() => setLoading(false))
  }, [focused, catalog])

  const fuse = useMemo(() => {
    if (!catalog) return null
    return new Fuse(catalog, {
      keys: [
        { name: 'name', weight: 2 },
        { name: 'keywords', weight: 1 },
        { name: 'categoryName', weight: 0.5 },
      ],
      threshold: 0.35,
      distance: 100,
      minMatchCharLength: 2,
    })
  }, [catalog])

  const results = useMemo(() => {
    if (!fuse || !query.trim()) return []
    const filtered =
      scope === 'all'
        ? catalog ?? []
        : (catalog ?? []).filter((p) => p.category === scope)
    if (scope === 'all') {
      return fuse.search(query.trim()).slice(0, 6)
    }
    const scoped = new Fuse(filtered, {
      keys: [
        { name: 'name', weight: 2 },
        { name: 'keywords', weight: 1 },
      ],
      threshold: 0.35,
      minMatchCharLength: 2,
    })
    return scoped.search(query.trim()).slice(0, 6)
  }, [fuse, query, scope, catalog])

  const showDropdown = focused && (loading || query.trim().length >= 2)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return
    const params = new URLSearchParams({ q: query.trim() })
    if (scope !== 'all') params.set('category', scope)
    router.push(`/search?${params.toString()}`)
    setFocused(false)
    inputRef.current?.blur()
  }

  const scopeLabel =
    scope === 'all'
      ? 'All'
      : categories.find((c) => c.slug === scope)?.shortName ?? 'All'

  return (
    <div ref={wrapperRef} className="relative w-full">
      <form
        onSubmit={handleSubmit}
        className={cn(
          'flex items-stretch h-11 rounded-md overflow-hidden bg-white shadow-soft-sm transition-all duration-300',
          'border-2',
          focused
            ? 'border-gold ring-4 ring-gold/15 shadow-soft-md'
            : 'border-transparent hover:border-black/10',
        )}
      >
        {!compact && (
          <div className="relative shrink-0">
            <button
              type="button"
              aria-haspopup="listbox"
              aria-expanded={scopeOpen}
              onClick={() => setScopeOpen((v) => !v)}
              className="h-full px-2.5 md:px-3.5 text-[10px] md:text-xs font-bold uppercase tracking-wider text-ink-body bg-surface-section/60 hover:bg-surface-section flex items-center gap-1 md:gap-1.5 border-r border-black/5 transition"
            >
              <span className="max-w-[60px] md:max-w-[110px] truncate">
                {scopeLabel}
              </span>
              <ChevronDown
                className={cn(
                  'w-2.5 h-2.5 md:w-3 md:h-3 text-ink-light transition-transform shrink-0',
                  scopeOpen && 'rotate-180',
                )}
              />
            </button>
            {scopeOpen && (
              <>
                {/* Mobile-only backdrop so the user can tap outside to close */}
                <button
                  type="button"
                  aria-label="Close categories"
                  onClick={() => setScopeOpen(false)}
                  className="md:hidden fixed inset-0 z-40 bg-ink/40 backdrop-blur-sm cursor-default"
                />
                <div
                  role="listbox"
                  className={cn(
                    'absolute top-[calc(100%+8px)] left-0 z-50 overflow-hidden',
                    // Mobile: anchored full-width to the search bar, NOT the
                    // tiny scope button. Achieved with right-0 + max-width.
                    'w-screen max-w-[calc(100vw-2rem)] sm:max-w-[400px] md:w-[360px]',
                    'glass-strong rounded-xl shadow-soft-lg border border-white/70',
                  )}
                >
                  <div className="px-4 py-2.5 bg-gradient-to-r from-ink to-ink-body text-white text-[10px] font-bold uppercase tracking-[1.5px] flex items-center justify-between">
                    <span>Search in</span>
                    <button
                      type="button"
                      onClick={() => setScopeOpen(false)}
                      className="md:hidden text-white/60 hover:text-white text-[10px]"
                      aria-label="Close"
                    >
                      ✕
                    </button>
                  </div>
                  <ul className="grid grid-cols-2 gap-1 p-2 max-h-[60vh] overflow-y-auto">
                    <ScopeOption
                      active={scope === 'all'}
                      fullWidth
                      onClick={() => {
                        setScope('all')
                        setScopeOpen(false)
                        inputRef.current?.focus()
                      }}
                    >
                      <span className="font-bold">All Products</span>
                    </ScopeOption>
                    {categories.map((c) => (
                      <ScopeOption
                        key={c.slug}
                        active={scope === c.slug}
                        onClick={() => {
                          setScope(c.slug)
                          setScopeOpen(false)
                          inputRef.current?.focus()
                        }}
                      >
                        {c.name}
                      </ScopeOption>
                    ))}
                  </ul>
                </div>
              </>
            )}
          </div>
        )}

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          placeholder={
            compact
              ? 'Search products…'
              : 'Search for shakers, mugs, glacier bags, …'
          }
          aria-label="Search products"
          className="flex-1 min-w-0 px-4 text-sm text-ink-body placeholder:text-ink-light bg-transparent outline-none"
        />

        {query && (
          <button
            type="button"
            aria-label="Clear search"
            onClick={() => {
              setQuery('')
              inputRef.current?.focus()
            }}
            className="px-2 text-ink-light hover:text-ink transition"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        <button
          type="submit"
          aria-label="Search"
          className="shrink-0 px-4 md:px-5 bg-gradient-to-br from-gold to-gold-dark text-white flex items-center justify-center hover:from-gold-light hover:to-gold transition-all"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Search className="w-4 h-4" />
          )}
        </button>
      </form>

      {/* Autocomplete dropdown */}
      {showDropdown && (
        <div className="absolute top-full left-0 right-0 mt-2 glass-strong rounded-lg shadow-soft-lg border border-white/70 overflow-hidden z-50 animate-fade-in">
          {results.length === 0 && !loading && query.trim().length >= 2 && (
            <div className="p-6 text-center text-sm text-ink-muted">
              No products match{' '}
              <strong className="text-ink">&ldquo;{query.trim()}&rdquo;</strong>
              . Try a broader term.
            </div>
          )}

          {results.length > 0 && (
            <ul className="divide-y divide-black/5">
              {results.map(({ item }) => (
                <li key={item.slug}>
                  <Link
                    href={`/products/${item.category}/${item.slug}`}
                    onClick={() => {
                      setFocused(false)
                      setQuery('')
                    }}
                    className="flex items-center gap-3.5 p-3 hover:bg-primary/5 transition group"
                  >
                    {item.image && (
                      <div className="relative w-12 h-12 rounded-md overflow-hidden bg-surface-section shrink-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="font-heading text-sm font-bold text-ink truncate group-hover:text-primary transition">
                        {item.name}
                      </div>
                      <div className="text-[10px] text-ink-muted uppercase tracking-[1.5px] mt-0.5 font-semibold">
                        {item.categoryName}
                      </div>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-ink-light group-hover:text-primary group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all shrink-0" />
                  </Link>
                </li>
              ))}
            </ul>
          )}

          {query.trim() && (
            <Link
              href={`/search?q=${encodeURIComponent(query.trim())}${scope !== 'all' ? `&category=${scope}` : ''}`}
              onClick={() => {
                setFocused(false)
                setQuery('')
              }}
              className="block px-5 py-3 bg-surface-section/60 text-center text-xs font-bold uppercase tracking-[1.5px] text-primary hover:bg-primary hover:text-white transition border-t border-black/5"
            >
              View all results for &ldquo;{query.trim()}&rdquo;
            </Link>
          )}
        </div>
      )}
    </div>
  )
}

interface ScopeOptionProps {
  active: boolean
  onClick: () => void
  children: React.ReactNode
  fullWidth?: boolean
}

function ScopeOption({ active, onClick, children, fullWidth }: ScopeOptionProps) {
  return (
    <li className={cn(fullWidth && 'col-span-2')}>
      <button
        type="button"
        role="option"
        aria-selected={active}
        onClick={onClick}
        className={cn(
          'w-full text-left px-3 py-2 text-xs font-semibold rounded-md transition',
          active
            ? 'bg-primary text-white shadow-soft-sm'
            : 'text-ink-body hover:bg-primary/5 hover:text-primary',
        )}
      >
        {children}
      </button>
    </li>
  )
}
