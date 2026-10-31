/* Service worker Al-Quran: aplikasi + data dibuka offline.
   - Cangkang (HTML/CSS/JS/font/ikon): disimpan saat pemasangan, diperbarui di latar belakang.
   - Data (s/, tajwid/, tafsir/, data/, audio/huruf/): cache-first, bisa diunduh sekaligus lewat pesan 'precache'.
   - Audio ('audio-v1') dikelola app.js sendiri dan tidak dihapus di sini. */
const VER = 'v23';   // v23: merek Al-Quran; v22: merek Al-Quran; v21: fitur terjemahan bersuara dibatalkan; v20: terjemahan bersuara; v19: judul beranda Al-Quran; v18: merek Al-Quran, domain tajwidku.my.id; v17: SEO beranda, canonical www; v16: beranda: Coba cari & Unduhan jadi tombol ikon di kotak cari (menempel), daftar surah tanpa judul/chip; v15: mode offline diperbaiki (data/*.json dicari di semua cache aplikasi, daftar surah tersimpan offline, halaman Unduhan offline, offline.js); v14: pilihan qori di popup Tampilan; v13: bar ringkas dengan folder Belajar/Info/Tampilan; v12: satu bar melayang (aksi surah + tampilan), menempel di bawah top bar; v11: kepala surah ringkas (tombol ikon saja), bar tampilan tidak lagi sticky (app.js, style.css); v10: pilihan mushaf (Internasional/Madinah dan Kemenag) dengan font KFGQPC Hafs & LPMQ, data tajwid-k/; v9: bar ikon tampilan satu baris, terpisah & menempel di bawah top bar (app.js, style.css); v8: cache dibatasi ke cache milik aplikasi ini (tidak lagi mencocokkan cache aplikasi lain di domain yang sama); v7: panel tampilan diringkas jadi tombol ikon; v6: tombol pasang hanya ikon di header (tombol melayang dihapus); v5: baris latin & terjemahan di panel tampilan; v4: tombol tampilan melayang; v3: tampilan massal kosakata/tafsir/cara baca (app.js, style.css); v2: tajwid/*.json dilengkapi tanda waqaf & sukun
const SHELL_CACHE = 'quran-shell-' + VER;
const DATA_CACHE = 'quran-data-v1';
const SHELL = [
  './', 'index.html', 'manifest.webmanifest',
  'style.css', 'sholat.css', 'sunnah.css', 'haji.css', 'hadith.css', 'sirah.css', 'nabi.css', 'sahabat.css',
  'makharij.css', 'tajwid-video.css', 'perpustakaan.css', 'sedekah.css',
  'kata.js', 'tajwid-engine.js', 'analisis.js', 'kiblat.js', 'makharij.js', 'hafalan.js', 'sholat.js',
  'tajwid-video.js', 'sedekah.js', 'hadith.js', 'sunnah.js', 'sirah.js', 'perpustakaan.js', 'sejarah.js',
  'nabi-data.js', 'nabi.js', 'sahabat.js', 'haji.js', 'alam-wilayah.js', 'alam.js', 'app.js', '96-waqf.js', 'offline.js', 'offline.css',
  'fonts/amiri-quran-arabic-400-normal.woff2', 'fonts/kfgqpc-uthmanic-hafs.woff2', 'fonts/lpmq-isep-misbah.woff2',
  'fonts/inter-latin-400-normal.woff2', 'fonts/inter-latin-500-normal.woff2',
  'fonts/inter-latin-600-normal.woff2', 'fonts/inter-latin-700-normal.woff2',
  'icons/icon-192.png', 'icons/icon-512.png', 'icons/icon-maskable-512.png', 'icons/apple-touch-icon.png',
  'data/surahs.json', 'data/riwayat.json', 'data/search.json', 'data/vocab.json'
];
/* Cari HANYA di cache milik aplikasi ini. caches.match() global mencari di semua cache satu domain,
   sehingga di github.io (semua repo berbagi domain) cache aplikasi lain di alamat yang sama bisa ikut tersajikan. */
const fromCache = (name, req, opt) => caches.open(name).then(c => c.match(req, opt));
/* Data dicari di cache data DAN cache cangkang: data/*.json ikut disimpan saat pemasangan di cache cangkang,
   sehingga sebelumnya tidak ditemukan saat offline ("Failed to fetch"). */
const fromData = req => fromCache(DATA_CACHE, req).then(h => h || fromCache(SHELL_CACHE, req, { ignoreSearch: true }));
const CORE_DATA = ['data/surahs.json', 'data/riwayat.json', 'data/search.json', 'data/vocab.json'];
const isData = p => /\/(s|tajwid|tajwid-k|tafsir)\/\d+\.json$/.test(p) || /\/data\/.+\.json$/.test(p) || /\/audio\/huruf\/.+\.mp3$/.test(p);

self.addEventListener('install', e => {
  e.waitUntil(caches.open(SHELL_CACHE)
    .then(c => Promise.allSettled(SHELL.map(u => c.add(new Request(u, { cache: 'reload' })))))
    .then(() => caches.open(DATA_CACHE).then(c => Promise.allSettled(CORE_DATA.map(u => c.add(new Request(u, { cache: 'reload' }))))))
    .then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(ks => Promise.all(ks.filter(k => k.startsWith('quran-shell-') && k !== SHELL_CACHE).map(k => caches.delete(k))))
    /* data tajwid lama (tanpa tanda waqaf/sukun lengkap) dibuang dari cache; data lain (surah, tafsir, audio) tetap */
    .then(() => caches.open(DATA_CACHE).then(c => c.keys().then(rs => Promise.all(
      rs.filter(r => /\/tajwid\/\d+\.json$/.test(new URL(r.url).pathname)).map(r => c.delete(r))))))
    .then(() => self.clients.claim()));
});

const put = (cache, req, res) => {
  if (res && res.ok) caches.open(cache).then(c => c.put(req, res.clone())).catch(() => { });
  return res;
};

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const u = new URL(req.url);
  if (u.origin !== location.origin) return;            // audio & API pihak ketiga: langsung ke jaringan / dikelola app.js

  if (isData(u.pathname)) {                             // data: cache-first
    e.respondWith(fromData(req).then(h => h || fetch(req).then(r => put(DATA_CACHE, req, r))));
    return;
  }
  // cangkang: stale-while-revalidate; halaman navigasi jatuh ke index.html saat offline
  e.respondWith(fromCache(SHELL_CACHE, req, { ignoreSearch: true }).then(h => {
    const net = fetch(req).then(r => put(SHELL_CACHE, req, r)).catch(() => null);
    if (h) return h;
    return net.then(r => r || (req.mode === 'navigate' ? fromCache(SHELL_CACHE, 'index.html') : Response.error()));
  }));
});

/* Unduh banyak berkas data untuk offline; kirim kemajuan ke halaman */
self.addEventListener('message', e => {
  const m = e.data || {};
  if (m.type !== 'precache' || !Array.isArray(m.urls)) return;
  const urls = m.urls, kind = m.kind || (/^tafsir\//.test(urls[0] || '') ? 'tafsir' : 'core'), tag = m.tag, total = urls.length;
  e.waitUntil((async () => {
    const cache = await caches.open(DATA_CACHE);
    const clients = await self.clients.matchAll({ includeUncontrolled: true });
    const tell = done => clients.forEach(c => c.postMessage({ type: 'progress', kind, tag, done, total }));
    let done = 0; tell(0);
    for (let i = 0; i < urls.length; i += 6) {
      await Promise.all(urls.slice(i, i + 6).map(async u => {
        try {
          const req = new Request(u, { cache: 'reload' });
          const r = await fetch(req);
          if (r.ok) await cache.put(req, r);
        } catch { /* lewati; coba lagi lewat tombol perbarui */ }
        done++;
      }));
      tell(done);
    }
  })());
});
