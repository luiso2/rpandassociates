'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import type { QuoteCartItem } from '@/types/quote'

const STORAGE_KEY = 'rp-quote-cart-v1'

interface QuoteCartContextValue {
  items: QuoteCartItem[]
  count: number
  hydrated: boolean
  addItem: (item: Omit<QuoteCartItem, 'addedAt'>) => void
  removeItem: (slug: string) => void
  updateQuantity: (slug: string, quantity: number) => void
  clear: () => void
}

const QuoteCartContext = createContext<QuoteCartContextValue | null>(null)

export function QuoteCartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<QuoteCartItem[]>([])
  const [hydrated, setHydrated] = useState(false)

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw)
        if (Array.isArray(parsed)) setItems(parsed.filter(isValidItem))
      }
    } catch {
      // Ignore corrupt storage
    }
    setHydrated(true)
  }, [])

  // Persist on changes (after hydration to avoid stomping initial value)
  useEffect(() => {
    if (!hydrated) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch {
      // Quota exceeded — ignore silently
    }
  }, [items, hydrated])

  // Cross-tab sync via storage event
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== STORAGE_KEY) return
      try {
        const next = e.newValue ? JSON.parse(e.newValue) : []
        if (Array.isArray(next)) setItems(next.filter(isValidItem))
      } catch {
        // Ignore parse failures
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const addItem = useCallback((item: Omit<QuoteCartItem, 'addedAt'>) => {
    setItems((prev) => {
      const existing = prev.find((p) => p.productSlug === item.productSlug)
      if (existing) {
        return prev.map((p) =>
          p.productSlug === item.productSlug
            ? { ...p, quantity: p.quantity + item.quantity }
            : p,
        )
      }
      return [...prev, { ...item, addedAt: Date.now() }]
    })
  }, [])

  const removeItem = useCallback((slug: string) => {
    setItems((prev) => prev.filter((p) => p.productSlug !== slug))
  }, [])

  const updateQuantity = useCallback((slug: string, quantity: number) => {
    if (quantity < 1) return
    setItems((prev) =>
      prev.map((p) => (p.productSlug === slug ? { ...p, quantity } : p)),
    )
  }, [])

  const clear = useCallback(() => setItems([]), [])

  const value = useMemo<QuoteCartContextValue>(
    () => ({
      items,
      count: items.reduce((sum, i) => sum + i.quantity, 0),
      hydrated,
      addItem,
      removeItem,
      updateQuantity,
      clear,
    }),
    [items, hydrated, addItem, removeItem, updateQuantity, clear],
  )

  return (
    <QuoteCartContext.Provider value={value}>
      {children}
    </QuoteCartContext.Provider>
  )
}

export function useQuoteCart() {
  const ctx = useContext(QuoteCartContext)
  if (!ctx)
    throw new Error('useQuoteCart must be used inside <QuoteCartProvider>')
  return ctx
}

function isValidItem(value: unknown): value is QuoteCartItem {
  if (typeof value !== 'object' || value === null) return false
  const v = value as Record<string, unknown>
  return (
    typeof v.productSlug === 'string' &&
    typeof v.productName === 'string' &&
    typeof v.productImage === 'string' &&
    typeof v.quantity === 'number' &&
    typeof v.addedAt === 'number'
  )
}
