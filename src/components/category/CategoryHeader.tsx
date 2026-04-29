import Image from 'next/image'
import { Container } from '@/components/ui/Container'
import type { Category } from '@/types/category'

interface CategoryHeaderProps {
  category: Category
  productCount: number
}

export function CategoryHeader({ category, productCount }: CategoryHeaderProps) {
  return (
    <section className="relative bg-ink text-white overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src={category.heroImage}
          alt={category.name}
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/60 to-ink/30" />
      </div>
      <Container>
        <div className="relative z-10 py-14 md:py-20 max-w-2xl">
          <span className="inline-block mb-4 px-3 py-1 rounded-pill text-[10px] font-bold uppercase tracking-[2px] text-gold-light bg-white/10 border border-white/20 backdrop-blur-sm">
            Category · {productCount} products
          </span>
          <h1 className="font-heading font-extrabold text-[clamp(2rem,5vw,3.4rem)] leading-tight mb-4 tracking-tighter">
            {category.name}
          </h1>
          <p className="text-white/75 text-base md:text-lg leading-relaxed">
            {category.longDescription}
          </p>
        </div>
      </Container>
    </section>
  )
}
