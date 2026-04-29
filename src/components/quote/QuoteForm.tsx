'use client'

import { useState } from 'react'
import Image from 'next/image'
import { CheckCircle2, AlertCircle, Send, ShoppingBag, X } from 'lucide-react'
import type { QuoteSource } from '@/types/quote'
import { useQuoteCart } from '@/components/cart/QuoteCartProvider'
import { cn } from '@/lib/cn'

interface QuoteFormProps {
  source?: QuoteSource
  defaultProducts?: string
  /** When true, attach the current quote cart items to the submission payload */
  includeCart?: boolean
}

type FormState = 'idle' | 'submitting' | 'success' | 'error'

export function QuoteForm({
  source = 'quote-page',
  defaultProducts = '',
  includeCart = false,
}: QuoteFormProps) {
  const [state, setState] = useState<FormState>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const cart = useQuoteCart()
  const cartItems = includeCart ? cart.items : []

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (state === 'submitting') return
    const fd = new FormData(e.currentTarget)
    if (fd.get('website')) return // honeypot tripped — silently drop

    const payload = {
      firstName: String(fd.get('firstName') ?? '').trim(),
      lastName: String(fd.get('lastName') ?? '').trim(),
      company: String(fd.get('company') ?? '').trim(),
      title: String(fd.get('title') ?? '').trim(),
      email: String(fd.get('email') ?? '').trim(),
      phone: String(fd.get('phone') ?? '').trim(),
      productsOfInterest: String(fd.get('productsOfInterest') ?? '').trim(),
      ...(cartItems.length > 0 ? { cartItems } : {}),
      source,
    }
    setState('submitting')
    setErrorMsg('')
    try {
      const res = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error ?? 'Submission failed')
      }
      setState('success')
      ;(e.target as HTMLFormElement).reset()
      if (includeCart && cartItems.length > 0) cart.clear()
    } catch (err) {
      setState('error')
      setErrorMsg(err instanceof Error ? err.message : 'Submission failed')
    }
  }

  if (state === 'success') {
    return (
      <div className="glass rounded-xl p-12 text-center shadow-soft-md border border-white/70">
        <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-green-50 flex items-center justify-center">
          <CheckCircle2 className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="font-heading text-xl font-bold text-ink mb-2">
          Thanks — we got it.
        </h3>
        <p className="text-ink-muted text-sm leading-relaxed max-w-md mx-auto mb-6">
          A specialist will follow up within one business day with options, MOQs,
          and timelines for your project. Check your inbox for a confirmation.
        </p>
        <button
          type="button"
          onClick={() => setState('idle')}
          className="text-primary text-sm font-semibold hover:underline"
        >
          Submit another request
        </button>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="glass rounded-xl p-7 md:p-9 shadow-soft-md border border-white/70 space-y-5"
    >
      {includeCart && cartItems.length > 0 && (
        <div className="rounded-lg bg-primary/5 border border-primary/20 p-4 mb-2">
          <div className="flex items-center gap-2 mb-3">
            <ShoppingBag className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-bold text-ink">
              Including {cartItems.length} item
              {cartItems.length === 1 ? '' : 's'} from your quote cart
            </h3>
          </div>
          <ul className="space-y-2">
            {cartItems.map((it) => (
              <li
                key={it.productSlug}
                className="flex items-center gap-3 text-xs"
              >
                {it.productImage && (
                  <div className="relative w-10 h-10 rounded-md overflow-hidden bg-white shrink-0">
                    <Image
                      src={it.productImage}
                      alt={it.productName}
                      fill
                      sizes="40px"
                      className="object-cover"
                    />
                  </div>
                )}
                <span className="flex-1 truncate text-ink-body font-medium">
                  {it.productName}
                </span>
                <span className="text-ink-muted shrink-0">
                  Qty {it.quantity.toLocaleString()}
                </span>
                <button
                  type="button"
                  aria-label={`Remove ${it.productName}`}
                  onClick={() => cart.removeItem(it.productSlug)}
                  className="text-ink-light hover:text-accent-red transition shrink-0"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Honeypot — bots fill this, humans don't see it */}
      <div aria-hidden className="absolute -left-[9999px] opacity-0">
        <label>
          Website (leave blank)
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="First name" name="firstName" required />
        <Field label="Last name" name="lastName" required />
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Company" name="company" required />
        <Field label="Title" name="title" />
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Email" name="email" type="email" required />
        <Field label="Phone" name="phone" type="tel" required />
      </div>

      <div>
        <label
          htmlFor="productsOfInterest"
          className="block text-[11px] font-bold uppercase tracking-[1.5px] text-ink-light mb-2"
        >
          Products of interest
        </label>
        <textarea
          id="productsOfInterest"
          name="productsOfInterest"
          rows={4}
          defaultValue={defaultProducts}
          placeholder="Tell us about your project — products, quantities, timeline, customization needs..."
          className="w-full px-4 py-3 rounded-md bg-white/85 border border-black/10 text-sm text-ink-body outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition resize-y"
        />
      </div>

      {state === 'error' && (
        <div className="flex items-start gap-3 p-4 rounded-md bg-red-50 border border-red-200 text-red-700 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <strong className="block">Something went wrong</strong>
            <span className="text-red-600">{errorMsg}</span>
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={state === 'submitting'}
        className={cn(
          'w-full inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-pill text-sm font-bold uppercase tracking-wider transition-all',
          'bg-gradient-to-br from-primary to-primary-light text-white shadow-primary',
          state === 'submitting'
            ? 'opacity-70 cursor-wait'
            : 'hover:from-primary-light hover:to-primary hover:-translate-y-1',
        )}
      >
        {state === 'submitting' ? (
          <>Sending…</>
        ) : (
          <>
            Submit Request <Send className="w-4 h-4" />
          </>
        )}
      </button>
    </form>
  )
}

interface FieldProps {
  label: string
  name: string
  type?: string
  required?: boolean
}

function Field({ label, name, type = 'text', required }: FieldProps) {
  return (
    <div>
      <label
        htmlFor={name}
        className="block text-[11px] font-bold uppercase tracking-[1.5px] text-ink-light mb-2"
      >
        {label} {required && <span className="text-accent-red">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        autoComplete={autocompleteFor(name)}
        className="w-full px-4 py-3 rounded-md bg-white/85 border border-black/10 text-sm text-ink-body outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition"
      />
    </div>
  )
}

function autocompleteFor(name: string): string {
  switch (name) {
    case 'firstName':
      return 'given-name'
    case 'lastName':
      return 'family-name'
    case 'email':
      return 'email'
    case 'phone':
      return 'tel'
    case 'company':
      return 'organization'
    case 'title':
      return 'organization-title'
    default:
      return 'off'
  }
}
