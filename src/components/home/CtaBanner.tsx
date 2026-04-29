import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { cn } from '@/lib/cn'

interface CtaBannerProps {
  message: string
  ctaLabel: string
  ctaHref: string
  variant?: 'red' | 'dark'
}

export function CtaBanner({
  message,
  ctaLabel,
  ctaHref,
  variant = 'red',
}: CtaBannerProps) {
  const variantClasses = {
    red: 'bg-gradient-to-br from-accent-red via-accent-red-light to-accent-red-dark',
    dark: 'bg-gradient-to-br from-ink-body via-ink to-ink-body',
  }
  const ctaTextClass = variant === 'red' ? 'text-accent-red' : 'text-ink'
  return (
    <section
      className={cn(
        'relative py-10 overflow-hidden',
        variantClasses[variant],
      )}
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.08),transparent_60%)] pointer-events-none" />
      <Container>
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-center md:justify-between gap-5 text-center md:text-left">
          <p className="text-white text-lg md:text-xl font-bold drop-shadow-md tracking-tight max-w-3xl">
            {message}
          </p>
          <Link
            href={ctaHref}
            className={cn(
              'inline-flex items-center gap-2 px-7 py-3 rounded-pill bg-white font-bold text-[12px] uppercase tracking-[1px] shadow-soft-md hover:-translate-y-1 hover:shadow-soft-lg transition-all whitespace-nowrap shrink-0',
              ctaTextClass,
            )}
          >
            {ctaLabel} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </Container>
    </section>
  )
}
