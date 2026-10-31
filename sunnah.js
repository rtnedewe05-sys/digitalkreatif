/* As-Sunnah: amalan sunnah harian (pelacak + streak), kalender Hijriah, pustaka amalan per tema.
 * Dalil terhubung ke pencarian hadis offline (data/hadis). Semua tersimpan di perangkat. */
window.makeSunnahView = function (d) {
  const { $, esc, view, setTitle, toast, store } = d;
  const CATS = { sholat: ['🕌', 'Sholat sunnah'], puasa: ['🌙', 'Puasa sunnah'], dzikir: ['📿', 'Dzikir & doa'], adab: ['🤲', 'Adab harian'], akhlak: ['💚', 'Akhlak & sosial'], jumat: ['🕋', 'Sunnah hari Jumat'] };
  /* id, kategori, judul, penjelasan, kata kunci pencarian dalil, (opsional) hanya hari tertentu */
  const I = [
    ['rawatib', 'sholat', 'Sholat rawatib 12 rakaat', 'Dua sebelum Subuh, empat sebelum dan dua sesudah Zuhur, dua sesudah Maghrib, dua sesudah Isya. Pahalanya rumah di surga.', 'dua belas rakaat'],
    ['fajr2', 'sholat', 'Dua rakaat sebelum Subuh', 'Lebih baik daripada dunia dan seisinya.', 'dua rakaat fajar'],
    ['dhuha', 'sholat', 'Sholat Dhuha', 'Minimal dua rakaat setelah matahari naik setinggi tombak hingga menjelang Zuhur.', 'dhuha'],
    ['tahajud', 'sholat', 'Qiyamul lail / Tahajud', 'Sholat malam setelah tidur, ditutup dengan witir.', 'sholat malam'],
    ['witir', 'sholat', 'Sholat witir', 'Penutup sholat malam; waktunya setelah Isya hingga Subuh.', 'witir'],
    ['wudhu2', 'sholat', 'Dua rakaat setelah wudhu', 'Sholat sunnah wudhu, pelakunya dijanjikan surga.', 'sesudah berwudhu dua rakaat'],
    ['senin', 'puasa', 'Puasa Senin', 'Hari diangkatnya amal; Nabi ﷺ berpuasa karena hari kelahiran dan turunnya wahyu.', 'puasa hari senin', [1]],
    ['kamis', 'puasa', 'Puasa Kamis', 'Amal diperlihatkan kepada Allah pada hari Senin dan Kamis.', 'puasa senin dan kamis', [4]],
    ['bidh', 'puasa', 'Puasa Ayyamul Bidh (13, 14, 15 Hijriah)', 'Tiga hari setiap bulan Hijriah, seperti puasa sepanjang masa.', 'tiga hari setiap bulan', null, 'bidh'],
    ['arafah', 'puasa', 'Puasa Arafah (9 Dzulhijjah)', 'Menghapus dosa setahun yang lalu dan setahun yang akan datang. Bagi yang tidak berhaji.', 'puasa hari arafah', null, 'arafah'],
    ['asyura', 'puasa', 'Puasa Asyura (10 Muharram)', 'Menghapus dosa setahun yang lalu; disunnahkan bersama 9 Muharram.', 'puasa hari asyura', null, 'asyura'],
    ['pagi', 'dzikir', 'Dzikir pagi', 'Dibaca setelah Subuh hingga terbit matahari.', 'pagi hari berdzikir'],
    ['petang', 'dzikir', 'Dzikir petang', 'Dibaca setelah Ashar hingga Maghrib.', 'sore hari berdzikir'],
    ['istighfar', 'dzikir', 'Istighfar 100 kali', 'Nabi ﷺ beristighfar lebih dari tujuh puluh kali sehari.', 'beristighfar'],
    ['shalawat', 'dzikir', 'Bershalawat kepada Nabi ﷺ', 'Satu shalawat dibalas sepuluh shalawat dari Allah.', 'bershalawat kepadaku'],
    ['kursi', 'dzikir', 'Ayat Kursi setelah sholat wajib', 'Tidak ada yang menghalangi pembacanya masuk surga selain kematian.', 'ayat kursi'],
    ['siwak', 'adab', 'Bersiwak', 'Membersihkan mulut dan diridhai Rabb; terutama saat wudhu dan sebelum sholat.', 'siwak'],
    ['tidur', 'adab', 'Adab tidur (wudhu, dzikir, miring ke kanan)', 'Berwudhu, membaca Ayat Kursi dan dzikir tidur, tidur miring ke kanan.', 'ranjang tidurmu'],
    ['makan', 'adab', 'Adab makan (bismillah, tangan kanan)', 'Membaca basmalah, makan dengan tangan kanan dari yang terdekat.', 'sebutlah nama allah makan tangan kananmu'],
    ['masjid', 'adab', 'Doa masuk-keluar masjid & kaki kanan dulu', 'Masuk masjid dengan kaki kanan, keluar dengan kaki kiri.', 'masuk masjid'],
    ['senyum', 'akhlak', 'Senyum & salam', 'Menebar salam dan senyum kepada saudara adalah sedekah.', 'senyummu'],
    ['sedekah', 'akhlak', 'Sedekah harian', 'Setiap pagi malaikat mendoakan orang yang berinfak.', 'sedekah'],
    ['silaturahim', 'akhlak', 'Silaturahim & berbakti kepada orang tua', 'Memperpanjang umur dan melapangkan rezeki.', 'silaturahim'],
    ['kahfi', 'jumat', 'Membaca surah Al-Kahfi', 'Disunnahkan pada hari Jumat (malam atau siangnya).', 'surat al kahfi', [5]],
    ['mandi', 'jumat', 'Mandi, wewangian & pakaian terbaik', 'Persiapan Jumat; berangkat lebih awal.', 'mandi pada hari jumat', [5]],
    ['shalawatJ', 'jumat', 'Memperbanyak shalawat hari Jumat', 'Shalawat kita diperlihatkan kepada Nabi ﷺ.', 'perbanyaklah shalawat hari jumat', [5]]
  ];
  const byId = Object.fromEntries(I.map(x => [x[0], x]));
  const DOW = ['Ahad', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const BLN = ['Muharram', 'Shafar', 'Rabiul Awal', 'Rabiul Akhir', 'Jumadil Awal', 'Jumadil Akhir', 'Rajab', 'Sya\'ban', 'Ramadhan', 'Syawal', 'Dzulqa\'dah', 'Dzulhijjah'];
  const key = dt => `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}`;
  const log = () => store.get('sunnahLog', {});
  const dalil = q => `#/hadis/cari?q=${encodeURIComponent(q)}`;

  function hijri(dt) {
    try {
      const p = Object.fromEntries(new Intl.DateTimeFormat('en-u-ca-islamic-umalqura', { day: 'numeric', month: 'numeric', year: 'numeric' }).formatToParts(dt).map(x => [x.type, x.value]));
      return { d: +p.day, m: +p.month, y: parseInt(p.year, 10) };
    } catch { return null; }
  }
  /* amalan yang berlaku untuk tanggal tertentu */
  function today(dt, h) {
    const dow = dt.getDay();
    return I.filter(x => {
      if (x[5]) return x[5].includes(dow);
      if (x[6] === 'bidh') return h && [13, 14, 15].includes(h.d) && !(h.m === 12 && h.d >= 11 && h.d <= 13);
      if (x[6] === 'arafah') return h && h.m === 12 && h.d === 9;
      if (x[6] === 'asyura') return h && h.m === 1 && [9, 10].includes(h.d);
      return true;
    });
  }
  function streak(l) {
    let n = 0; const c = new Date();
    if (!(l[key(c)] || []).length) c.setDate(c.getDate() - 1);
    while ((l[key(c)] || []).length) { n++; c.setDate(c.getDate() - 1); }
    return n;
  }
  const tabs = cur => `<nav class="hd-tabs" aria-label="As-Sunnah">${[['hari', 'Hari ini'], ['amalan', 'Pustaka amalan'], ['riwayat', 'Riwayat']]
    .map(([k, l]) => `<a class="chip ${cur === k ? 'active' : ''}" href="#/sunnah/${k}" ${cur === k ? 'aria-current="page"' : ''}>${l}</a>`).join('')}</nav>`;
  const head = cur => `<section class="hd-hero"><p class="hd-bis" lang="ar" dir="rtl">مَنْ أَحْيَا سُنَّتِي فَقَدْ أَحَبَّنِي</p><h1>As-Sunnah</h1><p>Amalan sunnah Nabi ﷺ: lacak harian, tahu waktunya, dan telusuri dalilnya.</p></section>${tabs(cur)}`;

  function item(x, done, o = {}) {
    return `<div class="sn-item ${done ? 'done' : ''}" data-id="${x[0]}">
      <button class="sn-chk" data-act="toggle" aria-pressed="${done}" aria-label="Tandai ${esc(x[2])}">${done ? '✓' : ''}</button>
      <div class="sn-body"><b>${esc(x[2])}</b><p class="muted small">${esc(x[3])}</p>
      <a class="sn-dl" href="${dalil(x[4])}">📜 Cari dalil di hadis</a></div></div>`;
  }
  function wire() {
    view.onclick = e => {
      const b = e.target.closest('[data-act="toggle"]'); if (!b) return;
      const id = b.closest('.sn-item').dataset.id, k = key(new Date()), l = log(), s = new Set(l[k] || []);
      s.has(id) ? s.delete(id) : s.add(id); l[k] = [...s];
      if (!l[k].length) delete l[k];
      store.set('sunnahLog', l); hari();
    };
  }

  function hari() {
    const dt = new Date(), h = hijri(dt), l = log(), done = new Set(l[key(dt)] || []), list = today(dt, h);
    const n = list.filter(x => done.has(x[0])).length, pct = list.length ? Math.round(n / list.length * 100) : 0;
    const special = [];
    if (h) {
      if ([13, 14, 15].includes(h.d)) special.push('Hari ini termasuk Ayyamul Bidh: sunnah berpuasa.');
      if (h.m === 12 && h.d === 9) special.push('Hari Arafah: puasa sunnah yang sangat utama.');
      if (h.m === 1 && h.d === 10) special.push('Hari Asyura: sunnah berpuasa.');
      if (h.m === 12 && h.d >= 11 && h.d <= 13) special.push('Hari Tasyriq: puasa dilarang.');
      if (h.m === 9 && h.d === 1) special.push('Awal Ramadhan: puasa wajib.');
      if (h.m === 10 && h.d === 1) special.push('Idul Fitri: puasa dilarang.');
      if (h.m === 12 && h.d === 10) special.push('Idul Adha: puasa dilarang.');
    }
    const groups = Object.keys(CATS).map(c => ({ c, xs: list.filter(x => x[1] === c) })).filter(g => g.xs.length);
    view.innerHTML = head('hari') + `<section class="card sn-sum">
      <div class="sn-ring" style="--p:${pct}"><span>${pct}%</span></div>
      <div><b>${DOW[dt.getDay()]}${h ? `, ${h.d} ${BLN[h.m - 1]} ${h.y} H` : ''}</b>
      <p class="muted small">${n} dari ${list.length} amalan hari ini · 🔥 Beruntun ${streak(l)} hari</p></div></section>
      ${special.map(s => `<div class="card sn-spec">${esc(s)}</div>`).join('')}
      ${groups.map(g => `<p class="mini-title hd-sec">${CATS[g.c][0]} ${CATS[g.c][1]}</p>${g.xs.map(x => item(x, done.has(x[0]))).join('')}`).join('')}
      <p class="muted small hd-note">Sunnah dilakukan sesuai kemampuan, tanpa memberatkan diri. Untuk hukum rinci, rujuklah ulama yang terpercaya.</p>`;
    wire();
  }

  function amalan(cat) {
    const c = CATS[cat] ? cat : '';
    view.innerHTML = head('amalan') + `<nav class="hd-tabs">${[['', 'Semua'], ...Object.entries(CATS).map(([k, v]) => [k, v[1]])]
      .map(([k, t]) => `<a class="chip ${c === k ? 'active' : ''}" href="#/sunnah/amalan${k ? '?c=' + k : ''}">${t}</a>`).join('')}</nav>` +
      Object.keys(CATS).filter(k => !c || k === c).map(k => `<p class="mini-title hd-sec">${CATS[k][0]} ${CATS[k][1]}</p>` +
        I.filter(x => x[1] === k).map(x => `<div class="card sn-lib"><b>${esc(x[2])}</b><p class="muted small">${esc(x[3])}</p><a class="btn sm" href="${dalil(x[4])}">📜 Cari dalil</a></div>`).join('')).join('');
    view.onclick = null;
  }

  function riwayat() {
    const l = log(), t = new Date(); let cells = '', total = 0;
    for (let i = 27; i >= 0; i--) {
      const dd = new Date(t); dd.setDate(t.getDate() - i); const n = (l[key(dd)] || []).length; total += n;
      cells += `<span class="sn-cell l${Math.min(4, n)}" title="${key(dd)}: ${n} amalan"></span>`;
    }
    const cnt = {}; Object.values(l).flat().forEach(id => cnt[id] = (cnt[id] || 0) + 1);
    const top = Object.entries(cnt).sort((a, b) => b[1] - a[1]).slice(0, 5);
    view.innerHTML = head('riwayat') + `<section class="card"><b>28 hari terakhir</b><div class="sn-grid">${cells}</div>
      <p class="muted small">${total} amalan tercatat · beruntun ${streak(l)} hari</p></section>
      <section class="card"><b>Paling sering kamu amalkan</b>${top.length ? top.map(([id, n]) => `<p class="small">${esc(byId[id] ? byId[id][2] : id)} <span class="muted">· ${n}×</span></p>`).join('') : '<p class="muted small">Belum ada catatan. Mulai dari tab “Hari ini”.</p>'}</section>`;
    view.onclick = null;
  }

  return function (sub, q) {
    setTitle('As-Sunnah', true);
    if (sub === 'amalan') return amalan(q.get('c') || '');
    if (sub === 'riwayat') return riwayat();
    return hari();
  };
};
