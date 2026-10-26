(() => {
  const D = window.FAUNA;
  const $ = (s, el = document) => el.querySelector(s);
  const h = (tag, attrs = {}, html = '') => { const e = document.createElement(tag); for (const k in attrs) e.setAttribute(k, attrs[k]); e.innerHTML = html; return e; };

  // 1u = 화면 폭 / 1440 (스크롤바 제외)
  const setU = () => {
    const r = document.documentElement.style;
    r.setProperty('--u', document.documentElement.clientWidth / 1440 + 'px');
    r.setProperty('--v', innerHeight / 665 + 'px'); // 노트북 화면(약 2.17:1) 기준 세로 단위
  };
  setU(); addEventListener('resize', setU);

  const reveal = new IntersectionObserver((es) => es.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add('in'); reveal.unobserve(e.target); }
  }), { rootMargin: '0px 0px -12% 0px' });

  // 확대 보기
  const lb = h('div', { class: 'lightbox' });
  document.body.appendChild(lb);
  const openLb = (src) => { lb.innerHTML = `<img src="${src}" alt="">`; lb.classList.add('open'); };
  lb.addEventListener('click', () => lb.classList.remove('open'));
  addEventListener('keydown', (e) => { if (e.key === 'Escape') { lb.classList.remove('open'); closePanel && closePanel(); } });

  let closePanel = null;

  /* ---------- index: 커버 + 상세 ---------- */
  const cover = $('.cover');
  if (cover) {
    // 배경 듀오톤 노이즈 타일: 1.9px 알갱이 중 32%에 짙은 자주 / 25% 핑크를 번갈아 찍음
    const nc = document.createElement('canvas'); nc.width = nc.height = 512;
    const g = nc.getContext('2d'); const cell = 2;
    for (let y = 0; y < 512; y += cell) for (let x = 0; x < 512; x += cell) {
      if (Math.random() > 0.32) continue;
      g.fillStyle = Math.random() < 0.6 ? 'rgba(54,43,47,0.55)' : `rgba(216,130,130,${(0.06 + Math.random() * 0.1).toFixed(2)})`;
      g.fillRect(x, y, cell, cell);
    }
    cover.style.setProperty('--noise', `url(${nc.toDataURL()})`);
    // 텍스처 강도도 화면 폭에 비례
    const disp = $('#texture feDisplacementMap'), turb = $('#texture feTurbulence');
    const fitTexture = () => { const u = document.documentElement.clientWidth / 1440; disp.setAttribute('scale', (5 * u).toFixed(2)); turb.setAttribute('baseFrequency', (0.45 / u).toFixed(3)); };
    fitTexture(); addEventListener('resize', fitTexture);

    for (const [cls, s] of [['top', D.stripTop], ['bottom', D.stripBottom]]) {
      const strip = h('div', { class: 'strip ' + cls, 'aria-hidden': 'true' });
      s.tiles.forEach((t, i) => {
        const cell = h('span', { class: 'cell' }, `<img src="assets/tiles/${t}.webp" alt="">`);
        cell.firstChild.style.setProperty('--op', s.opacity[i]);
        cell.style.transitionDelay = (cls === 'top' ? i : 19 - i) * 45 + 'ms';
        strip.appendChild(cell);
      });
      cover.appendChild(strip);
    }
    requestAnimationFrame(() => setTimeout(() => cover.classList.add('ready'), 60));
  }

  const images = $('.images');
  if (images) {
    D.illust.forEach(({ n: num, ar }, i) => {
      const n = String(num).padStart(2, '0');
      const fig = h('figure', { style: `aspect-ratio:${ar}` }, `<img src="assets/illust/${n}.webp" alt="Strange Fauna ${String(i + 1).padStart(2, '0')}" loading="lazy" decoding="async">`);
      fig.dataset.i = i;
      images.appendChild(fig);
      reveal.observe(fig);
    });

    // Show Grid ↔ Show List
    const gridBtn = $('.show-grid');
    gridBtn.addEventListener('click', () => {
      const on = images.classList.toggle('grid');
      gridBtn.textContent = on ? 'Show List' : 'Show Grid';
      images.querySelectorAll('figure').forEach((f) => f.classList.add('in'));
      $('.detail').scrollIntoView({ behavior: 'smooth' });
    });
    images.addEventListener('click', (e) => {
      const fig = e.target.closest('figure');
      if (!fig || !images.classList.contains('grid')) return;
      images.classList.remove('grid'); gridBtn.textContent = 'Show Grid';
      requestAnimationFrame(() => fig.scrollIntoView({ behavior: 'smooth', block: 'center' }));
    });

    $('.back').addEventListener('click', (e) => { e.preventDefault(); scrollTo({ top: 0, behavior: 'smooth' }); });

    // 패키지 패널: 3개 중 어디로 넘어가는지 표시
    const btn = $('.pk-btn'), panel = $('.pk-panel'), hint = $('.pk-hint');
    D.packages.forEach((p) => {
      const row = h('a', { class: 'pk-row', href: `package.html?id=${p.id}` },
        `<img src="assets/pkg/${p.key}-big1.webp" alt="">
         <div><div class="no">${p.no}</div><div class="nm">${p.name}</div><div class="sub">${p.nav}</div></div>
         <span class="go">→</span>`);
      row.addEventListener('mouseenter', () => { hint.innerHTML = `<b>${p.name}</b> 페이지로 이동합니다`; });
      panel.insertBefore(row, hint);
    });
    const defaultHint = '패키지를 골라 주세요 — 3개';
    hint.textContent = defaultHint;
    panel.addEventListener('mouseleave', () => { hint.textContent = defaultHint; });
    closePanel = () => { panel.classList.remove('open'); btn.classList.remove('on'); btn.setAttribute('aria-expanded', 'false'); };
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const open = panel.classList.toggle('open');
      btn.classList.toggle('on', open); btn.setAttribute('aria-expanded', String(open));
    });
    document.addEventListener('click', (e) => { if (!panel.contains(e.target)) closePanel(); });
  }

  /* ---------- package.html: 3단 그리드 ---------- */
  const board = $('.board');
  if (board) {
    const id = new URLSearchParams(location.search).get('id');
    const idx = Math.max(0, D.packages.findIndex((p) => p.id === id));
    const P = D.packages[idx];
    document.title = `${P.name} — Package`;
    const px = (v) => `calc(${v} * var(--u))`;
    const put = (el, x, y, w) => { el.style.left = px(x); el.style.top = px(y); if (w) el.style.width = px(w); board.appendChild(el); return el; };
    const rule = (x, y, w, cls = '') => put(h('div', { class: 'rule ' + cls }), x, y, w);
    const C1 = 118, C2 = 747, C3 = 1061, BW = 602, SW = 288;

    // 헤더
    rule(C1, 65, BW, 'thick'); rule(C2, 65, SW, 'thick'); rule(C3, 65, SW, 'thick');
    put(h('div', { class: 'lbl' }, 'Package Design + Illustration'), C1, 82);
    put(h('div', { class: 'lbl b' }, 'Navigation'), C2, 82);
    put(h('div', { class: 'lbl b' }, 'Categories'), C3, 82);
    rule(C2, 111, SW, 'dot'); rule(C3, 111, SW, 'dot');
    put(h('div', { class: 'list' }, `<a href="index.html#detail">(Overview)</a><br>Package <span class="g">— ${P.nav}</span><br><a href="#stickers">Stickers</a>`), C2, 122);
    put(h('div', { class: 'list' }, D.packages.map((q, i) => `<a href="package.html?id=${q.id}" class="${i === idx ? '' : 'dim'}">${q.no}. ${q.name}</a>`).join('<br>')), C3, 122);
    rule(C2, 211, SW, 'thick'); rule(C3, 211, SW, 'thick');
    const logo = put(h('a', { class: 'logo', href: 'index.html' }, `${P.logo[0]}<i>  ${P.logo[1]}  </i>${P.logo[2]}`), C1, 186);
    rule(C1, 257, 1231, 'thick');
    put(h('a', { class: 'lbl', href: '#palette' }, '+&nbsp;&nbsp;Show colour overview'), C3, 305);

    const photo = (slot, x, y, w, ht) => {
      const el = put(h('div', { class: 'ph' }, `<img src="assets/pkg/${P.key}-${slot}.webp" alt="${P.name} ${slot}" loading="lazy">`), x, y, w);
      el.style.height = px(ht); reveal.observe(el);
      el.addEventListener('click', () => openLb($('img', el).src));
      return el;
    };
    const cap = (x, y, w, [t, c], close) => { rule(x, y, w); put(h('div', { class: 'cap' }, `<b>${t}</b> - ${c}`), x, y + 12); if (close) rule(x, y + 42, w); };
    const more = (x, y, src) => { const a = put(h('button', { class: 'more' }, '····&nbsp;&nbsp;Enlarge'), x, y); a.addEventListener('click', () => openLb(src)); };
    const desc = (s, x, y) => put(h('p', { class: 'pdesc ko' }, s), x, y);
    const src = (slot) => `assets/pkg/${P.key}-${slot}.webp`;

    // 1행
    photo('big1', C1, 367, BW, 470); cap(C1, 851, BW, P.caps.big1); more(C1 + 300, 864, src('big1'));
    photo('s1', C2, 367, SW, 222); cap(C2, 616, SW, P.caps.s1, true); desc(P.desc[0], C2, 674);
    rule(C2, 851, SW); more(C2, 864, src('s1'));
    photo('c3a', C3, 367, SW, 222); photo('c3b', C3, 615, SW, 222); cap(C3, 851, SW, P.caps.c3);
    // 2행
    const st = photo('s2', C1, 963, SW, 222); st.id = 'stickers';
    cap(C1, 1212, SW, P.caps.s2, true); desc(P.desc[1], C1, 1270); rule(C1, 1447, SW); more(C1, 1460, src('s2'));
    const CB = C1 + SW + 26;
    const sw = put(h('div', { class: 'swatch', id: 'palette' }, P.palette.map(([n, c]) => `<span title="${n} ${c}" style="background:${c}"></span>`).join('')), CB, 963, SW);
    sw.style.height = px(222);
    cap(CB, 1212, SW, ['Colour Palette', `${P.palette.length} colours`], true);
    put(h('div', { class: 'codes' }, P.palette.map(([n, c]) => `<b>${n}</b>${c}`).join('<br>')), CB, 1270);
    rule(CB, 1447, SW);
    photo('big2', C2, 963, BW, 470); cap(C2, 1447, BW, P.caps.big2); more(C2 + 300, 1460, src('big2'));
  }
})();
