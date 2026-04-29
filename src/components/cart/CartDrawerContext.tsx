'use client'

import { createContext, useCallback, useContext, useState } from 'react'
import { QuoteCartDrawer } from './QuoteCartDrawer'

interface CartDrawerContextValue {
  open: () => void
  close: () => void
  isOpen: boolean
}

const CartDrawerContext = createContext<CartDrawerContextValue | null>(null)

export function CartDrawerProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const open = useCallback(() => setIsOpen(true), [])
  const close = useCallback(() => setIsOpen(false), [])

  return (
    <CartDrawerContext.Provider value={{ open, close, isOpen }}>
      {children}
      <QuoteCartDrawer open={isOpen} onClose={close} />
    </CartDrawerContext.Provider>
  )
}

export function useCartDrawer() {
  const ctx = useContext(CartDrawerContext)
  if (!ctx)
    throw new Error('useCartDrawer must be used inside <CartDrawerProvider>')
  return ctx
}
