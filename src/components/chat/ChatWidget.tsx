'use client'

import { useEffect, useRef, useState } from 'react'
import { Bot, Send, X, Phone, Mail } from 'lucide-react'
import { company } from '@/data/company'
import { cn } from '@/lib/cn'
import { parseFormFill, typeIntoField, type FormFillData } from './chat-utils'

interface ChatMessage {
  id: number
  role: 'user' | 'assistant'
  text: string
}

const GREETING: ChatMessage = {
  id: 0,
  role: 'assistant',
  text: `Hi! I’m the ${company.name} assistant. I can answer questions about our products, walk you through our process, or collect details for a custom quote. How can I help today?`,
}

export function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([GREETING])
  const [input, setInput] = useState('')
  const [thinking, setThinking] = useState(false)
  const scrollerRef = useRef<HTMLDivElement>(null)
  const cancelTypeRef = useRef<(() => void) | null>(null)

  useEffect(() => {
    if (open) {
      window.setTimeout(() => {
        scrollerRef.current?.scrollTo({
          top: scrollerRef.current.scrollHeight,
          behavior: 'smooth',
        })
      }, 100)
    }
  }, [open, messages.length])

  // Cancel pending typing animation when widget closes
  useEffect(() => {
    if (!open && cancelTypeRef.current) {
      cancelTypeRef.current()
      cancelTypeRef.current = null
    }
  }, [open])

  const sendMessage = async (text: string) => {
    if (!text.trim() || thinking) return
    const userMsg: ChatMessage = {
      id: Date.now(),
      role: 'user',
      text: text.trim(),
    }
    setMessages((m) => [...m, userMsg])
    setInput('')
    setThinking(true)

    try {
      const history = [...messages, userMsg].map((m) => ({
        role: m.role,
        content: m.text,
      }))
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history }),
      })
      const data = (await res.json().catch(() => ({}))) as {
        reply?: string
        error?: string
      }

      if (!res.ok) {
        const fallback = `Sorry — I’m having trouble right now. You can reach us at ${company.phone} or ${company.email}.`
        setMessages((m) => [
          ...m,
          { id: Date.now() + 1, role: 'assistant', text: data.error ?? fallback },
        ])
        return
      }

      const reply = data.reply ?? 'Sorry, I could not process that.'
      const formFill = parseFormFill(reply)
      if (formFill) {
        applyFormFill(formFill.data)
        setMessages((m) => [
          ...m,
          { id: Date.now() + 1, role: 'assistant', text: formFill.cleanedReply },
        ])
      } else {
        setMessages((m) => [
          ...m,
          { id: Date.now() + 1, role: 'assistant', text: reply },
        ])
      }
    } catch {
      setMessages((m) => [
        ...m,
        {
          id: Date.now() + 1,
          role: 'assistant',
          text: `Sorry — I’m having trouble right now. You can reach us at ${company.phone} or ${company.email}.`,
        },
      ])
    } finally {
      setThinking(false)
    }
  }

  const applyFormFill = (data: FormFillData) => {
    cancelTypeRef.current?.()
    const fields: Array<[string, string | undefined]> = [
      ['firstName', data.firstName],
      ['lastName', data.lastName],
      ['company', data.company],
      ['email', data.email],
      ['phone', data.phone],
      ['productsOfInterest', data.products],
    ]
    let delay = 0
    for (const [name, value] of fields) {
      if (!value) continue
      const el =
        document.querySelector<HTMLInputElement | HTMLTextAreaElement>(
          `[name="${name}"]`,
        )
      if (!el) continue
      window.setTimeout(() => {
        cancelTypeRef.current = typeIntoField(el, value)
      }, delay)
      delay += 350
    }
    // Smooth-scroll quote form into view
    const form = document.querySelector('form')
    form?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessage(input)
  }

  return (
    <>
      <button
        type="button"
        aria-label="Open chat assistant"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          'fixed bottom-6 right-6 z-[50] w-14 h-14 rounded-full flex items-center justify-center text-white transition-all duration-300 ease-spring',
          'bg-gradient-to-br from-primary to-primary-light shadow-primary',
          'hover:scale-110',
          !open && 'animate-pulse-ring',
        )}
      >
        {open ? <X className="w-6 h-6" /> : <Bot className="w-6 h-6" />}
      </button>

      <div
        role="dialog"
        aria-label="AI Chat Assistant"
        className={cn(
          'fixed bottom-24 right-6 z-[49] w-[370px] max-w-[calc(100vw-3rem)] h-[520px] max-h-[calc(100vh-8rem)] rounded-xl flex flex-col overflow-hidden transition-all duration-300 ease-spring',
          'glass-strong border border-white/70 shadow-soft-lg',
          open
            ? 'translate-y-0 opacity-100 pointer-events-auto'
            : 'translate-y-4 opacity-0 pointer-events-none',
        )}
      >
        <div className="flex items-center gap-3 px-5 py-4 bg-gradient-to-br from-primary to-primary-light text-white">
          <div className="w-9 h-9 rounded-full bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20">
            <Bot className="w-4 h-4" />
          </div>
          <div className="flex-1">
            <div className="text-sm font-bold leading-tight">RP Assistant</div>
            <div className="text-[11px] opacity-80">Online · Powered by AI</div>
          </div>
          <button
            type="button"
            aria-label="Close chat"
            onClick={() => setOpen(false)}
            className="w-8 h-8 rounded-full hover:bg-white/15 flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div
          ref={scrollerRef}
          className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-white/40"
        >
          {messages.map((m) => (
            <div
              key={m.id}
              className={cn(
                'flex',
                m.role === 'user' ? 'justify-end' : 'justify-start',
              )}
            >
              <div
                className={cn(
                  'max-w-[85%] px-3.5 py-2.5 rounded-lg text-sm leading-snug',
                  m.role === 'user'
                    ? 'bg-primary text-white rounded-br-sm'
                    : 'bg-white text-ink-body rounded-bl-sm shadow-soft-sm border border-black/5',
                )}
              >
                {m.text}
              </div>
            </div>
          ))}
          {thinking && (
            <div className="flex justify-start">
              <div className="bg-white text-ink-muted rounded-lg rounded-bl-sm shadow-soft-sm px-3.5 py-2.5 border border-black/5">
                <span className="inline-flex gap-1 items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse [animation-delay:150ms]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse [animation-delay:300ms]" />
                </span>
              </div>
            </div>
          )}
        </div>

        <form
          onSubmit={handleSubmit}
          className="border-t border-black/5 bg-white p-3 flex gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message…"
            disabled={thinking}
            aria-label="Chat message"
            className="flex-1 px-4 py-2.5 rounded-pill bg-surface-section text-sm outline-none focus:ring-2 focus:ring-primary/30 transition"
          />
          <button
            type="submit"
            disabled={thinking || !input.trim()}
            aria-label="Send message"
            className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary-light text-white flex items-center justify-center disabled:opacity-50 hover:scale-105 transition"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

        <div className="px-4 py-2 bg-surface-section/50 border-t border-black/5 flex items-center justify-center gap-4 text-[11px] text-ink-muted">
          <a
            href={`tel:${company.phoneTel}`}
            className="hover:text-primary flex items-center gap-1 transition"
          >
            <Phone className="w-3 h-3" /> Call
          </a>
          <a
            href={`mailto:${company.email}`}
            className="hover:text-primary flex items-center gap-1 transition"
          >
            <Mail className="w-3 h-3" /> Email
          </a>
        </div>
      </div>
    </>
  )
}
