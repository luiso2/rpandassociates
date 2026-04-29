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

export interface QuoteFormPayload {
  firstName: string
  lastName: string
  company: string
  title?: string
  email: string
  phone: string
  productsOfInterest?: string
  cartItems?: QuoteCartItem[]
  source: QuoteSource
  honeypot?: string
}
