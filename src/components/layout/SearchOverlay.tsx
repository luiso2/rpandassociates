'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Fuse from 'fuse.js'
import { Search, X, ArrowUpRight, Loader2 } from 'lucide-react'
import type { SlimProduct } from '@/lib/search-index'
import { cn } from '@/lib/cn'

interface SearchOverlayProps {
  open: boolean
  onClose: () => void
}

let cachedCatalog: SlimProduct[] | null = null

export function SearchOverlay({ open, onClose }: SearchOverlayProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [query, setQuery] = useState('')
  const [catalog, setCatalog] = useState<SlimProduct[] | null>(cachedCatalog)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!open) return
    const t = window.setTimeout(() => inputRef.current?.focus(), 80)
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.clearTimeout(t)
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  // Lazy-fetch catalog on first open
  useEffect(() => {
    if (!open || catalog) return
    setLoading(true)
    fetch('/api/search')
      .then((r) => r.json())
      .then((data: SlimProduct[]) => {
        cachedCatalog = data
        setCatalog(data)
      })
      .catch(() => {
        // Silent fail — fallback to submit-and-redirect path
      })
      .finally(() => setLoading(false))
  }, [open, catalog])

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
    return fuse.search(query.trim()).slice(0, 8)
  }, [fuse, query])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return
    window.location.href = `/search?q=${encodeURIComponent(query.trim())}`
  }

  return (
    <div
      role="dialog"
      aria-label="Search"
      aria-modal="true"
      className={cn(
        'fixed inset-0 z-[2000] backdrop-blur-md transition-all duration-300 ease-spring flex items-start justify-center pt-24',
        open
          ? 'opacity-100 pointer-events-auto bg-black/85'
          : 'opacity-0 pointer-events-none bg-black/0',
      )}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <button
        type="button"
        aria-label="Close search"
        onClick={onClose}
        className="absolute top-7 right-10 text-white/80 hover:text-white text-2xl transition hover:rotate-90 duration-300"
      >
        <X className="w-7 h-7" />
      </button>

      <div
        className={cn(
          'w-[92%] max-w-2xl transition-all duration-500',
          open ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0',
        )}
      >
        <form onSubmit={handleSubmit} className="relative">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products, catalogs, and more…"
            aria-label="Search products"
            className="w-full pl-6 pr-16 py-5 text-lg rounded-pill border-[3px] border-primary bg-white shadow-soft-lg outline-none"
          />
          <button
            type="submit"
            aria-label="Submit search"
            className="absolute right-2 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary-light text-white flex items-center justify-center hover:scale-105 transition"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Search className="w-5 h-5" />
            )}
          </button>
        </form>

        {results.length > 0 && (
          <div className="mt-3 rounded-xl bg-white shadow-soft-lg overflow-hidden divide-y divide-black/5">
            {results.map(({ item }) => (
              <Link
                key={item.slug}
                href={`/products/${item.category}/${item.slug}`}
                onClick={onClose}
                className="flex items-center gap-4 p-4 hover:bg-surface-section transition group"
              >
                {item.image && (
                  <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-surface-section shrink-0">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="font-heading text-sm font-bold text-ink truncate">
                    {item.name}
                  </div>
                  <div className="text-[11px] text-ink-muted uppercase tracking-wider mt-0.5">
                    {item.categoryName}
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-ink-light group-hover:text-primary transition" />
              </Link>
            ))}
            <Link
              href={`/search?q=${encodeURIComponent(query.trim())}`}
              onClick={onClose}
              className="block text-center py-3 text-sm text-primary font-semibold hover:bg-primary/5 transition"
            >
              View all results for &ldquo;{query.trim()}&rdquo; →
            </Link>
          </div>
        )}

        {query.trim() && results.length === 0 && !loading && (
          <div className="mt-3 rounded-xl bg-white shadow-soft-md p-6 text-center text-sm text-ink-muted">
            No products match &ldquo;{query.trim()}&rdquo;. Try a broader term or
            browse by category.
          </div>
        )}
      </div>
    </div>
  )
}
