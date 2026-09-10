import config from '@payload-config'
import { importMap } from '../importMap.js'
import { NotFoundPage, generatePageMetadata } from '@payloadcms/next/views'

export async function generateMetadata({ params }: any) {
  return generatePageMetadata({ config, params, importMap } as any)
}

export default async function AdminNotFound({ params }: any) {
  return NotFoundPage({ config, params, importMap } as any)
}
