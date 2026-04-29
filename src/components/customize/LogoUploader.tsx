'use client'

import { useCallback, useRef, useState } from 'react'
import Image from 'next/image'
import { Upload, X, ImageIcon } from 'lucide-react'
import { cn } from '@/lib/cn'

interface LogoUploaderProps {
  logoUrl: string | null
  onLogoChange: (url: string | null) => void
}

const ACCEPTED = 'image/png,image/jpeg,image/svg+xml,image/webp'
const MAX_SIZE_MB = 5

export function LogoUploader({ logoUrl, onLogoChange }: LogoUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFile = useCallback(
    (file: File | undefined) => {
      if (!file) return
      if (!file.type.match(/image\/(png|jpe?g|svg\+xml|webp)/)) {
        setError('Use PNG, JPG, SVG, or WebP')
        return
      }
      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        setError(`File must be under ${MAX_SIZE_MB}MB`)
        return
      }
      setError(null)
      const reader = new FileReader()
      reader.onload = (e) => {
        const url = e.target?.result as string
        if (url) onLogoChange(url)
      }
      reader.readAsDataURL(file)
    },
    [onLogoChange],
  )

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setDragActive(false)
      handleFile(e.dataTransfer.files?.[0])
    },
    [handleFile],
  )

  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      handleFile(e.target.files?.[0])
    },
    [handleFile],
  )

  const onClear = useCallback(() => {
    onLogoChange(null)
    if (inputRef.current) inputRef.current.value = ''
  }, [onLogoChange])

  if (logoUrl) {
    return (
      <div className="glass rounded-xl p-4 border border-white/70 shadow-soft-sm">
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16 rounded-md bg-[conic-gradient(from_0deg,#f5f6fb,#e8eaf2,#f5f6fb)] flex items-center justify-center overflow-hidden shrink-0 border border-black/5">
            <Image
              src={logoUrl}
              alt="Your logo"
              fill
              sizes="64px"
              className="object-contain p-1.5"
              unoptimized
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[10px] font-bold uppercase tracking-[1.5px] text-primary mb-0.5">
              Your Logo
            </div>
            <div className="text-sm text-ink-body font-semibold">
              Loaded · Ready to preview
            </div>
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="text-[11px] text-ink-light hover:text-primary mt-1 underline"
            >
              Replace
            </button>
          </div>
          <button
            type="button"
            aria-label="Remove logo"
            onClick={onClear}
            className="w-8 h-8 rounded-full hover:bg-accent-red/10 hover:text-accent-red text-ink-light flex items-center justify-center transition shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED}
          className="hidden"
          onChange={onChange}
        />
      </div>
    )
  }

  return (
    <div>
      <label
        onDragOver={(e) => {
          e.preventDefault()
          setDragActive(true)
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={onDrop}
        className={cn(
          'block cursor-pointer rounded-xl p-8 text-center transition-all duration-300 border-2 border-dashed',
          dragActive
            ? 'border-gold bg-gold/5 scale-[1.01]'
            : 'border-black/10 bg-white hover:border-primary/40 hover:bg-primary/5',
        )}
      >
        <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary to-primary-light text-white flex items-center justify-center shadow-primary">
          <Upload className="w-6 h-6" />
        </div>
        <h3 className="font-heading text-lg font-bold text-ink mb-1">
          Drop your logo here
        </h3>
        <p className="text-sm text-ink-muted mb-4">
          PNG with transparent background works best · max {MAX_SIZE_MB}MB
        </p>
        <span className="inline-flex items-center gap-1.5 px-5 py-2 rounded-pill bg-ink text-white text-xs font-bold uppercase tracking-wider hover:bg-primary transition">
          <ImageIcon className="w-3.5 h-3.5" />
          Choose File
        </span>
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED}
          className="sr-only"
          onChange={onChange}
        />
      </label>
      {error && (
        <p className="mt-2 text-xs text-accent-red font-semibold">{error}</p>
      )}
    </div>
  )
}
