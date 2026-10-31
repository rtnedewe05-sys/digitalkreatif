/* Halaman Sedekah: QRIS, ayat tentang sedekah. Tanpa login, tanpa server. */
window.makeSedekahView = function (d) {
  const { $, esc, view, setTitle, toast } = d;
  const AYAT = [
 {
  "t": "Dilipatgandakan tujuh ratus kali",
  "ar": "مَثَلُ الَّذِيْنَ يُنْفِقُوْنَ اَمْوَالَهُمْ فِيْ سَبِيْلِ اللّٰهِ كَمَثَلِ حَبَّةٍ اَنْۢبَتَتْ سَبْعَ سَنَابِلَ فِيْ كُلِّ سُنْۢبُلَةٍ مِّائَةُ حَبَّةٍ ۗ وَاللّٰهُ يُضٰعِفُ لِمَنْ يَّشَاۤءُ ۗوَاللّٰهُ وَاسِعٌ عَلِيْمٌ",
  "id": "Perumpamaan orang-orang yang menginfakkan hartanya di jalan Allah adalah seperti (orang-orang yang menabur) sebutir biji (benih) yang menumbuhkan tujuh tangkai, pada setiap tangkai ada seratus biji. Allah melipatgandakan (pahala) bagi siapa yang Dia kehendaki. Allah Maha Luas lagi Maha Mengetahui.",
  "ref": "QS. Al-Baqarah [2]: 261",
  "s": 2,
  "a": 261
 },
 {
  "t": "Allah yang menggantinya",
  "ar": "قُلْ اِنَّ رَبِّيْ يَبْسُطُ الرِّزْقَ لِمَنْ يَّشَاۤءُ مِنْ عِبَادِهٖ وَيَقْدِرُ لَهٗ  ۗوَمَآ اَنْفَقْتُمْ مِّنْ شَيْءٍ فَهُوَ يُخْلِفُهٗ ۚوَهُوَ خَيْرُ الرّٰزِقِيْنَ",
  "id": "Katakanlah (Nabi Muhammad), “Sesungguhnya Tuhanku melapangkan rezeki kepada siapa yang Dia kehendaki di antara hamba-hamba-Nya dan menyempitkannya.” Suatu apa pun yang kamu infakkan pasti Dia akan menggantinya. Dialah sebaik-baik pemberi rezeki.",
  "ref": "QS. Saba’ [34]: 39",
  "s": 34,
  "a": 39
 },
 {
  "t": "Jalan menuju kebajikan",
  "ar": "لَنْ تَنَالُوا الْبِرَّ حَتّٰى تُنْفِقُوْا مِمَّا تُحِبُّوْنَ ۗوَمَا تُنْفِقُوْا مِنْ شَيْءٍ فَاِنَّ اللّٰهَ بِهٖ عَلِيْمٌ",
  "id": "Kamu sekali-kali tidak akan memperoleh kebajikan (yang sempurna) sebelum kamu menginfakkan sebagian harta yang kamu cintai. Apa pun yang kamu infakkan, sesungguhnya Allah Maha Mengetahui tentangnya.",
  "ref": "QS. Ali ‘Imran [3]: 92",
  "s": 3,
  "a": 92
 },
 {
  "t": "Pahala di sisi Rabb",
  "ar": "اَلَّذِيْنَ يُنْفِقُوْنَ اَمْوَالَهُمْ بِالَّيْلِ وَالنَّهَارِ سِرًّا وَّعَلَانِيَةً فَلَهُمْ اَجْرُهُمْ عِنْدَ رَبِّهِمْۚ  وَلَا خَوْفٌ عَلَيْهِمْ وَلَا هُمْ يَحْزَنُوْنَ",
  "id": "Orang-orang yang menginfakkan hartanya pada malam dan siang hari, baik secara rahasia maupun terang-terangan, mereka mendapat pahala di sisi Tuhannya. Tidak ada rasa takut pada mereka dan tidak (pula) mereka bersedih.",
  "ref": "QS. Al-Baqarah [2]: 274",
  "s": 2,
  "a": 274
 },
 {
  "t": "Menyembunyikan lebih baik",
  "ar": "اِنْ تُبْدُوا الصَّدَقٰتِ فَنِعِمَّا هِيَۚ وَاِنْ تُخْفُوْهَا وَتُؤْتُوْهَا الْفُقَرَاۤءَ فَهُوَ خَيْرٌ لَّكُمْ ۗ وَيُكَفِّرُ عَنْكُمْ مِّنْ سَيِّاٰتِكُمْ ۗ وَاللّٰهُ بِمَا تَعْمَلُوْنَ خَبِيْرٌ",
  "id": "Jika kamu menampakkan sedekahmu, itu baik. (Akan tetapi,) jika kamu menyembunyikannya dan memberikannya kepada orang-orang fakir, itu lebih baik bagimu. Allah akan menghapus sebagian kesalahanmu. Allah Maha Teliti terhadap apa yang kamu kerjakan.",
  "ref": "QS. Al-Baqarah [2]: 271",
  "s": 2,
  "a": 271
 },
 {
  "t": "Pinjaman yang baik untuk Allah",
  "ar": "اِنَّ الْمُصَّدِّقِيْنَ وَالْمُصَّدِّقٰتِ وَاَقْرَضُوا اللّٰهَ قَرْضًا حَسَنًا يُّضٰعَفُ لَهُمْ وَلَهُمْ اَجْرٌ كَرِيْمٌ",
  "id": "Sesungguhnya orang-orang yang bersedekah, baik laki-laki maupun perempuan, dan meminjamkan (kepada) Allah pinjaman yang baik, akan dilipatgandakan (balasannya) kepada mereka dan baginya (diberikan) ganjaran yang sangat mulia (surga).",
  "ref": "QS. Al-Hadid [57]: 18",
  "s": 57,
  "a": 18
 }
];
  const QUOTES = [
    ['Dulu Al-Qur’an dijaga dari lisan ke lisan. Hari ini ia juga bisa dijaga dari layar ke layar, dan itu butuh tangan-tangan yang mau menolong.', ''],
    ['Satu ayat yang dibaca ulang di tengah malam, satu anak yang belajar huruf hijaiyah dari ponsel ibunya. Sedekahmu ikut menemani mereka.', ''],
    ['Sedekah tidak mengurangi harta. Ia menumbuhkannya dengan cara yang tidak kita sangka.', ''],
    ['Yang kita titipkan untuk Al-Qur’an hari ini akan kita temui kembali, di hari ketika hanya amal yang berbicara.', '']
  ];
  const card = (o, kind) => `<article class="card sd-q">
      <h3>${esc(o.t)}</h3>
      <p class="sd-ar" dir="rtl" lang="ar">${esc(o.ar)}</p>
      <p class="sd-id">${esc(o.id)}</p>
      <div class="sd-foot"><span class="sd-ref">${esc(o.ref)}</span>
        <span class="btn-row"><button class="btn" data-copy="${kind}${o.i}">Salin</button>${o.s ? `<a class="btn" href="#/surah/${o.s}?a=${o.a}">Buka ayat</a>` : ''}</span></div>
    </article>`;
  AYAT.forEach((o, i) => { o.i = i; });
  return function () {
    setTitle('Sedekah', true);
    const q = QUOTES[new Date().getDate() % QUOTES.length][0];
    view.innerHTML = `<section class="card sd-hero">
        <p class="sd-bis" dir="rtl" lang="ar">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
        <h2>Ikut menjaga cahaya Al-Qur’an di genggaman</h2>
        <p class="sd-lead">${esc(q)}</p>
      </section>
      <section class="card sd-why">
        <h2>Untuk apa sedekah ini?</h2>
        <p>Aplikasi ini dikembangkan oleh <b>Digital &amp; Kreatif</b> agar Al-Qur’an mudah dibaca, dipahami, dan dipelajari oleh siapa saja, di mana saja, kapan saja, bahkan tanpa sinyal, dan tetap bisa dipakai gratis.</p>
        <p>Syiar Al-Qur’an di zaman ini tidak lagi hanya di mimbar dan majelis. Ia juga ada di ponsel yang kita genggam setiap hari. Menjaganya tetap rapi, cepat, dan terus tumbuh butuh biaya dan tenaga: pengembangan fitur baru, pemeriksaan data, perawatan, dan penyediaan tempat agar aplikasi ini bisa diakses semua orang.</p>
        <p>Sedekah yang terkumpul dipakai untuk biaya pengembangan dan perawatan itu. Setiap bacaan, pelajaran, dan kebaikan yang lahir dari aplikasi ini semoga menjadi <b>ilmu yang bermanfaat</b> dan pahala yang terus mengalir bagi kita semua. Nabi ﷺ bersabda bahwa ketika seseorang wafat, amalnya terputus kecuali tiga: sedekah jariyah, ilmu yang bermanfaat, dan anak saleh yang mendoakannya (HR. Muslim).</p>
      </section>
      <section class="card sd-qris">
        <h2>Bersedekah lewat QRIS</h2>
        <p class="muted small">Scan memakai GoPay, ShopeePay, DANA, OVO, m-banking BCA, Mandiri, BNI, BRI, atau aplikasi pembayaran QRIS lainnya. Nominal bebas, sekecil apa pun bernilai di sisi Allah.</p>
        <a href="icons/qris.jpg" target="_blank" rel="noopener" class="sd-img-link" aria-label="Buka QRIS ukuran penuh"><img src="icons/qris.jpg" alt="QRIS Digital dan Kreatif, NMID ID1025463598025" class="sd-img" width="450" height="638"></a>
        <p class="sd-nm"><b>DIGITAL &amp; KREATIF</b><br><span class="muted small">NMID: ID1025463598025</span></p>
        <div class="btn-row" style="justify-content:center">
          <a class="btn primary" href="icons/qris.jpg" download="QRIS-sedekah.jpg">Simpan gambar QRIS</a>
          <button class="btn" id="sdNmid">Salin NMID</button>
        </div>
        <ol class="sd-how small">
          <li>Simpan gambar QRIS atau scan langsung dari layar ini.</li>
          <li>Buka aplikasi dompet digital atau m-banking, pilih Scan QRIS.</li>
          <li>Masukkan nominal, periksa nama merchant, lalu bayar.</li>
          <li>Luruskan niat karena Allah. Bersedekah itu sukarela; aplikasi ini tetap bisa dipakai tanpa harus bersedekah.</li>
        </ol>
      </section>
      <h2 class="sd-h">Ayat tentang sedekah</h2>${AYAT.map(o => card(o, 'a')).join('')}
      <div class="card sd-dua"><p dir="rtl" lang="ar" class="sd-ar">اللَّهُمَّ بَارِكْ لَنَا فِيمَا رَزَقْتَنَا</p><p class="muted small" style="margin:0">Ya Allah, berkahilah rezeki yang Engkau berikan kepada kami.</p></div>
      <div class="card sd-dua"><p class="sd-id" style="margin:0 0 6px"><b>Jazakumullahu khairan.</b></p><p class="muted small" style="margin:0">Semoga Allah membalas kebaikanmu dengan yang lebih baik, melapangkan rezekimu, dan menjadikan setiap ayat yang kamu baca di sini sebagai cahaya bagimu dan keluargamu.</p></div>`;
    view.onclick = e => {
      const b = e.target.closest('[data-copy]');
      if (b) {
        const o = AYAT[+b.dataset.copy.slice(1)];
        const t = `${o.ar}\n\n${o.id}\n\n(${o.ref})`;
        (navigator.clipboard ? navigator.clipboard.writeText(t) : Promise.reject()).then(() => toast('Disalin'), () => toast('Gagal menyalin'));
        return;
      }
      if (e.target.closest('#sdNmid')) (navigator.clipboard ? navigator.clipboard.writeText('ID1025463598025') : Promise.reject()).then(() => toast('NMID disalin'), () => toast('Gagal menyalin'));
    };
  };
};
