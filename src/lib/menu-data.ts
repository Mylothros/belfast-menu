import seed from './menu-seed.json'

export type Item = { name: string; price: string; note?: string }
export type SubCategory = { label?: string; items: Item[] }
export type Category = {
  id: string
  title: string
  subtitle?: string
  count: number
  subcategories: SubCategory[]
}

// Single source of truth lives in menu-seed.json (also used by Payload seed).
// Kept as JSON so both Next/Turbopack and the Payload CLI (tsx) can load it.
export const staticMenu: Category[] = seed as Category[]
