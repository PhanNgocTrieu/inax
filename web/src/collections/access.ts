import type { Access } from 'payload'

export const anyone: Access = () => true
export const staff: Access = ({ req }) => Boolean(req.user)
export const adminOnly: Access = ({ req }) => req.user?.role === 'admin'
