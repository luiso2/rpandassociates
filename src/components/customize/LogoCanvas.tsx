'use client'

import { useEffect, useRef, useState } from 'react'
import type { Product, LogoZone } from '@/types/product'

interface LogoCanvasProps {
  product: Product
  logoUrl: string | null
  scale: number // 0–1.5 multiplier on default zone size
  offsetX: number // -0.5 to 0.5 normalized offset
  offsetY: number // -0.5 to 0.5 normalized offset
  rotation: number // degrees
  opacity: number // 0–1
  onCanvasReady?: (canvas: HTMLCanvasElement) => void
}

/**
 * Real-time logo visualizer with 3D-feel perspective transforms.
 *
 * For curved/cylindrical products, the logo is split into vertical strips and
 * each strip is drawn with a small arc transformation, producing the illusion
 * of the logo wrapping around the product surface.
 *
 * For flat products, a simple perspective tilt is applied for depth.
 */
export function LogoCanvas({
  product,
  logoUrl,
  scale,
  offsetX,
  offsetY,
  rotation,
  opacity,
  onCanvasReady,
}: LogoCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const productImgRef = useRef<HTMLImageElement | null>(null)
  const logoImgRef = useRef<HTMLImageElement | null>(null)
  const [productLoaded, setProductLoaded] = useState(false)
  const [logoLoaded, setLogoLoaded] = useState(false)

  const productSrc = product.images[0]?.src ?? ''
  const zone: LogoZone = product.logoZone ?? {
    centerX: 0.5,
    centerY: 0.55,
    maxWidth: 0.35,
    maxHeight: 0.18,
    surface: 'flat',
  }

  // Load product image
  useEffect(() => {
    if (!productSrc) return
    setProductLoaded(false)
    const img = new window.Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      productImgRef.current = img
      setProductLoaded(true)
    }
    img.onerror = () => {
      productImgRef.current = null
      setProductLoaded(false)
    }
    img.src = productSrc
  }, [productSrc])

  // Load logo image
  useEffect(() => {
    if (!logoUrl) {
      logoImgRef.current = null
      setLogoLoaded(false)
      return
    }
    setLogoLoaded(false)
    const img = new window.Image()
    img.onload = () => {
      logoImgRef.current = img
      setLogoLoaded(true)
    }
    img.onerror = () => {
      logoImgRef.current = null
      setLogoLoaded(false)
    }
    img.src = logoUrl
  }, [logoUrl])

  // Render
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !productImgRef.current || !productLoaded) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const productImg = productImgRef.current
    const targetW = 800
    const targetH = Math.round((productImg.naturalHeight / productImg.naturalWidth) * targetW)
    canvas.width = targetW
    canvas.height = targetH

    // Background
    ctx.clearRect(0, 0, targetW, targetH)
    ctx.drawImage(productImg, 0, 0, targetW, targetH)

    // Draw logo
    const logo = logoImgRef.current
    if (logo && logoLoaded && opacity > 0) {
      const baseW = zone.maxWidth * targetW * scale
      const baseH = zone.maxHeight * targetH * scale
      const logoAspect = logo.naturalWidth / logo.naturalHeight

      let drawW = baseW
      let drawH = baseW / logoAspect
      if (drawH > baseH) {
        drawH = baseH
        drawW = baseH * logoAspect
      }

      const cx = (zone.centerX + offsetX) * targetW
      const cy = (zone.centerY + offsetY) * targetH

      ctx.save()
      ctx.globalAlpha = opacity
      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = 'high'

      const surface = zone.surface ?? 'flat'

      if (surface === 'cylinder' && drawW > 8) {
        // Cylindrical wrap: split logo into vertical strips, each drawn with
        // an x-offset that simulates curvature
        const strips = 32
        const stripW = drawW / strips
        const curve = zone.curve ?? 0.18

        ctx.translate(cx, cy)
        ctx.rotate((rotation * Math.PI) / 180)
        if (zone.tilt) ctx.transform(1, 0, Math.tan((zone.tilt * Math.PI) / 180), 1, 0, 0)

        for (let i = 0; i < strips; i++) {
          const t = i / (strips - 1)
          const stripX = -drawW / 2 + i * stripW
          // Cosine bend: edges shrink horizontally
          const angle = (t - 0.5) * Math.PI
          const sx = Math.cos(angle * curve * 4)
          const stripScaleX = sx > 0.1 ? sx : 0.1
          const sourceX = (logo.naturalWidth / strips) * i

          ctx.save()
          ctx.translate(stripX + stripW / 2, 0)
          ctx.scale(stripScaleX, 1)
          ctx.drawImage(
            logo,
            sourceX,
            0,
            logo.naturalWidth / strips,
            logo.naturalHeight,
            -stripW / 2,
            -drawH / 2,
            stripW,
            drawH,
          )
          ctx.restore()
        }

        // Subtle highlight for 3D feel
        const grad = ctx.createLinearGradient(-drawW / 2, 0, drawW / 2, 0)
        grad.addColorStop(0, 'rgba(0,0,0,0.18)')
        grad.addColorStop(0.5, 'rgba(255,255,255,0.0)')
        grad.addColorStop(1, 'rgba(0,0,0,0.18)')
        ctx.globalCompositeOperation = 'multiply'
        ctx.fillStyle = grad
        ctx.fillRect(-drawW / 2, -drawH / 2, drawW, drawH)
      } else if (surface === 'sphere' && drawW > 8) {
        // Spherical bend: 2D approximation with both axes curved
        ctx.translate(cx, cy)
        ctx.rotate((rotation * Math.PI) / 180)
        const grid = 16
        const stripW = drawW / grid
        const stripH = drawH / grid
        for (let row = 0; row < grid; row++) {
          for (let col = 0; col < grid; col++) {
            const u = col / (grid - 1) - 0.5
            const v = row / (grid - 1) - 0.5
            const r = Math.sqrt(u * u + v * v)
            if (r > 0.5) continue
            const z = Math.sqrt(0.25 - r * r) * 2
            const sx = -drawW / 2 + col * stripW
            const sy = -drawH / 2 + row * stripH
            const srcX = (logo.naturalWidth / grid) * col
            const srcY = (logo.naturalHeight / grid) * row
            ctx.save()
            ctx.translate(sx + stripW / 2, sy + stripH / 2)
            ctx.scale(z * 0.7 + 0.3, z * 0.7 + 0.3)
            ctx.drawImage(
              logo,
              srcX,
              srcY,
              logo.naturalWidth / grid,
              logo.naturalHeight / grid,
              -stripW / 2,
              -stripH / 2,
              stripW,
              stripH,
            )
            ctx.restore()
          }
        }
      } else {
        // Flat with optional perspective tilt
        ctx.translate(cx, cy)
        ctx.rotate((rotation * Math.PI) / 180)
        if (zone.tilt) {
          ctx.transform(1, 0, Math.tan((zone.tilt * Math.PI) / 180), 1, 0, 0)
        }
        ctx.drawImage(logo, -drawW / 2, -drawH / 2, drawW, drawH)
      }

      ctx.restore()
    }

    onCanvasReady?.(canvas)
  }, [
    productLoaded,
    logoLoaded,
    productSrc,
    logoUrl,
    scale,
    offsetX,
    offsetY,
    rotation,
    opacity,
    zone.centerX,
    zone.centerY,
    zone.maxWidth,
    zone.maxHeight,
    zone.surface,
    zone.tilt,
    zone.curve,
    onCanvasReady,
  ])

  return (
    <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-gradient-to-br from-surface-section via-white to-surface-section shadow-soft-md">
      {!productLoaded && (
        <div className="absolute inset-0 flex items-center justify-center text-ink-light text-sm">
          Loading product…
        </div>
      )}
      <canvas
        ref={canvasRef}
        className="w-full h-full object-contain"
        aria-label={`Preview of your logo on ${product.name}`}
      />
      {!logoUrl && productLoaded && (
        <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-ink/85 via-ink/40 to-transparent text-white text-center">
          <p className="text-sm font-semibold">
            Upload a logo to see it on this product →
          </p>
        </div>
      )}
    </div>
  )
}
