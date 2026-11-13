# GreenHabitat – Đặc tả UI/UX & tính năng

**Khách hàng:** CÔNG TY TNHH THƯƠNG MẠI TNT THỊNH PHÁT – GREENHABITAT
**Địa chỉ:** 267 Thái Văn Lung, Hòa Xuân, Đà Nẵng
**Lĩnh vực:** Vật liệu xây dựng & trang trí nội thất
**Trạng thái:** Giai đoạn 1 – UI/UX đã duyệt (prototype ở thư mục gốc) · Giai đoạn 2 – website thật + trang quản trị + thanh toán đã dựng xong, ở thư mục `web/` (xem `web/README.md`)

---

## 1. Định vị & định hướng thiết kế

| | |
|---|---|
| Định vị | Nhà cung cấp vật liệu **tuyển chọn, chính hãng**, tư vấn chuyên sâu, phục vụ cả chủ nhà (B2C) lẫn nhà thầu / kiến trúc sư (B2B) |
| Phong cách | Kiểu tạp chí kiến trúc (editorial), nhiều khoảng trống, hình vật liệu là nhân vật chính – tham khảo cách trình bày của các thương hiệu vật liệu châu Âu |
| Màu sắc | Nền giấy ấm `#F6F3EE` · Xanh rừng `#1D3A30` (màu thương hiệu, gợi chữ "Green") · Đất nung `#A8714A` (điểm nhấn) · Cát `#ECE6DC` |
| Chữ | **Fraunces** (tiêu đề, serif sang trọng) + **Be Vietnam Pro** (nội dung, hiển thị tiếng Việt chuẩn) |
| Nguyên tắc | Hình ảnh vật liệu khổ lớn · Mỗi trang có một nút hành động chính rõ ràng · Luôn có cách "Nhận báo giá" song song với "Mua ngay" · Ưu tiên mobile (đa số khách VN xem trên điện thoại) |

> Hình ảnh hiện tại là **bề mặt vật liệu vẽ bằng code** (đá, gỗ, terrazzo, zellige…) để làm placeholder. Khi có ảnh chụp sản phẩm / công trình thật, chỉ cần thay bằng URL ảnh.

---

## 2. Sitemap

```
Trang chủ  /
├── Sản phẩm  /san-pham
│   ├── Theo danh mục  ?cat=gach-op-lat | da-tu-nhien | san-go | thiet-bi-ve-sinh | tam-op | hoan-thien
│   ├── Theo không gian  ?room=phong-tam | nha-bep | phong-khach | ngoai-troi
│   ├── Tìm kiếm  ?q=...
│   └── Chi tiết sản phẩm  /san-pham/{slug}
├── Dự án  /du-an  (+ trang chi tiết dự án – giai đoạn 2)
├── Về chúng tôi  /gioi-thieu
├── Liên hệ / Showroom  /lien-he
├── Giỏ hàng  /gio-hang
├── Thanh toán  /thanh-toan
├── Đặt hàng thành công  /dat-hang-thanh-cong
├── Tài khoản  /tai-khoan  (đăng nhập, đăng ký, đơn hàng, yêu thích)
├── Chính sách  /chinh-sach  (vận chuyển, đổi trả, bảo hành, thanh toán, bảo mật)
└── (Giai đoạn 2) Cảm hứng / Blog, Tải catalogue, Tuyển dụng
```

---

## 3. Thành phần dùng chung

- **Topbar:** địa chỉ, giờ mở cửa, link cho nhà thầu, hotline (bấm để gọi).
- **Header dính khi cuộn:** logo · menu chính · tìm kiếm · tài khoản · giỏ hàng (có số lượng) · nút "Nhận báo giá".
- **Mega menu "Sản phẩm":** 6 danh mục kèm ảnh thu nhỏ + banner bộ sưu tập.
- **Menu mobile:** ngăn kéo bên trái.
- **Tìm kiếm toàn màn hình:** gợi ý từ khóa hay tìm, kết quả hiện ngay khi gõ.
- **Ngăn kéo giỏ hàng:** sửa số lượng, xóa, thanh tiến độ "mua thêm X để được miễn phí giao hàng".
- **Popup báo giá / đặt mẫu / đặt lịch tham quan:** dùng chung một khung, đổi nội dung theo tình huống.
- **Nút nổi:** Zalo + Gọi điện (thói quen của khách Việt).
- **Footer:** đăng ký bản tin, danh mục, chính sách, thông tin pháp lý (tên công ty, MST), các phương thức thanh toán.

---

## 4. Chi tiết từng trang

### 4.1 Trang chủ
1. **Hero:** tiêu đề định vị + 2 nút (Khám phá sản phẩm / Nhận báo giá công trình) + số liệu nổi bật + bảng phối vật liệu.
2. **Thanh cam kết:** chính hãng · giao 24h · đặt mẫu miễn phí · tư vấn thiết kế.
3. **Danh mục:** lưới 6 ô kiểu tạp chí (2 ô lớn + 4 ô nhỏ).
4. **Mua theo không gian:** phòng tắm, bếp, phòng khách, ngoài trời.
5. **Sản phẩm nổi bật:** các tab Bán chạy / Mới về / Ưu đãi.
6. **Bộ sưu tập:** khối ảnh lớn + câu chuyện + mẫu màu.
7. **Quy trình 4 bước:** Tư vấn → Đặt mẫu → Báo giá → Giao hàng & thi công.
8. **Dự án tiêu biểu.**
9. **Thương hiệu phân phối.**
10. **Showroom:** địa chỉ, giờ mở cửa, Google Maps nhúng, nút chỉ đường / đặt lịch tham quan.

### 4.2 Danh sách sản phẩm
- Banner theo danh mục, breadcrumb, các nút chọn nhanh danh mục.
- **Bộ lọc:** không gian · màu sắc (ô màu) · khoảng giá · bề mặt · xuất xứ (giai đoạn 2 thêm: kích thước, thương hiệu, độ dày, chống trơn).
- Thẻ các bộ lọc đang áp dụng (bấm để bỏ), nút xóa hết.
- Sắp xếp: nổi bật, giá tăng/giảm, tên.
- Trên mobile, bộ lọc nằm trong ngăn kéo.
- **Thẻ sản phẩm:** đổi sang ảnh cận cảnh khi rê chuột, nhãn (Mới / Bán chạy / -%), yêu thích, thêm nhanh vào giỏ, đặt mẫu.

### 4.3 Chi tiết sản phẩm – trang quan trọng nhất
- Bộ ảnh: bề mặt / chi tiết / cận cảnh / phối cảnh, bấm để phóng to. (Giai đoạn 2: ảnh 360°, xem trước trong phòng mẫu.)
- Tên, mã, xuất xứ, **tồn kho tại kho Đà Nẵng**, giá theo đơn vị (m² / cái / bộ / m), giá gốc nếu đang giảm.
- Chọn **kích thước** và **bề mặt / màu** (mỗi lựa chọn là một biến thể có mã, giá, tồn kho riêng).
- **Máy tính diện tích** (gạch, sàn): nhập m² + mức hao hụt → ra số hộp, tổng m², tạm tính và tự điền số lượng. Đây là tính năng các trang vật liệu lớn đều có.
- Thêm vào giỏ · **Đặt mẫu miễn phí** · **Báo giá số lượng lớn**.
- Cam kết: giao hàng, bảo hành, đổi trả.
- Các mục mở/đóng: mô tả, thông số kỹ thuật, hướng dẫn thi công, **tài liệu tải về** (catalogue PDF, CAD/texture 3D, CO/CQ).
- Sản phẩm liên quan.

### 4.4 Giỏ hàng & thanh toán
**Giỏ hàng:** danh sách sản phẩm, thanh miễn phí giao hàng, mã giảm giá, tóm tắt đơn, nút "Gửi giỏ hàng để nhận báo giá" (cho khách B2B muốn thương lượng).

**Thanh toán:** một trang, chia 3 khối, khung tóm tắt đơn luôn hiển thị:
1. **Thông tin người nhận:** họ tên, SĐT (kiểm tra định dạng VN), email, tỉnh/thành, phường/xã, địa chỉ, ghi chú giao hàng, **xuất hóa đơn VAT** (tên công ty, MST, địa chỉ).
2. **Giao hàng:** nội thành Đà Nẵng (miễn phí từ 5 triệu) · tỉnh/thành khác · nhận tại showroom.
3. **Thanh toán:**

| Phương thức | Cách hoạt động |
|---|---|
| VNPAY | Chuyển sang cổng VNPAY (ATM nội địa, QR, Internet Banking) → quay về trang kết quả + nhận thông báo IPN |
| Ví MoMo | Gọi API MoMo (mở ứng dụng / quét QR) + IPN |
| ZaloPay | Gọi API ZaloPay + callback |
| Thẻ quốc tế | Qua VNPAY / OnePay / Stripe (3-D Secure), website **không lưu số thẻ** |
| Chuyển khoản VietQR | Tạo mã QR có sẵn số tiền + nội dung = mã đơn; tự xác nhận khi nhận tiền qua webhook ngân hàng (SePay / Casso) |
| Đặt cọc 30% | Cho đơn công trình: thanh toán cọc online, phần còn lại khi giao hàng |
| COD | Thanh toán khi nhận hàng, chỉ áp dụng cho đơn dưới 20 triệu |

**Trang đặt hàng thành công:** mã đơn, QR chuyển khoản (nếu có), tóm tắt đơn, tiến trình đơn hàng (Đã đặt → Đã thanh toán → Đang giao → Hoàn tất), xác nhận gửi qua SMS / Zalo ZNS / email.

### 4.5 Các trang khác
- **Dự án:** lọc theo loại công trình (nhà ở, F&B, khách sạn, văn phòng…), mỗi dự án ghi rõ vật liệu đã dùng → link về sản phẩm.
- **Về chúng tôi:** câu chuyện, số liệu, giá trị cốt lõi.
- **Liên hệ:** thông tin, bản đồ, form liên hệ có phân loại yêu cầu.
- **Tài khoản:** đăng nhập (mật khẩu hoặc OTP), đăng ký với loại tài khoản (cá nhân / nhà thầu / đại lý).

---

## 5. Tính năng backend (giai đoạn 2)

### 5.1 Trang quản trị
- **Sản phẩm:** danh mục, sản phẩm, biến thể (kích thước × bề mặt), giá, giá khuyến mãi, tồn kho, m²/hộp, thông số, ảnh, tài liệu, SEO. Nhập/xuất Excel hàng loạt.
- **Đơn hàng:** danh sách, trạng thái, in phiếu giao, xuất hóa đơn điện tử, hoàn tiền.
- **Yêu cầu báo giá / đặt mẫu / đặt lịch:** một hộp thư chung (CRM mini), giao cho nhân viên, ghi chú, chuyển báo giá thành đơn hàng.
- **Khách hàng & bảng giá:** giá lẻ, giá nhà thầu, giá đại lý (chiết khấu theo nhóm khách).
- **Nội dung:** trang chủ, banner, dự án, bài viết, chính sách.
- **Khuyến mãi:** mã giảm giá (theo %, số tiền, danh mục, ngày hết hạn).
- **Vận chuyển:** khu vực, phí, ngưỡng miễn phí.
- **Báo cáo:** doanh thu, sản phẩm bán chạy, tỷ lệ chuyển báo giá thành đơn.
- **Phân quyền:** quản trị viên, bán hàng, kho, biên tập nội dung.

### 5.2 Mô hình dữ liệu (tóm tắt)
```
Category(id, name, slug, parent_id, image, order)
Product(id, name, slug, category_id, description, origin, brand, unit, specs JSON, rooms[], colors[], badges[], seo)
Variant(id, product_id, sku, size, finish, price, sale_price, stock, box_m2, weight)
Media(id, product_id|project_id, url, alt, type: image|pdf|cad)
Project(id, name, slug, type, year, area, location, gallery[], products[])
Customer(id, name, phone, email, type: retail|contractor|dealer, price_tier, addresses[])
Order(id, code, customer_id, status, subtotal, discount, shipping_fee, total, ship_method, address, vat_info, note)
OrderItem(order_id, variant_id, qty, unit_price)
Payment(id, order_id, method, amount, status, gateway_txn_id, raw_payload, paid_at)
QuoteRequest(id, type: quote|sample|visit, name, phone, products, area, note, status, assignee)
Coupon(code, type, value, conditions, expires_at)
ShippingZone(id, provinces[], fee, free_threshold)
```

### 5.3 Đề xuất công nghệ
- **Front-end:** Next.js (React) – render phía server để tốt cho SEO, tối ưu ảnh tự động. Giữ nguyên giao diện của prototype này.
- **CMS / Quản trị:** Payload CMS (chạy chung với Next.js) hoặc Strapi.
- **Cơ sở dữ liệu:** PostgreSQL.
- **Ảnh:** Cloudflare R2 / S3 + CDN.
- **Thanh toán:** VNPAY, MoMo, ZaloPay SDK · VietQR + SePay/Casso để tự xác nhận chuyển khoản.
- **Thông báo:** Zalo ZNS, SMS brandname, email (Resend / SES).
- **Hosting:** VPS hoặc cloud đặt tại Việt Nam / Singapore cho tốc độ; Cloudflare phía trước.
- **Đo lường:** GA4, Meta Pixel, Zalo Pixel, Google Search Console.

### 5.4 SEO & pháp lý
- URL tiếng Việt không dấu, schema `Product` / `LocalBusiness` / `BreadcrumbList`, sitemap.xml, Google Business Profile (hiện **chưa có số điện thoại, giờ mở cửa, website** trên Google Maps).
- **Bắt buộc:** website bán hàng phải **thông báo với Bộ Công Thương** (online.gov.vn) và gắn logo "Đã thông báo"; có đủ chính sách đổi trả, bảo mật, thanh toán, vận chuyển; footer ghi tên công ty, MST, địa chỉ.
- Cổng thanh toán (VNPAY/MoMo/ZaloPay) yêu cầu hồ sơ doanh nghiệp + website đã có chính sách – nên nộp hồ sơ sớm vì mất 1–3 tuần.

---

## 6. Lộ trình đề xuất

| Giai đoạn | Nội dung |
|---|---|
| 1 ✅ | Duyệt UI/UX trên prototype · chốt sitemap, màu sắc, chữ |
| 2 ✅ (code) | Dựng Next.js + Payload CMS, API bán hàng, tích hợp VNPAY/MoMo/ZaloPay/VietQR/SePay (đang chạy chế độ mô phỏng) · còn lại: ảnh & dữ liệu thật |
| 3 | Tích hợp thanh toán (sandbox → chạy thật), vận chuyển, thông báo ZNS/email |
| 4 | SEO, đo lường, thông báo Bộ Công Thương, kiểm thử, ra mắt |
| 5 | Tài khoản nhà thầu + bảng giá riêng, blog, xem trước vật liệu trong phòng mẫu |

---

## 7. Cần doanh nghiệp cung cấp / xác nhận
- [ ] Logo chính thức (prototype đang dùng logo tạm hình lá)
- [ ] Hotline, Zalo OA, email, tên miền, mã số thuế
- [ ] Giờ mở cửa thật
- [ ] **Danh sách thương hiệu đang phân phối** (prototype đang ghi tạm INAX, LIXIL, TOTO… – chưa xác nhận)
- [ ] Danh mục & dữ liệu sản phẩm thật (file Excel), ảnh sản phẩm
- [ ] Ảnh showroom, các dự án đã làm
- [ ] Chính sách vận chuyển, đổi trả, bảo hành, ngưỡng miễn phí giao hàng, giới hạn COD
- [ ] Tài khoản ngân hàng nhận chuyển khoản
- [ ] Số liệu thật (số mẫu, số công trình…) – các con số trên prototype là ví dụ
- [ ] Website tham khảo mà anh/chị thích (nếu có)

---

## 8. Chạy prototype
Mở `index.html` qua một web server tĩnh bất kỳ, ví dụ:
```bash
cd inax && python3 -m http.server 8000
```
rồi vào http://localhost:8000. Thử mã giảm giá `GREEN5`. Giỏ hàng lưu trong trình duyệt (localStorage); thanh toán là **mô phỏng**, không có giao dịch thật.
