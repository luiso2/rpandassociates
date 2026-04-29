'use client'

import { useState } from 'react'
import { Send, Check } from 'lucide-react'
import { cn } from '@/lib/cn'

export function NewsletterForm() {
  const [state, setState] = useState<'idle' | 'submitting' | 'success'>('idle')
  const [email, setEmail] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (state === 'submitting' || !email.trim()) return
    const fd = new FormData(e.currentTarget)
    if (fd.get('website')) return // honeypot
    setState('submitting')
    try {
      await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      })
    } catch {
      // ignore
    }
    setState('success')
    setEmail('')
    window.setTimeout(() => setState('idle'), 4000)
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      {/* Honeypot */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="absolute -left-[9999px] opacity-0 pointer-events-none"
        aria-hidden
      />
      <input
        type="email"
        name="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        aria-label="Newsletter email"
        placeholder="Your email"
        className="flex-1 px-4 py-2.5 rounded-pill bg-white/8 text-white placeholder:text-white/40 text-sm border border-white/10 outline-none focus:border-gold/40 transition"
      />
      <button
        type="submit"
        aria-label="Subscribe"
        disabled={state === 'submitting'}
        className={cn(
          'w-11 h-11 rounded-full flex items-center justify-center transition',
          state === 'success'
            ? 'bg-green-600 text-white'
            : 'bg-gradient-to-br from-gold to-gold-dark text-white hover:from-gold-light hover:to-gold disabled:opacity-50',
        )}
      >
        {state === 'success' ? (
          <Check className="w-4 h-4" />
        ) : (
          <Send className="w-4 h-4" />
        )}
      </button>
    </form>
  )
}
