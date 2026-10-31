/* Perpustakaan Islam: daftar kitab pilihan per kategori. Setiap kitab ditautkan ke pencarian di sumber yang sah
 * (IslamHouse.com, Internet Archive, Wikisource) dan ke terjemahan otomatis Google Translate untuk halaman web.
 * Aplikasi tidak menyimpan atau membagikan berkas buku; unduhan berasal langsung dari situs sumbernya. */
window.makePustakaView = function (d) {
  const { $, esc, view, setTitle, store, toast } = d;
  const CAT = {
    sirah: ['🕋', 'Sirah Nabi Muhammad ﷺ'],
    nabi: ['🌙', 'Kisah nabi-nabi'],
    hadis: ['📜', 'Hadis'],
    tafsir: ['📖', "Tafsir Al-Qur'an"],
    akidah: ['🧭', 'Akidah & tauhid'],
    fikih: ['⚖️', 'Fikih & ibadah'],
    akhlak: ['🌿', 'Akhlak & tasawuf'],
    sejarah: ['🏛️', 'Sejarah Islam & Nusantara']
  };
  /* id, kategori, judul Indonesia, judul Arab/asli, pengarang, deskripsi, kata kunci Indonesia, kata kunci Arab, sorotan */
  const B = [
    ['rahiq', 'sirah', 'Sirah Nabawiyah: Ar-Rahiq Al-Makhtum', 'الرحيق المختوم', 'Syekh Shafiyyurrahman Al-Mubarakfuri', 'Ringkasan sirah paling populer; pemenang lomba penulisan sirah Rabithah Alam Islami (1976). Sangat cocok sebagai buku pertama.', 'ar-rahiq al-makhtum sirah nabawiyah', 'الرحيق المختوم', 1],
    ['hisham', 'sirah', 'Sirah Ibnu Hisyam', 'السيرة النبوية لابن هشام', 'Ibnu Hisyam (wafat 213 H)', 'Sumber klasik sirah, berdasarkan karya Ibnu Ishaq.', 'sirah ibnu hisyam', 'سيرة ابن هشام', 0],
    ['zad', 'sirah', "Zadul Ma'ad", 'زاد المعاد في هدي خير العباد', 'Ibnul Qayyim Al-Jauziyyah', 'Petunjuk Nabi ﷺ dalam ibadah, muamalah, pengobatan, dan akhlak, sambil menelusuri perjalanan hidup beliau.', "zadul ma'ad ibnul qayyim", 'زاد المعاد', 1],
    ['syamail', 'sirah', "Asy-Syama'il Al-Muhammadiyyah", 'الشمائل المحمدية', 'Imam At-Tirmidzi', 'Kumpulan hadis tentang bentuk fisik, akhlak, makan, tidur, dan kebiasaan Nabi ﷺ.', 'syamail muhammadiyah tirmidzi', 'الشمائل المحمدية', 0],
    ['syifa', 'sirah', "Asy-Syifa bi Ta'rifi Huquqil Mushthafa", 'الشفا بتعريف حقوق المصطفى', 'Qadhi Iyadh', 'Pembahasan hak, keistimewaan, dan kemuliaan Nabi ﷺ.', 'asy-syifa qadhi iyadh', 'الشفا بتعريف حقوق المصطفى', 0],
    ['sirahkatsir', 'sirah', 'As-Sirah An-Nabawiyyah', 'السيرة النبوية لابن كثير', 'Ibnu Katsir', 'Sirah yang disusun dengan menelaah sanad riwayat.', 'sirah nabawiyah ibnu katsir', 'السيرة النبوية ابن كثير', 0],
    ['fiqhsirah', 'sirah', 'Fiqhus Sirah', 'فقه السيرة', "Muhammad Al-Ghazali / Sa'id Ramadhan Al-Buthi", 'Mengambil hikmah dan pelajaran hukum dari peristiwa-peristiwa sirah.', 'fiqhus sirah', 'فقه السيرة', 0],
    ['qasasanbiya', 'nabi', 'Kisah Para Nabi (Qashashul Anbiya)', 'قصص الأنبياء', 'Ibnu Katsir', 'Kisah Adam hingga Isa ‘alaihimussalam dengan rujukan Al-Qur\'an dan hadis. Bacaan klasik yang paling sering dicetak.', 'kisah para nabi ibnu katsir', 'قصص الأنبياء ابن كثير', 1],
    ['bidayah', 'nabi', 'Al-Bidayah wan Nihayah', 'البداية والنهاية', 'Ibnu Katsir', 'Sejarah besar sejak penciptaan, kisah para nabi, sirah, hingga akhir zaman.', 'al-bidayah wan nihayah', 'البداية والنهاية', 1],
    ['najjar', 'nabi', 'Qashashul Anbiya', 'قصص الأنبياء للنجار', 'Abdul Wahhab An-Najjar', 'Kisah para nabi dalam bahasa yang ringan.', 'qashashul anbiya najjar', 'قصص الأنبياء النجار', 0],
    ['arbain', 'hadis', "Al-Arba'in An-Nawawiyyah", 'الأربعون النووية', 'Imam An-Nawawi', 'Empat puluh dua hadis pokok agama; kitab pertama yang biasa dihafal.', 'arbain nawawi', 'الأربعون النووية', 1],
    ['riyadh', 'hadis', 'Riyadhus Shalihin', 'رياض الصالحين', 'Imam An-Nawawi', 'Kumpulan hadis akhlak dan ibadah yang disusun per bab, populer di pengajian seluruh Indonesia.', 'riyadhus shalihin', 'رياض الصالحين', 1],
    ['bulugh', 'hadis', 'Bulughul Maram', 'بلوغ المرام', 'Ibnu Hajar Al-Asqalani', 'Hadis-hadis hukum fikih beserta derajatnya; bahan dasar belajar fikih dalil.', 'bulughul maram', 'بلوغ المرام', 1],
    ['umdah', 'hadis', "Umdatul Ahkam", 'عمدة الأحكام', 'Abdul Ghani Al-Maqdisi', 'Hadis hukum yang disepakati Bukhari dan Muslim.', 'umdatul ahkam', 'عمدة الأحكام', 0],
    ['azkar', 'hadis', 'Al-Adzkar', 'الأذكار', 'Imam An-Nawawi', 'Dzikir dan doa harian sesuai sunnah.', 'al-adzkar nawawi', 'الأذكار النووي', 0],
    ['katsir', 'tafsir', 'Tafsir Ibnu Katsir', 'تفسير القرآن العظيم', 'Ibnu Katsir', "Tafsir bil ma'tsur yang menjelaskan ayat dengan ayat, hadis, dan atsar sahabat.", 'tafsir ibnu katsir', 'تفسير ابن كثير', 1],
    ['sadi', 'tafsir', "Tafsir As-Sa'di", 'تيسير الكريم الرحمن', "Syekh Abdurrahman As-Sa'di", 'Tafsir ringkas, jelas, dan sarat faedah; cocok untuk pemula.', "tafsir as-sa'di", 'تيسير الكريم الرحمن', 1],
    ['jalalain', 'tafsir', 'Tafsir Jalalain', 'تفسير الجلالين', 'Jalaluddin Al-Mahalli & As-Suyuthi', 'Tafsir ringkas yang diajarkan hampir di seluruh pesantren.', 'tafsir jalalain', 'تفسير الجلالين', 0],
    ['azhar', 'tafsir', 'Tafsir Al-Azhar', 'تفسير الأزهر', 'Buya Hamka', 'Tafsir bahasa Indonesia dengan gaya sastra dan perhatian pada masalah umat Nusantara.', 'tafsir al-azhar hamka', '', 1],
    ['tauhid', 'akidah', 'Kitab Tauhid', 'كتاب التوحيد', 'Muhammad bin Abdul Wahhab', 'Pokok-pokok tauhid uluhiyah beserta dalilnya.', 'kitab tauhid', 'كتاب التوحيد', 0],
    ['thahawiyah', 'akidah', 'Aqidah Thahawiyah', 'العقيدة الطحاوية', 'Imam Ath-Thahawi', 'Ringkasan akidah Ahlus Sunnah yang diajarkan luas di dunia Islam.', 'aqidah thahawiyah', 'العقيدة الطحاوية', 0],
    ['tsalatsah', 'akidah', 'Tiga Landasan Utama', 'الأصول الثلاثة', 'Muhammad bin Abdul Wahhab', 'Mengenal Allah, agama, dan Nabi; ringkas dan mudah dihafal.', 'tiga landasan utama', 'ثلاثة الأصول', 0],
    ['fiqhsunnah', 'fikih', 'Fiqih Sunnah', 'فقه السنة', 'Sayyid Sabiq', 'Fikih dengan dalil dari Al-Qur\'an dan hadis, ditulis ringkas dan sistematis.', 'fiqih sunnah sayyid sabiq', 'فقه السنة', 1],
    ['bidayatul', 'fikih', 'Bidayatul Mujtahid', 'بداية المجتهد', 'Ibnu Rusyd', 'Perbandingan pendapat para imam mazhab beserta sebab perbedaannya.', 'bidayatul mujtahid', 'بداية المجتهد', 0],
    ['fathulqarib', 'fikih', 'Fathul Qarib', 'فتح القريب المجيب', 'Ibnu Qasim Al-Ghazzi', 'Fikih mazhab Syafi\'i yang dipelajari di pesantren.', 'fathul qarib', 'فتح القريب', 0],
    ['minhaj', 'fikih', 'Minhajul Muslim', 'منهاج المسلم', 'Abu Bakar Jabir Al-Jazairi', 'Panduan akidah, adab, ibadah, dan muamalah sehari-hari.', 'minhajul muslim', 'منهاج المسلم', 0],
    ['ihya', 'akhlak', 'Ihya Ulumiddin', 'إحياء علوم الدين', 'Imam Al-Ghazali', 'Karya besar tentang ilmu, ibadah, adat, kebinasaan, dan keselamatan hati.', 'ihya ulumiddin', 'إحياء علوم الدين', 1],
    ['hikam', 'akhlak', 'Al-Hikam', 'الحكم العطائية', "Ibnu Atha'illah As-Sakandari", 'Kumpulan mutiara hikmah tentang hati dan hubungan dengan Allah.', 'al-hikam ibnu athaillah', 'الحكم العطائية', 0],
    ['talim', 'akhlak', "Ta'limul Muta'allim", 'تعليم المتعلم', 'Az-Zarnuji', 'Adab dan metode belajar; dipelajari santri di awal belajar.', 'talimul mutaallim', 'تعليم المتعلم', 1],
    ['madarij', 'akhlak', 'Madarijus Salikin', 'مدارج السالكين', 'Ibnul Qayyim', "Tingkatan perjalanan hati menuju Allah berdasarkan ayat 'iyyaka na'budu wa iyyaka nasta'in'.", 'madarijus salikin', 'مدارج السالكين', 0],
    ['tabari', 'sejarah', 'Tarikh Ath-Thabari', 'تاريخ الرسل والملوك', 'Ibnu Jarir Ath-Thabari', 'Sejarah dunia dan umat Islam dengan sanad riwayat; rujukan utama para sejarawan.', 'tarikh thabari', 'تاريخ الطبري', 0],
    ['khulafa', 'sejarah', 'Tarikhul Khulafa', 'تاريخ الخلفاء', 'Jalaluddin As-Suyuthi', 'Riwayat para khalifah dari Abu Bakar hingga masa Abbasiyah.', 'tarikhul khulafa suyuthi', 'تاريخ الخلفاء السيوطي', 0],
    ['hayatus', 'sejarah', 'Hayatus Shahabah', 'حياة الصحابة', 'Muhammad Yusuf Al-Kandahlawi', 'Kisah kehidupan para sahabat: dakwah, jihad, dan akhlak mereka.', 'hayatus shahabah', 'حياة الصحابة', 0],
    ['hamkasejarah', 'sejarah', 'Sejarah Umat Islam', '', 'Buya Hamka', 'Sejarah Islam dari masa Nabi hingga Nusantara, ditulis oleh ulama dan sastrawan Indonesia.', 'sejarah umat islam hamka', '', 1],
    ['azra', 'sejarah', 'Jaringan Ulama Timur Tengah dan Kepulauan Nusantara', '', 'Azyumardi Azra', 'Kajian akademik tentang jaringan ulama Nusantara dan Haramain pada abad ke-17 dan 18.', 'jaringan ulama timur tengah nusantara azra', '', 0]
  ];
  /* Baca langsung: berkas PDF dalam item Internet Archive "Kumpulan Buku Islam" (pengunggah: Kapal Laut). id, judul, nama berkas (tanpa .pdf), kategori, deskripsi */
  const IA = 'KumpulanBukuIslam';
  const R = [
    ['r101sahabat', '101 Sahabat Nabi', '101 Sahabat Nabi', 'Profil singkat seratus satu sahabat Rasulullah ﷺ.'],
    ['r101tabiin', "101 Kisah Tabi'in", "101 Kisah Tabi'in", "Kisah teladan generasi tabi'in setelah para sahabat."],
    ['r60orang', '60 Orang Besar di Sekitar Rasulullah ﷺ', '60 Orang Besar di Sekitar Rasulullah Saw', 'Biografi enam puluh tokoh yang mendampingi Nabi ﷺ.'],
    ['r10episode', '10 Episode Teragung Rasulullah ﷺ', '10 Episode Teragung Rasulullah Saw', 'Sepuluh peristiwa besar dalam kehidupan Nabi ﷺ.'],
    ['rkhalifah', '5 Khalifah Kebanggaan Islam', '5 Khalifah Kebanggaan Islam', 'Kisah para khalifah teladan dalam sejarah Islam.'],
    ['r60ulama', '60 Biografi Ulama Salaf', '60 Biografi Ulama Salaf', 'Biografi singkat para ulama salaf.'],
    ['rdoa', '100 Doa Pilihan dari Al-Qur\'an dan Hadits Shahih', "100 Doa Pilihan dari Al-Qur'an dan Hadits Shahih", 'Kumpulan doa harian yang bersumber dari dalil shahih.'],
    ['r40cinta', '40 Karakteristik Mereka yang Dicintai Allah', '40 Karakteristik Mereka yang Dicintai Allah', 'Sifat-sifat hamba yang dicintai Allah.'],
    ['r35ampun', '35 Sebab Ampunan Dosa', '35 Sebab Ampunan Dosa', 'Amalan yang menjadi sebab diampuninya dosa.'],
    ['r76dosa', '76 Dosa Besar yang Dianggap Biasa', '76 Dosa Besar yang Dianggap Biasa', 'Peringatan tentang dosa yang sering diremehkan.'],
    ['r50muslimah', '50 Nasehat untuk Muslimah', '50 Nasehat untuk Muslimah', 'Nasihat singkat bagi muslimah.'],
    ['r150abu', '150 Kisah Abu Bakar Al-Shiddiq', '150 Kisah Abu Bakar Al-Shiddiq', 'Kumpulan kisah teladan khalifah pertama.'],
    ['r150umar', '150 Kisah Umar ibn Al-Khaththab', '150 Kisah Umar ibn Al-Khaththab', 'Kumpulan kisah teladan Amirul Mukminin Umar.'],
    ['r150utsman', '150 Kisah Utsman ibn Affan', '150 Kisah Utsman ibn Affan', 'Kumpulan kisah teladan Utsman, pemilik dua cahaya.'],
    ['r150ali', '150 Kisah Ali ibn Abi Thalib', '150 Kisah Ali ibn Abi Thalib', 'Kumpulan kisah teladan Ali ibn Abi Thalib.'],
    ['r3prinsip', '3 Prinsip Dasar dalam Islam', '3 Prinsip Dasar Dalam Islam', 'Pengenalan tiga landasan utama: mengenal Rabb, agama, dan Nabi.'],
    ['r76rintangan', '76 Rintangan yang Mengancam Keharmonisan Suami Istri', '76 Rintangan yang Mengancam Keharmonisan Suami Istri', 'Nasihat menjaga keharmonisan rumah tangga.'],
    ['rmisteri', 'Misteri Kematian', '1. Misteri Kematian', 'Seri pertama Trilogi Alam Akhirat: kematian dan peristiwa menjelang kiamat.'],
    ['rprahara', 'Prahara Padang Mahsyar', '2. Prahara Padang Mahsyar', 'Seri kedua: padang mahsyar, mizan, dan syafaat.'],
    ['rsurga', 'Surga & Neraka', '3. Surga & Neraka', 'Seri ketiga: gambaran surga dan neraka.']
  ];
  const iaView = (n, it = IA) => `https://archive.org/details/${it}/${encodeURIComponent(n)}/mode/2up`;
  const iaPage = (n, it = IA) => `https://archive.org/details/${it}/${encodeURIComponent(n)}/page/n0/mode/2up`;
  const gview = u => `https://docs.google.com/viewer?embedded=true&url=${encodeURIComponent(u)}`;
  const frame = (src, t) => `<iframe class="pk-frame" src="${esc(src)}" title="${esc(t)}" allowfullscreen loading="lazy" referrerpolicy="no-referrer" sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-forms allow-downloads"></iframe>`;
  const vtabs = (list, cur, mk) => `<nav class="hd-tabs pk-v">${list.map(([k, t]) => `<a class="chip ${cur === k ? 'active' : ''}" href="${mk(k)}">${t}</a>`).join('')}</nav>`;
  const iaDl = (n, it = IA) => `https://archive.org/download/${it}/${encodeURIComponent(n)}.pdf`;
  const ih = q => `https://islamhouse.com/id/search/?q=${encodeURIComponent(q)}`;
  const ia = q => `https://archive.org/search?query=${encodeURIComponent(q)}`;
  const ws = q => `https://ar.wikisource.org/w/index.php?search=${encodeURIComponent(q)}`;
  const tr = u => `https://translate.google.com/translate?sl=ar&tl=id&u=${encodeURIComponent(u)}`;
  const saved = () => new Set(store.get('pustakaSaved', []));
  const hd = `<section class="hd-hero"><p class="hd-bis" lang="ar" dir="rtl">اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ</p><h1>Perpustakaan Islam</h1><p>Baca langsung buku pilihan, atau telusuri ${B.length} kitab klasik lewat sumber unduhan yang sah.</p></section>`;
  const link = (u, t) => `<a class="btn sm" href="${esc(u)}" target="_blank" rel="noopener noreferrer">${t}</a>`;
  const VW = b => [['ia', 'Internet Archive'], ...(b[7] ? [['ws', 'Wikisource (Arab)']] : []), ['ih', 'IslamHouse']];
  const vsrc = (b, v) => v === 'ws' ? ws(b[7]) : v === 'ih' ? ih(b[6]) : ia(b[6]);
  const card = (b, on, ctx, pv) => {
    const open = pv && pv[0] === b[0], v = open ? (VW(b).some(x => x[0] === pv[1]) ? pv[1] : 'ia') : '';
    const panel = open ? `<div class="pk-panel" id="pkopen">${vtabs(VW(b), v, k => `#/pustaka?${ctx}&p=${b[0]}&v=${k}`)}${frame(vsrc(b, v), b[2])}<p class="muted small">Pratinjau memuat hasil pencarian situs sumber; pilih salah satu buku di dalamnya untuk membaca. Jika kosong atau ditolak, pindah sumber atau buka di tab baru.</p><div class="hd-acts">${link(vsrc(b, v), '↗ Buka di tab baru')}<a class="btn sm" href="#/pustaka?${ctx}">✕ Tutup</a></div></div>` : '';
    return `<article class="sr-ev" data-id="${b[0]}"><span class="sr-yr">${esc(CAT[b[1]][1])}</span>${b[8] ? ' <span class="sr-yr">★ Rekomendasi</span>' : ''}<br><b>${esc(b[2])}</b>${b[3] ? `<div class="pk-ar" lang="ar" dir="rtl">${esc(b[3])}</div>` : ''}<small class="muted">${esc(b[4])}</small><p>${esc(b[5])}</p>
    <div class="hd-acts"><a class="btn sm primary" href="#/pustaka?${ctx}&p=${b[0]}&v=ia">👁 Preview</a>${link(ih(b[6]), '🇮🇩 Terjemahan Indonesia')}${link(ia(b[6]), '📚 Archive')}${b[7] ? link(tr(ws(b[7])), '🌐 Terjemahkan') : ''}<button class="btn sm" data-act="s">${on ? '★ Tersimpan' : '☆ Simpan'}</button></div>${panel}</article>`;
  };

  /* ---------- Pembaca bawaan: teks hasil OCR (ringan) dan PDF (halaman asli lewat PDF.js) ---------- */
  const iaTxt = (n, it = IA) => `https://archive.org/download/${it}/${encodeURIComponent(n)}_djvu.txt`;
  const PDFJS = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/';
  const CACHE = 'pustaka-v1';
  async function cached(url, asBuf) {
    let c = null; try { c = await caches.open(CACHE); const h = await c.match(url); if (h) return asBuf ? h.arrayBuffer() : h.text(); } catch { /* tanpa cache */ }
    const r = await fetch(url); if (!r.ok) throw new Error('HTTP ' + r.status);
    if (c) try { await c.put(url, r.clone()); } catch { /* penuh */ }
    return asBuf ? r.arrayBuffer() : r.text();
  }
  const pos = id => (store.get('pustakaPos', {})[id]) || 1;
  const savePos = (id, n) => { const o = store.get('pustakaPos', {}); o[id] = n; store.set('pustakaPos', o); };
  const toPages = txt => {
    const paras = txt.replace(/\r/g, '').replace(/-\n(?=[a-z])/g, '').split(/\n\s*\n/).map(t => t.replace(/\s*\n\s*/g, ' ').trim()).filter(t => t.length > 1);
    const pages = []; let cur = [], len = 0;
    for (const t of paras) { cur.push(t); len += t.length; if (len > 1800) { pages.push(cur); cur = []; len = 0; } }
    if (cur.length) pages.push(cur); return pages;
  };
  const nav = (n, tot) => `<div class="pk-nav"><button class="btn sm" data-g="-1" ${n <= 1 ? 'disabled' : ''}>◀</button><label>Hal. <input type="number" id="pkpg" min="1" max="${tot}" value="${n}"> / ${tot}</label><button class="btn sm" data-g="1" ${n >= tot ? 'disabled' : ''}>▶</button></div>`;

  async function startText(box, cur) {
    box.innerHTML = '<p class="muted">Memuat teks buku…</p>';
    let pages;
    try { pages = toPages(await cached(iaTxt(cur[2], cur[4]))); if (!pages.length) throw 0; }
    catch { box.innerHTML = `<p class="muted">Teks buku tidak dapat dimuat (butuh internet atau berkas tidak punya teks). Coba tab "PDF halaman asli", atau unduh PDF di bawah.</p>${link(iaDl(cur[2], cur[4]), "⬇ Unduh PDF")}`; return; }
    let n = Math.min(pos(cur[0]), pages.length), fs = +store.get('pustakaFs', 1.05), hit = '';
    const draw = () => {
      const html = pages[n - 1].map(t => `<p>${esc(t)}</p>`).join('');
      box.innerHTML = `<div class="pk-bar"><button class="btn sm" data-fs="-1">A−</button><button class="btn sm" data-fs="1">A+</button><input type="search" id="pkfind" placeholder="Cari kata di buku" value="${esc(hit)}"><button class="btn sm" id="pkgo">Cari</button></div>${nav(n, pages.length)}<div class="pk-text" id="pktext" style="font-size:${fs}rem">${html}</div>${nav(n, pages.length)}`;
      if (hit) { const re = new RegExp(hit.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'); $('#pktext').innerHTML = $('#pktext').innerHTML.replace(re, m => `<mark>${m}</mark>`); }
      savePos(cur[0], n);
    };
    box.onclick = e => {
      const g = e.target.closest('[data-g]'), f = e.target.closest('[data-fs]');
      if (g) { n = Math.max(1, Math.min(pages.length, n + +g.dataset.g)); draw(); $('#pkstage').scrollTop = 0; }
      else if (f) { fs = Math.max(.8, Math.min(2, fs + .15 * +f.dataset.fs)); store.set('pustakaFs', fs); $('#pktext').style.fontSize = fs + 'rem'; }
      else if (e.target.id === 'pkgo') {
        hit = $('#pkfind').value.trim(); if (!hit) return draw();
        const k = hit.toLowerCase(); let i = pages.findIndex((p, j) => j >= n && p.join(' ').toLowerCase().includes(k)); if (i < 0) i = pages.findIndex(p => p.join(' ').toLowerCase().includes(k));
        if (i < 0) { toast && toast('Tidak ditemukan'); return; } n = i + 1; draw();
      }
    };
    box.onchange = e => { if (e.target.id === 'pkpg') { n = Math.max(1, Math.min(pages.length, +e.target.value || 1)); draw(); } };
    draw();
  }

  let pdfLib = null;
  const loadPdfJs = () => pdfLib || (pdfLib = new Promise((ok, no) => {
    if (window.pdfjsLib) return ok(window.pdfjsLib);
    const sc = document.createElement('script'); sc.src = PDFJS + 'pdf.min.js';
    sc.onload = () => { window.pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS + 'pdf.worker.min.js'; ok(window.pdfjsLib); };
    sc.onerror = () => { pdfLib = null; no(new Error('pdfjs')); }; document.head.appendChild(sc);
  }));
  async function startPdf(box, cur) {
    box.innerHTML = '<p class="muted">Memuat PDF…</p>';
    let doc, n = pos('pdf-' + cur[0]);
    try { const lib = await loadPdfJs(); doc = await lib.getDocument({ url: iaDl(cur[2], cur[4]) }).promise; }
    catch { box.innerHTML = `<p class="muted">PDF tidak dapat dimuat di sini (butuh internet). Gunakan tab "Teks" atau unduh langsung.</p>${link(iaDl(cur[2], cur[4]), '⬇ Unduh PDF')}`; return; }
    n = Math.min(n, doc.numPages);
    const draw = async () => {
      box.innerHTML = nav(n, doc.numPages) + '<div class="pk-pdf"><canvas id="pkcv"></canvas></div>' + nav(n, doc.numPages);
      const pg = await doc.getPage(n), w = box.clientWidth || 340, base = pg.getViewport({ scale: 1 }), sc = w / base.width, dpr = Math.min(devicePixelRatio || 1, 2);
      const vp = pg.getViewport({ scale: sc * dpr }), cv = $('#pkcv'); cv.width = vp.width; cv.height = vp.height; cv.style.width = '100%';
      await pg.render({ canvasContext: cv.getContext('2d'), viewport: vp }).promise; savePos('pdf-' + cur[0], n);
    };
    box.onclick = e => { const g = e.target.closest('[data-g]'); if (g) { n = Math.max(1, Math.min(doc.numPages, n + +g.dataset.g)); draw(); $('#pkstage').scrollTop = 0; } };
    const again = () => { if ($('#pkcv')) draw(); }; document.addEventListener('pkresize', again, { once: true });
    box.onchange = e => { if (e.target.id === 'pkpg') { n = Math.max(1, Math.min(doc.numPages, +e.target.value || 1)); draw(); } };
    draw();
  }

  const enc = encodeURIComponent;
  const resolve = q => {
    const b = q.get('b'); if (b) return R.find(r => r[0] === b) || null;
    const n = q.get('n'); if (!n) return null;
    const it = q.get('i') || IA; return [it + '/' + n, n, n, '', it === IA ? undefined : it];
  };
  const rhref = (cur, k) => `#/pustaka?${cur[4] ? 'f=cari&i=' + enc(cur[4]) : 'f=baca'}&${R.some(r => r[0] === cur[0]) ? 'b=' + cur[0] : 'n=' + enc(cur[2])}&v=${k}`;
  const closeHref = cur => cur[4] ? `#/pustaka?f=cari&i=${enc(cur[4])}` : '#/pustaka?f=baca';
  /* daftar berkas PDF dalam satu item Internet Archive (lewat API metadata) */
  async function pdfsOf(item) {
    const j = JSON.parse(await cached(`https://archive.org/metadata/${item}`));
    const names = (j.files || []).map(f => f.name).filter(n => /\.pdf$/i.test(n) && !/_text\.pdf$/i.test(n) && !/_bw\.pdf$/i.test(n)).map(n => n.replace(/\.pdf$/i, ''));
    return { title: (j.metadata && j.metadata.title) || item, names: [...new Set(names)].sort((a, b) => a.localeCompare(b, 'id', { numeric: true })) };
  }
  const bookRow = (it, n) => `<article class="sr-ev"><b>${esc(n)}</b><div class="hd-acts"><a class="btn sm primary" href="#/pustaka?${it === IA ? 'f=baca' : 'f=cari&i=' + enc(it)}&n=${enc(n)}">👁 Baca</a>${link(iaDl(n, it), '⬇ Unduh')}</div></article>`;

  function reader(cur, v) {
    const src = v === 'gv' ? gview(iaDl(cur[2], cur[4])) : iaPage(cur[2], cur[4]);
    const inner = v === 'txt' || v === 'pdf' ? '<div class="pk-box" id="pkbox"></div>' : frame(src, cur[1]);
    return `<div class="card pk-card" id="pkreader"><div class="pk-head"><b>${esc(cur[1])}</b><button class="btn sm" id="pkfs" aria-pressed="false">⛶ Layar penuh</button></div>
      ${vtabs([['page', 'Pembaca Archive'], ['txt', 'Teks'], ['pdf', 'PDF halaman asli'], ['gv', 'Google Viewer']], v, k => rhref(cur, k))}
      ${v === 'page' ? '<div class="hd-acts"><button class="btn sm" id="pkside" aria-expanded="false">☰ Tampilkan menu samping</button></div>' : ''}
      <div class="pk-stage ${v}" id="pkstage">${inner}</div>
      <div class="hd-acts pk-foot">${link(iaView(cur[2], cur[4]), '↗ Buka di tab baru')}${link(iaDl(cur[2], cur[4]), '⬇ Unduh PDF')}<a class="btn sm" href="${closeHref(cur)}">✕ Tutup</a></div>
      <p class="muted small pk-foot">Pembaca Archive menampilkan halaman asli; "Teks" dibaca dari hasil OCR Internet Archive sehingga ada kemungkinan salah huruf; gunakan "PDF halaman asli" untuk tampilan buku. Halaman yang sudah dimuat tersimpan untuk dibaca offline, dan posisi bacaan diingat.</p></div>`;
  }
  /* layar penuh: Fullscreen API bila ada, kalau tidak (mis. iPhone) overlay CSS */
  const setFull = on => { console.log('setFull', on, new Error().stack.split('\n')[2].trim().slice(0,60));
    const el = $('#pkreader'); if (!el) return;
    el.classList.toggle('pk-full', on); document.body.classList.toggle('pk-lock', on); window.__pkWant = on;
    const t = $('#pkfs'); if (t) { t.setAttribute('aria-pressed', on); t.textContent = on ? '✕ Keluar layar penuh' : '⛶ Layar penuh'; }
    try { if (on && el.requestFullscreen && !document.fullscreenElement) el.requestFullscreen().catch(() => {}); else if (!on && document.fullscreenElement) document.exitFullscreen(); } catch { /* abaikan */ }
    setTimeout(() => document.dispatchEvent(new Event('pkresize')), 200);
  };
  if (!window.__pkFsBound) {
    window.__pkFsBound = true;
    document.addEventListener('fullscreenchange', () => {
      if (document.fullscreenElement) { window.__pkFsEl = document.fullscreenElement; return; }
      if (Date.now() - (window.__pkT || 0) < 800) { window.__pkFsEl = null; return; } /* efek sampingan render ulang, bukan tombol keluar */
      const r = $('#pkreader'); if (r && r === window.__pkFsEl && r.classList.contains('pk-full')) setFull(false); /* keluar lewat tombol browser */
      window.__pkFsEl = null;
    });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && document.body.classList.contains('pk-lock')) setFull(false); });
    window.addEventListener('hashchange', () => document.body.classList.remove('pk-lock'));
  }
  function wire(cur, v, q) {
    view.onclick = e => {
      const f = e.target.closest('#pkfs'); if (f) return setFull(!$('#pkreader').classList.contains('pk-full'));
      const t = e.target.closest('#pkside'); if (!t) return;
      const on = $('#pkstage').classList.toggle('open');
      t.setAttribute('aria-expanded', on); t.textContent = on ? '☰ Sembunyikan menu samping' : '☰ Tampilkan menu samping';
    };
    window.__pkT = Date.now();
    const r = $('#pkreader'); r && r.scrollIntoView();
    /* buku yang baru dibuka (tanpa pilihan pembaca) langsung layar penuh; pindah tab saat layar penuh tetap layar penuh */
    if (r && (!q.get('v') || window.__pkWant)) setFull(true);
    const box = $('#pkbox'); if (box) (v === 'pdf' ? startPdf : startText)(box, cur);
  }

  function baca(q) {
    const cur = resolve(q), v = q.get('v') || 'page';
    view.innerHTML = hd + chips('baca', '') + (cur ? reader(cur, v) : '') +
      `<p class="muted small">Ketuk Baca untuk membuka langsung di sini. Berkas dihosting oleh Internet Archive.</p><p class="mini-title hd-sec">⭐ Pilihan</p>` +
      R.map(r => `<article class="sr-ev"><span class="sr-yr">📖 Baca langsung</span><br><b>${esc(r[1])}</b><p>${esc(r[3])}</p><div class="hd-acts"><a class="btn sm primary" href="#/pustaka?f=baca&b=${r[0]}">👁 Preview</a>${link(iaDl(r[2]), '⬇ Unduh')}</div></article>`).join('') +
      `<p class="mini-title hd-sec">📚 Semua buku di Kumpulan Buku Islam</p><div id="pkall"><p class="muted">Memuat daftar koleksi…</p></div>` +
      `<div class="card"><b>Koleksi di Internet Archive</b><p class="muted small">${link(`https://archive.org/details/${IA}`, 'Kumpulan Buku Islam')} ${link('https://archive.org/search?query=mediatype%3Atexts+AND+language%3AIndonesian', 'Semua buku berbahasa Indonesia')}</p></div>`;
    if (cur) wire(cur, v, q); else { view.onclick = null; window.__pkWant = false; }
    const box = $('#pkall'); if (!box) return;
    pdfsOf(IA).then(({ names }) => {
      const kw = (q.get('k') || '').toLowerCase(), pg = Math.max(1, +q.get('pg') || 1), per = 30;
      const list = names.filter(n => !kw || n.toLowerCase().includes(kw)), tot = Math.max(1, Math.ceil(list.length / per));
      const mk = (p, k) => `#/pustaka?f=baca&pg=${p}${k ? '&k=' + enc(k) : ''}`;
      box.innerHTML = `<form class="hd-search" id="pkaf"><input id="pkak" type="search" placeholder="Cari di ${names.length} buku (sahabat, doa, kisah…)" value="${esc(kw)}"><button class="btn">Cari</button></form>
        <p class="muted small">${list.length} buku · halaman ${Math.min(pg, tot)} dari ${tot}</p>${list.slice((pg - 1) * per, pg * per).map(n => bookRow(IA, n)).join('') || '<p class="muted">Tidak ada yang cocok.</p>'}
        <div class="pk-nav"><a class="btn sm" href="${mk(Math.max(1, pg - 1), kw)}">◀</a><span>${Math.min(pg, tot)} / ${tot}</span><a class="btn sm" href="${mk(Math.min(tot, pg + 1), kw)}">▶</a></div>`;
      $('#pkaf').onsubmit = e => { e.preventDefault(); location.hash = mk(1, $('#pkak').value.trim()); };
    }).catch(() => { box.innerHTML = `<p class="muted">Daftar lengkap butuh internet dan belum dapat dimuat. ${''}</p>${link(`https://archive.org/details/${IA}`, 'Buka koleksi di Internet Archive')}`; });
  }

  /* Cari buku di seluruh Internet Archive, lalu baca di pembaca bawaan */
  async function cari(q) {
    const kw = (q.get('k') || '').trim(), lg = q.get('l') || 'id', item = q.get('i'), cur = resolve(q), v = q.get('v') || 'page';
    const LG = { id: ['Indonesia', 'language:(Indonesian OR ind)'], ar: ['Arab', 'language:(Arabic OR ara)'], en: ['Inggris', 'language:(English OR eng)'], '': ['Semua', ''] };
    view.innerHTML = hd + chips('cari', '') + (cur ? reader(cur, v) : '') +
      `<form class="hd-search" id="pkcf"><input id="pkck" type="search" placeholder="Cari buku (kisah nabi, tafsir, sirah, fiqih…)" value="${esc(kw)}"><button class="btn">Cari</button></form>
       <nav class="hd-tabs">${Object.entries(LG).map(([k, t]) => `<a class="chip ${lg === k ? 'active' : ''}" href="#/pustaka?f=cari&l=${k}&k=${enc(kw)}">${t[0]}</a>`).join('')}</nav><div id="pkres"></div>
       <p class="muted small hd-note">Pencarian memakai API Internet Archive dan butuh internet. Buku bertanda pinjam (terbatas) tidak muncul. Sebagian unggahan pengguna mungkin berhak cipta; hormati hak cipta dan ketentuan Internet Archive.</p>`;
    if (cur) wire(cur, v, q); else { view.onclick = null; window.__pkWant = false; }
    $('#pkcf').onsubmit = e => { e.preventDefault(); location.hash = `#/pustaka?f=cari&l=${lg}&k=${enc($('#pkck').value.trim())}`; };
    const out = $('#pkres');
    try {
      if (item && !q.get('n')) {
        out.innerHTML = '<p class="muted">Memuat berkas…</p>';
        const { title, names } = await pdfsOf(item);
        out.innerHTML = `<p class="mini-title hd-sec">${esc(title)}</p><p><a class="btn sm" href="#/pustaka?f=cari&l=${lg}&k=${enc(kw)}">◀ Kembali ke hasil</a></p>` + (names.map(n => bookRow(item, n)).join('') || '<p class="muted">Item ini tidak punya PDF yang bisa dibuka (mungkin hanya bisa dipinjam).</p>');
      } else if (kw && !item) {
        out.innerHTML = '<p class="muted">Mencari…</p>';
        const expr = `(${kw}) AND mediatype:texts AND NOT access-restricted-item:true${LG[lg] && LG[lg][1] ? ' AND ' + LG[lg][1] : ''}`;
        const u = `https://archive.org/advancedsearch.php?q=${enc(expr)}&fl[]=identifier&fl[]=title&fl[]=creator&fl[]=downloads&rows=40&page=1&output=json&sort[]=${enc('downloads desc')}`;
        const r = await fetch(u); if (!r.ok) throw 0;
        const docs = (await r.json()).response.docs;
        out.innerHTML = docs.map(x => `<article class="sr-ev"><b>${esc([].concat(x.title || x.identifier).join(' '))}</b>${x.creator ? `<small class="muted">${esc([].concat(x.creator).join(', '))}</small>` : ''}<div class="hd-acts"><a class="btn sm primary" href="#/pustaka?f=cari&l=${lg}&k=${enc(kw)}&i=${enc(x.identifier)}">📂 Buka</a>${link('https://archive.org/details/' + x.identifier, '↗ Archive')}</div></article>`).join('') || '<p class="muted">Tidak ada hasil. Coba kata lain atau ganti bahasa.</p>';
      } else if (!item) out.innerHTML = '<p class="muted">Ketik kata kunci lalu tekan Cari.</p>';
    } catch { out.innerHTML = '<p class="muted">Gagal memuat dari Internet Archive (butuh internet).</p>'; }
  }

  const chips = (c, kw) => `<nav class="hd-tabs">${[['baca', '📖 Baca langsung'], ['cari', '🔎 Cari buku'], ['', 'Katalog'], ...Object.entries(CAT).map(([k, v]) => [k, v[1]]), ['simpan', '★ Tersimpan']].map(([k, t]) => `<a class="chip ${c === k ? 'active' : ''}" href="#/pustaka?f=${k}${kw ? '&q=' + encodeURIComponent(kw) : ''}">${t}</a>`).join('')}</nav>`;

  function daftar(q) {
    if (q.get('f') === 'cari') return cari(q);
    if (q.get('f') === null || q.get('f') === 'baca') return baca(q);
    const s = saved(), kw = (q.get('q') || '').toLowerCase().trim(), c = q.get('f') || '';
    const ctx = `f=${c}${kw ? '&q=' + encodeURIComponent(kw) : ''}`, pv = q.get('p') ? [q.get('p'), q.get('v') || 'ia'] : null;
    const list = B.filter(b => c === 'simpan' ? s.has(b[0]) : (!c || b[1] === c) && (!kw || (b[2] + b[3] + b[4] + b[5]).toLowerCase().includes(kw)));
    view.innerHTML = hd + `<form class="hd-search" id="pkf"><input id="pkq" type="search" placeholder="Cari judul, pengarang, atau topik" value="${esc(kw)}"><button class="btn">Cari</button></form>
      ${chips(c, kw)}` +
      (list.map(b => card(b, s.has(b[0]), ctx, pv)).join('') || '<p class="muted">Tidak ada kitab yang cocok.</p>') +
      `<div class="card"><b>Cari sumber lain</b><p class="muted small">Tidak menemukan yang dicari? Buka langsung ${link('https://islamhouse.com/id/', 'IslamHouse (Indonesia)')} ${link('https://archive.org/details/texts', 'Internet Archive')} ${link('https://ipusnas.id', 'iPusnas (Perpusnas)')}</p></div>
      <p class="muted small hd-note">Tombol menuju situs pihak ketiga. Aplikasi ini tidak menyimpan atau membagikan berkas buku. Hasil pencarian tergantung koleksi masing-masing situs; terjemahan otomatis hanya bantuan membaca dan bisa keliru, jadi utamakan edisi terjemahan resmi dari penerbit. Hormati hak cipta: unduh hanya dari sumber yang menyediakannya secara legal.</p>`;
    $('#pkf').onsubmit = e => { e.preventDefault(); location.hash = `#/pustaka?f=${c}&q=${encodeURIComponent($('#pkq').value)}`; };
    const op = $('#pkopen'); if (op) op.closest('article').scrollIntoView();
    view.onclick = e => {
      const b = e.target.closest('[data-act="s"]'); if (!b) return;
      const id = b.closest('.sr-ev').dataset.id, t = saved(); t.has(id) ? t.delete(id) : t.add(id);
      store.set('pustakaSaved', [...t]); const y = scrollY; daftar(q); scrollTo(0, y);
    };
  }
  return function (q) { setTitle('Perpustakaan Islam', true); view.onclick = null; return daftar(q); };
};
