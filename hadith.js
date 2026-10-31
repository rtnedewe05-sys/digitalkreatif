/* Hadis Shahih: Shahih Bukhari & Shahih Muslim (Arab + terjemahan Indonesia), cari, penanda, salin/bagikan.
 * Data dimuat per 50 hadis (data/hadis/), otomatis tersimpan offline setelah dibuka. Sumber: lihat README. */
window.makeHadithView = function (d) {
  const { $, esc, view, setTitle, toast, store } = d;
  const BASE = 'data/hadis/';
  const NAMA = { bukhari: 'Shahih Bukhari', muslim: 'Shahih Muslim', abudawud: 'Sunan Abu Dawud', tirmidzi: 'Jami\' at-Tirmidzi' };
  const KITAB = Object.keys(NAMA);
  const SHORT = { bukhari: 'Bukhari', muslim: 'Muslim', abudawud: 'Abu Dawud', tirmidzi: 'Tirmidzi' };
  const GR = { s: ['Shahih', 'gr-s'], h: ['Hasan', 'gr-h'], d: ['Dhaif (lemah)', 'gr-d'], u: ['Derajat belum tersedia', 'gr-u'] };
  const gradeOf = h => h.g ? h.g : 's';
  const showWeak = () => store.get('hadisWeak', false);
  const cache = {};
  const getJSON = async f => {
    if (cache[f]) return cache[f];
    const r = await fetch(BASE + f);
    if (!r.ok) throw new Error('HTTP ' + r.status);
    return (cache[f] = await r.json());
  };
  const getBm = () => store.get('hadisBm', []);
  const isBm = (b, n) => getBm().some(x => x.b === b && x.n === n);
  const ref = (b, n) => `HR. ${SHORT[b]} no. ${n}`;
  const loading = '<div class="loading"><div class="spinner"></div>Memuat…</div>';
  const fail = m => `<div class="card error"><p><b>Gagal memuat hadis.</b></p><p class="muted small">${esc(m)}<br>Bagian yang pernah dibuka tersedia offline.</p><button class="btn primary" id="hdRetry">Coba lagi</button></div>`;

  /* pisahkan rantai perawi (sanad) dari isi hadis (matan) pada terjemahan */
  function split(t) {
    const q = t.indexOf('"');
    if (q > 0 && q < 900) return [t.slice(0, q).trim(), t.slice(q)];
    const i = t.lastIndexOf(']', 900);
    return i > 0 ? [t.slice(0, i + 1).trim(), t.slice(i + 1).replace(/^[\s,;:]+/, '')] : ['', t];
  }

  /* ----- Suara (Text-to-Speech bawaan browser/perangkat; tanpa unduhan data) ----- */
  const synth = window.speechSynthesis;
  let ttsBtn = null;
  function ttsReset() { if (ttsBtn) { ttsBtn.classList.remove('on'); ttsBtn.textContent = ttsBtn.dataset.label; ttsBtn = null; } }
  function stopSpeak() { if (synth) { synth.cancel(); } ttsReset(); }
  function chunks(t, max) {
    const out = [];
    (t.replace(/\s+/g, ' ').trim().match(/[^.!?؟،,;:]+[.!?؟،,;:]*/g) || []).forEach(seg => {
      seg = seg.trim();
      let cur = '';
      seg.split(' ').forEach(w => {
        if ((cur + ' ' + w).length > max && cur) { out.push(cur); cur = w; } else cur = cur ? cur + ' ' + w : w;
      });
      if (cur) out.push(cur);
    });
    return out;
  }
  function speak(btn, text, lang) {
    if (!synth) { toast('Perangkat ini tidak mendukung suara'); return; }
    if (ttsBtn === btn) { stopSpeak(); return; }
    stopSpeak();
    const voices = synth.getVoices();
    const v = voices.find(x => x.lang.toLowerCase().replace('_', '-').startsWith(lang));
    if (voices.length && !v) { toast(lang === 'ar' ? 'Suara bahasa Arab belum terpasang di perangkat ini' : 'Suara bahasa Indonesia belum terpasang di perangkat ini'); return; }
    const parts = chunks(text, lang === 'ar' ? 140 : 200);
    if (!parts.length) return;
    ttsBtn = btn; btn.classList.add('on'); btn.textContent = '⏹ Berhenti';
    parts.forEach((t, i) => {
      const u = new SpeechSynthesisUtterance(t);
      u.lang = lang === 'ar' ? 'ar-SA' : 'id-ID'; if (v) u.voice = v;
      u.rate = lang === 'ar' ? 0.85 : 0.95;
      if (i === parts.length - 1) { u.onend = () => { if (ttsBtn === btn) ttsReset(); }; }
      u.onerror = e => { if (e.error !== 'canceled' && e.error !== 'interrupted' && ttsBtn === btn) ttsReset(); };
      synth.speak(u);
    });
  }

  const tabs = cur => `<nav class="hd-tabs" aria-label="Kitab hadis">
    ${[['pilihan', 'Pilihan'], ['bukhari', 'Bukhari'], ['muslim', 'Muslim'], ['abudawud', 'Abu Dawud'], ['tirmidzi', 'Tirmidzi'], ['tersimpan', 'Tersimpan']]
      .map(([k, l]) => `<a class="chip ${cur === k ? 'active' : ''}" href="#/hadis/${k}" ${cur === k ? 'aria-current="page"' : ''}>${l}</a>`).join('')}</nav>`;

  const head = cur => `<section class="hd-hero"><p class="hd-bis" lang="ar" dir="rtl">قَالَ رَسُولُ اللَّهِ ﷺ</p>
    <h1>Hadis Shahih</h1><p>Bukhari, Muslim, Abu Dawud, dan Tirmidzi, lengkap dengan Arab, terjemahan Indonesia, dan derajat tiap hadis.</p></section>
    <form class="hd-search" id="hdSearch" role="search"><input id="hdQ" type="search" placeholder="Cari hadis (mis. niat, sabar, sholat) atau nomor" autocomplete="off" enterkeyhint="search"><button class="btn primary" type="submit">Cari</button></form>
    ${tabs(cur)}`;

  function card(h, o = {}) {
    const [san, mat] = split(h.i);
    const on = isBm(h.b, h.n);
    return `<article class="card hd-card ${o.hl ? 'hl' : ''}" id="h-${h.b}-${h.n}" data-b="${h.b}" data-n="${h.n}">
      <div class="hd-top"><span class="hd-badge">${NAMA[h.b]}</span><span class="hd-no">No. ${h.n}</span></div>
      <div class="hd-gr ${GR[gradeOf(h)][1]}"><b>Derajat: ${GR[gradeOf(h)][0]}</b>${h.g ? '' : ' <span>· disepakati ulama (kitab Shahihain)</span>'}${h.gd ? `<details><summary>Penilaian ulama</summary><p class="small">${esc(h.gd)}</p></details>` : ''}${h.g === 'd' ? '<p class="small">Hadis lemah: jangan dijadikan dalil hukum atau keutamaan amal tanpa rujukan ulama.</p>' : ''}</div>
      <p class="hd-ar arab" lang="ar" dir="rtl">${esc(h.a)}</p>
      <p class="hd-id">${esc(mat)}</p>
      ${san ? `<details class="hd-san"><summary>Sanad / perawi</summary><p class="muted small">${esc(san)}</p></details>` : ''}
      <div class="hd-acts">
        <button class="btn sm ${on ? 'on' : ''}" data-act="bm" aria-pressed="${on}">${on ? '★ Tersimpan' : '☆ Simpan'}</button>
        <button class="btn sm" data-act="ar" data-label="🔊 Arab" aria-label="Dengarkan bacaan Arab">🔊 Arab</button>
        <button class="btn sm" data-act="id" data-label="🔊 Terjemahan" aria-label="Dengarkan terjemahan Indonesia">🔊 Terjemahan</button>
        <button class="btn sm" data-act="copy">Salin</button>
        <button class="btn sm" data-act="share">Bagikan</button>
      </div></article>`;
  }

  function wire(list) {
    const map = {}; list.forEach(h => map[h.b + '-' + h.n] = h);
    view.onclick = async e => {
      const btn = e.target.closest('[data-act]'); if (!btn) return;
      const c = btn.closest('.hd-card'); const h = map[c.dataset.b + '-' + c.dataset.n]; if (!h) return;
      const [, mat] = split(h.i);
      const text = `${h.a}\n\n${mat}\n\n(${ref(h.b, h.n)} · derajat: ${GR[gradeOf(h)][0]})`;
      if (btn.dataset.act === 'ar') return speak(btn, h.a, 'ar');
      if (btn.dataset.act === 'id') return speak(btn, mat, 'id');
      if (btn.dataset.act === 'bm') {
        let l = getBm();
        if (isBm(h.b, h.n)) l = l.filter(x => !(x.b === h.b && x.n === h.n)); else l.unshift({ b: h.b, n: h.n, a: h.a, i: h.i, g: h.g, gd: h.gd });
        store.set('hadisBm', l);
        const on = isBm(h.b, h.n);
        btn.classList.toggle('on', on); btn.setAttribute('aria-pressed', on); btn.textContent = on ? '★ Tersimpan' : '☆ Simpan';
        toast(on ? 'Hadis disimpan' : 'Dihapus dari tersimpan');
        if (view.dataset.hd === 'tersimpan' && !on) c.remove();
      } else if (btn.dataset.act === 'copy') {
        try { await navigator.clipboard.writeText(text); toast('Hadis disalin'); } catch { toast('Gagal menyalin'); }
      } else if (navigator.share) { navigator.share({ text }).catch(() => { }); }
      else { try { await navigator.clipboard.writeText(text); toast('Hadis disalin'); } catch { toast('Bagikan tidak didukung'); } }
    };
  }

  function bindSearch() {
    $('#hdSearch').addEventListener('submit', e => {
      e.preventDefault();
      const q = $('#hdQ').value.trim(); if (!q) return;
      const m = q.match(/^(bukhari|muslim|b|m)?\s*[:#]?\s*(\d{1,5})$/i);
      if (m) { const b = (m[1] || 'bukhari').toLowerCase().startsWith('m') ? 'muslim' : 'bukhari'; location.hash = `#/hadis/${b}?n=${m[2]}`; }
      else location.hash = '#/hadis/cari?q=' + encodeURIComponent(q);
    });
  }

  /* ----- Pilihan ----- */
  async function pilihan() {
    view.innerHTML = head('pilihan') + loading; bindSearch();
    try {
      const list = await getJSON('pilihan.json');
      const day = Math.floor(Date.now() / 864e5), today = list[day % list.length];
      view.innerHTML = head('pilihan') +
        `<p class="mini-title hd-sec">Hadis hari ini</p>${card(today, { hl: true })}
         <p class="mini-title hd-sec">Hadis pilihan lainnya</p>${list.filter(x => x !== today).map(h => card(h)).join('')}
         <p class="muted small hd-note">Seluruh hadis di Shahih Bukhari dan Shahih Muslim dinilai shahih oleh jumhur ulama. Untuk hukum fikih, rujuklah ulama atau ustaz yang terpercaya.</p>`;
      bindSearch(); wire(list);
    } catch (err) { view.innerHTML = head('pilihan') + fail(err.message); bindSearch(); $('#hdRetry').onclick = pilihan; }
  }

  /* ----- Kitab (per halaman 50 hadis) ----- */
  async function kitab(b, page, num) {
    view.innerHTML = head(b) + loading; bindSearch();
    try {
      const meta = await getJSON('meta.json'), m = meta[b];
      if (num) { let k = 0; m.first.forEach((f, i) => { if (f <= num) k = i; }); page = k; }
      const pages = m.first.length; page = Math.max(0, Math.min(pages - 1, page || 0));
      const rows = await getJSON(`${b}-${page}.json`);
      const list = rows.map(r => ({ b, n: r[0], a: r[1], i: r[2], g: r[3], gd: r[4] }));
      const pager = `<div class="hd-pager"><a class="btn ${page <= 0 ? 'dis' : ''}" href="#/hadis/${b}?p=${page - 1}" ${page <= 0 ? 'aria-disabled="true" tabindex="-1"' : ''}>← Sebelumnya</a>
        <span class="muted small">Hal. ${page + 1} / ${pages}<br>No. ${list[0].n}–${list[list.length - 1].n}</span>
        <a class="btn ${page >= pages - 1 ? 'dis' : ''}" href="#/hadis/${b}?p=${page + 1}" ${page >= pages - 1 ? 'aria-disabled="true" tabindex="-1"' : ''}>Berikutnya →</a></div>`;
      view.innerHTML = head(b) + `<p class="muted small hd-meta">${NAMA[b]} · ${m.total.toLocaleString('id')} hadis. Ketik nomor di kolom cari untuk langsung melompat (mis. <code>${b} 1</code>).</p>` +
        pager + list.map(h => card(h, { hl: h.n === num })).join('') + pager;
      bindSearch(); wire(list);
      const t = num && document.getElementById(`h-${b}-${num}`);
      if (t) t.scrollIntoView({ block: 'center' });
      else if (num) toast(`Nomor ${num} tidak ada; ditampilkan halaman terdekat`);
    } catch (err) { view.innerHTML = head(b) + fail(err.message); bindSearch(); $('#hdRetry').onclick = () => kitab(b, page, num); }
  }

  /* ----- Cari ----- */
  const norm = s => s.toLowerCase().replace(/[’`ʿʾ]/g, "'");
  async function cari(q) {
    view.innerHTML = head('') + loading; bindSearch(); $('#hdQ').value = q;
    try {
      const files = await Promise.all(KITAB.map(k => getJSON('cari-' + k + '.json')));
      const words = norm(q).split(/\s+/).filter(Boolean);
      const hit = [];
      let hidden = 0;
      KITAB.forEach((b, bi) => { for (const [n, t, gg] of files[bi]) { const s = norm(t); if (words.every(w => s.includes(w))) { const g = gg || 's'; if (g === 'd' && !showWeak()) { hidden++; continue; } hit.push({ b, n, t, g }); } } });
      const rx = new RegExp('(' + words.map(w => esc(w).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|') + ')', 'gi');
      const mark = t => esc(t).replace(rx, '<mark>$1</mark>');
      let shown = 0;
      const more = () => {
        const next = hit.slice(shown, shown + 30); shown += next.length;
        $('#hdRes').insertAdjacentHTML('beforeend', next.map(h => `<a class="card hd-res" href="#/hadis/${h.b}?n=${h.n}"><div class="hd-top"><span class="hd-badge">${NAMA[h.b]}</span><span class="hd-no">No. ${h.n}</span></div><span class="hd-gtag ${GR[h.g][1]}">${GR[h.g][0]}</span><p>${mark(h.t.length >= 300 ? h.t + '…' : h.t)}</p></a>`).join(''));
        $('#hdMore').hidden = shown >= hit.length;
      };
      view.innerHTML = head('') + `<p class="muted small hd-meta">${hit.length ? `<b>${hit.length.toLocaleString('id')}</b> hadis ditemukan untuk “${esc(q)}”.` : `Tidak ada hadis untuk “${esc(q)}”. Coba kata lain atau ejaan lain (mis. “shalat”, “salat”, “sholat”).`}</p><label class="check hd-weak"><input type="checkbox" id="hdWeak" ${showWeak() ? 'checked' : ''}> Tampilkan hadis dhaif${hidden ? ` (${hidden.toLocaleString('id')} disembunyikan)` : ''}</label><div id="hdRes"></div><button class="btn" id="hdMore" hidden>Tampilkan lebih banyak</button>`;
      bindSearch(); $('#hdQ').value = q; $('#hdWeak').onchange = e => { store.set('hadisWeak', e.target.checked); cari(q); }; $('#hdMore').onclick = more; if (hit.length) more();
    } catch (err) { view.innerHTML = head('') + fail(err.message); bindSearch(); $('#hdRetry').onclick = () => cari(q); }
  }

  /* ----- Tersimpan ----- */
  function tersimpan() {
    const l = getBm();
    view.innerHTML = head('tersimpan') + (l.length ? l.map(h => card(h)).join('') : '<div class="card muted">Belum ada hadis tersimpan. Ketuk “☆ Simpan” pada hadis mana pun; tersimpan di perangkat ini dan bisa dibaca offline.</div>');
    view.dataset.hd = 'tersimpan'; bindSearch(); wire(l);
  }

  return function (sub, q) {
    setTitle('Hadis Shahih', true);
    stopSpeak(); delete view.dataset.hd; view.onclick = null;
    if (KITAB.includes(sub)) return kitab(sub, parseInt(q.get('p'), 10) || 0, parseInt(q.get('n'), 10) || 0);
    if (sub === 'cari') return cari(q.get('q') || '');
    if (sub === 'tersimpan') return tersimpan();
    return pilihan();
  };
};
