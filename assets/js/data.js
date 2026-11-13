/* =========================================================
   GreenHabitat – dữ liệu mẫu (sẽ thay bằng API/CMS ở giai đoạn backend)
   ========================================================= */

window.SITE = {
  legalName: 'CÔNG TY TNHH THƯƠNG MẠI TNT THỊNH PHÁT',
  brand: 'GreenHabitat',
  address: '267 Thái Văn Lung, Hòa Xuân, Đà Nẵng',
  hotline: '0236 xxx xxxx',          // TODO: cập nhật số thật
  zalo: '09xx xxx xxx',              // TODO
  email: 'info@greenhabitat.vn',     // TODO: xác nhận domain
  taxCode: 'Đang cập nhật',          // TODO: mã số thuế
  hours: 'Thứ 2 – Thứ 7: 7:30 – 17:30 · CN: 8:00 – 12:00',
  mapEmbed: 'https://www.google.com/maps?q=16.0164123,108.2304191&z=17&output=embed',
  mapLink: 'https://maps.app.goo.gl/?q=16.0164123,108.2304191'
};

window.CATEGORIES = [
  { id: 'gach-op-lat', name: 'Gạch ốp lát', short: 'Porcelain, Zellige, Terrazzo, gạch bông',
    tex: { t: 'terrazzo', base: '#ece6dc', chips: ['#c9b9a3', '#8f8476', '#d8cfc2', '#a7765a', '#fff'], seed: 4 } },
  { id: 'da-tu-nhien', name: 'Đá tự nhiên & nhân tạo', short: 'Marble, Granite, Quartz, Travertine',
    tex: { t: 'marble', base: '#f1eee9', vein: '#7d7a76', seed: 7 } },
  { id: 'san-go', name: 'Sàn gỗ & SPC', short: 'Gỗ kỹ thuật, gỗ tự nhiên, SPC hèm khóa',
    tex: { t: 'wood', base: '#c79b6d', dark: '#8a5f3a', seed: 2 } },
  { id: 'thiet-bi-ve-sinh', name: 'Thiết bị vệ sinh', short: 'Lavabo, bồn cầu, sen vòi, phụ kiện',
    tex: { t: 'illus', kind: 'basin', bg: '#dfe5df' } },
  { id: 'tam-op', name: 'Tấm ốp tường & trần', short: 'Lam sóng WPC, Nano, PVC vân đá',
    tex: { t: 'slats', base: '#7a5236', dark: '#3a2516', seed: 3 } },
  { id: 'hoan-thien', name: 'Sơn & vật liệu hoàn thiện', short: 'Microcement, sơn hiệu ứng, keo chà ron',
    tex: { t: 'concrete', base: '#cfc6b8', seed: 5 } }
];

window.ROOMS = [
  { id: 'phong-tam', name: 'Phòng tắm', desc: 'Gạch chống trơn, thiết bị vệ sinh, đá ốp', tex: { t: 'tile', colors: ['#5d7f72', '#4f7266', '#6b8c7f', '#557868'], w: 50, h: 100, grout: '#e8e2d8', seed: 11 } },
  { id: 'nha-bep', name: 'Nhà bếp', desc: 'Đá mặt bếp, gạch backsplash', tex: { t: 'marble', base: '#2a2a2a', vein: '#d8d4cc', seed: 21 } },
  { id: 'phong-khach', name: 'Phòng khách', desc: 'Sàn gỗ, đá khổ lớn, tấm ốp', tex: { t: 'wood', base: '#d6b48c', dark: '#a27a52', seed: 9 } },
  { id: 'ngoai-troi', name: 'Ngoài trời', desc: 'Đá sân vườn, gạch terrazzo, WPC', tex: { t: 'travertine', base: '#e2d3bb', dark: '#bda585', seed: 13 } }
];

window.PRODUCTS = [
  // --- Gạch ốp lát
  { id: 'p01', slug: 'gach-terrazzo-venezia-60x60', name: 'Gạch Terrazzo Venezia', cat: 'gach-op-lat', rooms: ['phong-khach', 'ngoai-troi'],
    price: 485000, oldPrice: 540000, unit: 'm²', boxM2: 1.44, sizes: ['60×60 cm', '80×80 cm'], finishes: ['Mờ', 'Bán bóng'],
    color: 'be', origin: 'Việt Nam', badges: ['Bán chạy'],
    tex: { t: 'terrazzo', base: '#ebe4d8', chips: ['#c2ad91', '#8b7e6c', '#d9cfbf', '#b5835a', '#f8f6f1'], seed: 4 } },
  { id: 'p02', slug: 'gach-zellige-atlas-7x15', name: 'Gạch Zellige Atlas', cat: 'gach-op-lat', rooms: ['phong-tam', 'nha-bep'],
    price: 1250000, unit: 'm²', boxM2: 0.5, sizes: ['7.5×15 cm', '10×10 cm'], finishes: ['Bóng men'],
    color: 'xanh', origin: 'Tây Ban Nha', badges: ['Mới'],
    tex: { t: 'tile', colors: ['#2f5d50', '#3a6b5d', '#264f44', '#41766a', '#305f53'], w: 50, h: 100, grout: '#e6e0d5', gloss: true, seed: 2 } },
  { id: 'p03', slug: 'gach-porcelain-calacatta-gold', name: 'Porcelain Calacatta Gold', cat: 'gach-op-lat', rooms: ['phong-khach', 'phong-tam'],
    price: 890000, unit: 'm²', boxM2: 2.56, sizes: ['80×160 cm', '120×240 cm'], finishes: ['Bóng kính', 'Mờ'],
    color: 'trang', origin: 'Ấn Độ', badges: [],
    tex: { t: 'marble', base: '#f6f3ee', vein: '#b9a27a', seed: 12 } },
  { id: 'p04', slug: 'gach-bong-hoi-an-20x20', name: 'Gạch bông Hội An', cat: 'gach-op-lat', rooms: ['nha-bep', 'phong-tam'],
    price: 520000, unit: 'm²', boxM2: 1, sizes: ['20×20 cm'], finishes: ['Mờ'],
    color: 'xanh', origin: 'Việt Nam', badges: ['Thủ công'],
    tex: { t: 'pattern', a: '#efe7d8', b: '#2f5d50', c: '#b5835a', seed: 1 } },
  // --- Đá
  { id: 'p05', slug: 'da-marble-statuario', name: 'Đá Marble Statuario', cat: 'da-tu-nhien', rooms: ['phong-khach', 'phong-tam'],
    price: 3200000, unit: 'm²', sizes: ['Slab 18mm', 'Slab 20mm'], finishes: ['Bóng', 'Honed'],
    color: 'trang', origin: 'Ý', badges: ['Cao cấp'],
    tex: { t: 'marble', base: '#f3f2ef', vein: '#6e6c6a', seed: 31 } },
  { id: 'p06', slug: 'da-quartz-nero-marquina', name: 'Quartz Nero Marquina', cat: 'da-tu-nhien', rooms: ['nha-bep'],
    price: 2650000, unit: 'm²', sizes: ['Slab 20mm'], finishes: ['Bóng'],
    color: 'den', origin: 'Tây Ban Nha', badges: [],
    tex: { t: 'marble', base: '#1f1f1f', vein: '#e9e6df', seed: 21 } },
  { id: 'p07', slug: 'da-granite-kim-sa', name: 'Granite Kim Sa Trung', cat: 'da-tu-nhien', rooms: ['nha-bep', 'ngoai-troi'],
    price: 1150000, unit: 'm²', sizes: ['Slab 18mm'], finishes: ['Bóng', 'Khò lửa'],
    color: 'den', origin: 'Ấn Độ', badges: [],
    tex: { t: 'terrazzo', base: '#1d1c1b', chips: ['#3a3836', '#c9a86a', '#55524e', '#8f7a50'], seed: 9, small: true } },
  { id: 'p08', slug: 'da-travertine-roma', name: 'Travertine Roma', cat: 'da-tu-nhien', rooms: ['ngoai-troi', 'phong-khach'],
    price: 1780000, unit: 'm²', sizes: ['60×120 cm', '40×80 cm'], finishes: ['Honed', 'Brushed'],
    color: 'be', origin: 'Thổ Nhĩ Kỳ', badges: ['Mới'],
    tex: { t: 'travertine', base: '#e4d4bb', dark: '#b89d79', seed: 13 } },
  // --- Sàn gỗ
  { id: 'p09', slug: 'san-go-soi-trang-chau-au', name: 'Sàn gỗ Sồi Trắng Châu Âu', cat: 'san-go', rooms: ['phong-khach'],
    price: 1150000, unit: 'm²', boxM2: 2.2, sizes: ['190×1900×14 mm'], finishes: ['Lau dầu', 'Sơn UV mờ'],
    color: 'be', origin: 'Đức', badges: ['Bán chạy'],
    tex: { t: 'wood', base: '#d9b98f', dark: '#a8835a', seed: 9 } },
  { id: 'p10', slug: 'san-go-oc-cho', name: 'Sàn gỗ kỹ thuật Óc Chó', cat: 'san-go', rooms: ['phong-khach'],
    price: 1680000, unit: 'm²', boxM2: 1.8, sizes: ['150×1200×15 mm'], finishes: ['Lau dầu'],
    color: 'nau', origin: 'Mỹ', badges: [],
    tex: { t: 'wood', base: '#6b4630', dark: '#3b2417', seed: 4 } },
  { id: 'p11', slug: 'san-spc-ash-grey', name: 'Sàn SPC hèm khóa Ash Grey', cat: 'san-go', rooms: ['phong-khach', 'nha-bep'],
    price: 345000, oldPrice: 395000, unit: 'm²', boxM2: 2.23, sizes: ['180×1220×5 mm'], finishes: ['Vân nổi'],
    color: 'xam', origin: 'Malaysia', badges: ['Ưu đãi'],
    tex: { t: 'wood', base: '#b4aca1', dark: '#7d756b', seed: 6 } },
  // --- Thiết bị vệ sinh
  { id: 'p12', slug: 'lavabo-dat-ban-oval', name: 'Lavabo đặt bàn Oval Matte', cat: 'thiet-bi-ve-sinh', rooms: ['phong-tam'],
    price: 2450000, unit: 'cái', sizes: ['560×360 mm'], finishes: ['Trắng mờ', 'Đen mờ'],
    color: 'trang', origin: 'Nhật Bản', badges: ['Mới'],
    tex: { t: 'illus', kind: 'basin', bg: '#e3e8e3' } },
  { id: 'p13', slug: 'bon-cau-mot-khoi-aqua', name: 'Bồn cầu một khối Aqua', cat: 'thiet-bi-ve-sinh', rooms: ['phong-tam'],
    price: 8900000, unit: 'bộ', sizes: ['Tâm xả 305 mm'], finishes: ['Trắng bóng'],
    color: 'trang', origin: 'Nhật Bản', badges: ['Bán chạy'],
    tex: { t: 'illus', kind: 'toilet', bg: '#ece6dd' } },
  { id: 'p14', slug: 'voi-lavabo-brushed-gold', name: 'Vòi lavabo nóng lạnh Brushed Gold', cat: 'thiet-bi-ve-sinh', rooms: ['phong-tam'],
    price: 3150000, unit: 'cái', sizes: ['Cổ cao 300 mm', 'Cổ thấp 160 mm'], finishes: ['Brushed Gold', 'Chrome', 'Đen mờ'],
    color: 'vang', origin: 'Đức', badges: [],
    tex: { t: 'illus', kind: 'faucet', bg: '#2f3b36' } },
  // --- Tấm ốp
  { id: 'p15', slug: 'lam-song-wpc-walnut', name: 'Lam sóng WPC Walnut', cat: 'tam-op', rooms: ['phong-khach'],
    price: 285000, unit: 'm', sizes: ['204×2900×24 mm'], finishes: ['Vân gỗ'],
    color: 'nau', origin: 'Việt Nam', badges: [],
    tex: { t: 'slats', base: '#7a5236', dark: '#3a2516', seed: 3 } },
  { id: 'p16', slug: 'tam-op-nano-van-da', name: 'Tấm ốp Nano vân đá Grigio', cat: 'tam-op', rooms: ['phong-khach', 'phong-tam'],
    price: 195000, unit: 'm²', sizes: ['1220×2440×8 mm'], finishes: ['Bóng gương'],
    color: 'xam', origin: 'Việt Nam', badges: ['Ưu đãi'], oldPrice: 230000,
    tex: { t: 'marble', base: '#cfcdc9', vein: '#5c5a57', seed: 44 } },
  // --- Hoàn thiện
  { id: 'p17', slug: 'microcement-tone-sand', name: 'Microcement Tone Sand', cat: 'hoan-thien', rooms: ['phong-tam', 'phong-khach'],
    price: 650000, unit: 'm²', sizes: ['Bộ 5 m²', 'Bộ 20 m²'], finishes: ['Mờ', 'Satin'],
    color: 'be', origin: 'Tây Ban Nha', badges: ['Mới'],
    tex: { t: 'concrete', base: '#d4c6b2', seed: 5 } },
  { id: 'p18', slug: 'son-hieu-ung-be-tong', name: 'Sơn hiệu ứng bê tông Loft', cat: 'hoan-thien', rooms: ['phong-khach'],
    price: 420000, unit: 'm²', sizes: ['Thùng 10 m²'], finishes: ['Mờ'],
    color: 'xam', origin: 'Ý', badges: [],
    tex: { t: 'concrete', base: '#a9a7a2', seed: 8 } }
];

window.COLORS = [
  { id: 'trang', name: 'Trắng', hex: '#f4f2ee' }, { id: 'be', name: 'Be / Kem', hex: '#dccbb0' },
  { id: 'xam', name: 'Xám', hex: '#9c9a95' }, { id: 'den', name: 'Đen', hex: '#222' },
  { id: 'nau', name: 'Nâu gỗ', hex: '#7a5236' }, { id: 'xanh', name: 'Xanh', hex: '#2f5d50' },
  { id: 'vang', name: 'Vàng đồng', hex: '#c6a15b' }
];

window.PROJECTS = [
  { id: 'villa-son-tra', name: 'Biệt thự ven biển Sơn Trà', type: 'Nhà ở', year: 2026, area: '420 m²',
    materials: 'Travertine Roma, Sồi Trắng, Microcement', tex: { t: 'travertine', base: '#e9dcc6', dark: '#bfa47f', seed: 22 } },
  { id: 'cafe-hoi-an', name: 'Chuỗi café phố cổ Hội An', type: 'F&B', year: 2025, area: '180 m²',
    materials: 'Gạch bông Hội An, Zellige Atlas', tex: { t: 'pattern', a: '#f0e6d3', b: '#a7765a', c: '#2f5d50', seed: 2 } },
  { id: 'apartment-han', name: 'Căn hộ ven sông Hàn', type: 'Căn hộ', year: 2025, area: '115 m²',
    materials: 'Calacatta Gold, Óc Chó, Lam sóng WPC', tex: { t: 'marble', base: '#f4f1ec', vein: '#a8916b', seed: 52 } },
  { id: 'resort-non-nuoc', name: 'Resort Non Nước – khu spa', type: 'Khách sạn', year: 2024, area: '960 m²',
    materials: 'Terrazzo Venezia, thiết bị vệ sinh Aqua', tex: { t: 'terrazzo', base: '#e0e6df', chips: ['#9fb3a6', '#5f7b6e', '#f4f4f0', '#c2ad91'], seed: 17 } },
  { id: 'office-hai-chau', name: 'Văn phòng công nghệ Hải Châu', type: 'Văn phòng', year: 2024, area: '650 m²',
    materials: 'SPC Ash Grey, sơn hiệu ứng Loft', tex: { t: 'concrete', base: '#b9b6b0', seed: 31 } },
  { id: 'showroom-ngu-hanh-son', name: 'Showroom nội thất Ngũ Hành Sơn', type: 'Thương mại', year: 2026, area: '300 m²',
    materials: 'Quartz Nero Marquina, Brushed Gold', tex: { t: 'marble', base: '#202020', vein: '#d9d3c7', seed: 63 } }
];

// TODO: xác nhận danh sách thương hiệu công ty thực sự phân phối
window.BRANDS = ['INAX', 'LIXIL', 'TOTO', 'Viglacera', 'Đồng Tâm', 'Kronotex', 'Grohe', 'Hafele'];
