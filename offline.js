/* Unduhan offline Al-Quran.
   - Memindai cache peramban: 'quran-data-v1' (teks, tajwid, tafsir) dan 'audio-v1' (murottal Misyari Al-Afasi per ayat).
   - Beranda: daftar surah dengan penanda Teks / Tafsir / Audio, satu tombol ikon di kotak cari untuk menyaring (Semua / Tersimpan / Audio).
     Saat tanpa internet (mode pesawat), beranda otomatis menampilkan surah yang sudah diunduh.
   - Halaman #/offline: kelola unduhan per surah (teks+tafsir, audio), hapus audio, lihat pemakaian penyimpanan.
   Dipakai app.js lewat window.makeOfflineKit({...}). */
(() => {
  'use strict';
  const DATA = 'quran-data-v1', AUDIO = 'audio-v1';
  const pad3 = n => String(n).padStart(3, '0');
  const audioUrl = (n, a) => `https://verses.quran.foundation/Alafasy/mp3/${pad3(n)}${pad3(a)}.mp3`;
  const AUDIO_RE = /\/Alafasy\/mp3\/(\d{3})(\d{3})\.mp3(?:$|\?)/;
  const DATA_RE = /\/(s|tajwid|tajwid-k|tafsir)\/(\d+)\.json$/;
  const fmtBytes = b => b >= 1073741824 ? (b / 1073741824).toFixed(1).replace('.', ',') + ' GB'
    : b >= 1048576 ? (b / 1048576).toFixed(b >= 1.048576e8 ? 0 : 1).replace('.', ',') + ' MB'
      : Math.max(1, Math.round(b / 1024)) + ' KB';

  window.makeOfflineKit = ({ $, $$, esc, view, setTitle, toast, getSurahs, getMushaf, askSW, coreFiles, tafsirFiles }) => {
    const hasCache = 'caches' in window;
    const isOffline = () => navigator.onLine === false;
    const loading = '<div class="loading"><div class="spinner"></div>Memuat…</div>';

    /* ---------- pemindaian cache ---------- */
    async function scan() {
      const r = { ok: hasCache, s: new Set(), tj: new Set(), tk: new Set(), tf: new Set(), au: new Map() };
      if (!hasCache) return r;
      const sets = { s: r.s, tajwid: r.tj, 'tajwid-k': r.tk, tafsir: r.tf };
      try {
        if (await caches.has(DATA)) {
          const c = await caches.open(DATA);
          for (const q of await c.keys()) { const m = new URL(q.url).pathname.match(DATA_RE); if (m) sets[m[1]].add(+m[2]); }
        }
      } catch { /* abaikan */ }
      try {
        if (await caches.has(AUDIO)) {
          const c = await caches.open(AUDIO);
          for (const q of await c.keys()) {
            const m = q.url.match(AUDIO_RE); if (!m) continue;
            const n = +m[1]; let set = r.au.get(n); if (!set) r.au.set(n, set = new Set()); set.add(+m[2]);
          }
        }
      } catch { /* abaikan */ }
      return r;
    }
    function stat(sc, s) {
      const n = s.n, tjOk = getMushaf() === 'kemenag' ? sc.tk.has(n) : sc.tj.has(n);
      const audio = sc.au.has(n) ? sc.au.get(n).size : 0;
      return { n, text: sc.s.has(n) && tjOk, tafsir: sc.tf.has(n), audio, total: s.count, audioFull: audio >= s.count };
    }
    const sum = st => ({
      text: st.filter(x => x.text).length, tafsir: st.filter(x => x.tafsir).length,
      audioFull: st.filter(x => x.audioFull).length, audioAny: st.filter(x => x.audio > 0).length
    });
    function tags(x, showText) {
      const t = [];
      if (x.text && showText) t.push('<span class="ot ok">Teks</span>');
      if (x.tafsir) t.push('<span class="ot ok">Tafsir</span>');
      if (x.audioFull) t.push('<span class="ot ok">Audio</span>');
      else if (x.audio) t.push(`<span class="ot part">Audio ${x.audio}/${x.total}</span>`);
      if (!x.text && showText) t.push('<span class="ot no">Belum diunduh</span>');
      return t.length ? `<span class="off-tags">${t.join('')}</span>` : '';
    }

    /* ---------- bilah status offline (di bawah top bar) ---------- */
    const bar = document.createElement('div');
    bar.id = 'offBar'; bar.hidden = true; bar.setAttribute('role', 'status');
    bar.innerHTML = '<span class="dot" aria-hidden="true"></span><span class="t">Mode offline · hanya surah yang sudah diunduh yang bisa dibuka</span><a href="#/offline">Kelola</a>';
    const tb = $('#topbar'); if (tb) tb.after(bar);
    const syncBar = () => { bar.hidden = !isOffline(); document.documentElement.classList.toggle('is-offline', isOffline()); };
    syncBar();

    /* ---------- beranda: daftar surah + satu tombol ikon yang menempel di kotak cari ----------
       Penyaring (Semua / Tersimpan / Audio) ada di popover tombol ikon; daftar tidak punya judul atau chip sendiri. */
    let mounted = null;      // { ctl, surahs } daftar yang sedang tampil
    let refreshPage = null;  // fungsi penyegar halaman #/offline bila sedang terbuka

    const SV = p => `<svg class="oi" viewBox="0 0 24 24" aria-hidden="true">${p}</svg>`;
    const OI = {
      dl: '<path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M5 21h14"/>',
      all: '<path d="M4 6h16M4 12h16M4 18h16"/>',
      off: '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m22 4-10 10-3-3"/>',
      au: '<path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/>'
    };
    const dlIcon = () => SV(OI.dl);

    async function mountHome(ctl, surahs) {
      mounted = { ctl, surahs };
      const host = ctl.list;
      const sc = await scan();
      if (!host.isConnected) return;
      const st = surahs.map(s => stat(sc, s)), sm = sum(st);
      let filter = isOffline() ? 'off' : (host._f || 'all');
      if (filter === 'au' && !sm.audioAny) filter = 'all';
      const OPTS = [['all', 'Semua', surahs.length], ['off', 'Tersimpan', sm.text], ['au', 'Audio', sm.audioAny]];

      const paintList = () => {
        host._f = filter;
        const off = isOffline(), showText = off || filter !== 'all';
        const rows = surahs.map((s, i) => [s, st[i]]).filter(([, x]) => filter === 'off' ? x.text : filter === 'au' ? x.audio > 0 : true);
        host.innerHTML = rows.length ? '<ul class="surah-list">' + rows.map(([s, x]) => {
          const dead = off && !x.text;
          return `<li class="surah-item${dead ? ' is-off' : ''}"><a href="#/surah/${s.n}"${dead ? ' aria-disabled="true"' : ''}>
              <span class="badge">${s.n}</span>
              <span class="s-main"><b>${esc(s.la)}</b><small>${esc(s.mean)} · ${esc(s.place)} · ${s.count} ayat</small>${tags(x, showText)}</span>
              <span class="s-ar">${esc(s.ar)}</span></a></li>`;
        }).join('') + '</ul>'
          : `<div class="card off-empty"><p>${filter === 'au' ? 'Belum ada audio yang diunduh.' : 'Belum ada surah yang tersimpan.'}</p>
             <p class="muted small">Sambungkan internet, lalu unduh dari halaman Unduhan.</p><a class="btn primary" href="#/offline">Buka Unduhan</a></div>`;
      };
      const paintPop = () => {
        if (!ctl.pop || !ctl.btn) return;
        const cur = OPTS.find(o => o[0] === filter) || OPTS[0];
        ctl.btn.dataset.on = filter !== 'all' ? '1' : '';
        ctl.btn.setAttribute('aria-label', filter === 'all' ? 'Unduhan dan saringan daftar surah' : `Saringan: ${cur[1]}`);
        ctl.btn.title = filter === 'all' ? 'Unduhan' : cur[1];
        ctl.pop.innerHTML = `<div class="op-opts" role="radiogroup" aria-label="Saring daftar surah">${OPTS.filter(o => o[0] === 'all' || o[2] > 0 || o[0] === filter).map(o =>
          `<button type="button" role="radio" class="op-opt" data-f="${o[0]}" aria-checked="${o[0] === filter}">${SV(OI[o[0]])}<span>${o[1]}</span><b>${o[2]}</b></button>`).join('')}</div>
          <a class="op-manage" href="#/offline">Kelola unduhan &rsaquo;</a>`;
      };
      if (ctl.btn && !ctl.btn.firstElementChild) ctl.btn.innerHTML = dlIcon();
      if (!host._wired) {
        host._wired = true;
        host.addEventListener('click', e => {
          const dead = e.target.closest('.surah-item.is-off a');
          if (dead) { e.preventDefault(); toast('Surah ini belum diunduh. Sambungkan internet untuk membukanya.'); }
        });
      }
      if (ctl.pop) {
        ctl.pop.onclick = e => {
          const f = e.target.closest('.op-opt');
          if (f) { filter = f.dataset.f; paintList(); paintPop(); if (ctl.close) ctl.close(); return; }
          if (e.target.closest('.op-manage') && ctl.close) ctl.close();
        };
      }
      paintList(); paintPop();
    }

    /* ---------- halaman #/offline ---------- */
    async function OfflineView() {
      setTitle('Unduhan offline', true);
      view.innerHTML = loading;
      let surahs;
      try { surahs = await getSurahs(); }
      catch (e) {
        view.innerHTML = `<div class="card error"><p><b>Daftar surah belum tersimpan.</b></p><p class="muted small">Buka aplikasi sekali saat ada internet agar data tersimpan untuk offline.</p><a class="btn primary" href="#/">Ke beranda</a></div>`;
        return;
      }
      let sc = await scan(), filter = 'all';
      const busy = new Map(), cancel = new Set();
      const page = document.createElement('div'); page.id = 'offPage';
      view.replaceChildren(page);
      const alive = () => page.isConnected;
      const statsOf = () => surahs.map(s => stat(sc, s));

      const persist = () => { try { navigator.storage && navigator.storage.persist && navigator.storage.persist(); } catch { /* abaikan */ } };
      async function storageLine() {
        const el = $('#offStorage', page); if (!el) return;
        try {
          const e = await navigator.storage.estimate();
          if (!alive()) return;
          el.textContent = `Penyimpanan aplikasi: ${fmtBytes(e.usage || 0)} dipakai dari ${fmtBytes(e.quota || 0)}.`;
        } catch { el.textContent = ''; }
      }

      function rowHTML(s, x) {
        const b = busy.get(s.n), n = s.n;
        const textBtn = x.text && x.tafsir ? '<span class="ot ok big">Teks &amp; tafsir ✓</span>'
          : `<button type="button" class="btn sm" data-a="text" data-n="${n}"${isOffline() ? ' disabled' : ''}>Unduh teks &amp; tafsir</button>`;
        const audioBtn = x.audioFull ? `<span class="ot ok big">Audio ✓</span><button type="button" class="btn sm ghost" data-a="rmaudio" data-n="${n}" aria-label="Hapus audio ${esc(s.la)}">Hapus audio</button>`
          : `<button type="button" class="btn sm" data-a="audio" data-n="${n}"${isOffline() ? ' disabled' : ''}>${x.audio ? `Lanjutkan audio (${x.audio}/${x.total})` : 'Unduh audio'}</button>${x.audio ? `<button type="button" class="btn sm ghost" data-a="rmaudio" data-n="${n}" aria-label="Hapus audio ${esc(s.la)}">Hapus</button>` : ''}`;
        const act = b ? `<div class="off-prog" role="progressbar" aria-valuenow="${Math.round(b.p * 100)}" aria-valuemin="0" aria-valuemax="100"><i style="width:${Math.round(b.p * 100)}%"></i></div>
            <div class="off-act"><span class="muted small">${esc(b.label)}</span><button type="button" class="btn sm ghost" data-a="cancel" data-n="${n}">Batal</button></div>`
          : `<div class="off-act">${textBtn}${audioBtn}</div>`;
        return `<li class="off-row" data-n="${n}"><a class="off-main" href="#/surah/${n}"><span class="badge">${n}</span>
          <span class="s-main"><b>${esc(s.la)}</b><small>${esc(s.mean)} · ${s.count} ayat</small>${tags(x, true)}</span><span class="s-ar">${esc(s.ar)}</span></a>${act}</li>`;
      }
      const repaintRow = n => {
        const li = $(`.off-row[data-n="${n}"]`, page); if (!li) return;
        const t = document.createElement('template'); t.innerHTML = rowHTML(surahs[n - 1], stat(sc, surahs[n - 1]));
        li.replaceWith(t.content.firstElementChild);
      };

      function paint() {
        if (!alive()) return;
        const st = statsOf(), sm = sum(st), off = isOffline();
        const F = [['all', 'Semua', st.length], ['text', 'Sudah diunduh', sm.text], ['au', 'Ada audio', sm.audioAny], ['none', 'Belum', st.length - sm.text]];
        const rows = surahs.filter((s, i) => { const x = st[i]; return filter === 'text' ? x.text : filter === 'au' ? x.audio > 0 : filter === 'none' ? !x.text : true; });
        const keepMsg = $('#offMsg', page) ? $('#offMsg', page).textContent : '';
        page.innerHTML = `
          <section class="card off-sum">
            <div class="off-head"><strong>Unduhan offline</strong><span class="off-pill ${off ? 'is-off' : 'is-on'}">${off ? 'Offline' : 'Online'}</span></div>
            <div class="off-stats">
              <div><b>${sm.text}<small>/114</small></b><span>surah bisa dibaca</span></div>
              <div><b>${sm.tafsir}<small>/114</small></b><span>tafsir</span></div>
              <div><b>${sm.audioFull}<small>/114</small></b><span>audio lengkap</span></div>
            </div>
            <p class="muted small" id="offStorage"></p>
            <p class="muted small" id="offMsg" role="status">${esc(keepMsg)}</p>
            ${off ? '<p class="off-note">Kamu sedang offline. Unduhan baru butuh internet; yang sudah tersimpan tetap bisa dibuka.</p>' : ''}
            <div class="btn-row">
              <button type="button" class="btn primary" data-a="core"${off ? ' disabled' : ''}>Unduh semua teks</button>
              <button type="button" class="btn" data-a="tafsir"${off ? ' disabled' : ''}>Unduh semua tafsir</button>
              ${sm.audioAny ? '<button type="button" class="btn ghost" data-a="clear">Hapus semua audio</button>' : ''}
            </div>
            <p class="muted small">Audio memakai kuota cukup besar, jadi diunduh per surah (qari Misyari Al-Afasi). Surah yang audionya sudah diunduh bisa diputar tanpa internet.</p>
          </section>
          <div class="off-chips" role="group" aria-label="Saring">${F.map(f => `<button type="button" class="off-chip" data-f="${f[0]}" aria-pressed="${f[0] === filter}">${f[1]} <small>${f[2]}</small></button>`).join('')}</div>
          <ul class="off-list">${rows.length ? rows.map(s => rowHTML(s, st[s.n - 1])).join('') : '<li class="card muted">Tidak ada surah pada penyaring ini.</li>'}</ul>`;
        storageLine();
      }
      refreshPage = async () => { if (!alive()) { refreshPage = null; return; } sc = await scan(); paint(); };
      const msg = t => { const el = $('#offMsg', page); if (el) el.textContent = t; };

      async function dlText(n) {
        const s = surahs[n - 1];
        const files = [`s/${n}.json`, `tajwid/${n}.json`, `tajwid-k/${n}.json`, `tafsir/${n}.json`];
        busy.set(n, { p: 0, label: 'Mengunduh teks & tafsir…' }); cancel.delete(n); persist(); repaintRow(n);
        try {
          const c = await caches.open(DATA); let i = 0;
          for (const f of files) {
            if (cancel.has(n)) break;
            if (!(await c.match(f))) { const r = await fetch(f); if (!r.ok) throw new Error('HTTP ' + r.status); await c.put(f, r); }
            busy.set(n, { p: ++i / files.length, label: 'Mengunduh teks & tafsir…' }); repaintRow(n);
          }
          if (!cancel.has(n)) toast(`${s.la}: teks & tafsir tersimpan`);
        } catch { toast('Unduhan gagal. Periksa koneksi internet.'); }
        busy.delete(n); cancel.delete(n); sc = await scan(); repaintRow(n); summaryRefresh();
      }
      async function dlAudio(n) {
        const s = surahs[n - 1];
        busy.set(n, { p: 0, label: 'Mengunduh audio…' }); cancel.delete(n); persist(); repaintRow(n);
        let fail = 0;
        try {
          const c = await caches.open(AUDIO), have = sc.au.get(n) || new Set(), todo = [];
          for (let a = 1; a <= s.count; a++) if (!have.has(a)) todo.push(a);
          let idx = 0, done = have.size;
          const worker = async () => {
            while (idx < todo.length && !cancel.has(n) && fail < 5) {
              const a = todo[idx++], u = audioUrl(n, a);
              try { const r = await fetch(u, { mode: 'cors' }); if (!r.ok) throw 0; await c.put(u, r); done++; }
              catch { fail++; }
              busy.set(n, { p: done / s.count, label: `Mengunduh audio ${done}/${s.count}` });
              if (done % 3 === 0 || done === s.count) repaintRow(n);
            }
          };
          await Promise.all([worker(), worker(), worker()]);
        } catch { fail = 99; }
        const cancelled = cancel.has(n);
        busy.delete(n); cancel.delete(n); sc = await scan(); repaintRow(n); summaryRefresh();
        if (cancelled) toast('Unduhan audio dihentikan. Bagian yang sudah masuk tetap tersimpan.');
        else if (fail) toast('Sebagian audio gagal diunduh (internet terputus?). Ketuk "Lanjutkan audio" untuk melanjutkan.');
        else toast(`${s.la}: audio tersimpan untuk offline`);
      }
      async function rmAudio(n) {
        const s = surahs[n - 1];
        if (!confirm(`Hapus audio ${s.la} dari penyimpanan offline?`)) return;
        try {
          const c = await caches.open(AUDIO);
          for (const q of await c.keys()) { const m = q.url.match(AUDIO_RE); if (m && +m[1] === n) await c.delete(q); }
        } catch { /* abaikan */ }
        sc = await scan(); repaintRow(n); summaryRefresh(); toast('Audio dihapus');
      }
      async function clearAudio() {
        if (!confirm('Hapus semua audio yang sudah diunduh? Teks dan tafsir tidak ikut terhapus.')) return;
        try {
          const c = await caches.open(AUDIO);
          for (const q of await c.keys()) if (AUDIO_RE.test(q.url)) await c.delete(q);
        } catch { /* abaikan */ }
        sc = await scan(); paint(); toast('Semua audio dihapus');
      }
      /* perbarui kartu ringkasan tanpa menggambar ulang seluruh daftar */
      function summaryRefresh() {
        const sm = sum(statsOf()), b = $$('.off-stats b', page);
        if (b.length === 3) { b[0].innerHTML = `${sm.text}<small>/114</small>`; b[1].innerHTML = `${sm.tafsir}<small>/114</small>`; b[2].innerHTML = `${sm.audioFull}<small>/114</small>`; }
        storageLine();
      }

      page.addEventListener('click', e => {
        const f = e.target.closest('.off-chip'); if (f) { filter = f.dataset.f; paint(); return; }
        const b = e.target.closest('[data-a]'); if (!b || b.disabled) return;
        const a = b.dataset.a, n = +b.dataset.n;
        if (a === 'text') dlText(n); else if (a === 'audio') dlAudio(n); else if (a === 'rmaudio') rmAudio(n);
        else if (a === 'cancel') cancel.add(n);
        else if (a === 'clear') clearAudio();
        else if (a === 'core') { persist(); msg('Mengunduh data Al-Qur’an…'); askSW('precache', coreFiles()); }
        else if (a === 'tafsir') { persist(); msg('Mengunduh tafsir…'); askSW('precache', tafsirFiles()); }
      });
      paint();
    }

    /* ---------- perubahan koneksi ---------- */
    window.addEventListener('offline', () => {
      syncBar(); toast('Kamu offline. Menampilkan surah yang sudah diunduh.');
      if (mounted && mounted.ctl.list.isConnected) mountHome(mounted.ctl, mounted.surahs);
      if (refreshPage) refreshPage();
    });
    window.addEventListener('online', () => {
      syncBar(); toast('Kembali online');
      if (mounted && mounted.ctl.list.isConnected) mountHome(mounted.ctl, mounted.surahs);
      if (refreshPage) refreshPage();
    });
    /* kemajuan unduhan massal dari service worker (dikirim ulang oleh app.js) */
    window.addEventListener('quran-offline-progress', e => {
      const m = e.detail || {}, el = $('#offMsg'); if (!el) return;
      const label = m.kind === 'tafsir' ? 'Tafsir' : 'Data Al-Qur’an';
      el.textContent = m.done >= m.total ? `${label}: tersimpan untuk offline (${m.total} berkas).` : `${label}: mengunduh ${m.done}/${m.total}…`;
      if (m.done >= m.total && refreshPage) refreshPage();
    });

    return { OfflineView, mountHome, scan, isOffline };
  };
})();
