import { getPayload } from 'payload'
import config from '@payload-config'

export const getP = () => getPayload({ config })
export const json = (data: unknown, status = 200) => Response.json(data, { status })
export const mockAllowed = () => process.env.PAYMENT_MOCK === '1' || process.env.NODE_ENV !== 'production'
export const orderUrl = (base: string, code: string, token?: string | null) => `${base}/dat-hang/${code}${token ? `?t=${token}` : ''}`
