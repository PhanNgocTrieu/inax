export const fmt = (n: number) => new Intl.NumberFormat('vi-VN').format(Math.round(n)) + '₫'
export const num = (n: number) => new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 2 }).format(n)
