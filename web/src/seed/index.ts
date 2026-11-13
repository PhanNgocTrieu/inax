/** CLI: `pnpm seed` – nạp dữ liệu mẫu vào DB đang cấu hình trong .env */
import { getPayload } from 'payload'
import config from '@payload-config'
import { seed } from './seed'

try {
  await seed(await getPayload({ config }))
  process.exit(0)
} catch (e) {
  console.error(e)
  process.exit(1)
}
