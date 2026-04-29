'use client'

import { useEffect, useRef } from 'react'
import { cn } from '@/lib/cn'

type RevealVariant = 'up' | 'left' | 'right' | 'scale'

interface RevealProps {
  children: React.ReactNode
  variant?: RevealVariant
  /** ms — manual delay before this element animates in */
  delay?: number
  /** ms — applied as --stagger so children with [data-stagger] auto-cascade */
  stagger?: number
  /** When true, the element treats its direct children as a list and
   *  applies the data-stagger attribute so children animate in sequentially. */
  staggerChildren?: boolean
  className?: string
  as?: keyof React.JSX.IntrinsicElements
}

const variantClass: Record<RevealVariant, string> = {
  up: 'reveal',
  left: 'reveal-left',
  right: 'reveal-right',
  scale: 'reveal-scale',
}

/**
 * Reveal-on-scroll wrapper.
 *
 * Uses IntersectionObserver to add a `visible` class once the element
 * crosses the viewport threshold. Implementation is intentionally
 * imperative (DOM classList instead of React state) so the reveal
 * doesn't trigger a re-render of the wrapped subtree — every Reveal
 * on the home page would otherwise cost a render at scroll time.
 */
export function Reveal({
  children,
  variant = 'up',
  delay = 0,
  stagger = 60,
  staggerChildren = false,
  className,
  as: Tag = 'div',
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    // Respect users who set "reduce motion" — show immediately.
    if (
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    ) {
      node.classList.add('visible')
      return
    }
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          node.classList.add('visible')
          obs.disconnect()
        }
      },
      { threshold: 0.08, rootMargin: '0px 0px -60px 0px' },
    )
    obs.observe(node)
    return () => obs.disconnect()
  }, [])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Component = Tag as any
  return (
    <Component
      ref={ref}
      className={cn(variantClass[variant], className)}
      data-stagger={staggerChildren ? '' : undefined}
      style={{
        transitionDelay: delay ? `${delay}ms` : undefined,
        ['--stagger' as string]: staggerChildren ? `${stagger}ms` : undefined,
      }}
    >
      {children}
    </Component>
  )
}
