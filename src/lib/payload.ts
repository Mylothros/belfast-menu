import { getPayload as getPayloadRaw, type Payload } from 'payload'
import type { Catalog } from '../../payload-types'
import config from '@payload-config'

let cached: Payload | null = null
let failed = false

function hasPersistentDB(): boolean {
  if (process.env.TURSO_DATABASE_URL && process.env.TURSO_AUTH_TOKEN) return true
  if (process.env.DATABASE_URI) return true
  // Local dev always has file:./belfast.db
  if (!process.env.VERCEL) return true
  return false
}

export async function tryGetPayload(): Promise<Payload | null> {
  if (!hasPersistentDB()) return null
  if (cached) return cached
  if (failed) return null
  try {
    cached = await getPayloadRaw({ config })
    return cached
  } catch (err) {
    failed = true
    console.warn('[payload] init failed, falling back to static:', (err as Error)?.message)
    return null
  }
}

export async function getCatalog(): Promise<Catalog | null> {
  const payload = await tryGetPayload()
  if (!payload) return null
  try {
    const data = await payload.findGlobal({ slug: 'catalog' })
    if (!data || !data.categories || data.categories.length === 0) return null
    return data
  } catch (err) {
    console.warn('[payload] findGlobal catalog failed:', (err as Error)?.message)
    return null
  }
}
