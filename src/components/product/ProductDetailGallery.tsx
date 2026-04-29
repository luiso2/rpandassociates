'use client'

import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import type { Product, ProductImage, ProductVariant } from '@/types/product'
import { VariantSelector } from './VariantSelector'
import { cn } from '@/lib/cn'

interface ProductDetailGalleryProps {
  product: Product
}

/**
 * Gallery + variant selector wrapper. Variants override the gallery
 * cover image when selected. If a product has no variants, this falls
 * back to its `images` array.
 */
export function ProductDetailGallery({ product }: ProductDetailGalleryProps) {
  const [activeVariantId, setActiveVariantId] = useState<string | null>(
    product.variants?.[0]?.id ?? null,
  )

  const activeVariant: ProductVariant | undefined = useMemo(
    () => product.variants?.find((v) => v.id === activeVariantId),
    [product.variants, activeVariantId],
  )

  const galleryImages: ProductImage[] = useMemo(() => {
    if (activeVariant) {
      return [activeVariant.image, ...(activeVariant.additionalImages ?? [])]
    }
    return product.images
  }, [activeVariant, product.images])

  const [activeIdx, setActiveIdx] = useState(0)

  // Reset gallery index when variant changes
  useEffect(() => {
    setActiveIdx(0)
  }, [activeVariantId])

  const active = galleryImages[activeIdx] ?? galleryImages[0]

  return (
    <div className="space-y-4">
      <div className="relative aspect-square rounded-xl overflow-hidden bg-surface-section shadow-soft-md">
        {active && (
          <Image
            src={active.src}
            alt={active.alt || product.name}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        )}
      </div>

      {galleryImages.length > 1 && (
        <div className="grid grid-cols-5 gap-2">
          {galleryImages.map((img, i) => (
            <button
              key={img.src + i}
              type="button"
              onClick={() => setActiveIdx(i)}
              aria-label={`View image ${i + 1}`}
              className={cn(
                'relative aspect-square rounded-md overflow-hidden border-2 transition-all',
                i === activeIdx
                  ? 'border-primary shadow-soft-sm'
                  : 'border-transparent opacity-60 hover:opacity-100',
              )}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {product.variants && product.variants.length > 0 && (
        <VariantSelector
          variants={product.variants}
          activeId={activeVariantId}
          onChange={(v) => setActiveVariantId(v.id)}
        />
      )}
    </div>
  )
}
