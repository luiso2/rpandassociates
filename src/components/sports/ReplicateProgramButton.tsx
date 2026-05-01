'use client'

import { useCallback } from 'react'
import { useRouter } from 'next/navigation'
import type { Product } from '@/types/product'
import { useQuoteCart } from '@/components/cart/QuoteCartProvider'

interface ReplicateProgramButtonProps {
  /** Products that define this program — typically the league's curated set. */
  products: Product[]
  /** Default per-line quantity when seeding the cart. Stadium concession
   *  programs typically order in the thousands; default 500 is a sane
   *  starting point users can edit on the quote screen. */
  defaultQuantity?: number
  /** League / industry label used in the quote source line. */
  programLabel: string
  className?: string
  children: React.ReactNode
}

/**
 * Replaces the user's quote cart with this program's products and sends
 * them to /quote with `from=cart` so the QuoteForm includes them as
 * pre-selected line items. Designed for "replicate this program" CTAs
 * on industry / league pages.
 */
export function ReplicateProgramButton({
  products,
  defaultQuantity = 500,
  programLabel,
  className,
  children,
}: ReplicateProgramButtonProps) {
  const router = useRouter()
  const cart = useQuoteCart()

  const handleClick = useCallback(() => {
    // Replace whatever's in the cart with this program's lineup so the
    // user sees a clean selection, not a mix of old + new items.
    cart.clear()
    for (const p of products) {
      cart.addItem({
        productSlug: p.slug,
        productName: p.name,
        productImage: p.images[0]?.src ?? '',
        quantity: p.minOrderQuantity ?? defaultQuantity,
      })
    }
    const params = new URLSearchParams({
      from: 'cart',
      program: programLabel,
    })
    router.push(`/quote?${params.toString()}`)
  }, [cart, products, programLabel, defaultQuantity, router])

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={products.length === 0}
      className={className}
    >
      {children}
    </button>
  )
}
