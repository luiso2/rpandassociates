'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Phone, FileText, Menu } from 'lucide-react'
import { useStickyHeader } from '@/hooks/useStickyHeader'
import { Container } from '@/components/ui/Container'
import { HeaderSearch } from './HeaderSearch'
import { MobileDrawer } from './MobileDrawer'
import { QuoteCartButton } from '@/components/cart/QuoteCartButton'
import { useCartDrawer } from '@/components/cart/CartDrawerContext'
import { company } from '@/data/company'
import { cn } from '@/lib/cn'

export function HeaderClient() {
  const scrolled = useStickyHeader(60)
  const [drawerOpen, setDrawerOpen] = useState(false)
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
              'flex items-center gap-3 md:gap-5 transition-all',
              scrolled ? 'py-2.5' : 'py-3',
            )}
          >
            <Link
              href="/"
              aria-label="RP & Associates — Home"
              className={cn(
                'shrink-0 flex items-center transition-all duration-300',
                scrolled ? 'h-10' : 'h-12',
              )}
            >
              <Image
                src="/images/RP_Logo_Small.jpg"
                alt="RP & Associates"
                width={220}
                height={73}
                priority
                quality={95}
                className="h-full w-auto object-contain select-none"
                sizes="220px"
              />
            </Link>

            <div className="flex-1 min-w-0 max-w-3xl">
              <HeaderSearch />
            </div>

            <div className="flex items-center gap-1 md:gap-2 shrink-0">
              <a
                href={`tel:${company.phoneTel}`}
                className="hidden xl:inline-flex items-center gap-1.5 px-3 py-2 rounded-md text-[12px] font-semibold text-ink-body hover:text-primary hover:bg-primary/5 transition whitespace-nowrap"
              >
                <Phone className="w-3.5 h-3.5 text-primary" />
                {company.phone}
              </a>
              <QuoteCartButton onClick={openCartDrawer} />
              <Link
                href="/quote"
                className="hidden md:inline-flex items-center gap-1.5 px-4 lg:px-5 py-2.5 rounded-pill text-[11px] lg:text-[12px] font-bold uppercase tracking-wider text-white bg-gradient-to-br from-gold to-gold-dark shadow-gold border border-white/15 hover:from-gold-light hover:to-gold hover:-translate-y-0.5 transition-all whitespace-nowrap"
              >
                <FileText className="w-3.5 h-3.5" />
                <span className="hidden lg:inline">Request a </span>Quote
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

      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  )
}
