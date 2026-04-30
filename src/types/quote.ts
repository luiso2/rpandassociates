export interface QuoteCartItem {
  productSlug: string
  productName: string
  productImage: string
  quantity: number
  notes?: string
  addedAt: number
}

export type QuoteSource =
  | 'homepage'
  | 'quote-page'
  | 'cart-drawer'
  | 'chat-form-fill'
  | 'product-page'

/** Design produced by the /customize visualizer, attached to the quote. */
export interface CustomDesign {
  /** Product the design is rendered onto. */
  productSlug: string
  productName: string
  /** Full data URL (data:image/png;base64,...) — the rendered canvas snapshot. */
  dataUrl: string
}

export interface QuoteFormPayload {
  firstName: string
  lastName: string
  company: string
  title?: string
  email: string
  phone: string
  productsOfInterest?: string
  cartItems?: QuoteCartItem[]
  customDesign?: CustomDesign
  source: QuoteSource
  honeypot?: string
}
