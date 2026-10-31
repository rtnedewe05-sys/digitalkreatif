/* Halaman "Analisis Tajwid": hukum per ayat lengkap dengan sebab dan cara baca (mesin aturan di tajwid-engine.js).
 * Bisa memilih surah/ayat dari data bawaan, atau menempel ayat sendiri. Semua berjalan offline.
 * Tampilan: ayat padat tanpa ruang kosong, kartu hukum 2 kolom (1 kolom di HP), huruf pemicu disorot di
 * ayat DAN di kartu, klik kartu <-> klik huruf saling menyorot. */
window.makeAnalisisView = function (d) {
  const { $, esc, view, getSurahs, getSurah, setTitle, toast, surahName } = d;
  const T = window.Tajwid;
  const off = new Set();
  let res = null, label = '', active = -1;

  const CSS = `
  .an-top{margin-bottom:10px}
  .an-sel{display:grid;grid-template-columns:1fr 1fr;gap:8px}
  .an-sel select{width:100%;min-width:0;padding:9px;border-radius:10px;border:1px solid var(--border);background:var(--bg);color:inherit}
  .an-nav{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:8px}
  .an-nav .btn{padding:9px 12px}
  .an-top details{margin-top:8px}
  .an-top summary{cursor:pointer;padding:2px 0}
  .an-ayat{font-family:'Amiri Quran',serif;font-size:var(--arab-size);line-height:2.15;word-spacing:.12em;text-align:justify;text-align-last:center;margin:2px 0 0}
  .an-ayat .aw{display:inline-block}
  .an-ayat .sg{color:var(--accent)}
  .hl{--bg:color-mix(in srgb,var(--c) 20%,transparent);color:var(--c);background:linear-gradient(var(--bg),var(--bg)) 50% 58%/100% 50% no-repeat;text-decoration:underline;text-decoration-color:var(--c);text-decoration-thickness:2px;text-decoration-skip-ink:none;text-underline-offset:.32em}
  .an-ayat .hl{cursor:pointer}
  .an-ayat .on{--bg:color-mix(in srgb,var(--c,var(--primary)) 42%,transparent);background:linear-gradient(var(--bg),var(--bg)) 50% 58%/100% 62% no-repeat;text-decoration-thickness:3px}
  .an-ayat .aw.on{color:var(--c,var(--primary))}
  .an-tr{margin:6px 0 0;line-height:1.5}.an-tr:empty{display:none}
  .an-bar{display:flex;flex-wrap:wrap;gap:6px;margin:10px 0 0}
  .an-bar .chip{min-height:32px;padding:4px 10px;display:inline-flex;align-items:center;gap:6px}
  .an-bar .chip i{width:10px;height:10px;border-radius:50%;background:var(--c);flex:none}
  .an-foot{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-top:8px}
  .an-foot .btn{margin-inline-start:auto;padding:6px 12px;min-height:34px}
  .an-list{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,330px),1fr));gap:8px;margin-top:10px}
  .an-c{background:var(--surface);border:1px solid var(--border);border-inline-start:5px solid var(--c);border-radius:12px;padding:8px 12px 9px;box-shadow:var(--shadow);cursor:pointer;transition:box-shadow .15s,transform .15s}
  .an-c:hover{transform:translateY(-1px)}
  .an-c:focus-visible,.an-c.flash{outline:none;box-shadow:0 0 0 2px var(--c)}
  .an-h{display:flex;align-items:center;justify-content:space-between;gap:10px}
  .an-h b{line-height:1.3}
  .an-lf{font-family:'Amiri Quran',serif;font-size:1.45rem;line-height:1.6;white-space:nowrap}
  .an-c p{margin:2px 0 0;line-height:1.45;font-size:.92rem}
  .an-c p span{color:var(--muted)}
  .an-empty{grid-column:1/-1;text-align:center;padding:16px}
  @media (prefers-reduced-motion:reduce){.an-c{transition:none}.an-c:hover{transform:none}}`;

  const lafHTML = f => {
    const ids = new Set(f.ids), col = T.CATS[f.cat].color;
    return res.words.slice(f.w, f.w2 + 1).filter(w => !w.sign).map(w =>
      w.units.map(u => ids.has(u.id) ? `<span class="hl" style="--c:${col}">${esc(u.raw)}</span>` : esc(u.raw)).join('')).join(' ');
  };

  const clearOn = () => {
    view.querySelectorAll('#anAyat .on').forEach(x => x.classList.remove('on'));
    view.querySelectorAll('#anList .flash').forEach(x => x.classList.remove('flash'));
  };
  /* Sorot lafadz di ayat untuk hukum ke-i; kembalikan elemen pertama */
  const markAyat = i => {
    const f = res.findings[i]; if (!f) return null;
    let els = [...view.querySelectorAll(`#anAyat .hl[data-f="${i}"]`)];
    if (!els.length) els = [...view.querySelectorAll('#anAyat .aw')].filter(x => +x.dataset.w >= f.w && +x.dataset.w <= f.w2);
    els.forEach(x => { x.style.setProperty('--c', T.CATS[f.cat].color); x.classList.add('on'); });
    return els[0] || null;
  };
  const select = (i, from) => {
    clearOn(); active = i;
    const card = $('#anf' + i), first = markAyat(i);
    if (card) card.classList.add('flash');
    if (from === 'card' && first) first.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    if (from === 'ayat' && card) card.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const paint = () => {
    if (!res) return;
    active = -1;
    const on = new Set(Object.keys(T.CATS).filter(k => !off.has(k)));
    $('#anAyat').innerHTML = T.render(res, on);
    const used = [...new Set(res.findings.map(f => f.cat))];
    $('#anChips').innerHTML = used.map(k =>
      `<button type="button" class="chip" style="--c:${T.CATS[k].color};${off.has(k) ? 'opacity:.45;text-decoration:line-through' : ''}" data-k="${k}" aria-pressed="${!off.has(k)}"><i></i>${esc(T.CATS[k].label)} (${res.findings.filter(f => f.cat === k).length})</button>`).join('')
      + (off.size ? '<button type="button" class="chip" data-k="*">Tampilkan semua</button>' : '');
    const vis = res.findings.map((f, i) => [f, i]).filter(([f]) => on.has(f.cat));
    $('#anSum').textContent = `${vis.length} hukum tajwid ditemukan`;
    $('#anList').innerHTML = vis.length ? vis.map(([f, i]) =>
      `<article class="an-c" id="anf${i}" data-i="${i}" tabindex="0" style="--c:${T.CATS[f.cat].color}">
        <div class="an-h"><b>${esc(f.hukum)}</b><span class="an-lf" lang="ar" dir="rtl">${lafHTML(f)}</span></div>
        <p><span>Sebab:</span> ${esc(f.sebab)}</p>
        <p><span>Cara baca:</span> ${esc(f.cara)}</p></article>`).join('')
      : `<p class="muted an-empty">${res.findings.length ? 'Semua kategori dimatikan. Aktifkan kembali lewat label di atas.' : 'Tidak ada hukum terdeteksi. Pastikan teks berharakat lengkap.'}</p>`;
  };

  const run = (txt, lb) => {
    res = T.analyze(txt); label = lb; off.clear();
    $('#anMeta').textContent = lb;
    $('#anOut').hidden = false;
    paint();
  };

  return async function AnalisisView(n, a) {
    setTitle('Analisis Tajwid', true);
    const surahs = await getSurahs();
    n = n >= 1 && n <= 114 ? n : 1; a = a || 1;
    view.innerHTML = `
      <div class="card an-top">
        <p class="muted small" style="margin:0 0 8px">Hukum tajwid tiap ayat beserta sebab dan cara membacanya. Hasil otomatis; verifikasi dengan guru tajwid, terutama untuk mad dan waqaf.</p>
        <div class="an-sel">
          <select id="anS" aria-label="Surah">${surahs.map(s => `<option value="${s.n}">${s.n}. ${esc(s.la)}</option>`).join('')}</select>
          <select id="anA" aria-label="Ayat"></select>
        </div>
        <div class="an-nav"><button type="button" class="btn" id="anPrev">‹ Sebelumnya</button><button type="button" class="btn primary" id="anNext">Berikutnya ›</button></div>
        <details><summary>Atau tempel ayat sendiri</summary>
          <textarea id="anTxt" dir="rtl" lang="ar" placeholder="Tempel ayat berharakat, mis. مِن شَرِّ مَا خَلَقَ" style="width:100%;min-height:80px;margin-top:8px;font-family:'Amiri Quran',serif;font-size:1.4rem;padding:8px;border-radius:10px;border:1px solid var(--border);background:var(--bg);color:inherit"></textarea>
          <div class="btn-row" style="margin-top:8px"><button type="button" class="btn primary" id="anGo">Analisis</button></div></details>
      </div>
      <section class="card" id="anOut" hidden>
        <div class="muted small" id="anMeta"></div>
        <div id="anAyat" class="an-ayat" lang="ar" dir="rtl"></div>
        <div id="anTr" class="muted an-tr"></div>
        <div id="anChips" class="an-bar"></div>
        <div class="an-foot"><span class="muted small" id="anSum"></span><button type="button" class="btn" id="anCopy">Salin analisis</button></div>
      </section>
      <div id="anList" class="an-list"></div>
      <style>${CSS}</style>`;
    const sel = $('#anS'), ay = $('#anA');
    const fillA = () => { const c = surahs[sel.value - 1].count; ay.innerHTML = Array.from({ length: c }, (_, i) => `<option value="${i + 1}">Ayat ${i + 1}</option>`).join(''); };
    const show = async () => {
      const sd = await getSurah(+sel.value), e = sd.ayat[+ay.value - 1]; if (!e) return;
      run(e.teksArab, `QS. ${surahName(sd.nomor)}: ${e.nomorAyat}`);
      $('#anTr').textContent = e.teksIndonesia || '';
      history.replaceState(null, '', `#/analisis/${sel.value}?a=${ay.value}`);
    };
    sel.value = n; fillA(); ay.value = a;
    sel.onchange = () => { fillA(); show(); }; ay.onchange = show;
    $('#anNext').onclick = () => { const c = surahs[sel.value - 1].count; if (+ay.value < c) ay.value = +ay.value + 1; else if (+sel.value < 114) { sel.value = +sel.value + 1; fillA(); ay.value = 1; } show(); };
    $('#anPrev').onclick = () => { if (+ay.value > 1) ay.value = +ay.value - 1; else if (+sel.value > 1) { sel.value = +sel.value - 1; fillA(); ay.value = surahs[sel.value - 1].count; } show(); };
    $('#anGo').onclick = () => { const v = $('#anTxt').value.trim(); if (!v) return toast('Isi ayat dulu'); $('#anTr').textContent = ''; run(v, 'Input manual'); };
    $('#anChips').onclick = e => { const b = e.target.closest('.chip'); if (!b) return; const k = b.dataset.k; if (k === '*') off.clear(); else off.has(k) ? off.delete(k) : off.add(k); paint(); };
    $('#anAyat').onclick = e => { const h = e.target.closest('.hl'); if (h) select(+h.dataset.f, 'ayat'); };
    const pick = e => { const c = e.target.closest('.an-c'); if (c) select(+c.dataset.i, 'card'); };
    $('#anList').onclick = pick;
    $('#anList').onkeydown = e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(e); } };
    $('#anCopy').onclick = () => {
      if (!res) return;
      const t = `${label}\n${res.words.map(w => w.raw).join(' ')}\n\n` + res.findings.map((f, i) => `${i + 1}. Lafadz: ${f.lafadz}\n   Hukum: ${f.hukum}\n   Sebab: ${f.sebab}\n   Cara membaca: ${f.cara}`).join('\n\n');
      navigator.clipboard.writeText(t).then(() => toast('Analisis disalin'), () => toast('Gagal menyalin'));
    };
    show();
  };
};
