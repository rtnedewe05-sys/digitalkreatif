/* Haji & Umrah: ringkasan, tata cara umrah & haji per langkah, cara berpakaian (gambar),
 * larangan ihram, doa-doa, dan daftar persiapan. Offline, tanpa server.
 * Mengikuti pendapat yang masyhur (mazhab Syafi'i, dipakai jemaah Indonesia); rincian bisa berbeda antar mazhab. */
window.makeHajiView = function (d) {
  const { $, esc, view, setTitle, toast, store } = d;
  const TABS = [['ringkas', 'Ringkas'], ['umrah', 'Umrah'], ['haji', 'Haji'], ['hitung', 'Penghitung'], ['pakaian', 'Pakaian'], ['peta', 'Peta & Miqat'], ['ziarah', 'Ziarah'], ['kuis', 'Kuis'], ['doa', 'Doa'], ['siap', 'Persiapan']];

  /* ---------- gambar ---------- */
  const SKIN = '#e2b48c', CLOTH = '#ffffff', LINE = '#94a3b8', HAIR = '#3b2a20';
  const defs = '<defs><linearGradient id="hjc" x1="0" x2="1"><stop offset="0" stop-color="#f1f5f9"/><stop offset="1" stop-color="#fff"/></linearGradient></defs>';
  const svg = (inner, label, w = 130) => `<svg class="hj-svg" viewBox="0 0 130 225" width="${w}" role="img" aria-label="${esc(label)}">${defs}${inner}</svg>`;
  const sandals = '<path d="M33 208h22v6H33zM75 208h22v6H75z" fill="#8b5e3c"/><path d="M40 202l8 6M90 202l-8 6" stroke="#8b5e3c" stroke-width="2"/>';
  const head = '<circle cx="65" cy="34" r="17" fill="' + SKIN + '"/><path d="M48 31q2-17 17-17t17 17q-6-8-17-8t-17 8z" fill="' + HAIR + '"/><circle cx="59" cy="36" r="1.6" fill="#333"/><circle cx="71" cy="36" r="1.6" fill="#333"/><path d="M60 43q5 3 10 0" stroke="#7a4a2a" stroke-width="1.5" fill="none"/>';
  /* v: izar (hanya kain bawah) | normal (dua kain, kedua bahu tertutup) | idhtiba (bahu kanan terbuka) */
  function man(v) {
    const torso = '<rect x="42" y="54" width="46" height="56" rx="14" fill="' + SKIN + '"/>';
    const armL = '<rect x="30" y="58" width="13" height="52" rx="6" fill="' + SKIN + '"/>', armR = '<rect x="87" y="58" width="13" height="52" rx="6" fill="' + SKIN + '"/>';
    const izar = '<path d="M40 104h50l5 100H35z" fill="url(#hjc)" stroke="' + LINE + '" stroke-width="1.5"/><path d="M52 110l-3 92M65 110v92M78 110l3 92" stroke="#e2e8f0" stroke-width="1.5"/><rect x="40" y="102" width="50" height="7" rx="3" fill="#cbd5e1"/>';
    let rida = '';
    if (v === 'normal') rida = '<path d="M30 56q35-12 70 0l5 62q-40 8-80 0z" fill="url(#hjc)" stroke="' + LINE + '" stroke-width="1.5"/><path d="M45 66l-3 46M65 64v50M85 66l3 46" stroke="#e2e8f0" stroke-width="1.5"/>';
    if (v === 'idhtiba') rida = '<path d="M28 58q16-8 30-2l36 38 6 24q-34 8-72 0z" fill="url(#hjc)" stroke="' + LINE + '" stroke-width="1.5"/><path d="M40 70l-4 44M54 80l-6 36M70 92l-4 22" stroke="#e2e8f0" stroke-width="1.5"/>';
    const arms = v === 'normal' ? '' : (v === 'idhtiba' ? armR : armL + armR);
    return svg(head + (v === 'normal' ? torso : armL + torso + arms) + izar + rida + sandals, 'Laki-laki memakai ihram');
  }
  function woman(color) {
    const c = color || '#475569';
    return svg('<path d="M65 12c-22 0-30 18-28 36l4 32h48l4-32C95 30 87 12 65 12z" fill="' + c + '"/>' +
      '<ellipse cx="65" cy="40" rx="14" ry="17" fill="' + SKIN + '"/><circle cx="59.5" cy="38" r="1.5" fill="#333"/><circle cx="70.5" cy="38" r="1.5" fill="#333"/><path d="M60 46q5 3 10 0" stroke="#7a4a2a" stroke-width="1.5" fill="none"/>' +
      '<path d="M44 66q21 10 42 0l18 40-8 4-6-14 7 104H33L40 96l-6 14-8-4z" fill="' + c + '"/>' +
      '<path d="M65 76v132" stroke="#fff" stroke-opacity=".25" stroke-width="1.5"/>' +
      '<circle cx="24" cy="112" r="6" fill="' + SKIN + '"/><circle cx="106" cy="112" r="6" fill="' + SKIN + '"/>' +
      '<path d="M40 208h22v6H40zM68 208h22v6H68z" fill="#334155"/>', 'Perempuan memakai pakaian ihram yang menutup aurat, wajah dan telapak tangan terbuka', 130);
  }
  const FIG = (inner, cap, sub) => `<figure class="hj-fig">${inner}<figcaption><b>${esc(cap)}</b>${sub ? `<span>${esc(sub)}</span>` : ''}</figcaption></figure>`;

  /* ---------- data tata cara ---------- */
  /* id, judul, isi, [surah, ayat] */
  const UMRAH = [
    ['u1', 'Persiapan & mandi sunnah', 'Sebelum miqat: mandi, bersihkan badan, potong kuku, rapikan kumis dan bulu ketiak/kemaluan, pakai wewangian di badan (bukan di kain ihram). Laki-laki melepas pakaian berjahit lalu memakai izar dan rida. Perempuan memakai pakaian biasa yang menutup aurat.'],
    ['u2', 'Ihram dari miqat', 'Sholat sunnah ihram dua rakaat jika memungkinkan. Berniat umrah di miqat (atau sebelum melewatinya, mis. di pesawat saat sejajar miqat): "Labbaika Allahumma \'umratan". Sejak niat berlaku larangan ihram.'],
    ['u3', 'Membaca talbiyah', 'Perbanyak talbiyah sejak berniat hingga mulai thawaf. Laki-laki mengeraskan suara, perempuan cukup pelan.'],
    ['u4', 'Masuk Masjidil Haram', 'Masuk dengan kaki kanan sambil berdoa. Saat melihat Ka\'bah berdoa dan memohon apa saja. Laki-laki dianjurkan idhtiba\' (membuka bahu kanan) dan raml (berjalan cepat dengan langkah pendek) pada tiga putaran pertama.', [2, 125]],
    ['u5', 'Thawaf 7 putaran', 'Mulai dari garis Hajar Aswad, Ka\'bah di sisi kiri. Isyaratkan tangan ke Hajar Aswad sambil "Bismillah, Allahu akbar" bila tak sanggup menciumnya. Di antara Rukun Yamani dan Hajar Aswad membaca doa sapu jagat. Syarat: suci dari hadas, menutup aurat, Ka\'bah di kiri, di dalam masjid, 7 putaran penuh.', [22, 29]],
    ['u6', 'Sholat 2 rakaat di belakang Maqam Ibrahim', 'Rakaat pertama Al-Kafirun, kedua Al-Ikhlas. Jika ramai, boleh di mana saja dalam masjid. Lalu minum air zamzam dan berdoa.', [2, 125]],
    ['u7', "Sa'i 7 kali", "Naik ke Shafa sambil membaca ayat 158 Al-Baqarah, menghadap Ka'bah, berdoa. Berjalan ke Marwah (hitungan 1), kembali ke Shafa (2), dan seterusnya, berakhir di Marwah pada hitungan ke-7. Laki-laki berlari kecil di antara dua lampu hijau. Dianjurkan suci, tapi sa'i sah tanpa wudhu.", [2, 158]],
    ['u8', 'Tahallul', 'Mencukur (lebih utama bagi laki-laki) atau menggunting rambut minimal tiga helai. Perempuan menggunting ujung rambut kira-kira satu ruas jari. Dengan itu umrah selesai dan larangan ihram berakhir.']
  ];
  const HAJI = [
    ['h0', 'Pilihan jenis haji', 'Tamattu\': umrah dulu pada bulan haji, tahallul, lalu berihram haji tanggal 8 Dzulhijjah (wajib dam). Ifrad: hanya haji, tanpa dam. Qiran: umrah dan haji sekaligus dalam satu ihram (wajib dam). Mayoritas jemaah Indonesia menjalani tamattu\'.', [2, 196]],
    ['h1', '8 Dzulhijjah: Tarwiyah', 'Berihram haji dari tempat menginap ("Labbaika Allahumma hajjan"), lalu menuju Mina. Sholat dzuhur, ashar, maghrib, isya, dan subuh di Mina (qashar tanpa jamak) dan bermalam.'],
    ['h2', '9 Dzulhijjah: Wukuf di Arafah', 'Setelah matahari tergelincir hingga terbenam. Ini rukun terbesar: "Al-hajju \'Arafah". Dzuhur dan ashar dijamak qashar, perbanyak doa, dzikir, istighfar, dan talbiyah. Tidak sah haji tanpa hadir di Arafah. Dimulai dengan khutbah Arafah.', [2, 198]],
    ['h3', 'Malam 10: Muzdalifah', 'Setelah maghrib berangkat ke Muzdalifah. Jamak maghrib dan isya (taakhir) saat tiba, bermalam, sholat subuh, lalu berdzikir di Masy\'aril Haram. Ambil kerikil (tujuh untuk jumrah Aqabah, sisanya boleh dipungut di Mina). Pengecualian: lansia, perempuan, dan yang lemah boleh berangkat setelah lewat tengah malam.', [2, 198]],
    ['h4', '10 Dzulhijjah: Jumrah Aqabah, tahallul, thawaf ifadhah', 'Melempar jumrah Aqabah 7 kerikil sambil takbir setelah terbit matahari; menyembelih hewan dam; mencukur/menggunting rambut (tahallul awal, boleh semua larangan kecuali jima\'); lalu thawaf ifadhah (rukun) dan sa\'i haji (bagi yang belum sa\'i). Setelah itu tahallul tsani penuh.'],
    ['h5', '11, 12, 13 Dzulhijjah: Hari Tasyriq', 'Mabit di Mina. Setiap hari setelah zawal (tergelincir matahari) lempar tiga jumrah berurutan: Ula, Wustha, Aqabah, masing-masing 7 kerikil. Nafar awal: meninggalkan Mina setelah melempar 12 Dzulhijjah sebelum maghrib. Nafar tsani: bermalam malam ke-13 dan melempar tanggal 13 (lebih utama).', [2, 203]],
    ['h6', 'Thawaf wada\'', 'Thawaf perpisahan sebelum meninggalkan Makkah; menjadi wajib haji bagi yang keluar dari Makkah. Gugur bagi perempuan yang haid atau nifas.']
  ];
  const RUKUN = {
    'Rukun umrah': ['Ihram (niat)', 'Thawaf', "Sa'i", 'Mencukur/menggunting rambut', 'Tertib'],
    'Rukun haji': ['Ihram (niat)', 'Wukuf di Arafah', 'Thawaf ifadhah', "Sa'i", 'Mencukur/menggunting rambut', 'Tertib'],
    'Wajib haji': ['Ihram dari miqat', 'Mabit di Muzdalifah', 'Mabit di Mina (hari Tasyriq)', 'Melempar jumrah', "Thawaf wada'"]
  };
  const LARANGAN = [
    ['👕', 'Laki-laki: pakaian berjahit/menutup kepala', 'Kemeja, celana, kaos kaki, sepatu tertutup mata kaki, peci/sorban/topi.'],
    ['🧕', 'Perempuan: cadar & kaos tangan', 'Wajah dan kedua telapak tangan harus terbuka (boleh dijauhkan dari orang lain dengan kerudung yang tidak menempel).'],
    ['🌸', 'Wewangian', 'Parfum, sabun/deodoran/lotion wangi, pada badan atau kain setelah berihram.'],
    ['✂️', 'Memotong rambut & kuku', 'Rambut, bulu, dan kuku sejak niat sampai tahallul.'],
    ['🏹', 'Berburu & merusak tumbuhan tanah haram', 'Membunuh hewan buruan, menebang pohon, dan mencabut rumput di Tanah Haram.'],
    ['💍', 'Akad nikah & pinangan', 'Menikah, menikahkan, dan meminang.'],
    ['🚫', 'Hubungan suami istri & pendahuluannya', 'Jima\' membatalkan haji bila sebelum tahallul awal dan wajib ditebus.'],
    ['🗣️', 'Rafats, fusuq, jidal', 'Perkataan kotor, maksiat, dan berbantah-bantahan.', [2, 197]]
  ];
  const BOLEH = ['Mandi dan keramas (tanpa sabun wangi) serta menggosok badan perlahan', 'Memakai cincin, jam tangan, kacamata, sabuk/pouch ikat pinggang, dan ikat uang di pinggang', 'Berpayung, berteduh di tenda/mobil, dan menutup hidung dengan tangan', 'Mengganti kain ihram dan mencuci kain ihram', 'Memakai sandal yang tidak menutup mata kaki dan punggung kaki'];

  const DOA = [
    ['Niat umrah (di miqat)', 'لَبَّيْكَ اللَّهُمَّ عُمْرَةً', 'Labbaika Allahumma \'umratan', 'Aku penuhi panggilan-Mu ya Allah untuk berumrah.'],
    ['Niat haji', 'لَبَّيْكَ اللَّهُمَّ حَجًّا', 'Labbaika Allahumma hajjan', 'Aku penuhi panggilan-Mu ya Allah untuk berhaji.'],
    ['Talbiyah', 'لَبَّيْكَ اللَّهُمَّ لَبَّيْكَ، لَبَّيْكَ لَا شَرِيكَ لَكَ لَبَّيْكَ، إِنَّ الْحَمْدَ وَالنِّعْمَةَ لَكَ وَالْمُلْكَ، لَا شَرِيكَ لَكَ', 'Labbaikallahumma labbaik, labbaika laa syariika laka labbaik, innal hamda wan ni\'mata laka wal mulk, laa syariika lak', 'Aku penuhi panggilan-Mu ya Allah, aku penuhi. Aku penuhi, tiada sekutu bagi-Mu, aku penuhi. Sesungguhnya segala puji, nikmat, dan kerajaan milik-Mu, tiada sekutu bagi-Mu. (HR. Bukhari & Muslim)'],
    ['Saat menyentuh/memberi isyarat ke Hajar Aswad', 'بِسْمِ اللَّهِ وَاللَّهُ أَكْبَرُ', 'Bismillahi wallahu akbar', 'Dengan nama Allah, Allah Maha Besar.'],
    ['Antara Rukun Yamani dan Hajar Aswad', 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ', 'Rabbanaa aatinaa fid dunyaa hasanah, wa fil aakhirati hasanah, wa qinaa \'adzaaban naar', 'Ya Tuhan kami, berilah kami kebaikan di dunia dan kebaikan di akhirat, dan lindungilah kami dari azab neraka. (QS. Al-Baqarah: 201)', [2, 201]],
    ['Setelah thawaf, di belakang Maqam Ibrahim', 'وَاتَّخِذُوا مِنْ مَقَامِ إِبْرَاهِيمَ مُصَلًّى', 'Wattakhidzuu min maqaami Ibraahiima mushallaa', 'Jadikanlah sebagian Maqam Ibrahim tempat sholat. (QS. Al-Baqarah: 125)', [2, 125]],
    ["Naik ke Shafa (sa'i)", 'إِنَّ الصَّفَا وَالْمَرْوَةَ مِنْ شَعَائِرِ اللَّهِ، أَبْدَأُ بِمَا بَدَأَ اللَّهُ بِهِ', "Innash shafaa wal marwata min sya'aa-irillaah. Abda-u bimaa bada-allaahu bih", 'Sesungguhnya Shafa dan Marwah sebagian syiar Allah. Aku mulai dengan apa yang Allah mulai. (HR. Muslim)', [2, 158]],
    ['Dzikir di Shafa, Marwah, dan Arafah', 'لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ', "Laa ilaaha illallaahu wahdahu laa syariika lah, lahul mulku wa lahul hamdu wa huwa 'alaa kulli syai-in qadiir", 'Tiada tuhan selain Allah semata, tiada sekutu bagi-Nya. Milik-Nya kerajaan dan segala puji, dan Dia Maha Kuasa atas segala sesuatu. (Doa terbaik hari Arafah, HR. Tirmidzi)'],
    ['Saat melempar jumrah', 'اللَّهُ أَكْبَرُ', 'Allahu akbar (tiap lemparan)', 'Allah Maha Besar. Ucapkan takbir pada setiap kerikil.'],
    ['Doa ampunan (perbanyak di Arafah)', 'رَبَّنَا ظَلَمْنَا أَنْفُسَنَا وَإِنْ لَمْ تَغْفِرْ لَنَا وَتَرْحَمْنَا لَنَكُونَنَّ مِنَ الْخَاسِرِينَ', "Rabbanaa dzalamnaa anfusanaa wa illam taghfir lanaa wa tarhamnaa lanakuunanna minal khaasiriin", 'Ya Tuhan kami, kami telah menzalimi diri kami. Jika Engkau tidak mengampuni dan merahmati kami, pastilah kami termasuk orang yang rugi. (QS. Al-A\'raf: 23)', [7, 23]],
    ['Masuk Masjidil Haram / masjid', 'بِسْمِ اللَّهِ وَالصَّلَاةُ وَالسَّلَامُ عَلَى رَسُولِ اللَّهِ، اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ', "Bismillah, wash shalaatu was salaamu 'alaa rasuulillaah. Allahummaf tah lii abwaaba rahmatik", 'Dengan nama Allah, shalawat dan salam atas Rasulullah. Ya Allah, bukakanlah bagiku pintu-pintu rahmat-Mu. (HR. Muslim, Abu Dawud). Masuk dengan kaki kanan.'],
    ['Keluar masjid', 'بِسْمِ اللَّهِ وَالصَّلَاةُ وَالسَّلَامُ عَلَى رَسُولِ اللَّهِ، اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ فَضْلِكَ', "Bismillah, wash shalaatu was salaamu 'alaa rasuulillaah. Allahumma innii as-aluka min fadhlik", 'Ya Allah, aku memohon karunia-Mu. (HR. Muslim). Keluar dengan kaki kiri.'],
    ["Di Ka'bah, doa Nabi Ibrahim", 'رَبَّنَا تَقَبَّلْ مِنَّا إِنَّكَ أَنْتَ السَّمِيعُ الْعَلِيمُ', "Rabbanaa taqabbal minnaa innaka antas samii'ul 'aliim", 'Ya Tuhan kami, terimalah (amal) dari kami. Sesungguhnya Engkau Maha Mendengar, Maha Mengetahui. (QS. Al-Baqarah: 127)', [2, 127]],
    ['Minum air zamzam', 'اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا وَرِزْقًا وَاسِعًا وَشِفَاءً مِنْ كُلِّ دَاءٍ', "Allahumma innii as-aluka 'ilman naafi'an wa rizqan waasi'an wa syifaa-an min kulli daa-in", 'Ya Allah, aku memohon ilmu yang bermanfaat, rezeki yang luas, dan kesembuhan dari segala penyakit. Lafaz ini populer, tetapi riwayatnya diperselisihkan; boleh berdoa dengan hajat sendiri. Nabi ﷺ bersabda air zamzam sesuai niat peminumnya (HR. Ibnu Majah).'],
    ['Di Muzdalifah (Masy\'aril Haram)', 'فَإِذَا أَفَضْتُمْ مِنْ عَرَفَاتٍ فَاذْكُرُوا اللَّهَ عِنْدَ الْمَشْعَرِ الْحَرَامِ', "Fa idzaa afadhtum min 'arafaatin fadzkurullaaha 'indal masy'aril haraam", 'Apabila kamu bertolak dari Arafah, berdzikirlah kepada Allah di Masy\'aril Haram. (QS. Al-Baqarah: 198). Perbanyak takbir, tahlil, dan doa hingga langit terang.', [2, 198]],
    ['Salam kepada Nabi ﷺ di Madinah', 'السَّلَامُ عَلَيْكَ يَا رَسُولَ اللَّهِ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ', "Assalaamu 'alaika yaa rasuulallaah wa rahmatullaahi wa barakaatuh", 'Salam sejahtera untukmu wahai Rasulullah, beserta rahmat dan berkah Allah. Ucapkan dengan suara lembut, lalu salam kepada Abu Bakar dan Umar radhiyallahu anhuma.', [49, 2]]
  ];

  const SIAP = {
    'Dokumen': ['Paspor (masa berlaku > 7 bulan)', 'Visa & kartu/gelang jemaah', 'Fotokopi paspor & foto 4x6', 'Buku kesehatan & vaksin meningenitis', 'Tiket & bukti pembayaran, nomor darurat keluarga'],
    'Pakaian laki-laki': ['2 set kain ihram (izar & rida)', 'Sabuk ihram/pouch', 'Sandal yang nyaman (tak tertutup)', 'Baju koko & sarung/celana untuk di hotel', 'Payung kecil'],
    'Pakaian perempuan': ['3-4 gamis longgar (warna bebas)', 'Kerudung panjang & dalaman', 'Kaus kaki (boleh dipakai perempuan)', 'Mukena ringan', 'Sandal/sepatu nyaman'],
    'Kesehatan & kebersihan': ['Obat pribadi & vitamin', 'Masker, pelembap bibir, sunblock tanpa wangi', 'Sabun, sampo, deodoran tanpa wangi', 'Antiseptik & plester luka lepuh', 'Botol minum & cairan elektrolit'],
    'Ibadah': ['Al-Qur\'an kecil / aplikasi ini (offline)', 'Buku doa manasik', 'Tasbih digital', 'Tas kecil untuk kerikil jumrah', 'Alat tulis untuk menghitung thawaf & sa\'i']
  };

  /* ---------- tampilan ---------- */
  const done = () => new Set(store.get('hajiDone', []));
  const hd = cur => `<section class="hd-hero"><p class="hd-bis" lang="ar" dir="rtl">وَلِلَّهِ عَلَى النَّاسِ حِجُّ الْبَيْتِ مَنِ اسْتَطَاعَ إِلَيْهِ سَبِيلًا</p><h1>Haji &amp; Umrah</h1><p>Panduan langkah demi langkah, cara berpakaian, dan doa-doa.</p></section><nav class="hd-tabs hj-tabs">${TABS.map(([k, l]) => `<a class="chip ${cur === k ? 'active' : ''}" href="#/haji/${k}">${l}</a>`).join('')}</nav>`;
  const note = '<p class="muted small hd-note">Panduan ini ringkasan untuk belajar. Ikuti bimbingan resmi pembimbing/KBIH dan ketentuan Kementerian Agama serta otoritas Arab Saudi, karena rincian dapat berbeda antar mazhab dan aturan berubah dari tahun ke tahun.</p>';
  const ayatLink = a => a ? `<a class="btn sm" href="#/surah/${a[0]}?a=${a[1]}">📖 Dalil</a>` : '';
  const stepCard = (x, ds, key) => `<article class="sr-ev ${ds.has(x[0]) ? 'done' : ''}" data-id="${x[0]}"><b>${esc(x[1])}</b><p>${esc(x[2])}</p><div class="hd-acts">${ayatLink(x[3])}<button class="btn sm" data-act="r">${ds.has(x[0]) ? '✓ Sudah paham' : 'Tandai paham'}</button></div></article>`;
  const bar = (list, ds, label) => { const n = list.filter(x => ds.has(x[0])).length, p = Math.round(n / list.length * 100); return `<div class="card"><b>${label}: ${n}/${list.length} langkah dipahami</b><div class="sr-bar"><i style="width:${p}%"></i></div></div>`; };

  function ringkas() {
    view.innerHTML = hd('ringkas') + `<section class="card"><h2>Apa bedanya?</h2>
      <p><b>Haji</b> adalah rukun Islam kelima, wajib sekali seumur hidup bagi yang mampu, dilaksanakan pada 8-13 Dzulhijjah. <b>Umrah</b> boleh kapan saja sepanjang tahun (sunnah muakkad menurut pendapat yang kuat di kalangan Syafi'i: wajib sekali seumur hidup).</p>
      <div class="btn-row"><a class="btn primary" href="#/haji/umrah">Mulai panduan umrah</a><a class="btn" href="#/haji/haji">Panduan haji</a><a class="btn" href="#/haji/pakaian">Cara berpakaian</a></div></section>` +
      Object.entries(RUKUN).map(([t, l]) => `<section class="card hj-rk"><h3>${t}</h3><ol>${l.map(x => `<li>${esc(x)}</li>`).join('')}</ol></section>`).join('') +
      `<section class="card"><h3>Dalil kewajiban</h3><p class="muted">"Dan di antara kewajiban manusia terhadap Allah adalah melaksanakan ibadah haji ke Baitullah, yaitu bagi orang yang mampu mengadakan perjalanan ke sana." (QS. Ali 'Imran: 97)</p><div class="hd-acts"><a class="btn sm" href="#/surah/3?a=97">📖 Ali 'Imran 97</a><a class="btn sm" href="#/surah/2?a=196">📖 Al-Baqarah 196-203</a><a class="btn sm" href="#/surah/22?a=27">📖 Al-Hajj 27</a></div></section>` + note;
  }
  function steps(list, key, label, intro) {
    const ds = done();
    view.innerHTML = hd(key) + `<p class="muted small hd-note" style="margin-top:0">${esc(intro)}</p>` + bar(list, ds, label) + list.map(x => stepCard(x, ds)).join('') + note;
    view.onclick = e => {
      const b = e.target.closest('[data-act="r"]'); if (!b) return;
      const id = b.closest('.sr-ev').dataset.id, s = done(); s.has(id) ? s.delete(id) : s.add(id);
      store.set('hajiDone', [...s]); const y = scrollY; steps(list, key, label, intro); scrollTo(0, y);
    };
  }
  function pakaian() {
    view.innerHTML = hd('pakaian') + `<section class="card"><h2>Pakaian ihram laki-laki</h2>
      <p class="muted">Dua helai kain putih tanpa jahitan: <b>izar</b> (kain bawah, dari pinggang sampai mata kaki) dan <b>rida'</b> (kain atas, menutup badan). Kepala terbuka.</p>
      <div class="hj-row">${FIG(man('izar'), '1. Pasang izar', 'Lilitkan di pinggang sampai bawah lutut/mata kaki, ikat dengan sabuk bila perlu.')}${FIG(man('normal'), "2. Kenakan rida'", 'Selimutkan di bahu dan badan, kedua bahu tertutup (saat ihram biasa & di luar thawaf).')}${FIG(man('idhtiba'), "3. Idhtiba' (saat thawaf qudum/umrah)", "Selipkan rida' di bawah ketiak kanan dan bahu kanan terbuka. Dikembalikan menutup bahu saat sholat sunnah thawaf dan sa'i.")}</div>
      <ul class="hj-tips"><li>Warna putih dianjurkan, bahan menyerap keringat.</li><li>Boleh dilipat/diikat dan memakai peniti, sabuk, atau pouch tak berjahit pada tubuh.</li><li>Boleh sandal terbuka. Tidak boleh sepatu/kaus kaki yang menutup mata kaki.</li><li>Kepala tidak ditutup. Payung dan tenda boleh.</li></ul></section>
      <section class="card"><h2>Pakaian ihram perempuan</h2>
      <p class="muted">Pakaian sehari-hari yang longgar dan menutup aurat. Warna bebas (putih tidak wajib), tanpa hiasan mencolok. Hanya wajah dan telapak tangan yang terbuka.</p>
      <div class="hj-row">${FIG(woman('#475569'), 'Gamis & kerudung', 'Longgar, tidak tembus pandang, menutup rambut, leher, dan kaki.')}${FIG(woman('#0f766e'), 'Warna bebas', 'Pilih bahan ringan yang adem; dalaman dan kaus kaki boleh.')}
      <div class="hj-nono"><b>Tidak boleh saat ihram</b><ul><li>Cadar/niqab menempel di wajah</li><li>Sarung tangan (kaos tangan)</li><li>Wewangian pada badan dan pakaian</li></ul><b>Boleh</b><ul><li>Kerudung panjang, kaus kaki, sepatu tertutup</li><li>Kain/penutup yang tidak menempel di wajah</li></ul></div></div></section>
      <h2 class="sd-h">Larangan saat ihram</h2>` + LARANGAN.map(x => `<article class="card hj-lg"><span class="hj-ic">${x[0]}</span><div><b>${esc(x[1])}</b><p class="muted small">${esc(x[2])}</p>${x[3] ? ayatLink(x[3]) : ''}</div></article>`).join('') +
      `<section class="card"><h3>Yang diperbolehkan</h3><ul class="hj-tips">${BOLEH.map(x => `<li>${esc(x)}</li>`).join('')}</ul></section>
      <section class="card"><h3>Adab berpakaian di Masjidil Haram & Masjid Nabawi</h3><ul class="hj-tips"><li>Pakaian sopan, bersih, dan rapi; hindari tulisan/gambar tidak pantas.</li><li>Perempuan memakai abaya atau gamis longgar dan kerudung panjang; laki-laki menutup pundak dan lutut.</li><li>Bawa kantong sandal; sandal diletakkan di rak, bukan di lantai pintu masuk.</li><li>Hindari wewangian berlebihan, terlebih saat ihram.</li></ul></section>` + note;
  }
  function doa() {
    view.innerHTML = hd('doa') + DOA.map((x, i) => `<article class="card hj-doa"><h3>${esc(x[0])}</h3><p class="sd-ar" dir="rtl" lang="ar">${esc(x[1])}</p><p class="hj-lat">${esc(x[2])}</p><p class="sd-id">${esc(x[3])}</p><div class="hd-acts">${ayatLink(x[4])}<button class="btn sm" data-copy="${i}">Salin</button></div></article>`).join('') +
      '<p class="muted small hd-note">Tidak ada doa wajib tertentu selama thawaf dan sa\'i selain yang disebut; berdoalah dengan bahasa sendiri dan dzikir yang kamu pahami.</p>';
    view.onclick = e => {
      const b = e.target.closest('[data-copy]'); if (!b) return;
      const o = DOA[+b.dataset.copy], t = `${o[0]}\n${o[1]}\n${o[2]}\n${o[3]}`;
      (navigator.clipboard ? navigator.clipboard.writeText(t) : Promise.reject()).then(() => toast('Disalin'), () => toast('Gagal menyalin'));
    };
  }
  function siap() {
    const ds = new Set(store.get('hajiPack', []));
    const total = Object.values(SIAP).flat().length, n = [...ds].filter(k => Object.values(SIAP).flat().includes(k)).length, p = Math.round(n / total * 100);
    view.innerHTML = hd('siap') + `<div class="card"><b>${n}/${total} siap dibawa</b><div class="sr-bar"><i style="width:${p}%"></i></div></div>` +
      Object.entries(SIAP).map(([g, l]) => `<section class="card"><h3>${esc(g)}</h3>${l.map(x => `<label class="check hj-ck"><input type="checkbox" data-k="${esc(x)}" ${ds.has(x) ? 'checked' : ''}> ${esc(x)}</label>`).join('')}</section>`).join('') + note;
    view.onchange = e => {
      const c = e.target.closest('[data-k]'); if (!c) return;
      const s = new Set(store.get('hajiPack', [])); c.checked ? s.add(c.dataset.k) : s.delete(c.dataset.k);
      store.set('hajiPack', [...s]); const y = scrollY; siap(); scrollTo(0, y);
    };
  }


  /* ---------- penghitung thawaf & sa'i ---------- */
  const buzz = n => { try { navigator.vibrate && navigator.vibrate(n); } catch { /* abaikan */ } };
  let mode = 'thawaf';
  const cnt = () => store.get('hajiCnt', { thawaf: 0, sai: 0 });
  function hitung() {
    const c = cnt(), n = c[mode] || 0, fin = n >= 7;
    const pos = mode === 'sai' ? (n >= 7 ? 'Selesai di Marwah' : (n % 2 === 0 ? 'Mulai dari Shafa → menuju Marwah' : 'Dari Marwah → menuju Shafa')) : (n >= 7 ? 'Thawaf selesai' : 'Mulai & akhiri putaran di garis Hajar Aswad');
    view.innerHTML = hd('hitung') + `<section class="card hj-cnt">
      <nav class="hd-tabs" style="justify-content:center">${[['thawaf', 'Thawaf'], ['sai', "Sa'i"]].map(([k, l]) => `<button class="chip ${mode === k ? 'active' : ''}" data-m="${k}">${l}</button>`).join('')}</nav>
      <p class="muted small">${esc(pos)}</p>
      <button class="hj-big ${fin ? 'fin' : ''}" data-act="plus" aria-label="Tambah hitungan"><span>${n}</span><small>dari 7 ${mode === 'sai' ? 'perjalanan' : 'putaran'}</small></button>
      <div class="sr-bar"><i style="width:${Math.min(n, 7) / 7 * 100}%"></i></div>
      <p class="hj-msg">${fin ? '✅ Alhamdulillah, ' + (mode === 'sai' ? "sa'i" : 'thawaf') + ' selesai. ' + (mode === 'sai' ? 'Lanjut tahallul.' : 'Lanjut sholat dua rakaat di belakang Maqam Ibrahim.') : 'Ketuk lingkaran setiap kali ' + (mode === 'sai' ? 'tiba di Shafa/Marwah' : 'melewati garis Hajar Aswad') + '.'}</p>
      <div class="btn-row" style="justify-content:center"><button class="btn" data-act="minus">− Kurangi</button><button class="btn" data-act="reset">Ulangi dari 0</button></div>
      <p class="muted small">Hitungan tersimpan di perangkat. Jika ragu, ambil jumlah yang lebih sedikit.</p></section>
      <section class="card"><h3>Pengingat</h3><ul class="hj-tips">${mode === 'sai' ? ['Perjalanan 1: Shafa → Marwah; 7: berakhir di Marwah.', 'Laki-laki berlari kecil di antara dua lampu hijau.', 'Berdoa dan berdzikir di Shafa dan Marwah.'] : ['Ka\'bah selalu di sisi kiri.', 'Tiga putaran pertama: raml dan idhtiba\' (laki-laki, thawaf qudum).', 'Putaran melewati Hijr Ismail dari luar, bukan lewat dalam.'].map(x => `<li>${x}</li>`).join('')}</ul></section>` + note;
    view.onclick = e => {
      const m = e.target.closest('[data-m]'); if (m) { mode = m.dataset.m; return hitung(); }
      const b = e.target.closest('[data-act]'); if (!b) return;
      const c2 = cnt(); let v = c2[mode] || 0;
      if (b.dataset.act === 'plus') { if (v >= 7) return; v++; buzz(v === 7 ? [200, 80, 200, 80, 300] : 40); }
      else if (b.dataset.act === 'minus') v = Math.max(0, v - 1); else v = 0;
      c2[mode] = v; store.set('hajiCnt', c2); hitung();
    };
  }

  /* ---------- peta, miqat, kalender ---------- */
  const lbl = (x, y, t, a, c) => `<text x="${x}" y="${y}" text-anchor="${a || 'middle'}" font-size="10" fill="${c || 'currentColor'}">${esc(t)}</text>`;
  const mapSvg = (w, h, inner, label) => `<svg class="hj-map" viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(label)}">${inner}</svg>`;
  const MAP_KAABAH = mapSvg(300, 250, '<circle cx="150" cy="120" r="85" fill="none" stroke="#0f766e" stroke-width="2" stroke-dasharray="6 4"/><rect x="120" y="92" width="60" height="56" fill="#1f2937" rx="3"/><path d="M120 92h60" stroke="#d4af37" stroke-width="4"/><path d="M96 130a30 30 0 0 1 24-12v26a30 30 0 0 1-24-14z" fill="none"/><path d="M120 150a24 24 0 0 0 60 0" fill="none" stroke="#94a3b8" stroke-width="3" transform="translate(0,-4)"/><circle cx="120" cy="148" r="5" fill="#111827" stroke="#fff" stroke-width="2"/><circle cx="215" cy="125" r="6" fill="#d4af37"/><path d="M150 30l-8 6 8 6" fill="none" stroke="#0f766e" stroke-width="2"/>' +
    lbl(150, 124, "Ka'bah", 'middle', '#fff') + lbl(112, 172, 'Hajar Aswad', 'end') + lbl(160, 190, 'Hijr Ismail') + lbl(222, 144, 'Maqam Ibrahim', 'middle') + lbl(150, 18, 'Arah thawaf: berlawanan jarum jam') + lbl(150, 236, 'Mulai dari sudut Hajar Aswad'), 'Denah thawaf sederhana');
  const MAP_SAI = mapSvg(340, 130, '<path d="M40 70h260" stroke="#94a3b8" stroke-width="4"/><circle cx="40" cy="70" r="10" fill="#0f766e"/><circle cx="300" cy="70" r="10" fill="#0f766e"/><path d="M120 56v28M220 56v28" stroke="#22c55e" stroke-width="5"/><path d="M70 50q100-30 200 0" fill="none" stroke="#0f766e" stroke-width="2"/>' +
    lbl(40, 104, 'Shafa') + lbl(300, 104, 'Marwah') + lbl(170, 120, 'Di antara lampu hijau, laki-laki berlari kecil') + lbl(170, 22, '1: ke Marwah, 2: ke Shafa, … 7: berakhir di Marwah'), "Denah sa'i antara Shafa dan Marwah");
  const MAP_ALUR = mapSvg(340, 160, '<path d="M25 100L105 70L185 100L290 50" fill="none" stroke="#0f766e" stroke-width="3" stroke-dasharray="5 4"/>' +
    [[25, 100, 'Makkah'], [105, 70, 'Mina'], [185, 100, 'Muzdalifah'], [290, 50, 'Arafah']].map(([x, y, t]) => `<circle cx="${x}" cy="${y}" r="8" fill="#0f766e"/>` + lbl(x, y + 22, t)).join('') +
    lbl(65, 76, '±7 km') + lbl(145, 76, '±5 km') + lbl(240, 64, '±9 km') + lbl(170, 150, '8 Mina → 9 Arafah → malam 10 Muzdalifah → 10-13 Mina'), 'Alur perjalanan haji: Makkah, Mina, Arafah, Muzdalifah');
  const MIQAT = [
    ['Dzulhulaifah (Bir Ali)', 'Penduduk/jemaah dari arah Madinah', '±450 km dari Makkah, terjauh'],
    ['Al-Juhfah (dekat Rabigh)', 'Syam, Mesir, Maroko', '±180 km dari Makkah'],
    ['Yalamlam', 'Yaman dan yang datang dari arah selatan, termasuk jemaah Indonesia yang berangkat langsung ke Jeddah/Makkah (berihram saat sejajar di pesawat/kapal)', '±90 km dari Makkah'],
    ['Qarnul Manazil (As-Sail Al-Kabir)', 'Najd dan Thaif', '±80 km dari Makkah'],
    ['Dzatu Irq', 'Irak dan timur', '±90 km dari Makkah']
  ];
  const DAM = [
    ['Tamattu\' atau Qiran', 'Menyembelih seekor kambing; jika tak mampu, puasa 3 hari di Makkah dan 7 hari setelah pulang.', [2, 196]],
    ['Meninggalkan wajib haji (mis. mabit, jumrah, miqat)', 'Dam: seekor kambing, atau puasa 10 hari bila tak mampu.', null],
    ['Melanggar larangan ihram (cukur, wewangian, pakaian berjahit)', 'Fidyah: puasa 3 hari, atau memberi makan 6 orang miskin, atau menyembelih kambing.', [2, 196]],
    ['Jima\' sebelum tahallul awal', 'Haji rusak; wajib menyelesaikannya, menyembelih unta/sapi, dan mengulang haji tahun berikutnya.', null]
  ];
  function ymd(dt, o) { return new Intl.DateTimeFormat('id-ID', o || { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(dt); }
  function kalender() {
    try {
      const pad = x => new Date(x.getFullYear(), x.getMonth(), x.getDate());
      let t = pad(new Date()), found = null;
      const H = dt => { const p = Object.fromEntries(new Intl.DateTimeFormat('en-u-ca-islamic-umalqura', { day: 'numeric', month: 'numeric', year: 'numeric' }).formatToParts(dt).map(x => [x.type, x.value])); return { d: +p.day, m: +p.month, y: parseInt(p.year, 10) }; };
      /* cari 1 Dzulhijjah terdekat: yang sedang berjalan (hari-hari terakhir ikut) atau berikutnya */
      for (let i = -16; i < 400 && !found; i++) { const dt = new Date(t); dt.setDate(t.getDate() + i); const h = H(dt); if (h.m === 12 && h.d === 1) found = dt; }
      if (!found) return '';
      const row = (n, label) => { const dt = new Date(found); dt.setDate(found.getDate() + n - 1); const diff = Math.round((dt - t) / 864e5); return `<li><b>${n} Dzulhijjah</b> · ${esc(ymd(dt))}<br><span class="muted small">${label}${diff === 0 ? ' · <b>hari ini</b>' : diff > 0 ? ` · ${diff} hari lagi` : ''}</span></li>`; };
      return `<section class="card"><h3>Kalender haji ${H(found).y} H</h3><ul class="hj-cal">${row(8, 'Tarwiyah, ihram haji, ke Mina')}${row(9, 'Wukuf di Arafah')}${row(10, 'Idul Adha: Jumrah Aqabah, tahallul, thawaf ifadhah')}${row(11, 'Hari Tasyriq: lempar 3 jumrah')}${row(12, 'Tasyriq · nafar awal')}${row(13, 'Tasyriq · nafar tsani')}</ul><p class="muted small">Dihitung dengan kalender Umm Al-Qura di perangkat. Penetapan resmi (pemerintah Arab Saudi/Kemenag RI) bisa berbeda satu hari.</p></section>`;
    } catch { return ''; }
  }
  function peta() {
    view.innerHTML = hd('peta') + kalender() +
      `<section class="card"><h3>Denah thawaf</h3>${MAP_KAABAH}<p class="muted small">Skema sederhana, bukan skala sebenarnya.</p></section>
       <section class="card"><h3>Denah sa'i</h3>${MAP_SAI}<p class="muted small">Jarak Shafa-Marwah ±450 m; 7 perjalanan ±3,15 km.</p></section>
       <section class="card"><h3>Alur perjalanan haji</h3>${MAP_ALUR}<p class="muted small">Jarak perkiraan, bukan skala sebenarnya.</p></section>
       <h2 class="sd-h">Lima miqat makani</h2>` + MIQAT.map(x => `<article class="card hj-mq"><b>${esc(x[0])}</b><p>${esc(x[1])}</p><small class="muted">${esc(x[2])}</small></article>`).join('') +
      `<p class="muted small hd-note">Jemaah yang lewat udara berihram saat sejajar miqat (umumnya diumumkan pramugari/pembimbing). Niat sebaiknya dilakukan sebelum melewati garis miqat.</p>
       <h2 class="sd-h">Dam &amp; fidyah</h2>` + DAM.map(x => `<article class="card hj-mq"><b>${esc(x[0])}</b><p>${esc(x[1])}</p>${ayatLink(x[2])}</article>`).join('') +
      '<p class="muted small hd-note">Ketentuan dam dapat berbeda antar mazhab. Konsultasikan dengan pembimbing untuk kasus tertentu.</p>' + note;
  }

  /* ---------- ziarah Madinah ---------- */
  const ZIARAH = [
    ['🕌', 'Masjid Nabawi', 'Sholat di dalamnya lebih utama daripada seribu sholat di masjid lain kecuali Masjidil Haram (HR. Bukhari & Muslim). Berniat melakukan perjalanan ke masjid, bukan ke makam.', null],
    ['🌿', 'Raudhah', 'Area antara rumah dan mimbar Nabi ﷺ: "taman dari taman-taman surga" (HR. Bukhari). Sholat dan berdoa di sana jika sempat; jangan mendorong atau menghalangi orang lain. Jadwal masuk perempuan dan laki-laki diatur terpisah.', null],
    ['🤲', 'Salam kepada Nabi ﷺ, Abu Bakar, dan Umar', 'Berdiri dengan sopan menghadap makam, ucapkan salam dengan suara pelan, lalu bergeser ke makam Abu Bakar dan Umar. Jangan meminta kepada penghuni makam, mengusap, atau mengelilinginya; mintalah hanya kepada Allah.', [49, 2]],
    ['🕌', 'Masjid Quba', 'Masjid pertama yang dibangun Nabi ﷺ. Berwudhu di rumah lalu sholat dua rakaat di sana pahalanya seperti umrah (HR. Tirmidzi & Ibnu Majah, hasan).', [9, 108]],
    ['⛰️', 'Jabal Uhud & syuhada Uhud', 'Tempat Perang Uhud, makam Hamzah dan para syuhada. Nabi ﷺ bersabda: "Uhud adalah gunung yang mencintai kita dan kita mencintainya" (HR. Bukhari & Muslim). Ziarahi dengan mendoakan, bukan meminta.', [3, 169]],
    ['🕌', 'Masjid Qiblatain', 'Tempat turun perintah pindah kiblat dari Baitul Maqdis ke Ka\'bah saat sholat berlangsung.', [2, 144]],
    ['🪦', 'Pemakaman Baqi\'', 'Makam banyak sahabat dan keluarga Nabi ﷺ. Doa ziarah kubur: "Assalamu\'alaikum ahlad diyar minal mu\'minin wal muslimin... " (HR. Muslim).', null]
  ];
  function ziarah() {
    view.innerHTML = hd('ziarah') + `<p class="muted small hd-note" style="margin-top:0">Ziarah Madinah bukan bagian dari rukun maupun wajib haji, tetapi dianjurkan karena menghormati Nabi ﷺ dan memperbanyak ibadah.</p>` +
      ZIARAH.map(x => `<article class="card hj-lg"><span class="hj-ic">${x[0]}</span><div><b>${esc(x[1])}</b><p class="muted small">${esc(x[2])}</p>${ayatLink(x[3])}</div></article>`).join('') +
      `<section class="card"><h3>Adab di Madinah</h3><ul class="hj-tips"><li>Menjaga suara dan tidak berebut di area makam dan Raudhah.</li><li>Sholat 40 waktu (Arba'in) tidak disyaratkan; hadisnya lemah, jangan menganggapnya wajib.</li><li>Pakaian sopan, tidak mengambil foto di tempat yang dilarang petugas.</li><li>Hormati antrean, lansia, dan petugas.</li></ul></section>` + note;
  }

  /* ---------- kuis manasik ---------- */
  /* soal, benar, salah1, salah2, salah3, penjelasan */
  const QZ = [
    ['Rukun haji yang paling utama adalah…', 'Wukuf di Arafah', "Thawaf wada'", 'Melempar jumrah', 'Mabit di Mina', 'Nabi ﷺ: "Al-hajju \'Arafah" (haji itu Arafah).'],
    ['Thawaf dilakukan sebanyak…', '7 putaran', '5 putaran', '9 putaran', '3 putaran', 'Dimulai dan diakhiri di garis Hajar Aswad.'],
    ["Sa'i dimulai dari…", 'Shafa', 'Marwah', 'Multazam', 'Hajar Aswad', 'Shafa ke Marwah dihitung satu perjalanan.'],
    ["Sa'i berakhir di…", 'Marwah', 'Shafa', 'Maqam Ibrahim', 'Mina', 'Tujuh perjalanan: Shafa-Marwah-…-Marwah.'],
    ['Pakaian ihram laki-laki terdiri dari…', "Izar dan rida'", 'Gamis dan sorban', 'Kemeja dan celana', 'Jubah dan peci', 'Dua kain tanpa jahitan; kepala terbuka.'],
    ['Yang dilarang bagi perempuan saat ihram…', 'Cadar dan kaos tangan', 'Memakai kerudung', 'Memakai gamis', 'Memakai kaus kaki', 'Wajah dan telapak tangan harus terbuka.'],
    ['Yang boleh dilakukan saat ihram…', 'Memakai cincin dan jam tangan', 'Memakai parfum', 'Memotong kuku', 'Berburu hewan', 'Perhiasan sederhana dan jam tidak dilarang.'],
    ["Idhtiba' adalah…", 'Membuka bahu kanan saat thawaf', 'Berlari kecil saat thawaf', 'Mencium Hajar Aswad', 'Menutup kepala', "Dikerjakan laki-laki pada thawaf qudum/umrah."],
    ['Jumrah Aqabah dilempar dengan…', '7 kerikil', '3 kerikil', '21 kerikil', '10 kerikil', 'Setiap lemparan disertai takbir.'],
    ['Wukuf di Arafah dilakukan pada tanggal…', '9 Dzulhijjah', '8 Dzulhijjah', '10 Dzulhijjah', '12 Dzulhijjah', 'Mulai tergelincir matahari hingga terbenam.'],
    ['Di Muzdalifah jemaah…', 'Bermalam dan menjamak maghrib-isya', 'Wukuf', "Thawaf wada'", 'Sa\'i', 'Juga mengambil kerikil untuk jumrah.'],
    ["Thawaf wada' dilakukan…", 'Sebelum meninggalkan Makkah', 'Saat tiba di Makkah', 'Di Arafah', 'Di Muzdalifah', 'Wajib haji bagi yang meninggalkan Makkah.'],
    ['Miqat jemaah dari arah Madinah…', 'Dzulhulaifah (Bir Ali)', 'Yalamlam', 'Qarnul Manazil', "Dzatu Irq", 'Miqat terjauh dari Makkah.'],
    ['Tahallul dilakukan dengan…', 'Mencukur/menggunting rambut', 'Mandi', 'Sholat dua rakaat', 'Berdoa', 'Laki-laki lebih utama mencukur.'],
    ['Haji dengan umrah dahulu lalu berihram haji disebut…', "Tamattu'", 'Ifrad', 'Qiran', 'Wada\'', "Wajib dam (menyembelih kambing)."],
    ['Saat berisyarat ke Hajar Aswad diucapkan…', 'Bismillahi wallahu akbar', 'Labbaika', 'Subhanallah', 'Astaghfirullah', 'Dilakukan tiap putaran bila tak bisa menyentuh.'],
    ['Doa antara Rukun Yamani dan Hajar Aswad adalah…', 'Rabbana atina fid dunya hasanah…', 'Labbaika Allahumma labbaik', 'Allahu akbar', 'Bismillah', 'QS. Al-Baqarah: 201.'],
    ['Sholat dua rakaat setelah thawaf dilakukan di belakang…', 'Maqam Ibrahim', 'Hijr Ismail', 'Marwah', 'Jumrah', 'Jika ramai, boleh di tempat lain di dalam masjid.']
  ];
  let QS = null, qn = 0, qscore = 0;
  const shuf = a => a.map(v => [Math.random(), v]).sort((p, c) => p[0] - c[0]).map(p => p[1]);
  function kuis() {
    if (!QS) { QS = shuf(QZ).slice(0, 8); qn = 0; qscore = 0; }
    if (qn >= QS.length) {
      view.innerHTML = hd('kuis') + `<div class="card"><h2>Skor: ${qscore}/${QS.length}</h2><p class="muted">${qscore >= 7 ? 'Masya Allah, pemahaman manasikmu kuat!' : 'Pelajari kembali panduan umrah dan haji, lalu coba lagi.'}</p><button class="btn" id="again">Ulangi</button></div>`;
      $('#again').onclick = () => { QS = null; kuis(); }; return;
    }
    const x = QS[qn], ops = shuf(x.slice(1, 5));
    view.innerHTML = hd('kuis') + `<div class="card sr-q"><p class="muted small">Soal ${qn + 1} dari ${QS.length}</p><p><b>${esc(x[0])}</b></p>${ops.map(o => `<button data-y="${esc(o)}">${esc(o)}</button>`).join('')}<p id="fb" class="muted"></p></div>`;
    view.onclick = e => {
      const b = e.target.closest('button[data-y]'); if (!b || view.dataset.lock) return;
      const ok = b.dataset.y === x[1]; if (ok) qscore++;
      b.classList.add(ok ? 'ok' : 'no'); view.querySelectorAll('button[data-y]').forEach(t => { if (t.dataset.y === x[1]) t.classList.add('ok'); });
      $('#fb').innerHTML = `${ok ? '✅ Benar.' : '❌ Kurang tepat.'} ${esc(x[5])} <button class="btn sm" id="nx">Lanjut</button>`;
      view.dataset.lock = 1; $('#nx').onclick = () => { delete view.dataset.lock; qn++; kuis(); };
    };
  }

  return function (tab) {
    setTitle('Haji & Umrah', true);
    view.onclick = null; view.onchange = null; delete view.dataset.lock;
    switch (tab) {
      case 'umrah': return steps(UMRAH, 'umrah', 'Umrah', 'Delapan langkah umrah dari miqat sampai tahallul. Ketuk "Tandai paham" untuk melacak belajarmu.');
      case 'haji': return steps(HAJI, 'haji', 'Haji', 'Rangkaian haji tamattu\' sejak 8 sampai 13 Dzulhijjah, ditambah thawaf wada\'.');
      case 'hitung': return hitung();
      case 'peta': return peta();
      case 'ziarah': return ziarah();
      case 'kuis': return kuis();
      case 'pakaian': return pakaian();
      case 'doa': return doa();
      case 'siap': return siap();
      default: return ringkas();
    }
  };
};
