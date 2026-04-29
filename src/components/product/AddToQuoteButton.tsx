'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Plus, FileText, Check } from 'lucide-react'
import type { Product } from '@/types/product'
import { useQuoteCart } from '@/components/cart/QuoteCartProvider'
import { useCartDrawer } from '@/components/cart/CartDrawerContext'

interface AddToQuoteButtonProps {
  product: Product
}

export function AddToQuoteButton({ product }: AddToQuoteButtonProps) {
  const router = useRouter()
  const { addItem } = useQuoteCart()
  const { open: openDrawer } = useCartDrawer()
  const [justAdded, setJustAdded] = useState(false)

  const handleAddToCart = () => {
    addItem({
      productSlug: product.slug,
      productName: product.name,
      productImage: product.images[0]?.src ?? '',
      quantity: product.minOrderQuantity ?? 250,
    })
    setJustAdded(true)
    openDrawer()
    window.setTimeout(() => setJustAdded(false), 2000)
  }

  const handleQuickQuote = () => {
    const qty = product.minOrderQuantity ?? 250
    const params = new URLSearchParams({
      products: `${product.name} — quantity ~${qty.toLocaleString()}`,
    })
    router.push(`/quote?${params.toString()}`)
  }

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <button
        type="button"
        onClick={handleAddToCart}
        className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-pill bg-gradient-to-br from-primary to-primary-light text-white text-sm font-bold uppercase tracking-wider shadow-primary hover:from-primary-light hover:to-primary hover:-translate-y-1 transition-all"
      >
        {justAdded ? (
          <>
            <Check className="w-4 h-4" />
            Added
          </>
        ) : (
          <>
            <Plus className="w-4 h-4" />
            Add to Quote
          </>
        )}
      </button>
      <button
        type="button"
        onClick={handleQuickQuote}
        className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-pill bg-white border border-black/10 text-ink text-sm font-bold uppercase tracking-wider hover:border-primary/30 hover:text-primary transition-all"
      >
        <FileText className="w-4 h-4" />
        Quick Quote
      </button>
    </div>
  )
}
