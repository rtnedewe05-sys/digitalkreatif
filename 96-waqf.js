/* Tanda waqaf + info huruf hijaiyah: hover = ringkas, klik = detail cara baca. Tanpa mengubah markup tajwid. */
(function () {
  const WAQF = {
    '\u06D8': { s: 'م', n: 'Waqaf Lazim', c: '#dc2626', r: 'Wajib berhenti', d: 'Berhenti di sini wajib. Jika disambung, makna ayat bisa berubah dan menjadi keliru.', h: 'Berhenti, tarik napas, lalu mulai kata berikutnya.' },
    '\u06D9': { s: 'لا', n: 'Laa Waqf', c: '#6b7280', r: 'Jangan berhenti', d: 'Dilarang berhenti di sini karena kalimat belum selesai. Bila terpaksa (napas habis), ulangi dari kata sebelumnya.', h: 'Sambung terus ke kata berikutnya tanpa jeda. Di akhir ayat boleh berhenti.' },
    '\u06D6': { s: 'صلى', n: 'Al-Washl Aula', c: '#2563eb', r: 'Lebih baik lanjut', d: 'Boleh berhenti, tetapi menyambung lebih utama.', h: 'Sambung dulu; berhenti hanya jika napas tidak cukup.' },
    '\u06D7': { s: 'قلى', n: 'Al-Waqf Aula', c: '#16a34a', r: 'Lebih baik berhenti', d: 'Boleh disambung, tetapi berhenti lebih utama.', h: 'Berhenti sejenak (waqaf), tarik napas, lanjutkan.' },
    '\u06DA': { s: 'ج', n: 'Waqf Ja\u2019iz', c: '#d97706', r: 'Boleh berhenti atau lanjut', d: 'Berhenti dan menyambung sama baiknya.', h: 'Pilih salah satu sesuai napas.' },
    '\u06DB': { s: '\u06DB', n: 'Mu\u2019anaqah', c: '#9333ea', r: 'Berhenti di salah satu titik', d: 'Tiga titik muncul berpasangan. Berhentilah di salah satu, tidak di keduanya. Bila berhenti di tanda pertama, tanda kedua dilewati, begitu pula sebaliknya.', h: 'Pilih satu tempat berhenti, lalu sambung di tempat lainnya.' },
    '\u06DC': { s: 'س', n: 'Saktah', c: '#0d9488', r: 'Diam sejenak tanpa napas', d: 'Berhenti sangat singkat (± 2 harakat) tanpa mengambil napas, lalu langsung lanjut.', h: 'Tahan suara sebentar tanpa tarik napas, kemudian lanjutkan.' }
  };
  const MARKS = Object.keys(WAQF).join('');
  const H = [ // [huruf, nama, makhraj, sifat]
    ['ا','Alif','Al-Jauf (rongga mulut)/tenggorokan bawah','Jahr, rakhawah, istifal'],
    ['ب','Ba','Syafatain: bibir bawah bertemu bibir atas (basah)','Jahr, syiddah, qalqalah'],
    ['ت','Ta','Ujung lidah dengan pangkal gigi seri atas','Hams, syiddah, istifal'],
    ['ث','Tsa','Ujung lidah dengan ujung gigi seri atas','Hams, rakhawah, istifal'],
    ['ج','Jim','Tengah lidah dengan langit-langit atas','Jahr, syiddah, qalqalah'],
    ['ح','Ha','Tengah tenggorokan','Hams, rakhawah, istifal'],
    ['خ','Kha','Ujung tenggorokan (dekat mulut)','Hams, rakhawah, isti\u2019la'],
    ['د','Dal','Ujung lidah dengan pangkal gigi seri atas','Jahr, syiddah, qalqalah'],
    ['ذ','Dzal','Ujung lidah dengan ujung gigi seri atas','Jahr, rakhawah, istifal'],
    ['ر','Ra','Ujung lidah (agak ke punggung), dekat makhraj nun','Jahr, takrir, tafkhim/tarqiq'],
    ['ز','Zai','Ujung lidah dengan ujung gigi seri bawah (bersiul)','Jahr, rakhawah, shafir'],
    ['س','Sin','Ujung lidah dengan ujung gigi seri bawah (bersiul)','Hams, rakhawah, shafir'],
    ['ش','Syin','Tengah lidah dengan langit-langit atas','Hams, rakhawah, tafasysyi'],
    ['ص','Shad','Ujung lidah dengan ujung gigi seri bawah','Hams, isti\u2019la, ithbaq, shafir'],
    ['ض','Dhad','Tepi lidah dengan geraham atas','Jahr, isti\u2019la, ithbaq, istithalah'],
    ['ط','Tha','Ujung lidah dengan pangkal gigi seri atas','Jahr, syiddah, isti\u2019la, qalqalah'],
    ['ظ','Zha','Ujung lidah dengan ujung gigi seri atas','Jahr, rakhawah, isti\u2019la, ithbaq'],
    ['ع','\u2018Ain','Tengah tenggorokan','Jahr, tawassuth, istifal'],
    ['غ','Ghain','Ujung tenggorokan (dekat mulut)','Jahr, rakhawah, isti\u2019la'],
    ['ف','Fa','Bibir bawah bagian dalam dengan ujung gigi seri atas','Hams, rakhawah, istifal'],
    ['ق','Qaf','Pangkal lidah dengan langit-langit lunak','Jahr, syiddah, isti\u2019la, qalqalah'],
    ['ك','Kaf','Pangkal lidah (agak ke depan dari Qaf)','Hams, syiddah, istifal'],
    ['ل','Lam','Tepi lidah dengan gusi atas','Jahr, tawassuth, inhiraf'],
    ['م','Mim','Syafatain: kedua bibir dirapatkan','Jahr, tawassuth, ghunnah'],
    ['ن','Nun','Ujung lidah dengan gusi atas','Jahr, tawassuth, ghunnah'],
    ['و','Waw','Syafatain: bibir dibulatkan','Jahr, rakhawah, layyin'],
    ['ه','Ha\u2019','Pangkal tenggorokan','Hams, rakhawah, istifal'],
    ['ي','Ya','Tengah lidah dengan langit-langit atas','Jahr, rakhawah, layyin']
  ];
  const HM = {}; H.forEach(x => { HM[x[0]] = x; }); HM['ى'] = HM['ي']; HM['ء'] = ['ء','Hamzah','Pangkal tenggorokan','Jahr, syiddah, istifal'];
  ['أ','إ','ؤ','ئ','ٱ'].forEach(k => { HM[k] = HM['ء']; });
  HM['ة'] = ['ة','Ta marbuthah','Sama seperti Ta (waqaf dibaca Ha)','Dibaca \u201Cha\u201D saat berhenti, \u201Cta\u201D saat disambung'];

  const pop = document.createElement('div');
  pop.id = 'wqPop'; pop.hidden = true; pop.setAttribute('role', 'status');
  document.addEventListener('DOMContentLoaded', () => document.body.appendChild(pop));
  if (document.body) document.body.appendChild(pop);
  let pinned = false, hideT;
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  function place(x, y) {
    pop.hidden = false;
    const w = pop.offsetWidth, h = pop.offsetHeight;
    pop.style.left = Math.max(8, Math.min(innerWidth - w - 8, x - w / 2)) + 'px';
    pop.style.top = (y - h - 14 < 8 ? y + 24 : y - h - 14) + 'px';
  }
  function showWaqf(el, full) {
    const w = WAQF[el.dataset.wq]; if (!w) return;
    const r = el.getBoundingClientRect();
    pop.innerHTML = `<b style="color:${w.c}">${esc(w.s)} \u00B7 ${esc(w.n)}</b><div>${esc(w.r)}</div>` +
      (full ? `<div class="wqd">${esc(w.d)}</div><div class="wqd"><b>Cara baca:</b> ${esc(w.h)}</div>` : '<small>Ketuk untuk detail</small>');
    place(r.left + r.width / 2, r.top);
  }
  function showLetter(ch, x, y) {
    const l = HM[ch]; if (!l) return;
    pop.innerHTML = `<b dir="rtl" lang="ar" style="font-size:1.4em">${esc(l[0])}</b> <b>${esc(l[1])}</b>` +
      `<div class="wqd"><b>Makhraj:</b> ${esc(l[2])}</div><div class="wqd"><b>Sifat:</b> ${esc(l[3])}</div>`;
    place(x, y);
  }
  function letterAt(x, y) {
    let node, off;
    if (document.caretPositionFromPoint) { const p = document.caretPositionFromPoint(x, y); if (p) { node = p.offsetNode; off = p.offset; } }
    else if (document.caretRangeFromPoint) { const p = document.caretRangeFromPoint(x, y); if (p) { node = p.startContainer; off = p.startOffset; } }
    if (!node || node.nodeType !== 3) return null;
    const t = node.textContent;
    for (const i of [off, off - 1]) if (t[i] && HM[t[i]]) return t[i];
    return null;
  }
  /* Bungkus tanda waqaf (hanya yang berdiri sendiri setelah ZWNJ/spasi, agar sambungan huruf tidak rusak) */
  const RE = new RegExp('([\\u200C\\s])([' + MARKS + '])', 'g');
  function wrap(arab) {
    if (arab.dataset.wq) return; arab.dataset.wq = '1';
    const walker = document.createTreeWalker(arab, NodeFilter.SHOW_TEXT), list = [];
    let n; while ((n = walker.nextNode())) if (RE.test(n.textContent)) list.push(n);
    RE.lastIndex = 0;
    list.forEach(node => {
      const frag = document.createDocumentFragment(); let last = 0; const t = node.textContent; RE.lastIndex = 0; let m;
      while ((m = RE.exec(t))) {
        frag.append(t.slice(last, m.index + 1));
        const s = document.createElement('span'); s.className = 'wq'; s.dataset.wq = m[2]; s.textContent = m[2];
        s.style.setProperty('--wq', WAQF[m[2]].c); s.tabIndex = 0; frag.append(s); last = m.index + m[0].length;
      }
      frag.append(t.slice(last)); node.replaceWith(frag);
    });
  }
  const scan = () => document.querySelectorAll('.arab:not([data-wq])').forEach(wrap);
  new MutationObserver(scan).observe(document.documentElement, { childList: true, subtree: true });
  scan();

  document.addEventListener('mouseover', e => {
    if (pinned) return;
    const w = e.target.closest && e.target.closest('.wq'); if (w) { clearTimeout(hideT); showWaqf(w, false); }
  });
  document.addEventListener('mouseout', e => {
    if (!pinned && e.target.closest && e.target.closest('.wq')) { hideT = setTimeout(() => { pop.hidden = true; }, 200); }
  });
  document.addEventListener('click', e => {
    const w = e.target.closest && e.target.closest('.wq');
    if (w) { e.stopPropagation(); pinned = true; showWaqf(w, true); return; }
    if (e.target.closest && e.target.closest('#wqPop')) return;
    const arab = e.target.closest && e.target.closest('.arab');
    if (arab && !e.target.closest('.tj, .wd, .wq') && !document.body.classList.contains('hafalan')) {
      const ch = letterAt(e.clientX, e.clientY);
      if (ch) { pinned = true; showLetter(ch, e.clientX, e.clientY); return; }
    }
    pinned = false; pop.hidden = true;
  }, true);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') { pinned = false; pop.hidden = true; } });
})();
