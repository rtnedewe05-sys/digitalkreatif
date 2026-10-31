'use strict';
/* Mesin kata-per-kata: transliterasi bersuku kata, panduan makhraj, statistik kosakata, kuis.
 * Semua berjalan offline di perangkat. Dipakai oleh app.js lewat window.KATA. */
(() => {
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const DIAC = /[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06ED\u0640]/g;
  const LETTER = /[\u0621-\u063F\u0641-\u064A\u0671-\u06D3]/;
  const norm = w => w.replace(DIAC, '').replace(/[ٱأإآ]/g, 'ا').replace(/ى/g, 'ي');
  const strip = h => String(h).replace(/<[^>]*>/g, '');

  /* ---------- tabel huruf ---------- */
  const C = { 'ب': 'b', 'ت': 't', 'ث': 'ṡ', 'ج': 'j', 'ح': 'ḥ', 'خ': 'kh', 'د': 'd', 'ذ': 'ż', 'ر': 'r', 'ز': 'z', 'س': 's', 'ش': 'sy', 'ص': 'ṣ', 'ض': 'ḍ', 'ط': 'ṭ', 'ظ': 'ẓ', 'ع': '‘', 'غ': 'gh', 'ف': 'f', 'ق': 'q', 'ك': 'k', 'ک': 'k', 'ل': 'l', 'م': 'm', 'ن': 'n', 'ه': 'h', 'ء': "'", 'و': 'w', 'ي': 'y', 'ی': 'y', 'ى': 'y', 'ة': 't' };
  const NAMA = { 'ا': 'a-lif', 'ل': 'lām', 'م': 'mīm', 'ص': 'ṣād', 'ر': 'rā', 'ك': 'kāf', 'ه': 'hā', 'ي': 'yā', 'ع': '‘ain', 'ط': 'ṭā', 'س': 'sīn', 'ح': 'ḥā', 'ق': 'qāf', 'ن': 'nūn' };
  const LONG = { a: 'ā', i: 'ī', u: 'ū' };
  /* [nama, tempat keluar bunyi (makhraj), tips pengucapan] untuk huruf yang sering keliru */
  const TIPS = {
    'ث': ['Tsa', 'Ujung lidah di antara gigi seri atas dan bawah', 'Desiskan lembut dengan lidah terjulur sedikit. Bukan “s” biasa.'],
    'ح': ['Ha (ḥ)', 'Tengah tenggorokan', 'Hembusan napas serak tanpa suara, lebih berat dari “h”. Seperti menghembus kaca agar berembun.'],
    'خ': ['Kha', 'Pangkal tenggorokan (dekat lidah)', 'Gesekan kasar dari belakang mulut seperti “kh” pada kata “khusus”, tapi lebih dalam.'],
    'ذ': ['Dzal', 'Ujung lidah menyentuh ujung gigi seri atas', 'Seperti “th” bersuara dalam bahasa Inggris “this”. Bukan “d” atau “z”.'],
    'ص': ['Shad', 'Ujung lidah dekat gigi seri bawah', 'Desis “s” yang tebal: bibir agak membulat, pangkal lidah naik. Tafkhim (tebal).'],
    'ض': ['Dhad', 'Tepi lidah menyentuh geraham atas', 'Seperti “d” yang tebal dengan lidah melebar; bunyi paling khas Arab. Tafkhim.'],
    'ط': ['Tha (ṭ)', 'Ujung lidah menyentuh pangkal gigi seri atas', '“T” yang tebal dan menekan. Tafkhim.'],
    'ظ': ['Zha', 'Ujung lidah menyentuh ujung gigi seri atas', '“Dz” yang tebal. Tafkhim; lidah sedikit keluar.'],
    'ع': ['‘Ain', 'Tengah tenggorokan', 'Suara tenggorokan yang ditekan dan bergetar. Bukan “a” biasa; jangan dibaca “ng”.'],
    'غ': ['Ghain', 'Pangkal tenggorokan (dekat lidah)', 'Seperti berkumur ringan, mirip “r” Prancis. Tafkhim.'],
    'ق': ['Qaf', 'Pangkal lidah paling belakang menyentuh langit-langit lunak', 'Lebih dalam dan tebal dari “k”. Bila mati, bunyinya memantul (qalqalah).'],
    'ك': ['Kaf', 'Pangkal lidah (sedikit di depan qaf)', '“K” ringan dan tipis, berbeda dari qaf.'],
    'ء': ['Hamzah', 'Pangkal tenggorokan', 'Hentakan tenggorokan singkat, seperti jeda di “saat” yang diucapkan putus.'],
    'ه': ['Ha', 'Pangkal tenggorokan', '“H” ringan yang jelas terdengar, jangan dihilangkan.'],
    'ج': ['Jim', 'Tengah lidah dengan langit-langit keras', '“J” dengan lidah menempel lebar; bukan “dj” yang berat.'],
    'ش': ['Syin', 'Tengah lidah', 'Seperti “sy” pada “syukur”; desis lebar.'],
    'ر': ['Ra', 'Ujung lidah dekat gusi atas', 'Getarkan ujung lidah sekali. Tebal bila berharakat fathah/dammah, tipis bila kasrah.'],
    'ل': ['Lam', 'Ujung lidah menyentuh gusi depan', 'Jelas dan tipis, kecuali pada lafaz “Allah” setelah fathah/dammah (tebal).'],
    'ن': ['Nun', 'Ujung lidah menyentuh gusi atas', 'Mati bertemu huruf tertentu: ikhfa, idgham, atau iqlab.'],
    'م': ['Mim', 'Dua bibir dirapatkan', 'Mati bertemu mim atau ba: dengungkan.']
  };
  const TEBAL = new Set('خصضغطقظ');

  /* ---------- transliterasi ---------- */
  function parse(word) {
    const units = []; let u = null;
    for (const ch of [...word]) {
      if (ch === 'ـ') continue;
      if (LETTER.test(ch)) { u = { ch, v: '', gem: false, tan: false, long: false, dip: '', silent: false }; units.push(u); continue; }
      if (!u) continue;
      switch (ch) {
        case '\u064E': u.v = 'a'; break; case '\u064F': u.v = 'u'; break; case '\u0650': u.v = 'i'; break;
        case '\u064B': u.v = 'a'; u.tan = true; break; case '\u064C': u.v = 'u'; u.tan = true; break; case '\u064D': u.v = 'i'; u.tan = true; break;
        case '\u0651': u.gem = true; break;
        case '\u0652': case '\u06E1': u.sukun = true; break;
        case '\u0670': u.dag = true; u.long = true; break;
        case '\u0656': u.v = 'i'; u.long = true; break;
        case '\u0657': u.v = 'u'; u.long = true; break;
        case '\u06E5': u.long = true; u.v = u.v || 'u'; break;
        case '\u06E6': u.long = true; u.v = u.v || 'i'; break;
        case '\u0653': u.mad = true; break;
        case '\u06DF': case '\u06E0': u.silent = true; break;
        default: break;
      }
    }
    return units;
  }

  function translit(word) {
    const units = parse(word), toks = [];
    const last = () => toks[toks.length - 1];
    units.forEach((u, i) => {
      const ch = u.ch, prev = last(), next = units[i + 1];
      if (u.silent) return;
      /* teks Kemenag menulis hamzah wasal sebagai alif polos di awal kata (mis. الرَّحْمٰن), teks Madinah memakai ٱ */
      if (ch === 'ٱ' || (ch === 'ا' && i === 0 && !u.v && !u.tan && !u.dag && units.some(x => x.v))) {
        if (i > 0) return;                                   // wasl di tengah kata: hilang
        const nx = next && next.ch === 'ل' ? 'a' : 'i';
        toks.push({ c: '', v: nx, wasl: true }); return;
      }
      if (ch === 'ل' && prev && prev.wasl && !u.v && !u.sukun && next && next.gem) return;   // lam syamsiyah
      if (u.dag && !u.v && 'وياى'.includes(ch) && prev && prev.v === 'a') { prev.long = true; return; }
      if (u.dag && !u.v) { u.v = 'a'; }
      if ('أإآ'.includes(ch) || ch === 'ء' || ch === 'ؤ' || ch === 'ئ') {
        toks.push({ c: i === 0 && toks.length === 0 ? '' : "'", v: u.v || (ch === 'آ' ? 'a' : ''), long: ch === 'آ' || u.long, tan: u.tan, gem: u.gem }); return;
      }
      if (ch === 'ا') {
        if (prev && prev.tan) return;                       // alif penyangga tanwin fathah
        if (u.v) { toks.push({ c: '', v: u.v, long: u.long }); return; }
        if (prev && prev.v === 'a' && !prev.long) { prev.long = true; return; }
        return;                                              // alif diam tak dibaca
      }
      if ((ch === 'و' || ch === 'ي' || ch === 'ى' || ch === 'ی') && !u.v && !u.gem && prev && prev.v) {
        const isW = ch === 'و';
        if (ch === 'ى' && !prev.long && (prev.v === 'a' || prev.v === 'i')) { prev.long = true; return; }
        else if (isW && prev.v === 'u' && !prev.long) { prev.long = true; return; }
        else if (!isW && prev.v === 'i' && !prev.long) { prev.long = true; return; }
        else if (prev.v === 'a' && !prev.dip && u.sukun) { prev.dip = isW ? 'u' : 'i'; return; }
        else if (prev.v === 'a' && !prev.dip && !u.sukun && !u.tan) { prev.dip = isW ? 'u' : 'i'; return; }
      }
      if (ch === 'ة') { toks.push({ c: u.v ? 't' : 'h', v: u.v, tan: u.tan, gem: u.gem }); return; }
      const c = C[ch]; if (c === undefined) return;
      toks.push({ c, v: u.v, long: u.long, tan: u.tan, gem: u.gem, ch });
    });
    if (units.length && units.length <= 4 && units.every(u => !u.v && !u.dag) && units.every(u => NAMA[u.ch])) {
      const sy = units.map(u => NAMA[u.ch]); return { syl: sy, text: sy.join(' '), units, toks, muqatta: true };
    }
    /* suku kata */
    const sy = []; let cur = '', has = false;
    const vowel = t => t.v ? (t.dip ? 'a' + t.dip : (t.long ? LONG[t.v] : t.v)) + (t.tan ? 'n' : '') : '';
    toks.forEach(t => {
      const v = vowel(t);
      if (t.gem && v && (sy.length || cur)) { cur += t.c; sy.push(cur); cur = t.c + v; has = true; return; }
      if (v) { if (has) { sy.push(cur); cur = ''; } cur += t.c + v; has = true; return; }
      cur += t.c;
    });
    if (cur) sy.push(cur);
    return { syl: sy, text: sy.join('-'), units, toks };
  }

  /* ---------- panduan huruf pada satu kata ---------- */
  function letterGuide(word) {
    const seen = new Set(), out = [];
    parse(word).forEach(u => {
      const ch = u.ch === 'ك' ? 'ك' : u.ch;
      if (TIPS[ch] && !seen.has(ch) && !u.silent && ch !== 'ء' || (ch === 'ء' && !seen.has(ch))) {
        seen.add(ch);
        if (TIPS[ch]) out.push({ ch, name: TIPS[ch][0], place: TIPS[ch][1], tip: TIPS[ch][2], thick: TEBAL.has(ch) });
      }
    });
    return out.filter(x => !'ملنرجشكه'.includes(x.ch) || out.length <= 2);
  }
  /* catatan panjang-pendek, tasydid, tanwin */
  function notes(word) {
    const t = translit(word), n = [];
    if (t.muqatta) return ['Huruf <b>muqaththa\u2019ah</b> (pembuka surah): dibaca nama hurufnya satu per satu, bukan sebagai kata. Tanda mad (\u0653) berarti ditahan 6 harakat.'];
    const longs = t.toks.filter(x => x.long && x.v);
    if (longs.length) n.push(`Ada <b>${longs.length} bunyi panjang</b> (${longs.map(x => x.c + LONG[x.v]).join(', ')}): tahan 2 harakat (± 2 ketukan).`);
    if (t.toks.some(x => x.dip)) n.push('Ada <b>diftong</b> (au / ai): ucapkan dua bunyi vokal meluncur, jangan diubah menjadi “o” atau “e”.');
    const g = t.toks.filter(x => x.gem && x.c);
    if (g.length) n.push(`Ada <b>tasydid</b> pada ${g.map(x => x.c).join(', ')}: ucapkan huruf dua kali (tekan lalu lepaskan), bunyinya ditahan sejenak.`);
    if (t.toks.some(x => x.tan)) n.push('Ada <b>tanwin</b>: ucapan akhirnya “-an / -un / -in” bila disambung; bila berhenti (waqaf) tanwin hilang.');
    if (t.toks.some(x => x.wasl)) n.push('Ada <b>hamzah wasal</b> di awal: dibaca bila memulai bacaan, dilewati bila disambung dengan kata sebelumnya.');
    if (t.toks.length && word.includes('ة')) n.push('Berakhir <b>ta marbuthah</b>: dibaca “t” bila disambung, “h” bila berhenti.');
    return n;
  }

  /* ---------- kosakata ---------- */
  let vocab = null, vocabP = null;
  function loadVocab() {
    if (vocab) return Promise.resolve(vocab);
    return vocabP || (vocabP = fetch('data/vocab.json').then(r => { if (!r.ok) throw new Error('vocab'); return r.json(); }).then(j => (vocab = j)).catch(e => { vocabP = null; throw e; }));
  }
  const freq = w => (vocab && vocab[norm(w)]) || null; // [jumlah, [arti...], [rujukan...]]

  /* ---------- pecah segmen tajwid menjadi kata (HTML) ---------- */
  function wordsFromItems(items, escFn) {
    const words = []; let cur = '';
    const flush = () => {
      if (!cur) return;
      if (LETTER.test(strip(cur))) words.push(cur); else if (words.length) words[words.length - 1] += cur;
      cur = '';
    };
    for (const it of items) {
      const [t, c] = typeof it === 'string' ? [it, null] : it;
      for (const p of t.split(/(\s+)/)) {
        if (!p) continue;
        if (/^\s+$/.test(p)) { flush(); continue; }
        cur += c ? `<span class="tj tj-${escFn(c)}" data-r="${escFn(c)}">${escFn(p)}</span>` : escFn(p);
      }
    }
    flush();
    return words;
  }

  /* ---------- simpan kata ---------- */
  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* penuh */ } }
  };
  const saved = () => store.get('vocabSaved', {});
  const isSaved = w => !!saved()[norm(w)];
  function toggleSaved(w, m) {
    const s = saved(), k = norm(w);
    if (s[k]) delete s[k]; else s[k] = [w, m];
    store.set('vocabSaved', s); return !!s[k];
  }

  /* ---------- HTML lembar kata ---------- */
  function sheetHTML(o, ruleInfo) {
    /* o: { html, ar, m, m2, ref } ; ruleInfo: { kode: [nama, penjelasan, cara] } */
    const t = translit(o.ar), f = freq(o.ar), guide = letterGuide(o.ar), nt = notes(o.ar);
    const codes = [...new Set([...String(o.html || '').matchAll(/data-r="([a-z])"/g)].map(x => x[1]))];
    const rules = codes.filter(c => ruleInfo[c]).map(c => `<li><span class="dot tj-${c}">${esc(strip(o.html).slice(0, 1))}</span><div><b>${esc(ruleInfo[c][0])}</b><span class="d">${esc(ruleInfo[c][2])}</span></div></li>`).join('');
    const refs = f ? f[2].map(r => { const [s, a] = r.split(':'); return `<a href="#/surah/${s}?a=${a}" data-close>${s}:${a}</a>`; }).join(' · ') : '';
    const other = [...(f ? f[1] : []), ...(o.m2 ? [o.m2] : [])].filter(x => x && x.toLowerCase() !== String(o.m).toLowerCase());
    return `<div class="ws-word arab" lang="ar" dir="rtl">${o.html || esc(o.ar)}</div>
      <p class="ws-mean">${esc(o.m || '—')}</p>
      ${other.length ? `<p class="muted small">Makna lain: ${[...new Set(other)].map(esc).join('; ')}</p>` : ''}
      <h3>Cara membaca</h3>
      <p class="ws-lat">${esc(t.text)}</p>
      <p class="muted small">Dibaca per suku kata dan berdiri sendiri. Saat disambung dengan kata lain, ikuti hukum tajwid pada ayat.</p>
      ${nt.length ? `<ul class="ws-notes">${nt.map(n => `<li>${n}</li>`).join('')}</ul>` : ''}
      ${guide.length ? `<h3>Panduan huruf</h3><ul class="ws-guide">${guide.map(g => `<li><span class="gl" lang="ar">${g.ch}</span><div><b>${esc(g.name)}</b>${g.thick ? ' <span class="tag">tebal</span>' : ''}<span class="d">Makhraj: ${esc(g.place)}.</span><span class="d">${esc(g.tip)}</span></div></li>`).join('')}</ul>` : ''}
      ${rules ? `<h3>Hukum tajwid pada kata ini</h3><ul class="ws-guide">${rules}</ul>` : ''}
      ${f ? `<h3>Dalam Al-Qur'an</h3><p>Muncul <b>${f[0].toLocaleString('id-ID')}×</b> (bentuk tulisan yang sama).</p><p class="ws-refs small">Contoh: ${refs}</p>` : ''}
      <div class="btn-row"><button type="button" class="btn primary" data-say>🔊 Dengar kata ini</button><button type="button" class="btn ${isSaved(o.ar) ? 'primary' : ''}" data-save>${isSaved(o.ar) ? '★ Tersimpan di latihan' : '☆ Simpan ke latihan'}</button></div>`;
  }

  /* ---------- kuis kosakata ---------- */
  const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = Math.random() * (i + 1) | 0; [a[i], a[j]] = [a[j], a[i]]; } return a; };
  async function quiz(box, pool, title, onDone) {
    await loadVocab().catch(() => null);
    const uniq = new Map();
    pool.forEach(w => { if (w.m && w.m.trim() && !uniq.has(norm(w.ar))) uniq.set(norm(w.ar), w); });
    const items = shuffle([...uniq.values()]).slice(0, 10);
    if (items.length < 3) { box.innerHTML = '<div class="card"><p><b>Belum ada kata untuk dilatih.</b></p><p class="muted">Ketuk kata pada mode kata-per-kata lalu pilih “Simpan ke latihan”, atau buka kuis dari halaman surah.</p></div>'; return; }
    const allMeans = vocab ? Object.values(vocab).map(v => v[1][0]).filter(Boolean) : items.map(x => x.m);
    let i = 0, score = 0; const wrong = [];
    const ask = () => {
      if (i >= items.length) {
        const w = store.get('weak', {}); wrong.forEach(x => { w[norm(x.ar)] = [x.ar, x.m]; });
        items.filter(x => !wrong.includes(x)).forEach(x => { delete w[norm(x.ar)]; }); store.set('weak', w);
        box.innerHTML = `<div class="card quiz"><p class="mini-title">${esc(title)}</p><h2>Skor ${score} / ${items.length}</h2>
          ${wrong.length ? '<p class="muted">Kata yang masih keliru:</p><ul class="ws-guide">' + wrong.map(x => `<li><span class="gl" lang="ar">${esc(x.ar)}</span><div><b>${esc(x.m)}</b></div></li>`).join('') + '</ul>' : '<p>Sempurna. Semua jawaban benar.</p>'}
          <div class="btn-row"><button class="btn primary" data-q="again">Ulangi</button></div></div>`;
        return;
      }
      const q = items[i], opts = new Set([q.m.trim()]);
      let guard = 0; while (opts.size < 4 && guard++ < 200) { const m = allMeans[Math.random() * allMeans.length | 0]; if (m && m.trim().toLowerCase() !== q.m.trim().toLowerCase()) opts.add(m.trim()); }
      box.innerHTML = `<div class="card quiz"><p class="mini-title">${esc(title)} · ${i + 1}/${items.length}</p>
        <div class="quiz-ar arab" lang="ar" dir="rtl">${esc(q.ar)}</div><p class="muted small" style="text-align:center">Apa arti kata ini?</p>
        <div class="quiz-opts">${shuffle([...opts]).map(o => `<button class="btn" data-o="${esc(o)}">${esc(o)}</button>`).join('')}</div></div>`;
      box.querySelectorAll('[data-o]').forEach(b => b.addEventListener('click', () => {
        const ok = b.dataset.o === q.m.trim();
        box.querySelectorAll('[data-o]').forEach(x => { x.disabled = true; if (x.dataset.o === q.m.trim()) x.classList.add('ok'); });
        if (ok) score++; else { b.classList.add('bad'); wrong.push(q); }
        setTimeout(() => { i++; ask(); }, ok ? 650 : 1400);
      }));
    };
    box.onclick = e => { if (e.target.closest('[data-q=again]')) { quiz(box, pool, title, onDone); } };
    ask();
  }

  window.KATA = { norm, translit, letterGuide, notes, loadVocab, freq, wordsFromItems, sheetHTML, toggleSaved, isSaved, saved, quiz, strip, weak: () => store.get('weak', {}) };
})();
