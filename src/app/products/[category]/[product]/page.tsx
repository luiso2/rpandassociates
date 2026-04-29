import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { Check, Cog, Package, Layers } from 'lucide-react'
import { products, productBySlug } from '@/data/products'
import { categoryBySlug } from '@/data/categories'
import { subcategoryBySlug } from '@/data/subcategories'
import { industryBySlug } from '@/data/industries'
import { Container } from '@/components/ui/Container'
import { Badge } from '@/components/ui/Badge'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { ProductDetailGallery } from '@/components/product/ProductDetailGallery'
import { AddToQuoteButton } from '@/components/product/AddToQuoteButton'
import { RelatedProducts } from '@/components/product/RelatedProducts'
import { SpecsBlock } from '@/components/product/SpecsBlock'
import type { CategorySlug } from '@/types/category'

export const dynamicParams = false

export function generateStaticParams() {
  return products.map((p) => ({
    category: p.categorySlug,
    product: p.slug,
  }))
}

export function generateMetadata({
  params,
}: {
  params: { category: string; product: string }
}): Metadata {
  const product = productBySlug[params.product]
  if (!product || product.categorySlug !== params.category) {
    return { title: 'Not Found' }
  }
  return {
    title: product.seo.title,
    description: product.seo.description,
    openGraph: {
      title: product.seo.title,
      description: product.seo.description,
      images: product.images.map((img) => ({ url: img.src, alt: img.alt })),
    },
  }
}

const materialLabels: Record<string, string> = {
  plastic: 'Plastic',
  glass: 'Glass',
  aluminum: 'Aluminum',
  'stainless-steel': 'Stainless Steel',
  copper: 'Copper',
  wood: 'Wood',
  silicone: 'Silicone',
  fabric: 'Fabric',
  cardboard: 'Cardboard',
  melamine: 'Melamine',
  ceramic: 'Ceramic',
  acrylic: 'Acrylic',
}

export default function ProductDetailPage({
  params,
}: {
  params: { category: string; product: string }
}) {
  const product = productBySlug[params.product]
  if (!product || product.categorySlug !== params.category) notFound()

  const category = categoryBySlug[product.categorySlug as CategorySlug]
  const subcategories = product.subcategorySlugs
    .map((slug) => subcategoryBySlug[slug])
    .filter(Boolean)
  const productIndustries = product.industries
    .map((slug) => industryBySlug[slug])
    .filter(Boolean)

  return (
    <main>
      <Breadcrumbs
        items={[
          { label: 'Products', href: '/products' },
          { label: category.name, href: `/products/${category.slug}` },
          { label: product.name },
        ]}
      />

      <section className="py-12 bg-white">
        <Container>
          <div className="grid lg:grid-cols-2 gap-12">
            <ProductDetailGallery product={product} />
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <Badge variant="primary">{category.name}</Badge>
                {product.tags.includes('best-seller') && (
                  <Badge variant="gold">Best Seller</Badge>
                )}
                {product.tags.includes('new') && (
                  <Badge variant="primary">New</Badge>
                )}
                {product.tags.includes('patented') && (
                  <Badge variant="dark">Patented</Badge>
                )}
              </div>
              <h1 className="font-heading text-3xl md:text-4xl font-extrabold tracking-tight mb-4 text-ink">
                {product.name}
              </h1>
              <p className="text-ink-muted text-lg leading-relaxed mb-8">
                {product.longDescription ?? product.description}
              </p>

              <div className="grid grid-cols-2 gap-4 mb-8">
                {product.minOrderQuantity && (
                  <SpecCard
                    icon={<Package className="w-4 h-4" />}
                    label="Min Order"
                    value={product.minOrderQuantity.toLocaleString()}
                  />
                )}
                <SpecCard
                  icon={<Cog className="w-4 h-4" />}
                  label="Customizable"
                  value={product.customizable ? 'Yes' : 'Standard'}
                />
                {product.materials.length > 0 && (
                  <SpecCard
                    icon={<Layers className="w-4 h-4" />}
                    label="Materials"
                    value={product.materials
                      .map((m) => materialLabels[m] ?? m)
                      .join(', ')}
                    span2={product.materials.length > 1}
                  />
                )}
              </div>

              <AddToQuoteButton product={product} />

              {product.specs && (
                <div className="mt-8">
                  <SpecsBlock specs={product.specs} />
                </div>
              )}

              {(subcategories.length > 0 || productIndustries.length > 0) && (
                <div className="mt-10 pt-8 border-t border-black/5 space-y-5">
                  {subcategories.length > 0 && (
                    <TagRow label="Subcategories">
                      {subcategories.map((s) => (
                        <Link
                          key={s.slug}
                          href={`/products/${s.categorySlug}/${s.slug}`}
                          className="px-3 py-1.5 rounded-pill bg-surface-section text-xs font-semibold text-ink-body hover:bg-primary hover:text-white transition"
                        >
                          {s.name}
                        </Link>
                      ))}
                    </TagRow>
                  )}
                  {productIndustries.length > 0 && (
                    <TagRow label="Industries">
                      {productIndustries.map((ind) => (
                        <Link
                          key={ind.slug}
                          href={`/industries/${ind.slug}`}
                          className="px-3 py-1.5 rounded-pill bg-gold/10 text-xs font-semibold text-gold-dark hover:bg-gold hover:text-white transition"
                        >
                          {ind.name}
                        </Link>
                      ))}
                    </TagRow>
                  )}
                </div>
              )}

              <ul className="mt-8 space-y-2">
                <FeatureLine>Designed and manufactured by RP & Associates</FeatureLine>
                <FeatureLine>Vertically integrated supply chain</FeatureLine>
                <FeatureLine>Custom decoration in your brand colors</FeatureLine>
                <FeatureLine>Nationwide warehousing &amp; distribution</FeatureLine>
              </ul>
            </div>
          </div>
        </Container>
      </section>

      <RelatedProducts product={product} />
    </main>
  )
}

function SpecCard({
  icon,
  label,
  value,
  span2,
}: {
  icon: React.ReactNode
  label: string
  value: string
  span2?: boolean
}) {
  return (
    <div
      className={`p-4 rounded-lg bg-surface-section border border-black/5 ${
        span2 ? 'col-span-2' : ''
      }`}
    >
      <div className="flex items-center gap-2 text-ink-light mb-1">
        {icon}
        <span className="text-[10px] font-bold uppercase tracking-[1.5px]">
          {label}
        </span>
      </div>
      <div className="font-heading text-base font-bold text-ink">{value}</div>
    </div>
  )
}

function TagRow({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div>
      <div className="text-[10px] font-bold uppercase tracking-[1.5px] text-ink-light mb-2">
        {label}
      </div>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  )
}

function FeatureLine({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2.5 text-sm text-ink-body">
      <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
      <span>{children}</span>
    </li>
  )
}
