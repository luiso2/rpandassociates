'use client'

import { ShoppingBag } from 'lucide-react'
import { useQuoteCart } from './QuoteCartProvider'
import { cn } from '@/lib/cn'

interface QuoteCartButtonProps {
  onClick: () => void
}

export function QuoteCartButton({ onClick }: QuoteCartButtonProps) {
  const { count, hydrated } = useQuoteCart()
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Quote cart (${count} items)`}
      className="relative p-2 rounded-full text-ink-muted hover:text-primary hover:bg-primary/5 transition"
    >
      <ShoppingBag className="w-4 h-4" />
      {hydrated && count > 0 && (
        <span
          className={cn(
            'absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full bg-gold text-ink text-[10px] font-bold flex items-center justify-center px-1 shadow-soft-sm',
          )}
          suppressHydrationWarning
        >
          {count > 99 ? '99+' : count}
        </span>
      )}
    </button>
  )
}
