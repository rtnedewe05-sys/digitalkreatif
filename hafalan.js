/* Hafalan Cerdas: pengulangan berjarak (SM-2) + uji rumpang adaptif. 100% offline, data di localStorage.
 * Makin lama interval sebuah ayat, makin banyak kata yang disembunyikan; ayat yang sering lupa kembali mudah. */
window.makeHafalanView = function (d) {
  const { $, esc, view, setTitle } = d;
  const KEY = 'qp_hafalan', DAY = 864e5, today = () => Math.floor((Date.now() - new Date().getTimezoneOffset() * 6e4) / DAY);
  const load = () => { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch { return {}; } };
  let S = load(); S.cards = S.cards || {}; S.streak = S.streak || 0; S.last = S.last || 0; S.done = S.done || {};
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch { /* penyimpanan penuh */ } };
  const cache = {}; let surahs = null, tab = 'hari', sess = null, show = false, rev = {};

  const css = document.createElement('style');
  css.textContent = `#hf .hf-st{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin:12px 0}
#hf .hf-st div{background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:10px;text-align:center}
#hf .hf-st b{display:block;font-size:1.4rem;color:var(--primary)}
#hf .hf-card{background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:16px;margin:12px 0;box-shadow:var(--shadow)}
#hf .hf-ar{font-family:'Amiri Quran',serif;font-size:var(--arab-size);line-height:2.1;direction:rtl;text-align:right}
#hf .hf-w{display:inline-block;margin:0 4px}
#hf .hf-w.hide{background:var(--playing);color:transparent;border-radius:8px;cursor:pointer;border:1px dashed var(--primary);user-select:none}
#hf .hf-rate{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-top:12px}
#hf .hf-rate button{padding:10px 4px;border-radius:10px;border:1px solid var(--border);background:var(--surface);color:var(--text);font:inherit;cursor:pointer}
#hf .hf-rate small{display:block;color:var(--muted)}
#hf .hf-bar{height:8px;border-radius:8px;background:var(--border);overflow:hidden}#hf .hf-bar i{display:block;height:100%;background:var(--primary)}
#hf .row{display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin:8px 0}#hf select,#hf input{padding:8px;border-radius:8px;border:1px solid var(--border);background:var(--surface);color:var(--text);font:inherit}`;
  document.head.appendChild(css);

  const getSurahs = async () => surahs || (surahs = await (await fetch('data/surahs.json')).json());
  const getS = async n => cache[n] || (cache[n] = await (await fetch(`s/${n}.json`)).json());
  const ayatOf = async key => { const [n, a] = key.split(':').map(Number); const s = await getS(n); return { n, a, ...s.ayat.find(x => x.a === a) }; };

  /* SM-2 ringkas: q 0=Lupa 3=Sulit 4=Baik 5=Mudah */
  const sched = (c, q) => {
    let { ef = 2.5, iv = 0, n = 0 } = c;
    if (q < 3) { n = 0; iv = 1; } else {
      iv = n === 0 ? 1 : n === 1 ? 3 : Math.round(iv * ef * (q === 3 ? 0.6 : q === 5 ? 1.3 : 1)); n++;
    }
    ef = Math.max(1.3, ef + 0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
    return { ef, iv, n, due: today() + (q < 3 ? 0 : iv), last: today() };
  };
  const lbl = iv => iv <= 0 ? 'sekarang' : iv < 30 ? iv + ' hari' : Math.round(iv / 30) + ' bln';
  const hashIdx = (key, len) => { let h = 7; const o = [...Array(len).keys()]; for (const ch of key) h = (h * 31 + ch.charCodeAt(0)) >>> 0; return o.sort((x, y) => ((x * 2654435761 + h) >>> 0) - ((y * 2654435761 + h) >>> 0)); };
  const ratio = c => Math.min(1, [0.25, 0.5, 0.75, 1][Math.min(3, c.n || 0)] + (c.iv >= 21 ? 0.25 : 0));

  const due = () => Object.entries(S.cards).filter(([, c]) => c.due <= today()).sort((a, b) => a[1].due - b[1].due).map(([k]) => k);
  const stats = () => { const v = Object.values(S.cards); return { total: v.length, due: due().length, kuat: v.filter(c => c.iv >= 21).length }; };

  async function addRange(n, from, to) {
    const s = await getS(n); let added = 0;
    for (const x of s.ayat) if (x.a >= from && x.a <= to && !S.cards[n + ':' + x.a]) { S.cards[n + ':' + x.a] = { ef: 2.5, iv: 0, n: 0, due: today() }; added++; }
    save(); return added;
  }

  async function renderToday() {
    if (!sess) sess = due();
    const st = stats(), k = sess[0];
    let html = `<div class="hf-st"><div><b>${st.total}</b>ayat</div><div><b>${st.due}</b>jatuh tempo</div><div><b>${st.kuat}</b>kuat</div><div><b>${S.streak}🔥</b>hari beruntun</div></div>`;
    if (!st.total) html += `<p class="muted">Belum ada ayat. Buka tab <b>Tambah</b> untuk memilih surah yang ingin dihafal.</p>`;
    else if (!k) html += `<div class="hf-card"><h3>✅ Selesai untuk hari ini</h3><p class="muted">Tidak ada ayat jatuh tempo. Tambahkan ayat baru atau kembali besok; jadwal ulang diatur otomatis.</p></div>`;
    else {
      const a = await ayatOf(k), c = S.cards[k], words = a.ar.split(' ');
      const hid = new Set(hashIdx(k, words.length).slice(0, show ? 0 : Math.max(1, Math.ceil(words.length * ratio(c)))));
      const sn = (await getSurahs()).find(s => s.n === a.n);
      const pos = (rev.total || sess.length) - sess.length + 1;
      html += `<div class="hf-bar"><i style="width:${Math.round(((pos - 1) / (rev.total || 1)) * 100)}%"></i></div>
<div class="hf-card"><div class="muted small">${esc(sn ? sn.la : 'Surah ' + a.n)} : ${a.a} · sisa ${sess.length} · tingkat sembunyi ${Math.round(ratio(c) * 100)}%</div>
<p><b>Arti:</b> ${esc(a.id)}</p>
<div class="hf-ar" lang="ar">${words.map((w, i) => hid.has(i) ? `<span class="hf-w hide" data-w="${esc(w)}">${'ـ'.repeat(Math.max(2, Math.min(7, w.length)))}</span>` : `<span class="hf-w">${esc(w)}</span>`).join(' ')}</div>
${show ? `<p class="muted small">${esc(a.la)}</p><div class="hf-rate">${[[0, 'Lupa'], [3, 'Sulit'], [4, 'Baik'], [5, 'Mudah']].map(([q, t]) => `<button data-q="${q}"><b>${t}</b><small>${lbl(q < 3 ? 0 : sched(c, q).iv)}</small></button>`).join('')}</div>` : `<div class="row"><button class="btn primary" data-act="show">Tampilkan jawaban</button><span class="muted small">Ketuk kotak untuk membuka satu kata.</span></div>`}</div>`;
    }
    $('#hfBody').innerHTML = html;
  }

  async function renderAdd() {
    const L = await getSurahs();
    $('#hfBody').innerHTML = `<div class="hf-card"><h3>Tambah ayat ke hafalan</h3>
<div class="row"><select id="hfS">${L.map(s => `<option value="${s.n}" data-c="${s.count}">${s.n}. ${esc(s.la)} (${s.count})</option>`).join('')}</select>
<input id="hfF" type="number" min="1" value="1" style="width:76px" aria-label="Dari ayat"> – <input id="hfT" type="number" min="1" value="${L[0].count}" style="width:76px" aria-label="Sampai ayat"></div>
<div class="row"><button class="btn primary" data-act="add">Tambahkan</button><span id="hfMsg" class="muted small"></span></div>
<p class="muted small">Pintasan: ${[[1, 'Al-Fatihah'], [112, 'Al-Ikhlas'], [113, 'Al-Falaq'], [114, 'An-Nas'], [108, 'Al-Kautsar']].map(([n, t]) => `<button class="chip" data-quick="${n}">${t}</button>`).join(' ')}</p></div>
<div class="hf-card"><div class="row"><button class="btn" data-act="reset">Hapus semua progres</button></div></div>`;
    const sel = $('#hfS'); sel.onchange = () => { $('#hfF').value = 1; $('#hfT').value = sel.selectedOptions[0].dataset.c; };
  }

  const draw = () => { document.querySelectorAll('#hf [data-tab]').forEach(b => b.classList.toggle('primary', b.dataset.tab === tab)); return tab === 'hari' ? renderToday() : renderAdd(); };

  view.addEventListener('click', async e => {
    if (!e.target.closest('#hf')) return;
    const t = e.target.closest('[data-tab],[data-w],[data-q],[data-act],[data-quick]'); if (!t) return;
    if (t.dataset.tab) { tab = t.dataset.tab; sess = null; show = false; return draw(); }
    if (t.dataset.w) { t.classList.remove('hide'); t.textContent = t.dataset.w; return; }
    if (t.dataset.act === 'show') { show = true; return draw(); }
    if (t.dataset.q !== undefined) {
      const k = sess.shift(), q = +t.dataset.q; S.cards[k] = { ...S.cards[k], ...sched(S.cards[k], q) };
      if (q < 3) sess.push(k);
      if (S.last !== today()) { S.streak = S.last === today() - 1 ? S.streak + 1 : 1; S.last = today(); }
      save(); show = false; return draw();
    }
    const msg = txt => { const m = $('#hfMsg'); if (m) m.textContent = txt; };
    if (t.dataset.quick) { const n = +t.dataset.quick, s = await getS(n); const c = await addRange(n, 1, s.ayat.length); return msg(`${c} ayat ditambahkan.`); }
    if (t.dataset.act === 'add') { const n = +$('#hfS').value, c = await addRange(n, +$('#hfF').value || 1, +$('#hfT').value || 999); return msg(c ? `${c} ayat ditambahkan.` : 'Semua ayat itu sudah ada.'); }
    if (t.dataset.act === 'reset' && confirm('Hapus semua progres hafalan?')) { S = { cards: {}, streak: 0, last: 0, done: {} }; save(); sess = null; msg('Progres dihapus.'); }
  });

  return () => {
    setTitle('Hafalan Cerdas'); tab = 'hari'; sess = null; show = false; rev = {};
    view.innerHTML = `<div id="hf"><section class="hd-hero"><p class="hd-bis" lang="ar" dir="rtl">وَلَقَدْ يَسَّرْنَا الْقُرْآنَ لِلذِّكْرِ</p><h1>Hafalan Cerdas</h1><p>Pengulangan berjarak yang menyesuaikan diri: ayat yang kuat makin jarang muncul dan makin banyak kata disembunyikan.</p></section>
<div class="row"><button class="btn primary" data-tab="hari">Hari ini</button><button class="btn" data-tab="tambah">Tambah</button></div><div id="hfBody"></div></div>`;
    getSurahs().then(() => { rev.total = due().length; sess = null; draw(); });
  };
};
