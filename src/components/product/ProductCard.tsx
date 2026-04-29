import Link from 'next/link'
import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'
import type { Product } from '@/types/product'
import { categoryBySlug } from '@/data/categories'
import { Badge } from '@/components/ui/Badge'
import { cn } from '@/lib/cn'

interface ProductCardProps {
  product: Product
  className?: string
  showCategory?: boolean
}

export function ProductCard({
  product,
  className,
  showCategory = true,
}: ProductCardProps) {
  const category = categoryBySlug[product.categorySlug]
  const primary = product.images[0]
  const isBestSeller = product.tags.includes('best-seller')
  const isNew = product.tags.includes('new')

  return (
    <Link
      href={`/products/${product.categorySlug}/${product.slug}`}
      className={cn(
        'group relative flex flex-col rounded-lg overflow-hidden bg-white border border-black/5 shadow-soft-sm hover:shadow-soft-md hover:-translate-y-1 transition-all duration-300 ease-spring',
        className,
      )}
    >
      <div className="relative aspect-[4/3] bg-surface-section overflow-hidden">
        {primary && (
          <Image
            src={primary.src}
            alt={primary.alt}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500 ease-spring"
          />
        )}
        {(isBestSeller || isNew) && (
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {isBestSeller && <Badge variant="gold">Best Seller</Badge>}
            {isNew && <Badge variant="primary">New</Badge>}
          </div>
        )}
        {showCategory && category && (
          <div className="absolute top-3 right-3">
            <Badge variant="dark">{category.shortName}</Badge>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-end p-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-pill bg-white text-primary text-xs font-bold uppercase tracking-wider">
            View <ArrowUpRight className="w-3 h-3" />
          </span>
        </div>
      </div>
      <div className="p-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-heading font-bold text-base text-ink leading-snug group-hover:text-primary transition-colors line-clamp-2">
            {product.name}
          </h3>
          {product.minOrderQuantity && (
            <p className="text-xs text-ink-muted mt-1">
              MOQ {product.minOrderQuantity.toLocaleString()}
              {product.customizable && ' · Customizable'}
            </p>
          )}
        </div>
        <ArrowUpRight className="w-4 h-4 text-ink-light shrink-0 mt-0.5 group-hover:text-primary group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all" />
      </div>
    </Link>
  )
}
