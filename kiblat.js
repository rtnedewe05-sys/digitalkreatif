/* Halaman "Kompas Kiblat": arah kiblat dari lokasi (GPS / kota / koordinat manual) + kompas hidup memakai sensor HP.
 * Hitungan arah & jarak 100% offline (rumus lingkaran besar ke Ka'bah). Sensor: deviceorientation(absolute) / webkitCompassHeading (iOS). */
window.makeKiblatView = function (d) {
  const { $, esc, view, setTitle, toast, store } = d;
  const KAABA = [21.422487, 39.826206], R = Math.PI / 180, C = 170;
  const CITIES = [
    ['Banda Aceh', 5.5483, 95.3238], ['Medan', 3.5952, 98.6722], ['Padang', -0.9471, 100.4172], ['Pekanbaru', 0.5071, 101.4478],
    ['Palembang', -2.9761, 104.7754], ['Bandar Lampung', -5.4292, 105.261], ['Jakarta', -6.2088, 106.8456], ['Bandung', -6.9175, 107.6191],
    ['Semarang', -6.9667, 110.4167], ['Yogyakarta', -7.7956, 110.3695], ['Surabaya', -7.2575, 112.7521], ['Denpasar', -8.6705, 115.2126],
    ['Mataram', -8.5833, 116.1167], ['Kupang', -10.1772, 123.607], ['Pontianak', -0.0263, 109.3425], ['Banjarmasin', -3.3186, 114.5944],
    ['Balikpapan', -1.2379, 116.8529], ['Makassar', -5.1477, 119.4327], ['Manado', 1.4748, 124.8421], ['Ambon', -3.6954, 128.1814], ['Jayapura', -2.5337, 140.7181]
  ];
  const WIND = ['Utara', 'Utara Timur Laut', 'Timur Laut', 'Timur Timur Laut', 'Timur', 'Timur Tenggara', 'Tenggara', 'Selatan Tenggara', 'Selatan', 'Selatan Barat Daya', 'Barat Daya', 'Barat Barat Daya', 'Barat', 'Barat Barat Laut', 'Barat Laut', 'Utara Barat Laut'];
  const wind = b => WIND[Math.round(b / 22.5) % 16];
  const norm = a => ((a % 360) + 360) % 360;
  const diff = (a, b) => ((a - b + 540) % 360) - 180; // selisih bertanda terpendek a-b
  const bearing = (la, lo) => {
    const p1 = la * R, p2 = KAABA[0] * R, dl = (KAABA[1] - lo) * R;
    return norm(Math.atan2(Math.sin(dl), Math.cos(p1) * Math.tan(p2) - Math.sin(p1) * Math.cos(dl)) / R);
  };
  const dist = (la, lo) => {
    const p1 = la * R, p2 = KAABA[0] * R, dp = p2 - p1, dl = (KAABA[1] - lo) * R;
    const a = Math.sin(dp / 2) ** 2 + Math.cos(p1) * Math.cos(p2) * Math.sin(dl / 2) ** 2;
    return 2 * 6371 * Math.asin(Math.sqrt(a));
  };
  /* Arah (derajat dari utara magnetik) ke mana HP menghadap, dari sudut alpha/beta/gamma */
  const headingFrom = (al, be, ga) => {
    const a = al * R, b = be * R, g = ga * R, cA = Math.cos(a), sA = Math.sin(a), cB = Math.cos(b), sB = Math.sin(b), cG = Math.cos(g), sG = Math.sin(g);
    const topE = -sA * cB, topN = cA * cB;                 // sisi atas HP (HP datar)
    const bkE = -cA * sG - sA * sB * cG, bkN = -sA * sG + cA * sB * cG; // belakang HP (HP tegak)
    const [e, n] = Math.hypot(topE, topN) >= Math.hypot(bkE, bkN) ? [topE, topN] : [bkE, bkN];
    return norm(Math.atan2(e, n) / R);
  };

  let stop = null;

  const CSS = `
  .kb-wrap{display:grid;gap:12px}
  .kb-loc p{margin:0 0 8px}
  .kb-loc .row{display:grid;grid-template-columns:1fr 1fr;gap:8px}
  .kb-loc select,.kb-loc input{width:100%;min-width:0;padding:9px;border-radius:10px;border:1px solid var(--border);background:var(--bg);color:inherit}
  .kb-bar{display:flex;gap:8px;align-items:stretch;flex-wrap:nowrap}
  .kb-bar>*{flex:0 0 auto;min-width:0;height:44px;box-sizing:border-box;display:flex;align-items:center;justify-content:center;gap:6px;white-space:nowrap;padding:0 10px;margin:0;font:inherit;font-size:.92rem;font-weight:600}
  .kb-bar select{flex:1 1 0;border-radius:12px;border:1px solid var(--border);background:var(--bg);color:inherit;text-overflow:ellipsis}
  .kb-bar>.btn{width:48px;padding:0;font-size:1.2rem}
  .kb-bar .btn.on{border-color:var(--primary);color:var(--primary)}
  .kb-dial{display:block;width:min(100%,360px);height:auto;margin:0 auto;touch-action:manipulation}
  .kb-ring{fill:var(--surface);stroke:var(--border);stroke-width:3;transition:stroke .2s,stroke-width .2s}
  .kb.ok .kb-ring{stroke:#16a34a;stroke-width:6}
  .kb-tk{stroke:var(--muted);stroke-width:1.2}.kb-tk.mj{stroke:var(--text);stroke-width:2.2}
  .kb-dg{fill:var(--muted);font:600 10px Inter,system-ui,sans-serif;text-anchor:middle}
  .kb-cd{fill:var(--text);font:700 20px Inter,system-ui,sans-serif;text-anchor:middle}.kb-cd.n{fill:#dc2626}
  .kb-qa{stroke:var(--primary);stroke-width:5;stroke-linecap:round}.kb-qh{fill:var(--primary)}
  .kb-fw{stroke:var(--muted);stroke-width:2;stroke-dasharray:4 5}
  .kb-hub{fill:var(--text)}.kb-ptr{fill:var(--accent)}
  .kb.ok .kb-fw{stroke:#16a34a;stroke-dasharray:none}
  #kbRose{transition:transform .08s linear}
  .kb-stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(105px,1fr));gap:8px}
  .kb-st{border:1px solid var(--border);border-radius:12px;padding:8px 10px;text-align:center;background:var(--bg)}
  .kb-st small{display:block;color:var(--muted)}.kb-st b{font-size:1.15rem}.kb-st span{display:block;font-size:.78rem;color:var(--muted)}
  .kb-msg{text-align:center;font-weight:600;min-height:1.5em;margin:0}
  .kb.ok .kb-msg{color:#16a34a}
  .kb-tips{margin:0;padding-inline-start:18px;line-height:1.55}
  @media (prefers-reduced-motion:reduce){#kbRose,.kb-ring{transition:none}}`;

  const dialSVG = () => {
    let tk = '', dg = '';
    for (let a = 0; a < 360; a += 5) {
      const mj = a % 30 === 0, md = a % 10 === 0;
      tk += `<line x1="${C}" y1="${C - 140}" x2="${C}" y2="${C - (mj ? 122 : md ? 128 : 132)}" transform="rotate(${a} ${C} ${C})" class="kb-tk${mj ? ' mj' : ''}"/>`;
    }
    for (let a = 30; a < 360; a += 30) if (a % 90) dg += `<text x="${C}" y="${C - 108}" transform="rotate(${a} ${C} ${C})" class="kb-dg">${a}</text>`;
    const cd = [['U', 0], ['T', 90], ['S', 180], ['B', 270]].map(([t, a]) => `<text x="${C}" y="${C - 86}" transform="rotate(${a} ${C} ${C})" class="kb-cd${a === 0 ? ' n' : ''}">${t}</text>`).join('');
    return `<svg class="kb-dial" viewBox="0 -10 340 350" role="img" aria-label="Kompas arah kiblat">
      <g id="kbRose"><circle class="kb-ring" cx="${C}" cy="${C}" r="140"/>${tk}${dg}${cd}
        <g id="kbQ" visibility="hidden"><line class="kb-qa" x1="${C}" y1="${C}" x2="${C}" y2="${C - 66}"/><path class="kb-qh" d="M${C} ${C - 80} l-11 18 h22 z"/>
          <g aria-label="Ka'bah"><rect x="${C - 10}" y="${C - 162}" width="20" height="20" rx="2" fill="#111"/><rect x="${C - 10}" y="${C - 156}" width="20" height="4" fill="#d4a017"/></g></g></g>
      <line class="kb-fw" x1="${C}" y1="${C}" x2="${C}" y2="${C - 66}"/><circle class="kb-hub" cx="${C}" cy="${C}" r="7"/>
      <path class="kb-ptr" d="M${C - 9} -10 L${C + 9} -10 L${C} 4 z"/></svg>`;
  };

  return function KiblatView() {
    if (stop) stop();
    setTitle('Kompas Kiblat', true);
    let loc = store.get('kiblatLoc', null), qb = null;
    let target = null, shown = null, raf = 0, listening = false, got = false, aligned = false, wake = null, tmr = 0, evName = '';

    view.innerHTML = `<div class="kb-wrap kb" id="kb">
      <section class="card kb-loc">
        <p class="mini-title">Lokasimu</p>
        <p class="muted small" id="kbWhere"></p>
        <div class="kb-bar">
          <button type="button" class="btn primary" id="kbGps" title="Gunakan lokasi saya" aria-label="Gunakan lokasi saya">📍</button>
          <select id="kbCity" aria-label="Pilih kota"><option value="">🏙️ Pilih kota</option>${CITIES.map((c, i) => `<option value="${i}">${esc(c[0])}</option>`).join('')}</select>
          <button type="button" class="btn" id="kbMt" title="Isi koordinat manual" aria-label="Isi koordinat manual" aria-expanded="false">✏️</button>
          <button type="button" class="btn primary" id="kbOn" title="Aktifkan kompas" aria-label="Aktifkan kompas">🧭</button>
        </div>
        <div id="kbMan" hidden>
          <div class="row" style="margin-top:8px"><input id="kbLa" type="number" inputmode="decimal" step="any" placeholder="Lintang, mis. -7.39" aria-label="Lintang"><input id="kbLo" type="number" inputmode="decimal" step="any" placeholder="Bujur, mis. 109.36" aria-label="Bujur"></div>
          <div class="btn-row" style="margin-top:8px"><button type="button" class="btn" id="kbSet">Terapkan</button></div></div>
      </section>
      <section class="card">
        ${dialSVG()}
        <p class="kb-msg" id="kbMsg" role="status" aria-live="polite"></p>
        <div class="kb-stats">
          <div class="kb-st"><small>Arah kiblat</small><b id="kbB">–</b><span id="kbW"></span></div>
          <div class="kb-st"><small>Arah HP</small><b id="kbH">–</b><span id="kbD"></span></div>
          <div class="kb-st"><small>Jarak ke Ka'bah</small><b id="kbK">–</b><span>km</span></div>
        </div>
      </section>
      <section class="card"><p class="mini-title">Tips akurasi</p><ol class="kb-tips muted small">
        <li>Pegang HP <b>datar</b> (layar menghadap ke atas), jauh dari logam, magnet, dan speaker.</li>
        <li>Jika arah terasa melenceng, kalibrasi dengan menggerakkan HP membentuk angka 8 beberapa kali.</li>
        <li>Putar badan sampai ikon Ka'bah berada di atas dan garis menjadi hijau.</li>
        <li>Kompas HP membaca utara magnetik; selisihnya dengan utara sejati di Indonesia kecil. Sebagai pegangan, cocokkan juga dengan arah masjid atau kompas lain.</li>
        <li>Tanpa sensor (laptop/PC), pakai angka arah kiblat di atas dengan kompas atau peta.</li></ol></section>
      <style>${CSS}</style></div>`;

    const box = $('#kb'), msg = t => { $('#kbMsg').textContent = t; };
    const rose = $('#kbRose'), q = $('#kbQ');

    function refresh() {
      if (!loc) { $('#kbWhere').textContent = 'Belum ada lokasi. Pilih lewat GPS, daftar kota, atau koordinat manual.'; msg('Pilih lokasi dulu untuk menghitung arah kiblat.'); return; }
      qb = bearing(loc.la, loc.lo);
      $('#kbWhere').textContent = `${loc.name} (${loc.la.toFixed(4)}, ${loc.lo.toFixed(4)})`;
      $('#kbB').textContent = qb.toFixed(1) + '°'; $('#kbW').textContent = wind(qb);
      $('#kbK').textContent = Math.round(dist(loc.la, loc.lo)).toLocaleString('id-ID');
      q.setAttribute('visibility', 'visible'); q.setAttribute('transform', `rotate(${qb} ${C} ${C})`);
      if (!listening) msg(`Arah kiblat ${qb.toFixed(1)}° (${wind(qb)}) dari utara. Tekan tombol 🧭 lalu putar badanmu.`);
    }
    function setLoc(la, lo, name) {
      if (!isFinite(la) || !isFinite(lo) || Math.abs(la) > 90 || Math.abs(lo) > 180) return toast('Koordinat tidak valid');
      loc = { la, lo, name }; store.set('kiblatLoc', loc); refresh();
    }

    /* ---- sensor ---- */
    function onOri(e) {
      let h = null;
      if (typeof e.webkitCompassHeading === 'number' && !isNaN(e.webkitCompassHeading)) h = e.webkitCompassHeading;
      else if (e.alpha != null && e.beta != null && e.gamma != null && (evName === 'deviceorientationabsolute' || e.absolute === true)) h = headingFrom(e.alpha, e.beta, e.gamma);
      else { if (!got) msg('Browser ini hanya memberi arah relatif, tidak bisa dipakai sebagai kompas. Coba Chrome (Android) atau Safari (iPhone).'); return; }
      got = true; target = h;
    }
    function frame() {
      raf = requestAnimationFrame(frame);
      if (target == null) return;
      shown = shown == null ? target : norm(shown + diff(target, shown) * 0.22);
      rose.setAttribute('transform', `rotate(${(-shown).toFixed(1)} ${C} ${C})`);
      $('#kbH').textContent = (Math.round(shown) % 360) + '°'; $('#kbD').textContent = wind(shown);
      if (qb == null) return msg('Pilih lokasi dulu untuk menghitung arah kiblat.');
      const dl = diff(qb, shown), ad = Math.abs(dl);
      const ok = aligned ? ad <= 5 : ad <= 3;
      if (ok && !aligned && navigator.vibrate) navigator.vibrate(60);
      aligned = ok; box.classList.toggle('ok', ok);
      msg(ok ? '✔ Kamu menghadap kiblat' : `Putar ke ${dl > 0 ? 'kanan' : 'kiri'} ${Math.round(ad)}°`);
    }
    async function startCompass() {
      if (listening) return;
      const DOE = window.DeviceOrientationEvent;
      if (!DOE) return msg('Perangkat atau browser ini tidak punya sensor kompas.');
      if (!window.isSecureContext) return msg('Sensor kompas butuh koneksi aman (https).');
      if (typeof DOE.requestPermission === 'function') {
        try { if ((await DOE.requestPermission()) !== 'granted') return msg('Izin sensor ditolak. Izinkan “Gerak & Orientasi” di pengaturan browser.'); }
        catch { return msg('Tidak bisa meminta izin sensor.'); }
      }
      evName = 'ondeviceorientationabsolute' in window ? 'deviceorientationabsolute' : 'deviceorientation';
      window.addEventListener(evName, onOri, true);
      listening = true; got = false; $('#kbOn').textContent = '⏹'; $('#kbOn').title = $('#kbOn').ariaLabel = 'Matikan kompas';
      msg('Menunggu sensor… gerakkan HP sedikit.'); frame();
      try { if (navigator.wakeLock) wake = await navigator.wakeLock.request('screen'); } catch { /* abaikan */ }
      tmr = setTimeout(() => { if (!got) msg('Sensor kompas tidak merespons. Coba kalibrasi (gerakan angka 8) atau pakai angka arah kiblat.'); }, 3000);
    }
    function stopCompass() {
      if (listening) window.removeEventListener(evName, onOri, true);
      listening = false; cancelAnimationFrame(raf); clearTimeout(tmr); target = shown = null; aligned = false;
      if (wake) { try { wake.release(); } catch { /* abaikan */ } wake = null; }
      if (box) box.classList.remove('ok');
    }
    const cleanup = () => stopCompass();
    stop = cleanup; window.addEventListener('hashchange', cleanup, { once: true });

    $('#kbOn').onclick = () => {
      if (listening) { stopCompass(); rose.setAttribute('transform', ''); $('#kbOn').textContent = '🧭'; $('#kbOn').title = $('#kbOn').ariaLabel = 'Aktifkan kompas'; $('#kbH').textContent = '–'; $('#kbD').textContent = ''; refresh(); }
      else startCompass();
    };
    $('#kbGps').onclick = () => {
      if (!navigator.geolocation) return toast('Perangkat tidak mendukung GPS');
      $('#kbWhere').textContent = 'Mencari lokasi…';
      navigator.geolocation.getCurrentPosition(p => setLoc(p.coords.latitude, p.coords.longitude, 'Lokasi GPS'),
        er => { refresh(); toast(er.code === 1 ? 'Izin lokasi ditolak. Pilih kota atau isi koordinat manual.' : 'Lokasi tidak ditemukan. Coba lagi atau pilih kota.'); },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 600000 });
    };
    $('#kbMt').onclick = () => { const m = $('#kbMan'), o = m.hidden; m.hidden = !o; $('#kbMt').setAttribute('aria-expanded', String(o)); $('#kbMt').classList.toggle('on', o); };
    $('#kbCity').onchange = e => { const c = CITIES[+e.target.value]; if (c) setLoc(c[1], c[2], c[0]); };
    $('#kbSet').onclick = () => { const la = parseFloat($('#kbLa').value), lo = parseFloat($('#kbLo').value); setLoc(la, lo, 'Koordinat manual'); };

    refresh();
    if (typeof (window.DeviceOrientationEvent || {}).requestPermission !== 'function' && window.DeviceOrientationEvent) startCompass();
  };
};
