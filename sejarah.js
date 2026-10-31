/* Sejarah Islam di Indonesia: linimasa dari awal masuknya Islam hingga masa kini, per periode, dengan
 * pencarian, penanda sudah dibaca, ringkasan teori masuknya Islam, dan kuis otomatis. Semua offline. */
window.makeSejarahView = function (d) {
  const { $, esc, view, setTitle, store } = d;
  const PH = {
    masuk: ['🌊', 'Awal masuknya Islam (abad 7–13)'],
    sultan: ['🕌', 'Kesultanan & Walisongo (abad 13–16)'],
    jaya: ['👑', 'Kejayaan kesultanan & ulama (abad 17–18)'],
    lawan: ['🛡️', 'Perlawanan terhadap kolonial (abad 19)'],
    gerak: ['📣', 'Kebangkitan & organisasi (1900–1942)'],
    merdeka: ['🇮🇩', 'Penjajahan Jepang & kemerdekaan (1942–1949)'],
    lama: ['🗳️', 'Demokrasi liberal & Orde Lama (1950–1966)'],
    baru: ['🏗️', 'Orde Baru (1966–1998)'],
    reformasi: ['🌅', 'Reformasi hingga sekarang (1998–2026)']
  };
  /* id, periode, tahun, judul, isi */
  const E = [
    ['arab7', 'masuk', 'abad 7 M', 'Kontak awal pedagang Arab dengan Nusantara', "Jalur dagang laut Arab–India–Tiongkok sudah melewati Selat Malaka dan pantai barat Sumatera sejak sebelum Islam. Berita Tiongkok masa Dinasti Tang menyebut orang Ta-shih (Arab) di Nusantara, dan sebagian sejarawan menganggapnya tanda kontak paling awal. Bukti nisan dan pemukiman muslim yang pasti baru ditemukan dari masa yang lebih muda."],
    ['barus', 'masuk', 'abad 7–12 M', 'Barus (Fansur), pelabuhan kapur barus', "Barus di pantai barat Sumatera Utara dikenal dunia sejak lama karena kapur barus, dan disebut dalam catatan Arab sebagai Fansur. Pedagang muslim singgah dan menetap di sana; kompleks makam kuno seperti Papan Tinggi dan Mahligai sering dikaitkan dengan komunitas muslim awal, meski penanggalannya masih diperdebatkan."],
    ['perlak', 'masuk', 'abad 9–13 M', 'Perlak, kesultanan Islam yang tertua menurut tradisi', "Hikayat dan tradisi Aceh menyebut Perlak (Peureulak) sebagai kerajaan Islam tertua di Nusantara, dengan sultan pertama Sayyid Maulana Abdul Aziz Syah. Tahun berdirinya berbeda-beda dalam sumber tradisi; para sejarawan menilai kerajaan Islam yang terdokumentasi kuat baru ada pada abad ke-13."],
    ['leran', 'masuk', '1082 M (475 H)', 'Nisan Fatimah binti Maimun di Leran, Gresik', "Nisan berbahasa Arab dengan angka tahun 475 H atau 1082 M ditemukan di Leran, Gresik, Jawa Timur. Ini bukti tertulis tertua adanya muslim di Jawa, kemungkinan pedagang atau pendatang, bukan tanda Islam sudah dianut masyarakat luas."],
    ['polo', 'masuk', '1292 M', 'Marco Polo di Perlak', "Penjelajah Venesia Marco Polo singgah di Perlak (disebutnya Ferlec) dalam perjalanan pulang dari Tiongkok dan mencatat penduduk kota itu sudah memeluk Islam karena pengaruh pedagang muslim, sedangkan daerah pedalaman masih belum."],
    ['pasai', 'masuk', '±1267–1297 M', 'Berdirinya Samudera Pasai & wafatnya Sultan Malik as-Shalih', "Meurah Silu masuk Islam, bergelar Sultan Malik as-Shalih, dan mendirikan Kesultanan Samudera Pasai di pesisir utara Aceh. Nisannya bertarikh 696 H (1297 M) adalah salah satu nisan raja muslim tertua di Asia Tenggara. Pasai menjadi pelabuhan niaga dan pusat dakwah awal."],
    ['battuta', 'sultan', '1345 M', 'Ibnu Battuta singgah di Samudera Pasai', "Pengembara Maroko Ibnu Battuta bertemu Sultan Malik az-Zahir yang bermazhab Syafi'i, rajin berdiskusi dengan ulama, dan sering berjihad. Kesaksiannya menunjukkan Pasai sudah menjadi pusat keilmuan Islam, dan mazhab Syafi'i kemudian dominan di Nusantara."],
    ['troloyo', 'sultan', '1368–1369 M', 'Nisan Troloyo di pusat Majapahit', "Makam-makam muslim bertarikh 1290 Saka (1368 M) dan sesudahnya ditemukan di Troloyo dan Trowulan, dekat pusat Majapahit. Ini menunjukkan sudah ada penduduk muslim di lingkungan ibu kota kerajaan Hindu-Buddha itu, hidup berdampingan dengan penganut agama lain."],
    ['malik', 'sultan', '1419 M (822 H)', 'Wafatnya Maulana Malik Ibrahim di Gresik', "Maulana Malik Ibrahim, yang dikenal sebagai wali pertama dalam tradisi Walisongo, berdakwah di Gresik lewat perdagangan, pertanian, dan pengobatan, serta mendekati rakyat kecil dengan akhlak. Makamnya di Gresik bertarikh 822 H."],
    ['malaka', 'sultan', 'abad 15 M', 'Malaka menjadi pusat Islam di Asia Tenggara', "Setelah rajanya masuk Islam, Kesultanan Malaka berkembang menjadi bandar internasional dan pusat penyebaran Islam. Pedagang dan ulama dari sana menyebarkan agama ke Sumatera, Jawa, Kalimantan, dan Maluku."],
    ['ampel', 'sultan', 'abad 15 M', 'Sunan Ampel dan pesantren pertama di Jawa Timur', "Raden Rahmat (Sunan Ampel) mendirikan pusat dakwah dan pendidikan di Ampeldenta, Surabaya. Dari sini lahir para dai seperti Sunan Bonang dan Sunan Drajat, dan jaringan guru–murid inilah yang membentuk Walisongo."],
    ['walisongo', 'sultan', 'abad 15–16 M', 'Walisongo: sembilan wali penyebar Islam', "Sembilan tokoh yang dikenal sebagai Walisongo adalah Maulana Malik Ibrahim, Sunan Ampel, Sunan Giri, Sunan Bonang, Sunan Drajat, Sunan Kalijaga, Sunan Kudus, Sunan Muria, dan Sunan Gunung Jati. Mereka berdakwah dengan hikmah: lewat dagang, pendidikan, perkawinan, dan seni, serta menyesuaikan cara penyampaian dengan budaya setempat tanpa mengubah pokok akidah."],
    ['ternate', 'sultan', 'abad 15 M', 'Islam di Maluku: Ternate dan Tidore', "Melalui perdagangan cengkih, Islam masuk ke Maluku. Raja Ternate, termasuk Sultan Zainal Abidin (±1486–1500), menjadikan Islam sebagai dasar kerajaan dan mengundang ulama dari Jawa. Tidore, Bacan, dan Jailolo juga menjadi kesultanan Islam."],
    ['demak', 'sultan', '±1478–1479 M', 'Kesultanan Demak & Masjid Agung Demak', "Raden Patah mendirikan Demak, kesultanan Islam pertama di Jawa, yang disokong para wali. Masjid Agung Demak dibangun sebagai pusat ibadah dan musyawarah. Demak memegang peran penting menggantikan kekuasaan Majapahit di pesisir utara."],
    ['kalijaga', 'sultan', 'abad 15–16 M', 'Dakwah budaya: wayang, tembang, dan gamelan', "Sunan Kalijaga dan wali lain menjadikan wayang, tembang, dan gamelan sebagai media menyampaikan nilai tauhid dan akhlak kepada masyarakat Jawa. Cerita lama diisi dengan pesan Islam sehingga dakwah diterima tanpa paksaan."],
    ['malaka1511', 'sultan', '1511 M', 'Portugis merebut Malaka', "Portugis menaklukkan Malaka dan mengganggu jalur dagang muslim. Akibatnya pedagang dan ulama berpindah ke pelabuhan lain seperti Aceh, Banten, dan Makassar, sehingga kesultanan-kesultanan baru menguat."],
    ['aceh1511', 'sultan', '±1511–1530 M', 'Kesultanan Aceh Darussalam berdiri', "Sultan Ali Mughayat Syah menyatukan wilayah Aceh dan menaklukkan Pasai pada 1524. Aceh tumbuh menjadi benteng perlawanan terhadap Portugis dan pusat Islam di ujung barat Nusantara, dijuluki Serambi Mekkah."],
    ['banjar', 'sultan', '1526 M', 'Islam di Banjar dan Kalimantan', "Pangeran Samudera memeluk Islam dengan gelar Sultan Suriansyah setelah dibantu Demak, lalu mendirikan Kesultanan Banjar. Dari sini Islam berkembang di Kalimantan Selatan; kelak Syekh Muhammad Arsyad al-Banjari menjadi ulama terkemuka daerah ini."],
    ['banten', 'sultan', '1526–1527 M', 'Banten dan Jayakarta', "Sunan Gunung Jati dan putranya, Maulana Hasanuddin, mendirikan Kesultanan Banten. Pasukan Fatahillah merebut Sunda Kelapa pada 22 Juni 1527 dan menamainya Jayakarta, yang kelak menjadi Jakarta. Cirebon menjadi pusat dakwah di Jawa Barat."],
    ['pajang', 'sultan', '1568–1587 M', 'Pajang dan awal Mataram Islam', "Setelah Demak melemah, pusat kekuasaan Jawa berpindah ke Pajang di bawah Sultan Hadiwijaya, lalu ke Mataram yang dirintis Panembahan Senopati. Mataram kelak menjadi kerajaan Islam terbesar di pedalaman Jawa."],
    ['voc', 'jaya', '1602–1619 M', 'VOC masuk dan Batavia berdiri', "VOC berdiri pada 1602 dan merebut Jayakarta pada 1619, menjadikannya Batavia. Persaingan dagang dengan Banten, Mataram, dan Makassar berubah menjadi penaklukan politik secara bertahap."],
    ['gowa', 'jaya', '1605 M', 'Gowa-Tallo memeluk Islam', "Raja Tallo, Karaeng Matoaya, dan Raja Gowa, Sultan Alauddin, memeluk Islam pada 1605 setelah dakwah Dato Tiga (Dato ri Bandang, Dato Patimang, dan Dato ri Tiro) dari Minangkabau. Islam lalu menyebar ke seluruh Sulawesi Selatan; Bone memeluk Islam pada 1611."],
    ['iskandar', 'jaya', '1607–1636 M', 'Puncak kejayaan Aceh di bawah Sultan Iskandar Muda', "Aceh menguasai Selat Malaka dan menjadi pusat ilmu: Hamzah Fansuri dan Syamsuddin as-Sumatrani menulis karya tasawuf, dan Masjid Raya Baiturrahman menjadi pusat ibadah. Sultan juga menegakkan hukum dan memajukan perdagangan."],
    ['agung', 'jaya', '1613–1645 M', 'Sultan Agung dari Mataram', "Sultan Agung memperluas Mataram hingga hampir seluruh Jawa dan dua kali menyerang Batavia (1628 dan 1629). Ia mendekatkan budaya Jawa dengan Islam, menghormati ulama, dan memperkenalkan kalender Jawa-Islam."],
    ['kalender', 'jaya', '1633 M (1043 H)', 'Kalender Jawa-Islam', "Sultan Agung menyelaraskan kalender Saka yang berbasis matahari dengan tahun Hijriah yang berbasis bulan. Tahun Jawa tetap melanjutkan hitungan Saka, tetapi bulan dan harinya mengikuti kalender Islam, sehingga 1 Muharram sama dengan 1 Sura."],
    ['raniri', 'jaya', '1637–1644 M', 'Nuruddin ar-Raniri di Aceh', "Ulama keturunan Gujarat ini menjadi mufti di Aceh dan menulis Bustanus Salatin (1638). Ia juga menulis kitab fikih ibadah dan kritik terhadap ajaran yang dinilainya menyimpang, sehingga perdebatan tasawuf di Aceh menjadi ramai."],
    ['bima', 'jaya', '1640 M', 'Kesultanan Bima', "Abdul Kahir dinobatkan sebagai sultan pertama Bima di Nusa Tenggara Barat setelah kerajaan memeluk Islam, dengan dukungan dari Makassar dan Gowa. Islam sejak itu mengakar di Sumbawa dan Lombok."],
    ['yusuf', 'jaya', '1626–1699 M', 'Syekh Yusuf al-Makassari', "Ulama dan pejuang dari Gowa ini menuntut ilmu hingga Mekah dan Yaman, lalu membantu Sultan Ageng Tirtayasa melawan VOC. Ia dibuang ke Sri Lanka (1684) dan Afrika Selatan (1693), tempat ia wafat pada 1699 dan dihormati sebagai pembawa Islam di sana."],
    ['singkili', 'jaya', '±1675 M', 'Tarjuman al-Mustafid karya Abdurrauf as-Singkili', "Syekh Abdurrauf as-Singkili menulis Tarjuman al-Mustafid, tafsir lengkap pertama dalam bahasa Melayu. Ia juga menyebarkan tarekat Syattariyah dan menjadi guru banyak ulama Nusantara, termasuk Burhanuddin Ulakan."],
    ['ulakan', 'jaya', '1646–1704 M', 'Surau Ulakan dan Islam di Minangkabau', "Syekh Burhanuddin Ulakan belajar kepada Abdurrauf di Aceh lalu mendirikan surau di Ulakan, Sumatera Barat. Surau menjadi pusat pendidikan Islam, dan jaringan surau ini membentuk pola ulama Minang selama berabad-abad."],
    ['giyanti', 'jaya', '1755 M', 'Perjanjian Giyanti', "VOC membagi Mataram menjadi Surakarta dan Yogyakarta. Pada masa ini pesantren-pesantren di pedesaan Jawa, seperti Tegalsari di Ponorogo, berkembang menjadi pusat ilmu yang jauh dari pengaruh istana dan kolonial."],
    ['arsyad', 'jaya', '1710–1812 M', 'Syekh Muhammad Arsyad al-Banjari', "Ulama Banjar ini belajar di Mekah dan Madinah selama puluhan tahun, lalu pulang dan menulis kitab fikih Sabilal Muhtadin. Ia mendidik masyarakat, memperbaiki pertanian, dan membangun pusat dakwah di Dalam Pagar."],
    ['padri', 'lawan', '1803–1838 M', 'Perang Padri', "Haji Miskin, Haji Sumanik, dan Haji Piobang pulang dari Mekah dan mengajak membersihkan adat dari praktik yang bertentangan dengan syariat. Pertentangan dengan kaum adat berubah menjadi perang ketika Belanda ikut campur. Tuanku Imam Bonjol memimpin perlawanan sampai Bonjol jatuh pada 1837 dan ia diasingkan; perang berakhir 1838."],
    ['diponegoro', 'lawan', '1825–1830 M', 'Perang Jawa (Diponegoro)', "Pangeran Diponegoro dengan dukungan ulama dan santri melawan Belanda selama lima tahun. Ia ditangkap lewat tipu daya perundingan di Magelang pada 28 Maret 1830, dan perang ini menguras kas Belanda sangat besar."],
    ['antasari', 'lawan', '1859–1905 M', 'Perang Banjar', "Pangeran Antasari memimpin perlawanan rakyat Banjar dan mendapat gelar Panembahan Amiruddin Khalifatul Mukminin. Perlawanan berlanjut jauh setelah ia wafat pada 1862."],
    ['suez', 'lawan', '1869 M', 'Terusan Suez dan lonjakan jemaah haji', "Pelayaran kapal uap dan pembukaan Terusan Suez mempersingkat perjalanan ke Mekah. Jumlah jemaah haji dari Hindia Belanda melonjak, dan mereka pulang membawa ilmu dan semangat pembaruan. Pemerintah kolonial kemudian mengawasi haji dengan ketat."],
    ['aceh1873', 'lawan', '1873–1904 M', 'Perang Aceh', "Belanda menyerang Aceh pada 1873. Para ulama dan pejuang seperti Teungku Chik di Tiro, Teuku Umar, dan Cut Nyak Dhien memimpin perang gerilya dengan semangat jihad. Strategi Snouck Hurgronje memecah ulama dan uleebalang; perlawanan baru mereda sekitar 1904."],
    ['nawawi', 'lawan', '1813–1897 M', 'Syekh Nawawi al-Bantani dan ulama Nusantara di Mekah', "Syekh Nawawi dari Banten mengajar di Masjidil Haram dan menulis puluhan kitab, termasuk tafsir Marah Labid. Dari lingkaran ulama Jawi di Mekah, termasuk Syekh Ahmad Khatib al-Minangkabawi dan Syekh Mahfudz at-Termasi, lahir guru bagi pendiri banyak organisasi Islam."],
    ['cilegon', 'lawan', '1888 M', 'Geger Cilegon', "Pemberontakan petani yang dipimpin ulama, antara lain Haji Wasid, terjadi di Cilegon, Banten, menentang pajak berat dan tekanan Belanda terhadap pelaksanaan agama. Pemberontakan dipadamkan dalam beberapa hari."],
    ['snouck', 'lawan', '1889–1936 M', 'Politik Islam pemerintah kolonial', "Christiaan Snouck Hurgronje menjadi penasihat urusan pribumi dan Islam. Ia membedakan Islam ibadah, yang dibiarkan, dari Islam politik, yang diawasi dan ditekan. Pemerintah kolonial lalu membentuk lembaga seperti priesterraad (pengadilan agama) sambil membatasi ruang gerak ulama."],
    ['tebuireng', 'gerak', '1899 M', 'Pesantren Tebuireng', "KH Hasyim Asy'ari mendirikan Pesantren Tebuireng di Jombang. Pesantren ini menjadi pusat pendidikan ulama yang kelak melahirkan tokoh-tokoh NU dan kemerdekaan."],
    ['jamiat', 'gerak', '1901–1905 M', 'Jamiat Kheir', "Komunitas Arab di Batavia mendirikan Jamiat Kheir, organisasi pendidikan modern berbasis Islam pertama, yang membuka sekolah dengan kurikulum agama dan umum serta mengundang guru dari luar negeri."],
    ['sdi', 'gerak', '1905–1912 M', 'Sarekat Dagang Islam menjadi Sarekat Islam', "Haji Samanhudi mendirikan Sarekat Dagang Islam di Solo untuk melindungi pedagang batik pribumi dari persaingan. Pada 1912 organisasi ini menjadi Sarekat Islam yang dipimpin H.O.S. Tjokroaminoto dan berkembang menjadi gerakan massa pertama di Hindia Belanda."],
    ['muhammadiyah', 'gerak', '18 Nov 1912', 'Berdirinya Muhammadiyah', "KH Ahmad Dahlan mendirikan Muhammadiyah di Yogyakarta untuk memurnikan akidah dan memajukan umat lewat sekolah, panti asuhan, dan rumah sakit. Aisyiyah, organisasi perempuannya, berdiri pada 1917."],
    ['irsyad', 'gerak', '1914 M', 'Al-Irsyad Al-Islamiyyah', "Syekh Ahmad Surkati, ulama asal Sudan, mendirikan Al-Irsyad di Batavia yang menekankan kesetaraan semua muslim dan pendidikan modern."],
    ['sp', 'gerak', '1919–1923 M', 'Sumatera Thawalib & Diniyah Putri', "Madrasah modern bermunculan di Sumatera Barat. Rahmah el-Yunusiyyah mendirikan Diniyah Putri di Padang Panjang pada 1923, perguruan Islam khusus perempuan pertama yang kemudian dikenal sampai Mesir."],
    ['persis', 'gerak', '1923 M', 'Persatuan Islam (Persis)', "Persis berdiri di Bandung dan dikenal lewat tokoh A. Hassan yang rajin berdebat dan menulis, serta kembali pada Al-Qur'an dan Sunnah dengan metode ilmiah."],
    ['nu', 'gerak', '31 Jan 1926', 'Berdirinya Nahdlatul Ulama', "KH Hasyim Asy'ari, KH Abdul Wahab Chasbullah, dan para kiai mendirikan NU di Surabaya, antara lain untuk mempertahankan mazhab dan tradisi pesantren serta mengirim Komite Hijaz memperjuangkan kebebasan bermazhab di Mekah."],
    ['gontor', 'gerak', '1926 M', 'Pondok Modern Darussalam Gontor', "Tiga bersaudara Zainuddin Fanani, Ahmad Sahal, dan Imam Zarkasyi menghidupkan kembali pesantren Gontor di Ponorogo dengan sistem modern: bahasa Arab dan Inggris, organisasi santri, dan kemandirian."],
    ['miai', 'gerak', '1937 M', 'Majelis Islam A\'la Indonesia (MIAI)', "Organisasi-organisasi Islam seperti NU, Muhammadiyah, dan SI membentuk federasi MIAI di Surabaya untuk menyatukan sikap umat dan menjadi forum bersama menghadapi urusan umat."],
    ['masyumi43', 'merdeka', '1942–1943 M', 'Masa Jepang dan Masyumi', "Jepang menutup MIAI lalu membentuk Majelis Syura Muslimin Indonesia (Masyumi) pada 1943 untuk menggerakkan umat. Kiai dan ulama mendapat ruang lebih luas dibanding masa Belanda, dan pada akhir 1944 dibentuk laskar Hizbullah yang melatih pemuda muslim."],
    ['piagam', 'merdeka', '22 Jun 1945', 'Piagam Jakarta', "Panitia Sembilan menyepakati rancangan pembukaan UUD yang memuat kalimat tentang kewajiban menjalankan syariat Islam bagi pemeluknya. Pada 18 Agustus 1945 kalimat itu diganti menjadi Ketuhanan Yang Maha Esa demi persatuan, dan para tokoh Islam menerimanya."],
    ['uii', 'merdeka', '8 Jul 1945', 'Sekolah Tinggi Islam (kini UII)', "Sekolah Tinggi Islam didirikan di Jakarta dengan Mohammad Hatta sebagai ketua pengurus, lalu pindah ke Yogyakarta. Ini cikal bakal Universitas Islam Indonesia."],
    ['proklamasi', 'merdeka', '17 Agu 1945', 'Proklamasi Kemerdekaan', "Kemerdekaan diproklamasikan pada Jumat, 9 Ramadhan 1364 H. Para ulama dan santri ikut menyiapkan perjuangan mempertahankannya."],
    ['jihad', 'merdeka', '22 Okt 1945', 'Resolusi Jihad', "KH Hasyim Asy'ari menyerukan bahwa membela tanah air dari penjajah adalah fardhu 'ain bagi yang berada dalam jarak tertentu dari musuh. Seruan ini menggerakkan santri dan rakyat dalam Pertempuran 10 November 1945 di Surabaya. Tanggal 22 Oktober kini diperingati sebagai Hari Santri."],
    ['masyumi45', 'merdeka', '7 Nov 1945', 'Masyumi menjadi partai politik', "Kongres Umat Islam di Yogyakarta mengubah Masyumi menjadi partai politik tempat berhimpun hampir semua organisasi Islam, dengan Muhammad Natsir sebagai tokoh utamanya."],
    ['kemenag', 'merdeka', '3 Jan 1946', 'Kementerian Agama berdiri', "Pemerintah membentuk Kementerian Agama dengan H.M. Rasjidi sebagai menteri pertama. Kementerian ini mengurus pencatatan nikah, peradilan agama, pendidikan agama, dan kelak haji."],
    ['di', 'merdeka', '1949–1962 M', 'Darul Islam / DI-TII', "Pada 7 Agustus 1949 S.M. Kartosoewirjo memproklamasikan Negara Islam Indonesia di Jawa Barat; gerakan serupa muncul di Aceh (Daud Beureueh, 1953) dan Sulawesi Selatan (Kahar Muzakkar). Pemerintah menumpasnya secara militer dan ada pula penyelesaian lewat perundingan, seperti di Aceh pada 1959 dengan status daerah istimewa."],
    ['ptain', 'lama', '1951–1960 M', 'Pendidikan tinggi Islam negeri', "Pemerintah mendirikan Perguruan Tinggi Agama Islam Negeri (PTAIN) di Yogyakarta pada 1951 dan Akademi Dinas Ilmu Agama di Jakarta. Pada 1960 keduanya digabung menjadi IAIN Al-Jami'ah Al-Islamiyah, yang kemudian berkembang ke banyak daerah."],
    ['nu52', 'lama', '1952 M', 'NU keluar dari Masyumi', "Perbedaan pandangan dalam pembagian kursi dan peran ulama membuat NU keluar dari Masyumi dan berdiri sebagai partai sendiri."],
    ['pemilu55', 'lama', '1955 M', 'Pemilu pertama', "Pemilu 1955 menghasilkan empat partai besar: PNI, Masyumi, NU, dan PKI. Masyumi memperoleh sekitar 20,9% suara dan NU sekitar 18,4%. Di tahun yang sama Konferensi Asia–Afrika di Bandung mempertemukan negara-negara muslim dan Asia–Afrika."],
    ['masyumi60', 'lama', '1960 M', 'Masyumi dibubarkan', "Setelah Dekrit Presiden 1959 dan sistem Demokrasi Terpimpin, Masyumi diminta membubarkan diri pada 1960. Sejumlah tokohnya, termasuk Natsir dan Hamka, kemudian ditahan."],
    ['alquran65', 'lama', '1965 M', 'Al-Qur\'an dan Terjemahnya', "Departemen Agama menerbitkan terjemahan Al-Qur'an dalam bahasa Indonesia yang kemudian menjadi rujukan resmi dan terus disempurnakan."],
    ['mtq68', 'baru', '1968 M', 'MTQ Nasional pertama', "Musabaqah Tilawatil Qur'an tingkat nasional pertama digelar di Ujung Pandang (Makassar), dan sejak itu menjadi ajang tahunan yang melahirkan banyak qari dan qariah."],
    ['fusi', 'baru', '1973 M', 'Fusi partai: lahirnya PPP', "Pemerintah menyederhanakan partai. Partai-partai Islam (NU, Parmusi, PSII, dan Perti) berfusi menjadi Partai Persatuan Pembangunan."],
    ['uup', 'baru', '1974 M', 'UU Perkawinan', "UU No. 1 Tahun 1974 mengatur perkawinan secara nasional dengan mengakui sahnya perkawinan menurut hukum agama. Peradilan agama diperkuat oleh UU Peradilan Agama pada 1989 dan Kompilasi Hukum Islam pada 1991."],
    ['mui', 'baru', '26 Jul 1975', 'Majelis Ulama Indonesia', "MUI berdiri dengan Hamka sebagai ketua umum pertama untuk menjadi wadah musyawarah ulama dan pemberi fatwa serta penghubung antara umat dan pemerintah."],
    ['istiqlal', 'baru', '22 Feb 1978', 'Masjid Istiqlal diresmikan', "Masjid terbesar di Asia Tenggara ini dirancang Friedrich Silaban, arsitek beragama Kristen, dan menjadi simbol kemerdekaan dan kebersamaan bangsa."],
    ['hamka', 'baru', '1960-an–1981', 'Hamka dan Tafsir Al-Azhar', "Buya Hamka menyelesaikan sebagian besar Tafsir Al-Azhar saat ditahan pada 1964–1966. Tafsir berbahasa Indonesia ini membawa gaya sastra dan perhatian pada persoalan sosial. Hamka wafat pada 1981."],
    ['asastunggal', 'baru', '1984–1985 M', 'Asas tunggal Pancasila dan khittah NU', "Semua organisasi diwajibkan berasas tunggal Pancasila pada 1985. NU menerimanya dan pada Muktamar Situbondo 1984 kembali ke khittah 1926 serta memilih KH Abdurrahman Wahid sebagai ketua umum."],
    ['icmi', 'baru', '7 Des 1990', 'ICMI berdiri', "Ikatan Cendekiawan Muslim se-Indonesia berdiri di Malang dengan B.J. Habibie sebagai ketua, yang menandai bangkitnya kelas menengah muslim terdidik."],
    ['jilbab', 'baru', '1991 M', 'Jilbab diizinkan di sekolah negeri', "Setelah perdebatan panjang sejak 1980-an, Departemen Pendidikan menerbitkan aturan seragam pada 1991 yang memperbolehkan siswi berjilbab di sekolah negeri."],
    ['bmi', 'baru', '1991–1992 M', 'Bank Muamalat, bank syariah pertama', "Bank Muamalat Indonesia berdiri pada 1991 atas prakarsa MUI, ICMI, dan pengusaha muslim, lalu beroperasi pada 1992. Ini awal perbankan syariah di Indonesia."],
    ['reformasi', 'reformasi', 'Mei 1998', 'Reformasi dan lahirnya partai-partai Islam', "Setelah jatuhnya Orde Baru, kebebasan berorganisasi terbuka. Partai-partai berbasis massa Islam bermunculan: PKB (1998), PAN, PPP, PBB, dan PK yang kelak menjadi PKS."],
    ['gusdur', 'reformasi', 'Okt 1999', 'KH Abdurrahman Wahid menjadi Presiden', "Gus Dur, mantan ketua umum NU, terpilih sebagai presiden keempat dan dikenal membela pluralisme dan hak minoritas. Pada tahun yang sama keluar UU Penyelenggaraan Ibadah Haji dan UU Pengelolaan Zakat."],
    ['aceh', 'reformasi', '1999–2006 M', 'Penerapan syariat di Aceh', "UU Keistimewaan Aceh (1999) dan UU Otonomi Khusus (2001) membuka jalan bagi pelaksanaan syariat Islam di Aceh. Setelah tsunami 26 Desember 2004 dan Perjanjian Helsinki (15 Agustus 2005), UU Pemerintahan Aceh 2006 menetapkan kewenangan itu secara luas."],
    ['bali', 'reformasi', '2002 M', 'Bom Bali dan perang melawan terorisme', "Serangan bom di Bali pada 12 Oktober 2002 menewaskan ratusan orang dan mendorong pemerintah memperkuat penanggulangan terorisme. Ormas besar seperti NU dan Muhammadiyah mengutuknya dan menegaskan bahwa terorisme bukan ajaran Islam."],
    ['syariah08', 'reformasi', '2008 M', 'Perbankan syariah dan sukuk negara', "UU Perbankan Syariah dan UU Surat Berharga Syariah Negara disahkan pada 2008. Pemerintah mulai menerbitkan sukuk, dan keuangan syariah menjadi bagian resmi sistem keuangan nasional."],
    ['zakat11', 'reformasi', '2011 M', 'UU Pengelolaan Zakat', "UU No. 23 Tahun 2011 memperkuat Badan Amil Zakat Nasional (BAZNAS) dan mengatur lembaga amil zakat sehingga zakat, infak, dan sedekah dikelola lebih tertib."],
    ['halal14', 'reformasi', '2014–2019 M', 'UU Jaminan Produk Halal & BPJPH', "UU No. 33 Tahun 2014 mewajibkan produk yang beredar bersertifikat halal. Badan Penyelenggara Jaminan Produk Halal dibentuk pada 2017 dan kewajiban tahap pertama berlaku sejak 17 Oktober 2019."],
    ['santri15', 'reformasi', '2015 M', 'Hari Santri dan Islam Nusantara', "Presiden menetapkan 22 Oktober sebagai Hari Santri. Pada tahun yang sama Muktamar NU di Jombang mengusung tema Islam Nusantara, yaitu cara beragama yang berakar pada tradisi keilmuan pesantren dan budaya setempat, yang juga memicu diskusi di kalangan umat."],
    ['aksi16', 'reformasi', '2016–2017 M', 'Aksi Bela Islam dan pembubaran HTI', "Aksi massa besar pada 4 November dan 2 Desember 2016 menjadi peristiwa politik-keagamaan yang menonjol. Pada Juli 2017 pemerintah mencabut badan hukum Hizbut Tahrir Indonesia (HTI). Peristiwa-peristiwa ini dinilai berbeda-beda oleh berbagai kalangan."],
    ['pesantren19', 'reformasi', '2019 M', 'UU Pesantren', "UU No. 18 Tahun 2019 mengakui pesantren sebagai lembaga pendidikan, dakwah, dan pemberdayaan masyarakat, dan membuka ruang pendanaan serta pengakuan lulusannya."],
    ['haji20', 'reformasi', '2020–2021 M', 'Pandemi COVID-19', "Ramadhan 2020 dijalani dengan sholat di rumah mengikuti fatwa MUI. Pemerintah membatalkan pemberangkatan haji Indonesia pada 2020 dan 2021, pertama kalinya dalam sejarah modern."],
    ['bsi', 'reformasi', '1 Feb 2021', 'Bank Syariah Indonesia', "Tiga bank syariah milik negara dilebur menjadi Bank Syariah Indonesia (BSI), bank syariah terbesar di Indonesia."],
    ['r20', 'reformasi', '2022 M', 'Muktamar dan forum agama G20', "NU memilih KH Yahya Cholil Staquf sebagai ketua umum pada Desember 2021, dan Muhammadiyah mengadakan Muktamar di Solo pada November 2022 dengan Haedar Nashir sebagai ketua umum. Pada KTT G20 di Bali, Forum Religion of Twenty (R20) mempertemukan tokoh agama dunia."],
    ['paus', 'reformasi', '3–6 Sep 2024', 'Kunjungan Paus Fransiskus ke Masjid Istiqlal', "Paus Fransiskus mengunjungi Indonesia dan Masjid Istiqlal, dan bersama Imam Besar menandatangani Deklarasi Istiqlal tentang kerukunan antaragama dan kepedulian pada lingkungan. Terowongan Silaturahmi menghubungkan Istiqlal dengan Katedral Jakarta."],
    ['halal24', 'reformasi', '17 Okt 2024', 'Wajib halal untuk makanan dan minuman', "Kewajiban sertifikat halal untuk produk makanan, minuman, serta hasil dan jasa penyembelihan berlaku sejak 17 Oktober 2024. Kewajiban untuk kelompok produk lain bertahap, dan tahap berikutnya dijadwalkan mulai Oktober 2026."],
    ['haji25', 'reformasi', '2025 M', 'Kementerian Haji dan Umrah', "Penyelenggaraan haji dan umrah dipisahkan dari Kementerian Agama setelah revisi UU Haji dan Umrah pada 2025, dan dibentuk Kementerian Haji dan Umrah. Kuota haji Indonesia, terbesar di dunia, pada 2025 sebanyak 221 ribu jemaah."],
    ['kini', 'reformasi', '2026 M', 'Islam di Indonesia hari ini', "Indonesia memiliki penduduk muslim terbesar di dunia, sekitar 87% dari lebih dari 270 juta jiwa, dengan puluhan ribu pesantren, ribuan madrasah, ormas besar seperti NU dan Muhammadiyah, serta ekonomi syariah, wakaf, dan industri halal yang terus tumbuh. Tantangan kini antara lain literasi digital, kerukunan, dan pembinaan generasi muda."]
  ];
  const TEORI = [
    ['Teori Arab', "Islam datang langsung dari Arab (Hijaz/Mesir) sejak abad ke-7 M. Pendukung: Hamka, T.W. Arnold, dan Syed Naquib al-Attas. Alasan: berita Tiongkok tentang Ta-shih, kesamaan mazhab Syafi'i, dan gelar raja seperti al-Malik. Seminar sejarah masuknya Islam di Medan (1963) condong ke teori ini."],
    ['Teori Gujarat (India)', "Islam dibawa pedagang dari Gujarat pada abad ke-13. Pendukung: Pijnappel dan Snouck Hurgronje; Moquette membandingkan nisan Pasai dengan nisan Cambay. Kritik: mazhab di Gujarat dulu Hanafi, bukan Syafi'i seperti di Nusantara."],
    ['Teori Persia', "Islam datang lewat pedagang Persia, dilihat dari kesamaan tradisi (Asyura/tabut, ejaan huruf Arab, istilah). Pendukung utama: Hoesein Djajadiningrat. Kritik: kesamaan itu bisa muncul dari kontak kemudian."],
    ['Teori Benggala', "Pendukung: S.Q. Fatimi, berdasarkan kemiripan nisan Pasai dengan nisan Bengal. Kritik: mazhab di Benggala juga bukan Syafi'i."],
    ['Teori Tiongkok', "Muslim Tionghoa ikut berperan dalam awal Islam di Jawa, antara lain lewat tokoh dan masjid-masjid tua. Pendukung: Slamet Muljana. Sebagian sejarawan menilainya tidak cukup bukti kuat sebagai sumber utama."],
    ['Kesimpulan yang umum', "Para sejarawan sekarang umumnya melihat Islamisasi sebagai proses panjang dan bertahap yang melibatkan banyak pedagang dari Arab, Persia, India, dan Tiongkok, serta dai lokal, perkawinan, tasawuf, pendidikan, dan kekuasaan kesultanan. Karena itu tidak ada satu asal tunggal."]
  ];
  const read = () => new Set(store.get('sejarahRead', []));
  const hd = cur => `<section class="hd-hero"><p class="hd-bis" lang="ar" dir="rtl">إِذَا جَاءَ نَصْرُ اللَّهِ وَالْفَتْحُ</p><h1>Sejarah Islam di Indonesia</h1><p>Dari kedatangan para pedagang hingga masa kini, ${E.length} peristiwa dalam ${Object.keys(PH).length} periode.</p></section><nav class="hd-tabs">${[['linimasa', 'Linimasa'], ['teori', 'Teori masuknya Islam'], ['kuis', 'Kuis']].map(([k, l]) => `<a class="chip ${cur === k ? 'active' : ''}" href="#/sejarah/${k}">${l}</a>`).join('')}</nav>`;
  const card = (x, done) => `<article class="sr-ev ${done ? 'done' : ''}" data-id="${x[0]}"><span class="sr-yr">${esc(x[2])}</span><br><b>${esc(x[3])}</b><p>${esc(x[4])}</p><div class="hd-acts"><button class="btn sm" data-act="r">${done ? '✓ Sudah dibaca' : 'Tandai dibaca'}</button></div></article>`;

  function linimasa(q) {
    const r = read(), kw = (q.get('q') || '').toLowerCase().trim(), ph = q.get('f') || '';
    const list = E.filter(x => (!ph || x[1] === ph) && (!kw || (x[3] + x[4] + x[2]).toLowerCase().includes(kw)));
    const pct = Math.round(E.filter(x => r.has(x[0])).length / E.length * 100);
    view.innerHTML = hd('linimasa') + `<div class="card"><b>${pct}% selesai dibaca</b><div class="sr-bar"><i style="width:${pct}%"></i></div></div>
      <form class="hd-search" id="sjf"><input id="sjq" type="search" placeholder="Cari (Pasai, Walisongo, 1912, NU…)" value="${esc(kw)}"><button class="btn">Cari</button></form>
      <nav class="hd-tabs">${[['', 'Semua'], ...Object.entries(PH).map(([k, v]) => [k, v[1]])].map(([k, t]) => `<a class="chip ${ph === k ? 'active' : ''}" href="#/sejarah/linimasa?f=${k}${kw ? '&q=' + encodeURIComponent(kw) : ''}">${t}</a>`).join('')}</nav>` +
      (Object.keys(PH).map(k => { const xs = list.filter(x => x[1] === k); return xs.length ? `<p class="mini-title hd-sec sr-ph">${PH[k][0]} ${PH[k][1]}</p>${xs.map(x => card(x, r.has(x[0]))).join('')}` : ''; }).join('') || '<p class="muted">Tidak ada peristiwa yang cocok.</p>') +
      '<p class="muted small hd-note">Tahun sebagian peristiwa awal (sebelum abad ke-15) bersumber dari tradisi, nisan, dan catatan asing, dan para sejarawan berbeda pendapat tentang penanggalannya. Untuk kajian mendalam, rujuklah karya sejarawan seperti Azyumardi Azra, M.C. Ricklefs, dan Uka Tjandrasasmita.</p>';
    $('#sjf').onsubmit = e => { e.preventDefault(); location.hash = `#/sejarah/linimasa?f=${ph}&q=${encodeURIComponent($('#sjq').value)}`; };
    view.onclick = e => {
      const b = e.target.closest('[data-act="r"]'); if (!b) return;
      const id = b.closest('.sr-ev').dataset.id, s = read(); s.has(id) ? s.delete(id) : s.add(id);
      store.set('sejarahRead', [...s]); const y = scrollY; linimasa(q); scrollTo(0, y);
    };
  }

  function teori() {
    view.innerHTML = hd('teori') + `<p class="muted small hd-note">Kapan dan dari mana Islam masuk ke Nusantara masih diperdebatkan. Berikut ringkasan teori yang paling sering dibahas.</p>` +
      TEORI.map(t => `<article class="sr-ev"><b>${esc(t[0])}</b><p>${esc(t[1])}</p></article>`).join('');
    view.onclick = null;
  }

  /* kuis otomatis dari data: pilih tahun yang tepat */
  let Q = null, n = 0, score = 0;
  const shuf = a => a.map(v => [Math.random(), v]).sort((p, c) => p[0] - c[0]).map(p => p[1]);
  function kuis() {
    if (!Q) { Q = shuf(E).slice(0, 8); n = 0; score = 0; }
    if (n >= Q.length) {
      view.innerHTML = hd('kuis') + `<div class="card"><h2>Skor: ${score}/${Q.length}</h2><p class="muted">${score >= 7 ? 'Masya Allah, pemahaman sejarahmu kuat!' : 'Baca lagi linimasa lalu coba kembali.'}</p><button class="btn" id="again">Ulangi</button></div>`;
      $('#again').onclick = () => { Q = null; kuis(); }; return;
    }
    const x = Q[n], ops = shuf([x, ...shuf(E.filter(y => y[2] !== x[2])).filter((y, i, a) => a.findIndex(z => z[2] === y[2]) === i).slice(0, 3)]);
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
    setTitle('Sejarah Islam Indonesia', true);
    view.onclick = null; delete view.dataset.lock;
    return tab === 'kuis' ? kuis() : tab === 'teori' ? teori() : linimasa(q);
  };
};
