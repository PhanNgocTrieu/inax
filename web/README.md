# GreenHabitat – Website & trang quản trị

Next.js 16 + Payload CMS 3 (trang quản trị chạy chung một app) · SQLite cho dev, PostgreSQL cho production.

## Chạy ở máy dev

```bash
pnpm install
cp .env.example .env      # rồi điền PAYLOAD_SECRET, SEED_ADMIN_PASSWORD
pnpm seed                 # nạp dữ liệu mẫu + tạo tài khoản quản trị
pnpm dev                  # http://localhost:3000  ·  quản trị: http://localhost:3000/admin
```

Tài khoản quản trị là `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` trong `.env`. Mã giảm giá mẫu: `GREEN5`.

Khi chưa điền khóa cổng thanh toán, VNPAY/MoMo/ZaloPay/thẻ sẽ chuyển sang **cổng mô phỏng** (`/thanh-toan/mo-phong`), nên vẫn test được trọn luồng. Trên production, cổng mô phỏng tự tắt (trừ khi đặt `PAYMENT_MOCK=1`).

## Cấu trúc

```
src/
├── app/(frontend)/            Website khách hàng
│   ├── page.tsx               Trang chủ
│   ├── san-pham/              Danh sách (lọc theo danh mục/không gian/tìm kiếm) + chi tiết [slug]
│   ├── gio-hang, thanh-toan/  Giỏ hàng, thanh toán, cổng mô phỏng
│   ├── dat-hang/[code]        Trang đơn hàng (cần ?t=token) – QR chuyển khoản, trạng thái
│   ├── tai-khoan, tra-cuu     Tra cứu đơn bằng mã đơn + SĐT
│   └── api/shop/              API bán hàng (xem bên dưới)
├── app/(payload)/             Trang quản trị /admin + REST/GraphQL /api/*
├── collections/               Sản phẩm, Danh mục, Dự án, Đơn hàng, Báo giá & Liên hệ, Mã giảm giá, Thư viện, Nhân viên
├── globals/Settings.ts        Cài đặt website: thông tin công ty, phí ship, COD, cọc, tài khoản nhận tiền
├── lib/shop.ts                Tính giá phía server, mã đơn, ghi nhận thanh toán (idempotent)
├── lib/payments/              vnpay.ts · momo.ts · zalopay.ts · vietqr.ts
├── lib/texture.ts             Ảnh vật liệu vẽ bằng SVG (dùng khi sản phẩm chưa có ảnh upload)
├── components/                UI (React)
└── seed/                      Dữ liệu mẫu
```

## API bán hàng – `/api/shop/*`

| Endpoint | Mô tả |
|---|---|
| `POST price` | Tính lại giỏ hàng: tạm tính, giảm giá, phí ship, tổng, tiền cọc. **Giá luôn lấy từ DB**, không tin giá từ trình duyệt |
| `POST checkout` | Kiểm tra form → tạo đơn → trả về `redirect` (cổng thanh toán, hoặc trang đơn hàng) |
| `POST request` | Báo giá / đặt mẫu / đặt lịch / liên hệ / bản tin → collection *Báo giá & Liên hệ* |
| `GET vnpay/return`, `GET vnpay/ipn` | VNPAY trả về + IPN (kiểm tra chữ ký HMAC-SHA512, số tiền) |
| `GET momo/return`, `POST momo/ipn` | MoMo (HMAC-SHA256) |
| `POST zalopay/callback` | ZaloPay (mac key2) |
| `POST bank-webhook` | Webhook biến động số dư SePay. Nội dung CK chứa mã đơn `GHyymmddxxxx` thì đơn tự chuyển sang "Đã thanh toán" |
| `POST mock-pay` | Cổng mô phỏng (chỉ dev) |

Trạng thái đơn: `pending_payment` → `paid` / `deposit_paid` (hoặc `pending_confirm` với COD) → `processing` → `shipping` → `completed`. Nhân viên đổi trạng thái trong /admin.

## Cấu hình thanh toán thật

1. **VNPAY:** đăng ký merchant, lấy `VNPAY_TMN_CODE`, `VNPAY_HASH_SECRET`. Khai báo IPN URL: `https://<domain>/api/shop/vnpay/ipn`. Production đổi `VNPAY_URL` sang `https://pay.vnpay.vn/vpcpay.html`.
2. **MoMo:** `MOMO_PARTNER_CODE`, `MOMO_ACCESS_KEY`, `MOMO_SECRET_KEY`. Production: `MOMO_ENDPOINT=https://payment.momo.vn/v2/gateway/api/create`.
3. **ZaloPay:** `ZALOPAY_APP_ID`, `ZALOPAY_KEY1`, `ZALOPAY_KEY2`. Production: `ZALOPAY_ENDPOINT=https://openapi.zalopay.vn/v2/create`.
4. **Chuyển khoản VietQR:** nhập *Mã ngân hàng / Số tài khoản / Chủ tài khoản* trong **/admin → Cài đặt website → Tài khoản nhận tiền**.
5. **Tự xác nhận chuyển khoản (SePay):** tạo webhook trỏ về `https://<domain>/api/shop/bank-webhook`, kiểu xác thực API Key, rồi đặt cùng key vào `SEPAY_API_KEY`.
6. Đặt `NEXT_PUBLIC_SITE_URL=https://<domain>` để URL trả về và IPN đúng.

## Triển khai (Docker)

Image dùng Next.js `standalone`. **Toàn bộ dữ liệu bền (SQLite + ảnh upload) nằm trong `/data`: bắt buộc gắn volume vào `/data`**, nếu không mỗi lần deploy sẽ mất dữ liệu.

```bash
cp .env.example .env.production     # điền PAYLOAD_SECRET, SEED_ADMIN_*, ...
docker compose up -d --build        # http://localhost:3000
```

Khi khởi động, app tự chạy migration trong `src/migrations`. Nếu đặt `SEED_ON_INIT=1` và DB còn trống, app tự nạp dữ liệu mẫu và tạo admin từ `SEED_ADMIN_*`.

**Railway / Render / Fly.io:** deploy thư mục `web/` bằng Dockerfile, gắn volume vào `/data` rồi đặt biến môi trường:

| Biến | Bản demo |
|---|---|
| `PAYLOAD_SECRET` | chuỗi ngẫu nhiên dài (`openssl rand -hex 32`) |
| `NEXT_PUBLIC_SITE_URL` | `https://<domain>` (cần có lúc **build**) |
| `SEED_ON_INIT` | `1` |
| `SEED_ADMIN_EMAIL`, `SEED_ADMIN_PASSWORD` | tài khoản admin (mật khẩu mạnh) |
| `PAYMENT_MOCK` | `1`: dùng cổng thanh toán mô phỏng |
| `SITE_NOINDEX` | `1`: chặn Google (cần có lúc **build**) |

**Khi đổi collection/field:** chạy `pnpm payload migrate:create <tên>` và commit file trong `src/migrations`. Production không tự đồng bộ schema như dev.

Khi lên production thật:
- **Database:** chuyển sang `@payloadcms/db-postgres` (đổi adapter trong `src/payload.config.ts`, tạo lại migration).
- **Ảnh upload:** dùng `@payloadcms/storage-s3` (S3 / Cloudflare R2) nếu chạy nhiều instance.
- **Email:** thêm email adapter (Resend/SMTP) để gửi xác nhận đơn và quên mật khẩu.

## Kiểm thử

```bash
pnpm exec vitest run --config ./vitest.config.mts tests/int/payments.int.spec.ts   # chữ ký VNPAY / MoMo / ZaloPay
```
