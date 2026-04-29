import Link from 'next/link'
import { Menu, FileText, Layers, Building2 } from 'lucide-react'
import { categories } from '@/data/categories'
import { Container } from '@/components/ui/Container'

/**
 * Amazon-inspired horizontal "departments" strip below the main header.
 * On mobile it scrolls horizontally; on desktop it spreads evenly.
 */
export function DepartmentsBar() {
  return (
    <div className="hidden md:block bg-ink/95 text-white border-t border-white/5">
      <Container>
        <div className="flex items-center gap-6 overflow-x-auto py-2.5 text-[11px] font-semibold uppercase tracking-[1px] no-scrollbar">
          <Link
            href="/products"
            className="flex items-center gap-1.5 text-white/80 hover:text-gold-light transition whitespace-nowrap"
          >
            <Menu className="w-3.5 h-3.5" /> All Products
          </Link>
          <span className="w-px h-3 bg-white/10" />
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/products/${cat.slug}`}
              className="text-white/70 hover:text-gold-light transition whitespace-nowrap"
            >
              {cat.shortName}
            </Link>
          ))}
          <span className="w-px h-3 bg-white/10" />
          <Link
            href="/industries"
            className="flex items-center gap-1.5 text-white/80 hover:text-gold-light transition whitespace-nowrap"
          >
            <Building2 className="w-3.5 h-3.5" /> Shop by Industry
          </Link>
          <Link
            href="/catalogs"
            className="flex items-center gap-1.5 text-white/80 hover:text-gold-light transition whitespace-nowrap"
          >
            <FileText className="w-3.5 h-3.5" /> Catalogs
          </Link>
          <Link
            href="/products?filter=new"
            className="flex items-center gap-1.5 text-gold hover:text-gold-light transition whitespace-nowrap"
          >
            <Layers className="w-3.5 h-3.5" /> New Arrivals
          </Link>
        </div>
      </Container>
    </div>
  )
}
