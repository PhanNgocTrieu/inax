import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import { vi } from '@payloadcms/translations/languages/vi'
import { en } from '@payloadcms/translations/languages/en'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Categories } from './collections/Categories'
import { Products } from './collections/Products'
import { Projects } from './collections/Projects'
import { Orders } from './collections/Orders'
import { Requests } from './collections/Requests'
import { Coupons } from './collections/Coupons'
import { Settings } from './globals/Settings'
import { migrations } from './migrations'
import { seed } from './seed/seed'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_SITE_URL || '',
  admin: {
    user: Users.slug,
    importMap: { baseDir: path.resolve(dirname) },
    meta: { titleSuffix: ' – GreenHabitat Admin' },
  },
  i18n: { supportedLanguages: { vi, en }, fallbackLanguage: 'vi' },
  collections: [Orders, Requests, Coupons, Products, Categories, Projects, Media, Users],
  globals: [Settings],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
  // SQLite. Dev tự đồng bộ schema; production chạy migration trong src/migrations khi khởi động.
  // Sau khi đổi collection/field: `pnpm payload migrate:create <tên>`.
  db: sqliteAdapter({ client: { url: process.env.DATABASE_URL || '' }, prodMigrations: migrations }),
  // Bản demo: SEED_ON_INIT=1 => tự nạp dữ liệu mẫu khi DB còn trống.
  onInit: async (payload) => {
    if (process.env.SEED_ON_INIT !== '1') return
    const { totalDocs } = await payload.count({ collection: 'categories', overrideAccess: true })
    if (!totalDocs) await seed(payload)
  },
  sharp,
  plugins: [],
})
