import { getPayload } from 'payload'
import config from '@payload-config'

export async function GET(req: Request) {
  const u = new URL(req.url)
  const code = (u.searchParams.get('code') || '').trim().toUpperCase()
  const phone = (u.searchParams.get('phone') || '').replace(/\s/g, '')
  const payload = await getPayload({ config })
  const { docs } = await payload.find({ collection: 'orders', where: { code: { equals: code }, customerPhone: { equals: phone } }, limit: 1, overrideAccess: true })
  const o = docs[0]
  return Response.redirect(new URL(o ? `/dat-hang/${o.code}?t=${o.accessToken}` : '/tai-khoan?err=1', u.origin))
}
