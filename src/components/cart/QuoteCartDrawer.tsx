'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect } from 'react'
import { X, Trash2, FileText, ShoppingBag, Plus, Minus } from 'lucide-react'
import { useQuoteCart } from './QuoteCartProvider'
import { cn } from '@/lib/cn'

interface QuoteCartDrawerProps {
  open: boolean
  onClose: () => void
}

export function QuoteCartDrawer({ open, onClose }: QuoteCartDrawerProps) {
  const { items, removeItem, updateQuantity, clear, count } = useQuoteCart()

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <>
      <div
        aria-hidden
        onClick={onClose}
        className={cn(
          'fixed inset-0 bg-black/60 backdrop-blur-sm z-[1003] transition-opacity duration-300',
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
        )}
      />
      <aside
        role="dialog"
        aria-label="Quote cart"
        className={cn(
          'fixed top-0 right-0 h-full w-[420px] max-w-[92vw] bg-white z-[1004] shadow-soft-lg flex flex-col transition-transform duration-400 ease-spring',
          open ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-black/5 bg-gradient-to-br from-primary to-primary-light text-white">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-5 h-5" />
            <div>
              <div className="font-heading text-base font-bold">Your Quote</div>
              <div className="text-xs opacity-80">
                {count} item{count === 1 ? '' : 's'}
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close cart"
            className="w-9 h-9 rounded-full hover:bg-white/15 flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
            <div className="w-16 h-16 rounded-full bg-surface-section flex items-center justify-center mb-4">
              <ShoppingBag className="w-7 h-7 text-ink-light" />
            </div>
            <h3 className="font-heading text-lg font-bold mb-2">
              Your quote is empty
            </h3>
            <p className="text-sm text-ink-muted mb-6 max-w-xs leading-relaxed">
              Browse products and tap <strong>Add to Quote</strong> to build a
              custom request — submit them all together when ready.
            </p>
            <Link
              href="/products"
              onClick={onClose}
              className="px-6 py-3 rounded-pill bg-primary text-white text-sm font-bold uppercase tracking-wider hover:bg-primary-dark transition"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {items.map((item) => (
                <div
                  key={item.productSlug}
                  className="flex gap-3 p-3 rounded-lg bg-white border border-black/5"
                >
                  <div className="relative w-20 h-20 rounded-md overflow-hidden bg-surface-section shrink-0">
                    <Image
                      src={item.productImage}
                      alt={item.productName}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/products/${findCategoryFromSlug(item.productSlug)}/${item.productSlug}`}
                      onClick={onClose}
                      className="block font-heading text-sm font-bold text-ink leading-snug hover:text-primary transition line-clamp-2"
                    >
                      {item.productName}
                    </Link>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-1 border border-black/10 rounded-pill p-0.5">
                        <button
                          type="button"
                          aria-label="Decrease quantity"
                          onClick={() =>
                            updateQuantity(
                              item.productSlug,
                              Math.max(1, item.quantity - 50),
                            )
                          }
                          className="w-6 h-6 rounded-full hover:bg-surface-section flex items-center justify-center transition"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <input
                          type="number"
                          value={item.quantity}
                          min={1}
                          onChange={(e) =>
                            updateQuantity(
                              item.productSlug,
                              Math.max(1, parseInt(e.target.value, 10) || 1),
                            )
                          }
                          className="w-14 text-center text-xs font-semibold bg-transparent outline-none"
                          aria-label="Quantity"
                        />
                        <button
                          type="button"
                          aria-label="Increase quantity"
                          onClick={() =>
                            updateQuantity(item.productSlug, item.quantity + 50)
                          }
                          className="w-6 h-6 rounded-full hover:bg-surface-section flex items-center justify-center transition"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <button
                        type="button"
                        aria-label={`Remove ${item.productName}`}
                        onClick={() => removeItem(item.productSlug)}
                        className="text-ink-light hover:text-accent-red transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-black/5 bg-surface-light p-4 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-ink-muted">Total items</span>
                <strong className="text-ink">{count.toLocaleString()}</strong>
              </div>
              <Link
                href="/quote?from=cart"
                onClick={onClose}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-pill bg-gradient-to-br from-primary to-primary-light text-white text-sm font-bold uppercase tracking-wider shadow-primary hover:from-primary-light hover:to-primary transition"
              >
                <FileText className="w-4 h-4" />
                Submit Quote Request
              </Link>
              <button
                type="button"
                onClick={clear}
                className="w-full text-xs text-ink-light hover:text-accent-red transition py-1"
              >
                Clear all items
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  )
}

/**
 * Lookup a product's category from its slug. We import lazily here
 * to avoid bloating the cart bundle with the full product catalog.
 */
function findCategoryFromSlug(slug: string): string {
  // Keep a lightweight reference for cart navigation
  // Real implementation would use the search-index, but we want to avoid
  // pulling in the whole catalog here. The slug-to-category lookup is small.
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { products } = require('@/data/products') as typeof import('@/data/products')
  return (
    products.find((p) => p.slug === slug)?.categorySlug ?? 'products'
  )
}
