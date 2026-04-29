import { Suspense } from 'react'
import { Container } from '@/components/ui/Container'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { SearchResults } from './SearchResults'

export const metadata = {
  title: 'Search',
  description: 'Search the RP & Associates product catalog.',
}

export default function SearchPage() {
  return (
    <main>
      <Breadcrumbs items={[{ label: 'Search' }]} />
      <Suspense
        fallback={
          <section className="py-20 bg-surface-light">
            <Container>
              <div className="text-center text-ink-muted">Loading…</div>
            </Container>
          </section>
        }
      >
        <SearchResults />
      </Suspense>
    </main>
  )
}
