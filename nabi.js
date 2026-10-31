/* Kisah Para Nabi & Malaikat: linimasa 25 nabi, detail tiap nabi (dalil, surah terkait, hadis),
 * malaikat (nama, tugas, sumber dalil), dan kuis otomatis. Data ada di nabi-data.js, semua offline. */
window.makeNabiView = function (d) {
  const { $, esc, view, setTitle, store } = d;
  const D = window.NABI_DATA, { ERA, NABI, LAIN, MALAIKAT, MALAIKAT_LAIN, SIFAT, AMAL } = D;
  const byId = Object.fromEntries(NABI.map((x, i) => [x.id, Object.assign(x, { no: i + 1 })]));
  const SRC = { q: ['Disebut di Al-Qur’an', 'q'], h: ['Nama dari hadis', 'h'], u: ['Nama menurut ulama', 'u'] };
  const read = () => new Set(store.get('nabiRead', []));
  const shuf = a => a.map(v => [Math.random(), v]).sort((p, c) => p[0] - c[0]).map(p => p[1]);

  const TABS = [['linimasa', 'Linimasa'], ['daftar', 'Para Nabi'], ['malaikat', 'Malaikat'], ['kuis', 'Kuis']];
  const hero = cur => `<section class="hd-hero"><p class="hd-bis" lang="ar" dir="rtl">لَقَدْ كَانَ فِيْ قَصَصِهِمْ عِبْرَةٌ لِّاُولِى الْاَلْبَابِۗ</p><h1>Kisah Para Nabi &amp; Malaikat</h1><p>${NABI.length} nabi dan rasul yang disebut Al-Qur’an, lengkap dengan linimasa, dan para malaikat beserta tugasnya.</p></section><nav class="hd-tabs">${TABS.map(([k, l]) => `<a class="chip ${cur === k ? 'active' : ''}" href="#/nabi/${k}">${l}</a>`).join('')}</nav>`;
  const badges = x => `<span class="nb-b ${x.tipe === 'Rasul' ? 'ras' : 'nab'}">${x.tipe}</span>${x.ulul ? '<span class="nb-b ulul">Ulul ‘Azmi</span>' : ''}${x.u ? '<span class="nb-b unc" title="Waktu atau urutan diperselisihkan">waktu diperselisihkan</span>' : ''}`;
  const refLink = r => `<a class="btn sm" href="#/surah/${r[0]}?a=${String(r[1]).split('-')[0]}">QS. ${esc(d.surahName ? d.surahName(r[0]) : r[0])}: ${esc(r[1])}</a>`;

  /* ---------- Linimasa ---------- */
  function linimasa() {
    const r = read(), n = NABI.filter(x => r.has(x.id)).length, pct = Math.round(n / NABI.length * 100);
    const sec = Object.keys(ERA).map(k => {
      const xs = NABI.filter(x => x.era === k); if (!xs.length) return '';
      return `<p class="mini-title hd-sec sr-ph">${ERA[k][0]} ${esc(ERA[k][1])}</p><p class="muted small nb-eradesc">${esc(ERA[k][2])}</p>` + xs.map(x => `
      <a class="nb-ev ${r.has(x.id) ? 'done' : ''}" href="#/nabi/detail?id=${x.id}">
        <span class="sr-yr">${esc(x.th)}</span>
        <div class="nb-row"><span class="nb-ar" lang="ar" dir="rtl">${esc(x.ar)}</span><b>${x.no}. ${esc(x.n)}</b></div>
        <div class="nb-tags">${badges(x)}</div>
        <p>Nabi yang ${esc(x.ciri)}.</p>
      </a>`).join('');
    }).join('');
    view.innerHTML = hero('linimasa') + `
      <div class="card"><b>${n} dari ${NABI.length} kisah sudah dipelajari</b><div class="sr-bar"><i style="width:${pct}%"></i></div>
        <p class="muted small" style="margin:0">Buka tiap kisah lalu tekan “Tandai sudah dipelajari”.</p></div>
      <details class="card nb-note"><summary><b>Catatan tentang tahun dan urutan</b></summary>
        <p>Al-Qur’an dan hadis shahih <b>tidak</b> menyebut tahun para nabi. Angka SM atau M di sini hanyalah perkiraan sejarawan dan bisa berbeda antar sumber. Urutan yang tegas hanyalah: Adam nabi pertama; Nuh rasul pertama; Ibrahim, lalu Ismail dan Ishaq, Ya‘qub, dan Yusuf; Musa dan Harun; Daud lalu Sulaiman; Zakariya, Yahya, Isa; dan Muhammad ﷺ penutup.</p>
        <p>Nabi yang diberi tanda “waktu diperselisihkan” (Idris, Hud, Shalih, Ayyub, Syu‘aib, Dzulkifli, Ilyas, Ilyasa‘, dan Yunus) ditempatkan menurut urutan yang lazim dalam kitab para ulama seperti Ibnu Katsir.</p>
        <p>Allah juga mengutus rasul yang tidak diceritakan kepada kita (QS. Ghafir: 78), sehingga 25 nabi ini bukan seluruhnya. Wajib mengenal 25 nabi ini secara terperinci, dan beriman kepada seluruh nabi secara umum.</p></details>
      ${sec}
      <details class="card nb-note"><summary><b>Tokoh lain dalam Al-Qur’an yang sering dikira nabi</b></summary>
        ${LAIN.map(x => `<p><b>${esc(x[0])}</b>. ${esc(x[1])}</p>`).join('')}</details>
      <p class="muted small hd-note">Disusun dari Al-Qur’an dan hadis shahih/hasan. Cerita yang bersumber Israiliyat diberi catatan. Rujuk kitab seperti Qashashul Anbiya (Ibnu Katsir) untuk kajian mendalam.</p>`;
  }

  /* ---------- Daftar nabi ---------- */
  function daftar(q) {
    const kw = (q.get('q') || '').toLowerCase().trim(), f = q.get('f') || '', r = read();
    const FL = [['', 'Semua'], ['ulul', 'Ulul ‘Azmi'], ['Rasul', 'Rasul'], ['Nabi', 'Nabi saja']];
    const list = NABI.filter(x => (!f || (f === 'ulul' ? x.ulul : x.tipe === f)) && (!kw || (x.n + ' ' + x.alt + ' ' + x.gelar + ' ' + x.tp + ' ' + x.kel + ' ' + x.ciri + ' ' + x.mj).toLowerCase().includes(kw)));
    view.innerHTML = hero('daftar') + `
      <form class="hd-search" id="nbf"><input id="nbq" type="search" placeholder="Cari nabi (musa, kapal, kurban, Firaun…)" value="${esc(kw)}"><button class="btn">Cari</button></form>
      <nav class="hd-tabs">${FL.map(([k, t]) => `<a class="chip ${f === k ? 'active' : ''}" href="#/nabi/daftar?f=${encodeURIComponent(k)}${kw ? '&q=' + encodeURIComponent(kw) : ''}">${t}</a>`).join('')}</nav>
      ${list.length ? `<div class="nb-grid">${list.map(x => `<a class="nb-card ${r.has(x.id) ? 'done' : ''}" href="#/nabi/detail?id=${x.id}">
        <span class="nb-no">${x.no}</span><span class="nb-ar big" lang="ar" dir="rtl">${esc(x.ar)}</span><b>${esc(x.n)}</b>
        <small>${esc(x.gelar)}</small><div class="nb-tags">${badges(x)}</div></a>`).join('')}</div>` : '<p class="muted">Tidak ada nabi yang cocok.</p>'}
      <p class="muted small hd-note">Ulul ‘Azmi (para rasul yang paling tabah): Nuh, Ibrahim, Musa, Isa, dan Muhammad ﷺ. Daftar ini disebut para ulama berdasarkan QS. Asy-Syura: 13, Al-Ahzab: 7, dan Al-Ahqaf: 35.</p>`;
    $('#nbf').onsubmit = e => { e.preventDefault(); location.hash = `#/nabi/daftar?f=${encodeURIComponent(f)}&q=${encodeURIComponent($('#nbq').value)}`; };
  }

  /* ---------- Detail nabi ---------- */
  function detail(q) {
    const x = byId[q.get('id')]; if (!x) { location.hash = '#/nabi/daftar'; return; }
    setTitle(x.n, true);
    const r = read(), done = r.has(x.id), prev = NABI[x.no - 2], next = NABI[x.no];
    const info = [['Waktu', x.th], ['Tempat / kaum', x.tp], ['Keluarga', x.kel], ['Nama dalam tradisi lain', x.alt], ['Gelar', x.gelar], ['Mukjizat & keistimewaan', x.mj], ['Kitab', x.kitab]];
    view.innerHTML = `<article class="nb-detail">
      <section class="nb-top"><span class="nb-ar huge" lang="ar" dir="rtl">${esc(x.ar)}</span><h1>${x.no}. ${esc(x.n)}</h1><div class="nb-tags">${badges(x)}</div></section>
      <dl class="nb-info">${info.map(([k, v]) => `<dt>${k}</dt><dd>${esc(v)}</dd>`).join('')}</dl>
      <h2 class="mini-title">Kisah</h2>${x.kisah.map(p => `<p class="nb-p">${esc(p)}</p>`).join('')}
      <div class="card nb-pel"><b>💡 Pelajaran</b><p>${esc(x.pel)}</p></div>
      <h2 class="mini-title">Ayat terkait</h2><div class="hd-acts nb-refs">${x.ref.map(refLink).join('')}</div>
      <div class="hd-acts nb-acts">
        ${x.hk ? `<a class="btn sm" href="#/hadis/cari?q=${encodeURIComponent(x.hk)}">📜 Hadis terkait</a>` : ''}
        ${x.id === 'muhammad' ? '<a class="btn sm" href="#/sirah">🕋 Baca Sirah lengkap</a>' : ''}
        <button class="btn sm ${done ? 'on' : ''}" id="nbDone">${done ? '✓ Sudah dipelajari' : 'Tandai sudah dipelajari'}</button>
      </div>
      <nav class="nb-pn">${prev ? `<a class="btn sm" href="#/nabi/detail?id=${prev.id}">← ${esc(prev.n)}</a>` : '<span></span>'}<a class="btn sm" href="#/nabi/linimasa">Linimasa</a>${next ? `<a class="btn sm" href="#/nabi/detail?id=${next.id}">${esc(next.n)} →</a>` : '<span></span>'}</nav>
    </article>`;
    $('#nbDone').onclick = () => { const s = read(); s.has(x.id) ? s.delete(x.id) : s.add(x.id); store.set('nabiRead', [...s]); const y = scrollY; detail(q); scrollTo(0, y); };
  }

  /* ---------- Malaikat ---------- */
  function malaikat() {
    const mk = x => `<details class="nb-mal" id="m-${x.id}"><summary><span class="nb-ar" lang="ar" dir="rtl">${esc(x.ar)}</span><span class="nb-mt"><b>${esc(x.n)}</b><small>${esc(x.tugas)}</small></span><span class="nb-src ${SRC[x.s][1]}">${SRC[x.s][0]}</span></summary>
      <div class="nb-mb">${x.gelar ? `<p class="muted small">Sebutan lain: ${esc(x.gelar)}</p>` : ''}<p>${esc(x.isi)}</p><div class="hd-acts nb-refs">${x.ref.map(refLink).join('')}</div></div></details>`;
    view.innerHTML = hero('malaikat') + `
      <div class="card"><b>Iman kepada malaikat</b>
        <p style="margin:6px 0 0">Beriman kepada malaikat adalah rukun iman kedua. Allah berfirman bahwa orang beriman “beriman kepada Allah, malaikat-malaikat-Nya, kitab-kitab-Nya, dan rasul-rasul-Nya” (<a href="#/surah/2?a=285">QS. Al-Baqarah: 285</a>). Para ulama menyebut sepuluh malaikat yang wajib dikenal namanya. Namun sumber nama-nama itu berbeda tingkat kekuatannya, jadi tiap kartu diberi tanda:</p>
        <p class="nb-leg"><span class="nb-src q">Disebut di Al-Qur’an</span><span class="nb-src h">Nama dari hadis</span><span class="nb-src u">Nama menurut ulama</span></p>
        <p class="muted small" style="margin:6px 0 0">Tanda “menurut ulama” berarti tugasnya jelas dari dalil, tetapi nama pribadinya masyhur tanpa nash shahih yang tegas.</p></div>
      <p class="mini-title hd-sec">✨ 10 malaikat yang wajib dikenal</p>${MALAIKAT.map(mk).join('')}
      <p class="mini-title hd-sec">🧬 Sifat para malaikat</p>
      <div class="card">${SIFAT.map(s => `<p class="nb-sf"><b>${esc(s[0])}.</b> ${esc(s[1])}</p>`).join('')}
        <p class="nb-sf"><b>Iblis bukan malaikat.</b> Ia berasal dari golongan jin (<a href="#/surah/18?a=50">QS. Al-Kahfi: 50</a>), sehingga bisa membangkang. Malaikat tidak pernah durhaka.</p></div>
      <p class="mini-title hd-sec">📚 Malaikat dan kelompok lainnya</p>
      ${MALAIKAT_LAIN.map(x => `<details class="nb-mal"><summary><span class="nb-emo">${x[1]}</span><span class="nb-mt"><b>${esc(x[0])}</b></span></summary><div class="nb-mb"><p>${esc(x[2])}</p></div></details>`).join('')}
      <p class="mini-title hd-sec">🤲 Keadaan yang membuat malaikat hadir atau mendoakan</p>
      <div class="card">${AMAL.map(a => `<p class="nb-sf"><b>${esc(a[0])}.</b> ${esc(a[1])}</p>`).join('')}</div>
      <p class="muted small hd-note">Jumlah malaikat tidak diketahui kecuali oleh Allah. Hati-hati dengan cerita malaikat yang bersumber Israiliyat, misalnya kisah Harut dan Marut dengan Zuhrah.</p>`;
  }

  /* ---------- Kuis ---------- */
  const PAIR = { munkar: 'nakir', nakir: 'munkar', raqib: 'atid', atid: 'raqib' };
  const SOLID = NABI.filter(x => !x.u);
  function makeQuiz() {
    const qs = [];
    shuf(NABI.filter(x => !['ilyasa', 'dzulkifli', 'idris'].includes(x.id))).slice(0, 4).forEach(x => {
      const ops = shuf([x, ...shuf(NABI.filter(y => y !== x && !(y.ciri === x.ciri))).slice(0, 3)]);
      qs.push({ t: `Nabi manakah yang ${x.ciri}?`, o: ops.map(o => o.n), a: x.n, e: `${x.n}: ${x.mj}`, href: `#/nabi/detail?id=${x.id}` });
    });
    shuf(MALAIKAT.filter(x => ['jibril', 'mikail', 'israfil', 'izrail', 'malik', 'ridwan'].includes(x.id))).slice(0, 2).forEach(x => {
      const ops = shuf([x, ...shuf(MALAIKAT.filter(y => y !== x && y.id !== PAIR[x.id])).slice(0, 3)]);
      qs.push({ t: `Malaikat manakah yang ${x.ciri}?`, o: ops.map(o => o.n), a: x.n, e: x.tugas + '.', href: '#/nabi/malaikat' });
    });
    const u = shuf(NABI.filter(x => x.ulul))[0], nonU = shuf(NABI.filter(x => !x.ulul)).slice(0, 3);
    qs.push({ t: 'Manakah yang termasuk Ulul ‘Azmi (rasul yang paling tabah)?', o: shuf([u, ...nonU]).map(o => o.n), a: u.n, e: 'Ulul ‘Azmi: Nuh, Ibrahim, Musa, Isa, dan Muhammad ﷺ.', href: '#/nabi/daftar?f=ulul' });
    for (let i = 0; i < 3; i++) {
      const g = shuf(SOLID).slice(0, 4).sort((a, b) => a.no - b.no);
      qs.push({ t: 'Manakah yang paling dahulu diutus (menurut urutan yang tegas)?', o: shuf(g).map(o => o.n), a: g[0].n, e: `Urutan: ${g.map(o => o.n).join(' → ')}.`, href: '#/nabi/linimasa' });
    }
    return shuf(qs);
  }
  let Q = null, n = 0, score = 0;
  function kuis() {
    if (!Q) { Q = makeQuiz(); n = 0; score = 0; }
    if (n >= Q.length) {
      view.innerHTML = hero('kuis') + `<div class="card"><h2>Skor: ${score}/${Q.length}</h2><p class="muted">${score >= Q.length - 1 ? 'Masya Allah, pemahamanmu kuat!' : 'Baca linimasa dan kartu malaikat lalu coba lagi.'}</p><button class="btn" id="again">Ulangi</button></div>`;
      $('#again').onclick = () => { Q = null; kuis(); }; return;
    }
    const x = Q[n];
    view.innerHTML = hero('kuis') + `<div class="card sr-q"><p class="muted small">Soal ${n + 1} dari ${Q.length}</p><p><b>${esc(x.t)}</b></p>${x.o.map(o => `<button data-y="${esc(o)}">${esc(o)}</button>`).join('')}<p id="fb" class="muted"></p></div>`;
    view.onclick = e => {
      const b = e.target.closest('button[data-y]'); if (!b || view.dataset.lock) return;
      const ok = b.dataset.y === x.a; if (ok) score++;
      b.classList.add(ok ? 'ok' : 'no'); view.querySelectorAll('button[data-y]').forEach(t => { if (t.dataset.y === x.a) t.classList.add('ok'); });
      $('#fb').innerHTML = `${ok ? '✅ Benar.' : '❌ Kurang tepat.'} ${esc(x.e)} <a class="btn sm" href="${x.href}">Pelajari</a> <button class="btn sm" id="nx">Lanjut</button>`;
      view.dataset.lock = 1; $('#nx').onclick = () => { delete view.dataset.lock; n++; kuis(); };
    };
  }

  return async function (tab, q) {
    setTitle('Kisah Para Nabi', true);
    view.onclick = null; delete view.dataset.lock;
    if (d.getSurahs) { try { await d.getSurahs(); } catch (e) { /* nama surah jatuh ke 'Surah N' */ } }
    if (!/^#\/(nabi|malaikat)/.test(location.hash)) return; /* pengguna pindah halaman saat menunggu */
    if (tab === 'detail') return detail(q);
    if (tab === 'daftar') return daftar(q);
    if (tab === 'malaikat') return malaikat();
    if (tab === 'kuis') return kuis();
    return linimasa();
  };
};
