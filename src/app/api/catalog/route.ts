import { NextResponse } from 'next/server'
import { staticMenu } from '@/lib/menu-data'
import { getCatalog } from '@/lib/payload'

export const dynamic = 'force-dynamic'

export async function GET() {
  const isVercelNoDB = !!process.env.VERCEL && !process.env.DATABASE_URI
  if (isVercelNoDB) {
    return NextResponse.json({
      source: 'static-fallback-vercel-no-db',
      message: 'Vercel has no DATABASE_URI, serving static catalog. Configure DATABASE_URI to enable Payload.',
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
