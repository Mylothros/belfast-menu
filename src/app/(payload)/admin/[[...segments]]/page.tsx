import config from '@payload-config'
import { importMap } from '../importMap.js'
import { RootPage, generatePageMetadata } from '@payloadcms/next/views'

export async function generateMetadata({ params }: any) {
  return generatePageMetadata({ config, params, importMap } as any)
}

export default async function AdminPage({ params }: any) {
  if (process.env.VERCEL && !process.env.DATABASE_URI) {
    return (
      <div style={{ padding: 40, fontFamily: 'system-ui', background: '#F5EFE0', minHeight: '100vh' }}>
        <h1 style={{ fontSize: 28, fontWeight: 700 }}>Payload CMS disabled on Vercel</h1>
        <p style={{ marginTop: 12, color: '#444' }}>
          No <code>DATABASE_URI</code> is configured on Vercel. The live site falls back to the static catalogue via
          <code> /api/catalog</code>. Manage content locally with <code>sqlite</code>: run <code>bun dev</code> and open{' '}
          <a href="/admin">/admin</a>.
        </p>
        <p style={{ marginTop: 20 }}>
          <a href="/" style={{ color: '#163F1A', fontWeight: 600 }}>← Back to menu</a> &nbsp;|&nbsp; <a href="/api/catalog" style={{ color: '#163F1A' }}>/api/catalog</a>
        </p>
      </div>
    )
  }
  return RootPage({ config, params, importMap } as any)
}

export async function generateStaticParams() {
  return []
}
