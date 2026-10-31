/* Sirah Nabawiyah: linimasa lengkap kelahiran hingga wafat Nabi ﷺ, per fase, dengan pencarian,
 * penanda sudah dibaca, tautan ke surah & hadis terkait (offline), dan kuis otomatis. */
window.makeSirahView = function (d) {
  const { $, esc, view, setTitle, store } = d;
  const PH = { lahir: ['🌱', 'Kelahiran & masa muda'], mekah: ['🕋', 'Dakwah di Mekah'], hijrah: ['🐪', 'Hijrah & Madinah'], perang: ['⚔️', 'Perang & perjanjian'], fath: ['🌅', 'Kemenangan & akhir hayat'] };
  /* id, fase, tahun, judul, isi, surah terkait, kata kunci hadis */
  const E = [
    ['gajah', 'lahir', '570 M', 'Tahun Gajah & kelahiran Nabi ﷺ', 'Muhammad ﷺ lahir pada Senin, 12 Rabiul Awal di Mekah, dari Abdullah bin Abdul Muthalib dan Aminah binti Wahb; ayahnya wafat sebelum beliau lahir. Pada tahun itu pasukan gajah Abrahah gagal menghancurkan Ka\'bah.', 105, 'hari senin'],
    ['halimah', 'lahir', '570-574 M', 'Disusui Halimah di Bani Sa\'d', 'Sesuai adat Arab, bayi Muhammad disusukan di pedalaman. Di sana dua malaikat membelah dadanya dan membersihkan hatinya.', 94, ''],
    ['yatim', 'lahir', '576-578 M', 'Yatim piatu, diasuh Abdul Muthalib lalu Abu Thalib', 'Ibunya wafat di Abwa saat beliau enam tahun, kakeknya wafat dua tahun kemudian. Sejak itu pamannya, Abu Thalib, mengasuh dan melindunginya.', 93, 'anak yatim'],
    ['amin', 'lahir', '±582-595 M', 'Berdagang dan digelari Al-Amin', 'Beliau ikut ke Syam bersama Abu Thalib dan bertemu pendeta Bahira. Dewasa, beliau berdagang dengan jujur hingga dijuluki Al-Amin (yang tepercaya) dan menyaksikan Hilful Fudhul untuk membela yang tertindas.', 0, 'jujur'],
    ['khadijah', 'lahir', '595 M', 'Menikah dengan Khadijah', 'Pada usia 25 tahun beliau menikah dengan Khadijah binti Khuwailid, saudagar mulia berusia 40 tahun. Dari pernikahan ini lahir Qasim, Abdullah, Zainab, Ruqayyah, Ummu Kultsum, dan Fathimah.', 0, 'khadijah'],
    ['hajar', 'lahir', '605 M', 'Peletakan Hajar Aswad', 'Saat Quraisy berselisih siapa yang meletakkan Hajar Aswad, beliau menyelesaikannya dengan membentangkan kain dan meminta tiap kabilah memegang ujungnya.', 0, 'hajar aswad'],
    ['wahyu', 'mekah', '610 M', 'Wahyu pertama di Gua Hira', 'Pada usia 40 tahun, di bulan Ramadhan, Jibril datang dan menyampaikan "Iqra\'". Beliau pulang gemetar dan ditenangkan Khadijah, lalu Waraqah bin Naufal membenarkan kenabiannya.', 96, 'permulaan wahyu'],
    ['sirr', 'mekah', '610-613 M', 'Dakwah sembunyi-sembunyi', 'Selama sekitar tiga tahun beliau berdakwah secara diam-diam. Yang pertama beriman: Khadijah, Ali bin Abi Thalib, Zaid bin Haritsah, dan Abu Bakar yang kemudian mengajak tokoh-tokoh seperti Utsman, Zubair, dan Abdurrahman bin Auf.', 74, ''],
    ['jahr', 'mekah', '613 M', 'Dakwah terang-terangan', 'Setelah turun perintah untuk memperingatkan kerabat terdekat, beliau naik ke Bukit Shafa dan menyeru Quraisy. Siksaan pun menimpa kaum lemah: Bilal, keluarga Yasir, Khabbab; Sumayyah menjadi syahidah pertama.', 26, 'bilal'],
    ['habasyah', 'mekah', '615 M', 'Hijrah ke Habasyah', 'Sekelompok sahabat dipimpin Ja\'far bin Abi Thalib berhijrah ke Habasyah. Raja Najasyi melindungi mereka setelah mendengar surah Maryam.', 19, 'najasyi'],
    ['boikot', 'mekah', '616-619 M', 'Pemboikotan Bani Hasyim', 'Quraisy memboikot Bani Hasyim dan Bani Muthalib di lembah Abu Thalib selama kurang lebih tiga tahun hingga lembaran perjanjiannya dimakan rayap.', 0, ''],
    ['huzn', 'mekah', '619 M', "'Amul Huzn (tahun duka cita)", 'Abu Thalib dan Khadijah wafat berselang beberapa hari. Pembela dan penenang beliau pergi, dan gangguan Quraisy makin keras.', 0, 'khadijah'],
    ['thaif', 'mekah', '619-620 M', 'Dakwah ke Thaif', 'Penduduk Thaif menolak dan melempari beliau dengan batu. Beliau berdoa penuh kelembutan, menolak menimpakan gunung kepada mereka, dan berharap dari keturunan mereka lahir orang yang menyembah Allah.', 0, 'thaif'],
    ['isra', 'mekah', '±621 M', "Isra' Mi'raj & kewajiban sholat", "Dalam satu malam beliau diperjalankan dari Masjidil Haram ke Masjidil Aqsha, lalu naik ke langit. Di sana diwajibkan sholat lima waktu.", 17, "isra"],
    ['aqabah', 'mekah', '621-622 M', 'Baiat Aqabah I & II', 'Dua belas lalu tujuh puluh tiga orang Madinah (Aus dan Khazraj) berbaiat melindungi Nabi ﷺ. Mush\'ab bin Umair diutus mengajar mereka.', 0, 'baiat'],
    ['hijrah', 'hijrah', '622 M / 1 H', 'Hijrah ke Madinah', 'Beliau berangkat bersama Abu Bakar, bersembunyi tiga hari di Gua Tsur, menghindari kejaran Suraqah, singgah membangun Masjid Quba, lalu tiba di Madinah disambut kaum Anshar. Tahun inilah awal penanggalan Hijriah.', 9, 'hijrah'],
    ['madinah', 'hijrah', '1 H', 'Masjid Nabawi, persaudaraan & Piagam Madinah', 'Beliau membangun masjid, mempersaudarakan Muhajirin dan Anshar, dan menetapkan Piagam Madinah yang menjamin hak semua warga, termasuk Yahudi, dalam satu tatanan.', 59, 'persaudaraan'],
    ['kiblat', 'hijrah', '2 H', 'Pindah kiblat & puasa Ramadhan', 'Kiblat berpindah dari Baitul Maqdis ke Ka\'bah. Pada tahun yang sama puasa Ramadhan dan zakat fitrah diwajibkan.', 2, 'kiblat'],
    ['badar', 'perang', '2 H / 624 M', 'Perang Badar', 'Pada 17 Ramadhan, sekitar 313 kaum muslimin mengalahkan sekitar seribu pasukan Quraisy. Tujuh puluh musuh tewas dan tujuh puluh ditawan; tawanan yang pandai menulis menebus diri dengan mengajar anak-anak Madinah.', 8, 'badar'],
    ['uhud', 'perang', '3 H / 625 M', 'Perang Uhud', 'Kemenangan awal berubah ketika pemanah meninggalkan bukit demi harta rampasan. Hamzah dan tujuh puluh sahabat syahid, dan Nabi ﷺ terluka. Pelajarannya: taat penuh pada perintah pemimpin.', 3, 'uhud'],
    ['nadhir', 'perang', '4 H', "Pengusiran Bani Nadhir & Bi'r Ma'unah", 'Bani Nadhir berkhianat dengan merencanakan pembunuhan Nabi ﷺ lalu diusir dari Madinah. Pada tahun yang sama tujuh puluh penghafal Al-Qur\'an dibunuh secara licik di Bi\'r Ma\'unah.', 59, ''],
    ['khandaq', 'perang', '5 H / 627 M', 'Perang Khandaq (Ahzab)', 'Sekitar sepuluh ribu pasukan sekutu mengepung Madinah. Atas usul Salman Al-Farisi, parit digali, lalu badai dari Allah memporak-porandakan pasukan musuh.', 33, 'khandaq'],
    ['quraizhah', 'perang', '5 H', 'Pengepungan Bani Quraizhah', 'Bani Quraizhah melanggar perjanjian dengan membantu musuh saat Khandaq, lalu dikepung dan dihukum sesuai keputusan Sa\'d bin Mu\'adz.', 33, ''],
    ['hudaibiyah', 'perang', '6 H / 628 M', 'Perjanjian Hudaibiyah', 'Ketika berangkat umrah, beliau dihadang Quraisy. Setelah Baiat Ridwan, disepakati gencatan senjata sepuluh tahun. Tampak seperti kekalahan, tetapi Allah menyebutnya kemenangan nyata dan Islam menyebar pesat.', 48, 'hudaibiyah'],
    ['surat', 'perang', '7 H', 'Surat kepada para raja & Perang Khaibar', 'Beliau mengirim surat dakwah kepada Kaisar Romawi, Kisra Persia, Raja Habasyah, dan Muqauqis. Setelah itu benteng Yahudi Khaibar ditaklukkan, dan beliau menunaikan umrah qadha.', 48, 'khaibar'],
    ['mutah', 'perang', '8 H', "Perang Mu'tah", 'Tiga ribu muslim menghadapi pasukan Romawi yang jauh lebih besar. Zaid bin Haritsah, Ja\'far bin Abi Thalib, dan Abdullah bin Rawahah gugur berurutan, dan Khalid bin Walid menyelamatkan pasukan.', 0, "mu'tah"],
    ['fath', 'fath', '8 H / 630 M', 'Fathu Makkah (penaklukan Mekah)', 'Setelah Quraisy melanggar perjanjian, sepuluh ribu pasukan memasuki Mekah hampir tanpa pertumpahan darah. Berhala dihancurkan, dan beliau memaafkan musuh-musuhnya: "Pergilah kalian, kalian bebas."', 110, 'fathu makkah'],
    ['hunain', 'fath', '8 H', 'Perang Hunain & pengepungan Thaif', 'Pasukan Hawazin dan Tsaqif menyerang di lembah Hunain. Kaum muslimin sempat goyah karena membanggakan jumlah, lalu menang setelah Nabi ﷺ teguh memanggil pasukannya.', 9, 'hunain'],
    ['tabuk', 'fath', '9 H / 630 M', 'Perang Tabuk & tahun delegasi', 'Beliau memimpin tiga puluh ribu pasukan dalam kesulitan besar menuju perbatasan Romawi. Tiga sahabat yang absen diboikot lima puluh hari hingga taubat mereka diterima. Setelah itu delegasi dari seluruh Arab datang masuk Islam.', 9, 'tabuk'],
    ['wada', 'fath', '10 H / 632 M', 'Haji Wada\' & khutbah Arafah', 'Di hadapan puluhan ribu sahabat beliau menegaskan kehormatan darah dan harta, hak perempuan, larangan riba, dan berpegang pada Kitabullah dan Sunnah. Turun ayat: "Hari ini Aku sempurnakan agamamu."', 5, 'haji wada'],
    ['wafat', 'fath', '11 H / 632 M', 'Wafatnya Rasulullah ﷺ', 'Beliau sakit beberapa hari, menunjuk Abu Bakar mengimami sholat, lalu wafat pada Senin, 12 Rabiul Awal dalam usia 63 tahun di pangkuan Aisyah. Abu Bakar menenangkan umat: siapa menyembah Allah, Allah Maha Hidup tidak akan mati.', 3, 'wafat nabi']
  ];
  const read = () => new Set(store.get('sirahRead', []));
  const hd = cur => `<section class="hd-hero"><p class="hd-bis" lang="ar" dir="rtl">لَقَدْ كَانَ لَكُمْ فِي رَسُولِ اللَّهِ أُسْوَةٌ حَسَنَةٌ</p><h1>Sirah Nabawiyah</h1><p>Perjalanan hidup Nabi ﷺ dari kelahiran hingga wafat, ${E.length} peristiwa kunci.</p></section><nav class="hd-tabs">${[['linimasa', 'Linimasa'], ['kuis', 'Kuis']].map(([k, l]) => `<a class="chip ${cur === k ? 'active' : ''}" href="#/sirah/${k}">${l}</a>`).join('')}</nav>`;
  const card = (x, done) => `<article class="sr-ev ${done ? 'done' : ''}" data-id="${x[0]}"><span class="sr-yr">${esc(x[2])}</span><br><b>${esc(x[3])}</b><p>${esc(x[4])}</p><div class="hd-acts">${x[5] ? `<a class="btn sm" href="#/surah/${x[5]}">📖 Surah terkait</a>` : ''}${x[6] ? `<a class="btn sm" href="#/hadis/cari?q=${encodeURIComponent(x[6])}">📜 Hadis</a>` : ''}<button class="btn sm" data-act="r">${done ? '✓ Sudah dibaca' : 'Tandai dibaca'}</button></div></article>`;

  function linimasa(q) {
    const r = read(), kw = (q.get('q') || '').toLowerCase().trim(), ph = q.get('f') || '';
    const list = E.filter(x => (!ph || x[1] === ph) && (!kw || (x[3] + x[4] + x[2]).toLowerCase().includes(kw)));
    const pct = Math.round(E.filter(x => r.has(x[0])).length / E.length * 100);
    view.innerHTML = hd('linimasa') + `<div class="card"><b>${pct}% selesai dibaca</b><div class="sr-bar"><i style="width:${pct}%"></i></div></div>
      <form class="hd-search" id="srf"><input id="srq" type="search" placeholder="Cari peristiwa (badar, hijrah, 622…)" value="${esc(kw)}"><button class="btn">Cari</button></form>
      <nav class="hd-tabs">${[['', 'Semua'], ...Object.entries(PH).map(([k, v]) => [k, v[1]])].map(([k, t]) => `<a class="chip ${ph === k ? 'active' : ''}" href="#/sirah/linimasa?f=${k}${kw ? '&q=' + encodeURIComponent(kw) : ''}">${t}</a>`).join('')}</nav>` +
      (Object.keys(PH).map(k => { const xs = list.filter(x => x[1] === k); return xs.length ? `<p class="mini-title hd-sec sr-ph">${PH[k][0]} ${PH[k][1]}</p>${xs.map(x => card(x, r.has(x[0]))).join('')}` : ''; }).join('') || '<p class="muted">Tidak ada peristiwa yang cocok.</p>') +
      '<p class="muted small hd-note">Tahun dan urutan mengikuti pendapat yang masyhur di kalangan ahli sirah; sebagian rincian berbeda di antara riwayat. Rujuk kitab seperti Ar-Rahiq Al-Makhtum untuk kajian mendalam.</p>';
    $('#srf').onsubmit = e => { e.preventDefault(); location.hash = `#/sirah/linimasa?f=${ph}&q=${encodeURIComponent($('#srq').value)}`; };
    view.onclick = e => {
      const b = e.target.closest('[data-act="r"]'); if (!b) return;
      const id = b.closest('.sr-ev').dataset.id, s = read(); s.has(id) ? s.delete(id) : s.add(id);
      store.set('sirahRead', [...s]); const y = scrollY; linimasa(q); scrollTo(0, y);
    };
  }

  /* kuis otomatis dari data: "kapan?" dan "peristiwa mana?" */
  let Q = null, n = 0, score = 0;
  const shuf = a => a.map(v => [Math.random(), v]).sort((p, c) => p[0] - c[0]).map(p => p[1]);
  function kuis() {
    if (!Q) { Q = shuf(E).slice(0, 8); n = 0; score = 0; }
    if (n >= Q.length) {
      view.innerHTML = hd('kuis') + `<div class="card"><h2>Skor: ${score}/${Q.length}</h2><p class="muted">${score >= 7 ? 'Masya Allah, pemahaman sirahmu kuat!' : 'Baca lagi linimasa lalu coba kembali.'}</p><button class="btn" id="again">Ulangi</button></div>`;
      $('#again').onclick = () => { Q = null; kuis(); }; return;
    }
    const x = Q[n], ops = shuf([x, ...shuf(E.filter(y => y[2] !== x[2])).slice(0, 3)]);
    view.innerHTML = hd('kuis') + `<div class="card sr-q"><p class="muted small">Soal ${n + 1} dari ${Q.length}</p><p><b>Kapan peristiwa "${esc(x[3])}" terjadi?</b></p>${ops.map(o => `<button data-y="${esc(o[2])}">${esc(o[2])}</button>`).join('')}<p id="fb" class="muted"></p></div>`;
    view.onclick = e => {
      const b = e.target.closest('button[data-y]'); if (!b || view.dataset.lock) return;
      const ok = b.dataset.y === x[2]; if (ok) score++;
      b.classList.add(ok ? 'ok' : 'no'); view.querySelectorAll('button[data-y]').forEach(t => { if (t.dataset.y === x[2]) t.classList.add('ok'); });
      $('#fb').innerHTML = `${ok ? '✅ Benar.' : '❌ Kurang tepat.'} ${esc(x[4].split('. ')[0])}. <button class="btn sm" id="nx">Lanjut</button>`;
      view.dataset.lock = 1; $('#nx').onclick = () => { delete view.dataset.lock; n++; kuis(); };
    };
  }

  return function (tab, q) {
    setTitle('Sirah Nabawiyah', true);
    view.onclick = null; delete view.dataset.lock;
    return tab === 'kuis' ? kuis() : linimasa(q);
  };
};
