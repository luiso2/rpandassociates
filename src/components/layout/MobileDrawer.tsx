'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ChevronDown, X } from 'lucide-react'
import { categories } from '@/data/categories'
import { subcategoriesByCategory } from '@/data/subcategories'
import { company } from '@/data/company'
import { cn } from '@/lib/cn'

interface MobileDrawerProps {
  open: boolean
  onClose: () => void
}

export function MobileDrawer({ open, onClose }: MobileDrawerProps) {
  const [openCat, setOpenCat] = useState<string | null>(null)

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
      setOpenCat(null)
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <>
      <div
        aria-hidden
        onClick={onClose}
        className={cn(
          'lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-[998] transition-opacity duration-300',
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
        )}
      />
      <nav
        aria-label="Mobile navigation"
        className={cn(
          'lg:hidden fixed top-0 right-0 w-[320px] max-w-[85vw] h-full bg-white z-[999] overflow-y-auto pt-20 pb-8 shadow-soft-lg transition-transform duration-400 ease-spring',
          open ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        <button
          type="button"
          aria-label="Close menu"
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-full hover:bg-surface-section flex items-center justify-center transition"
        >
          <X className="w-5 h-5" />
        </button>

        <ul>
          <li>
            <Link
              href="/"
              onClick={onClose}
              className="block px-6 py-3.5 text-sm font-semibold border-b border-surface-light hover:bg-surface-section hover:text-primary transition"
            >
              Home
            </Link>
          </li>
          {categories.map((cat) => {
            const isOpen = openCat === cat.slug
            const subs = subcategoriesByCategory[cat.slug] ?? []
            return (
              <li key={cat.slug}>
                <button
                  type="button"
                  onClick={() => setOpenCat(isOpen ? null : cat.slug)}
                  className="w-full flex items-center justify-between px-6 py-3.5 text-sm font-semibold border-b border-surface-light hover:bg-surface-section hover:text-primary transition"
                >
                  <span>{cat.name}</span>
                  <ChevronDown
                    className={cn(
                      'w-3.5 h-3.5 text-ink-light transition-transform duration-300',
                      isOpen && 'rotate-180',
                    )}
                  />
                </button>
                {isOpen && (
                  <ul className="bg-surface-section">
                    <li>
                      <Link
                        href={`/products/${cat.slug}`}
                        onClick={onClose}
                        className="block pl-10 pr-6 py-2.5 text-xs font-bold text-primary border-b border-white/50 hover:bg-white"
                      >
                        View All {cat.shortName} →
                      </Link>
                    </li>
                    {subs.map((s) => (
                      <li key={s.slug}>
                        <Link
                          href={`/products/${cat.slug}?sub=${s.slug}`}
                          onClick={onClose}
                          className="block pl-10 pr-6 py-2.5 text-xs text-ink-muted border-b border-white/50 hover:text-primary hover:bg-white transition"
                        >
                          {s.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            )
          })}
          <li>
            <Link
              href="/customize"
              onClick={onClose}
              className="flex items-center gap-2 px-6 py-3.5 text-sm font-bold text-gold-dark border-b border-surface-light hover:bg-gold/5 transition"
            >
              ✦ Try Your Logo Live
            </Link>
          </li>
          <li>
            <Link
              href="/industries"
              onClick={onClose}
              className="block px-6 py-3.5 text-sm font-semibold border-b border-surface-light hover:bg-surface-section hover:text-primary transition"
            >
              Shop by Industry
            </Link>
          </li>
          <li>
            <Link
              href="/catalogs"
              onClick={onClose}
              className="block px-6 py-3.5 text-sm font-semibold border-b border-surface-light hover:bg-surface-section hover:text-primary transition"
            >
              Catalogs
            </Link>
          </li>
          <li>
            <Link
              href="/about"
              onClick={onClose}
              className="block px-6 py-3.5 text-sm font-semibold border-b border-surface-light hover:bg-surface-section hover:text-primary transition"
            >
              About
            </Link>
          </li>
          <li>
            <a
              href={`tel:${company.phoneTel}`}
              className="block px-6 py-3.5 text-sm font-semibold border-b border-surface-light hover:bg-surface-section hover:text-primary transition"
            >
              {company.phone}
            </a>
          </li>
        </ul>

        <div className="px-5 mt-4">
          <Link
            href="/quote"
            onClick={onClose}
            className="block w-full text-center bg-gradient-to-br from-gold to-gold-dark text-white font-bold uppercase tracking-wider rounded-pill py-3.5 text-sm shadow-gold"
          >
            Request a Quote
          </Link>
        </div>
      </nav>
    </>
  )
}
