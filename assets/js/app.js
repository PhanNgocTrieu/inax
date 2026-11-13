/* =========================================================
   GreenHabitat – Front-end prototype (vanilla JS, hash router)
   ========================================================= */
(function () {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const app = $('#app');
  const S = window.SITE, CATS = window.CATEGORIES, PRODUCTS = window.PRODUCTS;

  /* ---------- helpers ---------- */
  const fmt = n => new Intl.NumberFormat('vi-VN').format(Math.round(n)) + '₫';
  const num = n => new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 2 }).format(n);
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const cat = id => CATS.find(c => c.id === id);
  const prod = id => PRODUCTS.find(p => p.id === id);
  const ic = (id, cls = 'ic') => `<svg class="${cls}"><use href="#i-${id}"/></svg>`;
  const bg = spec => `style="background-image:${tex(spec)}"`;
  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* ignore */ } }
  };
  let toastTimer;
  window.toast = function (msg) {
    const t = $('#toast'); t.innerHTML = ic('check') + esc(msg); t.classList.add('is-on');
    clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove('is-on'), 2600);
  };

  /* ---------- state ---------- */
  let cart = store.get('gh_cart', []);
  let favs = store.get('gh_favs', []);
  const FREE_SHIP = 5000000;
  const saveCart = () => { store.set('gh_cart', cart); updateCartCount(); };
  const lineTotal = l => prod(l.id).price * l.qty;
  const subtotal = () => cart.reduce((s, l) => s + lineTotal(l), 0);

  function addToCart(id, opts = {}) {
    const p = prod(id);
    const size = opts.size || p.sizes[0], finish = opts.finish || p.finishes[0];
    const qty = opts.qty || (p.boxM2 || 1);
    const key = `${id}|${size}|${finish}`;
    const ex = cart.find(l => l.key === key);
    if (ex) ex.qty = +(ex.qty + qty).toFixed(2); else cart.push({ key, id, size, finish, qty: +qty.toFixed(2) });
    saveCart();
    const c = $('#cartCount'); c.classList.add('bump'); setTimeout(() => c.classList.remove('bump'), 300);
    openCart();
  }
  function updateCartCount() {
    const c = $('#cartCount'); c.textContent = cart.length; c.dataset.n = cart.length;
    if ($('#cartDrawer').classList.contains('is-open')) renderCartDrawer();
  }

  /* ---------- shared fragments ---------- */
  function card(p) {
    const c = cat(p.cat), fav = favs.includes(p.id);
    const badges = p.badges.map(b => `<span class="badge ${b === 'Ưu đãi' ? 'badge--sale' : b === 'Mới' ? 'badge--new' : ''}">${b}</span>`).join('')
      + (p.oldPrice ? `<span class="badge badge--sale">-${Math.round((1 - p.price / p.oldPrice) * 100)}%</span>` : '');
    return `<article class="p-card reveal">
      <div class="p-card__media">
        <a href="#/san-pham/${p.slug}" aria-label="${esc(p.name)}">
          <div class="p-card__img" ${bg(p.tex)}></div><div class="p-card__img p-card__img--alt" ${bg(p.tex)}></div>
        </a>
        <div class="p-card__badges">${badges}</div>
        <button class="p-card__fav ${fav ? 'is-on' : ''}" data-fav="${p.id}" aria-label="Yêu thích">${ic('heart', '')}</button>
        <div class="p-card__quick">
          <button class="btn btn--primary" data-add="${p.id}">${ic('bag')} Thêm vào giỏ</button>
          <button class="btn btn--light" data-sample="${p.id}" title="Đặt mẫu">${ic('swatch')}</button>
        </div>
      </div>
      <div class="p-card__body">
        <div class="p-card__cat">${c.name}</div>
        <h3 class="p-card__name"><a href="#/san-pham/${p.slug}">${esc(p.name)}</a></h3>
        <div class="p-card__meta"><div class="price">${fmt(p.price)}<small>/${p.unit}</small>${p.oldPrice ? `<s>${fmt(p.oldPrice)}</s>` : ''}</div></div>
        <div class="p-card__sizes">${p.sizes.join(' · ')}</div>
      </div>
    </article>`;
  }
  const crumbs = items => `<nav class="crumbs" aria-label="Breadcrumb"><a href="#/">Trang chủ</a>${items.map(([t, h]) => h ? `<span><a href="${h}">${t}</a></span>` : `<span>${t}</span>`).join('')}</nav>`;

  /* =========================================================
     PAGES
     ========================================================= */
  function pageHome() {
    const p = id => prod(id);
    return `
    <section class="hero">
      <div class="container hero__grid">
        <div class="reveal">
          <p class="eyebrow">Vật liệu xây dựng & Trang trí nội thất · Đà Nẵng</p>
          <h1 class="display h1">Vật liệu tinh tuyển cho <em class="accent">không gian sống</em> bền vững.</h1>
          <p class="lead">Gạch ốp lát, đá tự nhiên, sàn gỗ, thiết bị vệ sinh và vật liệu hoàn thiện – chính hãng, tư vấn tận nơi, giao nhanh khắp miền Trung.</p>
          <div class="hero__ctas">
            <a href="#/san-pham" class="btn btn--primary">Khám phá sản phẩm ${ic('arrow')}</a>
            <button class="btn btn--outline" data-quote>Nhận báo giá công trình</button>
          </div>
          <div class="hero__stats">
            <div><b>2.000+</b><span>Mẫu vật liệu</span></div>
            <div><b>350+</b><span>Công trình hoàn thiện</span></div>
            <div><b>24h</b><span>Giao hàng nội thành</span></div>
          </div>
        </div>
        <div class="moodboard reveal" aria-hidden="true">
          <div class="mb mb--1" ${bg(p('p03').tex)}><small>Calacatta Gold</small></div>
          <div class="mb mb--2" ${bg(p('p09').tex)}><small>Sồi Trắng</small></div>
          <div class="mb mb--3" ${bg(p('p02').tex)}><small>Zellige</small></div>
          <div class="mb mb--4" ${bg(p('p01').tex)}><small>Terrazzo</small></div>
          <div class="mb mb--5" ${bg(p('p17').tex)}></div>
          <div class="hero__tag"><span class="dot" ${bg(p('p08').tex)}></span><div><b>Bộ sưu tập Terra 2026</b>Tông đất · Bề mặt tự nhiên</div></div>
        </div>
      </div>
    </section>

    <section class="trust">
      <div class="container trust__grid">
        <div class="trust__item">${ic('shield')}<div><b>100% chính hãng</b><span>Đầy đủ CO/CQ, hóa đơn VAT</span></div></div>
        <div class="trust__item">${ic('truck')}<div><b>Giao nhanh 24h</b><span>Miễn phí nội thành từ 5 triệu</span></div></div>
        <div class="trust__item">${ic('swatch')}<div><b>Đặt mẫu miễn phí</b><span>Xem vật liệu thật trước khi mua</span></div></div>
        <div class="trust__item">${ic('pencil')}<div><b>Tư vấn thiết kế</b><span>Phối vật liệu cùng kiến trúc sư</span></div></div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="section__head reveal">
          <div><p class="eyebrow">Danh mục sản phẩm</p><h2 class="display h2">Mọi lớp hoàn thiện cho ngôi nhà của bạn</h2></div>
          <a href="#/san-pham" class="link">Xem tất cả sản phẩm ${ic('arrow')}</a>
        </div>
        <div class="cat-grid">
          ${CATS.map(c => `<a href="#/san-pham?cat=${c.id}" class="cat-card reveal">
            <div class="bg" ${bg(c.tex)}></div>
            <span class="count">${PRODUCTS.filter(p => p.cat === c.id).length * 40}+ mẫu</span>
            <div class="cat-card__body"><div><h3>${c.name}</h3><p>${c.short}</p></div><span class="arrow">${ic('arrow')}</span></div>
          </a>`).join('')}
        </div>
      </div>
    </section>

    <section class="section section--white">
      <div class="container">
        <div class="section__head reveal">
          <div><p class="eyebrow">Mua theo không gian</p><h2 class="display h2">Bắt đầu từ căn phòng bạn đang hình dung</h2></div>
        </div>
        <div class="rooms">
          ${ROOMS.map(r => `<a class="room reveal" href="#/san-pham?room=${r.id}"><div class="room__img" ${bg(r.tex)}></div><h3>${r.name} ${ic('arrow')}</h3><p>${r.desc}</p></a>`).join('')}
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="section__head reveal">
          <div><p class="eyebrow">Sản phẩm nổi bật</p><h2 class="display h2">Được khách hàng & kiến trúc sư tin chọn</h2></div>
          <div class="tabs" id="homeTabs"><button class="is-active" data-tab="Bán chạy">Bán chạy</button><button data-tab="Mới">Mới về</button><button data-tab="Ưu đãi">Ưu đãi</button></div>
        </div>
        <div class="p-grid" id="homeProducts"></div>
      </div>
    </section>

    <section class="editorial">
      <div class="editorial__img reveal" ${bg(prod('p08').tex)}><div class="chip"><b>Travertine Roma</b> · Honed · 60×120 cm</div></div>
      <div class="editorial__body">
        <p class="eyebrow eyebrow--light">Bộ sưu tập 2026</p>
        <h2 class="display h2">Terra – vẻ đẹp mộc của đất, đá và gỗ.</h2>
        <p>Bảng vật liệu tông ấm lấy cảm hứng từ bờ biển miền Trung: travertine rỗ tự nhiên, gỗ sồi lau dầu, microcement màu cát và gạch zellige tráng men thủ công.</p>
        <div class="swatches">${['p08', 'p09', 'p17', 'p02', 'p01'].map(id => `<span ${bg(prod(id).tex)} title="${prod(id).name}"></span>`).join('')}</div>
        <div><a href="#/san-pham" class="btn btn--light">Xem bộ sưu tập ${ic('arrow')}</a></div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="section__head reveal">
          <div><p class="eyebrow">Quy trình làm việc</p><h2 class="display h2">Từ ý tưởng đến công trình hoàn thiện</h2></div>
          <button class="btn btn--primary" data-quote>Bắt đầu với một báo giá ${ic('arrow')}</button>
        </div>
        <div class="steps">
          <div class="step reveal">${ic('chat')}<h3>Tư vấn</h3><p>Chuyên viên lắng nghe nhu cầu, phong cách và ngân sách của bạn – tại showroom hoặc tại công trình.</p></div>
          <div class="step reveal">${ic('swatch')}<h3>Đặt mẫu</h3><p>Nhận mẫu vật liệu thật miễn phí để so màu, so bề mặt trong ánh sáng thực tế.</p></div>
          <div class="step reveal">${ic('ruler')}<h3>Bóc tách & báo giá</h3><p>Đo đạc, tính khối lượng và hao hụt, báo giá chi tiết trong 24 giờ.</p></div>
          <div class="step reveal">${ic('truck')}<h3>Giao hàng & thi công</h3><p>Giao đúng tiến độ, hỗ trợ đội thi công và bảo hành chính hãng.</p></div>
        </div>
      </div>
    </section>

    <section class="section section--sand">
      <div class="container">
        <div class="section__head reveal">
          <div><p class="eyebrow">Dự án tiêu biểu</p><h2 class="display h2">Vật liệu của chúng tôi trong những công trình thật</h2></div>
          <a href="#/du-an" class="link">Tất cả dự án ${ic('arrow')}</a>
        </div>
        <div class="proj-grid">${PROJECTS.slice(0, 3).map(projCard).join('')}</div>
      </div>
    </section>

    <section class="section--tight section--white">
      <div class="container">
        <p class="eyebrow reveal" style="text-align:center;margin-bottom:28px">Thương hiệu phân phối</p>
        <div class="brands reveal">${BRANDS.map(b => `<span>${b}</span>`).join('')}</div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="showroom reveal">
          <div class="showroom__body">
            <p class="eyebrow">Showroom</p>
            <h2 class="display h2">Ghé thăm không gian trưng bày tại Đà Nẵng</h2>
            <p class="muted">Trải nghiệm trực tiếp hàng trăm mẫu vật liệu được dàn dựng theo từng không gian thực tế.</p>
            <ul class="info-list">
              <li>${ic('pin')}<div><b>Địa chỉ</b><span>${S.address}</span></div></li>
              <li>${ic('clock')}<div><b>Giờ mở cửa</b><span>${S.hours}</span></div></li>
              <li>${ic('phone')}<div><b>Hotline</b><span>${S.hotline}</span></div></li>
            </ul>
            <div class="hero__ctas" style="margin-top:0">
              <a class="btn btn--primary" href="${S.mapLink}" target="_blank" rel="noopener">Chỉ đường ${ic('arrow')}</a>
              <button class="btn btn--outline" data-quote="visit">Đặt lịch tham quan</button>
            </div>
          </div>
          <iframe class="map" title="Bản đồ showroom GreenHabitat" src="${S.mapEmbed}" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
        </div>
      </div>
    </section>`;
  }
  function mountHome() {
    const grid = $('#homeProducts');
    const show = tag => { grid.innerHTML = PRODUCTS.filter(p => p.badges.includes(tag) || (tag === 'Ưu đãi' && p.oldPrice)).slice(0, 4).map(card).join(''); reveal(); };
    show('Bán chạy');
    $('#homeTabs').addEventListener('click', e => {
      const b = e.target.closest('button'); if (!b) return;
      $$('#homeTabs button').forEach(x => x.classList.toggle('is-active', x === b)); show(b.dataset.tab);
    });
  }

  function projCard(pr) {
    return `<a class="proj reveal" href="#/du-an"><div class="proj__img" ${bg(pr.tex)}><span class="badge">${pr.type}</span></div>
      <h3>${pr.name}</h3><p>${pr.materials}</p><div class="proj__meta"><span>${pr.year}</span><span>${pr.area}</span></div></a>`;
  }

  /* ---------- Catalog ---------- */
  const PRICE_RANGES = [
    { id: 'p1', name: 'Dưới 500.000₫', test: p => p.price < 500000 },
    { id: 'p2', name: '500.000₫ – 1.000.000₫', test: p => p.price >= 500000 && p.price < 1000000 },
    { id: 'p3', name: '1.000.000₫ – 2.000.000₫', test: p => p.price >= 1000000 && p.price < 2000000 },
    { id: 'p4', name: 'Trên 2.000.000₫', test: p => p.price >= 2000000 }
  ];
  let F = {};
  function pageCatalog(q) {
    const c = q.cat && cat(q.cat), room = q.room && ROOMS.find(r => r.id === q.room);
    F = { cat: q.cat || '', room: q.room || '', q: q.q || '', colors: [], prices: [], finishes: [], origins: [], sort: 'featured' };
    const title = c ? c.name : room ? room.name : q.q ? `Kết quả cho “${esc(q.q)}”` : 'Tất cả sản phẩm';
    const sub = c ? c.short : room ? room.desc : 'Hơn 2.000 mẫu vật liệu chính hãng cho nhà ở và công trình.';
    const texSpec = c ? c.tex : room ? room.tex : CATS[1].tex;
    const finishes = [...new Set(PRODUCTS.flatMap(p => p.finishes))];
    const origins = [...new Set(PRODUCTS.map(p => p.origin))];
    const group = (title, body, closed) => `<div class="f-group ${closed ? 'is-closed' : ''}"><button>${title} ${ic('chev')}</button><div class="f-body">${body}</div></div>`;
    return `
    <section class="page-banner"><div class="bg" ${bg(texSpec)}></div>
      <div class="container">${crumbs(c || room ? [['Sản phẩm', '#/san-pham'], [title]] : [['Sản phẩm']])}
        <h1 class="display h1" style="margin:18px 0 12px">${title}</h1><p class="lead">${sub}</p></div>
    </section>
    <div class="container">
      <div class="cat-chips" style="padding-top:24px">
        <a href="#/san-pham" class="chip-btn chip-btn--plain ${!c && !room ? 'is-active' : ''}">Tất cả</a>
        ${CATS.map(x => `<a href="#/san-pham?cat=${x.id}" class="chip-btn ${c && c.id === x.id ? 'is-active' : ''}"><span class="t" ${bg(x.tex)}></span>${x.name}</a>`).join('')}
      </div>
      <div class="catalog">
        <aside class="filters" id="filters">
          <div class="filters__head"><h3>Bộ lọc</h3><button class="icon-btn" data-close aria-label="Đóng">${ic('close', '')}</button></div>
          ${group('Không gian', ROOMS.map(r => `<label class="check"><input type="radio" name="room" value="${r.id}" ${F.room === r.id ? 'checked' : ''}>${r.name}</label>`).join(''))}
          ${group('Màu sắc', `<div class="color-dots">${COLORS.map(x => `<button class="color-dot" data-color="${x.id}" title="${x.name}" style="background:${x.hex}" aria-label="${x.name}"></button>`).join('')}</div>`)}
          ${group('Khoảng giá', PRICE_RANGES.map(r => `<label class="check"><input type="checkbox" data-price="${r.id}">${r.name}</label>`).join(''))}
          ${group('Bề mặt', finishes.map(f => `<label class="check"><input type="checkbox" data-finish="${f}">${f}</label>`).join(''))}
          ${group('Xuất xứ', origins.map(o => `<label class="check"><input type="checkbox" data-origin="${o}">${o}</label>`).join(''), true)}
          <div style="padding-top:20px"><button class="btn btn--outline btn--sm btn--block" id="clearFilters">Xóa bộ lọc</button></div>
        </aside>
        <div>
          <div class="toolbar">
            <div style="display:flex;gap:12px;align-items:center">
              <button class="btn btn--outline btn--sm filter-toggle" id="filterToggle">${ic('filter')} Bộ lọc</button>
              <span class="muted" id="resultCount"></span>
            </div>
            <div class="toolbar__right">
              <label class="sr" for="sort">Sắp xếp</label>
              <select class="select" id="sort">
                <option value="featured">Nổi bật</option><option value="price-asc">Giá: thấp → cao</option>
                <option value="price-desc">Giá: cao → thấp</option><option value="name">Tên A–Z</option>
              </select>
            </div>
          </div>
          <div class="active-filters" id="activeFilters"></div>
          <div class="p-grid p-grid--3" id="catalogGrid"></div>
          <div class="pagination"><button class="is-active">1</button><button>2</button><button>3</button><button aria-label="Trang sau">›</button></div>
        </div>
      </div>
    </div>`;
  }
  function mountCatalog() {
    const run = () => {
      let list = PRODUCTS.filter(p =>
        (!F.cat || p.cat === F.cat) && (!F.room || p.rooms.includes(F.room)) &&
        (!F.q || (p.name + ' ' + cat(p.cat).name).toLowerCase().includes(F.q.toLowerCase())) &&
        (!F.colors.length || F.colors.includes(p.color)) &&
        (!F.prices.length || F.prices.some(id => PRICE_RANGES.find(r => r.id === id).test(p))) &&
        (!F.finishes.length || p.finishes.some(f => F.finishes.includes(f))) &&
        (!F.origins.length || F.origins.includes(p.origin)));
      if (F.sort === 'price-asc') list.sort((a, b) => a.price - b.price);
      if (F.sort === 'price-desc') list.sort((a, b) => b.price - a.price);
      if (F.sort === 'name') list.sort((a, b) => a.name.localeCompare(b.name, 'vi'));
      $('#resultCount').textContent = `${list.length} sản phẩm`;
      $('#catalogGrid').innerHTML = list.length ? list.map(card).join('') :
        `<div class="empty" style="grid-column:1/-1"><h3>Không tìm thấy sản phẩm phù hợp</h3><p>Thử bỏ bớt bộ lọc hoặc liên hệ để được tư vấn mẫu tương tự.</p></div>`;
      const chips = [
        ...(F.room ? [['room', F.room, ROOMS.find(r => r.id === F.room).name]] : []),
        ...F.colors.map(x => ['colors', x, COLORS.find(c => c.id === x).name]),
        ...F.prices.map(x => ['prices', x, PRICE_RANGES.find(r => r.id === x).name]),
        ...F.finishes.map(x => ['finishes', x, x]), ...F.origins.map(x => ['origins', x, x])];
      $('#activeFilters').innerHTML = chips.map(([k, v, t]) => `<button class="af" data-unset="${k}|${esc(v)}">${esc(t)} ${ic('close')}</button>`).join('');
      $$('.color-dot').forEach(d => d.classList.toggle('is-active', F.colors.includes(d.dataset.color)));
      reveal();
    };
    const toggle = (arr, v) => arr.includes(v) ? arr.splice(arr.indexOf(v), 1) : arr.push(v);
    $('#filters').addEventListener('change', e => {
      const t = e.target;
      if (t.name === 'room') F.room = t.value;
      if (t.dataset.price) toggle(F.prices, t.dataset.price);
      if (t.dataset.finish) toggle(F.finishes, t.dataset.finish);
      if (t.dataset.origin) toggle(F.origins, t.dataset.origin);
      run();
    });
    $('#filters').addEventListener('click', e => {
      const d = e.target.closest('[data-color]'); if (d) { toggle(F.colors, d.dataset.color); run(); }
    });
    $('#activeFilters').addEventListener('click', e => {
      const b = e.target.closest('[data-unset]'); if (!b) return;
      const [k, v] = b.dataset.unset.split('|');
      if (k === 'room') { F.room = ''; $$('input[name=room]').forEach(i => i.checked = false); }
      else {
        F[k] = F[k].filter(x => x !== v);
        const attr = { prices: 'price', finishes: 'finish', origins: 'origin' }[k];
        if (attr) $$(`[data-${attr}]`).forEach(i => { if (i.dataset[attr] === v) i.checked = false; });
      }
      run();
    });
    $('#clearFilters').addEventListener('click', () => {
      Object.assign(F, { room: '', colors: [], prices: [], finishes: [], origins: [] });
      $$('#filters input').forEach(i => i.checked = false); run();
    });
    $('#sort').addEventListener('change', e => { F.sort = e.target.value; run(); });
    $('#filterToggle').addEventListener('click', () => { $('#filters').classList.add('is-open'); scrim(true); });
    run();
  }

  /* ---------- Product detail ---------- */
  function specsFor(p) {
    const base = { 'Mã sản phẩm': 'GH-' + p.id.toUpperCase().replace('P', '') + '0' + p.cat.length, 'Kích thước': p.sizes.join(', '), 'Bề mặt': p.finishes.join(', '), 'Xuất xứ': p.origin };
    const extra = {
      'gach-op-lat': { 'Độ dày': '9 – 11 mm', 'Độ hút nước': '< 0,5%', 'Chống trơn': 'R10 / R11', 'Quy cách': `${p.boxM2} m²/hộp`, 'Bảo hành': '10 năm' },
      'da-tu-nhien': { 'Độ dày': '18 – 20 mm', 'Ứng dụng': 'Mặt bếp, ốp tường, lát sàn', 'Xử lý bề mặt': 'Chống thấm nano', 'Bảo hành': '15 năm' },
      'san-go': { 'Hèm khóa': 'Unilin 2G', 'Chống nước': 'Bề mặt kháng ẩm', 'Tiêu chuẩn': 'E0 / FloorScore', 'Quy cách': `${p.boxM2} m²/hộp`, 'Bảo hành': '25 năm' },
      'thiet-bi-ve-sinh': { 'Chất liệu': 'Sứ cao cấp / đồng thau', 'Men': 'Kháng khuẩn, chống bám bẩn', 'Phụ kiện': 'Đầy đủ theo bộ', 'Bảo hành': '5 năm' },
      'tam-op': { 'Chất liệu': 'Composite / nano', 'Chống ẩm, mối mọt': 'Có', 'Thi công': 'Keo / ke inox', 'Bảo hành': '5 năm' },
      'hoan-thien': { 'Định mức': '1,2 – 1,5 kg/m²/lớp', 'Thời gian khô': '4 – 6 giờ', 'Gốc': 'Xi măng polymer', 'Bảo hành': '5 năm' }
    }[p.cat];
    return Object.assign(base, extra);
  }
  function pageProduct(slug) {
    const p = PRODUCTS.find(x => x.slug === slug);
    if (!p) return page404();
    const c = cat(p.cat), isArea = p.unit === 'm²' && p.boxM2;
    const views = [
      { label: 'Bề mặt', style: `background-image:${tex(p.tex)}` },
      { label: 'Chi tiết', style: `background-image:${tex(p.tex)};background-size:220%;background-position:30% 40%` },
      { label: 'Cận cảnh', style: `background-image:${tex(p.tex)};background-size:420%;background-position:70% 60%` }
    ];
    if (p.tex.t !== 'illus') views.push({ label: 'Phối cảnh', style: `background-image:linear-gradient(rgba(0,0,0,.05),rgba(0,0,0,.25)),${tex(p.tex)};background-size:cover,70px;` });
    const related = PRODUCTS.filter(x => x.cat === p.cat && x.id !== p.id).concat(PRODUCTS.filter(x => x.cat !== p.cat)).slice(0, 4);
    const specs = specsFor(p);
    return `
    <div class="container page-head" style="padding-bottom:16px">${crumbs([['Sản phẩm', '#/san-pham'], [c.name, '#/san-pham?cat=' + c.id], [p.name]])}</div>
    <div class="container">
      <div class="pdp">
        <div class="gallery">
          <div class="gallery__thumbs">${views.map((v, i) => `<button class="${i ? '' : 'is-active'}" style="${v.style}" data-view="${i}" aria-label="${v.label}"></button>`).join('')}</div>
          <div class="gallery__main" id="galleryMain" style="${views[0].style}">
            <div class="p-card__badges">${p.badges.map(b => `<span class="badge">${b}</span>`).join('')}</div>
            <div class="tools"><span>${ic('search')} Phóng to</span><span>${ic('swatch')} Ảnh minh họa</span></div>
          </div>
        </div>
        <div class="pdp__info">
          <p class="eyebrow">${c.name}</p>
          <h1>${esc(p.name)}</h1>
          <div class="pdp__sku"><span>Mã: ${specs['Mã sản phẩm']}</span><span>Xuất xứ: ${p.origin}</span><span style="color:var(--ok)">● Còn hàng tại kho Đà Nẵng</span></div>
          <div class="pdp__price">${fmt(p.price)} <small>/ ${p.unit}</small>${p.oldPrice ? `<s>${fmt(p.oldPrice)}</s>` : ''}</div>
          <div class="pdp__vat">Giá đã bao gồm VAT · Chiết khấu riêng cho nhà thầu & đơn hàng công trình</div>

          <div class="opt"><div class="opt__label">Kích thước <span id="selSize">${p.sizes[0]}</span></div>
            <div class="opt__list" data-opt="size">${p.sizes.map((s, i) => `<button class="opt__btn ${i ? '' : 'is-active'}" data-val="${s}">${s}</button>`).join('')}</div></div>
          <div class="opt"><div class="opt__label">Bề mặt / Màu hoàn thiện <span id="selFinish">${p.finishes[0]}</span></div>
            <div class="opt__list" data-opt="finish">${p.finishes.map((s, i) => `<button class="opt__btn ${i ? '' : 'is-active'}" data-val="${s}">${s}</button>`).join('')}</div></div>

          ${isArea ? `<div class="calc">
            <div class="calc__head">${ic('ruler')} Tính số lượng cần mua</div>
            <div class="calc__row">
              <label class="field">Diện tích cần ốp/lát<div class="suffix"><input type="number" id="calcArea" min="0" step="0.5" placeholder="VD: 25"><span>m²</span></div></label>
              <label class="field">Hao hụt dự phòng<select id="calcWaste"><option value="5">5% – lát thẳng</option><option value="10">10% – lát chéo / xương cá</option><option value="15">15% – nhiều góc cắt</option></select></label>
            </div>
            <div class="calc__out"><div>Số hộp<b id="calcBoxes">–</b></div><div>Tổng diện tích<b id="calcM2">–</b></div><div>Tạm tính<b id="calcPrice">–</b></div></div>
          </div>` : ''}

          <div class="buy">
            <div class="qty"><button data-step="-1" aria-label="Giảm">${ic('minus', '')}</button><input id="qty" type="number" value="${p.boxM2 || 1}" min="1" step="${p.boxM2 || 1}" aria-label="Số lượng"><button data-step="1" aria-label="Tăng">${ic('plus', '')}</button></div>
            <button class="btn btn--primary" id="addBtn">${ic('bag')} Thêm vào giỏ hàng</button>
          </div>
          <div class="pdp__secondary">
            <button class="btn btn--outline" data-sample="${p.id}">${ic('swatch')} Đặt mẫu miễn phí</button>
            <button class="btn btn--outline" data-quote="${p.id}">${ic('chat')} Báo giá số lượng lớn</button>
          </div>
          <ul class="perks">
            <li>${ic('truck')} Giao trong 24h nội thành Đà Nẵng · Miễn phí cho đơn từ ${fmt(FREE_SHIP)}</li>
            <li>${ic('shield')} Hàng chính hãng, đầy đủ CO/CQ · Bảo hành ${specs['Bảo hành']}</li>
            <li>${ic('check')} Đổi trả trong 7 ngày với sản phẩm còn nguyên đai kiện</li>
          </ul>
          <div class="acc is-open"><button>Mô tả sản phẩm ${ic('chev')}</button><div class="acc__body">
            <p>${esc(p.name)} mang đến vẻ đẹp ${p.color === 'trang' ? 'thanh lịch, sáng sủa' : p.color === 'den' ? 'sang trọng, cá tính' : 'ấm áp, tự nhiên'} cho ${p.rooms.map(r => ROOMS.find(x => x.id === r).name.toLowerCase()).join(', ')}. Sản phẩm được tuyển chọn từ ${p.origin}, đáp ứng tiêu chuẩn chất lượng cho cả nhà ở và công trình thương mại.</p>
          </div></div>
          <div class="acc"><button>Thông số kỹ thuật ${ic('chev')}</button><div class="acc__body">
            <table class="spec">${Object.entries(specs).map(([k, v]) => `<tr><td>${k}</td><td>${v}</td></tr>`).join('')}</table>
          </div></div>
          <div class="acc"><button>Hướng dẫn thi công & bảo quản ${ic('chev')}</button><div class="acc__body">
            <p>Thi công trên nền phẳng, khô, sạch. Sử dụng keo/vữa chuyên dụng và ke cân bằng. Vệ sinh bằng dung dịch trung tính, tránh axit mạnh. Đội ngũ GreenHabitat hỗ trợ kỹ thuật tại công trình khi cần.</p>
          </div></div>
          <div class="acc"><button>Tài liệu tải về ${ic('chev')}</button><div class="acc__body"><div class="docs">
            <a href="#" onclick="event.preventDefault();toast('Tài liệu sẽ có khi kết nối CMS')">${ic('download')} Catalogue sản phẩm <small>PDF · 4,2 MB</small></a>
            <a href="#" onclick="event.preventDefault();toast('Tài liệu sẽ có khi kết nối CMS')">${ic('download')} Bản vẽ CAD / Texture 3D <small>ZIP · 18 MB</small></a>
            <a href="#" onclick="event.preventDefault();toast('Tài liệu sẽ có khi kết nối CMS')">${ic('download')} Chứng nhận CO/CQ <small>PDF · 1,1 MB</small></a>
          </div></div></div>
        </div>
      </div>
    </div>
    <section class="section section--white">
      <div class="container">
        <div class="section__head"><div><p class="eyebrow">Gợi ý cho bạn</p><h2 class="display h2">Sản phẩm liên quan</h2></div></div>
        <div class="p-grid">${related.map(card).join('')}</div>
      </div>
    </section>`;
  }
  function mountProduct(slug) {
    const p = PRODUCTS.find(x => x.slug === slug); if (!p) return;
    const sel = { size: p.sizes[0], finish: p.finishes[0] };
    $$('.gallery__thumbs button').forEach(b => b.addEventListener('click', () => {
      $$('.gallery__thumbs button').forEach(x => x.classList.toggle('is-active', x === b));
      $('#galleryMain').setAttribute('style', b.getAttribute('style'));
    }));
    $$('[data-opt]').forEach(list => list.addEventListener('click', e => {
      const b = e.target.closest('.opt__btn'); if (!b) return;
      $$('.opt__btn', list).forEach(x => x.classList.toggle('is-active', x === b));
      sel[list.dataset.opt] = b.dataset.val;
      $(list.dataset.opt === 'size' ? '#selSize' : '#selFinish').textContent = b.dataset.val;
    }));
    const qty = $('#qty'), step = p.boxM2 || 1;
    $$('[data-step]').forEach(b => b.addEventListener('click', () => {
      qty.value = Math.max(step, +(+qty.value + step * +b.dataset.step).toFixed(2));
    }));
    if ($('#calcArea')) {
      const calc = () => {
        const a = +$('#calcArea').value, w = +$('#calcWaste').value;
        if (!a) { ['#calcBoxes', '#calcM2', '#calcPrice'].forEach(s => $(s).textContent = '–'); return; }
        const boxes = Math.ceil(a * (1 + w / 100) / p.boxM2), m2 = +(boxes * p.boxM2).toFixed(2);
        $('#calcBoxes').textContent = boxes + ' hộp'; $('#calcM2').textContent = num(m2) + ' m²'; $('#calcPrice').textContent = fmt(m2 * p.price);
        qty.value = m2;
      };
      $('#calcArea').addEventListener('input', calc); $('#calcWaste').addEventListener('change', calc);
    }
    $('#addBtn').addEventListener('click', () => addToCart(p.id, { ...sel, qty: Math.max(0.01, +qty.value || step) }));
    $('#galleryMain').addEventListener('click', e => {
      if (e.target.closest('.tools')) return;
      const m = $('#galleryMain'); m.style.backgroundSize = m.style.backgroundSize === '250%' ? '' : '250%';
    });
  }

  /* ---------- Projects / About / Contact / Account / Policy ---------- */
  function pageProjects() {
    const types = [...new Set(PROJECTS.map(p => p.type))];
    return `
    <section class="page-banner"><div class="bg" ${bg(PROJECTS[0].tex)}></div><div class="container">${crumbs([['Dự án']])}
      <h1 class="display h1" style="margin:18px 0 12px">Dự án tiêu biểu</h1><p class="lead">Nhà ở, khách sạn, F&B và văn phòng – nơi vật liệu GreenHabitat góp phần tạo nên không gian.</p></div></section>
    <section class="section" style="padding-top:40px"><div class="container">
      <div class="cat-chips" style="margin-bottom:36px"><button class="chip-btn chip-btn--plain is-active">Tất cả</button>${types.map(t => `<button class="chip-btn chip-btn--plain">${t}</button>`).join('')}</div>
      <div class="proj-grid">${PROJECTS.map(projCard).join('')}</div>
    </div></section>
    <section class="section section--green"><div class="container" style="display:flex;justify-content:space-between;align-items:center;gap:32px;flex-wrap:wrap">
      <div><p class="eyebrow eyebrow--light">Dành cho nhà thầu & kiến trúc sư</p><h2 class="display h2" style="color:#fff;margin-top:12px;max-width:20ch">Chính sách giá dự án, hỗ trợ mẫu & bóc tách khối lượng.</h2></div>
      <button class="btn btn--light" data-quote>Đăng ký đối tác ${ic('arrow')}</button></div></section>`;
  }
  function pageAbout() {
    return `
    <section class="page-banner"><div class="bg" ${bg(CATS[2].tex)}></div><div class="container">${crumbs([['Về chúng tôi']])}
      <h1 class="display h1" style="margin:18px 0 12px">Về GreenHabitat</h1><p class="lead">${S.legalName}</p></div></section>
    <section class="section"><div class="container about-intro">
      <div class="reveal"><p class="eyebrow">Câu chuyện của chúng tôi</p>
        <h2 class="display h2" style="margin:14px 0 24px">Kiến tạo những “môi trường sống xanh” từ từng lớp vật liệu.</h2>
        <p class="lead" style="margin-bottom:18px">GreenHabitat là thương hiệu của Công ty TNHH Thương mại TNT Thịnh Phát – đơn vị cung cấp vật liệu xây dựng và trang trí nội thất tại Đà Nẵng.</p>
        <p class="muted">Chúng tôi tin rằng một ngôi nhà đẹp bắt đầu từ vật liệu tốt: bền bỉ với khí hậu miền Trung, an toàn cho sức khỏe và hài hòa với thiên nhiên. Mỗi sản phẩm đều được tuyển chọn kỹ lưỡng, có nguồn gốc rõ ràng và được tư vấn bởi đội ngũ am hiểu kỹ thuật thi công.</p>
      </div>
      <div class="img reveal" ${bg(PRODUCTS[7].tex)}></div>
    </div></section>
    <section class="section section--green"><div class="container"><div class="stats">
      <div><b>2.000+</b><span>Mẫu vật liệu</span></div><div><b>350+</b><span>Công trình đã cung cấp</span></div>
      <div><b>8+</b><span>Thương hiệu đối tác</span></div><div><b>24h</b><span>Giao hàng nội thành</span></div>
    </div><p style="margin-top:24px;font-size:12px;color:#8ea097">* Số liệu minh họa – cập nhật theo thực tế doanh nghiệp.</p></div></section>
    <section class="section"><div class="container">
      <div class="section__head"><div><p class="eyebrow">Giá trị cốt lõi</p><h2 class="display h2">Điều chúng tôi cam kết</h2></div></div>
      <div class="values">
        <div class="value reveal">${ic('shield')}<h3>Chính hãng & minh bạch</h3><p>Nguồn gốc rõ ràng, chứng từ CO/CQ đầy đủ, giá niêm yết công khai.</p></div>
        <div class="value reveal">${ic('leaf')}<h3>Vật liệu bền vững</h3><p>Ưu tiên sản phẩm phát thải thấp, an toàn sức khỏe và có tuổi thọ cao.</p></div>
        <div class="value reveal">${ic('chat')}<h3>Đồng hành tận tâm</h3><p>Tư vấn từ khâu chọn mẫu, bóc tách khối lượng đến hỗ trợ kỹ thuật thi công.</p></div>
      </div></div></section>`;
  }
  function pageContact() {
    return `
    <div class="container page-head">${crumbs([['Liên hệ']])}<h1 class="display h1">Liên hệ</h1><p class="lead">Gửi yêu cầu, chúng tôi phản hồi trong vòng 2 giờ làm việc.</p></div>
    <div class="container contact">
      <div>
        <ul class="info-list" style="margin-top:0">
          <li>${ic('pin')}<div><b>Showroom & kho</b><span>${S.address}</span></div></li>
          <li>${ic('phone')}<div><b>Hotline / Zalo</b><span>${S.hotline} · ${S.zalo}</span></div></li>
          <li>${ic('mail')}<div><b>Email</b><span>${S.email}</span></div></li>
          <li>${ic('clock')}<div><b>Giờ làm việc</b><span>${S.hours}</span></div></li>
        </ul>
        <iframe class="map" style="border-radius:var(--r-lg);min-height:340px" title="Bản đồ" src="${S.mapEmbed}" loading="lazy"></iframe>
      </div>
      <form class="contact__card" data-form="contact" novalidate>
        <h3 class="display h3" style="margin-bottom:20px">Gửi tin nhắn</h3>
        <div class="form-grid">
          <label class="field">Họ và tên *<input name="name" required><span class="err">Vui lòng nhập họ tên</span></label>
          <label class="field">Số điện thoại *<input name="phone" type="tel" required pattern="0[0-9]{9}"><span class="err">Số điện thoại gồm 10 số</span></label>
          <label class="field full">Email<input name="email" type="email"></label>
          <label class="field full">Bạn cần hỗ trợ về<select name="topic"><option>Tư vấn chọn vật liệu</option><option>Báo giá công trình</option><option>Đặt lịch tham quan showroom</option><option>Hợp tác đại lý / nhà thầu</option><option>Bảo hành – đổi trả</option></select></label>
          <label class="field full">Nội dung<textarea name="msg"></textarea></label>
        </div>
        <button class="btn btn--primary btn--block" style="margin-top:20px">Gửi yêu cầu ${ic('arrow')}</button>
      </form>
    </div>`;
  }
  function pageAccount() {
    return `
    <div class="container page-head">${crumbs([['Tài khoản']])}<h1 class="display h1">Tài khoản</h1><p class="lead">Theo dõi đơn hàng, lưu sản phẩm yêu thích và nhận giá ưu đãi dành cho đối tác.</p></div>
    <div class="container auth">
      <form class="contact__card" onsubmit="event.preventDefault();toast('Đăng nhập – sẽ kết nối backend')">
        <h3 class="display h3" style="margin-bottom:20px">Đăng nhập</h3>
        <div class="form-grid"><label class="field full">Email hoặc số điện thoại<input required></label>
        <label class="field full">Mật khẩu<input type="password" required></label></div>
        <button class="btn btn--primary btn--block" style="margin-top:20px">Đăng nhập</button>
        <button type="button" class="btn btn--outline btn--block" style="margin-top:10px">Đăng nhập bằng mã OTP qua Zalo/SMS</button>
      </form>
      <form class="contact__card" onsubmit="event.preventDefault();toast('Đăng ký – sẽ kết nối backend')">
        <h3 class="display h3" style="margin-bottom:20px">Tạo tài khoản</h3>
        <div class="form-grid"><label class="field">Họ tên<input required></label><label class="field">Số điện thoại<input required></label>
        <label class="field full">Email<input type="email"></label>
        <label class="field full">Loại tài khoản<select><option>Khách hàng cá nhân</option><option>Nhà thầu / Kiến trúc sư</option><option>Đại lý</option></select></label></div>
        <button class="btn btn--outline btn--block" style="margin-top:20px">Đăng ký</button>
      </form>
    </div>`;
  }
  function pagePolicy() {
    return `<div class="container page-head">${crumbs([['Chính sách']])}<h1 class="display h1">Chính sách & Hỗ trợ</h1></div>
    <div class="container policy">
      <h3>Vận chuyển & lắp đặt</h3><p>Giao trong 24h nội thành Đà Nẵng. Miễn phí vận chuyển cho đơn từ ${fmt(FREE_SHIP)}. Đơn hàng tỉnh được giao qua đối tác vận tải, phí tính theo khối lượng.</p>
      <h3>Đổi trả</h3><ul><li>Đổi trả trong 7 ngày với sản phẩm còn nguyên đai, kiện.</li><li>Không áp dụng với hàng cắt theo yêu cầu và đá slab đã gia công.</li></ul>
      <h3>Bảo hành</h3><p>Bảo hành chính hãng theo từng sản phẩm, thời hạn ghi rõ tại trang chi tiết.</p>
      <h3>Thanh toán</h3><ul><li>VNPAY (ATM nội địa, QR ngân hàng), Ví MoMo, ZaloPay</li><li>Thẻ quốc tế Visa / Mastercard / JCB</li><li>Chuyển khoản qua VietQR</li><li>Thanh toán khi nhận hàng (COD) hoặc đặt cọc 30% với đơn công trình</li></ul>
      <p class="muted" style="margin-top:32px">* Nội dung mẫu – cần doanh nghiệp xác nhận trước khi công bố.</p>
    </div>`;
  }
  function page404() {
    return `<div class="container empty" style="padding:120px 20px"><h3>Không tìm thấy trang</h3><p>Trang bạn tìm có thể đã được di chuyển.</p><p style="margin-top:24px"><a class="btn btn--primary" href="#/">Về trang chủ</a></p></div>`;
  }

  /* ---------- Cart page ---------- */
  function lineItemHTML(l, big) {
    const p = prod(l.id);
    return `<div class="line-item">
      <a href="#/san-pham/${p.slug}" class="line-item__img" ${bg(p.tex)}></a>
      <div>
        <a href="#/san-pham/${p.slug}" class="line-item__name">${esc(p.name)}</a>
        <div class="line-item__var">${l.size} · ${l.finish} · ${fmt(p.price)}/${p.unit}</div>
        <div class="line-item__row">
          <div class="qty qty--sm"><button data-qty="${l.key}" data-d="-1" aria-label="Giảm">${ic('minus', '')}</button><input value="${num(l.qty)}" readonly aria-label="Số lượng"><button data-qty="${l.key}" data-d="1" aria-label="Tăng">${ic('plus', '')}</button></div>
          <span class="muted" style="font-size:13px;margin-right:auto">${p.unit}</span>
          ${big ? '' : `<b>${fmt(lineTotal(l))}</b>`}
        </div>
        <button class="rm" data-rm="${l.key}">${ic('trash')} Xóa</button>
      </div>
      ${big ? `<b style="font-size:16px">${fmt(lineTotal(l))}</b>` : ''}
    </div>`;
  }
  function shipBar() {
    const s = subtotal(), left = FREE_SHIP - s;
    return `<div class="free-ship">${left > 0 ? `Mua thêm <b>${fmt(left)}</b> để được <b>miễn phí giao hàng</b> nội thành` : `🎉 Đơn hàng được <b>miễn phí giao hàng</b> nội thành Đà Nẵng`}
      <div class="bar"><i style="width:${Math.min(100, s / FREE_SHIP * 100)}%"></i></div></div>`;
  }
  function pageCart() {
    if (!cart.length) return `<div class="container empty" style="padding:120px 20px">${ic('bag', 'ic" style="width:48px;height:48px;margin:0 auto 20px;color:var(--muted)')}<h3>Giỏ hàng đang trống</h3><p>Khám phá hàng nghìn mẫu vật liệu chính hãng.</p><p style="margin-top:24px"><a class="btn btn--primary" href="#/san-pham">Mua sắm ngay ${ic('arrow')}</a></p></div>`;
    return `<div class="container page-head">${crumbs([['Giỏ hàng']])}<h1 class="display h2" style="margin-top:18px">Giỏ hàng <span class="muted" style="font-size:.5em">(${cart.length} sản phẩm)</span></h1></div>
    <div class="container cart-page">
      <div><div style="border-radius:var(--r);overflow:hidden">${shipBar()}</div><div class="cart-table">${cart.map(l => lineItemHTML(l, true)).join('')}</div>
        <a href="#/san-pham" class="link" style="margin-top:24px">← Tiếp tục mua sắm</a></div>
      ${summaryBox('cart')}
    </div>`;
  }
  function summaryBox(mode, ship = null) {
    const s = subtotal(), disc = store.get('gh_coupon', 0) ? Math.round(s * 0.05) : 0;
    const shipTxt = ship === null ? 'Tính ở bước thanh toán' : ship === 0 ? 'Miễn phí' : fmt(ship);
    const total = s - disc + (ship || 0);
    return `<aside class="summary">
      <h3>${mode === 'cart' ? 'Tóm tắt đơn hàng' : 'Đơn hàng của bạn'}</h3>
      ${mode === 'checkout' ? `<div class="mini-items">${cart.map(l => { const p = prod(l.id); return `<div class="mini-item"><span class="t" ${bg(p.tex)}><i>${num(l.qty)}</i></span><div>${esc(p.name)}<small>${l.size} · ${l.finish}</small></div><b>${fmt(lineTotal(l))}</b></div>`; }).join('')}</div>` : ''}
      <div class="coupon"><input id="coupon" placeholder="Mã giảm giá (thử: GREEN5)"><button class="btn btn--outline btn--sm" id="applyCoupon">Áp dụng</button></div>
      <div class="sum-row"><span>Tạm tính</span><span>${fmt(s)}</span></div>
      ${disc ? `<div class="sum-row" style="color:var(--ok)"><span>Giảm giá (GREEN5)</span><span>-${fmt(disc)}</span></div>` : ''}
      <div class="sum-row"><span>Vận chuyển</span><span>${shipTxt}</span></div>
      <div class="sum-row sum-row--total"><span>Tổng cộng</span><span>${fmt(total)}</span></div>
      <p class="muted" style="font-size:12px;margin-top:4px">Đã bao gồm VAT</p>
      ${mode === 'cart' ? `<a href="#/thanh-toan" class="btn btn--primary btn--block" style="margin-top:20px">Tiến hành thanh toán ${ic('arrow')}</a>
        <button class="btn btn--outline btn--block" style="margin-top:10px" data-quote="cart">Gửi giỏ hàng để nhận báo giá</button>` :
        `<button class="btn btn--primary btn--block" style="margin-top:20px" id="placeOrder" form="coForm">${ic('lock')} Đặt hàng & thanh toán</button>`}
      <div class="secure">${ic('lock')} Thanh toán bảo mật SSL · Cổng thanh toán được cấp phép</div>
    </aside>`;
  }

  /* ---------- Checkout ---------- */
  const SHIP = [
    { id: 'dn', name: 'Giao nội thành Đà Nẵng', desc: 'Trong 24h · Miễn phí từ 5 triệu', fee: s => s >= FREE_SHIP ? 0 : 150000 },
    { id: 'tinh', name: 'Giao tỉnh / thành khác', desc: '2 – 5 ngày qua đối tác vận tải', fee: () => 450000 },
    { id: 'pickup', name: 'Nhận tại showroom', desc: S.address, fee: () => 0 }
  ];
  const PAY = [
    { id: 'vnpay', name: 'VNPAY', desc: 'Thẻ ATM nội địa, QR ngân hàng, Internet Banking', logo: ['VNPAY', '#005baa'] },
    { id: 'momo', name: 'Ví MoMo', desc: 'Quét mã hoặc mở ứng dụng MoMo', logo: ['MoMo', '#a50064'] },
    { id: 'zalopay', name: 'ZaloPay', desc: 'Thanh toán qua ứng dụng ZaloPay', logo: ['ZaloPay', '#0068ff'] },
    { id: 'card', name: 'Thẻ quốc tế', desc: 'Visa, Mastercard, JCB', logo: ['VISA', '#1a1f71'] },
    { id: 'bank', name: 'Chuyển khoản ngân hàng (VietQR)', desc: 'Quét mã QR – xác nhận tự động', logo: ['VietQR', '#2c5446'] },
    { id: 'deposit', name: 'Đặt cọc 30%', desc: 'Dành cho đơn công trình – thanh toán phần còn lại khi nhận hàng', logo: ['30%', '#a8714a'] },
    { id: 'cod', name: 'Thanh toán khi nhận hàng (COD)', desc: 'Áp dụng cho đơn dưới 20 triệu', logo: ['COD', '#555'] }
  ];
  let co = { ship: 'dn', pay: 'vnpay' };
  function pageCheckout() {
    if (!cart.length) return pageCart();
    const s = subtotal();
    return `<div class="container page-head" style="padding-bottom:0">${crumbs([['Giỏ hàng', '#/gio-hang'], ['Thanh toán']])}
      <h1 class="display h2" style="margin-top:18px">Thanh toán</h1>
      <ol class="stepper"><li class="is-done">Giỏ hàng</li><li class="is-active">Thông tin & thanh toán</li><li>Hoàn tất</li></ol></div>
    <div class="container checkout">
      <form id="coForm" novalidate>
        <div class="co-block"><h3>1. Thông tin người nhận <small>Đã có tài khoản? <a href="#/tai-khoan" style="text-decoration:underline">Đăng nhập</a></small></h3>
          <div class="form-grid">
            <label class="field">Họ và tên *<input name="name" required autocomplete="name"><span class="err">Vui lòng nhập họ tên</span></label>
            <label class="field">Số điện thoại *<input name="phone" type="tel" required pattern="0[0-9]{9}" autocomplete="tel"><span class="err">Số điện thoại gồm 10 số, bắt đầu bằng 0</span></label>
            <label class="field full">Email <span class="hint">Nhận xác nhận đơn hàng & hóa đơn</span><input name="email" type="email" autocomplete="email"></label>
            <label class="field">Tỉnh / Thành phố *<select name="province" required><option value="">Chọn tỉnh / thành</option><option>TP. Đà Nẵng</option><option>TP. Huế</option><option>Quảng Ngãi</option><option>Quảng Trị</option><option>Gia Lai</option><option>TP. Hồ Chí Minh</option><option>TP. Hà Nội</option><option>Khác</option></select><span class="err">Chọn tỉnh / thành</span></label>
            <label class="field">Phường / Xã *<input name="ward" required><span class="err">Nhập phường / xã</span></label>
            <label class="field full">Địa chỉ cụ thể *<input name="address" required placeholder="Số nhà, tên đường, tên công trình…" autocomplete="street-address"><span class="err">Nhập địa chỉ giao hàng</span></label>
            <label class="field full">Ghi chú giao hàng<textarea name="note" placeholder="VD: Giao giờ hành chính, cần xe nhỏ vào hẻm, gọi trước 30 phút…" style="min-height:80px"></textarea></label>
            <label class="check full"><input type="checkbox" id="vatToggle"> Xuất hóa đơn VAT cho công ty</label>
            <div class="full form-grid" id="vatFields" style="display:none">
              <label class="field">Tên công ty<input name="company"></label><label class="field">Mã số thuế<input name="tax"></label>
              <label class="field full">Địa chỉ xuất hóa đơn<input name="taxAddr"></label>
            </div>
          </div></div>
        <div class="co-block"><h3>2. Phương thức giao hàng</h3>
          <div class="radio-cards">${SHIP.map(x => `<label class="rc"><input type="radio" name="ship" value="${x.id}" ${co.ship === x.id ? 'checked' : ''}><div><b>${x.name}</b><span>${x.desc}</span></div><span class="price-tag">${x.fee(s) ? fmt(x.fee(s)) : 'Miễn phí'}</span></label>`).join('')}</div></div>
        <div class="co-block"><h3>3. Phương thức thanh toán</h3>
          <div class="radio-cards">${PAY.map(x => `<label class="rc"><input type="radio" name="pay" value="${x.id}" ${co.pay === x.id ? 'checked' : ''} ${x.id === 'cod' && s > 20000000 ? 'disabled' : ''}><div><b>${x.name}</b><span>${x.desc}</span></div><span class="logo-pill" style="background:${x.logo[1]}">${x.logo[0]}</span></label>
            ${x.id === 'card' ? `<div class="pay-extra" data-extra="card"><div class="form-grid"><label class="field full">Số thẻ<input placeholder="Nhập trên trang bảo mật của cổng thanh toán" disabled></label></div><p class="muted" style="margin-top:8px;font-size:12px">Bạn sẽ được chuyển đến cổng thanh toán (3-D Secure). GreenHabitat không lưu thông tin thẻ.</p></div>` : ''}
            ${x.id === 'bank' ? `<div class="pay-extra" data-extra="bank">Mã QR & thông tin chuyển khoản sẽ hiển thị sau khi đặt hàng. Đơn được xác nhận tự động khi nhận được tiền.</div>` : ''}
            ${x.id === 'deposit' ? `<div class="pay-extra" data-extra="deposit">Số tiền cọc: <b id="depositAmt"></b> – thanh toán qua VietQR hoặc VNPAY.</div>` : ''}`).join('')}</div></div>
        <label class="check" style="margin:8px 0 0"><input type="checkbox" required id="agree"> Tôi đồng ý với&nbsp;<a href="#/chinh-sach" style="text-decoration:underline">chính sách mua hàng & đổi trả</a></label>
      </form>
      <div id="coSummary"></div>
    </div>`;
  }
  function mountCheckout() {
    if (!cart.length) return;
    const form = $('#coForm');
    const refresh = () => {
      const s = subtotal(), fee = SHIP.find(x => x.id === co.ship).fee(s);
      $('#coSummary').innerHTML = summaryBox('checkout', fee);
      $$('.pay-extra').forEach(el => el.classList.toggle('is-on', el.dataset.extra === co.pay));
      const disc = store.get('gh_coupon', 0) ? Math.round(s * 0.05) : 0;
      if ($('#depositAmt')) $('#depositAmt').textContent = fmt((s - disc + fee) * 0.3);
      bindCoupon(refresh);
    };
    form.addEventListener('change', e => {
      if (e.target.name === 'ship') co.ship = e.target.value;
      if (e.target.name === 'pay') co.pay = e.target.value;
      if (e.target.id === 'vatToggle') $('#vatFields').style.display = e.target.checked ? 'grid' : 'none';
      refresh();
    });
    form.addEventListener('submit', e => {
      e.preventDefault();
      let ok = true;
      $$('.field', form).forEach(f => {
        const i = $('input,select', f); if (!i) return;
        const bad = !i.checkValidity(); f.classList.toggle('is-invalid', bad); if (bad) ok = false;
      });
      if (!$('#agree').checked) { toast('Vui lòng đồng ý với chính sách mua hàng'); ok = false; }
      if (!ok) { const f = $('.is-invalid', form); if (f) f.scrollIntoView({ behavior: 'smooth', block: 'center' }); return; }
      const s = subtotal(), fee = SHIP.find(x => x.id === co.ship).fee(s), disc = store.get('gh_coupon', 0) ? Math.round(s * 0.05) : 0;
      const d = new Date(), code = 'GH' + String(d.getFullYear()).slice(2) + String(d.getMonth() + 1).padStart(2, '0') + String(d.getDate()).padStart(2, '0') + Math.floor(1000 + Math.random() * 9000);
      const order = { code, items: cart.slice(), subtotal: s, fee, disc, total: s - disc + fee, pay: co.pay, ship: co.ship, name: form.name.value, phone: form.phone.value, address: `${form.address.value}, ${form.ward.value}, ${form.province.value}` };
      const gateway = ['vnpay', 'momo', 'zalopay', 'card'].includes(co.pay);
      const finish = () => { store.set('gh_last_order', order); cart = []; store.set('gh_coupon', 0); saveCart(); closeAll(); location.hash = '#/dat-hang-thanh-cong'; };
      if (gateway) {
        const m = PAY.find(x => x.id === co.pay);
        openModal(`<div class="modal__main" style="grid-column:1/-1;text-align:center;padding:48px 32px">
          <span class="logo-pill" style="background:${m.logo[1]};color:#fff;font-weight:800;padding:8px 14px;border-radius:6px;display:inline-block">${m.logo[0]}</span>
          <h3 class="display h3" style="margin:20px 0 8px">Đang chuyển đến cổng thanh toán…</h3>
          <p class="muted">Số tiền: <b style="color:var(--ink)">${fmt(order.total)}</b> · Mã đơn ${code}</p>
          <p class="muted" style="font-size:12px;margin-top:16px">(Prototype – mô phỏng redirect & callback IPN)</p></div>`);
        setTimeout(finish, 1600);
      } else finish();
    });
    refresh();
  }
  function bindCoupon(after) {
    const b = $('#applyCoupon'); if (!b) return;
    b.onclick = () => {
      const v = $('#coupon').value.trim().toUpperCase();
      if (v === 'GREEN5') { store.set('gh_coupon', 1); toast('Đã áp dụng mã giảm 5%'); after(); }
      else toast('Mã giảm giá không hợp lệ');
    };
  }

  function fakeQR(seed) {
    const n = 25, r = (() => { let s = [...seed].reduce((a, c) => a + c.charCodeAt(0), 7); return () => (s = (s * 9301 + 49297) % 233280) / 233280; })();
    let cells = '';
    const finder = (x, y) => `<rect x="${x}" y="${y}" width="7" height="7" fill="#111"/><rect x="${x + 1}" y="${y + 1}" width="5" height="5" fill="#fff"/><rect x="${x + 2}" y="${y + 2}" width="3" height="3" fill="#111"/>`;
    for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
      if ((x < 8 && y < 8) || (x > n - 9 && y < 8) || (x < 8 && y > n - 9)) continue;
      if (r() > 0.52) cells += `<rect x="${x}" y="${y}" width="1" height="1" fill="#111"/>`;
    }
    return `<svg class="qr" viewBox="-1 -1 ${n + 2} ${n + 2}" shape-rendering="crispEdges"><rect x="-1" y="-1" width="${n + 2}" height="${n + 2}" fill="#fff"/>${cells}${finder(0, 0)}${finder(n - 7, 0)}${finder(0, n - 7)}</svg>`;
  }
  function pageSuccess() {
    const o = store.get('gh_last_order', null);
    if (!o) return page404();
    const payName = PAY.find(x => x.id === o.pay).name;
    const needTransfer = o.pay === 'bank' || o.pay === 'deposit';
    const amt = o.pay === 'deposit' ? o.total * 0.3 : o.total;
    return `<div class="container success">
      <div class="success__icon">${ic('check', '')}</div>
      <p class="eyebrow">Mã đơn hàng ${o.code}</p>
      <h1 class="display h2" style="margin-top:12px">Cảm ơn ${esc(o.name)}, đơn hàng đã được ghi nhận!</h1>
      <p class="lead" style="margin:0 auto">Xác nhận đã được gửi qua SMS/Zalo đến ${esc(o.phone)}. Chuyên viên sẽ liên hệ để chốt lịch giao hàng.</p>
      ${needTransfer ? `<div class="order-card"><h3 class="display h3" style="margin-bottom:16px">Chuyển khoản để hoàn tất</h3>
        <div class="qr-wrap">${fakeQR(o.code)}<div class="bank-info">
          <span>Ngân hàng: <b>(cập nhật)</b></span><span>Chủ tài khoản: <b>CONG TY TNHH TM TNT THINH PHAT</b></span>
          <span>Số tiền: <b>${fmt(amt)}</b></span><span>Nội dung: <b>${o.code}</b></span>
          <span class="muted" style="font-size:12px">QR minh họa – bản thật sinh bằng VietQR API</span></div></div></div>` : ''}
      <div class="order-card">
        <div class="sum-row"><span class="muted">Thanh toán</span><span>${payName}${['vnpay', 'momo', 'zalopay', 'card'].includes(o.pay) ? ' · <b style="color:var(--ok)">Đã thanh toán</b>' : ''}</span></div>
        <div class="sum-row"><span class="muted">Giao đến</span><span style="text-align:right;max-width:60%">${esc(o.address)}</span></div>
        <div class="sum-row"><span class="muted">Số sản phẩm</span><span>${o.items.length}</span></div>
        <div class="sum-row sum-row--total"><span>Tổng cộng</span><span>${fmt(o.total)}</span></div>
        <div class="timeline"><div class="on">Đã đặt hàng</div><div class="${needTransfer || o.pay === 'cod' ? '' : 'on'}">Đã thanh toán</div><div>Đang giao</div><div>Hoàn tất</div></div>
      </div>
      <div class="hero__ctas" style="justify-content:center"><a href="#/san-pham" class="btn btn--primary">Tiếp tục mua sắm</a><a href="#/tai-khoan" class="btn btn--outline">Theo dõi đơn hàng</a></div>
    </div>`;
  }

  /* =========================================================
     OVERLAYS
     ========================================================= */
  function scrim(on) { $('#scrim').classList.toggle('is-on', on); document.body.style.overflow = on ? 'hidden' : ''; }
  function closeAll() {
    $$('.drawer.is-open, .search-overlay.is-open, .filters.is-open').forEach(d => d.classList.remove('is-open'));
    $('#modal').classList.remove('is-open'); scrim(false);
  }
  function renderCartDrawer() {
    const d = $('#cartDrawer');
    d.innerHTML = `<div class="drawer__head"><h3>Giỏ hàng (${cart.length})</h3><button class="icon-btn" data-close aria-label="Đóng">${ic('close', '')}</button></div>
      ${cart.length ? shipBar() : ''}
      <div class="drawer__body">${cart.length ? cart.map(l => lineItemHTML(l)).join('') : `<div class="empty"><h3>Giỏ hàng trống</h3><p>Hãy chọn vài mẫu vật liệu bạn yêu thích.</p></div>`}</div>
      ${cart.length ? `<div class="drawer__foot"><div class="sum-row sum-row--total" style="border:0;margin:0;padding-top:0"><span>Tạm tính</span><span>${fmt(subtotal())}</span></div>
        <p class="muted" style="font-size:12px;margin-bottom:16px">Phí vận chuyển & mã giảm giá tính ở bước thanh toán</p>
        <a href="#/thanh-toan" class="btn btn--primary btn--block">Thanh toán ${ic('arrow')}</a>
        <a href="#/gio-hang" class="btn btn--outline btn--block" style="margin-top:8px">Xem giỏ hàng</a></div>` : `<div class="drawer__foot"><a href="#/san-pham" class="btn btn--primary btn--block">Khám phá sản phẩm</a></div>`}`;
  }
  function openCart() { renderCartDrawer(); $('#cartDrawer').classList.add('is-open'); scrim(true); }
  function openMobileNav() {
    $('#mobileNav').innerHTML = `<div class="drawer__head"><a href="#/" class="logo"><svg class="logo__mark"><use href="#i-leaf"/></svg><span class="logo__text"><b>GreenHabitat</b></span></a><button class="icon-btn" data-close aria-label="Đóng">${ic('close', '')}</button></div>
      <nav class="mnav"><a href="#/san-pham">Tất cả sản phẩm ${ic('arrow')}</a><div class="sub">${CATS.map(c => `<a href="#/san-pham?cat=${c.id}">${c.name}</a>`).join('')}</div>
      <a href="#/san-pham?room=phong-tam">Không gian</a><a href="#/du-an">Dự án</a><a href="#/gioi-thieu">Về chúng tôi</a><a href="#/lien-he">Liên hệ</a><a href="#/tai-khoan">Tài khoản</a></nav>
      <div style="padding:24px"><button class="btn btn--primary btn--block" data-quote>Nhận báo giá</button><p class="muted" style="margin-top:16px;font-size:13px">${ic('phone')} ${S.hotline}</p></div>`;
    $('#mobileNav').classList.add('is-open'); scrim(true);
  }
  function openSearch() {
    const o = $('#searchOverlay');
    o.innerHTML = `<div class="container"><div style="display:flex;justify-content:flex-end;padding-top:16px"><button class="icon-btn" data-close aria-label="Đóng">${ic('close', '')}</button></div>
      <form class="search-box" id="searchForm">${ic('search', '')}<input id="searchInput" placeholder="Tìm gạch, đá, sàn gỗ, lavabo…" autocomplete="off"></form>
      <div id="searchResults"><div class="search-hints"><span class="muted">Tìm nhiều:</span>${['Terrazzo', 'Marble', 'Sàn gỗ', 'Lavabo', 'Zellige', 'Microcement'].map(t => `<button class="chip-btn chip-btn--plain" data-hint="${t}">${t}</button>`).join('')}</div></div></div>`;
    o.classList.add('is-open'); scrim(true);
    const inp = $('#searchInput'); setTimeout(() => inp.focus(), 50);
    const run = () => {
      const q = inp.value.trim().toLowerCase();
      if (!q) return;
      const r = PRODUCTS.filter(p => (p.name + ' ' + cat(p.cat).name).toLowerCase().includes(q));
      $('#searchResults').innerHTML = r.length ? `<div class="search-results">${r.map(p => `<a class="sr-item" href="#/san-pham/${p.slug}"><span class="t" ${bg(p.tex)}></span><div><b style="font-weight:500">${esc(p.name)}</b><div class="muted" style="font-size:13px">${fmt(p.price)}/${p.unit}</div></div></a>`).join('')}</div>` : `<p class="muted" style="padding:24px 0 40px">Không tìm thấy kết quả cho “${esc(q)}”.</p>`;
    };
    inp.addEventListener('input', run);
    $('#searchForm').addEventListener('submit', e => { e.preventDefault(); location.hash = '#/san-pham?q=' + encodeURIComponent(inp.value.trim()); closeAll(); });
    o.addEventListener('click', e => { const h = e.target.closest('[data-hint]'); if (h) { inp.value = h.dataset.hint; run(); } });
  }
  function openModal(html) { const m = $('#modal'); m.innerHTML = `<div class="modal__box">${html}</div>`; m.classList.add('is-open'); document.body.style.overflow = 'hidden'; }
  function openQuote(ctx, mode = 'quote') {
    const p = ctx && prod(ctx);
    const sample = mode === 'sample', visit = ctx === 'visit';
    const title = sample ? 'Đặt mẫu miễn phí' : visit ? 'Đặt lịch tham quan' : 'Nhận báo giá công trình';
    const desc = sample ? 'Nhận tối đa 5 mẫu vật liệu thật, giao tận nơi trong 48h.' : visit ? 'Chuyên viên sẽ đón tiếp và tư vấn riêng cho bạn.' : 'Báo giá chi tiết trong 24h – chiết khấu tốt cho nhà thầu.';
    openModal(`<div class="modal__side" ${bg(p ? p.tex : CATS[0].tex)}><p class="eyebrow eyebrow--light">GreenHabitat</p><h3>${title}</h3><p style="font-size:13px;opacity:.85;margin-top:8px">${desc}</p></div>
      <form class="modal__main" data-form="quote" novalidate>
        <button type="button" class="icon-btn modal__close" data-close aria-label="Đóng">${ic('close', '')}</button>
        <div class="form-grid" style="margin-top:12px">
          <label class="field">Họ và tên *<input name="name" required><span class="err">Vui lòng nhập họ tên</span></label>
          <label class="field">Số điện thoại *<input name="phone" type="tel" required pattern="0[0-9]{9}"><span class="err">Số điện thoại gồm 10 số</span></label>
          ${sample ? `<label class="field full">Mẫu đã chọn<input value="${p ? esc(p.name) : ''}" placeholder="Tên sản phẩm"></label><label class="field full">Địa chỉ nhận mẫu *<input name="addr" required><span class="err">Nhập địa chỉ</span></label>`
        : visit ? `<label class="field">Ngày *<input type="date" name="date" required><span class="err">Chọn ngày</span></label><label class="field">Khung giờ<select><option>Sáng (8:00 – 11:30)</option><option>Chiều (13:30 – 17:00)</option></select></label>`
          : `<label class="field">Bạn là<select><option>Chủ nhà</option><option>Nhà thầu</option><option>Kiến trúc sư / Thiết kế</option><option>Chủ đầu tư dự án</option></select></label>
            <label class="field">Loại công trình<select><option>Nhà phố / Biệt thự</option><option>Căn hộ</option><option>Khách sạn / Resort</option><option>Văn phòng / Thương mại</option></select></label>
            <label class="field full">Sản phẩm quan tâm<input value="${p ? esc(p.name) : ctx === 'cart' ? 'Toàn bộ giỏ hàng (' + cart.length + ' sản phẩm)' : ''}" placeholder="VD: Gạch 60×60, sàn gỗ sồi…"></label>
            <label class="field">Diện tích dự kiến<div class="suffix"><input type="number" min="0"><span>m²</span></div></label>
            <label class="field">Thời gian thi công<select><option>Trong 1 tháng</option><option>1 – 3 tháng</option><option>Trên 3 tháng</option></select></label>
            <label class="field full">Ghi chú / Đính kèm bản vẽ<textarea placeholder="Mô tả yêu cầu hoặc gửi link bản vẽ"></textarea></label>`}
        </div>
        <button class="btn btn--primary btn--block" style="margin-top:20px">${sample ? 'Gửi yêu cầu mẫu' : visit ? 'Xác nhận lịch hẹn' : 'Gửi yêu cầu báo giá'} ${ic('arrow')}</button>
        <p class="muted" style="font-size:12px;margin-top:10px;text-align:center">Thông tin của bạn được bảo mật theo chính sách quyền riêng tư.</p>
      </form>`);
  }

  /* ---------- forms (generic) ---------- */
  document.addEventListener('submit', e => {
    const f = e.target.closest('[data-form]'); if (!f) return;
    e.preventDefault();
    let ok = true;
    $$('.field', f).forEach(fl => { const i = $('input,select,textarea', fl); if (!i) return; const bad = !i.checkValidity(); fl.classList.toggle('is-invalid', bad); if (bad) ok = false; });
    if (!ok) return;
    if (f.dataset.form === 'quote') closeAll();
    f.reset(); toast('Đã gửi! Chúng tôi sẽ liên hệ trong thời gian sớm nhất.');
  });

  /* ---------- global click delegation ---------- */
  document.addEventListener('click', e => {
    const t = e.target;
    let el;
    if ((el = t.closest('[data-close]')) || t.id === 'scrim' || t.id === 'modal') { closeAll(); return; }
    if ((el = t.closest('[data-add]'))) { e.preventDefault(); addToCart(el.dataset.add); return; }
    if ((el = t.closest('[data-quote]'))) { e.preventDefault(); closeAll(); openQuote(el.dataset.quote); return; }
    if ((el = t.closest('[data-sample]'))) { e.preventDefault(); openQuote(el.dataset.sample, 'sample'); return; }
    if ((el = t.closest('[data-fav]'))) {
      const id = el.dataset.fav; favs = favs.includes(id) ? favs.filter(x => x !== id) : [...favs, id];
      store.set('gh_favs', favs); el.classList.toggle('is-on'); toast(favs.includes(id) ? 'Đã thêm vào yêu thích' : 'Đã bỏ khỏi yêu thích'); return;
    }
    if ((el = t.closest('[data-qty]'))) {
      const l = cart.find(x => x.key === el.dataset.qty), step = prod(l.id).boxM2 || 1;
      l.qty = +(l.qty + step * +el.dataset.d).toFixed(2); if (l.qty <= 0) cart = cart.filter(x => x !== l);
      saveCart(); rerenderCartViews(); return;
    }
    if ((el = t.closest('[data-rm]'))) { cart = cart.filter(x => x.key !== el.dataset.rm); saveCart(); rerenderCartViews(); return; }
    if ((el = t.closest('.acc > button'))) { el.parentElement.classList.toggle('is-open'); return; }
    if ((el = t.closest('.f-group > button'))) { el.parentElement.classList.toggle('is-closed'); return; }
    if (t.closest('#cartBtn')) { openCart(); return; }
    if (t.closest('#searchBtn')) { openSearch(); return; }
    if (t.closest('#menuBtn')) { openMobileNav(); return; }
    if ((el = t.closest('a[href^="#/"]')) && $('.is-open')) closeAll();
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeAll(); });
  function rerenderCartViews() {
    const r = parse().path;
    if (r === 'gio-hang' || r === 'thanh-toan') route();
  }

  /* ---------- reveal on scroll ---------- */
  const io = 'IntersectionObserver' in window ? new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } }), { rootMargin: '0px 0px -8% 0px' }) : null;
  function reveal() { $$('.reveal:not(.is-in)').forEach(el => io ? io.observe(el) : el.classList.add('is-in')); }

  /* ---------- static chrome ---------- */
  function initChrome() {
    $$('[data-site]').forEach(el => el.textContent = S[el.dataset.site] || '');
    $$('a[href="tel:"]').forEach(a => a.href = 'tel:' + S.hotline.replace(/\s/g, ''));
    $('#mega').innerHTML = `<div class="mega__inner">${CATS.map(c => `<a class="mega__cat" href="#/san-pham?cat=${c.id}"><span class="thumb" ${bg(c.tex)}></span><div><b>${c.name}</b><span>${c.short}</span></div></a>`).join('')}
      <a class="mega__promo" href="#/san-pham" ${bg(prod('p08').tex)}><p class="eyebrow eyebrow--light">Mới · 2026</p><h4>Bộ sưu tập Terra</h4><span class="link">Khám phá ${ic('arrow')}</span></a></div>`;
    $('#footerCats').innerHTML = CATS.map(c => `<li><a href="#/san-pham?cat=${c.id}">${c.name}</a></li>`).join('');
    const mi = $('.has-mega');
    $('#mega').addEventListener('click', e => { if (e.target.closest('a')) mi.classList.add('is-hidden'); });
    mi.addEventListener('mouseleave', () => mi.classList.remove('is-hidden'));
    const h = $('#header');
    addEventListener('scroll', () => h.classList.toggle('is-scrolled', scrollY > 10), { passive: true });
    updateCartCount();
  }

  /* ---------- router ---------- */
  function parse() {
    const raw = location.hash.replace(/^#\/?/, '');
    const [path, qs] = raw.split('?');
    const q = Object.fromEntries(new URLSearchParams(qs || ''));
    return { path: path || '', parts: (path || '').split('/'), q };
  }
  const TITLES = { '': 'Vật liệu xây dựng & Trang trí nội thất Đà Nẵng', 'san-pham': 'Sản phẩm', 'du-an': 'Dự án', 'gioi-thieu': 'Về chúng tôi', 'lien-he': 'Liên hệ', 'gio-hang': 'Giỏ hàng', 'thanh-toan': 'Thanh toán', 'dat-hang-thanh-cong': 'Đặt hàng thành công', 'tai-khoan': 'Tài khoản', 'chinh-sach': 'Chính sách' };
  function route() {
    const { path, parts, q } = parse();
    let html, mount;
    switch (parts[0]) {
      case '': html = pageHome(); mount = mountHome; break;
      case 'san-pham':
        if (parts[1]) { html = pageProduct(parts[1]); mount = () => mountProduct(parts[1]); }
        else { html = pageCatalog(q); mount = mountCatalog; }
        break;
      case 'du-an': html = pageProjects(); break;
      case 'gioi-thieu': html = pageAbout(); break;
      case 'lien-he': html = pageContact(); break;
      case 'tai-khoan': html = pageAccount(); break;
      case 'chinh-sach': html = pagePolicy(); break;
      case 'gio-hang': html = pageCart(); mount = () => bindCoupon(route); break;
      case 'thanh-toan': html = pageCheckout(); mount = mountCheckout; break;
      case 'dat-hang-thanh-cong': html = pageSuccess(); break;
      default: html = page404();
    }
    const keepScroll = route._last === path && (path === 'gio-hang' || path === 'thanh-toan');
    route._last = path;
    app.innerHTML = html;
    if (mount) mount();
    const p = parts[1] && PRODUCTS.find(x => x.slug === parts[1]);
    document.title = (p ? p.name : TITLES[parts[0]] || 'GreenHabitat') + ' | GreenHabitat';
    $$('[data-nav]').forEach(a => a.classList.toggle('is-active', a.dataset.nav === parts[0] || (a.dataset.nav === 'khong-gian' && parts[0] === 'san-pham' && q.room)));
    if ($('[data-nav="san-pham"]') && q.room) $('[data-nav="san-pham"]').classList.remove('is-active');
    if (!keepScroll) window.scrollTo({ top: 0, behavior: 'instant' });
    reveal();
  }
  addEventListener('hashchange', route);
  initChrome();
  route();
})();
