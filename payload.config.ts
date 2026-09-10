import { buildConfig } from 'payload'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { fileURLToPath } from 'url'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// --- Users (required for admin auth) ---
const Users = {
  slug: 'users' as const,
  auth: true,
  admin: { useAsTitle: 'email' },
  access: {
    admin: ({ req }: { req: any }) => !!req.user,
  },
  fields: [
    { name: 'email', type: 'email' as const, required: true, unique: true },
    { name: 'role', type: 'select' as const, options: ['admin', 'editor'], defaultValue: 'admin' },
  ],
}

// --- Media ---
const Media = {
  slug: 'media' as const,
  access: { read: () => true },
  fields: [
    { name: 'alt', type: 'text' as const },
  ],
  upload: {
    staticDir: path.resolve(dirname, 'public/media'),
    mimeTypes: ['image/*'],
  },
}

// --- Catalog Global (all menu data) ---
const Catalog = {
  slug: 'catalog' as const,
  label: 'Catalogue',
  access: { read: () => true },
  fields: [
    {
      name: 'categories',
      label: 'Categories',
      type: 'array' as const,
      labels: { singular: 'Category', plural: 'Categories' },
      admin: { description: 'Drag to reorder. Mirrors the PDF order.' },
      fields: [
        { name: 'id', label: 'Slug (e.g. beverages)', type: 'text' as const, required: true },
        { name: 'title', type: 'text' as const, required: true },
        { name: 'subtitle', type: 'text' as const },
        {
          name: 'subcategories',
          label: 'Sub-categories / Groups',
          type: 'array' as const,
          labels: { singular: 'Group', plural: 'Groups' },
          admin: { description: 'Use Group label for IRISH / SCOTCH etc. Leave empty for single list.' },
          fields: [
            { name: 'label', type: 'text' as const, admin: { description: 'e.g. IRISH, SCOTCH, PREMIUM — leave empty for none' } },
            {
              name: 'items',
              type: 'array' as const,
              labels: { singular: 'Item', plural: 'Items' },
              fields: [
                { name: 'name', type: 'text' as const, required: true },
                { name: 'price', type: 'text' as const, required: true, admin: { description: 'e.g. 3€ or 3,5€' } },
                { name: 'note', type: 'text' as const },
              ],
            },
          ],
        },
      ],
    },
  ],
}

const isVercel = !!process.env.VERCEL
const databaseUri = process.env.DATABASE_URI || (isVercel ? 'file:/tmp/belfast.db' : 'file:./belfast.db')

export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL || process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000',
  secret: process.env.PAYLOAD_SECRET || 'dev-secret-belfast-32-chars-long-please-change',
  editor: lexicalEditor({}),
  admin: {
    user: Users.slug,
    importMap: { baseDir: path.resolve(dirname) },
    meta: {
      titleSuffix: '— ΜΠΕΛΦΑΣΤ CMS',
      description: 'Manage the ΜΠΕΛΦΑΣΤ Urban Pub catalogue',
      icons: [],
    },
  },
  db: sqliteAdapter({
    client: { url: databaseUri },
    // allow pushes in dev, migrations handle prod
    push: !isVercel,
  }),
  collections: [Users, Media],
  globals: [Catalog],
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  graphQL: { schemaOutputFile: path.resolve(dirname, 'generated-schema.graphql') },
  cors: ['http://localhost:3000', 'https://*.vercel.app'].filter(Boolean) as any,
  csrf: ['http://localhost:3000', 'https://*.vercel.app'].filter(Boolean) as any,
  onInit: async (payload) => {
    try {
      // seed on first run if catalog empty
      const existing = await payload.findGlobal({ slug: 'catalog' as any })
      const hasCategories = (existing as any)?.categories?.length > 0
      if (!hasCategories) {
        const { staticMenu } = await import('./src/lib/menu-data')
        await payload.updateGlobal({
          slug: 'catalog' as any,
          data: {
            categories: staticMenu.map((cat) => ({
              id: cat.id,
              title: cat.title,
              subtitle: cat.subtitle,
              subcategories: cat.subcategories.map((sub) => ({
                label: sub.label,
                items: sub.items.map((it) => ({
                  name: it.name,
                  price: it.price,
                  note: it.note,
                })),
              })),
            })),
          } as any,
        })
        payload.logger.info('Seeded catalog global from staticMenu')
      }
      // ensure admin user exists in dev
      if (!isVercel) {
        const users = await payload.find({ collection: 'users', limit: 1 })
        if (users.totalDocs === 0) {
          await payload.create({
            collection: 'users',
            data: {
              email: 'admin@belfast.pub',
              password: 'admin123',
              role: 'admin',
            },
          })
          payload.logger.info('Created default admin: admin@belfast.pub / admin123')
        }
      }
    } catch (err) {
      payload.logger.error({ err }, 'onInit seed failed')
    }
  },
})
