/* Data Kisah Para Nabi & Malaikat.
 * Prinsip: yang dipegang hanya Al-Qur'an dan hadis yang shahih/hasan. Cerita dari Israiliyat diberi catatan.
 * Tahun SM/M adalah perkiraan sejarawan, bukan nash; urutan yang diperselisihkan ditandai u:true.
 * Rujukan ref: [nomor surah, 'rentang ayat', 'label'] tersambung ke halaman surah (offline). */
window.NABI_DATA = (function () {
  const ERA = {
    awal: ['🌱', 'Awal manusia', 'Manusia pertama dan nabi pertama.'],
    nuh: ['🌊', 'Nuh dan umat-umat purba', 'Rasul pertama bagi penduduk bumi, lalu kaum ‘Ad dan Tsamud.'],
    ibrahim: ['🕋', 'Keluarga Ibrahim', 'Bapak para nabi, dan keturunannya: Ismail, Ishaq, Ya‘qub, Yusuf.'],
    musa: ['🌿', 'Madyan, Mesir, dan Bani Israil', 'Syu‘aib, Musa dan Harun, juga para nabi yang diuji sabar.'],
    kerajaan: ['👑', 'Kerajaan Bani Israil', 'Daud dan Sulaiman, lalu Ilyas, Ilyasa‘, dan Yunus.'],
    penutup: ['🌙', 'Menjelang dan penutup risalah', 'Zakariya, Yahya, Isa, hingga Muhammad ﷺ.']
  };

  /* id, ar, n (nama), alt (nama dalam tradisi lain), gelar, tipe, ulul, era, th (waktu), tp (tempat/kaum),
   * kel (hubungan keluarga), ciri (petunjuk kuis), kisah[], mj (mukjizat/keistimewaan), kitab, pel (pelajaran),
   * ref[], hk (kata kunci hadis), u (urutan/waktu diperselisihkan) */
  const NABI = [
    { id: 'adam', ar: 'آدَم', n: 'Adam', alt: 'Adam', gelar: 'Abul Basyar (bapak manusia), Shafiyullah', tipe: 'Nabi', ulul: false, era: 'awal',
      th: 'Awal manusia (tahun tidak diketahui)', tp: 'Surga, lalu diturunkan ke bumi', kel: 'Suami Hawa; ayah seluruh manusia',
      ciri: 'diciptakan langsung dari tanah dan disujudi para malaikat',
      kisah: [
        'Adam adalah manusia pertama dan nabi pertama. Allah menciptakannya dari tanah, meniupkan ruh kepadanya, memerintahkan malaikat bersujud, dan mengajarinya nama-nama segala sesuatu. Semua malaikat sujud kecuali Iblis yang menolak karena sombong.',
        'Adam dan istrinya ditempatkan di surga dan dilarang mendekati satu pohon. Setan membisikkan tipu daya hingga keduanya melanggar. Mereka segera bertaubat dengan doa “Rabbana zhalamna anfusana…” (QS. Al-A‘raf: 23), taubat itu diterima, lalu keduanya diturunkan ke bumi sebagai khalifah.',
        'Dua putra Adam (dikenal dengan nama Habil dan Qabil) mempersembahkan kurban. Satu diterima dan satunya tidak, lalu terjadilah pembunuhan pertama di muka bumi. Hadis menyebut tinggi Adam enam puluh hasta dan usianya sekitar seribu tahun.'
      ],
      mj: 'Diciptakan langsung oleh Allah; diajari nama-nama segala sesuatu.', kitab: 'Tidak disebut dalam Al-Qur’an',
      pel: 'Taubat segera menghapus kesalahan, dan setan adalah musuh nyata manusia.',
      ref: [[2, '30-39', 'Penciptaan & sujud malaikat'], [7, '11-25', 'Surga & taubat'], [20, '115-123', 'Lupa & turun ke bumi'], [5, '27-31', 'Dua putra Adam']], hk: 'adam' },

    { id: 'idris', ar: 'إِدْرِيس', n: 'Idris', alt: 'Dikaitkan sebagian ulama dengan Henokh (Akhnukh); tidak pasti', gelar: 'Ash-Shiddiq (yang sangat jujur)', tipe: 'Nabi', ulul: false, era: 'awal',
      th: 'Antara Adam dan Nuh (waktu diperselisihkan)', tp: 'Tidak disebut dalam Al-Qur’an', kel: 'Tidak disebut dalam dalil shahih', u: true,
      ciri: 'dipuji sebagai nabi yang sangat jujur dan “ditinggikan ke tempat yang tinggi”',
      kisah: [
        'Al-Qur’an hanya menyebut Idris sebagai nabi yang sangat jujur dan sabar, yang “Kami angkat ke tempat yang tinggi”. Para mufasir berbeda: sebagian memaknainya ketinggian derajat, sebagian lagi diangkat secara fisik.',
        'Dalam hadis Isra’ Mi’raj yang shahih, Nabi ﷺ bertemu Idris di langit keempat dan disambut dengan “selamat datang, saudara yang saleh dan nabi yang saleh”.',
        'Banyak cerita populer tentang Idris (penemu tulisan, penjahit, pergi ke langit hidup-hidup) berasal dari Israiliyat tanpa sanad shahih. Pegangan kita hanya yang disebut Al-Qur’an dan hadis shahih.'
      ],
      mj: 'Diangkat ke tempat yang tinggi.', kitab: 'Tidak disebut', pel: 'Kejujuran dan kesabaran meninggikan derajat seseorang di sisi Allah.',
      ref: [[19, '56-57', 'Nabi yang jujur'], [21, '85-86', 'Termasuk orang yang sabar']], hk: 'isra mikraj langit' },

    { id: 'nuh', ar: 'نُوح', n: 'Nuh', alt: 'Noah', gelar: 'Syaikhul Mursalin, Abu Basyar ats-Tsani', tipe: 'Rasul', ulul: true, era: 'nuh',
      th: '±10 abad setelah Adam (riwayat Ibnu Abbas); sebelum ±2000 SM', tp: 'Kaum Nuh; kapal berlabuh di bukit Judi', kel: 'Ayah Sam, Ham, Yafits (menurut riwayat sejarah); satu putranya menolak beriman',
      ciri: 'berdakwah 950 tahun dan membuat kapal besar ketika banjir bandang',
      kisah: [
        'Nuh adalah rasul pertama yang diutus kepada penduduk bumi (HR. Bukhari dan Muslim, hadis syafaat). Kaumnya mulai menyembah patung orang-orang saleh, dan Nuh berdakwah kepada mereka selama 950 tahun (QS. Al-Ankabut: 14), siang dan malam, sembunyi dan terang-terangan. Mereka menutup telinga dengan jari dan menyelimuti diri dengan pakaian karena enggan mendengar.',
        'Pengikutnya hanya sedikit, sedangkan para pembesar mengejeknya. Setelah Allah mewahyukan bahwa tak akan ada lagi yang beriman, Nuh diperintah membuat kapal. Saat perintah Allah datang, air memancar dari tungku, langit menurunkan hujan, dan bumi menyemburkan mata air.',
        'Nuh membawa orang beriman dan sepasang dari setiap jenis makhluk. Putranya menolak naik dan berkata akan berlindung ke gunung, lalu ia tenggelam. Allah menjelaskan bahwa ikatan iman lebih kuat daripada ikatan darah. Kapal berlabuh di bukit Judi.'
      ],
      mj: 'Kapal penyelamat dan banjir bandang yang membinasakan kaum yang ingkar.', kitab: 'Tidak disebut', pel: 'Sabar dalam dakwah tanpa menunggu hasil; iman, bukan nasab, yang menyelamatkan.',
      ref: [[71, '1-28', 'Surah Nuh'], [11, '25-49', 'Kapal & banjir'], [29, '14-15', '950 tahun'], [23, '23-30', 'Perintah membuat kapal']], hk: 'nuh' },

    { id: 'hud', ar: 'هُود', n: 'Hud', alt: 'Dikaitkan sebagian sejarawan dengan Eber; tidak pasti', gelar: 'Nabi kaum ‘Ad', tipe: 'Rasul', ulul: false, era: 'nuh',
      th: 'Setelah Nuh, sebelum Shalih (waktu pasti tidak diketahui)', tp: 'Kaum ‘Ad di Al-Ahqaf (Yaman selatan menurut mufasir)', kel: 'Berasal dari kaum ‘Ad sendiri (“saudara mereka”)', u: true,
      ciri: 'diutus kepada kaum ‘Ad yang perkasa dan dibinasakan angin dingin',
      kisah: [
        'Allah mengutus Hud kepada kaum ‘Ad, pengganti kaum Nuh. Mereka kuat, mendirikan bangunan menjulang, dan berkata “siapa yang lebih kuat dari kami?” (QS. Fushshilat: 15). Hud mengajak mereka menyembah Allah saja dan mensyukuri nikmat.',
        'Mereka menuduh Hud kurang akal dan menantang azab. Maka Allah mengirim awan yang mereka kira pembawa hujan, padahal itu angin dingin yang amat kencang, bertiup tujuh malam delapan hari hingga mereka bergelimpangan seperti batang kurma yang tumbang (QS. Al-Haqqah: 6-7). Hud dan pengikutnya diselamatkan.'
      ],
      mj: 'Al-Qur’an tidak menyebut mukjizat khusus; kaumnya dibinasakan angin dingin.', kitab: 'Tidak disebut', pel: 'Kekuatan dan kemewahan tidak menyelamatkan orang yang sombong dari azab Allah.',
      ref: [[11, '50-60', 'Dakwah Hud'], [7, '65-72', 'Kaum ‘Ad'], [46, '21-26', 'Al-Ahqaf'], [69, '6-8', 'Angin dingin']], hk: '' },

    { id: 'shalih', ar: 'صَالِح', n: 'Shalih', alt: 'Salih', gelar: 'Nabi kaum Tsamud', tipe: 'Rasul', ulul: false, era: 'nuh',
      th: 'Setelah ‘Ad (7:74), sebelum Ibrahim (waktu pasti tidak diketahui)', tp: 'Kaum Tsamud di Al-Hijr (Madain Shalih, Arab Saudi)', kel: 'Berasal dari kaum Tsamud sendiri', u: true,
      ciri: 'mendatangkan unta betina dari batu sebagai tanda bagi kaum Tsamud',
      kisah: [
        'Kaum Tsamud dikaruniai tanah subur dan terampil memahat gunung menjadi rumah. Mereka tetap menyembah selain Allah. Shalih mengajak mereka bertauhid, tetapi mereka meminta bukti.',
        'Allah mengeluarkan seekor unta betina sebagai tanda. Mereka diperintah membiarkannya minum pada harinya dan tidak mengganggu. Mereka justru menyembelihnya, lalu datang azab berupa suara menggelegar dan gempa hingga mereka mati bergelimpangan di rumah masing-masing. Shalih dan yang beriman selamat.',
        'Saat perjalanan menuju Tabuk melewati Al-Hijr, Nabi ﷺ melarang minum airnya dan bersabda agar tidak memasuki tempat orang-orang yang dizalimi kecuali sambil menangis (HR. Bukhari dan Muslim).'
      ],
      mj: 'Unta betina yang keluar dari batu.', kitab: 'Tidak disebut', pel: 'Nikmat yang tidak disyukuri dan peringatan yang diabaikan berujung kebinasaan.',
      ref: [[7, '73-79', 'Unta Allah'], [11, '61-68', 'Azab Tsamud'], [26, '141-159', 'Dakwah Shalih'], [91, '11-15', 'Kaum Tsamud']], hk: 'hijr tsamud' },

    { id: 'ibrahim', ar: 'إِبْرَاهِيم', n: 'Ibrahim', alt: 'Abraham', gelar: 'Khalilullah (kekasih Allah), Abul Anbiya', tipe: 'Rasul', ulul: true, era: 'ibrahim',
      th: '±2000 SM (perkiraan)', tp: 'Irak kuno, Syam (Palestina), Mesir, Mekah', kel: 'Ayah Ismail dan Ishaq; suami Sarah dan Hajar',
      ciri: 'dibakar api tetapi api menjadi dingin, dan diperintah menyembelih putranya',
      kisah: [
        'Ibrahim tumbuh di tengah kaum penyembah berhala, termasuk ayahnya. Ia mencari Tuhan melalui perenungan bintang, bulan, dan matahari hingga menegaskan tauhid. Ia menghancurkan berhala kaumnya kecuali yang paling besar untuk menunjukkan kebodohan sesembahan itu.',
        'Kaumnya membakarnya dengan api yang besar, lalu Allah berfirman: “Wahai api, jadilah dingin dan keselamatan bagi Ibrahim” (QS. Al-Anbiya: 69). Ia berdebat dengan seorang raja yang menyombongkan diri, dan hijrah bersama Sarah. Ia membawa Hajar dan bayi Ismail ke lembah Mekah yang tandus dan meninggalkan mereka dengan tawakal. Dari sanalah terpancar air Zamzam.',
        'Ibrahim diuji dengan perintah menyembelih Ismail. Keduanya pasrah, dan Allah menebusnya dengan sembelihan besar. Dari peristiwa inilah syariat kurban. Bersama Ismail ia meninggikan fondasi Ka’bah dan menyeru manusia berhaji. Namanya diabadikan dalam shalawat dan Al-Qur’an menyebut agamanya sebagai teladan: millah Ibrahim yang lurus.'
      ],
      mj: 'Api menjadi dingin; Allah memperlihatkan cara menghidupkan burung yang telah dicincang.', kitab: 'Shuhuf Ibrahim (QS. Al-A‘la: 19)', pel: 'Tauhid yang teguh, taat penuh kepada perintah Allah, dan berani menyendiri demi kebenaran.',
      ref: [[14, '35-41', 'Doa Ibrahim untuk Mekah'], [21, '51-70', 'Berhala & api'], [37, '99-113', 'Penyembelihan'], [2, '124-129', 'Membangun Ka‘bah'], [6, '74-83', 'Mencari Tuhan']], hk: 'ibrahim' },

    { id: 'luth', ar: 'لُوط', n: 'Luth', alt: 'Lot', gelar: 'Nabi kaum Sodom', tipe: 'Rasul', ulul: false, era: 'ibrahim',
      th: 'Sezaman Ibrahim (±2000 SM)', tp: 'Kota-kota kaum Luth (Sodom, sekitar Laut Mati)', kel: 'Keponakan Ibrahim (menurut mayoritas ulama)',
      ciri: 'kaumnya dihujani batu dan negerinya dijungkirbalikkan',
      kisah: [
        'Luth beriman kepada Ibrahim dan diutus kepada penduduk kota-kota yang melakukan perbuatan keji yang belum pernah dilakukan siapa pun sebelum mereka, serta merampok dan berbuat jahat di tempat umum. Ia menasihati mereka, tetapi mereka malah mengancam mengusirnya karena ia dan pengikutnya “orang yang menyucikan diri”.',
        'Para malaikat mendatangi Ibrahim dengan kabar gembira kelahiran Ishaq, lalu menuju Luth untuk membinasakan kaumnya. Pada waktu subuh negeri itu dijungkirbalikkan dan dihujani batu dari tanah yang terbakar. Luth dan keluarganya selamat kecuali istrinya yang berkhianat dan tetap bersama kaum itu.'
      ],
      mj: 'Diselamatkan dari azab yang membinasakan seluruh kaumnya.', kitab: 'Tidak disebut', pel: 'Menjaga kehormatan diri, dan kedekatan keluarga tidak menjamin keselamatan tanpa iman.',
      ref: [[7, '80-84', 'Kaum Luth'], [11, '77-83', 'Azab'], [15, '57-77', 'Para malaikat'], [26, '160-175', 'Dakwah Luth']], hk: 'luth' },

    { id: 'ismail', ar: 'إِسْمَاعِيل', n: 'Ismail', alt: 'Ishmael', gelar: 'Adz-Dzabih (menurut pendapat yang banyak dikuatkan ulama), Shadiqul Wa‘d', tipe: 'Rasul', ulul: false, era: 'ibrahim',
      th: 'Sezaman Ibrahim', tp: 'Mekah', kel: 'Putra Ibrahim dari Hajar; leluhur bangsa Arab Adnaniyah termasuk Nabi Muhammad ﷺ',
      ciri: 'kisah kurbannya menjadi dasar Idul Adha, dan ia membangun Ka‘bah bersama ayahnya',
      kisah: [
        'Ismail adalah putra pertama Ibrahim yang lahir di usia tua ayahnya. Ia bersama ibunya, Hajar, ditinggalkan di lembah Mekah atas perintah Allah. Ketika bekal habis, Hajar berlari tujuh kali antara Shafa dan Marwah hingga air Zamzam memancar. Peristiwa ini menjadi asal ibadah sa‘i (HR. Bukhari).',
        'Ismail tumbuh di sana, belajar bahasa Arab dari kabilah Jurhum yang kemudian menetap di dekat sumber air itu, dan menikah dari mereka. Saat ayahnya mengatakan telah diperintah menyembelihnya, ia menjawab dengan sabar dan taat. Bersama Ibrahim ia meninggikan fondasi Ka’bah sambil berdoa “Ya Tuhan kami, terimalah dari kami”.',
        'Al-Qur’an memujinya sebagai orang yang benar janjinya, selalu memerintahkan keluarganya salat dan zakat, dan diridai Tuhannya.'
      ],
      mj: 'Selamat dari penyembelihan; Zamzam memancar karenanya.', kitab: 'Mengikuti ajaran ayahnya, Shuhuf Ibrahim', pel: 'Kesabaran dan ketaatan seorang anak kepada perintah Allah.',
      ref: [[37, '100-111', 'Kisah kurban'], [19, '54-55', 'Benar janjinya'], [2, '125-129', 'Membangun Ka‘bah'], [14, '37-39', 'Mekah']], hk: 'ismail zamzam' },

    { id: 'ishaq', ar: 'إِسْحَاق', n: 'Ishaq', alt: 'Isaac', gelar: 'Nabi dari kalangan orang saleh', tipe: 'Nabi', ulul: false, era: 'ibrahim',
      th: 'Setelah Ismail', tp: 'Syam (Kan‘an/Palestina)', kel: 'Putra Ibrahim dan Sarah; ayah Ya‘qub',
      ciri: 'lahir dari ibu yang sudah tua dan mandul, kabarnya dibawa para malaikat',
      kisah: [
        'Para malaikat yang singgah di rumah Ibrahim menyampaikan kabar gembira kelahiran Ishaq. Sarah, istrinya yang sudah tua, tertawa heran. Para malaikat menjawab bahwa itu urusan Allah, dan juga menjanjikan Ya‘qub sebagai cucu.',
        'Ishaq tumbuh sebagai nabi yang saleh dan berilmu. Dari keturunannya lahirlah Ya‘qub dan para nabi Bani Israil, sedangkan dari saudaranya Ismail lahir Nabi Muhammad ﷺ. Al-Qur’an tidak merinci kisah hidupnya secara panjang.'
      ],
      mj: 'Kelahirannya di luar kebiasaan; menjadi leluhur banyak nabi.', kitab: 'Mengikuti ajaran Ibrahim', pel: 'Janji Allah pasti, meski manusia memandangnya mustahil.',
      ref: [[11, '69-73', 'Kabar gembira'], [37, '112-113', 'Nabi dari orang saleh'], [51, '24-30', 'Tamu Ibrahim'], [21, '72-73', 'Anugerah Ishaq & Ya‘qub']], hk: '' },

    { id: 'yaqub', ar: 'يَعْقُوب', n: 'Ya‘qub', alt: 'Jacob / Israil', gelar: 'Israil (hamba Allah)', tipe: 'Nabi', ulul: false, era: 'ibrahim',
      th: '±1900-1700 SM (perkiraan)', tp: 'Kan‘an (Palestina), lalu Mesir', kel: 'Putra Ishaq; ayah dua belas putra termasuk Yusuf; leluhur 12 suku Bani Israil',
      ciri: 'dikenal sebagai Israil dan matanya putih karena kesedihan atas Yusuf',
      kisah: [
        'Ya‘qub adalah putra Ishaq dan cucu Ibrahim. Ia dijuluki Israil, dan dua belas putranya menjadi asal dua belas suku (asbath) Bani Israil. Ketika Yusuf bermimpi sebelas bintang bersujud, Ya‘qub melarangnya menceritakan kepada saudara-saudaranya dan mengisyaratkan Yusuf akan dipilih Allah.',
        'Ketika putra-putranya mengaku Yusuf dimakan serigala dengan baju yang berlumur darah palsu, Ya‘qub berkata, “Maka kesabaran yang baik itulah (kesabaranku)” (QS. Yusuf: 18). Ia menangis hingga matanya memutih, namun tidak mengadu kecuali kepada Allah. Ia memerintahkan putra-putranya mencari Yusuf dan saudaranya serta tidak berputus asa dari rahmat Allah.',
        'Saat baju Yusuf diletakkan di wajahnya, penglihatannya pulih. Ia pindah ke Mesir bersama keluarganya, bertemu Yusuf kembali, dan sebelum wafat berwasiat agar anak-anaknya tetap menyembah Allah Yang Esa.'
      ],
      mj: 'Penglihatannya pulih dengan baju Yusuf; sabar yang indah (shabrun jamil).', kitab: 'Tidak disebut', pel: 'Sabar yang indah: mengadu hanya kepada Allah, dan tidak putus asa dari rahmat-Nya.',
      ref: [[12, '4-6', 'Mimpi Yusuf'], [12, '83-87', 'Sabar jamil'], [12, '93-100', 'Baju Yusuf'], [2, '132-133', 'Wasiat Ya‘qub']], hk: '' },

    { id: 'yusuf', ar: 'يُوسُف', n: 'Yusuf', alt: 'Joseph', gelar: 'Ash-Shiddiq; “mulia putra yang mulia putra yang mulia putra yang mulia”', tipe: 'Rasul', ulul: false, era: 'ibrahim',
      th: '±1900-1700 SM (perkiraan)', tp: 'Kan‘an, lalu Mesir', kel: 'Putra Ya‘qub; cicit Ibrahim',
      ciri: 'dibuang ke sumur oleh saudara-saudaranya, lalu menjadi pejabat tinggi Mesir',
      kisah: [
        'Yusuf kecil bermimpi sebelas bintang, matahari, dan bulan bersujud kepadanya. Saudara-saudaranya yang iri membuangnya ke dasar sumur. Ia ditemukan kafilah dan dijual sebagai budak di Mesir, lalu diasuh di rumah pembesar kerajaan.',
        'Yusuf tumbuh rupawan dan dirayu istri tuannya. Ia berkata “Ma‘adzallah” (aku berlindung kepada Allah) dan lari menuju pintu. Ia difitnah dan dipenjara tanpa bersalah. Di penjara ia berdakwah dan menafsirkan mimpi dua temannya. Ketika raja bermimpi tujuh sapi gemuk dimakan tujuh sapi kurus, Yusuf menafsirkannya sebagai tujuh tahun makmur disusul tujuh tahun paceklik.',
        'Ia dibebaskan setelah namanya dibersihkan, lalu diangkat mengurus perbendaharaan negara dan menyelamatkan Mesir dari kelaparan. Saudara-saudaranya datang membeli gandum tanpa mengenalinya. Setelah mereka bertobat, Yusuf berkata, “Pada hari ini tidak ada cercaan terhadap kamu. Semoga Allah mengampuni kamu” (QS. Yusuf: 92), dan kisah itu ditutup dengan penggenapan mimpinya.',
        'Hadis menyebut Yusuf diberi separuh dari ketampanan (HR. Muslim). Al-Qur’an menamai kisahnya ahsanal qashash, kisah terbaik.'
      ],
      mj: 'Menafsirkan mimpi; ketampanan luar biasa; menjaga diri dari godaan.', kitab: 'Tidak disebut', pel: 'Takwa dan sabar membawa pada kedudukan mulia; memaafkan lebih kuat daripada membalas.',
      ref: [[12, '1-111', 'Surah Yusuf'], [12, '23-34', 'Godaan'], [12, '43-57', 'Mimpi raja'], [12, '90-92', 'Memaafkan']], hk: 'yusuf' },

    { id: 'ayyub', ar: 'أَيُّوب', n: 'Ayyub', alt: 'Job', gelar: 'Teladan kesabaran', tipe: 'Nabi', ulul: false, era: 'musa',
      th: 'Waktu diperselisihkan', tp: 'Tidak disebut dalam Al-Qur’an', kel: 'Tidak disebut dalam dalil shahih', u: true,
      ciri: 'diuji dengan sakit, kehilangan harta dan keluarga, lalu sembuh dengan air yang memancar dari hentakan kaki',
      kisah: [
        'Ayyub diuji dengan penderitaan berat pada tubuh, harta, dan keluarganya, tetapi tetap bersyukur dan sabar. Setelah bertahun-tahun, ia berdoa dengan sangat santun: “(Ya Tuhanku), sungguh aku telah ditimpa penyakit, padahal Engkau Tuhan Yang Maha Penyayang dari semua yang penyayang” (QS. Al-Anbiya: 83). Ia tidak mengeluh dan tidak menuntut.',
        'Allah memerintahkan: “Hentakkanlah kakimu,” maka memancarlah air yang sejuk untuk mandi dan minum, dan ia sembuh. Allah mengembalikan keluarganya dan melipatgandakannya sebagai rahmat. Hadis menyebut Allah juga menurunkan belalang emas kepadanya (HR. Bukhari).',
        'Banyak cerita tentang penyakit Ayyub yang digambarkan menjijikkan atau berlangsung belasan tahun berasal dari Israiliyat tanpa dasar kuat. Yang pasti adalah ujian berat, kesabaran, dan kesembuhan dari Allah.'
      ],
      mj: 'Sembuh dengan mata air dari hentakan kaki; keluarganya dikembalikan dan dilipatgandakan.', kitab: 'Tidak disebut', pel: 'Kesabaran yang disertai doa dan husnuzan menghadirkan pertolongan Allah.',
      ref: [[21, '83-84', 'Doa Ayyub'], [38, '41-44', 'Mata air & kesembuhan']], hk: 'ayyub belalang' },

    { id: 'syuaib', ar: 'شُعَيْب', n: 'Syu‘aib', alt: 'Dikaitkan dengan Yitro (Jethro) dalam tradisi Ibrani; diperselisihkan', gelar: 'Nabi penduduk Madyan', tipe: 'Rasul', ulul: false, era: 'musa',
      th: 'Setelah kaum Luth (11:89); waktu pasti tidak diketahui', tp: 'Madyan (barat laut Jazirah Arab, dekat Teluk Aqabah)', kel: 'Berasal dari penduduk Madyan; sebagian ulama menyebutnya mertua Musa, tetapi tidak ada nash tegas', u: true,
      ciri: 'menegur kaumnya yang curang dalam takaran dan timbangan',
      kisah: [
        'Penduduk Madyan terkenal berdagang, tetapi mereka mengurangi takaran dan timbangan serta membuat kerusakan, bahkan merampok orang yang lewat. Syu‘aib mengingatkan mereka agar menyempurnakan takaran dan tidak merugikan hak manusia.',
        'Mereka mengejeknya, “Apakah salatmu yang memerintahkan agar kami meninggalkan apa yang disembah nenek moyang kami?” dan mengancam mengusir dia dan pengikutnya. Mereka dibinasakan oleh gempa dahsyat, dan menurut ayat lain azab hari awan gelap menaungi mereka (QS. Asy-Syu‘ara: 189). Syu‘aib dan pengikutnya selamat.',
        'Al-Qur’an menceritakan Musa tiba di Madyan, menolong dua perempuan dan menikah di sana, tetapi tidak menyebut nama lelaki tua itu sehingga identitasnya diperselisihkan ulama.'
      ],
      mj: 'Pertolongan bagi pengikutnya dan binasanya kaum yang curang.', kitab: 'Tidak disebut', pel: 'Kejujuran dalam muamalah adalah bagian dari iman, dan kecurangan ekonomi mendatangkan kebinasaan.',
      ref: [[11, '84-95', 'Dakwah Syu‘aib'], [7, '85-93', 'Takaran & timbangan'], [26, '176-191', 'Penduduk Aikah'], [28, '22-28', 'Musa di Madyan']], hk: 'takaran timbangan' },

    { id: 'musa', ar: 'مُوسَى', n: 'Musa', alt: 'Moses', gelar: 'Kalimullah (yang diajak bicara langsung oleh Allah)', tipe: 'Rasul', ulul: true, era: 'musa',
      th: '±1300-1200 SM (perkiraan)', tp: 'Mesir, Madyan, Sinai, Tanah Suci', kel: 'Adik Harun; hidup di istana Firaun lalu hijrah ke Madyan',
      ciri: 'tongkatnya menjadi ular dan laut terbelah, diajak bicara langsung oleh Allah',
      kisah: [
        'Musa lahir saat Firaun menyembelih bayi laki-laki Bani Israil. Atas ilham Allah, ibunya menghanyutkannya di sungai, dipungut keluarga Firaun, dan dikembalikan kepada ibunya untuk disusui. Dewasa, ia secara tak sengaja membunuh seorang Mesir, lalu lari ke Madyan. Di sana ia menolong dua gadis, bekerja bertahun-tahun, dan menikah.',
        'Dalam perjalanan pulang, di lembah Thuwa Allah berbicara kepadanya: “Sesungguhnya Aku adalah Tuhanmu.” Ia diberi tongkat yang menjadi ular dan tangan yang bercahaya, serta diutus bersama Harun kepada Firaun. Para penyihir Firaun dikalahkan, lalu mereka beriman dan bersujud. Firaun tetap sombong.',
        'Musa membawa Bani Israil keluar Mesir di malam hari. Laut terbelah dengan tongkatnya, mereka menyeberang, dan Firaun dengan pasukannya tenggelam. Di Thur Sina ia menerima Taurat setelah empat puluh malam, tetapi di belakangnya sebagian kaum menyembah anak sapi. Bani Israil kemudian menolak memasuki tanah suci dan tersesat di Tih selama empat puluh tahun.',
        'Nama Musa adalah nama nabi yang paling sering disebut di Al-Qur’an. Nabi ﷺ juga mengajarkan puasa Asyura sebagai syukur atas keselamatan Musa dan kaumnya (HR. Bukhari dan Muslim). Kisah perjalanan Musa dan Khidr diceritakan di Surah Al-Kahfi.'
      ],
      mj: 'Tongkat jadi ular; tangan bercahaya; laut terbelah; sembilan ayat (tanda) bagi Firaun; berbicara langsung dengan Allah.', kitab: 'Taurat', pel: 'Percaya kepada janji Allah ketika semua jalan tampak tertutup (“Sesungguhnya Tuhanku bersamaku, Dia akan memberi petunjuk kepadaku”).',
      ref: [[20, '9-98', 'Surah Thaha'], [28, '3-43', 'Lahir & Firaun'], [26, '10-68', 'Laut terbelah'], [7, '103-157', 'Firaun & Taurat'], [18, '60-82', 'Musa dan Khidr']], hk: 'musa' },

    { id: 'harun', ar: 'هَارُون', n: 'Harun', alt: 'Aaron', gelar: 'Wazir (pembantu) Musa', tipe: 'Rasul', ulul: false, era: 'musa',
      th: 'Sezaman Musa (±1300-1200 SM)', tp: 'Mesir dan Sinai', kel: 'Kakak Musa',
      ciri: 'diminta Musa menjadi pendamping karena fasih berbicara',
      kisah: [
        'Musa merasa lidahnya kurang fasih menghadapi Firaun, lalu berdoa: “Jadikanlah untukku seorang pembantu dari keluargaku, Harun, saudaraku” (QS. Thaha: 29-30). Allah mengabulkan doanya dan mengutus keduanya bersama-sama kepada Firaun.',
        'Ketika Musa pergi ke Thur selama empat puluh malam, Harun menggantikannya. Ia menasihati kaumnya agar tidak menyembah anak sapi buatan Samiri, tetapi mereka tidak mendengarkan. Setelah Musa kembali dan menarik kepalanya dengan marah, Harun berkata, “Hai putra ibuku, kaum ini menganggapku lemah dan hampir membunuhku” (QS. Al-A‘raf: 150).'
      ],
      mj: 'Fasih berbicara; doa Musa untuk menjadikannya pendamping dikabulkan.', kitab: 'Bersama Taurat', pel: 'Kekuatan dakwah ada pada kerja sama, dan menjaga persatuan juga amanah.',
      ref: [[20, '29-36', 'Doa Musa'], [20, '90-94', 'Menasihati kaumnya'], [7, '142-151', 'Anak sapi'], [28, '34-35', 'Fasih berbicara']], hk: '' },

    { id: 'dzulkifli', ar: 'ذُو الْكِفْل', n: 'Dzulkifli', alt: 'Kadang dikaitkan dengan Yehezkiel (Hizqil); tidak pasti', gelar: 'Termasuk orang yang sabar dan pilihan', tipe: 'Nabi', ulul: false, era: 'kerajaan',
      th: 'Waktu diperselisihkan', tp: 'Tidak disebut dalam Al-Qur’an', kel: 'Tidak disebut', u: true,
      ciri: 'dua kali disebut Al-Qur’an sebagai orang yang sabar dan termasuk orang pilihan',
      kisah: [
        'Dzulkifli disebut dua kali, selalu bersama para nabi, sebagai orang yang sabar dan “termasuk orang-orang yang paling baik”. Al-Qur’an tidak menyebut kisah hidupnya.',
        'Mayoritas ulama memasukkannya sebagai nabi karena disebut bersama para nabi. Sebagian ulama (seperti Mujahid) menganggapnya hamba saleh yang bukan nabi. Ada yang menyamakannya dengan nabi lain seperti Ilyas, Idris, atau Zakariya, namun semuanya tidak berdasar kuat.',
        'Cerita tentang jaminannya kepada seorang raja tidak berasal dari dalil yang kuat. Pelajaran yang aman: kesabaran dan kesalehan adalah kemuliaan.'
      ],
      mj: 'Tidak disebut secara khusus.', kitab: 'Tidak disebut', pel: 'Sabar adalah ciri utama orang pilihan Allah.',
      ref: [[21, '85-86', 'Orang yang sabar'], [38, '48', 'Orang pilihan']], hk: '' },

    { id: 'daud', ar: 'دَاوُد', n: 'Daud', alt: 'David', gelar: 'Khalifah di bumi, hamba yang sering kembali kepada Allah (awwab)', tipe: 'Rasul', ulul: false, era: 'kerajaan',
      th: '±1000 SM (perkiraan)', tp: 'Palestina (Baitul Maqdis)', kel: 'Ayah Sulaiman',
      ciri: 'mengalahkan Jalut dan Allah melunakkan besi baginya',
      kisah: [
        'Daud adalah prajurit muda dalam pasukan Thalut. Ia membunuh Jalut, panglima musuh yang perkasa (QS. Al-Baqarah: 251). Allah kemudian memberinya kerajaan dan hikmah, serta mengajarkan sesuatu yang Dia kehendaki.',
        'Allah melunakkan besi untuknya sehingga ia membuat baju besi, dan gunung-gunung serta burung-burung bertasbih bersamanya setiap pagi dan petang. Suaranya sangat merdu. Nabi ﷺ pernah memuji suara Abu Musa dengan bersabda bahwa ia diberi “seruling dari seruling keluarga Daud”. Kitab Zabur diturunkan kepadanya.',
        'Daud adalah hakim yang adil. Dalam satu kisah dua orang memanjat dinding mihrabnya untuk berselisih tentang domba, dan ia menyadari bahwa itu ujian, lalu memohon ampun dan bersujud. Nabi ﷺ bersabda bahwa puasa yang paling disukai Allah adalah puasa Daud (sehari berpuasa, sehari tidak) dan salat yang paling disukai adalah salat Daud (tidur separuh malam, bangun sepertiganya, tidur seperenamnya) (HR. Bukhari dan Muslim).'
      ],
      mj: 'Besi menjadi lunak; gunung dan burung bertasbih bersamanya; suara merdu; kerajaan dan hikmah.', kitab: 'Zabur', pel: 'Kekuasaan tidak menghalangi ibadah. Daud adalah raja yang tetap rajin beribadah dan segera bertaubat.',
      ref: [[38, '17-26', 'Daud & ujian'], [34, '10-11', 'Besi dilunakkan'], [2, '249-251', 'Thalut & Jalut'], [21, '78-80', 'Hukum & baju besi']], hk: 'puasa daud' },

    { id: 'sulaiman', ar: 'سُلَيْمَان', n: 'Sulaiman', alt: 'Solomon', gelar: 'Raja dan nabi yang diberi kerajaan tiada banding', tipe: 'Nabi', ulul: false, era: 'kerajaan',
      th: '±970-930 SM (perkiraan)', tp: 'Palestina (Baitul Maqdis)', kel: 'Putra Daud, mewarisi kenabian dan kerajaannya',
      ciri: 'dapat berbicara dengan burung dan semut, dan tunduk padanya jin serta angin',
      kisah: [
        'Sulaiman mewarisi kenabian dan kerajaan ayahnya. Ia berkata, “Wahai manusia, kami telah diajari bahasa burung dan kami diberi segala sesuatu” (QS. An-Naml: 16). Angin, jin, dan binatang tunduk kepadanya. Ia berdoa meminta kerajaan yang tidak patut dimiliki siapa pun setelahnya (QS. Shad: 35).',
        'Saat pasukannya melewati lembah semut, seekor semut memperingatkan kaumnya agar masuk sarang. Sulaiman tersenyum dan berdoa untuk dapat bersyukur. Ia memeriksa burung-burung dan mendapati Hud-hud tidak hadir. Hud-hud datang membawa kabar tentang negeri Saba‘ yang dipimpin seorang ratu dan rakyatnya menyembah matahari. Sulaiman mengirim surat berawalan “Bismillahirrahmanirrahim”, lalu sang ratu akhirnya beriman.',
        'Sulaiman wafat dalam keadaan bersandar pada tongkatnya. Para jin yang bekerja tidak mengetahuinya hingga rayap memakan tongkatnya dan ia jatuh. Ini menunjukkan jin tidak mengetahui yang gaib.'
      ],
      mj: 'Memahami bahasa burung dan semut; angin, jin, dan logam cair dalam kendalinya.', kitab: 'Bersama Zabur', pel: 'Nikmat terbesar menuntut syukur terbesar, dan semua kekuasaan hanyalah titipan dari Allah.',
      ref: [[27, '15-44', 'Semut, Hud-hud & Ratu Saba'], [38, '30-40', 'Ujian Sulaiman'], [34, '12-14', 'Jin & tongkat'], [21, '78-82', 'Angin dan jin']], hk: 'sulaiman' },

    { id: 'ilyas', ar: 'إِلْيَاس', n: 'Ilyas', alt: 'Elijah', gelar: 'Nabi yang menentang penyembah Ba‘l', tipe: 'Rasul', ulul: false, era: 'kerajaan',
      th: '±abad ke-9 SM (perkiraan)', tp: 'Syam (menurut mufasir)', kel: 'Tidak disebut dalam dalil shahih', u: true,
      ciri: 'menegur kaumnya yang menyembah berhala Ba‘l',
      kisah: [
        'Ilyas diutus kepada kaum yang menyembah berhala bernama Ba‘l. Ia berkata, “Mengapa kamu tidak bertakwa? Patutkah kamu menyembah Ba‘l dan kamu tinggalkan sebaik-baik Pencipta?” (QS. Ash-Shaffat: 124-125).',
        'Kaumnya mendustakannya, kecuali hamba-hamba Allah yang tulus. Al-Qur’an menyebut “salam sejahtera bagi Ilyasin” (Ilyas) dan memujinya sebagai hamba yang beriman. Rincian lain (seperti api yang turun menguji persembahan) berasal dari tradisi Bani Israil dan tidak dijamin Al-Qur’an maupun hadis shahih.'
      ],
      mj: 'Tidak disebut secara khusus.', kitab: 'Tidak disebut', pel: 'Tauhid harus dijaga walaupun mayoritas kaum menyimpang.',
      ref: [[37, '123-132', 'Dakwah Ilyas'], [6, '85', 'Termasuk orang saleh']], hk: '' },

    { id: 'ilyasa', ar: 'الْيَسَع', n: 'Ilyasa‘', alt: 'Elisha', gelar: 'Termasuk orang-orang pilihan', tipe: 'Nabi', ulul: false, era: 'kerajaan',
      th: 'Setelah Ilyas (±abad ke-9-8 SM, perkiraan)', tp: 'Syam (menurut mufasir)', kel: 'Menurut tradisi, murid dan pengganti Ilyas', u: true,
      ciri: 'disebut Al-Qur’an bersama Ismail dan Dzulkifli sebagai orang pilihan',
      kisah: [
        'Al-Qur’an hanya menyebut namanya dua kali, termasuk dalam daftar para nabi yang diutamakan atas seluruh alam dan sebagai orang-orang pilihan. Rincian hidupnya dikenal dari tradisi Bani Israil: ia pengganti Ilyas dalam berdakwah kepada kaum yang menyimpang.',
        'Kita meyakini kenabiannya, mengimani bahwa Allah memilihnya, dan menahan diri dari rincian tanpa sandaran dalil.'
      ],
      mj: 'Tidak disebut secara khusus.', kitab: 'Tidak disebut', pel: 'Tidak semua kisah nabi perlu dirinci; yang utama adalah iman dan keteladanan.',
      ref: [[6, '86', 'Diutamakan atas seluruh alam'], [38, '48', 'Orang-orang pilihan']], hk: '' },

    { id: 'yunus', ar: 'يُونُس', n: 'Yunus', alt: 'Jonah', gelar: 'Dzun-Nun, Shahibul Hut (yang ditelan ikan besar)', tipe: 'Rasul', ulul: false, era: 'kerajaan',
      th: '±abad ke-8 SM (perkiraan)', tp: 'Ninawa (sekitar Mosul, Irak) menurut mufasir', kel: 'Putra Matta',
      ciri: 'ditelan ikan besar dan berdoa di dalam tiga kegelapan',
      kisah: [
        'Yunus diutus kepada sekitar seratus ribu orang atau lebih. Ketika kaumnya terus menolak, ia pergi dalam keadaan marah sebelum ada izin dari Allah. Ia menaiki kapal yang penuh sesak; undian jatuh padanya sehingga ia dilemparkan ke laut dan ditelan ikan besar.',
        'Dalam kegelapan malam, laut, dan perut ikan, Yunus berdoa: “Tidak ada tuhan selain Engkau, Maha Suci Engkau, sungguh aku termasuk orang-orang yang zalim” (QS. Al-Anbiya: 87). Nabi ﷺ bersabda tidak ada seorang muslim yang berdoa dengannya kecuali Allah mengabulkan (HR. Tirmidzi, shahih). Ikan memuntahkannya ke pantai dalam keadaan sakit, dan Allah menumbuhkan pohon yaqthin untuk menaunginya.',
        'Ternyata kaumnya telah beriman setelah melihat tanda azab, dan itu satu-satunya kaum yang imannya bermanfaat di saat itu (QS. Yunus: 98). Nabi ﷺ bersabda, “Tidak pantas bagi seorang pun mengatakan aku lebih baik dari Yunus bin Matta” (HR. Bukhari dan Muslim).'
      ],
      mj: 'Selamat dari perut ikan besar; kaumnya beriman seluruhnya.', kitab: 'Tidak disebut', pel: 'Jangan meninggalkan tugas dakwah dengan emosi, dan doa taubat terbuka di setiap keadaan.',
      ref: [[21, '87-88', 'Doa Dzun-Nun'], [37, '139-148', 'Ikan besar'], [10, '98', 'Kaum Yunus'], [68, '48-50', 'Jangan seperti Shahibul Hut']], hk: 'yunus' },

    { id: 'zakariya', ar: 'زَكَرِيَّا', n: 'Zakariya', alt: 'Zechariah', gelar: 'Pengasuh Maryam', tipe: 'Nabi', ulul: false, era: 'penutup',
      th: 'Akhir abad ke-1 SM (perkiraan)', tp: 'Baitul Maqdis', kel: 'Ayah Yahya; wali Maryam (ibu Isa)',
      ciri: 'dikaruniai anak di usia tua dengan istri yang mandul, dan diberi tanda tidak bicara tiga hari',
      kisah: [
        'Zakariya mengasuh Maryam di mihrab dan terkagum setiap kali mendapati rezeki di sisinya. Maryam menjawab, “Itu dari Allah.” Hal itu menggetarkan hatinya, lalu ia berdoa lirih memohon keturunan padahal tulangnya telah lemah, kepalanya beruban, dan istrinya mandul.',
        'Malaikat menyampaikan kabar gembira kelahiran Yahya, dan sebagai tanda ia tidak berbicara kepada manusia selama tiga malam kecuali dengan isyarat, namun terus berzikir pagi dan petang.',
        'Hadis menyebut Zakariya bekerja sebagai tukang kayu (HR. Muslim). Kisah wafatnya yang dikenal dalam sebagian kitab tidak bersumber dari dalil shahih.'
      ],
      mj: 'Doa yang dikabulkan; dikaruniai anak di usia tua.', kitab: 'Tidak disebut', pel: 'Jangan pernah merasa terlambat untuk berdoa kepada Allah.',
      ref: [[19, '2-11', 'Doa Zakariya'], [3, '37-41', 'Mihrab Maryam'], [21, '89-90', 'Doa memohon keturunan']], hk: 'zakariya tukang kayu' },

    { id: 'yahya', ar: 'يَحْيَى', n: 'Yahya', alt: 'John the Baptist', gelar: 'Sayyid, Hashur', tipe: 'Nabi', ulul: false, era: 'penutup',
      th: 'Akhir abad ke-1 SM – awal abad ke-1 M (perkiraan)', tp: 'Palestina', kel: 'Putra Zakariya; kerabat (sepupu) Isa',
      ciri: 'namanya belum pernah dipakai sebelumnya dan diberi hikmah sejak kanak-kanak',
      kisah: [
        'Allah memberi nama Yahya yang belum pernah dipakai orang sebelum dia. Ia diperintahkan memegang Kitab dengan teguh, “dan Kami berikan kepadanya hikmah selagi ia masih kanak-kanak” (QS. Maryam: 12). Ia penuh kasih sayang, bersih, bertakwa, berbakti kepada kedua orang tua, dan tidak sombong atau durhaka.',
        'Ia membenarkan Isa, kalimat dari Allah, dan dipuji sebagai pemimpin (sayyid) yang menahan diri dari syahwat (hashur). Dalam hadis, Nabi ﷺ bertemu Yahya dan Isa di langit kedua dan menyebut keduanya anak-anak bibi (sepupu). Nabi ﷺ juga menyebut lima perkara yang Allah perintahkan kepada Yahya agar disampaikan kepada Bani Israil (HR. Tirmidzi).',
        'Wafatnya sebagai syahid di tangan penguasa zalim dikenal luas, tetapi rinciannya bukan dari dalil shahih.'
      ],
      mj: 'Hikmah sejak kecil; lahir dari ayah yang tua dan ibu yang mandul.', kitab: 'Diperintahkan memegang Kitab (Taurat) dengan teguh', pel: 'Ilmu dan kebijaksanaan tidak menunggu usia; kebaktian pada orang tua adalah ciri para nabi.',
      ref: [[19, '7-15', 'Kelahiran Yahya'], [3, '38-41', 'Kabar gembira']], hk: 'yahya isa' },

    { id: 'isa', ar: 'عِيسَى', n: 'Isa', alt: 'Jesus', gelar: 'Al-Masih, Putra Maryam, Kalimatullah, Ruhullah', tipe: 'Rasul', ulul: true, era: 'penutup',
      th: 'Awal abad ke-1 M (perkiraan)', tp: 'Palestina (Baitul Maqdis, Nazaret/Betlehem menurut tradisi)', kel: 'Putra Maryam tanpa ayah; kerabat Yahya',
      ciri: 'lahir tanpa ayah dan berbicara sejak bayi, serta menghidupkan orang mati dengan izin Allah',
      kisah: [
        'Maryam, wanita suci yang bernazar mengabdi di rumah ibadah, didatangi Jibril dalam rupa manusia sempurna dan diberi kabar gembira tentang seorang putra. Ia melahirkan di bawah pohon kurma lalu tetap tenang, bahkan bayi itu berbicara: “Sesungguhnya aku hamba Allah, Dia memberiku Kitab dan menjadikanku seorang nabi.”',
        'Isa diutus kepada Bani Israil dengan Injil, membenarkan Taurat. Dengan izin Allah ia membentuk burung dari tanah lalu meniupnya hingga hidup, menyembuhkan orang buta sejak lahir dan penderita kusta, menghidupkan orang mati, serta memberitahu apa yang mereka makan dan simpan di rumah. Para hawariyyun (pengikut setia) menjadi penolongnya. Atas permohonan mereka Allah menurunkan hidangan dari langit.',
        'Sebagian Bani Israil berkomplot hendak membunuhnya, tetapi Al-Qur’an menegaskan mereka tidak membunuh dan tidak menyalibnya; Allah mengangkatnya kepada-Nya (QS. An-Nisa: 157-158). Isa membawa kabar gembira tentang Rasul sesudahnya bernama Ahmad. Kaum muslimin meyakini ia akan turun kembali di akhir zaman, menegakkan hukum Allah, dan membunuh Dajjal (HR. Bukhari dan Muslim).',
        'Al-Qur’an menegaskan bahwa Isa adalah hamba dan rasul Allah, bukan anak Tuhan dan bukan tuhan, dan Allah menyamakan penciptaannya dengan Adam dari tanah.'
      ],
      mj: 'Lahir tanpa ayah; bicara di buaian; menyembuhkan buta dan kusta; menghidupkan orang mati dengan izin Allah; hidangan dari langit; diangkat ke sisi Allah.', kitab: 'Injil', pel: 'Tauhid yang murni, kasih sayang kepada sesama, dan kesadaran sebagai hamba Allah.',
      ref: [[19, '16-36', 'Surah Maryam'], [3, '45-59', 'Kabar gembira & mukjizat'], [5, '110-118', 'Hidangan & kesaksian Isa'], [4, '157-159', 'Diangkat ke sisi Allah'], [61, '6', 'Kabar gembira tentang Ahmad']], hk: 'isa putra maryam' },

    { id: 'muhammad', ar: 'مُحَمَّد ﷺ', n: 'Muhammad', alt: 'Ahmad', gelar: 'Khatamun Nabiyyin, Rahmatan lil ‘Alamin, Al-Amin', tipe: 'Rasul', ulul: true, era: 'penutup',
      th: '570-632 M (wafat 11 H)', tp: 'Mekah dan Madinah', kel: 'Putra Abdullah dan Aminah; keturunan Ismail; suami Khadijah dan lainnya',
      ciri: 'penutup para nabi yang membawa Al-Qur’an sebagai mukjizat abadi',
      kisah: [
        'Muhammad ﷺ lahir di Mekah pada tahun Gajah dalam keadaan yatim. Beliau dikenal jujur dan dijuluki Al-Amin. Pada usia 40 tahun, Jibril datang di Gua Hira dan menurunkan wahyu pertama “Iqra’”. Selama 13 tahun di Mekah beliau berdakwah menghadapi boikot dan penyiksaan, lalu hijrah ke Madinah dan membangun masyarakat berlandaskan tauhid dan keadilan.',
        'Beliau memimpin kaum muslimin dalam perang Badar, Uhud, Khandaq, Hudaibiyah, Fathu Makkah, hingga Haji Wada‘. Beliau wafat di Madinah pada usia 63 tahun, setelah risalah sempurna. Kisah lengkapnya bisa dibaca di halaman Sirah Nabawiyah.',
        'Beliau adalah penutup para nabi (QS. Al-Ahzab: 40), diutus sebagai rahmat bagi seluruh alam, dan menjadi teladan terbaik. Dalam hadis, beliau bersabda bahwa perumpamaan dirinya dan para nabi sebelumnya seperti sebuah bangunan indah yang kurang satu batu bata; beliau adalah batu bata terakhir itu (HR. Bukhari dan Muslim).'
      ],
      mj: 'Al-Qur’an (mukjizat abadi), Isra’ Mi’raj, terbelahnya bulan, dan akhlak yang agung.', kitab: 'Al-Qur’an', pel: 'Meneladani akhlak dan sunnahnya adalah jalan cinta kepada Allah.',
      ref: [[33, '40', 'Penutup para nabi'], [21, '107', 'Rahmat bagi semesta'], [33, '21', 'Teladan terbaik'], [96, '1-5', 'Wahyu pertama'], [48, '29', 'Muhammad Rasulullah']], hk: 'batu bata terakhir' }
  ];

  const LAIN = [
    ['Luqman', 'Hamba saleh yang diberi hikmah dan menasihati putranya (QS. Luqman: 12-19). Menurut jumhur ulama ia bukan nabi.'],
    ['Dzulqarnain', 'Raja yang saleh dan kuat, bepergian ke timur dan barat serta membangun benteng melawan Yakjuj dan Makjuj (QS. Al-Kahfi: 83-98). Kenabiannya diperselisihkan.'],
    ['Khidr', 'Hamba saleh yang diberi ilmu khusus dari sisi Allah dan ditemui Musa (QS. Al-Kahfi: 65-82). Para ulama berbeda: nabi, wali, atau hamba saleh; nama “Khidr” berasal dari hadis shahih.'],
    ['Maryam', 'Satu-satunya perempuan yang disebut namanya dalam Al-Qur’an; wanita shiddiqah yang disucikan, ibu Isa. Jumhur ulama menyatakan ia bukan nabi.'],
    ['Uzair', 'Disebut dalam QS. At-Taubah: 30 terkait keyakinan sebagian Yahudi. Al-Qur’an tidak menyebut kenabiannya.'],
    ['Ashabul Kahfi', 'Para pemuda beriman yang tertidur di gua selama 309 tahun (QS. Al-Kahfi: 9-26).'],
    ['Thalut', 'Raja Bani Israil yang dipilih Allah dengan keluasan ilmu dan fisik; Daud berperang di bawah kepemimpinannya (QS. Al-Baqarah: 246-251).']
  ];

  /* ---------- MALAIKAT ---------- */
  /* s = sumber nama: q (disebut Al-Qur’an), h (hadis shahih/hasan), u (nama dari ulama, tanpa nash shahih) */
  const MALAIKAT = [
    { id: 'jibril', ar: 'جِبْرِيل', n: 'Jibril', gelar: 'Ar-Ruh Al-Amin, Ar-Ruh Al-Qudus, Namus', s: 'q', wajib: true,
      tugas: 'Menyampaikan wahyu kepada para nabi', ciri: 'menyampaikan wahyu dari Allah kepada para nabi',
      isi: 'Malaikat paling mulia yang diberi amanah wahyu. Ia turun membawa Al-Qur’an ke hati Nabi ﷺ. Ia datang kepada Maryam dalam rupa manusia sempurna, menyampaikan wahyu kepada para nabi, dan atas perintah Allah membinasakan kaum Luth. Nabi ﷺ melihat rupa aslinya dua kali, dengan enam ratus sayap yang menutupi ufuk (HR. Bukhari dan Muslim). Ia kadang datang berupa seorang lelaki berbaju sangat putih berambut sangat hitam untuk mengajarkan Islam, Iman, dan Ihsan (HR. Muslim) dan mengulang Al-Qur’an bersama Nabi ﷺ setiap Ramadhan (HR. Bukhari).',
      ref: [[2, '97-98', 'Jibril'], [26, '192-195', 'Ar-Ruh Al-Amin'], [81, '19-23', 'Utusan mulia'], [19, '17-21', 'Kepada Maryam']] },
    { id: 'mikail', ar: 'مِيكَائِيل', n: 'Mikail', gelar: 'Mikal', s: 'q', wajib: true,
      tugas: 'Menurunkan hujan dan mengatur rezeki', ciri: 'mengatur hujan, tumbuhan, dan rezeki',
      isi: 'Namanya disebut bersama Jibril dalam ayat yang menegaskan bahwa siapa yang memusuhi mereka berarti memusuhi Allah. Para ulama menjelaskan tugasnya mengurus hujan dan tumbuhan (rezeki), meski rincian tugas ini diambil dari penjelasan ulama, bukan hadis shahih yang tegas. Nabi ﷺ berdoa di malam hari menyebut “Ya Allah, Tuhan Jibril, Mikail, dan Israfil” (HR. Muslim).',
      ref: [[2, '98', 'Musuh Jibril dan Mikail']] },
    { id: 'israfil', ar: 'إِسْرَافِيل', n: 'Israfil', gelar: '', s: 'h', wajib: true,
      tugas: 'Meniup sangkakala (kiamat dan kebangkitan)', ciri: 'meniup sangkakala pada hari kiamat',
      isi: 'Nama Israfil disebut dalam doa Nabi ﷺ di malam hari (HR. Muslim). Para ulama menyatakan dialah pemilik sangkakala yang meniupnya dua kali: tiupan pertama mematikan seluruh makhluk, tiupan kedua menghidupkan kembali. Nabi ﷺ bersabda bahwa pemilik sangkakala telah menempelkan terompet ke mulutnya dan menunggu perintah (HR. Tirmidzi dan Ahmad).',
      ref: [[39, '68', 'Tiupan sangkakala'], [36, '51-53', 'Kebangkitan'], [6, '73', 'Hari ditiup sangkakala']] },
    { id: 'izrail', ar: 'مَلَكُ الْمَوْتِ', n: 'Malakul Maut (Izrail)', gelar: 'Malakul Maut', s: 'u', wajib: true,
      tugas: 'Mencabut nyawa makhluk', ciri: 'mencabut nyawa makhluk bernyawa',
      isi: 'Al-Qur’an menyebutnya “Malakul Maut” yang ditugaskan mencabut nyawa, dibantu para malaikat utusan lain. Nama “Izrail” sangat masyhur, tetapi tidak ada nash shahih yang menyebut nama itu; sebagian ulama menyebutnya berasal dari riwayat tanpa sanad kuat. Hadis shahih menceritakan ia datang kepada Musa dan Musa menamparnya, lalu Allah mengembalikan matanya; kelak ia datang lagi dan Musa menerima ketentuan Allah (HR. Bukhari dan Muslim).',
      ref: [[32, '11', 'Malakul Maut'], [6, '61', 'Utusan Kami mencabut nyawa'], [4, '97', 'Dicabut oleh malaikat']] },
    { id: 'munkar', ar: 'مُنْكَر', n: 'Munkar', gelar: '', s: 'h', wajib: true,
      tugas: 'Bertanya kepada penghuni kubur', ciri: 'bersama Nakir bertanya di alam kubur',
      isi: 'Hadis hasan menyebut bahwa ketika mayit dikubur, datang dua malaikat berwarna hitam kebiruan; salah satunya bernama Munkar dan satunya Nakir (HR. Tirmidzi). Mereka mengajukan tiga pertanyaan: siapa Tuhanmu, apa agamamu, dan siapa lelaki yang diutus di tengah kalian. Allah meneguhkan orang beriman dengan ucapan yang teguh.',
      ref: [[14, '27', 'Diteguhkan dengan ucapan yang teguh']] },
    { id: 'nakir', ar: 'نَكِير', n: 'Nakir', gelar: '', s: 'h', wajib: true,
      tugas: 'Bertanya kepada penghuni kubur bersama Munkar', ciri: 'bersama Munkar bertanya di alam kubur',
      isi: 'Pasangan Munkar dalam pertanyaan kubur. Orang beriman menjawab dengan benar dan dilapangkan kuburnya. Orang yang ragu berkata “aku hanya mendengar orang berkata sesuatu lalu aku ikut mengatakannya” dan akan mendapat azab kubur.',
      ref: [[40, '46', 'Azab kubur'], [14, '27', 'Teguh di akhirat']] },
    { id: 'raqib', ar: 'رَقِيب', n: 'Raqib', gelar: '', s: 'u', wajib: true,
      tugas: 'Mencatat amal baik manusia', ciri: 'mencatat kebaikan (di sisi kanan, menurut sebagian ulama)',
      isi: 'Al-Qur’an menyebut dua malaikat yang duduk di kanan dan kiri manusia: “raqibun ‘atid”, yang mengawasi dan siap mencatat. Kata ini lalu dipakai ulama sebagai nama malaikat pencatat kebaikan (Raqib) dan pencatat keburukan (Atid). Al-Qur’an memakainya sebagai sifat dan tidak menegaskan keduanya nama pribadi; dalam ayat lain mereka disebut “Kiraman Katibin” (para pencatat mulia).',
      ref: [[50, '16-18', 'Dua pencatat'], [82, '10-12', 'Kiraman Katibin']] },
    { id: 'atid', ar: 'عَتِيد', n: 'Atid', gelar: '', s: 'u', wajib: true,
      tugas: 'Mencatat amal buruk manusia', ciri: 'mencatat keburukan (di sisi kiri, menurut sebagian ulama)',
      isi: 'Pasangan Raqib. Sebagian riwayat menyebut malaikat di sebelah kiri menunda mencatat keburukan agar hamba sempat bertaubat. Tidak ada satu ucapan pun yang terlontar kecuali ada pengawas yang siap mencatat.',
      ref: [[50, '17-18', 'Kanan dan kiri'], [43, '80', 'Utusan Kami mencatat']] },
    { id: 'malik', ar: 'مَالِك', n: 'Malik', gelar: 'Penjaga neraka', s: 'q', wajib: true,
      tugas: 'Penjaga neraka', ciri: 'bertugas menjaga neraka',
      isi: 'Penghuni neraka memanggil “Wahai Malik! Biarlah Tuhanmu membunuh kami saja,” lalu ia menjawab, “Kamu akan tetap tinggal (di sini).” Ia memimpin para penjaga neraka (Zabaniyah) yang berjumlah sembilan belas, kasar dan keras, tidak mendurhakai perintah Allah.',
      ref: [[43, '77', 'Wahai Malik'], [74, '26-31', 'Sembilan belas penjaga'], [66, '6', 'Malaikat yang keras']] },
    { id: 'ridwan', ar: 'رِضْوَان', n: 'Ridwan', gelar: 'Penjaga surga', s: 'u', wajib: true,
      tugas: 'Penjaga surga', ciri: 'bertugas menjaga surga',
      isi: 'Para ulama menyebut nama Ridwan untuk penjaga surga. Al-Qur’an tidak menyebut namanya, tetapi menyebut “penjaga-penjaganya” yang menyambut penghuni surga: “Salamun ‘alaikum, berbahagialah kamu, maka masukilah (surga) ini, kamu kekal di dalamnya.” Tidak ada hadis shahih yang menyebut nama Ridwan secara tegas.',
      ref: [[39, '73', 'Penjaga surga menyambut'], [13, '23-24', 'Malaikat masuk dari semua pintu']] }
  ];

  const MALAIKAT_LAIN = [
    ['Harut dan Marut', '📜', 'Dua malaikat di negeri Babilonia yang menjadi ujian bagi manusia: mereka berkata, “Kami hanyalah cobaan, maka janganlah kamu kufur.” Kisah populer tentang “Zuhrah” berasal dari Israiliyat dan tidak shahih. (QS. Al-Baqarah: 102)'],
    ['Kiraman Katibin', '✍️', 'Para malaikat pencatat mulia yang mengetahui semua yang manusia lakukan. (QS. Al-Infithar: 10-12)'],
    ['Hamalatul Arsy', '👑', 'Para malaikat pemikul ‘Arsy yang bertasbih dan memohonkan ampun bagi orang beriman; pada hari kiamat delapan malaikat memikulnya. (QS. Ghafir: 7; Al-Haqqah: 17)'],
    ['Zabaniyah', '🔥', 'Para penjaga neraka yang berjumlah sembilan belas; kasar dan tidak mendurhakai perintah Allah. (QS. Al-‘Alaq: 18; Al-Muddatstsir: 30-31)'],
    ['Mu‘aqqibat (penjaga bergiliran)', '🛡️', 'Malaikat yang menyertai manusia di depan dan belakangnya menjaganya atas perintah Allah. (QS. Ar-Ra‘d: 11)'],
    ['Malaikat penjaga gunung', '⛰️', 'Ia datang kepada Nabi ﷺ setelah peristiwa Thaif dan menawarkan menimpakan dua gunung kepada penduduk Mekah, tetapi Nabi ﷺ berharap dari mereka lahir yang menyembah Allah (HR. Bukhari dan Muslim).'],
    ['Malaikat penjaga rahim', '🤰', 'Ditugaskan di rahim; ia meniupkan ruh janin pada usia empat bulan dan menuliskan rezeki, ajal, amal, serta celaka atau bahagia (HR. Bukhari dan Muslim).'],
    ['Malaikat di Baitul Ma‘mur', '🕋', 'Setiap hari tujuh puluh ribu malaikat salat di Baitul Ma‘mur di langit ketujuh dan tidak kembali lagi kepadanya (HR. Bukhari dan Muslim).'],
    ['Malaikat penolong di Badar', '⚔️', 'Allah membantu kaum muslimin dengan seribu, tiga ribu, hingga lima ribu malaikat. (QS. Al-Anfal: 9; Ali ‘Imran: 123-125)'],
    ['Tamu Ibrahim dan Luth', '🤝', 'Para malaikat yang membawa kabar gembira kelahiran Ishaq kepada Ibrahim, lalu membinasakan kaum Luth. (QS. Hud: 69-83)']
  ];

  const SIFAT = [
    ['Diciptakan dari cahaya', 'Nabi ﷺ bersabda bahwa malaikat diciptakan dari cahaya, jin dari nyala api, dan Adam dari apa yang telah disifatkan kepada kalian (HR. Muslim).'],
    ['Patuh sepenuhnya', 'Mereka tidak mendurhakai Allah atas apa yang Dia perintahkan dan mengerjakan apa yang diperintahkan. (QS. At-Tahrim: 6)'],
    ['Bukan laki-laki dan bukan perempuan', 'Al-Qur’an menolak anggapan bahwa malaikat adalah anak perempuan Allah. Tidak ada dalil yang menetapkan mereka berkelamin.'],
    ['Bersayap', 'Ada yang bersayap dua, tiga, empat, dan lebih. (QS. Fathir: 1) Jibril memiliki enam ratus sayap (HR. Bukhari dan Muslim).'],
    ['Dapat menjelma sebagai manusia', 'Jibril datang kepada Maryam dalam rupa manusia sempurna dan kepada Nabi ﷺ sebagai seorang lelaki. (QS. Maryam: 17)'],
    ['Tidak makan dan tidak minum', 'Dalam kisah tamu Ibrahim, para malaikat tidak menyentuh hidangan sehingga Ibrahim merasa takut. (QS. Hud: 69-70)'],
    ['Bertasbih tanpa lelah', 'Mereka bertasbih malam dan siang tanpa henti. (QS. Al-Anbiya: 19-20)'],
    ['Jumlahnya tak terhitung', 'Tidak ada yang mengetahui jumlah pasukan Tuhanmu selain Dia. (QS. Al-Muddatstsir: 31)']
  ];

  /* Amalan dan keadaan yang membuat malaikat hadir atau mendoakan */
  const AMAL = [
    ['Mendoakan saudaranya tanpa sepengetahuannya', 'Malaikat berkata “Amin, dan bagimu seperti itu pula.” (HR. Muslim)'],
    ['Duduk menunggu salat dalam keadaan berwudhu', 'Para malaikat mendoakan, “Ya Allah, ampunilah dia, rahmatilah dia.” (HR. Bukhari dan Muslim)'],
    ['Salat Subuh dan Ashar', 'Malaikat malam dan siang berkumpul saat dua salat ini dan bersaksi tentang hamba-hamba-Nya. (HR. Bukhari dan Muslim)'],
    ['Majelis zikir', 'Malaikat berkeliling mencari majelis zikir dan mengelilingi mereka. (HR. Bukhari dan Muslim)'],
    ['Datang awal pada hari Jumat', 'Malaikat berdiri di pintu masjid mencatat orang yang datang berurutan, dan berhenti mencatat ketika khatib duduk. (HR. Bukhari dan Muslim)'],
    ['Rumah yang ada anjing atau gambar makhluk bernyawa', 'Malaikat rahmat tidak memasukinya. (HR. Bukhari dan Muslim)']
  ];

  return { ERA, NABI, LAIN, MALAIKAT, MALAIKAT_LAIN, SIFAT, AMAL };
})();
