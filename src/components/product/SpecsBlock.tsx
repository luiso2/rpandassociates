import { Ruler, Weight, Clock, Sparkles, Globe2, Beaker } from 'lucide-react'
import type { ProductSpecs } from '@/types/product'

interface SpecsBlockProps {
  specs: ProductSpecs
}

const customizationLabels: Record<string, string> = {
  'pad-print': 'Pad print',
  'screen-print': 'Screen print',
  'laser-engraving': 'Laser engraving',
  sublimation: 'Sublimation',
  embossing: 'Embossing',
  silkscreen: 'Silkscreen',
  wrap: 'Full wrap',
  sticker: 'Sticker / decal',
  'in-mold-label': 'In-mold label',
}

export function SpecsBlock({ specs }: SpecsBlockProps) {
  const rows: Array<{ icon: React.ReactNode; label: string; value: string } | null> = [
    specs.capacityOz != null
      ? {
          icon: <Beaker className="w-3.5 h-3.5" />,
          label: 'Capacity',
          value: `${specs.capacityOz} oz${
            specs.capacityMl ? ` · ${specs.capacityMl} ml` : ''
          }`,
        }
      : null,
    specs.dimensions
      ? {
          icon: <Ruler className="w-3.5 h-3.5" />,
          label: 'Dimensions',
          value: formatDimensions(specs.dimensions),
        }
      : null,
    specs.weightG != null
      ? {
          icon: <Weight className="w-3.5 h-3.5" />,
          label: 'Weight',
          value: `${specs.weightG} g`,
        }
      : null,
    specs.leadTimeDays
      ? {
          icon: <Clock className="w-3.5 h-3.5" />,
          label: 'Lead time',
          value: `${specs.leadTimeDays.min}–${specs.leadTimeDays.max} business days`,
        }
      : null,
    specs.customizationOptions && specs.customizationOptions.length > 0
      ? {
          icon: <Sparkles className="w-3.5 h-3.5" />,
          label: 'Decoration',
          value: specs.customizationOptions
            .map((c) => customizationLabels[c] ?? c)
            .join(' · '),
        }
      : null,
    specs.origin
      ? {
          icon: <Globe2 className="w-3.5 h-3.5" />,
          label: 'Origin',
          value: specs.origin,
        }
      : null,
  ]

  const visible = rows.filter(
    (r): r is { icon: React.ReactNode; label: string; value: string } => r !== null,
  )

  if (visible.length === 0) return null

  return (
    <div className="rounded-xl border border-black/5 overflow-hidden bg-white">
      <h3 className="px-5 py-3 bg-surface-section/60 text-[11px] font-bold uppercase tracking-[1.5px] text-ink-light border-b border-black/5">
        Specifications
      </h3>
      <dl className="divide-y divide-black/5">
        {visible.map((row) => (
          <div
            key={row.label}
            className="grid grid-cols-[140px_1fr] gap-3 px-5 py-3 text-sm"
          >
            <dt className="flex items-center gap-1.5 text-ink-light font-semibold">
              {row.icon}
              {row.label}
            </dt>
            <dd className="text-ink-body">{row.value}</dd>
          </div>
        ))}
        {specs.notes && (
          <div className="px-5 py-3 text-xs text-ink-muted leading-relaxed bg-surface-section/40">
            {specs.notes}
          </div>
        )}
      </dl>
    </div>
  )
}

function formatDimensions(d: NonNullable<ProductSpecs['dimensions']>): string {
  const parts: string[] = []
  if (d.widthMm) parts.push(`${d.widthMm}mm W`)
  if (d.depthMm) parts.push(`${d.depthMm}mm D`)
  if (d.heightMm) parts.push(`${d.heightMm}mm H`)
  if (d.diameterMm) parts.push(`Ø ${d.diameterMm}mm`)
  return parts.join(' × ')
}
