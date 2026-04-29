import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { cn } from '@/lib/cn'

export interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
  className?: string
}

/**
 * Visual breadcrumbs trail. JSON-LD structured data is added separately
 * via Next.js metadata in Phase 7 (avoids dangerouslySetInnerHTML).
 */
export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={cn('bg-surface-section/40 border-b border-black/5', className)}
    >
      <Container>
        <ol className="flex items-center gap-1.5 text-xs py-3 overflow-x-auto no-scrollbar">
          <li className="flex items-center gap-1.5 shrink-0">
            <Link
              href="/"
              className="text-ink-light hover:text-primary transition flex items-center gap-1"
              aria-label="Home"
            >
              <Home className="w-3.5 h-3.5" />
            </Link>
            <ChevronRight className="w-3 h-3 text-ink-light/60" />
          </li>
          {items.map((it, i) => {
            const isLast = i === items.length - 1
            return (
              <li
                key={`${it.label}-${i}`}
                className="flex items-center gap-1.5 shrink-0"
              >
                {it.href && !isLast ? (
                  <Link
                    href={it.href}
                    className="text-ink-light hover:text-primary transition"
                  >
                    {it.label}
                  </Link>
                ) : (
                  <span
                    className={cn(
                      'font-semibold',
                      isLast ? 'text-ink' : 'text-ink-light',
                    )}
                    aria-current={isLast ? 'page' : undefined}
                  >
                    {it.label}
                  </span>
                )}
                {!isLast && <ChevronRight className="w-3 h-3 text-ink-light/60" />}
              </li>
            )
          })}
        </ol>
      </Container>
    </nav>
  )
}
