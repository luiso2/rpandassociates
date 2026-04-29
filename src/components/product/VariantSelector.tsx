'use client'

import { useEffect } from 'react'
import { Check } from 'lucide-react'
import type { ProductVariant } from '@/types/product'
import { cn } from '@/lib/cn'

interface VariantSelectorProps {
  variants: ProductVariant[]
  activeId: string | null
  onChange: (variant: ProductVariant) => void
}

export function VariantSelector({
  variants,
  activeId,
  onChange,
}: VariantSelectorProps) {
  // Auto-select first variant on mount
  useEffect(() => {
    if (!activeId && variants.length > 0) onChange(variants[0])
  }, [activeId, variants, onChange])

  if (variants.length === 0) return null
  return (
    <div>
      <div className="text-[10px] font-bold uppercase tracking-[1.5px] text-ink-light mb-2">
        Finish ·{' '}
        <span className="text-ink-body">
          {variants.find((v) => v.id === activeId)?.label ?? variants[0].label}
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {variants.map((v) => {
          const active = v.id === activeId
          return (
            <button
              key={v.id}
              type="button"
              onClick={() => onChange(v)}
              aria-pressed={active}
              aria-label={`Select ${v.label}`}
              title={v.label}
              className={cn(
                'relative w-10 h-10 rounded-full border-2 transition-all flex items-center justify-center shrink-0',
                active
                  ? 'border-primary scale-110 shadow-soft-sm'
                  : 'border-black/10 hover:border-primary/40 hover:scale-105',
              )}
            >
              <span
                aria-hidden
                className="block w-7 h-7 rounded-full"
                style={{
                  background: v.swatchColor ?? 'linear-gradient(135deg, #d1d5db, #9ca3af)',
                  boxShadow: 'inset 0 -2px 3px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.4)',
                }}
              />
              {active && (
                <Check
                  className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-white rounded-full p-0.5 shadow-soft-sm"
                />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
