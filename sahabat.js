/* Sahabat Nabi ﷺ: linimasa kronologis peristiwa para sahabat, profil dengan rentang hidup,
 * penanda sudah dibaca, tautan ke surah & hadis (offline), dan kuis otomatis. */
window.makeSahabatView = function (d) {
  const { $, esc, view, setTitle, store } = d;
  const ERA = { mekah: ['🌱', 'Masa Mekah (sebelum 622 M)'], madinah: ['🕌', 'Masa Madinah (622-632 M)'], khulafa: ['👑', 'Khulafaur Rasyidin (632-661 M)'], akhir: ['🌙', 'Masa akhir para sahabat (setelah 661 M)'] };
  const eraOf = y => y < 622 ? 'mekah' : y < 632 ? 'madinah' : y < 661 ? 'khulafa' : 'akhir';
  const KAT = { khulafa: 'Khulafaur Rasyidin', asyarah: '10 sahabat dijamin surga', awal: 'Pembela Islam di Mekah', anshar: 'Anshar', panglima: 'Panglima & syuhada', ulama: 'Ulama & periwayat', sahabiyah: 'Sahabiyah' };
  /* id, kategori, nama, julukan, lahir (M), wafat (M), label lahir, label wafat, ringkasan, surah terkait, kata kunci hadis */
  const S = [
    ['abubakar', 'khulafa', 'Abu Bakar Ash-Shiddiq', 'Ash-Shiddiq, Ash-Shahib (sahabat setia)', 573, 634, '±573 M', '13 H / 634 M', 'Sahabat terdekat dan mertua Nabi ﷺ, laki-laki dewasa pertama yang beriman. Menemani beliau dalam hijrah dan menjadi khalifah pertama. Menumpas kaum murtad dan nabi palsu, serta memerintahkan pengumpulan Al-Qur\'an.', 9, 'abu bakar'],
    ['umar', 'khulafa', 'Umar bin Khattab', 'Al-Faruq (pembeda yang hak dan batil)', 583, 644, '±583 M', '23 H / 644 M', 'Islamnya menguatkan kaum muslimin hingga bisa sholat terang-terangan di Ka\'bah. Khalifah kedua yang menaklukkan Syam, Mesir, dan Persia, membentuk diwan dan penanggalan Hijriah. Wafat ditikam saat mengimami sholat Subuh.', 0, 'umar'],
    ['utsman', 'khulafa', 'Utsman bin Affan', 'Dzun Nurain (pemilik dua cahaya)', 576, 656, '±576 M', '35 H / 656 M', 'Menikahi dua putri Nabi ﷺ secara berurutan, Ruqayyah dan Ummu Kultsum. Sangat dermawan: membeli sumur Raumah dan membiayai pasukan Tabuk. Khalifah ketiga yang menyatukan umat pada satu mushaf. Dibunuh pemberontak saat membaca Al-Qur\'an.', 0, 'utsman'],
    ['ali', 'khulafa', 'Ali bin Abi Thalib', 'Abul Hasan, Haidar (singa)', 600, 661, '±600 M', '40 H / 661 M', 'Sepupu dan menantu Nabi ﷺ, anak pertama yang beriman. Tidur di ranjang beliau pada malam hijrah, pembawa panji di Khaibar, dikenal dengan ilmu dan keberaniannya. Khalifah keempat; wafat dibunuh Ibnu Muljam.', 0, 'ali'],
    ['thalhah', 'asyarah', 'Thalhah bin Ubaidillah', 'Thalhah Al-Khair (Al-Fayyadh)', 594, 656, '±594 M', '36 H / 656 M', 'Melindungi Nabi ﷺ dengan tubuhnya di Uhud hingga tangannya lumpuh. Sangat dermawan, salah satu dari enam anggota syura pemilihan khalifah. Gugur dalam Perang Jamal.', 3, 'thalhah'],
    ['zubair', 'asyarah', 'Az-Zubair bin Awwam', 'Hawari Rasulullah (pembela setia)', 594, 656, '±594 M', '36 H / 656 M', 'Putra bibi Nabi ﷺ, salah satu yang paling awal masuk Islam dan ikut hampir semua peperangan. Mendapat gelar Hawari. Gugur dibunuh setelah Perang Jamal.', 0, 'zubair'],
    ['abdurrahman', 'asyarah', 'Abdurrahman bin Auf', 'Saudagar dermawan', 580, 652, '±580 M', '32 H / 652 M', 'Berhijrah dengan tangan kosong, lalu menjadi saudagar kaya yang menyedekahkan hartanya untuk jihad dan fakir miskin. Ikut dua hijrah dan menjadi penengah pemilihan Utsman.', 0, 'abdurrahman bin auf'],
    ['saad', 'asyarah', 'Sa\'d bin Abi Waqqash', 'Pemanah pertama di jalan Allah', 595, 675, '±595 M', '±55 H / 675 M', 'Masuk Islam di usia belasan dan doanya mustajab. Memimpin kemenangan di Qadisiyah melawan Persia dan mendirikan kota Kufah. Tentang baktinya kepada ibu, turun ayat Luqman 15.', 31, 'sa\'d bin abi waqqash'],
    ['abuubaidah', 'asyarah', 'Abu Ubaidah bin Al-Jarrah', 'Amin Hadzihil Ummah (orang tepercaya umat ini)', 583, 639, '±583 M', '18 H / 639 M', 'Diberi gelar kepercayaan oleh Nabi ﷺ. Panglima penaklukan Syam dan pemimpin yang rendah hati. Wafat karena wabah Amwas bersama banyak sahabat.', 0, 'abu ubaidah'],
    ['saidzaid', 'asyarah', 'Sa\'id bin Zaid', 'Anak paman Umar', 593, 671, '±593 M', '±51 H / 671 M', 'Ayahnya, Zaid bin Amr, mencari agama tauhid sebelum Islam. Sa\'id masuk Islam awal bersama istrinya Fathimah binti Khattab, yang menjadi sebab Umar masuk Islam. Ikut semua peperangan kecuali Badar.', 0, 'sa\'id bin zaid'],
    ['khadijah', 'sahabiyah', 'Khadijah binti Khuwailid', 'Ummul Mukminin, Ath-Thahirah', 555, 619, '±555 M', '3 SH / 619 M', 'Istri pertama Nabi ﷺ dan orang pertama yang beriman. Menenangkan beliau setelah wahyu pertama dan menopang dakwah dengan hartanya. Wafat pada Tahun Duka Cita.', 96, 'khadijah'],
    ['aisyah', 'sahabiyah', 'Aisyah binti Abu Bakar', 'Ummul Mukminin, Ash-Shiddiqah', 614, 678, '±614 M', '58 H / 678 M', 'Salah satu istri Nabi ﷺ yang paling berilmu dan perawi lebih dari dua ribu hadis. Banyak sahabat merujuk kepadanya dalam urusan fikih. Kesuciannya dari tuduhan palsu dibela langsung oleh Allah dalam surah An-Nur.', 24, 'aisyah'],
    ['fathimah', 'sahabiyah', 'Fathimah Az-Zahra', 'Sayyidah Nisa Ahlil Jannah', 605, 632, '±605 M', '11 H / 632 M', 'Putri bungsu Nabi ﷺ dari Khadijah, istri Ali, ibu Hasan dan Husain. Wafat sekitar enam bulan setelah ayahnya, orang pertama dari keluarga beliau yang menyusul.', 33, 'fathimah'],
    ['sumayyah', 'awal', 'Sumayyah binti Khayyath', 'Syahidah pertama dalam Islam', 550, 615, '±550 M', '±615 M', 'Disiksa Abu Jahal karena keimanannya bersama suaminya Yasir dan putranya Ammar, namun tetap teguh hingga syahid.', 16, 'sumayyah'],
    ['bilal', 'awal', 'Bilal bin Rabah', 'Muadzin Rasulullah ﷺ', 580, 641, '±580 M', '±20 H / 641 M', 'Bekas budak Habasyah yang disiksa di atas pasir panas sambil terus mengucap "Ahad, Ahad". Dimerdekakan Abu Bakar, lalu menjadi muadzin pertama dan mengumandangkan adzan di atas Ka\'bah saat Fathu Makkah.', 0, 'bilal'],
    ['musab', 'awal', 'Mush\'ab bin Umair', 'Duta Islam pertama', 575, 625, '±575 M', '3 H / 625 M', 'Pemuda Mekah yang hidup mewah lalu meninggalkan semuanya demi Islam. Diutus mengajar penduduk Madinah hingga hampir setiap rumah di sana mengenal Islam. Gugur membawa panji di Uhud.', 3, 'mush\'ab'],
    ['hamzah', 'panglima', 'Hamzah bin Abdul Muthalib', 'Asadullah (singa Allah), Sayyidus Syuhada', 568, 625, '±568 M', '3 H / 625 M', 'Paman dan saudara sepersusuan Nabi ﷺ. Masuk Islam di Mekah dan menjadi pelindung kaum muslimin. Syahid di Uhud.', 3, 'hamzah'],
    ['jafar', 'panglima', 'Ja\'far bin Abi Thalib', 'Ath-Thayyar (yang terbang di surga)', 590, 629, '±590 M', '8 H / 629 M', 'Memimpin hijrah ke Habasyah dan berbicara di hadapan Najasyi dengan surah Maryam. Gugur sebagai panglima kedua di Mu\'tah setelah kedua tangannya terputus.', 19, 'ja\'far'],
    ['zaid', 'panglima', 'Zaid bin Haritsah', 'Hibbu Rasulillah (kekasih Rasulullah)', 581, 629, '±581 M', '8 H / 629 M', 'Bekas budak yang diangkat anak oleh Nabi ﷺ. Satu-satunya sahabat yang namanya disebut dalam Al-Qur\'an (Al-Ahzab 37). Panglima pertama di Mu\'tah dan gugur di sana.', 33, 'zaid bin haritsah'],
    ['saadmuadz', 'anshar', 'Sa\'d bin Mu\'adz', 'Sayyid Al-Aus', 593, 627, '±593 M', '5 H / 627 M', 'Pemimpin Aus yang masuk Islam lewat dakwah Mush\'ab lalu mengislamkan kaumnya. Memutuskan hukum atas Bani Quraizhah. Wafat karena luka Khandaq, dan arsy Allah bergetar karena wafatnya.', 33, 'sa\'d bin mu\'adz'],
    ['abuayyub', 'anshar', 'Abu Ayyub Al-Anshari', 'Tuan rumah Nabi ﷺ', 598, 672, '±598 M', '±52 H / 672 M', 'Rumahnya dipilih unta Nabi ﷺ saat tiba di Madinah. Ikut hampir semua peperangan hingga wafat dalam pengepungan Konstantinopel di usia lanjut.', 0, 'abu ayyub'],
    ['salman', 'awal', 'Salman Al-Farisi', 'Salman minna Ahlil Bait', 568, 656, '±568 M', '±35 H / 656 M', 'Pencari kebenaran dari Persia yang berpindah-pindah agama hingga bertemu Nabi ﷺ di Madinah. Mengusulkan penggalian parit di Perang Khandaq.', 33, 'salman'],
    ['abudzar', 'awal', 'Abu Dzar Al-Ghifari', 'Pembela kejujuran dan kezuhudan', 590, 652, '±590 M', '32 H / 652 M', 'Termasuk yang paling awal masuk Islam, terkenal jujur dan zuhud. Wafat sendirian di Rabadzah dalam pengasingan, dan dikuburkan oleh rombongan musafir yang dipimpin Ibnu Mas\'ud.', 0, 'abu dzar'],
    ['khalid', 'panglima', 'Khalid bin Walid', 'Saifullah Al-Maslul (pedang Allah yang terhunus)', 592, 642, '±592 M', '21 H / 642 M', 'Panglima pasukan Quraisy di Uhud yang masuk Islam sebelum Fathu Makkah. Tak pernah kalah dalam peperangan; menyelamatkan pasukan di Mu\'tah dan memimpin penaklukan Irak dan Syam. Wafat di tempat tidur, padahal menginginkan syahid.', 0, 'khalid bin walid'],
    ['ammar', 'awal', 'Ammar bin Yasir', 'Ath-Thayyib Al-Muthayyab', 570, 657, '±570 M', '37 H / 657 M', 'Putra Sumayyah dan Yasir, disiksa Quraisy karena imannya, hingga turun ayat An-Nahl 106 tentang orang yang dipaksa mengucap kekafiran sedangkan hatinya tetap beriman. Gugur di Shiffin pada usia sekitar 90 tahun.', 16, 'ammar bin yasir'],
    ['ibnumasud', 'ulama', 'Abdullah bin Mas\'ud', 'Ahli Al-Qur\'an dan fikih Kufah', 594, 653, '±594 M', '32 H / 653 M', 'Pengembala kambing yang kemudian menjadi pembaca dan pengajar Al-Qur\'an terbaik. Pelayan setia Nabi ﷺ dan guru pertama ulama Kufah.', 0, 'ibnu mas\'ud'],
    ['ubay', 'ulama', 'Ubay bin Ka\'b', 'Sayyidul Qurra (pemimpin para qari)', 600, 650, '±600 M', '±30 H / 650 M', 'Penulis wahyu dari Anshar yang disebut Nabi ﷺ sebagai sahabat paling pandai membaca Al-Qur\'an. Surah Al-Bayyinah dibacakan langsung kepadanya.', 98, 'ubay bin ka\'b'],
    ['zaidtsabit', 'ulama', 'Zaid bin Tsabit', 'Penulis wahyu & penghimpun mushaf', 611, 665, '±611 M', '±45 H / 665 M', 'Pemuda Anshar yang mempelajari bahasa Ibrani dan Suryani atas perintah Nabi ﷺ. Memimpin pengumpulan Al-Qur\'an pada masa Abu Bakar dan penyalinan mushaf pada masa Utsman.', 0, 'zaid bin tsabit'],
    ['muadz', 'ulama', 'Mu\'adz bin Jabal', 'A\'lamuhum bil halal wal haram (paling paham halal haram)', 596, 639, '±596 M', '18 H / 639 M', 'Pemuda Anshar yang paling paham fikih. Diutus Nabi ﷺ menjadi hakim dan guru di Yaman. Wafat karena wabah Amwas.', 0, 'mu\'adz bin jabal'],
    ['ibnuabbas', 'ulama', 'Abdullah bin Abbas', 'Hibrul Ummah, Turjumanul Quran', 619, 688, '3 SH / 619 M', '68 H / 688 M', 'Sepupu Nabi ﷺ yang didoakan: "Ya Allah, pahamkanlah dia agama dan ajarkan ia takwil." Menjadi bapak tafsir dan mengajar ribuan murid di Mekah.', 0, 'ibnu abbas'],
    ['ibnuumar', 'ulama', 'Abdullah bin Umar', 'Teladan dalam mengikuti sunnah', 610, 693, '±610 M', '73 H / 693 M', 'Putra Umar yang sangat berhati-hati dalam meneladani Nabi ﷺ hingga dalam hal kecil, serta salah satu periwayat hadis terbanyak.', 0, 'ibnu umar'],
    ['abuhurairah', 'ulama', 'Abu Hurairah', 'Hafizhul Ummah, periwayat hadis terbanyak', 603, 679, '±603 M', '59 H / 679 M', 'Masuk Islam saat Perang Khaibar dan menyertai Nabi ﷺ selama sekitar empat tahun di Suffah, lalu meriwayatkan lebih dari 5.000 hadis. Tinggal di Madinah dan didoakan Nabi ﷺ agar hafalannya kuat.', 0, 'abu hurairah'],
    ['anas', 'ulama', 'Anas bin Malik', 'Khadimu Rasulillah (pelayan Rasulullah)', 612, 712, '10 SH / 612 M', '93 H / 712 M', 'Melayani Nabi ﷺ sejak berusia sepuluh tahun hingga wafat, tanpa pernah ditegur. Hidup lebih dari seratus tahun dan menjadi salah satu sahabat yang wafat paling akhir.', 0, 'anas bin malik'],
    ['usamah', 'panglima', 'Usamah bin Zaid', 'Hibbu Rasulillah wabnu hibbih', 612, 674, '±612 M', '±54 H / 674 M', 'Putra Zaid bin Haritsah yang ditunjuk Nabi ﷺ memimpin pasukan besar ke Syam di usia belasan, meski ada sahabat senior di dalamnya. Pasukannya diberangkatkan Abu Bakar setelah Nabi ﷺ wafat.', 0, 'usamah']
  ];
  const SM = Object.fromEntries(S.map(x => [x[0], x]));
  /* peristiwa: tahun (M), label tahun, sahabat, isi */
  const M = [
    [595, '595 M', 'khadijah', 'Menikah dengan Muhammad ﷺ yang kala itu berusia 25 tahun.'],
    [610, '610 M', 'khadijah', 'Orang pertama yang beriman setelah wahyu pertama turun di Gua Hira.'],
    [610, '610 M', 'abubakar', 'Masuk Islam, laki-laki dewasa pertama yang beriman, lalu mengajak Utsman, Zubair, Abdurrahman bin Auf, Sa\'d, dan Thalhah.'],
    [610, '610 M', 'ali', 'Masuk Islam sebagai anak pertama yang beriman, dalam asuhan Nabi ﷺ.'],
    [610, '610 M', 'zaid', 'Masuk Islam sebagai orang pertama dari kalangan bekas budak yang beriman; Nabi ﷺ telah memerdekakan dan mengangkatnya sebagai anak.'],
    [613, '613 M', 'bilal', 'Disiksa Umayyah bin Khalaf karena keimanannya; Abu Bakar kemudian membebaskannya.'],
    [615, '±615 M', 'sumayyah', 'Syahidah pertama dalam Islam, disiksa Abu Jahal bersama keluarganya.'],
    [615, '615 M', 'jafar', 'Memimpin rombongan hijrah pertama ke Habasyah dan membacakan surah Maryam di hadapan Najasyi.'],
    [615, '615 M', 'utsman', 'Berhijrah ke Habasyah bersama istrinya Ruqayyah, lalu kembali ke Mekah.'],
    [616, '±616 M', 'umar', 'Masuk Islam setelah mendengar lantunan surah Thaha di rumah adiknya, Fathimah binti Khattab. Kaum muslimin mulai sholat terang-terangan.'],
    [619, '619 M', 'khadijah', 'Wafat pada Tahun Duka Cita, tak lama setelah wafatnya Abu Thalib.'],
    [621, '621 M', 'musab', 'Diutus ke Madinah setelah Baiat Aqabah I untuk mengajarkan Al-Qur\'an dan Islam.'],
    [622, '622 M', 'ali', 'Tidur di ranjang Nabi ﷺ pada malam hijrah, mengelabui orang Quraisy yang mengepung rumah.'],
    [622, '622 M', 'abubakar', 'Menemani Nabi ﷺ dalam hijrah dan bersembunyi di Gua Tsur. Allah mengabadikannya dalam surah At-Taubah ayat 40.'],
    [622, '622 M', 'abuayyub', 'Menjadi tuan rumah Nabi ﷺ pertama kali di Madinah, di rumahnya tempat unta beliau berhenti.'],
    [622, '622 M', 'abdurrahman', 'Berhijrah ke Madinah tanpa harta, lalu dipersaudarakan dengan Sa\'d bin Ar-Rabi\' yang menawarkan separuh hartanya, tetapi ia memilih berdagang.'],
    [623, '623 M', 'bilal', 'Menjadi muadzin pertama setelah disyariatkannya adzan di Madinah.'],
    [624, '2 H / 624 M', 'ali', 'Menikah dengan Fathimah dan ikut berduel di Perang Badar.'],
    [624, '2 H / 624 M', 'hamzah', 'Ikut berduel di Badar dan menewaskan Syaibah bin Rabi\'ah.'],
    [625, '3 H / 625 M', 'thalhah', 'Melindungi Nabi ﷺ dengan tubuhnya di Uhud hingga lumpuh tangannya.'],
    [625, '3 H / 625 M', 'hamzah', 'Syahid di Uhud; Nabi ﷺ menyebutnya Sayyidus Syuhada.'],
    [625, '3 H / 625 M', 'musab', 'Syahid sambil membawa panji di Uhud.'],
    [625, '3 H / 625 M', 'khalid', 'Memimpin pasukan berkuda Quraisy di Uhud saat pemanah meninggalkan bukit, dan beralih menjadi pembela Islam setelahnya.'],
    [627, '5 H / 627 M', 'salman', 'Mengusulkan strategi parit pada Perang Khandaq.'],
    [627, '5 H / 627 M', 'zubair', 'Menjadi pengintai yang berani; Nabi ﷺ menyebutnya Hawari saat Khandaq.'],
    [627, '5 H / 627 M', 'saadmuadz', 'Memutuskan hukum atas Bani Quraizhah, lalu wafat karena luka Khandaq.'],
    [628, '6 H / 628 M', 'utsman', 'Diutus ke Mekah sebagai juru runding sebelum Baiat Ridwan; baiat itu dilakukan setelah kabar (keliru) bahwa ia dibunuh.'],
    [628, '6 H / 628 M', 'umar', 'Mempertanyakan syarat Hudaibiyah sebelum menerimanya dengan penuh penyesalan atas pertanyaannya.'],
    [628, '7 H / 628 M', 'abuhurairah', 'Masuk Islam saat Perang Khaibar dan sejak itu menetap bersama Nabi ﷺ.'],
    [629, '8 H / 629 M', 'khalid', 'Masuk Islam bersama Amr bin Ash dan Utsman bin Thalhah, menjelang Perang Mu\'tah.'],
    [629, '8 H / 629 M', 'zaid', 'Gugur sebagai panglima pertama di Mu\'tah.'],
    [629, '8 H / 629 M', 'jafar', 'Gugur di Mu\'tah, panji diambil Abdullah bin Rawahah, kemudian Khalid mengambil alih.'],
    [629, '8 H / 629 M', 'khalid', 'Menarik pasukan dengan selamat dari Mu\'tah dan digelari Saifullah.'],
    [630, '8 H / 630 M', 'bilal', 'Mengumandangkan adzan di atas Ka\'bah saat Fathu Makkah.'],
    [630, '9 H / 630 M', 'utsman', 'Menyumbang ratusan unta dan ribuan dinar untuk pasukan Tabuk.'],
    [630, '9 H / 630 M', 'abubakar', 'Menyerahkan seluruh hartanya untuk perang Tabuk. "Aku tinggalkan Allah dan Rasul-Nya bagi keluargaku."'],
    [631, '10 H / 631 M', 'muadz', 'Diutus Nabi ﷺ ke Yaman sebagai hakim dan guru.'],
    [632, '11 H / 632 M', 'usamah', 'Ditunjuk memimpin pasukan ke Syam; berangkat setelah wafatnya Nabi ﷺ atas perintah Abu Bakar.'],
    [632, '11 H / 632 M', 'abubakar', 'Menenangkan umat saat Nabi ﷺ wafat, lalu dibaiat menjadi khalifah di Saqifah Bani Sa\'idah.'],
    [632, '11 H / 632 M', 'fathimah', 'Wafat sekitar enam bulan setelah ayahnya.'],
    [632, '11 H / 632 M', 'abubakar', 'Memerangi kaum murtad dan nabi palsu dalam Perang Riddah.'],
    [633, '12 H / 633 M', 'zaidtsabit', 'Setelah banyak penghafal gugur di Yamamah, ia memimpin pengumpulan Al-Qur\'an atas perintah Abu Bakar.'],
    [634, '13 H / 634 M', 'abubakar', 'Wafat dan dimakamkan di samping Nabi ﷺ; menunjuk Umar sebagai penggantinya.'],
    [634, '13 H / 634 M', 'khalid', 'Memenangkan Yarmuk dan menaklukkan Damaskus pada masa Abu Bakar.'],
    [636, '15 H / 636 M', 'saad', 'Memimpin pasukan muslim meraih kemenangan di Qadisiyah melawan Persia.'],
    [637, '16 H / 637 M', 'umar', 'Menerima kunci Baitul Maqdis dari Patriark Sofronius dan menandatangani Perjanjian Umariyah.'],
    [638, '17 H / 638 M', 'umar', 'Menetapkan hijrah Nabi ﷺ sebagai awal penanggalan Hijriah.'],
    [639, '18 H / 639 M', 'abuubaidah', 'Wafat karena wabah Amwas di Syam.'],
    [639, '18 H / 639 M', 'muadz', 'Wafat karena wabah Amwas pada usia sekitar 33 tahun.'],
    [641, '20 H / 641 M', 'bilal', 'Wafat di Damaskus setelah ikut kampanye di Syam.'],
    [642, '21 H / 642 M', 'khalid', 'Wafat di Himsh di atas tempat tidurnya; berkata ia telah mencari syahid di seratus pertempuran.'],
    [644, '23 H / 644 M', 'umar', 'Ditikam Abu Lu\'lu\'ah saat sholat Subuh, wafat tiga hari kemudian dalam usia 63 tahun; memilih enam orang sebagai majelis syura.'],
    [644, '24 H / 644 M', 'utsman', 'Dipilih sebagai khalifah ketiga lewat musyawarah yang dipimpin Abdurrahman bin Auf.'],
    [646, '25 H / 646 M', 'utsman', 'Menyalin mushaf standar dan mengirimkannya ke berbagai wilayah dengan penyalin terbaik dipimpin Zaid bin Tsabit.'],
    [650, '±30 H / 650 M', 'ubay', 'Wafat setelah menjadi imam dan guru para qari di Madinah.'],
    [652, '32 H / 652 M', 'abdurrahman', 'Wafat dalam usia lanjut, meninggalkan banyak harta yang dibagi untuk Ahlul Badar dan fakir miskin.'],
    [652, '32 H / 652 M', 'abudzar', 'Wafat di Rabadzah dalam pengasingan.'],
    [653, '32 H / 653 M', 'ibnumasud', 'Wafat di Madinah dan dimakamkan di Baqi\'.'],
    [656, '35 H / 656 M', 'utsman', 'Dikepung pemberontak selama beberapa pekan dan dibunuh saat membaca Al-Qur\'an.'],
    [656, '35 H / 656 M', 'ali', 'Dibaiat menjadi khalifah keempat di Madinah.'],
    [656, '36 H / 656 M', 'thalhah', 'Gugur dalam Perang Jamal.'],
    [656, '36 H / 656 M', 'zubair', 'Dibunuh seusai meninggalkan medan Perang Jamal.'],
    [656, '±35 H / 656 M', 'salman', 'Wafat di Mada\'in setelah menjadi gubernurnya.'],
    [657, '37 H / 657 M', 'ammar', 'Gugur di Shiffin pada usia sekitar 90 tahun, sesuai sabda Nabi ﷺ bahwa ia akan dibunuh kelompok pemberontak.'],
    [661, '40 H / 661 M', 'ali', 'Dibunuh Abdurrahman bin Muljam saat menuju sholat Subuh di Kufah.'],
    [671, '±51 H / 671 M', 'saidzaid', 'Wafat di Madinah dalam usia lebih dari 70 tahun.'],
    [672, '±52 H / 672 M', 'abuayyub', 'Wafat dan dimakamkan di bawah tembok Konstantinopel.'],
    [674, '±54 H / 674 M', 'usamah', 'Wafat di Madinah, ada pula riwayat di Wadi Qura.'],
    [675, '±55 H / 675 M', 'saad', 'Wafat di Aqiq dan dimakamkan di Baqi\'; sahabat terakhir dari sepuluh yang dijamin surga.'],
    [678, '58 H / 678 M', 'aisyah', 'Wafat di Madinah setelah bertahun-tahun mengajar para tabiin; dimakamkan di Baqi\'.'],
    [679, '59 H / 679 M', 'abuhurairah', 'Wafat di Madinah; sekitar 800 sahabat dan tabiin meriwayatkan hadis darinya.'],
    [688, '68 H / 688 M', 'ibnuabbas', 'Wafat di Thaif; Muhammad bin Al-Hanafiyyah berkata, "Hari ini wafat rabbani umat ini."'],
    [693, '73 H / 693 M', 'ibnuumar', 'Wafat di Mekah; ditolak ikut Badar dan Uhud karena masih belia, baru ikut sejak Khandaq.'],
    [712, '93 H / 712 M', 'anas', 'Wafat di Bashrah dalam usia lebih dari seratus tahun; salah satu sahabat terakhir yang wafat di sana.'],
    [718, '±100 H / 718 M', 'abuthufail', 'Abu Ath-Thufail Amir bin Watsilah wafat, disebut sebagai sahabat terakhir yang wafat; ia sempat bertemu Nabi ﷺ.']
  ];
  SM.abuthufail = ['abuthufail', 'ulama', 'Abu Ath-Thufail Amir bin Watsilah', 'Sahabat terakhir yang wafat', 626, 718, '±626 M', '±100 H / 718 M', 'Menurut Muslim, ia adalah sahabat terakhir yang wafat. Ia masih kecil saat Haji Wada\' dan melihat Nabi ﷺ.', 0, ''];
  const read = () => new Set(store.get('sahabatRead', []));
  const hd = cur => `<section class="hd-hero"><p class="hd-bis" lang="ar" dir="rtl">رَضِيَ اللَّهُ عَنْهُمْ وَرَضُوا عَنْهُ</p><h1>Sahabat Nabi ﷺ</h1><p>${S.length + 1} sahabat dan ${M.length} peristiwa, dari masa Mekah hingga sahabat terakhir wafat.</p></section><nav class="hd-tabs">${[['linimasa', 'Linimasa'], ['profil', 'Profil'], ['kuis', 'Kuis']].map(([k, l]) => `<a class="chip ${cur === k ? 'active' : ''}" href="#/sahabat/${k}">${l}</a>`).join('')}</nav>`;
  const nm = id => (SM[id] || [])[2] || '';
  const barRow = x => {
    const A = 540, B = 720, p = v => Math.max(0, Math.min(100, (v - A) / (B - A) * 100));
    return `<div class="sh-life" title="${esc(x[6])} – ${esc(x[7])}"><i style="left:${p(x[4])}%;width:${Math.max(1.5, p(x[5]) - p(x[4]))}%"></i><span class="sh-p" style="left:${p(622)}%"></span></div><div class="sh-axis"><span>540 M</span><span>Hijrah 622</span><span>720 M</span></div>`;
  };
  const links = x => `${x[9] ? `<a class="btn sm" href="#/surah/${x[9]}">📖 Surah terkait</a>` : ''}${x[10] ? `<a class="btn sm" href="#/hadis/cari?q=${encodeURIComponent(x[10])}">📜 Hadis</a>` : ''}`;

  function linimasa(q) {
    const r = read(), kw = (q.get('q') || '').toLowerCase().trim(), ph = q.get('f') || '', sh = q.get('s') || '';
    const key = (m, i) => m[2] + '-' + m[0] + '-' + i;
    const all = M.map((m, i) => [key(m, i), ...m]); /* [kunci, tahun, label, id, isi] */
    const list = all.filter(m => (!ph || eraOf(m[1]) === ph) && (!sh || m[3] === sh) && (!kw || (m[2] + m[4] + nm(m[3])).toLowerCase().includes(kw)));
    const pct = Math.round(all.filter(m => r.has(m[0])).length / all.length * 100);
    view.innerHTML = hd('linimasa') + `${sh ? `<p class="card">Peristiwa untuk <b>${esc(nm(sh))}</b>. <a href="#/sahabat/linimasa">Tampilkan semua</a></p>` : ''}<div class="card"><b>${pct}% selesai dibaca</b><div class="sr-bar"><i style="width:${pct}%"></i></div></div>
      <form class="hd-search" id="shf"><input id="shq" type="search" placeholder="Cari sahabat atau peristiwa (umar, badar, 634…)" value="${esc(kw)}"><button class="btn">Cari</button></form>
      <nav class="hd-tabs">${[['', 'Semua'], ...Object.entries(ERA).map(([k, v]) => [k, v[1].split(' (')[0]])].map(([k, t]) => `<a class="chip ${ph === k ? 'active' : ''}" href="#/sahabat/linimasa?f=${k}${kw ? '&q=' + encodeURIComponent(kw) : ''}">${t}</a>`).join('')}</nav>` +
      (Object.keys(ERA).map(k => {
        const xs = list.filter(m => eraOf(m[1]) === k);
        return xs.length ? `<p class="mini-title hd-sec sr-ph">${ERA[k][0]} ${ERA[k][1]}</p>${xs.map(m => `<article class="sr-ev sh-ev ${r.has(m[0]) ? 'done' : ''}" data-id="${esc(m[0])}"><span class="sr-yr">${esc(m[2])}</span> <a class="sh-name" href="#/sahabat/profil?s=${m[3]}">${esc(nm(m[3]))}</a><p>${esc(m[4])}</p><div class="hd-acts"><button class="btn sm" data-act="r">${r.has(m[0]) ? '✓ Sudah dibaca' : 'Tandai dibaca'}</button></div></article>`).join('')}` : '';
      }).join('') || '<p class="muted">Tidak ada peristiwa yang cocok.</p>') +
      '<p class="muted small hd-note">Tahun dan usia mengikuti pendapat yang masyhur; sebagian riwayat berbeda dan tanda ± menunjukkan perkiraan. Rujuk kitab seperti Siyar A\'lamin Nubala dan Al-Ishabah untuk kajian mendalam.</p>';
    $('#shf').onsubmit = e => { e.preventDefault(); location.hash = `#/sahabat/linimasa?f=${ph}&q=${encodeURIComponent($('#shq').value)}`; };
    view.onclick = e => {
      const b = e.target.closest('[data-act="r"]'); if (!b) return;
      const id = b.closest('.sr-ev').dataset.id, s = read(); s.has(id) ? s.delete(id) : s.add(id);
      store.set('sahabatRead', [...s]); const y = scrollY; linimasa(q); scrollTo(0, y);
    };
  }

  function profil(q) {
    const kat = q.get('k') || '', kw = (q.get('q') || '').toLowerCase().trim(), foc = q.get('s') || '';
    const list = [...S, SM.abuthufail].filter(x => (!kat || x[1] === kat) && (!kw || (x[2] + x[3] + x[8]).toLowerCase().includes(kw))).sort((a, b) => a[4] - b[4]);
    view.innerHTML = hd('profil') + `<form class="hd-search" id="shf"><input id="shq" type="search" placeholder="Cari sahabat (bilal, qari, panglima…)" value="${esc(kw)}"><button class="btn">Cari</button></form>
      <nav class="hd-tabs">${[['', 'Semua'], ...Object.entries(KAT)].map(([k, t]) => `<a class="chip ${kat === k ? 'active' : ''}" href="#/sahabat/profil?k=${k}${kw ? '&q=' + encodeURIComponent(kw) : ''}">${t}</a>`).join('')}</nav>
      <p class="muted small">Diurutkan dari yang paling dahulu lahir. Garis menunjukkan rentang hidup terhadap hijrah (622 M).</p>` +
      (list.map(x => `<article class="sr-ev sh-pf ${x[0] === foc ? 'sh-foc' : ''}" id="s-${x[0]}"><span class="sr-yr">${esc(KAT[x[1]])}</span><br><b>${esc(x[2])} <small lang="ar">${x[1] === 'sahabiyah' || x[0] === 'sumayyah' ? 'رضي الله عنها' : 'رضي الله عنه'}</small></b><p class="muted small">${esc(x[3])}</p><p>${esc(x[8])}</p>${barRow(x)}<p class="small"><b>Lahir:</b> ${esc(x[6])} &nbsp; <b>Wafat:</b> ${esc(x[7])}</p><div class="hd-acts">${links(x)}<a class="btn sm" href="#/sahabat/linimasa?s=${x[0]}">🕰️ Peristiwa</a></div></article>`).join('') || '<p class="muted">Tidak ada sahabat yang cocok.</p>') +
      '<p class="muted small hd-note">Daftar ini hanya sebagian kecil dari puluhan ribu sahabat. Semua sahabat adil dan mulia; kisah di sini ditujukan untuk diteladani.</p>';
    $('#shf').onsubmit = e => { e.preventDefault(); location.hash = `#/sahabat/profil?k=${kat}&q=${encodeURIComponent($('#shq').value)}`; };
    view.onclick = null;
    if (foc) { const el = document.getElementById('s-' + foc); if (el) el.scrollIntoView({ block: 'center' }); }
  }

  /* kuis otomatis: julukan -> sahabat, dan wafat -> sahabat */
  let Q = null, n = 0, score = 0;
  const shuf = a => a.map(v => [Math.random(), v]).sort((p, c) => p[0] - c[0]).map(p => p[1]);
  function kuis() {
    if (!Q) { Q = shuf(S).slice(0, 8).map((x, i) => [x, i % 2]); n = 0; score = 0; }
    if (n >= Q.length) {
      view.innerHTML = hd('kuis') + `<div class="card"><h2>Skor: ${score}/${Q.length}</h2><p class="muted">${score >= 7 ? 'Masya Allah, pengetahuanmu tentang sahabat kuat!' : 'Baca lagi linimasa dan profil lalu coba kembali.'}</p><button class="btn" id="again">Ulangi</button></div>`;
      $('#again').onclick = () => { Q = null; kuis(); }; return;
    }
    const [x, t] = Q[n], ops = shuf([x, ...shuf(S.filter(y => y[0] !== x[0] && (t ? y[7] !== x[7] : true))).slice(0, 3)]);
    const ask = t ? `Siapakah sahabat yang wafat pada ${x[7]}?` : `Siapakah sahabat yang dijuluki "${x[3]}"?`;
    view.innerHTML = hd('kuis') + `<div class="card sr-q"><p class="muted small">Soal ${n + 1} dari ${Q.length}</p><p><b>${esc(ask)}</b></p>${ops.map(o => `<button data-y="${o[0]}">${esc(o[2])}</button>`).join('')}<p id="fb" class="muted"></p></div>`;
    view.onclick = e => {
      const b = e.target.closest('button[data-y]'); if (!b || view.dataset.lock) return;
      const ok = b.dataset.y === x[0]; if (ok) score++;
      b.classList.add(ok ? 'ok' : 'no'); view.querySelectorAll('button[data-y]').forEach(o => { if (o.dataset.y === x[0]) o.classList.add('ok'); });
      $('#fb').innerHTML = `${ok ? '✅ Benar.' : '❌ Kurang tepat.'} ${esc(x[2])}: ${esc(x[8].split('. ')[0])}. <button class="btn sm" id="nx">Lanjut</button>`;
      view.dataset.lock = 1; $('#nx').onclick = () => { delete view.dataset.lock; n++; kuis(); };
    };
  }

  return function (tab, q) {
    setTitle('Sahabat Nabi ﷺ', true);
    view.onclick = null; delete view.dataset.lock;
    return tab === 'kuis' ? kuis() : tab === 'profil' ? profil(q) : linimasa(q);
  };
};
