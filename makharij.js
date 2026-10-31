/* Makharijul Huruf: penampang samping mulut, rongga mulut, tenggorokan & hidung yang bergerak.
 * 17 makhraj (1 jauf + 3 halq + 10 lisan + 2 bibir + 1 khaisyum). Lidah, bibir, dan penanda bergerak halus ke posisi tiap huruf.
 * Fitur: ketuk huruf / titik, tur otomatis, kuis tebak makhraj. 100% offline, tanpa pustaka luar. */
window.makeMakharijView = function (d) {
  const { $, esc, view, setTitle } = d;
  const AREA = { j: ['Al-Jauf', '#3b82f6'], h: ['Al-Halq (tenggorokan)', '#ef4444'], l: ['Al-Lisan (lidah)', '#0d9488'], s: ['Asy-Syafatain (bibir)', '#ec4899'], k: ['Al-Khaisyum (hidung)', '#8b5cf6'] };
  /* a=area, n=nama, g=sebutan, L=huruf, pt=titik di gambar, p=pose (hx,w: bonggol lidah; touch: menempel langit-langit; tx,ty: ujung lidah; tip: ujung menempel gusi; lip: tinggi bibir bawah) */
  const MK = [
    { a: 'j', n: 'Rongga mulut & tenggorokan', g: 'Jauf', L: 'اوي', pt: [235, 172], p: { lip: 205, ty: 200 }, w: 'Rongga kosong di dalam mulut dan tenggorokan, tanpa titik sentuh tertentu.', c: 'Alif: mulut terbuka. Wawu: bibir membulat. Ya: bibir melebar. Ketiganya adalah huruf mad, panjangkan 2 harakat.', t: 'Bunyi berhenti saat napas habis, bukan karena lidah atau bibir menutup.' },
    { a: 'h', n: 'Pangkal tenggorokan', g: 'Halqiyyah', L: 'ءه', pt: [154, 262], p: { tx: 272, ty: 208, hx: 200, w: 30, h: 0 }, th: 1, w: 'Bagian tenggorokan paling bawah, dekat dada, tempat pita suara.', c: 'Hamzah: pita suara menutup lalu lepas mendadak. Ha: hembusan napas ringan tanpa getaran.', t: 'Hamzah itu tegas dan singkat; jangan diganti “k” atau dibuang.' },
    { a: 'h', n: 'Tengah tenggorokan', g: 'Halqiyyah', L: 'عح', pt: [152, 230], p: { tx: 272, ty: 208, hx: 200, w: 30, h: 0 }, th: 1, w: 'Bagian tengah tenggorokan.', c: '‘Ain: bersuara, tenggorokan menyempit seperti tercekik ringan. Ha (ح): hembusan tanpa suara, seperti menghembus kaca agar berembun.', t: 'Jangan diganti “a” atau “h” biasa; rasakan getaran di tengah leher.' },
    { a: 'h', n: 'Ujung tenggorokan', g: 'Halqiyyah', L: 'غخ', pt: [150, 196], p: { tx: 276, ty: 204, hx: 190, w: 22, h: 14 }, th: 1, w: 'Bagian tenggorokan paling atas, dekat pangkal lidah.', c: 'Kha: gesekan kasar tanpa getaran. Ghain: gesekan dengan getaran, seperti berkumur ringan.', t: 'Keduanya tebal (tafkhim): rahang sedikit turun, bunyi dari belakang.' },
    { a: 'l', n: 'Pangkal lidah paling belakang', g: 'Lahawiyyah', L: 'ق', pt: [184, 134], p: { hx: 184, w: 30, touch: 1, tx: 276, ty: 206 }, w: 'Pangkal lidah paling belakang bertemu langit-langit lunak di atasnya.', c: 'Pangkal lidah naik menempel langit-langit lunak, lalu dilepas dengan tekanan.', t: 'Tebal (tafkhim) dan lebih dalam daripada kaf.' },
    { a: 'l', n: 'Pangkal lidah agak ke depan', g: 'Lahawiyyah', L: 'ك', pt: [214, 124], p: { hx: 214, w: 24, touch: 1, tx: 276, ty: 204 }, w: 'Sedikit di depan makhraj qaf, bertemu langit-langit keras di atasnya.', c: 'Bagian pangkal lidah yang lebih ke depan menempel langit-langit, lalu dilepas ringan.', t: 'Tipis (tarqiq): lebih ke depan dan lebih ringan dari qaf.' },
    { a: 'l', n: 'Tengah lidah', g: 'Syajariyyah', L: 'جشي', pt: [250, 122], p: { hx: 250, w: 30, touch: 1, tx: 276, ty: 202 }, w: 'Tengah lidah bertemu langit-langit keras tepat di atasnya.', c: 'Jim: menempel lalu lepas. Syin: desis lebar. Ya (berharakat/sukun): ringan di tengah lidah.', t: 'Syin mendesis dengan ujung lidah tetap turun; jangan jadi “s”.' },
    { a: 'l', n: 'Tepi lidah + geraham atas', g: 'Hafiyyah', L: 'ض', pt: [226, 126], side: 1, p: { hx: 232, w: 34, h: 40, tx: 288, ty: 176 }, w: 'Salah satu tepi lidah (biasanya kiri), atau kedua tepi, dari pangkal hingga dekat ujung menempel geraham atas.', c: 'Tepi lidah melebar menempel geraham atas, bunyi keluar dari sisi. Di gambar ditandai garis putus karena letaknya di sisi lidah, bukan di tengah.', t: 'Tebal. Bunyi “d” tebal yang agak “l”; paling khas dan paling sulit.' },
    { a: 'l', n: 'Tepi & ujung lidah depan', g: 'Dzalqiyyah', L: 'ل', pt: [293, 140], p: { tx: 293, tip: 1, hx: 240, w: 30, h: 8 }, w: 'Tepi lidah bagian depan sampai ujung lidah bertemu gusi atas (di depan makhraj dhad).', c: 'Ujung lidah menempel gusi atas, udara keluar lewat kedua sisi lidah.', t: 'Lam di “Allah” dibaca tebal bila didahului fathah/dhammah.' },
    { a: 'l', n: 'Ujung lidah + gusi atas', g: 'Dzalqiyyah', L: 'ن', pt: [289, 138], p: { tx: 289, tip: 1, hx: 240, w: 30, h: 4 }, w: 'Ujung lidah (sedikit di bawah makhraj lam) bertemu gusi atas.', c: 'Ujung lidah menempel gusi atas, suara mengalir lewat hidung (ghunnah).', t: 'Nun mati bertemu ikhfa’ tidak menempel; ujung lidah mendekat saja.' },
    { a: 'l', n: 'Ujung lidah agak ke dalam', g: 'Dzalqiyyah', L: 'ر', pt: [284, 136], p: { tx: 284, tip: 1, hx: 240, w: 30, h: 4 }, w: 'Ujung lidah sedikit masuk ke punggungnya, lebih ke dalam daripada nun, bertemu gusi atas.', c: 'Ujung lidah bergetar ringan menyentuh gusi atas.', t: 'Satu ketukan saja, tidak digulung panjang.' },
    { a: 'l', n: 'Ujung lidah + pangkal gigi seri atas', g: 'Nith’iyyah', L: 'طدت', pt: [298, 142], p: { tx: 298, tip: 1, hx: 245, w: 30, h: 6 }, w: 'Ujung lidah bertemu pangkal gigi seri atas (gusi).', c: 'Ujung lidah menempel, lalu dilepas. Tha (ط) tebal dengan lidah ditekan naik.', t: 'Ta dan dal tipis; tha tebal dan lebih menekan.' },
    { a: 'l', n: 'Ujung lidah + gigi seri bawah', g: 'Asaliyyah', L: 'صسز', pt: [302, 182], p: { tx: 296, ty: 190, hx: 246, w: 30, h: 10 }, w: 'Ujung lidah mendekati bagian atas gigi seri bawah, dengan celah sempit untuk desis.', c: 'Ujung lidah di belakang gigi seri bawah, udara mendesis lewat celah gigi.', t: 'Shad tebal (bibir agak membulat); sin dan zay tipis.' },
    { a: 'l', n: 'Ujung lidah + ujung gigi seri atas', g: 'Litsawiyyah', L: 'ظذث', pt: [310, 152], p: { tx: 308, ty: 156, hx: 245, w: 30, h: 10 }, w: 'Ujung lidah bertemu ujung gigi seri atas.', c: 'Ujung lidah keluar sedikit, tersentuh ujung gigi atas. Tsa tanpa suara, dzal dan zha bersuara.', t: 'Seperti “th” bahasa Inggris. Zha lebih tebal dari dzal.' },
    { a: 's', n: 'Bibir bawah + gigi seri atas', g: 'Syafawiyyah', L: 'ف', pt: [318, 156], p: { lip: 152, tx: 280, ty: 198 }, w: 'Perut bibir bawah bertemu ujung gigi seri atas.', c: 'Gigi atas menyentuh bibir bawah, udara mendesis lewat celah.', t: 'Jangan menggigit bibir terlalu keras; cukup menyentuh.' },
    { a: 's', n: 'Dua bibir', g: 'Syafawiyyah', L: 'وبم', pt: [330, 140], p: { lip: 142, tx: 280, ty: 198 }, w: 'Kedua bibir. Ba: bagian basah bibir bertemu. Mim: bagian kering bertemu. Wawu: bibir membulat tanpa bertemu.', c: 'Ba lepas ringan; mim ditutup sambil berdengung lewat hidung; wawu membulat.', t: 'Wawu berharakat dibulatkan, bibir tidak merapat penuh.' },
    { a: 'k', n: 'Rongga hidung', g: 'Khaisyumiyyah', L: '', pt: [235, 92], p: { lip: 142, tx: 280, ty: 198 }, nose: 1, w: 'Pangkal hidung dan rongga hidung, tempat keluar dengung (ghunnah).', c: 'Ghunnah pada nun dan mim bertasydid, idgham bighunnah, ikhfa’, dan iqlab keluar dari sini. Panjang sekitar 2 harakat.', t: 'Cek: tutup hidungmu saat ghunnah; bunyi harus terputus.' }
  ];
  const LET = 'ءابتثجحخدذرزسشصضطظعغفقكلمنهوي';
  const OWN = { 'ا': 0, 'و': 15, 'ي': 6 }, lidx = c => (c in OWN ? OWN[c] : MK.findIndex(m => m.L.includes(c)));
  const PAL = [[168, 170], [174, 148], [184, 134], [196, 128], [230, 121], [260, 124], [285, 131], [306, 140]];
  const py = x => { if (x <= PAL[0][0]) return PAL[0][1]; for (let i = 1; i < PAL.length; i++) if (x <= PAL[i][0]) { const a = PAL[i - 1], b = PAL[i]; return a[1] + (b[1] - a[1]) * (x - a[0]) / (b[0] - a[0]); } return 142; };
  const REST = { hx: 230, w: 30, h: 0, tx: 286, ty: 197, lip: 200 };
  const resolve = p => {
    const s = Object.assign({}, REST, p), b = x => 212 - 16 * ((x - 176) / (s.tx - 176));
    if (p.touch) s.h = Math.max(0, b(s.hx) - py(s.hx) - 4);
    if (p.tip) s.ty = py(s.tx) + 6;
    return s;
  };
  const ftop = (s, x) => { const t = (x - 176) / (s.tx - 176); return 212 - 16 * t - s.h * Math.exp(-(((x - s.hx) / s.w) ** 2)) + (s.ty - 197) * t ** 3; };
  const tonguePath = s => {
    const top = [], th = t => 14 + 24 * (1 - t);
    for (let x = 178; x < s.tx; x += 6) top.push([x, ftop(s, x)]);
    top.push([s.tx, s.ty]);
    const bot = []; for (let x = s.tx - 4; x >= 178; x -= 10) { const t = (x - 176) / (s.tx - 176), bp = s.h * Math.exp(-(((x - s.hx) / s.w) ** 2)); bot.push([x, 212 - 16 * t - 0.45 * bp + 0.7 * (s.ty - 197) * t ** 3 + th(t) + 4]); }
    const f = a => a.map(q => q[0].toFixed(1) + ' ' + q[1].toFixed(1)).join('L');
    return 'M' + f(top) + 'Q' + (s.tx + 9).toFixed(1) + ' ' + (s.ty + 7).toFixed(1) + ' ' + f([bot[0]]) + 'L' + f(bot.slice(1)) + 'L176 260Z';
  };
  const svgHTML = () => `<svg id="mkSvg" viewBox="40 20 360 300" role="img" aria-label="Penampang samping mulut: lidah, langit-langit, tenggorokan, bibir, dan hidung" class="mk-svg">
    <defs><radialGradient id="mkG"><stop offset="0" stop-color="#fbbf24" stop-opacity=".9"/><stop offset="1" stop-color="#fbbf24" stop-opacity="0"/></radialGradient></defs>
    <path class="mk-head" d="M95 316C60 250 50 120 110 54C170 2 290 10 330 64C345 86 352 100 368 118C372 124 362 128 352 128M352 208C354 232 342 252 318 264L250 300L238 316"/>
    <path class="mk-nasal" d="M200 112C225 70 300 70 336 110L306 128L198 120Z"/>
    <g id="mkNs" class="mk-air"><path d="M214 104C250 84 300 88 322 106" fill="none"/><path d="M322 106l-9-1M322 106l-3-8" fill="none"/></g>
    <path class="mk-wall" d="M140 128C128 170 128 230 138 262L138 316M172 236L172 316M172 214C160 204 160 192 168 186"/>
    <path class="mk-pal" d="M307 141C280 128 230 119 196 127C178 133 166 150 168 172"/>
    <path class="mk-floor" d="M308 206L250 232L186 262"/>
    <path id="mkTg" class="mk-tg"/>
    <g id="mkVf" class="mk-vf"><path d="M138 262L150 262M172 262L162 262"/></g>
    <rect class="mk-tooth" x="301" y="131" width="11" height="28" rx="4"/><rect class="mk-tooth" x="300" y="177" width="11" height="26" rx="4"/>
    <ellipse class="mk-lip" cx="329" cy="128" rx="17" ry="11"/><ellipse id="mkLl" class="mk-lip" cx="329" cy="205" rx="17" ry="10"/>
    <g id="mkJa" class="mk-air"><path d="M175 240C200 150 270 150 330 172" fill="none" stroke-dasharray="5 5"/></g>
    <g class="mk-lab"><text x="236" y="92" text-anchor="middle">Rongga hidung</text><text x="226" y="146" text-anchor="middle">Langit-langit keras</text><text x="164" y="118" text-anchor="end">Langit-langit lunak</text><text x="222" y="226" text-anchor="middle">Lidah</text><text x="108" y="238" text-anchor="end">Tenggorokan</text><text x="112" y="272" text-anchor="end">Pita suara</text><text x="304" y="228" text-anchor="middle">Gigi</text><text x="360" y="160">Bibir</text></g>
    <g id="mkDots"></g>
    <g id="mkPt" class="mk-ptg"><circle class="mk-halo" r="16" fill="url(#mkG)"/><circle class="mk-ring" r="9"/><circle class="mk-core" r="4.5"/></g>
    <path id="mkSide" class="mk-side" d="M205 128L248 128" hidden/>
  </svg>`;

  /* Suara huruf (audio/huruf/*.mp3, MIT: github.com/awahids/belajar-ngaji). Diambil lewat fetch -> blob agar jalan offline & di iOS. */
  const AUD = { 'ء': 'hamzah', 'ا': 'alif', 'ب': 'ba', 'ت': 'ta', 'ث': 'tsa', 'ج': 'jim', 'ح': 'hha', 'خ': 'kho', 'د': 'dal', 'ذ': 'dza', 'ر': 'ro', 'ز': 'zay', 'س': 'sin', 'ش': 'syin', 'ص': 'shod', 'ض': 'dhod', 'ط': 'tho', 'ظ': 'dhzo', 'ع': 'ain', 'غ': 'ghoin', 'ف': 'fa', 'ق': 'qof', 'ك': 'kaf', 'ل': 'lam', 'م': 'mim', 'ن': 'nun', 'ه': 'ha', 'و': 'waw', 'ي': 'ya' };
  const blobs = {}; let audio = null, seq = 0, sound = true;
  try { sound = localStorage.getItem('mkSound') !== '0'; } catch (e) {}
  const stopAudio = () => { seq++; if (audio) { audio.pause(); audio = null; } };
  const playOne = async c => {
    const f = AUD[c]; if (!f) return;
    try {
      if (!blobs[f]) { const r = await fetch('audio/huruf/' + f + '.mp3'); blobs[f] = URL.createObjectURL(await r.blob()); }
      await new Promise(res => { const a = new Audio(blobs[f]); audio = a; a.onended = a.onerror = res; a.play().catch(res); });
    } catch (e) {}
  };
  const say = async (letters, force) => {
    if (!sound && !force) return; stopAudio(); const my = seq;
    for (const c of letters) { if (my !== seq) return; await playOne(c); if (my !== seq) return; await new Promise(r => setTimeout(r, 180)); }
  };
  const lettersOf = i => (MK[i].L || 'نم').split('');
  let sel = 0, cur = resolve(MK[0].p), anim = 0, tour = 0, quiz = null;
  const draw = s => {
    $('#mkTg').setAttribute('d', tonguePath(s));
    $('#mkLl').setAttribute('cy', (s.lip + 9).toFixed(1));
  };
  const go = (i, instant) => {
    sel = i; const m = MK[i], to = resolve(m.p), from = Object.assign({}, cur);
    cancelAnimationFrame(anim);
    $('#mkPt').setAttribute('transform', `translate(${m.pt[0]} ${m.pt[1]})`);
    $('#mkPt').style.setProperty('--c', AREA[m.a][1]);
    $('#mkVf').classList.toggle('on', !!m.th); $('#mkNs').classList.toggle('on', !!m.nose); $('#mkJa').classList.toggle('on', i === 0);
    $('#mkSide').hidden = !m.side;
    view.querySelectorAll('[data-k]').forEach(e => e.classList.toggle('active', +e.dataset.k === i));
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (instant || reduce) { cur = to; draw(cur); return; }
    const t0 = performance.now(), D = 520, ease = u => u < .5 ? 2 * u * u : 1 - 2 * (1 - u) ** 2;
    const step = now => {
      const u = Math.min(1, (now - t0) / D), e = ease(u);
      for (const k of Object.keys(REST)) cur[k] = from[k] + (to[k] - from[k]) * e;
      draw(cur); if (u < 1) anim = requestAnimationFrame(step);
    };
    anim = requestAnimationFrame(step);
  };
  const info = () => {
    const m = MK[sel], [an, col] = AREA[m.a];
    const ex = m.L ? m.L.split('').map(c => `<span class="mk-ex" lang="ar">${c === 'ء' ? 'أَأْ' : 'أَ' + c + 'ْ'}</span>`).join('') : '<span class="mk-ex" lang="ar">مِنْ</span><span class="mk-ex" lang="ar">أَنْ</span>';
    $('#mkInfo').innerHTML = `<div class="mk-ih"><span class="mk-no" style="background:${col}">${sel + 1}</span><div><h2>${esc(m.n)}</h2><span class="mk-badge" style="border-color:${col};color:${col}">${esc(an)} · ${esc(m.g)}</span></div></div>
      <div class="mk-big" lang="ar" dir="rtl">${lettersOf(sel).map(c => `<button class="mk-sp" data-s="${c}" aria-label="Dengarkan huruf ${c}"><b>${m.L ? c : (c === 'ن' ? 'ـنّ' : 'ـمّ')}</b><small>🔊</small></button>`).join('')}</div>
      <div class="btn-row" style="justify-content:center;margin-bottom:8px"><button class="btn primary" id="mkHear">🔊 Dengarkan semua</button></div>
      <p><b>Letak:</b> ${esc(m.w)}</p><p><b>Cara:</b> ${esc(m.c)}</p><p class="muted"><b>Tips:</b> ${esc(m.t)}</p>
      <p class="muted small">Latihan (ulangi 3×, perhatikan titiknya): ${ex}</p>`;
  };
  const select = (i, instant, quiet) => { go(i, instant); info(); if (!instant && !quiet) say(lettersOf(i)); };
  const stopTour = () => { stopAudio(); clearInterval(tour); tour = 0; const b = $('#mkTour'); if (b) b.textContent = '▶'; };
  const startTour = () => {
    stopTour(); $('#mkTour').textContent = '⏸';
    tour = setInterval(() => { if (!document.body.contains($('#mkSvg'))) return stopTour(); select((sel + 1) % MK.length); }, 4500);
  };
  const quizHTML = () => {
    const q = quiz;
    if (!q.L) { const pool = LET.split('').filter(c => c !== 'ا'); q.L = pool[Math.floor(Math.random() * pool.length)]; q.i = lidx(q.L); q.done = 0;
      const o = new Set([q.i]); while (o.size < 4) o.add(Math.floor(Math.random() * MK.length)); q.o = [...o].sort(() => Math.random() - .5); }
    return `<div class="mk-q"><div class="mk-qh"><b>Kuis makhraj</b><span class="chip">Skor ${q.s}/${q.n}</span></div><p>Dengarkan, di mana makhraj huruf ini?</p><div class="mk-big" lang="ar" dir="rtl"><button class="mk-sp" id="mkHearQ"><b>${q.L}</b><small>🔊</small></button></div>
      <div class="mk-opts">${q.o.map(i => `<button class="btn" data-o="${i}">${esc(MK[i].n)}</button>`).join('')}</div>
      <div class="btn-row" style="margin-top:8px"><button class="btn" id="mkQx">Keluar kuis</button></div></div>`;
  };
  const showQuiz = () => { $('#mkInfo').innerHTML = quizHTML(); };
  const render = () => {
    setTitle('Makharijul Huruf');
    view.innerHTML = `<section class="hd-hero"><p class="hd-bis" lang="ar" dir="rtl">وَرَتِّلِ الْقُرْآنَ تَرْتِيلًا</p><h1>Makharijul Huruf</h1><p>Letak keluarnya 28 huruf hijaiyah pada mulut, lidah, tenggorokan, bibir, dan hidung.</p></section>
    <section class="card mk-stage">${svgHTML()}
      <div class="mk-ctl"><button class="btn" id="mkPrev" aria-label="Makhraj sebelumnya" title="Sebelumnya">‹</button><button class="btn" id="mkTour" aria-label="Tur otomatis" title="Tur otomatis">▶</button><button class="btn" id="mkQuiz" aria-label="Kuis" title="Kuis">🎯</button><button class="btn" id="mkSnd" aria-label="Suara hidup/mati" title="Suara">${sound ? '🔊' : '🔇'}</button><button class="btn" id="mkNext" aria-label="Makhraj berikutnya" title="Berikutnya">›</button></div>
      <p class="muted small" style="text-align:center;margin:6px 0 0">Ketuk huruf atau titik di gambar. Titik besar = tempat keluarnya bunyi.</p></section>
    <section class="card" id="mkInfo"></section>
    <section class="card"><h2>Pilih huruf</h2><div class="mk-grid" dir="rtl">${LET.split('').map(c => { const i = lidx(c), col = AREA[MK[i].a][1]; return `<button class="mk-let" data-k="${i}" style="--c:${col}" lang="ar">${c}</button>`; }).join('')}<button class="mk-let" data-k="0" style="--c:${AREA.j[1]}" lang="ar" aria-label="Huruf mad">مد</button><button class="mk-let" data-k="16" style="--c:${AREA.k[1]}" lang="ar" aria-label="Ghunnah">غنة</button></div>
      <div class="mk-key">${Object.values(AREA).map(a => `<span><i style="background:${a[1]}"></i>${a[0]}</span>`).join('')}</div></section>
    <section class="card"><h2>17 makhraj</h2><ol class="mk-list">${MK.map((m, i) => `<li><button data-k="${i}"><span class="mk-no sm" style="background:${AREA[m.a][1]}">${i + 1}</span><span><b>${esc(m.n)}</b><small>${esc(m.g)}${m.L ? ' · ' : ''}<span lang="ar">${m.L.split('').join(' ')}</span></small></span></button></li>`).join('')}</ol>
      <p class="muted small">Mengikuti pendapat yang masyhur (Imam al-Khalil, 17 makhraj). Sebagian ulama meringkasnya menjadi 5 area umum. Belajarlah langsung kepada guru yang bersanad untuk menyempurnakan bacaan.</p></section>`;
    const dots = $('#mkDots'); dots.innerHTML = MK.map((m, i) => `<g data-k="${i}" class="mk-dg" transform="translate(${m.pt[0]} ${m.pt[1]})"><circle r="11" fill="transparent"/><circle class="mk-dot" r="3" style="fill:${AREA[m.a][1]}"/></g>`).join('');
    cur = resolve(MK[0].p); select(0, true);
    view.onclick = e => {
      if (e.target.closest('#mkPrev')) { stopTour(); return select((sel + MK.length - 1) % MK.length); }
      if (e.target.closest('#mkNext')) { stopTour(); return select((sel + 1) % MK.length); }
      if (e.target.closest('#mkTour')) return tour ? stopTour() : startTour();
      if (e.target.closest('#mkQuiz')) { stopTour(); quiz = { s: 0, n: 0 }; showQuiz(); return say([quiz.L]); }
      if (e.target.closest('#mkSnd')) { sound = !sound; try { localStorage.setItem('mkSound', sound ? '1' : '0'); } catch (x) {} if (!sound) stopAudio(); $('#mkSnd').textContent = sound ? '🔊' : '🔇'; return; }
      const sp = e.target.closest('[data-s]'); if (sp) return say([sp.dataset.s], true);
      if (e.target.closest('#mkHear')) return say(lettersOf(sel), true);
      if (e.target.closest('#mkHearQ')) return say([quiz.L], true);
      if (e.target.closest('#mkQx')) { quiz = null; stopAudio(); return info(); }
      const o = e.target.closest('[data-o]');
      if (o && quiz && !quiz.done) {
        quiz.done = 1; quiz.n++; const ok = +o.dataset.o === quiz.i; if (ok) quiz.s++;
        go(quiz.i); const q = quiz, m = MK[q.i]; say([q.L]);
        $('#mkInfo').innerHTML = `<div class="mk-q"><div class="mk-qh"><b>${ok ? '✅ Benar!' : '❌ Belum tepat'}</b><span class="chip">Skor ${q.s}/${q.n}</span></div><div class="mk-big" lang="ar" dir="rtl"><b>${q.L}</b></div><p><b>${esc(m.n)}</b> (${esc(m.g)}). ${esc(m.w)}</p><p class="muted small">Lihat titik menyala pada gambar di atas.</p><div class="btn-row"><button class="btn primary" id="mkQn">Soal berikutnya</button><button class="btn" id="mkQx">Selesai</button></div></div>`;
        return;
      }
      if (e.target.closest('#mkQn')) { quiz.L = null; showQuiz(); return say([quiz.L]); }
      const k = e.target.closest('[data-k]');
      if (k) { stopTour(); quiz = null; select(+k.dataset.k, false, true); const lc = k.classList.contains('mk-let') ? k.textContent.trim() : ''; say(AUD[lc] ? [lc] : lettersOf(+k.dataset.k)); if (!k.closest('svg')) $('#mkSvg').scrollIntoView({ block: 'nearest', behavior: 'smooth' }); }
    };
  };
  window.MKKit = { MK, AREA, AUD, REST, resolve, tonguePath, svgHTML, lidx };
  return render;
};
