import { buildConfig } from 'payload'
import type { CollectionConfig, GlobalConfig } from 'payload'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import path from 'path'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import seedMenu from './src/lib/menu-seed.json'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// NOTE: no richtext fields are used anywhere, so no editor is configured.
// This intentionally avoids @payloadcms/richtext-lexical (top-level-await
// breaks the payload CLI under tsx on Node 20/22).

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: { useAsTitle: 'email' },
  access: {
    admin: ({ req }) => !!req.user,
  },
  fields: [
    {
      name: 'role',
      type: 'select',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Editor', value: 'editor' },
      ],
      defaultValue: 'admin',
      required: true,
    },
  ],
}

export const Media: CollectionConfig = {
  slug: 'media',
  access: { read: () => true },
  fields: [{ name: 'alt', type: 'text' }],
  upload: {
    staticDir: path.resolve(dirname, 'public/media'),
    mimeTypes: ['image/*'],
  },
}

export const Catalog: GlobalConfig = {
  slug: 'catalog',
  label: 'Catalogue',
  access: { read: () => true },
  fields: [
    {
      name: 'categories',
      label: 'Categories',
      type: 'array',
      labels: { singular: 'Category', plural: 'Categories' },
      admin: { description: 'Drag to reorder. Mirrors the PDF order.' },
      fields: [
        { name: 'id', label: 'Slug (e.g. beverages)', type: 'text', required: true },
        { name: 'title', type: 'text', required: true },
        { name: 'subtitle', type: 'text' },
        {
          name: 'subcategories',
          label: 'Sub-categories / Groups',
          type: 'array',
          labels: { singular: 'Group', plural: 'Groups' },
          admin: {
            description: 'Use Group label for IRISH / SCOTCH etc. Leave empty for single list.',
          },
          fields: [
            {
              name: 'label',
              type: 'text',
              admin: { description: 'e.g. IRISH, SCOTCH, PREMIUM — leave empty for none' },
            },
            {
              name: 'items',
              type: 'array',
              labels: { singular: 'Item', plural: 'Items' },
              fields: [
                { name: 'name', type: 'text', required: true },
                { name: 'price', type: 'text', required: true, admin: { description: 'e.g. 3€ or 3,5€' } },
                { name: 'note', type: 'text' },
              ],
            },
          ],
        },
      ],
    },
  ],
}

type SeedItem = { name: string; price: string; note?: string | null }
type SeedSub = { label?: string | null; items: SeedItem[] }
type SeedCat = {
  id: string
  title: string
  subtitle?: string | null
  subcategories: SeedSub[]
}
const seedCategories = seedMenu as unknown as SeedCat[]

function resolveServerURL(): string {
  if (process.env.NEXT_PUBLIC_SERVER_URL) return process.env.NEXT_PUBLIC_SERVER_URL
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL)
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  return 'http://localhost:3000'
}

// DB resolution:
// - Local dev: file:./belfast.db (sqlite file, zero config)
// - Vercel without Turso: file:/tmp/belfast.db (ephemeral; CMS falls back to static — see /api/catalog)
// - Vercel with Turso: libsql remote (persistent CMS). Set TURSO_DATABASE_URL + TURSO_AUTH_TOKEN.
function resolveDatabaseConfig() {
  const tursoUrl = process.env.TURSO_DATABASE_URL
  const tursoToken = process.env.TURSO_AUTH_TOKEN
  if (tursoUrl && tursoToken) {
    return { url: tursoUrl, authToken: tursoToken }
  }
  if (process.env.DATABASE_URI) return { url: process.env.DATABASE_URI }
  if (process.env.VERCEL) return { url: 'file:/tmp/belfast.db' }
  return { url: 'file:./belfast.db' }
}

const isEphemeralVercelNoTurso =
  !!process.env.VERCEL && !process.env.TURSO_DATABASE_URL && !process.env.DATABASE_URI

export default buildConfig({
  serverURL: resolveServerURL(),
  secret: process.env.PAYLOAD_SECRET || 'dev-secret-belfast-32-chars-long-please-change',
  sharp,
  admin: {
    user: Users.slug,
    importMap: { baseDir: path.resolve(dirname) },
    meta: {
      titleSuffix: '— ΜΠΕΛΦΑΣΤ CMS',
      description: 'Manage the ΜΠΕΛΦΑΣΤ Urban Pub catalogue',
    },
  },
  db: sqliteAdapter({
    client: resolveDatabaseConfig(),
    migrationDir: path.resolve(dirname, 'src/migrations'),
    // push only for local prototyping; Vercel + prod must use migrations
    push: !process.env.VERCEL && process.env.NODE_ENV !== 'production',
  }),
  collections: [Users, Media],
  globals: [Catalog],
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  graphQL: { schemaOutputFile: path.resolve(dirname, 'generated-schema.graphql') },
  onInit: async (payload) => {
    try {
      // Skip seeding on ephemeral Vercel (no persistent DB) — frontend uses static fallback.
      if (isEphemeralVercelNoTurso) {
        payload.logger.info('Skipping seed: ephemeral Vercel without Turso/DATABASE_URI')
        return
      }
      const existing = await payload.findGlobal({ slug: 'catalog' })
      const existingCategories = (existing as unknown as { categories?: unknown[] })
        ?.categories
      const hasCategories = (existingCategories?.length ?? 0) > 0
      if (!hasCategories) {
        await payload.updateGlobal({
          slug: 'catalog',
          data: {
            categories: seedCategories.map((cat) => ({
              id: cat.id,
              title: cat.title,
              subtitle: cat.subtitle ?? undefined,
              subcategories: cat.subcategories.map((sub) => ({
                label: sub.label ?? undefined,
                items: sub.items.map((it) => ({
                  name: it.name,
                  price: it.price,
                  note: it.note ?? undefined,
                })),
              })),
            })),
          },
        })
        payload.logger.info('Seeded catalog global from staticMenu')
      }
      if (!process.env.VERCEL) {
        const users = await payload.find({ collection: 'users', limit: 1 })
        if (users.totalDocs === 0) {
          await payload.create({
            collection: 'users',
            data: {
              email: process.env.PAYLOAD_FIRST_USER_EMAIL || 'admin@belfast.pub',
              password: process.env.PAYLOAD_FIRST_USER_PASSWORD || 'admin123',
              role: 'admin',
            },
          })
          payload.logger.info('Created default admin user (change password after first login)')
        }
      }
    } catch (err) {
      payload.logger.error({ err }, 'onInit seed failed')
    }
  },
})
