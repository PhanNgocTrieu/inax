/* =========================================================
   Texture generator – vẽ bề mặt vật liệu bằng SVG để làm ảnh
   placeholder. Khi có ảnh chụp sản phẩm thật, chỉ cần thay
   tex() bằng URL ảnh.
   ========================================================= */
(function () {
  const cache = new Map();
  const W = 800;

  function rng(seed) {
    let s = (seed * 9301 + 49297) % 233280 || 1;
    return () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
  }
  function rgb(hex) {
    const h = hex.replace('#', '');
    const f = h.length === 3 ? h.split('').map(c => c + c).join('') : h;
    return [0, 2, 4].map(i => parseInt(f.substr(i, 2), 16) / 255);
  }
  function mix(a, b, t) { return a.map((v, i) => v + (b[i] - v) * t); }
  function shade(hex, amt) {
    const c = rgb(hex).map(v => Math.max(0, Math.min(1, v + amt)));
    return '#' + c.map(v => Math.round(v * 255).toString(16).padStart(2, '0')).join('');
  }
  function tables(stops) { // stops: array of [r,g,b]
    return [0, 1, 2].map(ch => stops.map(s => s[ch].toFixed(3)).join(' '));
  }
  function transfer(stops) {
    const [r, g, b] = tables(stops);
    return `<feComponentTransfer><feFuncR type='table' tableValues='${r}'/><feFuncG type='table' tableValues='${g}'/><feFuncB type='table' tableValues='${b}'/></feComponentTransfer>`;
  }
  const GREY = `<feColorMatrix type='matrix' values='0.6 0.6 0.6 0 -0.4 0.6 0.6 0.6 0 -0.4 0.6 0.6 0.6 0 -0.4 0 0 0 0 1'/>`;
  const svg = (inner, defs = '') =>
    `<svg xmlns='http://www.w3.org/2000/svg' width='${W}' height='${W}' viewBox='0 0 ${W} ${W}'><defs>${defs}</defs>${inner}</svg>`;

  function marble({ base, vein, seed = 1 }) {
    const B = rgb(base), V = rgb(vein), N = 72, stops = [];
    for (let i = 0; i < N; i++) {
      let t = 0;
      if (i === 36) t = 0.75;
      else if (i === 35 || i === 37) t = 0.2;
      else if (i === 27 || i === 46) t = 0.22;
      else if (i === 18 || i === 56) t = 0.1;
      const cloud = 0.03 * Math.sin(i / 9);
      stops.push(mix(B.map(v => v + cloud), V, t));
    }
    const contrast = `<feColorMatrix type='matrix' values='2.2 2.2 2.2 0 -2.8 2.2 2.2 2.2 0 -2.8 2.2 2.2 2.2 0 -2.8 0 0 0 0 1'/>`;
    const f = `<filter id='m' x='0' y='0' width='100%' height='100%' color-interpolation-filters='sRGB'><feTurbulence type='fractalNoise' baseFrequency='0.0022 0.0045' numOctaves='4' seed='${seed}' result='n'/><feTurbulence type='fractalNoise' baseFrequency='0.02' numOctaves='2' seed='${seed + 1}' result='d'/><feDisplacementMap in='n' in2='d' scale='40' xChannelSelector='R' yChannelSelector='G'/>${contrast}${transfer(stops)}</filter>`;
    return svg(`<rect width='100%' height='100%' filter='url(#m)'/>`, f);
  }

  function woodFilter(id, base, dark, seed, freq) {
    const B = rgb(base), D = rgb(dark);
    const pat = [0, .25, .55, .2, .05, .4, .75, .3, .08, .2, .5, .12, 0, .35, .65, .22, .05, .3];
    const stops = pat.map(t => mix(B, D, t));
    return `<filter id='${id}' x='0' y='0' width='100%' height='100%' color-interpolation-filters='sRGB'><feTurbulence type='fractalNoise' baseFrequency='${freq}' numOctaves='4' seed='${seed}'/>${GREY}${transfer(stops)}</filter>`;
  }

  function wood({ base, dark, seed = 1 }) {
    const r = rng(seed), rows = 8, h = W / rows;
    let planks = '';
    for (let i = 0; i < rows; i++) {
      const y = i * h, tone = (r() - 0.5) * 0.12;
      planks += `<rect x='0' y='${y}' width='${W}' height='${h}' fill='${tone > 0 ? '#fff' : '#000'}' opacity='${Math.abs(tone).toFixed(3)}'/>`;
      planks += `<rect x='0' y='${y}' width='${W}' height='1.6' fill='#000' opacity='.28'/>`;
      const jx = 120 + r() * 520;
      planks += `<rect x='${jx}' y='${y}' width='1.6' height='${h}' fill='#000' opacity='.25'/>`;
    }
    return svg(`<rect width='100%' height='100%' filter='url(#w)'/>${planks}`,
      woodFilter('w', base, dark, seed, '0.0025 0.11'));
  }

  function travertine({ base, dark, seed = 1 }) {
    const r = rng(seed); let pits = '';
    for (let i = 0; i < 160; i++) {
      pits += `<ellipse cx='${(r() * W).toFixed(0)}' cy='${(r() * W).toFixed(0)}' rx='${(1 + r() * 6).toFixed(1)}' ry='${(0.6 + r() * 1.6).toFixed(1)}' fill='${dark}' opacity='${(0.25 + r() * 0.4).toFixed(2)}'/>`;
    }
    return svg(`<rect width='100%' height='100%' filter='url(#t)'/>${pits}<rect y='398' width='${W}' height='2' fill='#fff' opacity='.5'/>`,
      woodFilter('t', base, shade(dark, 0.08), seed, '0.0012 0.035'));
  }

  function concrete({ base, seed = 1 }) {
    const B = rgb(base), stops = [];
    for (let i = 0; i < 12; i++) stops.push(B.map(v => v + (i / 11 - 0.5) * 0.09));
    const f = `<filter id='c' x='0' y='0' width='100%' height='100%' color-interpolation-filters='sRGB'><feTurbulence type='fractalNoise' baseFrequency='0.006' numOctaves='5' seed='${seed}'/>${GREY}${transfer(stops)}</filter>
      <filter id='g' x='0' y='0' width='100%' height='100%'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' seed='${seed + 3}'/><feColorMatrix type='saturate' values='0'/></filter>`;
    return svg(`<rect width='100%' height='100%' filter='url(#c)'/><rect width='100%' height='100%' filter='url(#g)' opacity='.13'/>`, f);
  }

  function terrazzo({ base, chips, seed = 1, small }) {
    const r = rng(seed); let s = '';
    const n = small ? 1400 : 320, maxR = small ? 5 : 18;
    for (let i = 0; i < n; i++) {
      const cx = r() * W, cy = r() * W, rad = 2 + r() * maxR * (r() > 0.85 ? 1.6 : 1), k = 5 + Math.floor(r() * 3);
      let pts = '';
      for (let j = 0; j < k; j++) {
        const a = (j / k) * Math.PI * 2 + r() * 0.6, rr = rad * (0.55 + r() * 0.5);
        pts += `${(cx + Math.cos(a) * rr).toFixed(1)},${(cy + Math.sin(a) * rr).toFixed(1)} `;
      }
      s += `<polygon points='${pts}' fill='${chips[Math.floor(r() * chips.length)]}'/>`;
    }
    const f = `<filter id='g' x='0' y='0' width='100%' height='100%'><feTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2' seed='${seed}'/><feColorMatrix type='saturate' values='0'/></filter>`;
    return svg(`<rect width='100%' height='100%' fill='${base}'/>${s}<rect width='100%' height='100%' filter='url(#g)' opacity='.08'/>`, f);
  }

  function tile({ colors, w = 100, h = 100, grout = '#ddd', gloss, seed = 1 }) {
    const r = rng(seed); let s = ''; const g = 3;
    for (let y = 0; y < W; y += h) for (let x = 0; x < W; x += w) {
      const off = (Math.floor(y / h) % 2) * (w / 2);
      const c = shade(colors[Math.floor(r() * colors.length)], (r() - 0.5) * 0.08);
      s += `<rect x='${x - off + g / 2}' y='${y + g / 2}' width='${w - g}' height='${h - g}' rx='2' fill='${c}'/>`;
      if (off) s += `<rect x='${W - off + g / 2}' y='${y + g / 2}' width='${w - g}' height='${h - g}' rx='2' fill='${c}'/>`;
      if (gloss) s += `<ellipse cx='${x - off + w * (0.3 + r() * 0.4)}' cy='${y + h * (0.25 + r() * 0.5)}' rx='${w * 0.35}' ry='${h * 0.25}' fill='url(#gl)'/>`;
    }
    const defs = `<radialGradient id='gl'><stop offset='0' stop-color='#fff' stop-opacity='.22'/><stop offset='1' stop-color='#fff' stop-opacity='0'/></radialGradient>`;
    return svg(`<rect width='100%' height='100%' fill='${grout}'/>${s}`, defs);
  }

  function pattern({ a, b, c }) {
    const t = 200;
    const motif = `<rect width='${t}' height='${t}' fill='${a}'/>
      <path d='M0 0h50a50 50 0 0 1-50 50zM${t} 0v50a50 50 0 0 1-50-50zM0 ${t}v-50a50 50 0 0 1 50 50zM${t} ${t}h-50a50 50 0 0 1 50-50z' fill='${b}'/>
      <path d='M100 28 172 100 100 172 28 100z' fill='none' stroke='${b}' stroke-width='6'/>
      <path d='M100 58 142 100 100 142 58 100z' fill='${c}'/>
      <circle cx='100' cy='100' r='12' fill='${a}'/>
      <rect x='0.5' y='0.5' width='${t - 1}' height='${t - 1}' fill='none' stroke='#000' stroke-opacity='.12'/>`;
    const defs = `<pattern id='p' width='${t}' height='${t}' patternUnits='userSpaceOnUse'>${motif}</pattern>
      <filter id='g' x='0' y='0' width='100%' height='100%'><feTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='2'/><feColorMatrix type='saturate' values='0'/></filter>`;
    return svg(`<rect width='100%' height='100%' fill='url(#p)'/><rect width='100%' height='100%' filter='url(#g)' opacity='.1'/>`, defs);
  }

  function slats({ base, dark, seed = 1 }) {
    const sw = 50; let s = '';
    for (let x = 0; x < W; x += sw) {
      s += `<rect x='${x}' width='${sw - 10}' height='${W}' fill='url(#sl)'/><rect x='${x + sw - 10}' width='10' height='${W}' fill='${dark}'/>`;
    }
    const defs = `<linearGradient id='sl' x1='0' x2='1'><stop offset='0' stop-color='#fff' stop-opacity='.16'/><stop offset='.6' stop-color='#fff' stop-opacity='0'/><stop offset='1' stop-color='#000' stop-opacity='.25'/></linearGradient>`
      + woodFilter('w', base, shade(base, -0.12), seed, '0.09 0.004');
    return svg(`<rect width='100%' height='100%' filter='url(#w)'/>${s}`, defs);
  }

  function illus({ kind, bg }) {
    const floor = shade(bg, -0.06);
    const defs = `<radialGradient id='sh'><stop offset='0' stop-color='#000' stop-opacity='.28'/><stop offset='1' stop-color='#000' stop-opacity='0'/></radialGradient>
      <linearGradient id='cer' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='#ffffff'/><stop offset='.6' stop-color='#f1efeb'/><stop offset='1' stop-color='#d9d5ce'/></linearGradient>
      <linearGradient id='cerIn' x1='0' y1='0' x2='0' y2='1'><stop offset='0' stop-color='#cfcac2'/><stop offset='1' stop-color='#f6f4f0'/></linearGradient>
      <linearGradient id='gold' x1='0' y1='0' x2='1' y2='0'><stop offset='0' stop-color='#8a6a35'/><stop offset='.35' stop-color='#e2c58c'/><stop offset='.55' stop-color='#c9a463'/><stop offset='1' stop-color='#7a5c2c'/></linearGradient>
      <linearGradient id='wall' x1='0' y1='0' x2='0' y2='1'><stop offset='0' stop-color='${shade(bg, 0.03)}'/><stop offset='1' stop-color='${bg}'/></linearGradient>`;
    let scene = `<rect width='${W}' height='560' fill='url(#wall)'/><rect y='560' width='${W}' height='240' fill='${floor}'/>`;
    if (kind === 'basin') {
      scene += `<rect x='90' y='470' width='620' height='46' fill='#9a7350'/><rect x='90' y='510' width='620' height='8' fill='#000' opacity='.18'/>
        <ellipse cx='400' cy='478' rx='190' ry='16' fill='url(#sh)'/>
        <path d='M230 410 Q230 472 400 474 Q570 472 570 410 Z' fill='url(#cer)'/>
        <ellipse cx='400' cy='410' rx='170' ry='34' fill='#fbfaf8'/><ellipse cx='400' cy='412' rx='150' ry='25' fill='url(#cerIn)'/>
        <rect x='388' y='250' width='24' height='140' rx='6' fill='#2b2b2b'/><path d='M400 258 h70 a10 10 0 0 1 10 10 v20' stroke='#2b2b2b' stroke-width='20' fill='none' stroke-linecap='round'/>`;
    } else if (kind === 'toilet') {
      scene += `<ellipse cx='400' cy='640' rx='190' ry='22' fill='url(#sh)'/>
        <path d='M300 300 h220 a16 16 0 0 1 16 16 v120 h-252 v-120 a16 16 0 0 1 16-16z' fill='url(#cer)'/>
        <path d='M250 440 h330 q20 0 18 22 q-12 92 -110 112 l-14 64 h-140 l-6 -68 q-80 -26 -96 -108 q-2 -22 18 -22z' fill='url(#cer)'/>
        <rect x='250' y='432' width='348' height='16' rx='8' fill='#fbfaf8'/><rect x='392' y='310' width='36' height='8' rx='4' fill='#b9b3aa'/>`;
    } else {
      scene += `<rect x='0' y='540' width='${W}' height='60' fill='#e8e4dd'/><rect x='0' y='596' width='${W}' height='6' fill='#000' opacity='.2'/>
        <ellipse cx='400' cy='548' rx='120' ry='10' fill='url(#sh)'/>
        <rect x='362' y='520' width='76' height='24' rx='6' fill='url(#gold)'/>
        <rect x='378' y='250' width='44' height='280' rx='20' fill='url(#gold)'/>
        <path d='M400 270 q0 -90 120 -90 q60 0 60 70 v30' stroke='url(#gold)' stroke-width='30' fill='none' stroke-linecap='round'/>
        <rect x='418' y='360' width='90' height='16' rx='8' fill='url(#gold)'/>`;
    }
    return svg(scene, defs);
  }

  const makers = { marble, wood, travertine, concrete, terrazzo, tile, pattern, slats, illus };

  /** Trả về chuỗi CSS url(...) */
  window.tex = function (spec) {
    const key = JSON.stringify(spec);
    if (!cache.has(key)) {
      const raw = makers[spec.t](spec);
      const enc = encodeURIComponent(raw.replace(/\s+/g, ' ')).replace(/'/g, '%27').replace(/\(/g, '%28').replace(/\)/g, '%29');
      cache.set(key, `url('data:image/svg+xml;charset=utf-8,${enc}')`);
    }
    return cache.get(key);
  };
})();
