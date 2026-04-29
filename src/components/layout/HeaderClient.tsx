'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Search, Phone, FileText, Menu } from 'lucide-react'
import { useStickyHeader } from '@/hooks/useStickyHeader'
import { Container } from '@/components/ui/Container'
import { MegaMenu } from './MegaMenu'
import { MobileDrawer } from './MobileDrawer'
import { SearchOverlay } from './SearchOverlay'
import { QuoteCartButton } from '@/components/cart/QuoteCartButton'
import { useCartDrawer } from '@/components/cart/CartDrawerContext'
import { company } from '@/data/company'
import { cn } from '@/lib/cn'

export function HeaderClient() {
  const scrolled = useStickyHeader(60)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const { open: openCartDrawer } = useCartDrawer()

  return (
    <>
      <header
        className={cn(
          'sticky top-0 z-[1000] transition-all duration-300 ease-spring',
          scrolled
            ? 'glass-strong shadow-soft-md border-b border-black/5'
            : 'glass border-b border-black/[0.04]',
        )}
      >
        <Container>
          <div
            className={cn(
              'flex items-center justify-between gap-4 transition-all',
              scrolled ? 'py-2' : 'py-2.5',
            )}
          >
            <Link href="/" className="shrink-0">
              <Image
                src="/images/RP_Logo_Small.jpg"
                alt="RP & Associates"
                width={180}
                height={60}
                priority
                className={cn(
                  'object-contain transition-all duration-300',
                  scrolled ? 'h-9' : 'h-12',
                )}
                style={{ width: 'auto' }}
              />
            </Link>

            <nav aria-label="Main navigation" className="hidden lg:block">
              <MegaMenu />
            </nav>

            <div className="flex items-center gap-2 md:gap-3.5">
              <button
                type="button"
                aria-label="Open search"
                onClick={() => setSearchOpen(true)}
                className="p-2 rounded-full text-ink-muted hover:text-primary hover:bg-primary/5 transition"
              >
                <Search className="w-4 h-4" />
              </button>
              <QuoteCartButton onClick={openCartDrawer} />
              <a
                href={`tel:${company.phoneTel}`}
                className="hidden lg:inline-flex items-center gap-1.5 text-[13px] font-semibold text-ink-body hover:text-primary transition"
              >
                <Phone className="w-3.5 h-3.5 text-primary" />
                {company.phone}
              </a>
              <Link
                href="/quote"
                className="hidden md:inline-flex items-center gap-1.5 px-5 py-2.5 rounded-pill text-[12px] font-bold uppercase tracking-wider text-white bg-gradient-to-br from-gold to-gold-dark shadow-gold border border-white/15 hover:from-gold-light hover:to-gold hover:translate-y-[-2px] transition-all"
              >
                <FileText className="w-3.5 h-3.5" />
                Request a Quote
              </Link>
              <button
                type="button"
                aria-label="Toggle menu"
                aria-expanded={drawerOpen}
                onClick={() => setDrawerOpen(true)}
                className="lg:hidden p-2 rounded-full hover:bg-surface-section transition"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </Container>
      </header>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  )
}
