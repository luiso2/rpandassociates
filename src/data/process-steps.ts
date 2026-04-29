export interface ProcessStep {
  step: number
  title: string
  description: string
  iconName: string // lucide icon name
}

export const processSteps: ProcessStep[] = [
  {
    step: 1,
    title: 'Design & Planning',
    description:
      'Discovery call, brand brief, sketches, materials review, and budget alignment — we map every detail before tooling begins.',
    iconName: 'PencilRuler',
  },
  {
    step: 2,
    title: 'Develop & Manufacture',
    description:
      'Prototype → sampling → production. In-house mold making, decoration, color matching, and full quality control at every stage.',
    iconName: 'Cog',
  },
  {
    step: 3,
    title: 'Warehouse & Deliver',
    description:
      'Inventory storage in our California facility plus nationwide distribution. We ship on your schedule, anywhere in the U.S.',
    iconName: 'PackageCheck',
  },
]
