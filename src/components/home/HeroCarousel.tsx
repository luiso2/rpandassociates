'use client'

import { useCallback, useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import { ChevronLeft, ChevronRight, FileText, LayoutGrid } from 'lucide-react'
import { heroSlides } from '@/data/hero-slides'
import { cn } from '@/lib/cn'

export function HeroCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, duration: 28 }, [
    Autoplay({ delay: 5500, stopOnInteraction: false }),
  ])
  const [selectedIndex, setSelectedIndex] = useState(0)

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])
  const scrollTo = useCallback(
    (i: number) => emblaApi?.scrollTo(i),
    [emblaApi],
  )

  useEffect(() => {
    if (!emblaApi) return
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap())
    emblaApi.on('select', onSelect)
    onSelect()
    return () => {
      emblaApi.off('select', onSelect)
    }
  }, [emblaApi])

  return (
    <section
      className="relative w-full overflow-hidden bg-ink"
      aria-label="Featured products slideshow"
    >
      <div ref={emblaRef} className="overflow-hidden">
        <div className="flex">
          {heroSlides.map((slide, idx) => (
            <div
              key={slide.image}
              className="relative shrink-0 grow-0 basis-full aspect-[16/9] md:aspect-[21/9] lg:aspect-[5/2]"
            >
              <Image
                src={slide.image}
                alt={slide.alt}
                fill
                priority={idx === 0}
                sizes="100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/20 to-ink/80" />
              <div className="absolute inset-0 flex items-center justify-center text-center px-6">
                <div className="max-w-3xl">
                  <span className="inline-block mb-4 px-3 py-1 rounded-pill text-[10px] font-bold uppercase tracking-[2px] text-gold-light bg-white/10 border border-white/20 backdrop-blur-sm">
                    {slide.eyebrow}
                  </span>
                  <h1 className="font-heading font-extrabold text-[clamp(2rem,5.5vw,3.6rem)] leading-[1.08] mb-6 tracking-[-0.04em] text-gradient-gold drop-shadow-lg">
                    {slide.title}
                  </h1>
                  <p className="text-white/85 text-[clamp(1rem,2vw,1.18rem)] mb-9 max-w-xl mx-auto leading-relaxed font-normal">
                    {slide.subtitle}
                  </p>
                  <div className="flex gap-3 flex-wrap justify-center">
                    <Link
                      href={slide.ctaPrimary.href}
                      className="inline-flex items-center gap-2 px-8 py-3.5 rounded-pill bg-gradient-to-br from-gold to-gold-dark text-white text-sm font-bold uppercase tracking-wider shadow-gold border border-white/15 hover:from-gold-light hover:to-gold hover:-translate-y-1 transition-all"
                    >
                      <FileText className="w-4 h-4" />
                      {slide.ctaPrimary.label}
                    </Link>
                    {slide.ctaSecondary && (
                      <Link
                        href={slide.ctaSecondary.href}
                        className="inline-flex items-center gap-2 px-8 py-3.5 rounded-pill bg-white/10 text-white text-sm font-bold uppercase tracking-wider border border-white/30 backdrop-blur-md hover:bg-white/20 hover:border-white/50 hover:-translate-y-1 transition-all"
                      >
                        <LayoutGrid className="w-4 h-4" />
                        {slide.ctaSecondary.label}
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 flex justify-between px-5 pointer-events-none z-10">
        <button
          type="button"
          aria-label="Previous slide"
          onClick={scrollPrev}
          className="pointer-events-auto w-12 h-12 rounded-full bg-white/12 hover:bg-primary text-white border-2 border-white/25 backdrop-blur-sm flex items-center justify-center transition-all hover:scale-110 hover:border-primary"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          type="button"
          aria-label="Next slide"
          onClick={scrollNext}
          className="pointer-events-auto w-12 h-12 rounded-full bg-white/12 hover:bg-primary text-white border-2 border-white/25 backdrop-blur-sm flex items-center justify-center transition-all hover:scale-110 hover:border-primary"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <div className="absolute bottom-5 left-0 right-0 flex justify-center gap-2 z-10 px-4">
        {heroSlides.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => scrollTo(i)}
            className={cn(
              'h-1.5 rounded-full transition-all duration-500 ease-spring',
              i === selectedIndex
                ? 'w-10 bg-gold shadow-[0_0_18px_rgba(201,168,76,0.6)]'
                : 'w-1.5 bg-white/40 hover:bg-white/70 hover:w-3',
            )}
          />
        ))}
      </div>
    </section>
  )
}
