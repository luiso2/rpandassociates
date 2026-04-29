'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import type { Product, LogoZone } from '@/types/product'

interface LogoCanvasProps {
  product: Product
  logoUrl: string | null
  scale: number
  offsetX: number
  offsetY: number
  rotation: number
  opacity: number
  onCanvasReady?: (canvas: HTMLCanvasElement) => void
}

/** Hi-res target render size — anything below this gets upscaled at load
 * time so the per-strip/grid sampling reads from sharp pixels later. */
const HI_RES_TARGET = 2048
/** Canvas working resolution. Larger = crisper logos (especially when
 * downloaded), at a small CPU/memory cost on each render. */
const CANVAS_TARGET_WIDTH = 1600
/** Number of vertical strips for cylinder wrap — higher = smoother curve. */
const CYLINDER_STRIPS = 80
/** Grid resolution for sphere wrap — higher = smoother dome. */
const SPHERE_GRID = 32

/**
 * Real-time logo visualizer with crisp 3D-feel rendering.
 *
 * Quality pipeline:
 *  1. Logo is loaded then pre-rasterized into a hi-res buffer canvas
 *     (`HI_RES_TARGET` px on long side). This handles SVGs (which the
 *     browser would otherwise rasterize at their declared natural size,
 *     usually tiny) and small PNGs (which would pixelate when upscaled
 *     during strip/grid sampling).
 *  2. Main canvas renders at `CANVAS_TARGET_WIDTH` (1600 px) so retina
 *     displays and downloaded PNGs stay sharp.
 *  3. Strip/grid sampling reads from the pre-rasterized buffer with
 *     `imageSmoothingQuality: 'high'`, which means we're typically
 *     downscaling crisp pixels rather than upscaling blurry ones.
 *  4. A subtle drop shadow under the logo grounds it on the surface.
 *  5. For curved surfaces, an extra-soft side-vignette mimics the way
 *     light falls off on a cylinder/sphere.
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
  const logoBufferRef = useRef<HTMLCanvasElement | null>(null)
  const [productLoaded, setProductLoaded] = useState(false)
  const [logoLoaded, setLogoLoaded] = useState(false)
  const [logoSmallWarning, setLogoSmallWarning] = useState(false)

  const rawSrc = product.images[0]?.src ?? ''
  const productSrc = rawSrc.startsWith('https://')
    ? `/api/img?src=${encodeURIComponent(rawSrc)}`
    : rawSrc

  const zone: LogoZone = useMemo(
    () =>
      product.logoZone ?? {
        centerX: 0.5,
        centerY: 0.55,
        maxWidth: 0.35,
        maxHeight: 0.18,
        surface: 'flat',
      },
    [product.logoZone],
  )

  // Load product image
  useEffect(() => {
    if (!productSrc) return
    setProductLoaded(false)
    const img = new window.Image()
    img.crossOrigin = 'anonymous'
    img.decoding = 'async'
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

  // Load logo and pre-rasterize to hi-res buffer
  useEffect(() => {
    if (!logoUrl) {
      logoBufferRef.current = null
      setLogoLoaded(false)
      setLogoSmallWarning(false)
      return
    }
    setLogoLoaded(false)
    const img = new window.Image()
    img.decoding = 'async'
    img.onload = () => {
      const naturalLong = Math.max(img.naturalWidth, img.naturalHeight)
      const buffer = document.createElement('canvas')
      const ctx = buffer.getContext('2d', { alpha: true })
      if (!ctx) return

      // Always upscale to HI_RES_TARGET on the long side. SVGs render fresh
      // at this size; raster logos get a high-quality bicubic upscale.
      const targetLong = Math.max(naturalLong, HI_RES_TARGET)
      const aspect = img.naturalWidth / img.naturalHeight
      if (img.naturalWidth >= img.naturalHeight) {
        buffer.width = targetLong
        buffer.height = Math.max(1, Math.round(targetLong / aspect))
      } else {
        buffer.height = targetLong
        buffer.width = Math.max(1, Math.round(targetLong * aspect))
      }
      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = 'high'
      ctx.clearRect(0, 0, buffer.width, buffer.height)
      ctx.drawImage(img, 0, 0, buffer.width, buffer.height)

      logoBufferRef.current = buffer
      setLogoSmallWarning(naturalLong < 400)
      setLogoLoaded(true)
    }
    img.onerror = () => {
      logoBufferRef.current = null
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
    const targetW = Math.max(productImg.naturalWidth, CANVAS_TARGET_WIDTH)
    const targetH = Math.round(
      (productImg.naturalHeight / productImg.naturalWidth) * targetW,
    )
    canvas.width = targetW
    canvas.height = targetH
    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = 'high'

    // Background
    ctx.clearRect(0, 0, targetW, targetH)
    ctx.drawImage(productImg, 0, 0, targetW, targetH)

    // Draw logo
    const buffer = logoBufferRef.current
    if (buffer && logoLoaded && opacity > 0) {
      const baseW = zone.maxWidth * targetW * scale
      const baseH = zone.maxHeight * targetH * scale
      const bufAspect = buffer.width / buffer.height

      let drawW = baseW
      let drawH = baseW / bufAspect
      if (drawH > baseH) {
        drawH = baseH
        drawW = baseH * bufAspect
      }

      const cx = (zone.centerX + offsetX) * targetW
      const cy = (zone.centerY + offsetY) * targetH
      const surface = zone.surface ?? 'flat'

      // Drop shadow — subtle ground for the logo
      ctx.save()
      ctx.globalAlpha = opacity
      ctx.shadowColor = 'rgba(0,0,0,0.32)'
      ctx.shadowBlur = Math.max(6, drawW * 0.014)
      ctx.shadowOffsetX = 0
      ctx.shadowOffsetY = Math.max(2, drawW * 0.005)

      if (surface === 'cylinder' && drawW > 8) {
        renderCylinder({
          ctx,
          buffer,
          cx,
          cy,
          drawW,
          drawH,
          rotation,
          tilt: zone.tilt,
          curve: zone.curve ?? 0.18,
        })
      } else if (surface === 'sphere' && drawW > 8) {
        renderSphere({
          ctx,
          buffer,
          cx,
          cy,
          drawW,
          drawH,
          rotation,
        })
      } else {
        renderFlat({
          ctx,
          buffer,
          cx,
          cy,
          drawW,
          drawH,
          rotation,
          tilt: zone.tilt,
        })
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
    zone,
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
      {logoSmallWarning && (
        <div className="absolute top-3 right-3 max-w-[180px] px-3 py-2 rounded-md bg-amber-50/95 border border-amber-300 text-amber-900 text-[11px] leading-snug shadow-soft-sm">
          <strong className="block">Low-res logo</strong>
          Upload a larger PNG or SVG (≥800px) for a sharper preview.
        </div>
      )}
    </div>
  )
}

interface RenderArgs {
  ctx: CanvasRenderingContext2D
  buffer: HTMLCanvasElement
  cx: number
  cy: number
  drawW: number
  drawH: number
  rotation: number
}

function renderFlat({
  ctx,
  buffer,
  cx,
  cy,
  drawW,
  drawH,
  rotation,
  tilt,
}: RenderArgs & { tilt?: number }) {
  ctx.translate(cx, cy)
  ctx.rotate((rotation * Math.PI) / 180)
  if (tilt) {
    ctx.transform(1, 0, Math.tan((tilt * Math.PI) / 180), 1, 0, 0)
  }
  ctx.drawImage(buffer, -drawW / 2, -drawH / 2, drawW, drawH)
}

function renderCylinder({
  ctx,
  buffer,
  cx,
  cy,
  drawW,
  drawH,
  rotation,
  tilt,
  curve,
}: RenderArgs & { tilt?: number; curve: number }) {
  const strips = CYLINDER_STRIPS
  const stripW = drawW / strips
  const sourceStripW = buffer.width / strips

  ctx.translate(cx, cy)
  ctx.rotate((rotation * Math.PI) / 180)
  if (tilt) ctx.transform(1, 0, Math.tan((tilt * Math.PI) / 180), 1, 0, 0)

  // Slight overlap on each strip prevents single-pixel gaps when the
  // cosine scale collapses adjacent strips toward edges.
  const overlap = 0.5

  for (let i = 0; i < strips; i++) {
    const t = i / (strips - 1)
    const stripX = -drawW / 2 + i * stripW
    const angle = (t - 0.5) * Math.PI
    const sx = Math.cos(angle * curve * 4)
    const stripScaleX = sx > 0.08 ? sx : 0.08
    const sourceX = sourceStripW * i

    ctx.save()
    ctx.translate(stripX + stripW / 2, 0)
    ctx.scale(stripScaleX, 1)
    ctx.drawImage(
      buffer,
      sourceX,
      0,
      sourceStripW,
      buffer.height,
      -stripW / 2 - overlap / 2,
      -drawH / 2,
      stripW + overlap,
      drawH,
    )
    ctx.restore()
  }

  // Cylinder shading: dim the edges so the logo "sinks" into the curve.
  // Lighter than before since strip-scaling already conveys curvature.
  const grad = ctx.createLinearGradient(-drawW / 2, 0, drawW / 2, 0)
  grad.addColorStop(0, 'rgba(0,0,0,0.22)')
  grad.addColorStop(0.18, 'rgba(0,0,0,0.06)')
  grad.addColorStop(0.5, 'rgba(255,255,255,0)')
  grad.addColorStop(0.82, 'rgba(0,0,0,0.06)')
  grad.addColorStop(1, 'rgba(0,0,0,0.22)')
  // Disable shadow for this overlay (otherwise the gradient picks up shadow)
  ctx.shadowColor = 'transparent'
  ctx.globalCompositeOperation = 'multiply'
  ctx.fillStyle = grad
  ctx.fillRect(-drawW / 2, -drawH / 2, drawW, drawH)
}

function renderSphere({
  ctx,
  buffer,
  cx,
  cy,
  drawW,
  drawH,
  rotation,
}: RenderArgs) {
  ctx.translate(cx, cy)
  ctx.rotate((rotation * Math.PI) / 180)

  const grid = SPHERE_GRID
  const cellW = drawW / grid
  const cellH = drawH / grid
  const sourceCellW = buffer.width / grid
  const sourceCellH = buffer.height / grid

  for (let row = 0; row < grid; row++) {
    for (let col = 0; col < grid; col++) {
      const u = col / (grid - 1) - 0.5
      const v = row / (grid - 1) - 0.5
      const r = Math.sqrt(u * u + v * v)
      if (r > 0.5) continue
      const z = Math.sqrt(0.25 - r * r) * 2
      const sx = -drawW / 2 + col * cellW
      const sy = -drawH / 2 + row * cellH
      const srcX = sourceCellW * col
      const srcY = sourceCellH * row
      ctx.save()
      ctx.translate(sx + cellW / 2, sy + cellH / 2)
      const cellScale = z * 0.7 + 0.3
      ctx.scale(cellScale, cellScale)
      ctx.drawImage(
        buffer,
        srcX,
        srcY,
        sourceCellW,
        sourceCellH,
        -cellW / 2 - 0.25,
        -cellH / 2 - 0.25,
        cellW + 0.5,
        cellH + 0.5,
      )
      ctx.restore()
    }
  }

  // Spherical vignette — darken the rim to suggest curvature
  const radial = ctx.createRadialGradient(0, 0, 0, 0, 0, drawW / 2)
  radial.addColorStop(0, 'rgba(255,255,255,0)')
  radial.addColorStop(0.7, 'rgba(0,0,0,0.06)')
  radial.addColorStop(1, 'rgba(0,0,0,0.22)')
  ctx.shadowColor = 'transparent'
  ctx.globalCompositeOperation = 'multiply'
  ctx.fillStyle = radial
  ctx.fillRect(-drawW / 2, -drawH / 2, drawW, drawH)
}
