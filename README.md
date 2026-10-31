# Al-Quran

PWA Al-Qur'an yang berjalan tanpa build, tanpa server, dan **tanpa login**. Buka `index.html` lewat web server statis (mis. GitHub Pages) dan langsung dipakai. Setelah dibuka sekali, data inti tersimpan untuk offline.

## Fitur
- Pilihan mushaf di Pengaturan: Bawaan (Amiri Quran), Internasional (Mushaf Madinah, font KFGQPC Hafs), dan Kemenag (Mushaf Standar Indonesia, font LPMQ Isep Misbah), tetap berwarna tajwid.
- Teks Arab berwarna tajwid, latin, terjemahan Indonesia, arti per kata, dan tafsir (semua data ikut di repo).
- Murottal per ayat dengan banyak qari, pengulangan, kecepatan, dan unduh audio per surah.
- Mode offline: tanpa internet (mode pesawat), beranda otomatis menampilkan surah yang sudah diunduh (Teks / Tafsir / Audio). Halaman `#/offline` untuk mengelola unduhan per surah.
- Pencarian gabungan (surah, ayat `2:255`, kata, fitur), penanda, ayat hari ini.
- Video tajwid, analisis tajwid, hafalan cerdas (SM-2), makharijul huruf, latihan kosakata.
- Tuntunan sholat, As-Sunnah, Haji & Umrah, kompas kiblat, hadis (Bukhari, Muslim, Abu Dawud, Tirmidzi).
- Sirah, kisah nabi & malaikat, sahabat, sejarah Islam Indonesia, perpustakaan Islam, Tadabbur Alam.

## Susunan berkas
```
index.html            cangkang aplikasi (topbar, menu, pemutar, dialog)
app.js                logika utama dan routing (#/surah/1, #/hadis, #/sholat, ...)
kata.js, tajwid-*.js  mesin kata-per-kata dan tajwid
analisis.js, kiblat.js, makharij.js, hafalan.js, sholat.js, sunnah.js, haji.js,
offline.js + offline.css (daftar & halaman unduhan offline), hadith.js, sirah.js, nabi*.js, sahabat.js, sejarah.js, perpustakaan.js, sedekah.js,
alam*.js              modul halaman
style.css + *.css     gaya
sw.js, manifest.webmanifest, icons/   PWA dan offline
s/ tajwid/ tajwid-k/ tafsir/ data/ audio/huruf/ fonts/   data dan aset
tools/                skrip pembuat data (opsional); align-kemenag.py membuat tajwid-k/ (warna tajwid dipetakan ke teks Kemenag)
workflows/pages.yml   deploy GitHub Pages (salin ke .github/workflows/)
```

## Menjalankan lokal
```
python3 -m http.server 8000
# buka http://localhost:8000
```
Service worker butuh `https://` atau `localhost`.

## Deploy ke GitHub Pages
Salin `workflows/pages.yml` ke `.github/workflows/pages.yml`, lalu di Settings > Pages pilih sumber **GitHub Actions**.

## Catatan
- Audio murottal dan beberapa fitur Tadabbur Alam (cuaca, gempa) memakai internet.
- Setelah mengubah berkas aplikasi, naikkan `VER` di `sw.js` supaya cache lama diganti.
- Font mushaf dan lisensinya: lihat `fonts/LICENSE-fonts.txt`.
- Sumber data dan lisensi: lihat `tools/build-data.py` dan `tajwid/README.txt`.
