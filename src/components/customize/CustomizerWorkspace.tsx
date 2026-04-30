'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Download, FileText, Sparkles } from 'lucide-react'
import { products as allProducts, featuredProducts, productBySlug } from '@/data/products'
import type { Product } from '@/types/product'
import { LogoUploader } from './LogoUploader'
import { LogoCanvas } from './LogoCanvas'
import {
  CustomizerControls,
  defaultSettings,
  type CustomizerSettings,
} from './CustomizerControls'
import { ProductPicker } from './ProductPicker'

const customizableProducts: Product[] = allProducts.filter((p) => p.customizable)
const fallbackProduct: Product =
  featuredProducts.find((p) => p.slug === 'classic-moscow-mule') ??
  featuredProducts[0] ??
  customizableProducts[0]

/** sessionStorage key used to hand the rendered canvas off to /quote. */
const CUSTOM_DESIGN_KEY = 'rp.customDesign'

export function CustomizerWorkspace() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const requestedSlug = searchParams.get('p')
  const initialProduct =
    (requestedSlug && productBySlug[requestedSlug]?.customizable
      ? productBySlug[requestedSlug]
      : null) ?? fallbackProduct
  const [logoUrl, setLogoUrl] = useState<string | null>(null)
  const [product, setProduct] = useState<Product>(initialProduct)
  const [settings, setSettings] = useState<CustomizerSettings>(defaultSettings)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  // Sync if `?p=` changes after first render (back/forward nav)
  useEffect(() => {
    if (
      requestedSlug &&
      productBySlug[requestedSlug]?.customizable &&
      product.slug !== requestedSlug
    ) {
      setProduct(productBySlug[requestedSlug])
    }
  }, [requestedSlug, product.slug])

  const handleCanvasReady = useCallback((canvas: HTMLCanvasElement) => {
    canvasRef.current = canvas
  }, [])

  const handleProductChange = useCallback((next: Product) => {
    setProduct(next)
    // Reset position-related settings when switching products
    setSettings((prev) => ({
      ...prev,
      offsetX: 0,
      offsetY: 0,
      rotation: 0,
      scale: 1,
    }))
  }, [])

  const handleDownload = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const url = canvas.toDataURL('image/png')
    const link = document.createElement('a')
    link.download = `rp-${product.slug}-customized.png`
    link.href = url
    link.click()
  }, [product.slug])

  const quoteSearch = useMemo(() => {
    const params = new URLSearchParams({
      products: `${product.name} — custom-branded with my logo (qty ~${(product.minOrderQuantity ?? 250).toLocaleString()})`,
      design: '1',
    })
    return params.toString()
  }, [product])

  /**
   * Capture the rendered canvas (product + logo composite) and stash it
   * in sessionStorage so /quote can read it on the next page. We can't
   * pass the data URL via the URL itself (URLs cap at ~2KB and a PNG
   * is much bigger), and a server round-trip would be wasteful.
   */
  const handleQuoteWithDesign = useCallback(() => {
    const canvas = canvasRef.current
    if (canvas && logoUrl) {
      try {
        const dataUrl = canvas.toDataURL('image/png')
        sessionStorage.setItem(
          CUSTOM_DESIGN_KEY,
          JSON.stringify({
            productSlug: product.slug,
            productName: product.name,
            dataUrl,
            savedAt: Date.now(),
          }),
        )
      } catch {
        // toDataURL throws on cross-origin tainted canvases; we proxy
        // upstream images via /api/img specifically to avoid this, but
        // if it ever fails we just fall back to a design-less quote.
      }
    }
    router.push(`/quote?${quoteSearch}`)
  }, [logoUrl, product.slug, product.name, quoteSearch, router])

  const ready = Boolean(logoUrl)

  return (
    <div className="grid lg:grid-cols-[1fr_360px] gap-6 items-start">
      {/* Preview pane */}
      <div className="space-y-4 order-1 lg:order-2 lg:hidden" />

      <div className="order-2 lg:order-1 space-y-4">
        <div className="relative">
          <LogoCanvas
            product={product}
            logoUrl={logoUrl}
            scale={settings.scale}
            offsetX={settings.offsetX}
            offsetY={settings.offsetY}
            rotation={settings.rotation}
            opacity={settings.opacity}
            onCanvasReady={handleCanvasReady}
          />
          <div className="absolute top-4 left-4 px-3 py-1 rounded-pill bg-ink/85 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-[1.5px] flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-gold" />
            Live Preview
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={handleDownload}
            disabled={!ready}
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-pill bg-ink text-white text-sm font-bold uppercase tracking-wider hover:bg-primary disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            <Download className="w-4 h-4" />
            Download Preview
          </button>
          <button
            type="button"
            onClick={handleQuoteWithDesign}
            disabled={!ready}
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-pill bg-gradient-to-br from-gold to-gold-dark text-white text-sm font-bold uppercase tracking-wider shadow-gold hover:from-gold-light hover:to-gold hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 transition-all"
          >
            <FileText className="w-4 h-4" />
            Quote with this Design
          </button>
        </div>

        <div className="text-center text-xs text-ink-light">
          <p>
            Currently previewing on:{' '}
            <strong className="text-ink-body">{product.name}</strong>
          </p>
        </div>
      </div>

      {/* Controls pane */}
      <div className="order-1 lg:order-2 space-y-5">
        <LogoUploader logoUrl={logoUrl} onLogoChange={setLogoUrl} />

        <CustomizerControls
          settings={settings}
          onChange={setSettings}
          disabled={!ready}
        />

        <div className="glass rounded-xl p-5 border border-white/70 shadow-soft-sm">
          <ProductPicker
            products={customizableProducts.slice(0, 12)}
            activeSlug={product.slug}
            onSelect={handleProductChange}
          />
        </div>
      </div>
    </div>
  )
}
