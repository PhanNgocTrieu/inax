import type { Field } from 'payload'

export const slugField = (from = 'name'): Field => ({
  name: 'slug', label: 'Đường dẫn (slug)', type: 'text', required: true, unique: true, index: true,
  admin: { position: 'sidebar', description: 'Tự tạo từ tên nếu để trống' },
  hooks: {
    beforeValidate: [({ value, data }) => {
      const src = value || data?.[from]
      return src ? slugify(String(src)) : value
    }],
  },
})

export function slugify(s: string) {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'd')
    .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
}

export const textureField: Field = {
  name: 'texture', label: 'Texture thay thế (khi chưa có ảnh)', type: 'json',
  admin: { position: 'sidebar', description: 'Dùng nội bộ – ảnh upload sẽ được ưu tiên' },
}

export const ROOM_OPTIONS = [
  { label: 'Phòng tắm', value: 'phong-tam' },
  { label: 'Nhà bếp', value: 'nha-bep' },
  { label: 'Phòng khách', value: 'phong-khach' },
  { label: 'Ngoài trời', value: 'ngoai-troi' },
]
export const COLOR_OPTIONS = [
  { label: 'Trắng', value: 'trang' }, { label: 'Be / Kem', value: 'be' }, { label: 'Xám', value: 'xam' },
  { label: 'Đen', value: 'den' }, { label: 'Nâu gỗ', value: 'nau' }, { label: 'Xanh', value: 'xanh' },
  { label: 'Vàng đồng', value: 'vang' },
]
