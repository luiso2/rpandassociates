export interface Service {
  slug: 'design' | 'manufacturing' | 'distribution'
  title: string
  description: string
  iconName: string // lucide icon name
}

export const services: Service[] = [
  {
    slug: 'design',
    title: 'Custom Design',
    description:
      'Our in-house design team partners with your brand to create one-of-a-kind promotional products. From concept sketches to 3D renders to final approval — we own the creative process.',
    iconName: 'Pencil',
  },
  {
    slug: 'manufacturing',
    title: 'Custom Manufacturing',
    description:
      'Vertically integrated manufacturing across plastics, metals, glass, and packaging. Tight tolerances, color-matched finishes, and quality systems audited by Fortune 500 partners.',
    iconName: 'Factory',
  },
  {
    slug: 'distribution',
    title: 'Warehousing & Distribution',
    description:
      'Full-service warehousing in Hermosa Beach, CA, with national distribution through major freight and parcel carriers — your inventory, ready when you need it.',
    iconName: 'Truck',
  },
]
