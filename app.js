'use strict';
/* Al-Quran — PWA tanpa build, bisa dipakai offline.
 * Data teks, latin, terjemahan, arti per kata, tajwid, tafsir, dan pencarian ikut dibundel di folder data/.
 * Hanya audio murottal yang memakai internet (bisa diunduh per surah). */
(() => {
  const EQURAN = 'https://equran.id/api/v2';
  const CLOUD = 'https://api.alquran.cloud/v1';
  const QCOM = 'https://api.quran.com/api/v4';

  const QARI_NAMES = {
    '01': 'Abdullah Al-Juhany',
    '02': 'Abdul Muhsin Al-Qasim',
    '03': 'Abdurrahman As-Sudais',
    '04': 'Ibrahim Al-Dossari',
    '05': 'Misyari Rasyid Al-Afasi'
  };
  /* Qari tambahan: audio per ayat dari everyayah.com (kunci 'ea:<folder>'). Jika file qari gagal dimuat, otomatis kembali ke Misyari Al-Afasi. */
  const EA_QARI = {
    'Alafasy_128kbps': 'Misyari Rasyid Al-Afasi (sumber everyayah)',
    'Abdul_Basit_Murattal_64kbps': 'Abdul Basit Abdus Samad (Murattal)',
    'Abdul_Basit_Mujawwad_128kbps': 'Abdul Basit Abdus Samad (Mujawwad)',
    'Abdurrahmaan_As-Sudais_192kbps': 'Abdurrahman As-Sudais',
    'Abu_Bakr_Ash-Shaatree_128kbps': 'Abu Bakr Asy-Syatsri',
    'Hani_Rifai_192kbps': 'Hani Ar-Rifai',
    'Husary_64kbps': 'Mahmud Khalil Al-Husari',
    'Minshawy_Murattal_128kbps': 'Muhammad Siddiq Al-Minsyawi (Murattal)',
    'Minshawy_Mujawwad_192kbps': 'Muhammad Siddiq Al-Minsyawi (Mujawwad)',
    'Mohammad_al_Tablaway_128kbps': 'Muhammad Ath-Thablawi',
    'Saood_ash-Shuraym_128kbps': 'Sa\u2019ud Asy-Syuraim',
    'Hudhaify_128kbps': 'Ali Al-Hudzaifi',
    'Ghamadi_40kbps': 'Sa\u2019d Al-Ghamidi',
    'Abdullah_Basfar_192kbps': 'Abdullah Basfar',
    'Muhammad_Ayyoub_128kbps': 'Muhammad Ayyub',
    'Muhammad_Jibreel_128kbps': 'Muhammad Jibril',
    'Ahmed_ibn_Ali_al-Ajamy_128kbps_ketaballah.net': 'Ahmad bin Ali Al-Ajmi',
    'Yasser_Ad-Dussary_128kbps': 'Yasser Ad-Dausari',
    'Nasser_Alqatami_128kbps': 'Nasser Al-Qatami'
  };
  Object.keys(EA_QARI).forEach(k => { QARI_NAMES['ea:' + k] = EA_QARI[k]; });

  /* Hukum tajwid: kode alquran.cloud -> [nama, penjelasan] */
  const TAJWID = {
    h: ['Hamzah Wasal', 'Hamzah di awal kata yang hanya dibaca saat memulai bacaan; hilang bila disambung dengan kata sebelumnya.'],
    s: ['Huruf Tidak Dibaca', 'Huruf yang tidak dilafalkan.'],
    l: ['Lam Syamsiyah', 'Lam ta\u2019rif tidak dibaca, melebur ke huruf syamsiyah sesudahnya (huruf berikutnya bertasydid).'],
    n: ['Mad Thabi\u2019i', 'Dipanjangkan 2 harakat.'],
    p: ['Mad Jaiz', 'Mad Munfasil / \u2018Aridh lis-Sukun: boleh dipanjangkan 2, 4, atau 6 harakat.'],
    m: ['Mad Lazim', 'Wajib dipanjangkan 6 harakat.'],
    o: ['Mad Wajib Muttasil', 'Wajib dipanjangkan 4\u20135 harakat.'],
    q: ['Qalqalah', 'Huruf qalqalah (ق ط ب ج د) yang mati dibaca memantul.'],
    c: ['Ikhfa Syafawi', 'Mim mati bertemu huruf ba\u2019, dibaca samar dengan dengung.'],
    f: ['Ikhfa Haqiqi', 'Nun mati / tanwin bertemu salah satu dari 15 huruf ikhfa, dibaca samar dengan dengung.'],
    w: ['Idgham Syafawi', 'Mim mati bertemu mim, dilebur dengan dengung.'],
    i: ['Iqlab', 'Nun mati / tanwin bertemu ba\u2019, diubah menjadi mim samar dengan dengung.'],
    a: ['Idgham Bighunnah', 'Nun mati / tanwin bertemu ي ن م و, dilebur dengan dengung.'],
    u: ['Idgham Bilaghunnah', 'Nun mati / tanwin bertemu ل atau ر, dilebur tanpa dengung.'],
    d: ['Idgham Mutajanisain', 'Dua huruf yang sama makhraj berbeda sifat bertemu; huruf pertama mati dan dilebur.'],
    b: ['Idgham Mutaqaribain', 'Dua huruf yang berdekatan makhraj/sifat bertemu; huruf pertama mati dan dilebur.'],
    g: ['Ghunnah', 'Dengung pada nun / mim bertasydid, ditahan sekitar 2 harakat.']
  };
  const LEGEND_ORDER = ['h', 'l', 's', 'n', 'p', 'o', 'm', 'q', 'f', 'c', 'i', 'a', 'w', 'u', 'd', 'b', 'g'];
  /* Cara membaca tiap hukum (praktis) */
  const HOW = {
    h: 'Jika memulai bacaan dari kata ini, ucapkan hamzahnya; jika disambung dari kata sebelumnya, lewati (tidak dibaca).',
    s: 'Lewati huruf ini, jangan dilafalkan.',
    l: 'Jangan ucapkan lam-nya; langsung baca huruf sesudahnya dengan tasydid.',
    n: 'Tahan bunyi vokal selama 2 harakat (sekitar 2 ketukan).',
    p: 'Tahan 2, 4, atau 6 harakat; pilih satu panjang dan konsisten.',
    m: 'Tahan tepat 6 harakat.',
    o: 'Tahan 4 sampai 5 harakat.',
    q: 'Pantulkan bunyi huruf dengan ringan saat huruf itu mati.',
    c: 'Rapatkan bibir tanpa menekan, dengungkan sekitar 2 harakat, lalu baca ba\u2019.',
    f: 'Samarkan nun/tanwin di dekat makhraj huruf berikutnya, dengungkan sekitar 2 harakat.',
    w: 'Lebur mim mati ke mim berikutnya sambil mendengung sekitar 2 harakat.',
    i: 'Ubah nun/tanwin menjadi mim samar (bibir dirapatkan), dengungkan sekitar 2 harakat, lalu baca ba\u2019.',
    a: 'Lebur nun/tanwin ke huruf berikutnya sambil mendengung sekitar 2 harakat.',
    u: 'Lebur nun/tanwin ke huruf berikutnya tanpa dengung.',
    d: 'Masukkan huruf pertama ke huruf kedua sehingga terdengar seperti satu huruf bertasydid.',
    b: 'Masukkan huruf pertama ke huruf kedua sehingga terdengar seperti satu huruf bertasydid.',
    g: 'Dengungkan nun/mim bertasydid sekitar 2 harakat.'
  };

  /* ---------- util ---------- */
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const norm = s => String(s).toLowerCase().replace(/[^a-z0-9]/g, '');

  const ICONS = {
    play: 'M8 5v14l11-7z',
    pause: 'M6 19h4V5H6v14zm8-14v14h4V5h-4z',
    prev: 'M6 6h2v12H6zm3.5 6l8.5 6V6z',
    next: 'M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z',
    bookmark: 'M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2zm0 15l-5-2.18L7 18V5h10v13z',
    words: 'M12.87 15.07l-2.54-2.51.03-.03A17.52 17.52 0 0 0 14.07 6H17V4h-7V2H8v2H1v1.99h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z',
    bookmarkOn: 'M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z',
    share: 'M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z',
    search: 'M15.5 14h-.79l-.28-.27A6.47 6.47 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z',
    back: 'M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z',
    eye: 'M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z',
    eyeoff: 'M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z',
    tune: 'M3 17v2h6v-2H3zM3 5v2h10V5H3zm10 16v-2h8v-2h-8v-2h-2v6h2zM7 9v2H3v2h4v2h2V9H7zm14 4v-2H11v2h10zm-6-4h2V7h4V5h-4V3h-2v6z',
    book: 'M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z',
    close: 'M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z',
    spark: 'M19 9l1.25-2.75L23 5l-2.75-1.25L19 1l-1.25 2.75L15 5l2.75 1.25L19 9zm-7.5.5L9 4 6.5 9.5 1 12l5.5 2.5L9 20l2.5-5.5L17 12l-5.5-2.5zM19 15l-1.25 2.75L15 19l2.75 1.25L19 23l1.25-2.75L23 19l-2.75-1.25L19 15z',
    bulb: 'M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7zm2.85 11.1l-.85.6V16h-4v-2.3l-.85-.6A4.997 4.997 0 0 1 7 9c0-2.76 2.24-5 5-5s5 2.24 5 5c0 1.63-.8 3.16-2.15 4.1z',
    mosque: 'M12 2.5c-1.6 2.2-4 3.6-4 6.5h8c0-2.9-2.4-4.3-4-6.5zM4 11h16v10h-4.5v-3.5a3.5 3.5 0 0 0-7 0V21H4V11z',
    heart: 'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z',
    menu: 'M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z',
    trash: 'M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z'
  };
  const icon = n => `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${ICONS[n]}"/></svg>`;
  // Ikon garis untuk kartu kepala surah (hanya ikon, tanpa teks)
  const HI = {
    play: '<polygon points="6 4 20 12 6 20 6 4"/>',
    palette: '<circle cx="13.5" cy="6.5" r=".6"/><circle cx="17.5" cy="10.5" r=".6"/><circle cx="8.5" cy="7.5" r=".6"/><circle cx="6.5" cy="12.5" r=".6"/><path d="M12 22a1 1 0 0 1 0-20 10 9 0 0 1 10 9 5 5 0 0 1-5 5h-2.25a1.75 1.75 0 0 0-1.4 2.8l.3.4a1.75 1.75 0 0 1-1.4 2.8z"/>',
    video: '<path d="m16 13 5.2 3.5a.5.5 0 0 0 .8-.4V7.9a.5.5 0 0 0-.75-.43L16 10.5"/><rect x="2" y="6" width="14" height="12" rx="2"/>',
    target: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
    download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>',
    saved: '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>',
    history: '<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/>',
    compass: '<circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>',
    cap: '<path d="M22 10 12 5 2 10l10 5 10-5z"/><path d="M6 12v5c3 2 9 2 12 0v-5"/>',
    sliders: '<line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/><circle cx="9" cy="6" r="2.2" fill="var(--surface)"/><circle cx="15" cy="12" r="2.2" fill="var(--surface)"/><circle cx="8" cy="18" r="2.2" fill="var(--surface)"/>',
    type: '<polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/>',
    info: '<circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>',
    mic: '<path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/>'
  };
  const hi = n => `<svg viewBox="0 0 24 24" aria-hidden="true">${HI[n]}</svg>`;
  const hydrateIcons = (root = document) => $$('[data-icon]', root).forEach(e => { e.innerHTML = icon(e.dataset.icon); });

  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* penyimpanan penuh / diblokir */ } }
  };

  const settings = Object.assign({
    theme: 'auto', arab: 36, mushaf: 'bawaan', tajwid: true, latin: true, trans: true, hafalan: false, wbw: false,
    qari: '05', speed: 1, repeat: 1, autoNext: true, sv: 2
  }, (() => {
    const saved = store.get('settings', {});
    /* sv 2: arti per kata kini tersembunyi secara bawaan; pengguna lama yang tersimpan wbw=true ikut dirapikan sekali saja */
    if (saved.sv !== 2) { saved.wbw = false; saved.sv = 2; }
    return saved;
  })());
  const saveSettings = () => store.set('settings', settings);

  let toastTimer;
  function toast(msg) {
    const t = $('#toast'); t.textContent = msg; t.hidden = false;
    clearTimeout(toastTimer); toastTimer = setTimeout(() => { t.hidden = true; }, 2800);
  }

  /* Cadangan offline: bila jaringan gagal, data lokal (s/, tajwid/, data/, ...) dibaca langsung dari cache aplikasi,
     sehingga tetap terbuka walau service worker belum aktif atau gagal menyajikan berkas. */
  async function cachedJSON(url) {
    if (!('caches' in window) || /^[a-z]+:/i.test(url)) return null;
    try {
      for (const name of ['quran-data-v1', ...(await caches.keys()).filter(k => k.startsWith('quran-shell-'))]) {
        const hit = await (await caches.open(name)).match(url, { ignoreSearch: true });
        if (hit) return await hit.json();
      }
    } catch { /* abaikan */ }
    return null;
  }
  async function fetchJSON(url) {
    let r;
    try { r = await fetch(url); }
    catch (e) { const c = await cachedJSON(url); if (c) return c; throw e; }
    if (!r.ok) { const c = await cachedJSON(url); if (c) return c; throw new Error('HTTP ' + r.status); }
    return r.json();
  }

  /* ---------- data ---------- */
  let surahsCache = null;
  async function getSurahs() {
    if (surahsCache) return surahsCache;
    try {
      surahsCache = await fetchJSON('data/surahs.json');
      if (Array.isArray(surahsCache) && surahsCache.length === 114) store.set('surahsList', surahsCache);
    } catch (e) {
      const saved = store.get('surahsList', null);   // cadangan terakhir bila cache peramban kosong
      if (!saved || saved.length !== 114) throw e;
      surahsCache = saved;
    }
    return surahsCache;
  }
  const surahName = n => (surahsCache && surahsCache[n - 1] ? surahsCache[n - 1].la : 'Surah ' + n);

  const surahMem = new Map();
  const pad3 = n => String(n).padStart(3, '0');
  async function getSurah(n) {
    if (surahMem.has(n)) return surahMem.get(n);
    const [list, j] = await Promise.all([getSurahs(), fetchJSON(`s/${n}.json`)]);
    const m = list[n - 1], pv = list[n - 2], nx = list[n];
    const gbase = list.slice(0, n - 1).reduce((t, x) => t + x.count, 0);
    const data = {
      nomor: n, nama: m.ar, namaLatin: m.la, arti: m.mean, tempatTurun: m.place, jumlahAyat: m.count, deskripsi: '',
      suratSebelumnya: pv ? { nomor: pv.n, namaLatin: pv.la } : null,
      suratSelanjutnya: nx ? { nomor: nx.n, namaLatin: nx.la } : null,
      ayat: j.ayat.map(e => ({
        sn: n, nomorAyat: e.a, teksArab: e.ar, teksLatin: e.la, teksIndonesia: e.id, m: e.m, m2: e.m2, w: e.w,
        audio: { '05': `https://verses.quran.foundation/Alafasy/mp3/${pad3(n)}${pad3(e.a)}.mp3`, alts: [`https://everyayah.com/data/Alafasy_128kbps/${pad3(n)}${pad3(e.a)}.mp3`, `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${gbase + e.a}.mp3`] }
      }))
    };
    surahMem.set(n, data);
    return data;
  }

  let riwayatCache = null;
  async function getRiwayat(n) {
    try { if (!riwayatCache) riwayatCache = await fetchJSON('data/riwayat.json'); return riwayatCache[n] || null; } catch { return null; }
  }

  const tafsirMem = new Map();
  async function getTafsir(n) {
    if (tafsirMem.has(n)) return tafsirMem.get(n);
    const j = await fetchJSON(`tafsir/${n}.json`);
    tafsirMem.set(n, j);
    return j;
  }

  let searchIdx = null;
  async function getSearchIndex() {
    if (searchIdx) return searchIdx;
    const j = await fetchJSON('data/search.json');
    const nl = t => String(t).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f'\u2018\u2019()\-\s,.]/g, '');
    j.forEach(r => { r.push(r[2].toLowerCase(), nl(r[3])); });
    searchIdx = j; searchIdx.nl = nl;
    return j;
  }

  /* Tajwid */
  const TJ_RE = /\[([a-z])(?::\d+)?\[([^\]]*)\]/g;
  const DIAC = /[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06ED\u0640]/g;
  const plainAr = t => t.replace(TJ_RE, '$2').replace(DIAC, '');
  function stripBasmalah(raw, n, num) {
    if (n === 1 || n === 9 || num !== 1) return raw;
    if (!plainAr(raw).startsWith('بسم')) return raw;
    return raw.trim().split(/\s+/).slice(4).join(' ');
  }
  function cloudHtml(n, a) {
    const raw = stripBasmalah(String(a.text), n, a.numberInSurah);
    return esc(raw)
      .replace(/\[([a-z])(?::\d+)?\[([^\]]*)\]/g, (m, c, t) => `<span class="tj tj-${c}" data-r="${c}">${t}</span>`)
      .replace(/[\[\]]/g, '');
  }
  /* quran.com: <tajweed class=ham_wasl ...>ٱ</tajweed> */
  const QCOM_MAP = {
    ham_wasl: 'h', slnt: 's', laam_shamsiyah: 'l', madda_normal: 'n', madda_permissible: 'p',
    madda_necessary: 'm', madda_obligatory: 'o', qalqalah: 'q', ikhfa_shafawi: 'c', ikhfa: 'f',
    idgham_shafawi: 'w', iqlab: 'i', idgham_ghunnah: 'a', idgham_wo_ghunnah: 'u',
    idgham_mutajanisayn: 'd', idgham_mutaqaribayn: 'b', ghunnah: 'g'
  };
  function qcomHtml(raw) {
    let t = String(raw).replace(/<span[^>]*class=["']?end["']?[^>]*>[\s\S]*?<\/span>/gi, '');
    t = t.replace(/<tajweed\b([^>]*)>([\s\S]*?)<\/tajweed>/gi, (m, attrs, inner) => {
      const cm = attrs.match(/(?:^|\s)class=["']?([a-z_]+)/i);
      const code = cm && QCOM_MAP[cm[1].toLowerCase()];
      const txt = inner.replace(/<[^>]*>/g, '');
      return code ? '\u0001' + code + '\u0002' + txt + '\u0003' : txt;
    });
    t = t.replace(/<[^>]*>/g, '').replace(/[\s٠-٩۰-۹]+$/, '').trim();
    return esc(t).replace(/\u0001([a-z])\u0002([^\u0003]*)\u0003/g, (m, c, x) => `<span class="tj tj-${c}" data-r="${c}">${x}</span>`);
  }
  /* Sumber utama: data tajwid yang ikut dibundel di repo (tajwid/N.json), satu origin, tanpa API pihak ketiga */
  function segsHtml(items) {
    return items.map(it => typeof it === 'string'
      ? esc(it)
      : `<span class="tj tj-${esc(it[1])}" data-r="${esc(it[1])}">${esc(it[0])}</span>`).join('');
  }
  /* ---------- gaya mushaf ----------
     bawaan : teks Madinah + font Amiri Quran (tampilan lama)
     intl   : teks Madinah (KFGQPC Hafs, jazm ۡ) dengan font Uthmanic Hafs
     kemenag: teks Mushaf Standar Indonesia (Kemenag) dengan font LPMQ Isep Misbah; warna tajwid dipetakan ke teks ini (tajwid-k/) */
  const MUSHAF_NOTE = {
    bawaan: 'Teks gaya Madinah dengan font Amiri Quran (tampilan bawaan).',
    intl: 'Mushaf Madinah (King Fahd Complex, riwayat Hafs): standar yang dipakai di Arab Saudi dan banyak negara.',
    kemenag: 'Mushaf Standar Indonesia (Lajnah Pentashihan Mushaf Al-Qur’an, Kemenag RI): tanda baca, mad, dan tanda waqaf gaya Indonesia.'
  };
  const mushafKey = () => (MUSHAF_NOTE[settings.mushaf] ? settings.mushaf : 'bawaan');
  const BASM_U = 'بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ', BASM_K = 'بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ';
  const jazm = t => t.replace(/\u0652/g, '\u06E1');
  const bismillahText = () => { const m = mushafKey(); return m === 'kemenag' ? BASM_K : m === 'intl' ? jazm(BASM_U) : BASM_U; };
  const mapItems = (items, mode) => mode === 'intl' ? items.map(it => typeof it === 'string' ? jazm(it) : [jazm(it[0]), it[1]]) : items;
  const tjWords = new Map();
  async function fetchTajwidLocal(n, mode = mushafKey()) {
    const j = await fetchJSON(`${mode === 'kemenag' ? 'tajwid-k' : 'tajwid'}/${n}.json`);
    const out = {};
    Object.keys(j).forEach(k => { const it = mapItems(j[k], mode); out[k] = segsHtml(it); tjWords.set(mode + ':' + n + ':' + k, KATA.wordsFromItems(it, esc)); });
    return out;
  }
  async function fetchTajwidCloud(n) {
    const j = await fetchJSON(`${CLOUD}/surah/${n}/quran-tajweed`);
    const out = {};
    j.data.ayahs.forEach(a => { out[a.numberInSurah] = cloudHtml(n, a); });
    return out;
  }
  async function fetchTajwidQcom(n) {
    const j = await fetchJSON(`${QCOM}/quran/verses/uthmani_tajweed?chapter_number=${n}`);
    const out = {};
    (j.verses || []).forEach(v => {
      const num = parseInt(String(v.verse_key).split(':')[1], 10);
      if (num) out[num] = qcomHtml(v.text_uthmani_tajweed);
    });
    return out;
  }
  const tajwidMem = new Map();
  /* Mengembalikan { nomorAyat: html }. Urutan: data lokal, alquran.cloud, quran.com. */
  async function getTajwid(n, mode = mushafKey()) {
    const key = (mode === 'kemenag' ? 'k:' : mode === 'intl' ? 'i:' : 'b:') + n;
    if (tajwidMem.has(key)) return tajwidMem.get(key);
    const errs = [];
    /* teks Kemenag hanya punya data lokal; sumber online berisi teks Madinah */
    const sources = mode === 'kemenag' ? [['data lokal', m => fetchTajwidLocal(n, m)]]
      : [['data lokal', m => fetchTajwidLocal(n, m)], ['alquran.cloud', () => fetchTajwidCloud(n)], ['quran.com', () => fetchTajwidQcom(n)]];
    for (const [name, f] of sources) {
      try {
        const r = await f(mode);
        if (r && Object.values(r).some(h => h.includes('class="tj'))) { tajwidMem.set(key, r); return r; }
        errs.push(name + ': data tajwid kosong');
      } catch (e) { errs.push(name + ': ' + (e && e.message ? e.message : 'gagal')); }
    }
    throw new Error(errs.join('; '));
  }

  /* Penanda & terakhir dibaca */
  const getBookmarks = () => store.get('bookmarks', []);
  const isBookmarked = (s, a) => getBookmarks().some(b => b.s === s && b.a === a);
  function toggleBookmark(s, a) {
    let list = getBookmarks();
    if (isBookmarked(s, a)) { list = list.filter(b => !(b.s === s && b.a === a)); toast('Penanda dihapus'); }
    else { list.unshift({ s, a, t: Date.now() }); toast('Ayat ditandai'); }
    store.set('bookmarks', list);
    return isBookmarked(s, a);
  }

  /* ---------- tampilan & routing ---------- */
  const view = $('#view');
  let renderId = 0;
  let current = null; // { n, data, tj }

  function setTitle(text, showBack) {
    $('#appTitle').innerHTML = `<img class="app-logo" src="icons/icon-192.png" alt="" width="30" height="30"><span>${esc(text)}</span>`;
    $('#btnBack').hidden = !showBack;
    document.title = text === "Al-Quran" ? text : text + " · Al-Quran";
  }
  const loadingHTML = '<div class="loading"><div class="spinner"></div>Memuat…</div>';
  function errorHTML(msg) {
    if (!navigator.onLine) return `<div class="card error"><p><b>Kamu sedang offline.</b></p>
      <p class="muted">Halaman ini belum diunduh untuk dipakai tanpa internet.</p>
      <p class="muted small">Surah yang sudah diunduh tetap bisa dibuka dari beranda atau halaman Unduhan offline.</p>
      <div class="btn-row" style="justify-content:center"><a class="btn primary" href="#/">Surah offline</a><a class="btn" href="#/offline">Unduhan offline</a><button class="btn" id="retry">Coba lagi</button></div></div>`;
    return `<div class="card error"><p><b>Gagal memuat data.</b></p><p class="muted">${esc(msg)}</p>
      <p class="muted small">Periksa koneksi internet. Surah yang sudah diunduh akan tersedia offline.</p>
      <div class="btn-row" style="justify-content:center"><button class="btn primary" id="retry">Coba lagi</button><a class="btn" href="#/offline">Unduhan offline</a></div></div>`;
  }

  const OFF = window.makeOfflineKit({ $, $$, esc, view, setTitle, toast, getSurahs, getMushaf: () => mushafKey(),
    askSW: (t, u) => askSW(t, u), coreFiles: () => coreFiles(), tafsirFiles: () => tafsirFiles() });
  const AnalisisView = window.makeAnalisisView({ $, esc, view, getSurahs, getSurah, setTitle, toast, surahName });

  const KiblatView = window.makeKiblatView({ $, esc, view, setTitle, toast, store });
  const MakharijView = window.makeMakharijView({ $, esc, view, setTitle });
  const HafalanView = window.makeHafalanView({ $, esc, view, setTitle });
  const SholatView = window.makeSholatView({ $, esc, view, setTitle, toast, store });

  const VideoView = window.makeTajwidVideoView({ $, esc, view, getSurahs, setTitle, qari: {
    options: () => Object.keys(QARI_NAMES).map(k => [k, QARI_NAMES[k], k === '05']),
    get: () => String(settings.qari || '05'),
    set: v => { settings.qari = v; saveSettings(); const el = $('#setQari'); if (el) el.value = v; syncQariSelects(); },
    surahAudio: async n => (await fetchJSON(`${EQURAN}/surat/${n}`)).data.ayat.map(x => x.audio || {})
  } });

  const SedekahView = window.makeSedekahView({ $, esc, view, setTitle, toast });
  const HadithView = window.makeHadithView({ $, esc, view, setTitle, toast, store });
  const SunnahView = window.makeSunnahView({ $, esc, view, setTitle, toast, store });
  const SirahView = window.makeSirahView({ $, esc, view, setTitle, toast, store });
  const PustakaView = window.makePustakaView({ $, esc, view, setTitle, toast, store });
  const SejarahView = window.makeSejarahView({ $, esc, view, setTitle, toast, store });
  const NabiView = window.makeNabiView({ $, esc, view, setTitle, toast, store, surahName, getSurahs });
  const SahabatView = window.makeSahabatView({ $, esc, view, setTitle, toast, store });
  const HajiView = window.makeHajiView({ $, esc, view, setTitle, toast, store });
  const AlamView = window.makeAlamView({ $, esc, view, setTitle, toast, store });


  /* ---------- menu hamburger ---------- */
  const MENU = [
    { group: 'Ibadah', items: [
      { href: '#/sholat', emo: '🕌', t: 'Tuntunan sholat', d: 'wudhu, sholat wajib & sunnah, bacaan, doa, dan jadwal sholat', k: 'sholat salat shalat wudhu doa jadwal waktu adzan bacaan niat' },
      { href: '#/sunnah', emo: '🌿', t: 'As-Sunnah', d: 'amalan sunnah harian, kalender Hijriah, dan dalilnya', k: 'sunnah amalan harian hijriah kalender puasa dzikir' },
      { href: '#/haji', emo: '🕋', t: 'Haji & Umrah', d: 'tata cara, cara berpakaian ihram (bergambar), larangan, doa, dan daftar persiapan', k: 'haji umrah umroh ihram thawaf sai arafah manasik pakaian miqat talbiyah' },
      { href: '#/kiblat', emo: '🧭', t: 'Kompas kiblat', d: 'arah kiblat dari lokasimu, kompas hidup memakai sensor HP', k: 'kiblat kompas arah mekkah ka\'bah' }
    ] },
    { group: 'Tadabbur Alam', items: [
      { href: '#/alam', emo: '🌏', t: 'Peta Tadabbur Alam', d: 'cuaca, gempa, sesar & subduksi, tsunami, gunung api, karhutla, dan El Niño, masing-masing terhubung ke ayat Al-Qur\'an', k: 'alam cuaca gempa bumi tsunami gunung api merapi karhutla kebakaran hutan el nino elnino sesar subduksi bencana peta tadabbur zalzalah musibah' },
      { href: '#/alam/elnino', emo: '🌡️', t: 'El Niño & kekeringan', d: 'peta anomali suhu laut dan kisah paceklik Nabi Yusuf', k: 'el nino la nina kekeringan kemarau yusuf paceklik' }
    ] },
    { group: 'Ilmu', items: [
      { href: '#/hadis', emo: '📜', t: 'Hadis', d: 'Bukhari, Muslim, Abu Dawud, Tirmidzi, lengkap dengan derajat', k: 'hadis hadits bukhari muslim abu dawud tirmidzi shahih derajat' },
      { href: '#/sirah', emo: '🕋', t: 'Sirah Nabawiyah', d: 'perjalanan hidup Nabi ﷺ dari lahir hingga wafat, linimasa, dalil, dan kuis', k: 'sirah sejarah nabi muhammad rasul linimasa' },
      { href: '#/sejarah', emo: '🏝️', t: 'Sejarah Islam Indonesia', d: 'linimasa dari masuknya Islam, kesultanan, Walisongo, perlawanan, ormas, kemerdekaan, hingga masa kini, plus teori dan kuis', k: 'sejarah islam indonesia nusantara walisongo kesultanan pasai demak aceh nu muhammadiyah kemerdekaan masuknya islam' },
      { href: '#/pustaka', emo: '📚', t: 'Perpustakaan Islam', d: 'baca langsung buku Islam berbahasa Indonesia (preview di aplikasi), plus katalog kitab sirah, kisah nabi, hadis, tafsir, dan akhlak', k: 'perpustakaan buku kitab pustaka download unduh sirah nabi tafsir hadis terjemahan' },
      { href: '#/nabi', emo: '🌙', t: 'Kisah nabi & malaikat', d: '25 nabi dan rasul lengkap dengan linimasa, 10 malaikat beserta tugasnya, dan kuis', k: 'nabi rasul 25 adam nuh ibrahim musa isa yusuf daud sulaiman ulul azmi malaikat jibril mikail israfil izrail munkar nakir raqib atid malik ridwan kisah anbiya' },
      { href: '#/sahabat', emo: '👥', t: 'Sahabat Nabi ﷺ', d: 'linimasa 35 sahabat dan 75 peristiwa, profil, rentang hidup, dan kuis', k: 'sahabat nabi abu bakar umar utsman ali khulafaur rasyidin bilal khalid aisyah khadijah thalhah zubair linimasa sejarah' }
    ] },
    { group: 'Belajar Al-Qur\'an', items: [
      { href: '#/video', emo: '🎬', t: 'Video tajwid', d: 'teks menyala mengikuti bacaan + animasi hukum, 114 surah', k: 'video tajwid murottal animasi' },
      { href: '#/hafalan', emo: '🧠', t: 'Hafalan cerdas', d: 'jadwal ulang hafalan otomatis (SM-2) dengan uji rumpang adaptif, offline', k: 'hafalan menghafal tahfidz muraja\'ah ulang rumpang spaced repetition ingatan' },
      { href: '#/makharij', emo: '👄', t: 'Makharijul huruf', d: 'gambar letak keluarnya huruf hijaiyah di mulut, lidah, tenggorokan, bibir & hidung, bergerak + kuis', k: 'makhraj makharij huruf hijaiyah tenggorokan lidah bibir mulut pengucapan halq lisan syafatain khaisyum jauf' },
      { href: '#/analisis', emo: '🔍', t: 'Analisis tajwid', d: 'hukum, sebab, dan cara baca tiap ayat; bisa tempel ayat sendiri', k: 'analisis tajwid hukum bacaan idgham ikhfa mad' },
      { href: '#/quiz', emo: '🎯', t: 'Latihan kosakata', d: 'kuis arti kata dari kata yang kamu simpan', k: 'latihan kosakata kuis kata arti hafalan' }
    ] },
    { group: 'Lainnya', items: [
      { href: '#/offline', emo: '📥', t: 'Unduhan offline', d: 'surah, tafsir, dan audio yang tersimpan untuk dibaca tanpa internet', k: 'offline unduh download pesawat tanpa internet audio tafsir simpan' },
      { href: '#/bookmarks', emo: '🔖', t: 'Penanda', d: 'ayat yang kamu simpan', k: 'penanda bookmark simpan favorit' },
      { href: '#/sedekah', noDrawer: true, emo: '💚', t: 'Sedekah', d: 'dukung pengembangan aplikasi (QRIS)', k: 'sedekah donasi qris infaq' }
    ] }
  ];
  const MENU_FLAT = MENU.flatMap(g => g.items);

  const drawer = $('#drawer'), scrim = $('#drawerScrim'), btnMenu = $('#btnMenu');
  function drawerActive() {
    const cur = '#/' + (location.hash.slice(2).split(/[/?]/)[0] || '');
    $$('#drawerNav a').forEach(a => a.classList.toggle('on', a.getAttribute('href') === cur));
  }
  $('#drawerNav').innerHTML = MENU.map(g => `<p class="dr-group">${esc(g.group)}</p>` + g.items.filter(m => !m.noDrawer).map(m =>
    `<a class="dr-item" href="${m.href}"><span class="dr-emo" aria-hidden="true">${m.emo}</span><span class="dr-txt"><b>${esc(m.t)}</b><small>${esc(m.d)}</small></span></a>`).join('')).join('') +
    `<button type="button" class="dr-item" id="drawerSettings"><span class="dr-emo" aria-hidden="true">⚙️</span><span class="dr-txt"><b>Pengaturan</b><small>tema, huruf, qari, offline</small></span></button>`;
  function setDrawer(open) {
    drawer.classList.toggle('open', open);
    scrim.hidden = !open;
    drawer.setAttribute('aria-hidden', String(!open));
    drawer.inert = !open;
    btnMenu.setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('drawer-open', open);
    if (open) { drawerActive(); $('#drawerClose').focus(); } else if (document.activeElement && drawer.contains(document.activeElement)) btnMenu.focus();
  }
  btnMenu.addEventListener('click', () => setDrawer(!drawer.classList.contains('open')));
  $('#drawerClose').addEventListener('click', () => setDrawer(false));
  scrim.addEventListener('click', () => setDrawer(false));
  $('#drawerNav').addEventListener('click', e => { if (e.target.closest('a')) setDrawer(false); });
  $('#drawerSettings').addEventListener('click', () => { setDrawer(false); $('#settings').showModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && drawer.classList.contains('open')) setDrawer(false); });
  window.addEventListener('hashchange', () => setDrawer(false));

  /* ---------- pencarian gabungan ---------- */
  const SUGGEST = ['2:255', 'sabar', 'Yasin', 'sholat', 'kiblat', 'doa', 'الرحمن'];
  const getRecent = () => store.get('recentSearch', []);
  function pushRecent(t) {
    t = t.trim(); if (t.length < 2) return;
    store.set('recentSearch', [t, ...getRecent().filter(x => x.toLowerCase() !== t.toLowerCase())].slice(0, 6));
  }
  /* Satu kotak untuk: fitur, surah, lompat ke ayat (2:255), kosakata, dan isi terjemahan. */
  function mountSearch(host, { surahs, id, idleHtml, onIdle, autofocus, dock }) {
    host.innerHTML = `<div class="searchbox"><div class="sb-wrap"><span class="sb-ico" data-icon="search"></span>
        <input id="q" type="search" enterkeyhint="search" placeholder="Cari surah, ayat, kata…" autocomplete="off" aria-label="Cari surah, ayat, kata, atau fitur">
        <button type="button" class="sb-clear icon-btn" id="qClear" aria-label="Hapus" hidden><span data-icon="close"></span></button>
        <span class="sb-tools">
          <button type="button" class="sb-tool" id="sbHintBtn" aria-label="Contoh pencarian" title="Coba cari" aria-haspopup="true" aria-expanded="false"><span data-icon="spark"></span></button>
          ${dock ? '<button type="button" class="sb-tool" id="sbOffBtn" aria-haspopup="true" aria-expanded="false" aria-label="Unduhan" title="Unduhan"></button>' : ''}
        </span></div>
        <div class="sb-chips" id="qChips" hidden></div>
        <div class="sb-pop" id="sbHintPop" hidden></div>
        ${dock ? '<div class="sb-pop" id="sbOffPop" hidden></div>' : ''}</div><div id="results"></div>`;
    hydrateIcons(host);
    const input = $('#q', host), box = $('#results', host), chips = $('#qChips', host), clr = $('#qClear', host);
    let timer, filter = 'all', seq = 0;
    const LABEL = { all: 'Semua', menu: 'Fitur', surah: 'Surah', ayat: 'Ayat', kata: 'Kosakata' };

    /* popover tombol ikon: satu yang terbuka sekali waktu */
    const pops = { hint: $('#sbHintPop', host), off: $('#sbOffPop', host) }, btns = { hint: $('#sbHintBtn', host), off: $('#sbOffBtn', host) };
    const closePops = () => Object.keys(pops).forEach(k => { if (pops[k]) { pops[k].hidden = true; btns[k].setAttribute('aria-expanded', 'false'); } });
    const fillHint = () => {
      const rec = getRecent();
      pops.hint.innerHTML = `${rec.length ? `<p class="mini-title">Terakhir <button type="button" class="linkish" id="recClear">hapus</button></p><div class="sb-sugg">${rec.map(r => `<button type="button" class="chip" data-q="${esc(r)}">${esc(r)}</button>`).join('')}</div>` : ''}
        <p class="mini-title">Coba cari</p><div class="sb-sugg">${SUGGEST.map(r => `<button type="button" class="chip" data-q="${esc(r)}">${esc(r)}</button>`).join('')}</div>
        <p class="muted small">Nama surah, nomor ayat seperti <b>2:255</b>, kata terjemahan, kata Arab tanpa harakat, atau fitur seperti <b>kiblat</b>. Isi ayat mulai 3 huruf.</p>`;
    };
    const togglePop = k => {
      if (!pops[k]) return;
      const was = !pops[k].hidden; closePops();
      if (was) return;
      if (k === 'hint') fillHint();
      pops[k].hidden = false; btns[k].setAttribute('aria-expanded', 'true');
    };
    btns.hint.addEventListener('click', () => togglePop('hint'));
    if (btns.off) btns.off.addEventListener('click', () => togglePop('off'));
    pops.hint.addEventListener('click', e => {
      const c = e.target.closest('[data-q]');
      if (c) { closePops(); input.value = c.dataset.q; input.dispatchEvent(new Event('input')); input.focus(); return; }
      if (e.target.id === 'recClear') { store.set('recentSearch', []); fillHint(); }
    });
    const onDoc = e => {
      if (!host.isConnected) { document.removeEventListener('click', onDoc); return; }
      if (!e.target.closest('.sb-pop, .sb-tool')) closePops();
    };
    document.addEventListener('click', onDoc);
    const onScroll = () => { if (!host.isConnected) { window.removeEventListener('scroll', onScroll); return; } closePops(); };
    window.addEventListener('scroll', onScroll, { passive: true });
    host.addEventListener('keydown', e => { if (e.key === 'Escape' && Object.values(pops).some(p => p && !p.hidden)) { closePops(); e.stopPropagation(); } });
    input.addEventListener('focus', closePops);

    const idle = () => {
      chips.hidden = true;
      if (btns.off) btns.off.hidden = false;
      box.innerHTML = idleHtml || '';
      if (onIdle) onIdle(box);
    };
    box.addEventListener('click', e => {
      const r = e.target.closest('a.result, a.jump, a.surah-link'); if (r) pushRecent(input.value);
    });
    chips.addEventListener('click', e => { const c = e.target.closest('[data-f]'); if (c) { filter = c.dataset.f; run(); } });

    const run = async () => {
      const text = input.value.trim(), my = ++seq;
      clr.hidden = !input.value; if (btns.off) btns.off.hidden = !!input.value; closePops();
      if (!text) { idle(); return; }
      const q = norm(text), lq = text.toLowerCase();
      const sections = {};
      // 1) lompat ke ayat
      const m = text.match(/^(\d{1,3})\s*[:.\s]\s*(\d{1,3})$/);
      if (m && +m[1] >= 1 && +m[1] <= 114) sections.jump = `<a class="card jump hit" href="#/surah/${+m[1]}?a=${+m[2]}"><b>Buka QS. ${esc(surahName(+m[1]))} ayat ${+m[2]}</b></a>`;
      // 2) fitur
      const nm = MENU_FLAT.filter(f => (f.t + ' ' + f.k + ' ' + f.d).toLowerCase().includes(lq) || (q && norm(f.t + f.k).includes(q)));
      if (nm.length) sections.menu = nm.map(f => `<a class="card jump feat" href="${f.href}"><span class="dr-emo">${f.emo}</span><span><b>${esc(f.t)}</b><br><span class="muted small">${esc(f.d)}</span></span></a>`);
      // 3) surah
      const ns = (m ? [] : surahs.filter(s => q && (norm(s.la).includes(q) || norm(s.mean).includes(q) || String(s.n) === q || s.ar.includes(text)))).slice(0, 20);
      if (ns.length) sections.surah = ns.map(s => `<a class="surah-link card jump" href="#/surah/${s.n}"><span class="badge">${s.n}</span><span class="s-main"><b>${esc(s.la)}</b><small>${esc(s.mean)} · ${esc(s.place)} · ${s.count} ayat</small></span><span class="s-ar">${esc(s.ar)}</span></a>`);
      // 4) kosakata + isi ayat (butuh >= 3 huruf)
      let words = [], matches = [];
      if (text.length >= 3 && !m) {
        try {
          const [idx, vocab] = await Promise.all([getSearchIndex(), KATA.loadVocab().catch(() => null)]);
          if (my !== seq || id !== renderId) return;
          const nq = idx.nl(text);
          matches = idx.filter(r => r[4].includes(lq) || (nq.length >= 3 && r[5].includes(nq)));
          if (vocab) {
            const ar = /[\u0621-\u064A\u0671-\u06D3]/.test(text), kq = KATA.norm(text);
            words = Object.entries(vocab).filter(([k, v]) => ar ? k.includes(kq) : v[1].some(x => x.toLowerCase().includes(lq)))
              .sort((a, b) => b[1][0] - a[1][0]).slice(0, 12);
          }
        } catch (e) { if (my === seq) box.innerHTML = `<p>Pencarian gagal: ${esc(e.message)}.</p>`; return; }
      }
      const re = new RegExp('(' + text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'ig');
      if (words.length) sections.kata = words.map(([k, v]) => {
        const [s, a] = v[2][0].split(':');
        return `<a class="card result" href="#/surah/${s}?a=${a}"><div class="meta" dir="ltr">muncul ${v[0].toLocaleString('id-ID')}× · contoh QS. ${esc(surahName(+s))}: ${a}</div>
          <div><span class="kw-ar" lang="ar">${esc(k)}</span> &nbsp; ${esc(v[1].join('; '))}</div></a>`;
      });
      if (matches.length) sections.ayat = matches.slice(0, 60).map(r => `<a class="card result" href="#/surah/${r[0]}?a=${r[1]}"><div class="meta">QS. ${esc(surahName(r[0]))} : ${r[1]}</div><div>${esc(r[2]).replace(re, '<mark>$1</mark>')}</div></a>`);

      const counts = { menu: (sections.menu || []).length, surah: (sections.surah || []).length, kata: (sections.kata || []).length, ayat: matches.length };
      const present = ['menu', 'surah', 'ayat', 'kata'].filter(k => counts[k]);
      if (!sections.jump && !present.length) {
        chips.hidden = true;
        box.innerHTML = `<p class="muted" style="padding:8px 2px">${text.length < 3 ? 'Ketik minimal 3 huruf untuk mencari isi ayat.' : `Tidak ada hasil untuk “${esc(text)}”. Coba kata lain atau tulis tanpa tanda baca.`}</p>`;
        return;
      }
      if (filter !== 'all' && !counts[filter]) filter = 'all';
      chips.hidden = present.length < 2;
      chips.innerHTML = ['all', ...present].map(k => `<button type="button" class="chip${filter === k ? ' on' : ''}" data-f="${k}">${LABEL[k]}${k !== 'all' ? ` <span class="cnt">${counts[k]}</span>` : ''}</button>`).join('');
      const show = k => filter === 'all' || filter === k;
      const head = (k, t) => filter === 'all' ? `<p class="sb-head">${t}</p>` : '';
      let out = sections.jump || '';
      if (sections.menu && show('menu')) out += head('menu', 'Fitur') + sections.menu.join('');
      if (sections.surah && show('surah')) out += head('surah', 'Surah') + sections.surah.join('');
      if (sections.kata && show('kata')) out += head('kata', 'Kosakata (arti per kata)') + sections.kata.join('');
      if (sections.ayat && show('ayat')) out += head('ayat', `Ayat · ${matches.length}${matches.length > 60 ? ' (60 teratas)' : ''}`) + sections.ayat.join('');
      box.innerHTML = out;
    };
    input.addEventListener('input', () => { clearTimeout(timer); timer = setTimeout(run, 250); clr.hidden = !input.value; });
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter') { clearTimeout(timer); pushRecent(input.value); const first = box.querySelector('a'); if (first && input.value.trim()) { run().then(() => { const f = box.querySelector('a'); if (f) f.click(); }); } }
      if (e.key === 'Escape' && input.value) { input.value = ''; run(); }
    });
    clr.addEventListener('click', () => { input.value = ''; run(); input.focus(); });
    return { input, run, setValue(v) { input.value = v; }, focus() { input.focus(); }, idle, closePops, openHint() { togglePop('hint'); } };
  }

  function route() {
    const h = location.hash.slice(1) || '/';
    const [path, qs] = h.split('?');
    const q = new URLSearchParams(qs || '');
    const parts = path.split('/').filter(Boolean);
    window.scrollTo(0, 0);
    if (parts[0] === 'surah') return SurahView(parseInt(parts[1], 10), parseInt(q.get('a'), 10) || 0);
    if (parts[0] === 'search') return SearchView(q.get('q') || '');
    if (parts[0] === 'bookmarks') return BookmarksView();
    if (parts[0] === 'offline' || parts[0] === 'unduhan') { renderId++; current = null; return OFF.OfflineView(); }
    if (parts[0] === 'quiz') return QuizView(parseInt(parts[1], 10) || 0);
    if (parts[0] === 'video') { renderId++; current = null; return VideoView(parseInt(parts[1], 10) || 0, parseInt(q.get('a'), 10) || 1); }
    if (parts[0] === 'sunnah') { renderId++; current = null; return SunnahView(parts[1] || 'hari', q); }
    if (parts[0] === 'pustaka' || parts[0] === 'perpustakaan') { renderId++; current = null; return PustakaView(q); }
    if (parts[0] === 'sejarah') { renderId++; current = null; return SejarahView(parts[1] || 'linimasa', q); }
    if (parts[0] === 'sirah') { renderId++; current = null; return SirahView(parts[1] || 'linimasa', q); }
    if (parts[0] === 'nabi' || parts[0] === 'malaikat') { renderId++; current = null; return NabiView(parts[0] === 'malaikat' ? 'malaikat' : (parts[1] || 'linimasa'), q); }
    if (parts[0] === 'sahabat') { renderId++; current = null; return SahabatView(parts[1] || 'linimasa', q); }
    if (parts[0] === 'haji' || parts[0] === 'umrah' || parts[0] === 'umroh') { renderId++; current = null; return HajiView(parts[0] === 'haji' ? (parts[1] || 'ringkas') : 'umrah'); }
    if (parts[0] === 'sedekah') { renderId++; current = null; return SedekahView(); }
    if (parts[0] === 'hadis') { renderId++; current = null; return HadithView(parts[1] || 'pilihan', q); }
    if (parts[0] === 'sholat') { renderId++; current = null; return SholatView(parts[1] || 'jadwal'); }
    if (parts[0] === 'makharij' || parts[0] === 'makhraj') { renderId++; current = null; return MakharijView(); }
    if (parts[0] === 'hafalan') { renderId++; current = null; return HafalanView(); }
    if (parts[0] === 'kiblat') { renderId++; current = null; return KiblatView(); }
    if (parts[0] === 'alam') { renderId++; current = null; return AlamView(parts[1] || 'ringkas'); }
    if (parts[0] === 'analisis') return AnalisisView(parseInt(parts[1], 10) || 1, parseInt(q.get('a'), 10) || 1);
    return HomeView();
  }

  /* ----- Beranda ----- */
  async function HomeView() {
    const id = ++renderId; current = null;
    setTitle("Al-Quran", false);
    view.innerHTML = loadingHTML;
    let surahs;
    try { surahs = await getSurahs(); } catch (e) {
      view.innerHTML = errorHTML(e.message); $('#retry').onclick = HomeView; return;
    }
    if (id !== renderId) return;

    const last = store.get('lastRead', null);
    const resume = last ? `<a class="card resume" href="#/surah/${last.s}?a=${last.a}">
        <p class="mini-title">Lanjutkan membaca</p>
        <strong>${esc(surahName(last.s))}</strong> <span class="muted">· ayat ${last.a}</span></a>` : `<div class="card">
        <p class="mini-title">Mulai membaca</p><strong>Buka Al-Fatihah</strong>
        <p class="muted small" style="margin:4px 0 0"><a href="#/surah/1" style="text-decoration:underline">Mulai dari awal</a></p></div>`;

    view.innerHTML = `
      <section class="hero"><img class="hero-logo" src="icons/icon-192.png" alt="" width="56" height="56"><h1>Al-Quran</h1>
        <p>Teks Arab berwarna tajwid, terjemahan Indonesia, tafsir, dan murottal per ayat.</p></section>
      <div id="searchHost"></div>`;
    const cardsHtml = `<div class="cards-2" style="margin-top:6px">${resume}
        <div class="card daily" id="daily"><p class="mini-title">Ayat hari ini</p><span class="muted">Memuat…</span></div></div>`;

    const listHtml = () => '<div id="surahListHost"></div>';
    let sb;
    sb = mountSearch($('#searchHost'), { surahs, id, idleHtml: '', dock: true, onIdle: box => { box.insertAdjacentHTML('beforeend', navigator.onLine ? cardsHtml + listHtml() : listHtml() + cardsHtml);  /* offline: daftar surah tersimpan tampil paling atas */ loadDaily(id); OFF.mountHome({ list: $('#surahListHost'), btn: $('#sbOffBtn'), pop: $('#sbOffPop'), close: () => sb.closePops() }, surahs); } });
    sb.idle();
  }
  async function loadDaily(id) {
    const box = $('#daily'); if (!box) return;
    try {
      const now = new Date();
      const day = Math.floor((Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) - Date.UTC(now.getFullYear(), 0, 0)) / 864e5);
      const num = ((day * 37 + now.getFullYear()) % 6236) + 1;
      const key = 'daily.' + now.toDateString();
      let d = store.get(key, null);
      if (!d) {
        const row = (await getSearchIndex())[num - 1];
        const sd = await getSurah(row[0]);
        d = { s: row[0], a: row[1], ar: sd.ayat[row[1] - 1].teksArab, tr: row[2] };
        store.set(key, d);
      }
      if (id !== renderId || !$('#daily')) return;
      box.innerHTML = `<p class="mini-title">Ayat hari ini</p>
        <p class="ar">${esc(d.ar)}</p><p class="tr">${esc(d.tr)}</p>
        <a href="#/surah/${d.s}?a=${d.a}" class="muted small" style="text-decoration:underline">QS. ${esc(surahName(d.s))}: ${d.a}</a>`;
    } catch {
      if ($('#daily')) box.innerHTML = '<p class="mini-title">Ayat hari ini</p><span class="muted small">Belum bisa dimuat (offline?).</span>';
    }
  }

  /* ----- Halaman surah ----- */
  async function SurahView(n, targetAyah) {
    if (!(n >= 1 && n <= 114)) { location.hash = '#/'; return; }
    const id = ++renderId;
    setTitle(surahName(n), true);
    view.innerHTML = loadingHTML;
    let data, tj = null, tjErr = null;
    try {
      await getSurahs().catch(() => null);
      const tjP = getTajwid(n).then(v => ({ v }), e => ({ e }));
      data = await getSurah(n);
      const r = await tjP; tj = r.v || null; tjErr = r.e || null;
    } catch (e) {
      if (id !== renderId) return;
      view.innerHTML = errorHTML(e.message); $('#retry').onclick = () => SurahView(n, targetAyah); return;
    }
    if (id !== renderId) return;

    current = { n, data, tj };
    setTitle(data.namaLatin, true);
    fillQariOptions(data);
    const rw = await getRiwayat(n);
    if (id !== renderId) return;
    const desc = new DOMParser().parseFromString(data.deskripsi || '', 'text/html').body.textContent.trim();

    const ib = (cls, attrs, ic, label) => `${attrs.startsWith('href') ? `<a class="sh-b ${cls}" ${attrs}` : `<button type="button" class="sh-b ${cls}" ${attrs}`} title="${label}" aria-label="${label}">${hi(ic)}${attrs.startsWith('href') ? '</a>' : '</button>'}`;
    const panels = [];
    if (rw) panels.push(['riwayat', 'history', 'Riwayat surah', `<p><b>Urutan turun ke-${rw.o}</b> dari 114 surah · urutan mushaf ke-${n} · ${esc(data.tempatTurun)}\n${esc(rw.t)}${rw.n ? `\nNama lain: ${esc(rw.n)}` : ''}${rw.k ? `\nKeutamaan: ${esc(rw.k)}` : ''}</p>`]);
    if (rw && rw.g) panels.push(['tema', 'compass', 'Tema per kelompok ayat', `<ul class="tema">${rw.g.map(x => `<li><b>${esc(x[0])}</b> ${esc(x[1])}</li>`).join('')}</ul>`]);
    if (desc) panels.push(['tentang', 'info', 'Tentang surah ini', `<p>${esc(desc)}</p>`]);
    const head = `<section class="card surah-head">
        <div class="sh-title"><span class="ar">${esc(data.nama)}</span><h2>${esc(data.namaLatin)}</h2></div>
        <p class="sh-meta">${esc(data.arti)} · ${esc(data.tempatTurun)} · ${data.jumlahAyat} ayat</p>
        ${panels.map(p => `<div class="sh-panel" id="shp-${p[0]}" hidden><h3>${p[2]}</h3>${p[3]}</div>`).join('')}</section>`;
    const fi = (g, ic, label) => `<button type="button" class="sh-b" data-act="fl-tog" data-g="${g}" aria-expanded="false" aria-haspopup="true" title="${label}" aria-label="${label}">${hi(ic)}</button>`;
    const fit = (attrs, ic, label) => attrs.startsWith('href') ? `<a class="fl-it" ${attrs}>${hi(ic)}<span>${label}</span></a>` : `<button type="button" class="fl-it" ${attrs}>${hi(ic)}<span>${label}</span></button>`;
    const mushafOpts = Array.from(document.querySelectorAll('#setMushaf option')).map(o => `<option value="${o.value}"${o.value === mushafKey() ? ' selected' : ''}>${esc(o.textContent)}</option>`).join('');
    const qariOpts = Object.keys(QARI_NAMES).map(k => `<option value="${esc(k)}"${k === settings.qari ? ' selected' : ''}>${esc(QARI_NAMES[k])}${k === '05' ? ' (bisa diunduh offline)' : ' (online)'}</option>`).join('');
    const vbar = `<div class="fl-wrap" role="group" aria-label="Aksi surah dan tampilan ayat">
        <div class="fl-bar">
          ${ib('primary', 'data-act="play-all"', 'play', 'Putar surah')}
          ${ib('', 'data-act="dl-audio" id="dlAudio"', 'download', 'Audio offline')}
          ${fi('belajar', 'cap', 'Belajar')}
          ${panels.length ? fi('info', 'info', 'Info surah') : ''}
          ${fi('tampil', 'sliders', 'Tampilan')}
        </div>
        <div class="fl-pop" data-g="belajar" hidden>
          ${fit('data-act="legend"', 'palette', 'Panduan tajwid')}
          ${fit(`href="#/video/${n}"`, 'video', 'Video tajwid')}
          ${fit(`href="#/quiz/${n}"`, 'target', 'Latihan kata')}
        </div>
        <div class="fl-pop" data-g="info" hidden>
          ${panels.map(p => fit(`data-act="sh-panel" data-p="${p[0]}" aria-expanded="false"`, p[1], p[2])).join('')}
        </div>
        <div class="fl-pop" data-g="tampil" hidden>
          <label class="fl-row">${hi('type')}<select class="sh-mushaf" aria-label="Mushaf (gaya tulisan Arab)">${mushafOpts}</select></label>
          <label class="fl-row">${hi('mic')}<select class="sh-qari" aria-label="Qori (pembaca murottal)">${qariOpts}</select></label>
          <span class="vb-g2"><span class="vb-n" title="Kosakata">${icon('words')}<span class="vb-l">Kosakata</span></span><button class="vb-i" data-act="all-wbw-show" title="Tampilkan semua kosakata" aria-label="Tampilkan semua kosakata">${icon('eye')}</button><button class="vb-i" data-act="all-wbw-hide" title="Sembunyikan semua kosakata" aria-label="Sembunyikan semua kosakata">${icon('eyeoff')}</button></span><span class="vb-g2"><span class="vb-n" title="Tafsir">${icon('book')}<span class="vb-l">Tafsir</span></span><button class="vb-i" data-act="all-tafsir-show" title="Tampilkan semua tafsir" aria-label="Tampilkan semua tafsir">${icon('eye')}</button><button class="vb-i" data-act="all-tafsir-hide" title="Sembunyikan semua tafsir" aria-label="Sembunyikan semua tafsir">${icon('eyeoff')}</button></span><span class="vb-g2"><span class="vb-n" title="Cara baca">${icon('bulb')}<span class="vb-l">Cara baca</span></span><button class="vb-i" data-act="all-how-show" title="Tampilkan semua cara baca" aria-label="Tampilkan semua cara baca">${icon('eye')}</button><button class="vb-i" data-act="all-how-hide" title="Sembunyikan semua cara baca" aria-label="Sembunyikan semua cara baca">${icon('eyeoff')}</button></span><span class="vb-g2"><span class="vb-n" title="Latin"><b class="vb-t">Aa</b><span class="vb-l">Latin</span></span><button class="vb-i" data-act="all-latin-show" title="Tampilkan semua latin" aria-label="Tampilkan semua latin">${icon('eye')}</button><button class="vb-i" data-act="all-latin-hide" title="Sembunyikan semua latin" aria-label="Sembunyikan semua latin">${icon('eyeoff')}</button></span><span class="vb-g2"><span class="vb-n" title="Terjemahan"><b class="vb-t">ID</b><span class="vb-l">Terjemahan</span></span><button class="vb-i" data-act="all-trans-show" title="Tampilkan semua terjemahan" aria-label="Tampilkan semua terjemahan">${icon('eye')}</button><button class="vb-i" data-act="all-trans-hide" title="Sembunyikan semua terjemahan" aria-label="Sembunyikan semua terjemahan">${icon('eyeoff')}</button></span>
          <button class="vb-reset" data-act="reset-view" title="Kembali ke tampilan awal" aria-label="Kembali ke tampilan awal">↻<span class="vb-l vb-rl"> Reset</span></button>
        </div>
      </div>`;
    const basm = (n !== 1 && n !== 9) ? `<div class="bismillah">${bismillahText()}</div>` : '';
    const ayahs = data.ayat.map((a, i) => ayahHTML(n, a, i, tj)).join('');
    const prev = data.suratSebelumnya, next = data.suratSelanjutnya;
    const pager = `<div class="pager">
        ${prev ? `<a class="btn" href="#/surah/${prev.nomor}">← ${esc(prev.namaLatin)}</a>` : '<span></span>'}
        ${next ? `<a class="btn primary" href="#/surah/${next.nomor}" style="text-align:right">${esc(next.namaLatin)} →</a>` : '<span></span>'}</div>`;
    const notice = tj ? '' : `<div class="card notice" id="tjNotice"><span>Warna tajwid belum termuat${tjErr ? ' (' + esc(tjErr.message) + ')' : ''}. Teks ditampilkan tanpa warna.</span>
        <button class="btn" data-act="tj-retry">Muat ulang tajwid</button></div>`;
    view.classList.remove('v-hide-latin', 'v-hide-trans');
    view.innerHTML = notice + head + vbar + basm + ayahs + pager;
    hydrateIcons(view);

    if (settings.wbw) $$('.ayah', view).forEach(c => toggleWbw(c, true));
    audioStatus(data);
    markPlaying();
    observeLastRead(n);
    const target = targetAyah || (P.data && P.data.nomor === n && !audio.paused ? P.i + 1 : 0);
    if (target) {
      const el = $('#a' + target);
      if (el) { el.scrollIntoView({ block: 'start' }); if (targetAyah) { el.classList.add('flash'); } }
    }
  }

  function ayahHTML(n, a, i, tj) {
    const arab = tj && tj[a.nomorAyat] ? tj[a.nomorAyat] : esc(a.teksArab);
    const bm = isBookmarked(n, a.nomorAyat);
    return `<article class="ayah" id="a${a.nomorAyat}" data-i="${i}" data-a="${a.nomorAyat}">
      <div class="ayah-head"><span class="num">${a.nomorAyat}</span>
        <div class="acts">
          <button class="icon-btn" data-act="play" aria-label="Putar ayat ${a.nomorAyat}">${icon('play')}</button>
          <button class="icon-btn ${bm ? 'on' : ''}" data-act="bm" aria-label="Tandai ayat">${icon(bm ? 'bookmarkOn' : 'bookmark')}</button>
          <button class="icon-btn" data-act="wbw" aria-label="Arti per kata">${icon('words')}</button>
          <button class="icon-btn" data-act="how" aria-label="Cara baca">${icon('bulb')}</button>
          <button class="icon-btn" data-act="tafsir" aria-label="Tafsir">${icon('book')}</button>
          <button class="icon-btn" data-act="share" aria-label="Bagikan">${icon('share')}</button>
        </div></div>
      <div class="arab" lang="ar" dir="rtl">${arab}</div>
      <div class="wbw" dir="rtl" hidden></div>
      <p class="latin">${esc(a.teksLatin)}</p>
      <p class="trans">${esc(a.teksIndonesia)}</p>
    </article>`;
  }

  let lastObs = null, lastTimer;
  function observeLastRead(n) {
    if (lastObs) lastObs.disconnect();
    if (!('IntersectionObserver' in window)) return;
    lastObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const a = +e.target.dataset.a;
        clearTimeout(lastTimer);
        lastTimer = setTimeout(() => store.set('lastRead', { s: n, a }), 600);
      });
    }, { rootMargin: '-15% 0px -75% 0px' });
    $$('.ayah', view).forEach(el => lastObs.observe(el));
  }

  /* ----- Pencarian ----- */
  async function SearchView(q) {
    const id = ++renderId; current = null;
    setTitle('Cari', true);
    view.innerHTML = '<div id="searchHost"></div>';
    let surahs = [];
    try { surahs = await getSurahs(); } catch { /* tetap bisa cari ayat & kata */ }
    if (id !== renderId) return;
    const sb = mountSearch($('#searchHost'), { surahs, id });
    if (q) { sb.setValue(q); sb.run(); } else { sb.idle(); sb.focus(); sb.openHint(); }
  }

  /* ----- Latihan kosakata ----- */
  async function QuizView(n) {
    const id = ++renderId; current = null;
    setTitle(n ? 'Latihan · ' + surahName(n) : 'Latihan kosakata', true);
    view.innerHTML = loadingHTML;
    const pool = [];
    try {
      await getSurahs();
      if (n) {
        const d = await getSurah(n);
        await getTajwid(n).catch(() => null);
        d.ayat.forEach(a => ayahWords(n, a).forEach((w, k) => pool.push({ ar: w.ar, m: a.m[k] })));
      } else {
        Object.values({ ...KATA.weak(), ...KATA.saved() }).forEach(([ar, m]) => pool.push({ ar, m }));
      }
    } catch (e) { if (id === renderId) { view.innerHTML = errorHTML(e.message); $('#retry').onclick = () => QuizView(n); } return; }
    if (id !== renderId) return;
    view.innerHTML = '<div id="quizBox"></div>';
    KATA.quiz($('#quizBox'), pool, n ? surahName(n) : 'Kata tersimpan dan yang masih keliru');
  }

  /* ----- Penanda ----- */
  async function BookmarksView() {
    const id = ++renderId; current = null;
    setTitle('Penanda', true);
    await getSurahs().catch(() => null);
    if (id !== renderId) return;
    const list = getBookmarks();
    if (!list.length) { view.innerHTML = '<div class="card"><p><b>Belum ada penanda.</b></p><p class="muted">Ketuk ikon penanda pada ayat mana pun untuk menyimpannya di sini.</p></div>'; return; }
    view.innerHTML = list.map(b => `<div class="card result row-actions" style="margin-bottom:10px">
        <a class="grow" href="#/surah/${b.s}?a=${b.a}"><b>${esc(surahName(b.s))}</b> <span class="muted">· ayat ${b.a}</span></a>
        <button class="icon-btn" data-rm="${b.s}:${b.a}" aria-label="Hapus penanda">${icon('trash')}</button></div>`).join('');
    $$('[data-rm]', view).forEach(btn => btn.addEventListener('click', () => {
      const [s, a] = btn.dataset.rm.split(':').map(Number);
      store.set('bookmarks', getBookmarks().filter(x => !(x.s === s && x.a === a)));
      BookmarksView();
    }));
  }

  /* ---------- audio ---------- */
  const audio = new Audio();
  audio.preload = 'auto';
  const P = { data: null, i: -1, repeatLeft: 1 };

  function qariUrl(a) {
    const au = a.audio || {};
    if (String(settings.qari).startsWith('ea:')) return `https://everyayah.com/data/${settings.qari.slice(3)}/${pad3(a.sn)}${pad3(a.nomorAyat)}.mp3`;
    return au[settings.qari] || au['05'];
  }
  const qariLoaded = new Set();
  async function ensureQari(data) {
    qariLoaded.add(data.nomor);
    try {
      const j = await fetchJSON(`${EQURAN}/surat/${data.nomor}`);
      j.data.ayat.forEach((x, i) => { if (data.ayat[i]) Object.assign(data.ayat[i].audio, x.audio); });
    } catch { toast('Qari ini butuh internet. Memakai Misyari Al-Afasi.'); }
  }
  async function srcFor(url) {
    try {
      const r = await (await caches.open('audio-v1')).match(url);
      if (r) { if (P.obj) URL.revokeObjectURL(P.obj); return (P.obj = URL.createObjectURL(await r.blob())); }
    } catch { /* tanpa Cache API */ }
    return url;
  }
  function setDl(btn, ic, label, badge) {
    btn.innerHTML = hi(ic) + (badge ? `<small class="sh-badge">${badge}</small>` : '');
    btn.title = label; btn.setAttribute('aria-label', label);
    btn.classList.toggle('is-done', ic === 'saved');
  }
  async function downloadAudio(data) {
    const btn = $('#dlAudio'); if (!('caches' in window)) return toast('Peramban ini tidak mendukung penyimpanan offline.');
    btn.disabled = true; const c = await caches.open('audio-v1'); let done = 0;
    for (const a of data.ayat) {
      const url = a.audio['05'];
      try {
        if (!(await c.match(url))) { const r = await fetch(url, { mode: 'cors' }); if (!r.ok) throw 0; await c.put(url, r); }
        setDl(btn, 'download', `Mengunduh ${++done}/${data.ayat.length}`, `${done}/${data.ayat.length}`);
      } catch { btn.disabled = false; setDl(btn, 'download', 'Audio offline'); return toast('Audio belum bisa diunduh (offline atau diblokir server). Audio tetap bisa diputar saat online.'); }
    }
    btn.disabled = false; audioStatus(data); toast('Audio surah ini tersimpan untuk offline');
  }
  async function audioStatus(data) {
    const btn = $('#dlAudio'); if (!btn || !('caches' in window)) return;
    try {
      const c = await caches.open('audio-v1'); let n = 0;
      for (const a of data.ayat) if (await c.match(a.audio['05'])) n++;
      if (n === data.ayat.length) setDl(btn, 'saved', 'Audio tersimpan untuk offline');
      else if (n) setDl(btn, 'download', `Audio offline (${n}/${data.ayat.length})`, `${n}/${data.ayat.length}`);
      else setDl(btn, 'download', 'Audio offline');
    } catch { /* abaikan */ }
  }

  function playIndex(data, i) {
    const a = data.ayat[i]; if (!a) return;
    if (settings.qari !== '05' && !String(settings.qari).startsWith('ea:') && !qariLoaded.has(data.nomor)) { ensureQari(data).then(() => playIndex(data, i)); return; }
    const url = qariUrl(a);
    if (!url) { toast('Audio untuk ayat ini tidak tersedia.'); return; }
    P.data = data; P.i = i; P.repeatLeft = settings.repeat;
    const tok = P.tok = (P.tok || 0) + 1;
    srcFor(url).then(src => {
      if (tok !== P.tok) return;
      const list = url === a.audio['05'] ? [src, ...(a.audio.alts || [])] : [src, a.audio['05'], ...(a.audio.alts || [])];
      const attempt = k => {
        audio.src = list[k];
        audio.defaultPlaybackRate = settings.speed; audio.playbackRate = settings.speed;
        audio.play().catch(err => {
          if (tok !== P.tok || (err && err.name === 'AbortError')) return;
          if (k + 1 < list.length) { if (k === 0 && url !== a.audio['05']) toast('Qari ini belum tersedia untuk ayat ini. Memakai Misyari Al-Afasi.'); return attempt(k + 1); }
          toast('Audio gagal diputar (' + ((err && err.name) || 'error') + ', ' + list.length + ' sumber dicoba). Periksa internet / pemblokir iklan.');
        });
      };
      attempt(0);
    });
    $('#player').hidden = false;
    document.body.classList.add('has-player');
    updatePlayerUI(); markPlaying(true); setMediaSession();
  }

  function nextAyah(auto) {
    const d = P.data; if (!d) return;
    if (P.i + 1 < d.ayat.length) return playIndex(d, P.i + 1);
    if (auto && !settings.autoNext) { updatePlayerUI(); return; }
    if (d.nomor < 114) playNextSurah(d.nomor + 1, d.nomor); else updatePlayerUI();
  }
  async function playNextSurah(n, from) {
    try {
      const d = await getSurah(n);
      playIndex(d, 0);
      if (current && current.n === from) location.hash = '#/surah/' + n;
    } catch { toast('Gagal memuat surah berikutnya.'); }
  }
  function prevAyah() {
    if (!P.data) return;
    if (audio.currentTime > 3 || P.i === 0) { audio.currentTime = 0; return; }
    playIndex(P.data, P.i - 1);
  }

  audio.addEventListener('ended', () => {
    if (P.repeatLeft > 1) { P.repeatLeft--; audio.currentTime = 0; audio.play().catch(() => { }); return; }
    nextAyah(true);
  });
  audio.addEventListener('play', () => { updatePlayerUI(); markPlaying(); });
  audio.addEventListener('pause', () => { updatePlayerUI(); markPlaying(); });
  audio.addEventListener('error', () => { if (audio.src) toast('Audio gagal dimuat. Periksa koneksi internet.'); });
  audio.addEventListener('timeupdate', () => {
    if (audio.duration) $('#pSeek').value = (audio.currentTime / audio.duration) * 100;
  });
  $('#pSeek').addEventListener('input', e => { if (audio.duration) audio.currentTime = (e.target.value / 100) * audio.duration; });

  function updatePlayerUI() {
    const playing = !audio.paused && !audio.ended;
    $('#pToggle').innerHTML = icon(playing ? 'pause' : 'play');
    if (P.data) {
      $('#pTitle').textContent = `QS. ${P.data.namaLatin} : ${P.i + 1}`;
      $('#pSub').textContent = QARI_NAMES[settings.qari] || 'Qari ' + settings.qari;
    }
    $('#pSpeed').textContent = settings.speed + 'x';
    $('#pRepeat').textContent = settings.repeat + '×';
  }

  function markPlaying(scroll) {
    $$('.ayah.playing').forEach(e => e.classList.remove('playing'));
    $$('.ayah [data-act=play]').forEach(b => { b.innerHTML = icon('play'); });
    if (!P.data || !current || current.n !== P.data.nomor) return;
    const el = $('#a' + (P.i + 1)); if (!el) return;
    el.classList.add('playing');
    if (!audio.paused) { const b = $('[data-act=play]', el); if (b) b.innerHTML = icon('pause'); }
    if (scroll) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  function setMediaSession() {
    if (!('mediaSession' in navigator) || !P.data) return;
    try {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: `QS. ${P.data.namaLatin} : ${P.i + 1}`, artist: QARI_NAMES[settings.qari] || 'Murottal', album: "Al-Quran"
      });
      navigator.mediaSession.setActionHandler('play', () => audio.play());
      navigator.mediaSession.setActionHandler('pause', () => audio.pause());
      navigator.mediaSession.setActionHandler('previoustrack', prevAyah);
      navigator.mediaSession.setActionHandler('nexttrack', () => nextAyah(false));
    } catch { /* tidak didukung */ }
  }

  $('#pToggle').addEventListener('click', () => { if (audio.paused) audio.play().catch(() => { }); else audio.pause(); });
  $('#pPrev').addEventListener('click', prevAyah);
  $('#pNext').addEventListener('click', () => nextAyah(false));
  $('#pClose').addEventListener('click', () => {
    audio.pause(); audio.removeAttribute('src'); audio.load();
    P.data = null; P.i = -1; $('#player').hidden = true; document.body.classList.remove('has-player'); markPlaying();
  });
  $('#pSpeed').addEventListener('click', () => {
    const opts = [0.75, 1, 1.25, 1.5];
    settings.speed = opts[(opts.indexOf(settings.speed) + 1) % opts.length];
    audio.playbackRate = settings.speed; audio.defaultPlaybackRate = settings.speed;
    saveSettings(); updatePlayerUI(); syncSettingsForm();
  });
  $('#pRepeat').addEventListener('click', () => {
    const opts = [1, 2, 3, 5, 10];
    settings.repeat = opts[(opts.indexOf(settings.repeat) + 1) % opts.length];
    P.repeatLeft = settings.repeat; saveSettings(); updatePlayerUI(); syncSettingsForm();
  });

  /* ---------- interaksi di halaman ---------- */
  async function shareAyah(a) {
    const tjh = mushafKey() === 'intl' && current.tj && current.tj[a.nomorAyat];
    const ar = tjh ? new DOMParser().parseFromString(tjh, 'text/html').body.textContent : a.teksArab;
    const text = `${ar}\n\n${a.teksIndonesia}\n\n— QS. ${current.data.namaLatin} (${current.n}): ${a.nomorAyat}`;
    if (navigator.share) {
      try { await navigator.share({ title: "Al-Qur'an", text }); return; } catch (e) { if (e && e.name === 'AbortError') return; }
    }
    try { await navigator.clipboard.writeText(text); toast('Ayat disalin'); } catch { toast('Tidak bisa menyalin'); }
  }

  function applyTajwidToDom() {
    $$('.ayah', view).forEach(el => {
      const h = current && current.tj && current.tj[+el.dataset.a];
      if (h) $('.arab', el).innerHTML = h;
    });
  }
  async function retryTajwid() {
    if (!current) return;
    const n = current.n;
    const btns = $$('[data-act=tj-retry]', view);
    btns.forEach(b => { b.disabled = true; b.textContent = 'Memuat…'; });
    try {
      const t = await getTajwid(n);
      if (!current || current.n !== n) return;
      current.tj = t; applyTajwidToDom();
      $$('.ayah', view).forEach(c => { const b = $('.wbw', c); if (b && !b.hidden) toggleWbw(c, true); });
      const nt = $('#tjNotice'); if (nt) nt.remove();
      $$('.ayah', view).forEach(c => closeBox(c, 'how'));
      toast('Warna tajwid aktif');
    } catch (e) {
      btns.forEach(b => { b.disabled = false; b.textContent = 'Muat ulang tajwid'; });
      toast('Masih gagal memuat tajwid: ' + (e && e.message ? e.message : 'periksa koneksi'));
    }
  }
  /* kata per kata: [{html, ar}] sejajar dengan a.m (arti), atau [] bila tidak tersedia */
  function ayahWords(n, a) {
    const m = a.m || [];
    if (a.w && a.w.length === m.length) return a.w.map(w => ({ html: esc(w), ar: w }));
    const h = tjWords.get(mushafKey() + ':' + n + ':' + a.nomorAyat);
    if (h && h.length === m.length) return h.map(x => ({ html: x, ar: KATA.strip(x) }));
    return [];
  }
  function toggleWbw(card, force) {
    const box = $('.wbw', card); if (!box || !current) return;
    const show = force === undefined ? box.hidden : force;
    markBtn(card, 'wbw', show);
    if (!show) { box.hidden = true; return; }
    if (!box.dataset.ready || (box.dataset.tj !== (current.tj ? '1' : '0') && current.tj)) {
      const a = current.data.ayat[+card.dataset.i], ws = ayahWords(current.n, a);
      box.innerHTML = ws.length
        ? ws.map((w, k) => `<button type="button" class="wd" data-w="${k}"><span class="wa" lang="ar">${w.html}</span><span class="wm" dir="ltr">${esc(a.m[k])}</span></button>`).join('')
        : '<p class="muted small" dir="ltr">Arti per kata untuk ayat ini belum tersedia.</p>';
      box.dataset.ready = '1'; box.dataset.tj = current.tj ? '1' : '0';
    }
    box.hidden = false;
  }
  let sheetWord = null;
  const wordAudio = new Audio();
  /* audio per kata: diputar online, lalu disimpan di cache 'audio-v1' sehingga kata yang pernah didengar bisa diputar offline */
  async function sayWord(url, btn) {
    try {
      let src = url;
      if ('caches' in window) {
        const c = await caches.open('audio-v1');
        let r = await c.match(url);
        if (!r) { const f = await fetch(url, { mode: 'cors' }); if (!f.ok) throw 0; await c.put(url, f.clone()); r = f; }
        src = URL.createObjectURL(await r.blob());
      }
      wordAudio.src = src; await wordAudio.play();
    } catch {
      try { wordAudio.src = url; await wordAudio.play(); } catch { toast('Audio kata butuh internet (atau belum pernah diputar).'); }
    }
  }
  async function openWord(btn) {
    const card = btn.closest('.ayah'), a = current.data.ayat[+card.dataset.i], k = +btn.dataset.w;
    const w = ayahWords(current.n, a)[k]; if (!w) return;
    await KATA.loadVocab().catch(() => null);
    const info = {}; Object.keys(TAJWID).forEach(c => { info[c] = [TAJWID[c][0], TAJWID[c][1], HOW[c]]; });
    sheetWord = { ar: w.ar, m: a.m[k], url: `https://audio.qurancdn.com/wbw/${pad3(current.n)}_${pad3(a.nomorAyat)}_${pad3(k + 1)}.mp3` };
    $('#wordBody').innerHTML = KATA.sheetHTML({ html: w.html, ar: w.ar, m: a.m[k], m2: a.m2 && a.m2[k] }, info);
    $('#wordRef').textContent = `QS. ${current.data.namaLatin}: ${a.nomorAyat} · kata ke-${k + 1}`;
    if (!$('#wordSheet').open) $('#wordSheet').showModal();
  }
  $('#wordSheet').addEventListener('click', e => {
    if (e.target === $('#wordSheet') || e.target.closest('[data-close]')) $('#wordSheet').close();
    const say = e.target.closest('[data-say]');
    if (say && sheetWord) return sayWord(sheetWord.url, say);
    const sv = e.target.closest('[data-save]');
    if (sv && sheetWord) {
      const on = KATA.toggleSaved(sheetWord.ar, sheetWord.m);
      sv.textContent = on ? '★ Tersimpan di latihan' : '☆ Simpan ke latihan'; sv.classList.toggle('primary', on);
    }
  });

  function wordAround(full, start, len) {
    let s = start, e = start + len;
    while (s > 0 && !/\s/.test(full[s - 1])) s--;
    while (e < full.length && !/\s/.test(full[e])) e++;
    return full.slice(s, e);
  }
  function howHTML(card) {
    const arab = $('.arab', card);
    const spans = $$('.tj', arab);
    if (!spans.length) {
      return '<p class="muted">Data tajwid ayat ini belum termuat.</p><button class="btn" data-act="tj-retry">Muat ulang tajwid</button>';
    }
    const full = arab.textContent;
    const pos = new Map();
    const walker = document.createTreeWalker(arab, NodeFilter.SHOW_TEXT);
    let off = 0, node;
    while ((node = walker.nextNode())) {
      const sp = node.parentElement && node.parentElement.closest('.tj');
      if (sp && !pos.has(sp)) pos.set(sp, [off, node.textContent.length]);
      off += node.textContent.length;
    }
    const groups = {};
    spans.forEach(s => { (groups[s.dataset.r] = groups[s.dataset.r] || []).push(s); });
    const rows = LEGEND_ORDER.filter(c => groups[c] && TAJWID[c]).map(c => {
      const list = groups[c];
      const words = [...new Set(list.map(s => { const p = pos.get(s); return p ? wordAround(full, p[0], p[1]).trim() : ''; }).filter(Boolean))].slice(0, 4);
      return `<li><span class="dot tj-${c}">${esc(list[0].textContent.trim().slice(0, 3))}</span>
        <div><b>${esc(TAJWID[c][0])}</b> <span class="muted small">× ${list.length}</span>
        <span class="d">${esc(TAJWID[c][1])}</span>
        <span class="d"><b>Cara baca:</b> ${esc(HOW[c])}</span>
        ${words.length ? `<div class="words">${words.map(w => `<span class="ex"><span dir="rtl" lang="ar">${esc(w)}</span><small>${esc(KATA.translit(w).text)}</small></span>`).join('')}</div>` : ''}</div></li>`;
    });
    const ay = current && current.data.ayat[+card.dataset.i];
    return `<p class="mini-title">Cara baca ayat ini</p>${ay ? `<p class="how-lat">${esc(ay.teksLatin)}</p>` : ''}<ul>${rows.join('')}</ul>
      <p class="muted small">Ketuk tombol <b>arti per kata</b> lalu ketuk satu kata untuk panduan huruf, makhraj, dan panjang-pendek bacaannya.</p>`;
  }



  /* ---------- tampilan massal per surah: kosakata, tafsir, cara baca ---------- */
  let bulkTok = 0;                       // membatalkan operasi massal yang masih berjalan bila ada perintah baru
  const nextFrame = () => new Promise(r => requestAnimationFrame(() => r()));
  function markBtn(card, act, on) {
    const b = $(`[data-act=${act}]`, card);
    if (b) { b.classList.toggle('on', !!on); b.setAttribute('aria-pressed', on ? 'true' : 'false'); }
  }
  /* kotak cara baca selalu di atas tafsir agar urutannya konsisten */
  function addBox(card, cls) {
    let box = $('.' + cls, card);
    if (box) return box;
    box = document.createElement('div'); box.className = cls;
    const taf = $('.tafsir', card);
    if (cls === 'how' && taf) card.insertBefore(box, taf); else card.appendChild(box);
    return box;
  }
  function closeBox(card, cls) { const b = $('.' + cls, card); if (b) b.remove(); markBtn(card, cls === 'how' ? 'how' : 'tafsir', false); }

  function showHow(card) {
    const a = current.data.ayat[+card.dataset.i];
    const box = addBox(card, 'how');
    box.innerHTML = howHTML(card) + `<p style="margin:10px 0 0"><a class="btn" href="#/analisis/${current.n}?a=${a.nomorAyat}">🔍 Analisis tajwid lengkap ayat ini</a></p>`;
    markBtn(card, 'how', true);
  }
  function fillTafsir(box, t, key) {
    const w = t.w[key], l = t.t[key];
    box.innerHTML = (w || l) ? `${w ? `<b>Tafsir ringkas (Wajiz)</b><p>${esc(w)}</p>` : ''}${l ? `<details><summary>Tafsir lengkap (Tahlili)</summary><p style="white-space:pre-line">${esc(l)}</p></details>` : ''}` : 'Tafsir untuk ayat ini tidak tersedia.';
  }
  async function showTafsir(card) {
    const n = current.n, box = addBox(card, 'tafsir');
    markBtn(card, 'tafsir', true);
    box.textContent = 'Memuat tafsir…';
    try { fillTafsir(box, await getTafsir(n), String(card.dataset.a)); }
    catch { box.textContent = 'Tafsir belum bisa dimuat. Buka sekali saat online atau unduh semua di Pengaturan.'; }
  }

  async function bulkWbw(show) {
    if (!current) return; const tok = ++bulkTok, cards = $$('.ayah', view);
    for (let i = 0; i < cards.length; i++) {
      toggleWbw(cards[i], show);
      if (show && i % 20 === 19) { await nextFrame(); if (tok !== bulkTok || !current) return; }
    }
    toast(show ? `Kosakata ditampilkan di ${cards.length} ayat` : 'Kosakata disembunyikan');
  }
  async function bulkTafsir(show) {
    if (!current) return; const tok = ++bulkTok, n = current.n, cards = $$('.ayah', view);
    if (!show) { cards.forEach(c => closeBox(c, 'tafsir')); toast('Tafsir disembunyikan'); return; }
    toast('Memuat tafsir…');
    let t;
    try { t = await getTafsir(n); } catch { toast('Tafsir belum bisa dimuat. Buka sekali saat online atau unduh semua di Pengaturan.'); return; }
    if (tok !== bulkTok || !current || current.n !== n) return;
    for (let i = 0; i < cards.length; i++) {
      fillTafsir(addBox(cards[i], 'tafsir'), t, String(cards[i].dataset.a)); markBtn(cards[i], 'tafsir', true);
      if (i % 15 === 14) { await nextFrame(); if (tok !== bulkTok || !current || current.n !== n) return; }
    }
    toast(`Tafsir ditampilkan di ${cards.length} ayat`);
  }
  async function bulkHow(show) {
    if (!current) return; const tok = ++bulkTok, n = current.n, cards = $$('.ayah', view);
    if (!show) { cards.forEach(c => closeBox(c, 'how')); toast('Cara baca disembunyikan'); return; }
    if (!current.tj) { toast('Warna tajwid belum termuat, jadi cara baca belum bisa ditampilkan. Ketuk “Muat ulang tajwid”.'); return; }
    for (let i = 0; i < cards.length; i++) {
      showHow(cards[i]);
      if (i % 10 === 9) { await nextFrame(); if (tok !== bulkTok || !current || current.n !== n) return; }
    }
    toast(`Cara baca ditampilkan di ${cards.length} ayat`);
  }
  /* latin & terjemahan: sembunyikan hanya untuk surah yang sedang dibuka; "tampilkan" juga menyalakan kembali bila dimatikan di Pengaturan */
  function bulkText(kind, show) {
    if (!current) return;
    const key = kind === 'latin' ? 'latin' : 'trans', name = kind === 'latin' ? 'Teks latin' : 'Terjemahan';
    view.classList.toggle('v-hide-' + key, !show);
    if (show && !settings[key]) { settings[key] = true; saveSettings(); applySettings(); syncSettingsForm(); }
    toast(show ? name + ' ditampilkan' : name + ' disembunyikan');
  }
  /* kembali ke tampilan awal: semua panel ayat tertutup (arti per kata mengikuti Pengaturan) */
  function resetView() {
    if (!current) return; bulkTok++;
    view.classList.remove('v-hide-latin', 'v-hide-trans');
    $$('.ayah', view).forEach(c => {
      closeBox(c, 'how'); closeBox(c, 'tafsir');
      toggleWbw(c, settings.wbw);
      $('.arab', c).classList.remove('show');
    });
    $$('.surah-head details', view).forEach(d => { d.open = false; });
    $('#tip').hidden = true;
    toast('Tampilan dikembalikan ke awal (latin & terjemahan ikut tampil)');
  }

  view.addEventListener('click', async e => {
    const wd = e.target.closest('.wd');
    if (wd && current && !(document.body.classList.contains('hafalan'))) return openWord(wd);
    const tj = e.target.closest('.tj');
    if (tj && !document.body.classList.contains('no-tajwid') && !(document.body.classList.contains('hafalan') && !tj.closest('.arab').classList.contains('show'))) {
      const info = TAJWID[tj.dataset.r];
      if (info) {
        const tip = $('#tip');
        tip.innerHTML = `<b>${esc(info[0])}</b><span class="muted">${esc(info[1])}</span><div style="margin-top:6px"><b style="display:inline">Cara baca:</b> ${esc(HOW[tj.dataset.r] || '')}</div>`;
        tip.hidden = false;
        clearTimeout(tip._t); tip._t = setTimeout(() => { tip.hidden = true; }, 6000);
        return;
      }
    }
    const arab = e.target.closest('.arab');
    if (arab && document.body.classList.contains('hafalan')) { arab.classList.toggle('show'); return; }

    const btn = e.target.closest('[data-act]'); if (!btn || !current) return;
    const act = btn.dataset.act;
    const card = btn.closest('.ayah');
    const i = card ? +card.dataset.i : 0;
    const a = current.data.ayat[i];
    if (act === 'play-all') return playIndex(current.data, 0);
    if (act === 'fl-tog') {
      const open = btn.getAttribute('aria-expanded') !== 'true';
      closePops();
      if (open) { btn.setAttribute('aria-expanded', 'true'); const p = $('.fl-pop[data-g="' + btn.dataset.g + '"]', view); if (p) p.hidden = false; }
      return;
    }
    if (act === 'sh-panel') {
      const box = view, open = btn.getAttribute('aria-expanded') !== 'true';
      $$('[data-act="sh-panel"]', box).forEach(b => b.setAttribute('aria-expanded', 'false'));
      $$('.sh-panel', box).forEach(p => { p.hidden = true; });
      closePops();
      if (open) { btn.setAttribute('aria-expanded', 'true'); const p = $('#shp-' + btn.dataset.p, box); p.hidden = false; p.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); }
      return;
    }
    if (act === 'all-wbw-show') return bulkWbw(true);
    if (act === 'all-wbw-hide') return bulkWbw(false);
    if (act === 'all-tafsir-show') return bulkTafsir(true);
    if (act === 'all-tafsir-hide') return bulkTafsir(false);
    if (act === 'all-how-show') return bulkHow(true);
    if (act === 'all-how-hide') return bulkHow(false);
    if (act === 'all-latin-show') return bulkText('latin', true);
    if (act === 'all-latin-hide') return bulkText('latin', false);
    if (act === 'all-trans-show') return bulkText('trans', true);
    if (act === 'all-trans-hide') return bulkText('trans', false);
    if (act === 'reset-view') return resetView();
    if (act === 'legend') return openLegend();
    if (act === 'tj-retry') return retryTajwid();
    if (act === 'play') {
      if (P.data && P.data.nomor === current.n && P.i === i && audio.src) { return audio.paused ? audio.play() : audio.pause(); }
      return playIndex(current.data, i);
    }
    if (act === 'bm') {
      const on = toggleBookmark(current.n, a.nomorAyat);
      btn.classList.toggle('on', on); btn.innerHTML = icon(on ? 'bookmarkOn' : 'bookmark'); return;
    }
    if (act === 'how') {
      if ($('.how', card)) return closeBox(card, 'how');
      return showHow(card);
    }
    if (act === 'share') return shareAyah(a);
    if (act === 'wbw') return toggleWbw(card);
    if (act === 'dl-audio') return downloadAudio(current.data);
    if (act === 'tafsir') {
      if ($('.tafsir', card)) return closeBox(card, 'tafsir');
      return showTafsir(card);
    }
  });
  document.addEventListener('click', e => { if (!e.target.closest('.tj') && !e.target.closest('#tip')) $('#tip').hidden = true; });
  $('#btnBack').addEventListener('click', () => { if (history.length > 1) history.back(); else location.hash = '#/'; });

  /* ---------- pengaturan ---------- */
  const dlgSettings = $('#settings'), dlgLegend = $('#legend');
  function applySettings() {
    const t = settings.theme === 'auto' ? (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light') : settings.theme;
    document.documentElement.dataset.theme = t;
    const meta = $('meta[name=theme-color]');
    if (meta) meta.content = { light: '#0f766e', sepia: '#8a5a1c', dark: '#0f2a26' }[t];
    document.documentElement.style.setProperty('--arab-size', settings.arab + 'px');
    document.documentElement.dataset.mushaf = mushafKey();
    document.body.classList.toggle('no-tajwid', !settings.tajwid);
    document.body.classList.toggle('hide-latin', !settings.latin);
    document.body.classList.toggle('hide-trans', !settings.trans);
    document.body.classList.toggle('hafalan', settings.hafalan);
    if (!settings.hafalan) $$('.arab.show').forEach(e => e.classList.remove('show'));
  }
  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => { if (settings.theme === 'auto') applySettings(); });

  function fillQariOptions() {
    const keys = Object.keys(QARI_NAMES);
    if (!keys.includes(settings.qari)) { settings.qari = '05'; saveSettings(); }
    $('#setQari').innerHTML = keys.map(k => `<option value="${esc(k)}">${esc(QARI_NAMES[k])}${k === '05' ? ' (bisa diunduh offline)' : ' (online)'}</option>`).join('');
    $('#setQari').value = settings.qari;
  }
  function syncSettingsForm() {
    $('#setTheme').value = settings.theme;
    $('#setArab').value = settings.arab; $('#arabSizeVal').textContent = settings.arab + 'px';
    $$('.sh-mushaf').forEach(x => { x.value = mushafKey(); });
    $$('.sh-qari').forEach(x => { x.value = settings.qari; });
    $('#setMushaf').value = mushafKey(); $('#mushafNote').textContent = MUSHAF_NOTE[mushafKey()];
    $('#setTajwid').checked = settings.tajwid; $('#setLatin').checked = settings.latin;
    $('#setTrans').checked = settings.trans; $('#setHafalan').checked = settings.hafalan; $('#setWbw').checked = settings.wbw;
    $('#setSpeed').value = String(settings.speed); $('#setRepeat').value = String(settings.repeat);
    $('#setAutoNext').checked = settings.autoNext;
    if ($('#setQari').options.length) $('#setQari').value = settings.qari;
  }
  function syncQariSelects() { $$('.sh-qari').forEach(x => { x.value = settings.qari; }); }
  function bindSetting(id, key, parse = v => v, evt = 'change') {
    $(id).addEventListener(evt, e => {
      const el = e.target; settings[key] = parse(el.type === 'checkbox' ? el.checked : el.value);
      saveSettings(); applySettings(); updatePlayerUI(); syncSettingsForm();
    });
  }
  bindSetting('#setTheme', 'theme'); bindSetting('#setArab', 'arab', Number, 'input');
  /* ganti gaya mushaf langsung di halaman yang terbuka (posisi gulir tetap) */
  let mushafTok = 0;
  async function applyMushaf() {
    const tok = ++mushafTok;
    $$('.bismillah', view).forEach(b => { b.textContent = bismillahText(); });
    if (!current || !$('.surah-head', view)) return;
    const n = current.n;
    let t = null;
    try { t = await getTajwid(n); } catch { t = null; }
    if (tok !== mushafTok || !current || current.n !== n || !$('.surah-head', view)) return;
    current.tj = t;
    $$('.ayah', view).forEach(el => {
      const h = t && t[+el.dataset.a], a = current.data.ayat[+el.dataset.i];
      $('.arab', el).innerHTML = h || esc(a.teksArab);
      const box = $('.wbw', el);
      if (box) { delete box.dataset.ready; if (!box.hidden) toggleWbw(el, true); }
      if ($('.how', el)) { closeBox(el, 'how'); showHow(el); }
    });
  }
  $('#setMushaf').addEventListener('change', e => {
    settings.mushaf = e.target.value; saveSettings(); applySettings(); syncSettingsForm(); applyMushaf();
  });
  function closePops() {
    $$('.fl-pop', view).forEach(p => { p.hidden = true; });
    $$('[data-act="fl-tog"]', view).forEach(b => b.setAttribute('aria-expanded', 'false'));
  }
  document.addEventListener('click', e => { if (!e.target.closest('.fl-wrap')) closePops(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closePops(); });
  document.addEventListener('change', e => {
    if (!e.target.matches || !e.target.matches('.sh-mushaf')) return;
    const m = $('#setMushaf'); m.value = e.target.value; m.dispatchEvent(new Event('change'));
  });
  bindSetting('#setTajwid', 'tajwid'); bindSetting('#setLatin', 'latin');
  bindSetting('#setTrans', 'trans'); bindSetting('#setHafalan', 'hafalan'); bindSetting('#setWbw', 'wbw');
  /* arti per kata hanya diterapkan ke ayat saat kotak ini diubah (bukan tiap pengaturan lain berubah) */
  $('#setWbw').addEventListener('change', () => { if (current) $$('.ayah', view).forEach(c => toggleWbw(c, settings.wbw)); });
  bindSetting('#setAutoNext', 'autoNext');
  bindSetting('#setRepeat', 'repeat', Number);
  $('#setSpeed').addEventListener('change', e => {
    settings.speed = Number(e.target.value); audio.playbackRate = settings.speed; audio.defaultPlaybackRate = settings.speed;
    saveSettings(); updatePlayerUI();
  });
  $('#setQari').addEventListener('change', e => {
    settings.qari = e.target.value; saveSettings(); syncQariSelects();
    if (P.data && !$('#player').hidden) playIndex(P.data, P.i); // ganti qari langsung diterapkan
    updatePlayerUI();
  });
  /* pilihan qori di popup Tampilan (bar surah) meneruskan ke pengaturan utama */
  document.addEventListener('change', e => {
    if (!e.target.matches || !e.target.matches('.sh-qari')) return;
    const m = $('#setQari'); m.value = e.target.value; m.dispatchEvent(new Event('change'));
  });

  $('#btnSettings').addEventListener('click', () => { syncSettingsForm(); dlgSettings.showModal(); });
  function openLegend() {
    $('#legendList').innerHTML = LEGEND_ORDER.map(k => `<li><span class="dot tj-${k}">${k === 'h' ? 'ٱ' : 'بـ'}</span>
      <div><b>${esc(TAJWID[k][0])}</b><span class="d">${esc(TAJWID[k][1])}</span><span class="d">Cara baca: ${esc(HOW[k])}</span></div></li>`).join('');
    if (dlgSettings.open) dlgSettings.close();
    dlgLegend.showModal();
  }
  $('#btnLegend').addEventListener('click', openLegend);
  [dlgSettings, dlgLegend].forEach(d => d.addEventListener('click', e => { if (e.target === d) d.close(); }));

  /* ---------- PWA ---------- */
  let installEvt = null;
  const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent) && !window.MSStream;
  const isInstalled = () => window.matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
  const btnInstall = $('#btnInstall');
  /* Tombol pasang hanya ikon di header. Chrome/Android: muncul saat bisa dipasang. iPhone/iPad: tampil dengan petunjuk "Tambah ke Layar Utama". */
  window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); installEvt = e; if (!isInstalled()) btnInstall.hidden = false; });
  async function doInstall() {
    if (!installEvt) { if (isIOS) toast('Ketuk tombol Bagikan, lalu “Tambah ke Layar Utama”'); return; }
    installEvt.prompt(); await installEvt.userChoice.catch(() => { });
    installEvt = null; btnInstall.hidden = true;
  }
  btnInstall.addEventListener('click', doInstall);
  window.addEventListener('appinstalled', () => { installEvt = null; btnInstall.hidden = true; toast('Aplikasi terpasang'); });
  if (isIOS && !isInstalled()) { btnInstall.hidden = false; $('#iosHint').hidden = false; }

  const coreFiles = () => {
    const f = [];
    f.push('data/surahs.json', 'data/riwayat.json', 'data/search.json', 'data/vocab.json');
    for (let i = 1; i <= 114; i++) f.push(`s/${i}.json`, `tajwid/${i}.json`, `tajwid-k/${i}.json`);
    return f;
  };
  const tafsirFiles = () => Array.from({ length: 114 }, (_, i) => `tafsir/${i + 1}.json`);
  function askSW(type, urls) {
    navigator.serviceWorker.ready.then(reg => reg.active && reg.active.postMessage({ type, urls }));
  }
  function offlineStatus(msg) { const el = $('#offStatus'); if (el) el.textContent = msg; }
  if ('serviceWorker' in navigator && location.protocol !== 'file:') {
    navigator.serviceWorker.addEventListener('message', e => {
      const m = e.data || {};
      if (m.type !== 'progress') return;
      window.dispatchEvent(new CustomEvent('quran-offline-progress', { detail: m }));
      const label = m.kind === 'tafsir' ? 'Tafsir' : 'Data Al-Qur\u2019an';
      offlineStatus(m.done >= m.total ? `${label}: tersimpan untuk offline (${m.total} berkas).` : `${label}: mengunduh ${m.done}/${m.total}…`);
      if (m.done >= m.total) { store.set(m.kind === 'tafsir' ? 'offlineTafsir' : 'offlineCoreV', 2); if (m.kind !== 'tafsir') toast('Siap dipakai offline'); }
    });
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('sw.js').then(() => {
        /* v2: data/*.json (daftar surah, pencarian) ikut diunduh */
        if (store.get('offlineCoreV', 0) !== 2) { offlineStatus('Menyiapkan data untuk offline…'); askSW('precache', coreFiles()); }
        else offlineStatus('Data Al-Qur\u2019an tersimpan untuk offline.' + (store.get('offlineTafsir', false) ? ' Tafsir juga tersimpan.' : ''));
      }).catch(() => offlineStatus('Mode offline tidak tersedia di peramban ini.'));
    });
    $('#btnOffAll').addEventListener('click', () => { offlineStatus('Mengunduh tafsir…'); askSW('precache', tafsirFiles()); });
    $('#btnOffCore').addEventListener('click', () => { offlineStatus('Memperbarui data…'); askSW('precache', coreFiles()); });
  } else { $('#offBox').hidden = true; }

  /* ---------- mulai ---------- */
  hydrateIcons();
  applySettings();
  fillQariOptions(null);
  syncSettingsForm();
  window.addEventListener('hashchange', route);
  route();
})();
