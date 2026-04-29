'use client'

import Image from 'next/image'
import { Check } from 'lucide-react'
import type { Product } from '@/types/product'
import { cn } from '@/lib/cn'

interface ProductPickerProps {
  products: Product[]
  activeSlug: string
  onSelect: (product: Product) => void
}

export function ProductPicker({
  products,
  activeSlug,
  onSelect,
}: ProductPickerProps) {
  return (
    <div>
      <h3 className="font-heading text-sm font-bold uppercase tracking-[1.5px] text-ink mb-3">
        Try on a Product
      </h3>
      <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 gap-2">
        {products.map((p) => {
          const active = p.slug === activeSlug
          return (
            <button
              key={p.slug}
              type="button"
              onClick={() => onSelect(p)}
              aria-pressed={active}
              className={cn(
                'group relative aspect-square rounded-lg overflow-hidden border-2 transition-all',
                active
                  ? 'border-primary shadow-primary'
                  : 'border-transparent opacity-70 hover:opacity-100 hover:border-primary/30',
              )}
            >
              <Image
                src={p.images[0]?.src ?? ''}
                alt={p.name}
                fill
                sizes="120px"
                className="object-cover"
              />
              {active && (
                <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center shadow-soft-sm">
                  <Check className="w-3 h-3" />
                </div>
              )}
              <div className="absolute bottom-0 left-0 right-0 p-1.5 bg-gradient-to-t from-ink/85 via-ink/30 to-transparent">
                <p className="text-white text-[10px] font-semibold leading-tight line-clamp-2 text-left">
                  {p.shortName ?? p.name}
                </p>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
