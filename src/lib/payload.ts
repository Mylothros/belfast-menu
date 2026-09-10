import { getPayload as getPayloadRaw } from 'payload'
import config from '@payload-config'

let cached: any = null

export async function tryGetPayload(): Promise<any | null> {
  if (process.env.VERCEL && !process.env.DATABASE_URI) {
    return null
  }
  if (cached) return cached
  try {
    cached = await getPayloadRaw({ config })
    return cached
  } catch (err) {
    console.warn('[payload] init failed, falling back to static:', (err as Error)?.message)
    return null
  }
}

export async function getCatalog(): Promise<any | null> {
  const payload = await tryGetPayload()
  if (!payload) return null
  try {
    const data = await payload.findGlobal({ slug: 'catalog' as any })
    if (!data || !data.categories || data.categories.length === 0) return null
    return data
  } catch (err) {
    console.warn('[payload] findGlobal catalog failed:', (err as Error)?.message)
    return null
  }
}
