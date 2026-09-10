import { NextResponse } from 'next/server'
import { staticMenu } from '@/lib/menu-data'
import { getCatalog } from '@/lib/payload'

export const dynamic = 'force-dynamic'

function dbStatus() {
  const hasTurso = !!(process.env.TURSO_DATABASE_URL && process.env.TURSO_AUTH_TOKEN)
  const hasUri = !!process.env.DATABASE_URI
  if (hasTurso) return { mode: 'turso', persistent: true }
  if (hasUri) return { mode: 'database_uri', persistent: true }
  if (!process.env.VERCEL) return { mode: 'local-sqlite', persistent: true }
  return { mode: 'ephemeral-vercel-no-db', persistent: false }
}

export async function GET() {
  const status = dbStatus()
  if (!status.persistent) {
    return NextResponse.json({
      source: 'static-fallback-vercel-no-db',
      message:
        'Vercel has no persistent DB (set TURSO_DATABASE_URL + TURSO_AUTH_TOKEN or DATABASE_URI for live CMS). Serving static catalogue.',
      updatedAt: new Date().toISOString(),
      categories: staticMenu,
    })
  }

  const catalog = await getCatalog()
  if (catalog?.categories?.length) {
    return NextResponse.json({
      source: 'payload',
      updatedAt: catalog.updatedAt || new Date().toISOString(),
      categories: catalog.categories,
    })
  }

  return NextResponse.json({
    source: 'static-fallback',
    message: 'Payload not ready or empty — serving static catalogue. Visit /admin to seed.',
    categories: staticMenu,
  })
}
