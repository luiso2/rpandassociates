'use client'

import { useCallback, useEffect, useState } from 'react'
import Image from 'next/image'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import { ChevronLeft, ChevronRight } from 'lucide-react'
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
              className="relative shrink-0 grow-0 basis-full aspect-[16/9] md:aspect-[21/9] lg:aspect-[5/2] overflow-hidden"
            >
              <Image
                src={slide.image}
                alt={slide.alt}
                fill
                priority={idx === 0}
                sizes="100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-ink/15 via-transparent to-ink/30 pointer-events-none" />
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
