/* Halaman "Video Tajwid": pemutar visual bergaya video untuk 114 surah.
 * Teks Arab berwarna tajwid ikut menyala mengikuti murottal, kartu hukum muncul tepat saat hukumnya dibaca
 * (animasi ketukan harakat, dengung, qalqalah, huruf luruh), garis waktu berpenanda hukum, kecepatan, ulang, dan lanjut otomatis.
 * Data: tajwid/N.json (lokal). Audio: murottal per ayat; jika audio gagal, otomatis memakai jam internal. */
window.makeTajwidVideoView = function (d) {
  const { $, esc, view, getSurahs, setTitle, qari } = d;
  /* kode -> [nama, cara baca, jenis animasi, jumlah ketukan] */
  const R = {
    n: ['Mad Thabi\u2019i', 'Panjangkan bunyi 2 harakat (2 ketukan), tidak lebih dan tidak kurang.', 'beat', 2],
    p: ['Mad Jaiz / \u2018Aridh', 'Boleh dipanjangkan 2, 4, atau 6 harakat. Contoh ini 4 ketukan.', 'beat', 4],
    o: ['Mad Wajib Muttasil', 'Mad bertemu hamzah dalam satu kata: wajib panjang 4\u20135 harakat.', 'beat', 5],
    m: ['Mad Lazim', 'Bertemu sukun/tasydid asli: wajib panjang 6 harakat.', 'beat', 6],
    g: ['Ghunnah', 'Nun/mim bertasydid: dengungkan di hidung sekitar 2 harakat.', 'hum'],
    q: ['Qalqalah', 'Huruf sukun ق ط ب ج د: pantulkan suara dengan memantul ringan, jangan ditambah vokal.', 'bounce'],
    f: ['Ikhfa Haqiqi', 'Nun sukun/tanwin disamarkan antara izhar dan idgham, disertai dengung ringan.', 'hum'],
    c: ['Ikhfa Syafawi', 'Mim sukun bertemu ba: samarkan dengan bibir merapat ringan, dengung 2 harakat.', 'hum'],
    a: ['Idgham Bighunnah', 'Nun/tanwin melebur ke ي ن م و sambil berdengung.', 'hum'],
    u: ['Idgham Bilaghunnah', 'Nun/tanwin melebur ke ل atau ر tanpa dengung.', 'fade'],
    w: ['Idgham Syafawi', 'Mim sukun bertemu mim: lebur dan berdengung.', 'hum'],
    i: ['Iqlab', 'Nun/tanwin bertemu ba: ubah menjadi mim, bibir merapat, dengung.', 'hum'],
    d: ['Idgham Mutajanisain', 'Dua huruf satu makhraj berbeda sifat: huruf pertama melebur ke yang kedua.', 'fade'],
    b: ['Idgham Mutaqaribain', 'Dua huruf berdekatan makhraj/sifat: huruf pertama melebur ke yang kedua.', 'fade'],
    l: ['Lam Syamsiyah', 'Lam ta\u2019rif tidak dibaca, langsung masuk ke huruf berikutnya yang bertasydid.', 'fade'],
    h: ['Hamzah Wasal', 'Dibaca hanya saat memulai bacaan; hilang bila disambung dengan kata sebelumnya.', 'fade'],
    s: ['Huruf Tidak Dibaca', 'Huruf ini tertulis tetapi tidak dilafalkan.', 'fade']
  };
  const SPD = [0.6, 0.8, 1, 1.25];
  /* Qari yang paling pas untuk belajar tajwid: murattal tempo stabil dan jelas, sehingga sorotan warna sejalan dengan bacaan. */
  const RECO = {
    'ea:Husary_64kbps': 'Terbaik untuk belajar: tempo pelan dan sangat jelas, mad serta dengung terdengar tegas.',
    'ea:Minshawy_Murattal_128kbps': 'Tartil pelan dan tenang, bagus untuk melatih mad dan ghunnah.',
    'ea:Abdul_Basit_Murattal_64kbps': 'Murattal jernih dengan tajwid rapi dan tempo sedang.',
    'ea:Alafasy_128kbps': 'Tempo sedang dan merdu, nyaman untuk pemula.'
  };
  const pad3 = n => String(n).padStart(3, '0');
  const au = new Audio(); au.preload = 'auto';
  let st = null, raf = 0;
  const stop = () => { cancelAnimationFrame(raf); au.pause(); if (st) st.playing = false; };
  window.addEventListener('hashchange', () => { if (!location.hash.startsWith('#/video')) stop(); });

  const weight = it => typeof it === 'string'
    ? Math.max(1, it.replace(/[\u064B-\u0652\u0670\s]/g, '').length)
    : ({ n: 3, p: 3, o: 4, m: 5, g: 2, q: 2 }[it[1]] || 1.5);

  async function list() {
    stop(); st = null; setTitle('Video Tajwid', true);
    const ss = await getSurahs().catch(() => []);
    view.innerHTML = `<section class="card"><h2 style="margin:0 0 6px">\uD83C\uDFAC Video tajwid</h2>
      <p class="muted small" style="margin:0">Pilih surah. Teks menyala mengikuti bacaan, dan kartu hukum tajwid muncul tepat saat hukumnya dibaca. Tersedia untuk 114 surah.</p></section>
      <div class="v-grid">${ss.map(s => `<a class="card v-s" href="#/video/${s.n}"><b>${s.n}. ${esc(s.la)}</b><span class="ar-mini">${esc(s.ar)}</span><span class="muted small">${s.count} ayat</span></a>`).join('')}</div>`;
  }

  async function player(n, a) {
    stop(); setTitle('Video Tajwid', true);
    view.innerHTML = '<p class="muted" style="text-align:center">Memuat\u2026</p>';
    let j, ss = [];
    try { j = await (await fetch(`tajwid/${n}.json`)).json(); ss = await getSurahs(); }
    catch { view.innerHTML = '<div class="card notice">Data tajwid gagal dimuat. Periksa koneksi lalu coba lagi.</div>'; return; }
    const s = ss[n - 1] || { la: 'Surah ' + n, ar: '' };
    const count = Object.keys(j).length;
    st = { n, j, count, a: 1, spd: 2, auto: true, loop: false, playing: false, mode: 'audio', idx: -2, items: [], cum: [] };
    view.innerHTML = `<section class="card v-wrap">
      <div class="v-head"><b>${n}. ${esc(s.la)}</b><span class="ar-mini">${esc(s.ar)}</span>
        <select id="vAyat" aria-label="Pilih ayat">${Array.from({ length: count }, (_, i) => `<option value="${i + 1}">Ayat ${i + 1}</option>`).join('')}</select></div>
      <div class="v-stage" id="vStage" dir="rtl" lang="ar"></div>
      <div class="v-tl" id="vTl" role="slider" aria-label="Posisi bacaan"><div class="v-fill" id="vFill"></div></div>
      <div class="v-card" id="vCard"><span class="muted small">Tekan \u25B6 lalu dengarkan. Kartu hukum tajwid muncul di sini saat dibaca. Ketuk kata berwarna untuk mengulang dari situ.</span></div>
      <div class="btn-row" style="justify-content:center">
        <button class="btn" data-act="prev" aria-label="Ayat sebelumnya">\u23EE</button>
        <button class="btn primary" data-act="play" id="vPlay">\u25B6 Putar</button>
        <button class="btn" data-act="next" aria-label="Ayat berikutnya">\u23ED</button>
        <button class="btn" data-act="spd" id="vSpd"></button>
        <button class="btn" data-act="auto" id="vAuto"></button>
        <button class="btn" data-act="loop" id="vLoop"></button></div>
      <label class="v-qari"><span>\uD83C\uDF99 Qari</span><select id="vQari" aria-label="Pilih qari">${(() => { const o = qari.options(), f = ([k, nm, off]) => `<option value="${esc(k)}">${RECO[k] ? '\u2B50 ' : ''}${esc(nm)}${off ? ' (bisa diunduh offline)' : ' (online)'}</option>`;
        return `<optgroup label="\u2B50 Rekomendasi belajar tajwid">${o.filter(x => RECO[x[0]]).map(f).join('')}</optgroup><optgroup label="Qari lainnya">${o.filter(x => !RECO[x[0]]).map(f).join('')}</optgroup>`; })()}</select></label>
      <div class="v-reco" id="vReco"></div>
      <div class="v-legend" id="vLegend"></div>
      <p class="btn-row" style="justify-content:center;margin:8px 0 0"><a class="btn" href="#/surah/${n}">\u2190 Baca surah</a><a class="btn" id="vAn" href="#/analisis/${n}">\uD83D\uDD0D Analisis ayat</a></p></section>`;
    const flags = () => {
      $('#vSpd').textContent = '\u23F1 ' + SPD[st.spd] + 'x';
      $('#vAuto').textContent = st.auto ? '\u21E5 Lanjut: ya' : '\u21E5 Lanjut: tidak';
      $('#vLoop').textContent = st.loop ? '\uD83D\uDD01 Ulang: ya' : '\uD83D\uDD01 Ulang: tidak';
    };
    flags();
    const dur = () => st.mode === 'audio' && isFinite(au.duration) && au.duration > 0 ? au.duration : st.fake;
    const now = () => st.mode === 'audio' ? au.currentTime : st.off + (performance.now() - st.t0) / 1000 * SPD[st.spd];
    const seek = f => {
      f = Math.max(0, Math.min(0.999, f));
      if (st.mode === 'audio') { try { au.currentTime = f * dur(); } catch { } } else { st.off = f * dur(); st.t0 = performance.now(); }
      st.idx = -2; paint(f);
    };
    const fake = () => { st.mode = 'fake'; st.off = st.off || 0; st.t0 = performance.now(); };
    const setPlay = p => { st.playing = p; $('#vPlay').textContent = p ? '\u23F8 Jeda' : '\u25B6 Putar'; };
    function card(it) {
      const r = R[it[1]]; if (!r) return;
      let vis = '';
      if (r[2] === 'beat') vis = `<div class="v-beats">${Array.from({ length: r[3] }, (_, i) => `<i style="animation-delay:${(i * 0.5 / SPD[st.spd]).toFixed(2)}s"></i>`).join('')}<small>${r[3]} harakat</small></div>`;
      else if (r[2] === 'hum') vis = '<div class="v-hum"><i></i><i></i><i></i><small>dengung</small></div>';
      else if (r[2] === 'bounce') vis = '<div class="v-ball"></div>';
      else vis = '<div class="v-fadeout">\u2192 tidak dibaca / melebur</div>';
      $('#vCard').innerHTML = `<div class="v-cardrow"><span class="v-big tj tj-${esc(it[1])}" dir="rtl">${esc(it[0])}</span><div><b>${esc(r[0])}</b><div class="small">${esc(r[1])}</div></div></div>${vis}`;
    }
    function paint(f) {
      $('#vFill').style.width = (f * 100).toFixed(1) + '%';
      let k = st.cum.findIndex(c => f < c.e); if (k < 0) k = st.items.length - 1;
      if (k === st.idx) return;
      st.idx = k;
      const sp = $('#vStage').children;
      for (let i = 0; i < sp.length; i++) { sp[i].classList.toggle('done', i < k); sp[i].classList.toggle('now', i === k); }
      if (typeof st.items[k] !== 'string') card(st.items[k]);
    }
    function tick() {
      if (!st.playing) return;
      const D = dur(), f = Math.min(1, now() / D);
      paint(f);
      if (st.mode === 'fake' && f >= 1) return done();
      raf = requestAnimationFrame(tick);
    }
    function done() {
      cancelAnimationFrame(raf);
      if (st.loop) { load(st.a, true); return; }
      if (st.auto && st.a < st.count) { load(st.a + 1, true); return; }
      setPlay(false); paint(1);
    }
    async function play() {
      setPlay(true);
      if (st.mode === 'audio') {
        try { au.playbackRate = SPD[st.spd]; await au.play(); } catch { fake(); }
      } else { st.t0 = performance.now(); }
      cancelAnimationFrame(raf); raf = requestAnimationFrame(tick);
    }
    const FALLBACK = k => `https://everyayah.com/data/Alafasy_128kbps/${pad3(st.n)}${pad3(k)}.mp3`;
    async function audioUrl(a) {
      const q = qari.get();
      if (q.startsWith('ea:')) return `https://everyayah.com/data/${q.slice(3)}/${pad3(st.n)}${pad3(a)}.mp3`;
      try {
        if (!st.map) st.map = await qari.surahAudio(st.n);
        const u = st.map[a - 1] && st.map[a - 1][q];
        if (u) return u;
      } catch { }
      return FALLBACK(a);
    }
    async function setSrc(a, token) {
      const u = await audioUrl(a);
      if (!st || token !== st.tok) return;
      st.tried = false; au.src = u; au.playbackRate = SPD[st.spd];
      if (st.playing && st.mode === 'audio') { try { await au.play(); } catch { fake(); } }
    }
    function load(a, go) {
      st.tok = (st.tok || 0) + 1;
      cancelAnimationFrame(raf); au.pause();
      st.a = a; st.items = st.j[a] || []; st.idx = -2; st.mode = 'audio'; st.off = 0;
      let tot = 0; st.cum = st.items.map(it => { const w = weight(it); const o = { s: tot, w }; tot += w; return o; });
      st.cum.forEach(o => { o.e = (o.s + o.w) / tot; o.s /= tot; });
      st.fake = Math.max(3, tot * 0.35);
      $('#vStage').innerHTML = st.items.map((it, i) => typeof it === 'string'
        ? `<span class="v-w" data-i="${i}">${esc(it)}</span>`
        : `<span class="v-w tj tj-${esc(it[1])}" data-i="${i}" data-r="${esc(it[1])}">${esc(it[0])}</span>`).join('');
      $('#vTl').querySelectorAll('.v-tick').forEach(x => x.remove());
      const seen = {};
      st.items.forEach((it, i) => { if (typeof it !== 'string') { seen[it[1]] = (seen[it[1]] || 0) + 1;
        const t = document.createElement('b'); t.className = 'v-tick tj-' + it[1]; t.style.left = (st.cum[i].s * 100) + '%'; $('#vTl').appendChild(t); } });
      $('#vLegend').innerHTML = Object.keys(seen).map(k => R[k] ? `<span class="v-chip"><i class="tj-${k}"></i>${esc(R[k][0])} \u00D7${seen[k]}</span>` : '').join('') || '<span class="muted small">Tidak ada hukum berwarna di ayat ini.</span>';
      $('#vCard').innerHTML = '<span class="muted small">Tekan \u25B6 untuk memulai ayat ini.</span>';
      $('#vAyat').value = a; $('#vAn').href = `#/analisis/${st.n}?a=${a}`; $('#vFill').style.width = '0';
      history.replaceState(null, '', `#/video/${st.n}?a=${a}`);
      au.onerror = () => { if (st.mode === 'audio' && !st.tried && au.src !== FALLBACK(st.a)) { st.tried = true; au.src = FALLBACK(st.a); au.playbackRate = SPD[st.spd]; if (st.playing) au.play().catch(() => { }); return; }
        if (st.mode === 'audio') { fake(); if (st.playing) { cancelAnimationFrame(raf); raf = requestAnimationFrame(tick); } } };
      au.onended = () => { if (st.mode === 'audio') done(); };
      st.pendingSrc = true; au.removeAttribute('src');
      if (go) { setPlay(true); setSrc(a, st.tok).then(() => { if (st.playing) { cancelAnimationFrame(raf); raf = requestAnimationFrame(tick); } }); } else { setPlay(false); setSrc(a, st.tok); }
    }
    view.onclick = e => {
      const w = e.target.closest('.v-w[data-r]');
      if (w && st) { const k = +w.dataset.i; seek(st.cum[k].s); if (!st.playing) { paint(st.cum[k].s); play(); } return; }
      const t = e.target.closest('#vTl');
      if (t && st) { const r = t.getBoundingClientRect(); seek((e.clientX - r.left) / r.width); return; }
      const b = e.target.closest('[data-act]'); if (!b || !st) return;
      const act = b.dataset.act;
      if (act === 'play') { st.playing ? (au.pause(), setPlay(false), cancelAnimationFrame(raf)) : play(); }
      else if (act === 'prev') load(Math.max(1, st.a - 1), st.playing);
      else if (act === 'next') load(Math.min(st.count, st.a + 1), st.playing);
      else if (act === 'spd') { st.spd = (st.spd + 1) % SPD.length; au.playbackRate = SPD[st.spd]; flags(); }
      else if (act === 'auto') { st.auto = !st.auto; flags(); }
      else if (act === 'loop') { st.loop = !st.loop; flags(); }
    };
    const reco = () => {
      const k = qari.get(), good = RECO[k];
      $('#vReco').innerHTML = `<span>${good ? '\u2B50 ' + esc(good) : 'Untuk belajar tajwid, qari bertempo pelan lebih mudah diikuti sorotannya.'}</span>
        <button class="btn" id="vLearn">\u2728 Setelan belajar</button>`;
      $('#vLearn').onclick = () => { st.spd = 1; au.playbackRate = SPD[1]; st.auto = true; flags(); $('#vQari').value = 'ea:Husary_64kbps'; $('#vQari').onchange({ target: $('#vQari') }); };
    };
    $('#vQari').value = qari.get(); reco();
    $('#vQari').onchange = e => {
      qari.set(e.target.value); st.map = st.map || null; reco();
      const keep = st.playing, pos = st.mode === 'audio' ? au.currentTime : 0, tk = ++st.tok;
      au.pause(); st.mode = 'audio';
      audioUrl(st.a).then(u => { if (tk !== st.tok) return; st.tried = false; au.src = u; au.playbackRate = SPD[st.spd];
        au.onloadedmetadata = () => { try { au.currentTime = pos; } catch { } au.onloadedmetadata = null; };
        if (keep) { au.play().catch(() => fake()); cancelAnimationFrame(raf); raf = requestAnimationFrame(tick); } });
    };
    document.onkeydown = e => {
      if (!st || !location.hash.startsWith('#/video') || /SELECT|INPUT|TEXTAREA/.test(e.target.tagName)) return;
      if (e.key === ' ') { e.preventDefault(); $('#vPlay').click(); }
      else if (e.key === 'ArrowRight') $('[data-act=next]').click();
      else if (e.key === 'ArrowLeft') $('[data-act=prev]').click();
    };
    $('#vAyat').onchange = e => load(+e.target.value, st.playing);
    load(Math.min(Math.max(1, a || 1), count), false);
  }
  return (n, a) => (n ? player(n, a) : list());
};
