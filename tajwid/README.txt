Data warna tajwid (data/tajwid/{nomor-surah}.json)

Sumber : paket npm "react-native-quran-tajweed" v0.1.3 (MIT, (c) 2026 demk0), yang
         memproses field text_uthmani_tajweed dari Quran.com API.
Format : { "nomorAyat": [ "teks biasa", ["teks berwarna", "kode"], ... ] }
Kode   : h=hamzah wasal, l=lam syamsiyah, s=huruf tidak dibaca, n=mad thabi'i,
         p=mad jaiz, o=mad wajib muttasil, m=mad lazim, q=qalqalah, g=ghunnah,
         f=ikhfa, c=ikhfa syafawi, a=idgham bighunnah, u=idgham bilaghunnah,
         w=idgham syafawi, i=iqlab, d=idgham mutajanisain, b=idgham mutaqaribain.
Catatan: penanda tafkhim/tarqiq dari sumber tidak dipakai. Satu karakter rusak di
         QS 32:3 diperbaiki saat konversi. Lisensi sumber: lihat LICENSE-react-native-quran-tajweed.txt
