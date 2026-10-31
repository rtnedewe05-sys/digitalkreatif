/* Tuntunan Sholat: wudhu, adzan, sholat wajib & sunnah, bacaan lengkap (Arab, latin, arti), dzikir & doa, jadwal sholat.
 * Rujukan fikih: mazhab Syafi'i (umum di Indonesia). Seluruh isi offline, kecuali jadwal sholat (butuh internet sekali per hari). */
window.makeSholatView = function (d) {
  const { $, esc, view, setTitle, toast, store } = d;

  /* ====== BACAAN (kunci -> teks) ====== */
  const D = {
    takbir: { t: 'Takbiratul Ihram', ar: 'اللّٰهُ أَكْبَرُ', la: 'Allaahu akbar', id: 'Allah Maha Besar.', n: 'Angkat kedua tangan setinggi bahu/telinga' },
    iftitah: { t: 'Doa Iftitah', ar: 'اللّٰهُ أَكْبَرُ كَبِيرًا وَالْحَمْدُ لِلّٰهِ كَثِيرًا وَسُبْحَانَ اللّٰهِ بُكْرَةً وَأَصِيلًا. إِنِّي وَجَّهْتُ وَجْهِيَ لِلَّذِي فَطَرَ السَّمٰوَاتِ وَالْأَرْضَ حَنِيفًا مُسْلِمًا وَمَا أَنَا مِنَ الْمُشْرِكِينَ. إِنَّ صَلَاتِي وَنُسُكِي وَمَحْيَايَ وَمَمَاتِي لِلّٰهِ رَبِّ الْعَالَمِينَ. لَا شَرِيكَ لَهُ وَبِذٰلِكَ أُمِرْتُ وَأَنَا مِنَ الْمُسْلِمِينَ.', la: "Allaahu akbar kabiiraa, walhamdu lillaahi katsiiraa, wa subhaanallaahi bukratan wa ashiilaa. Innii wajjahtu wajhiya lilladzii fatharas samaawaati wal ardha haniifan musliman wa maa ana minal musyrikiin. Inna shalaatii wa nusukii wa mahyaaya wa mamaatii lillaahi rabbil 'aalamiin. Laa syariika lahu wa bidzaalika umirtu wa ana minal muslimiin.", id: 'Allah Maha Besar sebesar-besarnya, segala puji bagi Allah sebanyak-banyaknya, Maha Suci Allah pagi dan petang. Aku hadapkan wajahku kepada Dzat yang menciptakan langit dan bumi dengan lurus dan berserah diri, dan aku bukan termasuk orang musyrik. Sesungguhnya sholatku, ibadahku, hidupku, dan matiku hanya untuk Allah, Tuhan semesta alam. Tiada sekutu bagi-Nya; demikian aku diperintahkan, dan aku termasuk orang-orang muslim.', n: 'Sunnah, dibaca pada rakaat pertama saja' },
    taawudz: { t: "Ta'awudz", ar: 'أَعُوذُ بِاللّٰهِ مِنَ الشَّيْطَانِ الرَّجِيمِ', la: "A'uudzu billaahi minasy syaithaanir rajiim", id: 'Aku berlindung kepada Allah dari setan yang terkutuk.' },
    amin: { t: 'Amin', ar: 'آمِين', la: 'Aamiin', id: 'Ya Allah, kabulkanlah.', n: 'Setelah Al-Fatihah' },
    ruku: { t: "Tasbih Ruku'", ar: 'سُبْحَانَ رَبِّيَ الْعَظِيمِ وَبِحَمْدِهِ', la: "Subhaana rabbiyal 'azhiimi wa bihamdih", id: 'Maha Suci Tuhanku Yang Maha Agung, dan dengan memuji-Nya.', n: 'Dibaca 3x (sunnah)' },
    itidal1: { t: "Bangun dari Ruku' (I'tidal)", ar: 'سَمِعَ اللّٰهُ لِمَنْ حَمِدَهُ', la: "Sami'allaahu liman hamidah", id: 'Allah mendengar siapa yang memuji-Nya.', n: 'Sambil bangun, tangan diangkat' },
    itidal2: { t: "Bacaan I'tidal", ar: 'رَبَّنَا لَكَ الْحَمْدُ مِلْءَ السَّمٰوَاتِ وَمِلْءَ الْأَرْضِ وَمِلْءَ مَا شِئْتَ مِنْ شَيْءٍ بَعْدُ', la: "Rabbanaa lakal hamdu mil'as samaawaati wa mil'al ardhi wa mil'a maa syi'ta min syai-in ba'd", id: 'Wahai Tuhan kami, bagi-Mu segala puji sepenuh langit dan bumi, dan sepenuh apa yang Engkau kehendaki sesudah itu.', n: 'Setelah tegak berdiri' },
    qunut: { t: 'Doa Qunut (sholat Subuh)', ar: 'اللّٰهُمَّ اهْدِنِي فِيمَنْ هَدَيْتَ وَعَافِنِي فِيمَنْ عَافَيْتَ وَتَوَلَّنِي فِيمَنْ تَوَلَّيْتَ وَبَارِكْ لِي فِيمَا أَعْطَيْتَ وَقِنِي شَرَّ مَا قَضَيْتَ فَإِنَّكَ تَقْضِي وَلَا يُقْضَى عَلَيْكَ وَإِنَّهُ لَا يَذِلُّ مَنْ وَالَيْتَ وَلَا يَعِزُّ مَنْ عَادَيْتَ تَبَارَكْتَ رَبَّنَا وَتَعَالَيْتَ فَلَكَ الْحَمْدُ عَلَى مَا قَضَيْتَ أَسْتَغْفِرُكَ وَأَتُوبُ إِلَيْكَ وَصَلَّى اللّٰهُ عَلَى سَيِّدِنَا مُحَمَّدٍ النَّبِيِّ الْأُمِّيِّ وَعَلَى آلِهِ وَصَحْبِهِ وَسَلَّمَ', la: "Allaahummahdinii fiiman hadait, wa 'aafinii fiiman 'aafait, wa tawallanii fiiman tawallait, wa baarik lii fiimaa a'thait, wa qinii syarra maa qadhait, fa innaka taqdhii wa laa yuqdhaa 'alaik, wa innahu laa yadzillu man waalait, wa laa ya'izzu man 'aadait, tabaarakta rabbanaa wa ta'aalait, fa lakal hamdu 'alaa maa qadhait, astaghfiruka wa atuubu ilaik, wa shallallaahu 'alaa sayyidinaa muhammadin nabiyyil ummiyyi wa 'alaa aalihii wa shahbihii wa sallam.", id: 'Ya Allah, berilah aku petunjuk bersama orang-orang yang telah Engkau beri petunjuk; berilah aku kesehatan bersama orang-orang yang Engkau sehatkan; pimpinlah aku bersama orang-orang yang Engkau pimpin; berkahilah apa yang Engkau berikan kepadaku; lindungilah aku dari keburukan yang Engkau tetapkan. Sesungguhnya Engkau yang menetapkan dan tidak ada yang menetapkan atas-Mu. Tidak hina orang yang Engkau bela, dan tidak mulia orang yang Engkau musuhi. Maha Suci dan Maha Tinggi Engkau, wahai Tuhan kami. Bagi-Mu segala puji atas apa yang Engkau tetapkan. Aku mohon ampun dan bertobat kepada-Mu. Semoga Allah mencurahkan rahmat kepada Nabi Muhammad, keluarga, dan sahabatnya.', n: "Pada rakaat kedua Subuh setelah i'tidal (sunnah dalam mazhab Syafi'i)" },
    sujud: { t: 'Tasbih Sujud', ar: 'سُبْحَانَ رَبِّيَ الْأَعْلَى وَبِحَمْدِهِ', la: "Subhaana rabbiyal a'laa wa bihamdih", id: 'Maha Suci Tuhanku Yang Maha Tinggi, dan dengan memuji-Nya.', n: 'Dibaca 3x (sunnah)' },
    duduk: { t: 'Duduk di Antara Dua Sujud', ar: 'رَبِّ اغْفِرْ لِي وَارْحَمْنِي وَاجْبُرْنِي وَارْفَعْنِي وَارْزُقْنِي وَاهْدِنِي وَعَافِنِي وَاعْفُ عَنِّي', la: "Rabbighfir lii warhamnii wajburnii warfa'nii warzuqnii wahdinii wa 'aafinii wa'fu 'annii", id: 'Ya Tuhanku, ampunilah aku, rahmatilah aku, cukupkanlah kekuranganku, angkatlah derajatku, berilah aku rezeki, berilah aku petunjuk, sehatkanlah aku, dan maafkanlah aku.' },
    tasyahud: { t: 'Tasyahud (Tahiyyat)', ar: 'التَّحِيَّاتُ الْمُبَارَكَاتُ الصَّلَوَاتُ الطَّيِّبَاتُ لِلّٰهِ، السَّلَامُ عَلَيْكَ أَيُّهَا النَّبِيُّ وَرَحْمَةُ اللّٰهِ وَبَرَكَاتُهُ، السَّلَامُ عَلَيْنَا وَعَلَى عِبَادِ اللّٰهِ الصَّالِحِينَ، أَشْهَدُ أَنْ لَا إِلٰهَ إِلَّا اللّٰهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا رَسُولُ اللّٰهِ', la: "At-tahiyyaatul mubaarakaatush shalawaatuth thayyibaatu lillaah. Assalaamu 'alaika ayyuhan nabiyyu wa rahmatullaahi wa barakaatuh. Assalaamu 'alainaa wa 'alaa 'ibaadillaahish shaalihiin. Asyhadu allaa ilaaha illallaah, wa asyhadu anna muhammadar rasuulullaah.", id: 'Segala penghormatan, keberkahan, sholawat, dan kebaikan hanya milik Allah. Salam sejahtera atasmu wahai Nabi, begitu pula rahmat Allah dan berkah-Nya. Salam sejahtera atas kami dan atas hamba-hamba Allah yang saleh. Aku bersaksi tiada tuhan selain Allah, dan aku bersaksi bahwa Muhammad adalah utusan Allah.', n: 'Duduk iftirasy (tasyahud awal) / tawarruk (tasyahud akhir); jari telunjuk kanan diacungkan saat "illallaah"' },
    shalawatAwal: { t: 'Sholawat pada Tasyahud Awal', ar: 'اللّٰهُمَّ صَلِّ عَلَى سَيِّدِنَا مُحَمَّدٍ', la: "Allaahumma shalli 'alaa sayyidinaa muhammad", id: 'Ya Allah, limpahkanlah rahmat kepada junjungan kami Nabi Muhammad.', n: 'Sunnah pada tasyahud awal; setelah itu bangun untuk rakaat berikutnya' },
    shalawat: { t: 'Sholawat Ibrahimiyah (Tasyahud Akhir)', ar: 'اللّٰهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ كَمَا صَلَّيْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ، وَبَارِكْ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ كَمَا بَارَكْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ، فِي الْعَالَمِينَ إِنَّكَ حَمِيدٌ مَجِيدٌ', la: "Allaahumma shalli 'alaa muhammadin wa 'alaa aali muhammad, kamaa shallaita 'alaa ibraahiima wa 'alaa aali ibraahiim, wa baarik 'alaa muhammadin wa 'alaa aali muhammad, kamaa baarakta 'alaa ibraahiima wa 'alaa aali ibraahiim, fil 'aalamiina innaka hamiidum majiid.", id: 'Ya Allah, limpahkanlah rahmat kepada Muhammad dan keluarga Muhammad sebagaimana Engkau limpahkan kepada Ibrahim dan keluarga Ibrahim. Berkahilah Muhammad dan keluarga Muhammad sebagaimana Engkau berkahi Ibrahim dan keluarga Ibrahim. Di seluruh alam, sesungguhnya Engkau Maha Terpuji lagi Maha Mulia.', n: 'Wajib dibaca pada tasyahud akhir (kalimat sholawat kepada Nabi)' },
    sblSalam: { t: 'Doa Sebelum Salam', ar: 'اللّٰهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ عَذَابِ جَهَنَّمَ وَمِنْ عَذَابِ الْقَبْرِ وَمِنْ فِتْنَةِ الْمَحْيَا وَالْمَمَاتِ وَمِنْ شَرِّ فِتْنَةِ الْمَسِيحِ الدَّجَّالِ', la: "Allaahumma innii a'uudzu bika min 'adzaabi jahannam, wa min 'adzaabil qabri, wa min fitnatil mahyaa wal mamaat, wa min syarri fitnatil masiihid dajjaal.", id: 'Ya Allah, aku berlindung kepada-Mu dari azab neraka Jahannam, azab kubur, fitnah hidup dan mati, dan keburukan fitnah Dajjal.' },
    sapuJagat: { t: 'Doa Sapu Jagat', ar: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ', la: "Rabbanaa aatinaa fid dunyaa hasanah, wa fil aakhirati hasanah, wa qinaa 'adzaaban naar.", id: 'Ya Tuhan kami, berilah kami kebaikan di dunia dan kebaikan di akhirat, dan lindungilah kami dari azab neraka. (QS. Al-Baqarah: 201)' },
    salam: { t: 'Salam', ar: 'السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللّٰهِ وَبَرَكَاتُهُ', la: "Assalaamu 'alaikum wa rahmatullaahi wa barakaatuh", id: 'Semoga keselamatan, rahmat Allah, dan berkah-Nya tercurah atas kalian.', n: 'Menoleh ke kanan, lalu ke kiri' },

    /* wudhu & tayamum */
    wudhuNiat: { t: 'Niat Wudhu', ar: 'نَوَيْتُ الْوُضُوءَ لِرَفْعِ الْحَدَثِ الْأَصْغَرِ فَرْضًا لِلّٰهِ تَعَالَى', la: "Nawaitul wudhuu-a liraf'il hadatsil ashghari fardhan lillaahi ta'aalaa", id: 'Aku berniat wudhu untuk menghilangkan hadas kecil, fardhu karena Allah Ta\'ala.', n: 'Dibaca dalam hati saat membasuh wajah; awali dengan "Bismillah"' },
    wudhuDoa: { t: 'Doa Setelah Wudhu', ar: 'أَشْهَدُ أَنْ لَا إِلٰهَ إِلَّا اللّٰهُ وَحْدَهُ لَا شَرِيكَ لَهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ. اللّٰهُمَّ اجْعَلْنِي مِنَ التَّوَّابِينَ وَاجْعَلْنِي مِنَ الْمُتَطَهِّرِينَ', la: "Asyhadu allaa ilaaha illallaahu wahdahu laa syariika lah, wa asyhadu anna muhammadan 'abduhu wa rasuuluh. Allaahummaj'alnii minat tawwaabiina waj'alnii minal mutathahhiriin.", id: 'Aku bersaksi tiada tuhan selain Allah semata, tiada sekutu bagi-Nya, dan aku bersaksi bahwa Muhammad hamba dan utusan-Nya. Ya Allah, jadikanlah aku termasuk orang yang bertobat dan orang yang bersuci.' },
    tayamumNiat: { t: 'Niat Tayamum', ar: 'نَوَيْتُ التَّيَمُّمَ لِاسْتِبَاحَةِ الصَّلَاةِ فَرْضًا لِلّٰهِ تَعَالَى', la: "Nawaitut tayammuma listibaahatish shalaati fardhan lillaahi ta'aalaa", id: 'Aku berniat tayamum agar boleh melakukan sholat, fardhu karena Allah Ta\'ala.' },

    /* adzan */
    adzanDoa: { t: 'Doa Setelah Adzan', ar: 'اللّٰهُمَّ رَبَّ هٰذِهِ الدَّعْوَةِ التَّامَّةِ وَالصَّلَاةِ الْقَائِمَةِ آتِ سَيِّدَنَا مُحَمَّدًا الْوَسِيلَةَ وَالْفَضِيلَةَ وَالدَّرَجَةَ الرَّفِيعَةَ وَابْعَثْهُ مَقَامًا مَحْمُودًا الَّذِي وَعَدْتَهُ وَارْزُقْنَا شَفَاعَتَهُ يَوْمَ الْقِيَامَةِ إِنَّكَ لَا تُخْلِفُ الْمِيعَادَ', la: "Allaahumma rabba haadzihid da'watit taammati wash shalaatil qaa-imah, aati sayyidanaa muhammadanil wasiilata wal fadhiilah, wad darajatar rafii'ah, wab'atshu maqaamam mahmuudanil ladzii wa'adtah, warzuqnaa syafaa'atahu yaumal qiyaamah, innaka laa tukhliful mii'aad.", id: 'Ya Allah, Tuhan seruan yang sempurna ini dan sholat yang akan didirikan, berilah Nabi Muhammad wasilah dan keutamaan, tempatkan beliau pada kedudukan terpuji yang Engkau janjikan, dan anugerahkan kepada kami syafaatnya di hari kiamat. Sesungguhnya Engkau tidak menyalahi janji.' },
    masukMasjid: { t: 'Doa Masuk Masjid', ar: 'اللّٰهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ', la: "Allaahummaftah lii abwaaba rahmatik", id: 'Ya Allah, bukakanlah untukku pintu-pintu rahmat-Mu.', n: 'Masuk dengan kaki kanan' },
    keluarMasjid: { t: 'Doa Keluar Masjid', ar: 'اللّٰهُمَّ إِنِّي أَسْأَلُكَ مِنْ فَضْلِكَ', la: "Allaahumma innii as-aluka min fadhlik", id: 'Ya Allah, aku memohon karunia-Mu.', n: 'Keluar dengan kaki kiri' },

    /* dzikir setelah sholat */
    istighfar: { t: 'Istighfar', ar: 'أَسْتَغْفِرُ اللّٰهَ الْعَظِيمَ', la: "Astaghfirullaahal 'azhiim", id: 'Aku memohon ampun kepada Allah Yang Maha Agung.', n: 'Dibaca 3x' },
    antaSalam: { t: 'Allahumma Antas Salam', ar: 'اللّٰهُمَّ أَنْتَ السَّلَامُ وَمِنْكَ السَّلَامُ تَبَارَكْتَ يَا ذَا الْجَلَالِ وَالْإِكْرَامِ', la: "Allaahumma antas salaam, wa minkas salaam, tabaarakta yaa dzal jalaali wal ikraam.", id: 'Ya Allah, Engkau Maha Sejahtera, dari-Mu keselamatan, Maha Berkah Engkau wahai Pemilik keagungan dan kemuliaan.' },
    laMani: { t: "Laa Maani'a", ar: 'لَا إِلٰهَ إِلَّا اللّٰهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ. اللّٰهُمَّ لَا مَانِعَ لِمَا أَعْطَيْتَ وَلَا مُعْطِيَ لِمَا مَنَعْتَ وَلَا يَنْفَعُ ذَا الْجَدِّ مِنْكَ الْجَدُّ', la: "Laa ilaaha illallaahu wahdahu laa syariika lah, lahul mulku wa lahul hamdu wa huwa 'alaa kulli syai-in qadiir. Allaahumma laa maani'a limaa a'thaita, wa laa mu'thiya limaa mana'ta, wa laa yanfa'u dzal jaddi minkal jadd.", id: 'Tiada tuhan selain Allah semata, tiada sekutu bagi-Nya; milik-Nya kerajaan dan pujian, Dia Maha Kuasa atas segala sesuatu. Ya Allah, tiada yang dapat menghalangi apa yang Engkau beri dan tiada yang dapat memberi apa yang Engkau halangi; kekayaan dan kedudukan tidak bermanfaat di hadapan-Mu kecuali amal.' },
    tasbih: { t: 'Tasbih', ar: 'سُبْحَانَ اللّٰهِ', la: 'Subhaanallaah', id: 'Maha Suci Allah.', n: 'Dibaca 33x' },
    tahmid: { t: 'Tahmid', ar: 'الْحَمْدُ لِلّٰهِ', la: 'Alhamdulillaah', id: 'Segala puji bagi Allah.', n: 'Dibaca 33x' },
    takbir33: { t: 'Takbir', ar: 'اللّٰهُ أَكْبَرُ', la: 'Allaahu akbar', id: 'Allah Maha Besar.', n: 'Dibaca 33x' },
    genap100: { t: 'Penyempurna Seratus', ar: 'لَا إِلٰهَ إِلَّا اللّٰهُ وَحْدَهُ لَا شَرِيكَ لَهُ لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ', la: "Laa ilaaha illallaahu wahdahu laa syariika lah, lahul mulku wa lahul hamdu wa huwa 'alaa kulli syai-in qadiir.", id: 'Tiada tuhan selain Allah semata, tiada sekutu bagi-Nya; milik-Nya kerajaan dan pujian, Dia Maha Kuasa atas segala sesuatu.', n: 'Setelah 33+33+33 menjadi 99' },
    bantuIbadah: { t: 'Doa Dibantu Beribadah', ar: 'اللّٰهُمَّ أَعِنِّي عَلَى ذِكْرِكَ وَشُكْرِكَ وَحُسْنِ عِبَادَتِكَ', la: "Allaahumma a'innii 'alaa dzikrika wa syukrika wa husni 'ibaadatik.", id: 'Ya Allah, bantulah aku untuk berdzikir kepada-Mu, bersyukur kepada-Mu, dan beribadah dengan baik kepada-Mu.' },
    ortu: { t: 'Doa untuk Kedua Orang Tua', ar: 'رَبِّ اغْفِرْ لِي وَلِوَالِدَيَّ وَارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا', la: "Rabbighfir lii wa liwaalidayya warhamhumaa kamaa rabbayaanii shaghiiraa.", id: 'Ya Tuhanku, ampunilah aku dan kedua orang tuaku, sayangilah mereka sebagaimana mereka menyayangiku sewaktu kecil.' },
    sapuJagat2: { t: 'Doa Kebaikan Dunia Akhirat', ar: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ', la: "Rabbanaa aatinaa fid dunyaa hasanah, wa fil aakhirati hasanah, wa qinaa 'adzaaban naar.", id: 'Ya Tuhan kami, berilah kami kebaikan di dunia dan akhirat, dan lindungilah kami dari azab neraka.' },

    /* sunnah */
    witirDoa: { t: 'Dzikir Setelah Witir', ar: 'سُبْحَانَ الْمَلِكِ الْقُدُّوسِ', la: "Subhaanal malikil qudduus", id: 'Maha Suci Raja Yang Maha Suci.', n: 'Dibaca 3x, pada yang ketiga dipanjangkan dan dikeraskan suara; lalu "Subbuuhun qudduusun rabbul malaa-ikati war ruuh"' },
    tarawihDzikir: { t: 'Dzikir di Sela Tarawih', ar: 'سُبْحَانَ ذِي الْمُلْكِ وَالْمَلَكُوتِ، سُبْحَانَ ذِي الْعِزَّةِ وَالْعَظَمَةِ وَالْهَيْبَةِ وَالْقُدْرَةِ وَالْكِبْرِيَاءِ وَالْجَبَرُوتِ، سُبْحَانَ الْمَلِكِ الْحَيِّ الَّذِي لَا يَنَامُ وَلَا يَمُوتُ، سُبُّوحٌ قُدُّوسٌ رَبُّنَا وَرَبُّ الْمَلَائِكَةِ وَالرُّوحِ', la: "Subhaana dzil mulki wal malakuut, subhaana dzil 'izzati wal 'azhamati wal haibati wal qudrati wal kibriyaa-i wal jabaruut, subhaanal malikil hayyil ladzii laa yanaamu wa laa yamuut, subbuuhun qudduusun rabbunaa wa rabbul malaa-ikati war ruuh.", id: 'Maha Suci Pemilik kerajaan dan malakut; Maha Suci Pemilik kemuliaan, keagungan, kewibawaan, kekuasaan, kebesaran, dan keperkasaan; Maha Suci Raja Yang Maha Hidup, tidak tidur dan tidak mati; Maha Suci lagi Maha Kudus, Tuhan kami dan Tuhan para malaikat dan Ruh (Jibril).', n: 'Amalan masyhur di sela tarawih (bukan bagian rukun sholat)' },
    istikharah: { t: 'Doa Istikharah', ar: 'اللّٰهُمَّ إِنِّي أَسْتَخِيرُكَ بِعِلْمِكَ وَأَسْتَقْدِرُكَ بِقُدْرَتِكَ وَأَسْأَلُكَ مِنْ فَضْلِكَ الْعَظِيمِ فَإِنَّكَ تَقْدِرُ وَلَا أَقْدِرُ وَتَعْلَمُ وَلَا أَعْلَمُ وَأَنْتَ عَلَّامُ الْغُيُوبِ. اللّٰهُمَّ إِنْ كُنْتَ تَعْلَمُ أَنَّ هٰذَا الْأَمْرَ خَيْرٌ لِي فِي دِينِي وَمَعَاشِي وَعَاقِبَةِ أَمْرِي فَاقْدُرْهُ لِي وَيَسِّرْهُ لِي ثُمَّ بَارِكْ لِي فِيهِ، وَإِنْ كُنْتَ تَعْلَمُ أَنَّ هٰذَا الْأَمْرَ شَرٌّ لِي فِي دِينِي وَمَعَاشِي وَعَاقِبَةِ أَمْرِي فَاصْرِفْهُ عَنِّي وَاصْرِفْنِي عَنْهُ وَاقْدُرْ لِيَ الْخَيْرَ حَيْثُ كَانَ ثُمَّ أَرْضِنِي بِهِ', la: "Allaahumma innii astakhiiruka bi'ilmik, wa astaqdiruka biqudratik, wa as-aluka min fadhlikal 'azhiim, fa innaka taqdiru wa laa aqdir, wa ta'lamu wa laa a'lam, wa anta 'allaamul ghuyuub. Allaahumma in kunta ta'lamu anna haadzal amra khairun lii fii diinii wa ma'aasyii wa 'aaqibati amrii, faqdurhu lii wa yassirhu lii tsumma baarik lii fiih. Wa in kunta ta'lamu anna haadzal amra syarrun lii fii diinii wa ma'aasyii wa 'aaqibati amrii, fashrifhu 'annii washrifnii 'anhu, waqdur liyal khaira haitsu kaana tsumma ardhinii bih.", id: 'Ya Allah, aku memohon pilihan terbaik kepada-Mu dengan ilmu-Mu, memohon kekuatan dengan kuasa-Mu, dan memohon karunia-Mu yang agung. Engkau Maha Kuasa sedang aku tidak; Engkau Maha Tahu sedang aku tidak; Engkau Maha Mengetahui yang gaib. Ya Allah, jika Engkau tahu urusan ini (sebutkan) baik bagiku dalam agama, kehidupan, dan akhir urusanku, maka tetapkan dan mudahkan untukku, lalu berkahilah. Jika Engkau tahu urusan ini buruk bagiku dalam agama, kehidupan, dan akhir urusanku, maka jauhkan ia dariku dan jauhkan aku darinya, tetapkan kebaikan untukku di mana pun adanya, lalu jadikan aku rida dengannya.', n: 'Dibaca setelah sholat istikharah 2 rakaat; sebutkan hajat pada kata "haadzal amra"' },
    hajat: { t: 'Doa Hajat', ar: 'لَا إِلٰهَ إِلَّا اللّٰهُ الْحَلِيمُ الْكَرِيمُ، سُبْحَانَ اللّٰهِ رَبِّ الْعَرْشِ الْعَظِيمِ، الْحَمْدُ لِلّٰهِ رَبِّ الْعَالَمِينَ، أَسْأَلُكَ مُوجِبَاتِ رَحْمَتِكَ وَعَزَائِمَ مَغْفِرَتِكَ وَالْغَنِيمَةَ مِنْ كُلِّ بِرٍّ وَالسَّلَامَةَ مِنْ كُلِّ إِثْمٍ، لَا تَدَعْ لِي ذَنْبًا إِلَّا غَفَرْتَهُ وَلَا هَمًّا إِلَّا فَرَّجْتَهُ وَلَا حَاجَةً هِيَ لَكَ رِضًا إِلَّا قَضَيْتَهَا يَا أَرْحَمَ الرَّاحِمِينَ', la: "Laa ilaaha illallaahul haliimul kariim, subhaanallaahi rabbil 'arsyil 'azhiim, alhamdulillaahi rabbil 'aalamiin. As-aluka muujibaati rahmatik, wa 'azaa-ima maghfiratik, wal ghaniimata min kulli birr, wassalaamata min kulli itsm. Laa tada' lii dzanban illaa ghafartah, wa laa hamman illaa farrajtah, wa laa haajatan hiya laka ridhan illaa qadhaitahaa yaa arhamar raahimiin.", id: 'Tiada tuhan selain Allah Yang Maha Penyantun lagi Maha Mulia. Maha Suci Allah, Tuhan Arasy yang agung. Segala puji bagi Allah, Tuhan semesta alam. Aku memohon sebab-sebab rahmat-Mu, keteguhan ampunan-Mu, keuntungan dari setiap kebaikan, dan keselamatan dari setiap dosa. Jangan biarkan dosa kecuali Engkau ampuni, kesusahan kecuali Engkau lapangkan, dan hajat yang Engkau ridai kecuali Engkau penuhi, wahai Yang Maha Penyayang.', n: 'Riwayat at-Tirmidzi; sebagian ulama menilai sanadnya lemah, namun doanya baik dan lazim diamalkan' },
    sujudTilawah: { t: 'Bacaan Sujud Tilawah', ar: 'سَجَدَ وَجْهِيَ لِلَّذِي خَلَقَهُ وَشَقَّ سَمْعَهُ وَبَصَرَهُ بِحَوْلِهِ وَقُوَّتِهِ', la: "Sajada wajhiya lilladzii khalaqahu wa syaqqa sam'ahu wa basharahu bihawlihii wa quwwatih.", id: 'Wajahku sujud kepada Dzat yang menciptakannya, membuka pendengaran dan penglihatannya dengan daya dan kekuatan-Nya.' },
    sujudSahwi: { t: 'Bacaan Sujud Sahwi', ar: 'سُبْحَانَ مَنْ لَا يَنَامُ وَلَا يَسْهُو', la: "Subhaana man laa yanaamu wa laa yashuu.", id: 'Maha Suci Dzat yang tidak tidur dan tidak lupa.' },

    witirDoa3: { t: "Dzikir Setelah Witir (3x)", ar: 'سُبْحَانَ الْمَلِكِ الْقُدُّوسِ (٣x) سُبُّوحٌ قُدُّوسٌ رَبُّ الْمَلَائِكَةِ وَالرُّوحِ', la: "Subhaanal malikil qudduus (3x). Subbuuhun qudduusun rabbul malaa-ikati war ruuh.", id: 'Maha Suci Raja Yang Maha Suci (3 kali). Maha Suci lagi Maha Kudus, Tuhan para malaikat dan Ruh (Jibril).', n: 'Riwayat an-Nasa\'i; pada bacaan ketiga dipanjangkan dan dikeraskan suara' },
    witirDoa4: { t: 'Doa Setelah Witir', ar: 'اللّٰهُمَّ إِنِّي أَعُوذُ بِرِضَاكَ مِنْ سَخَطِكَ وَبِمُعَافَاتِكَ مِنْ عُقُوبَتِكَ وَأَعُوذُ بِكَ مِنْكَ لَا أُحْصِي ثَنَاءً عَلَيْكَ أَنْتَ كَمَا أَثْنَيْتَ عَلَى نَفْسِكَ', la: "Allaahumma innii a'uudzu biridhaaka min sakhathik, wa bimu'aafaatika min 'uquubatik, wa a'uudzu bika minka, laa uhshii tsanaa-an 'alaik, anta kamaa atsnaita 'alaa nafsik.", id: 'Ya Allah, aku berlindung dengan rida-Mu dari murka-Mu, dengan maaf-Mu dari hukuman-Mu, dan berlindung kepada-Mu dari-Mu. Aku tidak mampu menghitung pujian kepada-Mu; Engkau sebagaimana pujian-Mu terhadap diri-Mu sendiri.', n: 'Riwayat Abu Dawud dan at-Tirmidzi; dibaca pada akhir witir' },
    kamilin: { t: 'Doa Kamilin (setelah Tarawih)', ar: 'اللّٰهُمَّ اجْعَلْنَا بِالْإِيمَانِ كَامِلِينَ وَلِلْفَرَائِضِ مُؤَدِّينَ وَلِلصَّلَاةِ حَافِظِينَ وَلِلزَّكَاةِ فَاعِلِينَ وَلِمَا عِنْدَكَ طَالِبِينَ وَلِعَفْوِكَ رَاجِينَ وَبِالْهُدَى مُتَمَسِّكِينَ وَعَنِ اللَّغْوِ مُعْرِضِينَ وَفِي الدُّنْيَا زَاهِدِينَ وَفِي الْآخِرَةِ رَاغِبِينَ وَبِالْقَضَاءِ رَاضِينَ وَلِلنَّعْمَاءِ شَاكِرِينَ وَعَلَى الْبَلَاءِ صَابِرِينَ وَتَحْتَ لِوَاءِ سَيِّدِنَا مُحَمَّدٍ صَلَّى اللّٰهُ عَلَيْهِ وَسَلَّمَ يَوْمَ الْقِيَامَةِ سَائِرِينَ، بِرَحْمَتِكَ يَا أَرْحَمَ الرَّاحِمِينَ', la: "Allaahummaj'alnaa bil iimaani kaamiliin, wa lil faraa-idhi mu-addiin, wa lish shalaati haafizhiin, wa liz zakaati faa'iliin, wa limaa 'indaka thaalibiin, wa li'afwika raajiin, wa bil hudaa mutamassikiin, wa 'anil laghwi mu'ridhiin, wa fid dunyaa zaahidiin, wa fil aakhirati raaghibiin, wa bil qadhaa-i raadhiin, wa lin na'maa-i syaakiriin, wa 'alal balaa-i shaabiriin, wa tahta liwaa-i sayyidinaa muhammadin shallallaahu 'alaihi wa sallama yaumal qiyaamati saa-iriin. Birahmatika yaa arhamar raahimiin.", id: 'Ya Allah, jadikanlah kami orang yang sempurna imannya, menunaikan yang fardhu, menjaga sholat, menunaikan zakat, mencari apa yang ada di sisi-Mu, mengharap ampunan-Mu, berpegang teguh pada petunjuk, berpaling dari perkara sia-sia, zuhud di dunia, cinta akhirat, rida dengan ketetapan, bersyukur atas nikmat, sabar atas musibah, dan berjalan di bawah panji Nabi Muhammad pada hari kiamat. Dengan rahmat-Mu, wahai Yang Maha Penyayang.', n: 'Doa yang masyhur diamalkan setelah tarawih (bukan hadis); bagian awalnya saja' },
    lailatul: { t: 'Doa Lailatul Qadar', ar: 'اللّٰهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي', la: "Allaahumma innaka 'afuwwun tuhibbul 'afwa fa'fu 'annii.", id: 'Ya Allah, sesungguhnya Engkau Maha Pemaaf dan menyukai maaf, maka maafkanlah aku.', n: 'Diajarkan Nabi kepada Aisyah; perbanyak pada 10 malam terakhir Ramadhan (HR. at-Tirmidzi)' },
    bilal: { t: 'Seruan Bilal Tarawih (tradisi)', ar: 'اَلصَّلَاةَ سُنَّةَ التَّرَاوِيحِ جَامِعَةً رَحِمَكُمُ اللّٰهُ', la: "Ash-shalaata sunnatat taraawiihi jaami'atan rahimakumullaah.", id: 'Marilah sholat sunnah tarawih berjamaah, semoga Allah merahmati kalian.', n: 'Jamaah menjawab dengan sholawat atau "Aamiin"; amalan tradisi, bukan rukun' },

    /* jenazah */
    jnzDoaL: { t: 'Doa Jenazah (Laki-laki) - Takbir ke-3', ar: 'اللّٰهُمَّ اغْفِرْ لَهُ وَارْحَمْهُ وَعَافِهِ وَاعْفُ عَنْهُ', la: "Allaahummaghfir lahu warhamhu wa 'aafihi wa'fu 'anh.", id: 'Ya Allah, ampunilah dia, rahmatilah dia, selamatkanlah dia, dan maafkanlah dia.' },
    jnzDoaP: { t: 'Doa Jenazah (Perempuan) - Takbir ke-3', ar: 'اللّٰهُمَّ اغْفِرْ لَهَا وَارْحَمْهَا وَعَافِهَا وَاعْفُ عَنْهَا', la: "Allaahummaghfir lahaa warhamhaa wa 'aafihaa wa'fu 'anhaa.", id: 'Ya Allah, ampunilah dia, rahmatilah dia, selamatkanlah dia, dan maafkanlah dia.', n: 'Jika jenazah lebih dari satu: "lahum ... hum"' },
    jnz4: { t: 'Doa Takbir ke-4', ar: 'اللّٰهُمَّ لَا تَحْرِمْنَا أَجْرَهُ وَلَا تَفْتِنَّا بَعْدَهُ وَاغْفِرْ لَنَا وَلَهُ', la: "Allaahumma laa tahrimnaa ajrahu wa laa taftinnaa ba'dahu waghfir lanaa wa lah.", id: 'Ya Allah, janganlah Engkau halangi kami dari pahalanya, jangan Engkau uji kami sepeninggalnya, dan ampunilah kami dan dia.' }
  };

  /* ====== NIAT ====== */
  const U = (ar, la, id) => ({ ar, la, id });
  const NIAT = {
    subuh: U('أُصَلِّي فَرْضَ الصُّبْحِ رَكْعَتَيْنِ مُسْتَقْبِلَ الْقِبْلَةِ أَدَاءً لِلّٰهِ تَعَالَى', "Ushallii fardhash shubhi rak'ataini mustaqbilal qiblati adaa-an lillaahi ta'aalaa", 'Aku niat sholat fardhu Subuh dua rakaat menghadap kiblat, tepat waktu, karena Allah Ta\'ala.'),
    zhuhur: U('أُصَلِّي فَرْضَ الظُّهْرِ أَرْبَعَ رَكَعَاتٍ مُسْتَقْبِلَ الْقِبْلَةِ أَدَاءً لِلّٰهِ تَعَالَى', "Ushallii fardhazh zhuhri arba'a raka'aatin mustaqbilal qiblati adaa-an lillaahi ta'aalaa", 'Aku niat sholat fardhu Zhuhur empat rakaat menghadap kiblat, tepat waktu, karena Allah Ta\'ala.'),
    ashar: U('أُصَلِّي فَرْضَ الْعَصْرِ أَرْبَعَ رَكَعَاتٍ مُسْتَقْبِلَ الْقِبْلَةِ أَدَاءً لِلّٰهِ تَعَالَى', "Ushallii fardhal 'ashri arba'a raka'aatin mustaqbilal qiblati adaa-an lillaahi ta'aalaa", 'Aku niat sholat fardhu Ashar empat rakaat menghadap kiblat, tepat waktu, karena Allah Ta\'ala.'),
    maghrib: U('أُصَلِّي فَرْضَ الْمَغْرِبِ ثَلَاثَ رَكَعَاتٍ مُسْتَقْبِلَ الْقِبْلَةِ أَدَاءً لِلّٰهِ تَعَالَى', "Ushallii fardhal maghribi tsalaatsa raka'aatin mustaqbilal qiblati adaa-an lillaahi ta'aalaa", 'Aku niat sholat fardhu Maghrib tiga rakaat menghadap kiblat, tepat waktu, karena Allah Ta\'ala.'),
    isya: U('أُصَلِّي فَرْضَ الْعِشَاءِ أَرْبَعَ رَكَعَاتٍ مُسْتَقْبِلَ الْقِبْلَةِ أَدَاءً لِلّٰهِ تَعَالَى', "Ushallii fardhal 'isyaa-i arba'a raka'aatin mustaqbilal qiblati adaa-an lillaahi ta'aalaa", 'Aku niat sholat fardhu Isya empat rakaat menghadap kiblat, tepat waktu, karena Allah Ta\'ala.'),
    jumat: U('أُصَلِّي فَرْضَ الْجُمُعَةِ رَكْعَتَيْنِ مُسْتَقْبِلَ الْقِبْلَةِ أَدَاءً لِلّٰهِ تَعَالَى', "Ushallii fardhal jumu'ati rak'ataini mustaqbilal qiblati adaa-an lillaahi ta'aalaa", 'Aku niat sholat fardhu Jumat dua rakaat menghadap kiblat, tepat waktu, karena Allah Ta\'ala.')
  };
  const S = (nmAr, nmLa, nmId, rakAr, rakLa, tail = ['', '']) => U(
    `أُصَلِّي سُنَّةَ ${nmAr} ${rakAr} ${tail[0]} مُسْتَقْبِلَ الْقِبْلَةِ لِلّٰهِ تَعَالَى`.replace(/ {2,}/g, ' '),
    `Ushallii sunnata${nmLa} ${rakLa} ${tail[1]} mustaqbilal qiblati lillaahi ta'aalaa`.replace(/ {2,}/g, ' '),
    `Aku niat sholat sunnah ${nmId}, menghadap kiblat, karena Allah Ta'ala.`);
  const QB = ['قَبْلِيَّةً', 'qabliyyatan'], BA = ['بَعْدِيَّةً', "ba'diyyatan"];

  /* ====== SHOLAT WAJIB ====== */
  const WAJIB = [
    { id: 'subuh', nama: 'Subuh', ar: 'الصُّبْح', rak: 2, waktu: 'Sejak terbit fajar shadiq hingga terbit matahari.', niat: NIAT.subuh, peta: '2 rakaat: tasyahud akhir di rakaat ke-2.', sun: 'Qabliyah 2 rakaat (muakkad, sangat dianjurkan).', extra: ['qunut'], cat: 'Pada rakaat kedua, setelah i\'tidal dibaca doa qunut (sunnah ab\'adh dalam mazhab Syafi\'i). Jika terlewat, disunnahkan sujud sahwi.' },
    { id: 'zhuhur', nama: 'Zhuhur', ar: 'الظُّهْر', rak: 4, waktu: 'Sejak matahari tergelincir ke barat hingga bayangan benda sama panjang dengan bendanya.', niat: NIAT.zhuhur, peta: '4 rakaat: tasyahud awal di rakaat ke-2, tasyahud akhir di rakaat ke-4.', sun: 'Qabliyah 2 + ba\'diyah 2 (muakkad); qabliyah 2 + ba\'diyah 2 tambahan (ghairu muakkad).', cat: 'Bacaan Al-Fatihah dan surat dibaca pelan (sirriyah). Rakaat ke-3 dan ke-4 cukup Al-Fatihah.' },
    { id: 'ashar', nama: 'Ashar', ar: 'الْعَصْر', rak: 4, waktu: 'Sejak bayangan benda melebihi panjangnya hingga matahari terbenam.', niat: NIAT.ashar, peta: '4 rakaat: tasyahud awal di rakaat ke-2, tasyahud akhir di rakaat ke-4.', sun: 'Qabliyah 4 rakaat (ghairu muakkad, 2 salam 2 salam).', cat: 'Bacaan dibaca pelan (sirriyah). Hindari menunda sampai menjelang matahari terbenam.' },
    { id: 'maghrib', nama: 'Maghrib', ar: 'الْمَغْرِب', rak: 3, waktu: 'Sejak matahari terbenam hingga hilangnya mega merah.', niat: NIAT.maghrib, peta: '3 rakaat: tasyahud awal di rakaat ke-2, tasyahud akhir di rakaat ke-3.', sun: 'Ba\'diyah 2 rakaat (muakkad); qabliyah 2 rakaat ringan (ghairu muakkad).', cat: 'Rakaat 1 dan 2 dibaca nyaring (jahriyah), rakaat ke-3 pelan dan hanya Al-Fatihah.' },
    { id: 'isya', nama: 'Isya', ar: 'الْعِشَاء', rak: 4, waktu: 'Sejak hilangnya mega merah hingga terbit fajar shadiq (waktu utama sampai sepertiga/pertengahan malam).', niat: NIAT.isya, peta: '4 rakaat: tasyahud awal di rakaat ke-2, tasyahud akhir di rakaat ke-4.', sun: 'Ba\'diyah 2 rakaat (muakkad), lalu Witir.', cat: 'Rakaat 1 dan 2 dibaca nyaring (jahriyah), rakaat 3 dan 4 pelan dan hanya Al-Fatihah.' },
    { id: 'jumat', nama: 'Jumat (pengganti Zhuhur)', ar: 'الْجُمُعَة', rak: 2, waktu: 'Waktu Zhuhur, didahului dua khutbah. Wajib bagi laki-laki muslim, baligh, mukim, sehat.', niat: NIAT.jumat, peta: '2 rakaat berjamaah, bacaan dinyaringkan; tasyahud akhir di rakaat ke-2.', sun: 'Qabliyah 2 rakaat dan ba\'diyah 2 atau 4 rakaat; mandi, memakai wewangian, bersegera ke masjid, memperbanyak sholawat, membaca Al-Kahfi.', cat: 'Sunnah membaca Al-A\'la & Al-Ghasyiyah, atau Al-Jumu\'ah & Al-Munafiqun di rakaat 1 dan 2.' }
  ];

  /* ====== SHOLAT SUNNAH ====== */
  const SUNNAH = [
    { grp: 'Rawatib (mengiringi sholat wajib)', items: [
      { id: 'qsubuh', nama: 'Qabliyah Subuh', rak: '2 rakaat', ket: 'Muakkad; paling utama. Dibaca ringan; sunnah membaca Al-Kafirun (rakaat 1) dan Al-Ikhlas (rakaat 2).', niat: S('الصُّبْحِ', "ush shubhi", 'Subuh sebelum', 'رَكْعَتَيْنِ', "rak'ataini", QB) },
      { id: 'qzhuhur', nama: 'Qabliyah Zhuhur', rak: '2 (atau 4) rakaat', ket: 'Muakkad 2 rakaat, boleh ditambah 2 rakaat lagi.', niat: S('الظُّهْرِ', 'zh zhuhri', 'Zhuhur sebelum', 'رَكْعَتَيْنِ', "rak'ataini", QB) },
      { id: 'bzhuhur', nama: "Ba'diyah Zhuhur", rak: '2 (atau 4) rakaat', ket: "Muakkad 2 rakaat, tambahan 2 rakaat ghairu muakkad.", niat: S('الظُّهْرِ', 'zh zhuhri', 'Zhuhur sesudah', 'رَكْعَتَيْنِ', "rak'ataini", BA) },
      { id: 'qashar', nama: 'Qabliyah Ashar', rak: '4 rakaat (2 salam, 2 salam)', ket: 'Ghairu muakkad, dianjurkan.', niat: S('الْعَصْرِ', "al 'ashri", 'Ashar sebelum', 'رَكْعَتَيْنِ', "rak'ataini", QB) },
      { id: 'qmaghrib', nama: 'Qabliyah Maghrib', rak: '2 rakaat', ket: 'Ghairu muakkad; dilakukan antara adzan dan iqamah.', niat: S('الْمَغْرِبِ', 'l maghribi', 'Maghrib sebelum', 'رَكْعَتَيْنِ', "rak'ataini", QB) },
      { id: 'bmaghrib', nama: "Ba'diyah Maghrib", rak: '2 rakaat', ket: 'Muakkad; sunnah membaca Al-Kafirun dan Al-Ikhlas.', niat: S('الْمَغْرِبِ', 'l maghribi', 'Maghrib sesudah', 'رَكْعَتَيْنِ', "rak'ataini", BA) },
      { id: 'bisya', nama: "Ba'diyah Isya", rak: '2 rakaat', ket: 'Muakkad.', niat: S('الْعِشَاءِ', "l 'isyaa-i", 'Isya sesudah', 'رَكْعَتَيْنِ', "rak'ataini", BA) }
    ] },
    { grp: 'Sholat malam', items: [
      { id: 'tahajud', nama: 'Tahajud', rak: '2 rakaat atau lebih (2-2)', ket: 'Dikerjakan setelah tidur di malam hari; waktu terbaik di sepertiga malam terakhir. Salam tiap 2 rakaat, tidak ada batas jumlah.', niat: S('التَّهَجُّدِ', "t tahajjudi", 'Tahajud', 'رَكْعَتَيْنِ', "rak'ataini") },
      { id: 'witir', nama: 'Witir', rak: '1, 3, 5, hingga 11 rakaat (ganjil)', ket: 'Penutup sholat malam. Boleh 1 rakaat; atau 3 rakaat (2 salam + 1 salam, lebih utama, atau 3 sekaligus dengan satu tasyahud akhir). Sunnah membaca Al-A\'la, Al-Kafirun, Al-Ikhlas (+Al-Falaq, An-Nas) pada witir 3 rakaat.', niat: U('أُصَلِّي سُنَّةً مِنَ الْوِتْرِ رَكْعَةً مُسْتَقْبِلَ الْقِبْلَةِ لِلّٰهِ تَعَالَى', "Ushallii sunnatan minal witri rak'atan mustaqbilal qiblati lillaahi ta'aalaa", 'Aku niat sholat sunnah witir satu rakaat menghadap kiblat karena Allah Ta\'ala. (Untuk 2 rakaat ganti "rak\'ataini"; untuk 3 rakaat "tsalaatsa raka\'aatin".)'), dz: ['witirDoa'] },
      { id: 'tarawih', nama: 'Tarawih', rak: '8 atau 20 rakaat + witir', ket: 'Sholat malam khusus Ramadhan, 2 rakaat satu salam, boleh berjamaah. Mazhab Syafi\'i: 20 rakaat; sebagian ulama dan ormas: 8 rakaat; keduanya diamalkan kaum muslimin.', niat: U('أُصَلِّي سُنَّةَ التَّرَاوِيحِ رَكْعَتَيْنِ مُسْتَقْبِلَ الْقِبْلَةِ لِلّٰهِ تَعَالَى', "Ushallii sunnatat taraawiihi rak'ataini mustaqbilal qiblati lillaahi ta'aalaa", 'Aku niat sholat sunnah tarawih dua rakaat menghadap kiblat karena Allah Ta\'ala. (Imam: tambah "imaaman"; makmum: "ma\'muuman".)'), dz: ['tarawihDzikir'] }
    ] },
    { grp: 'Sholat sunnah harian & sebab', items: [
      { id: 'dhuha', nama: 'Dhuha', rak: '2 hingga 8 (atau 12) rakaat', ket: 'Waktu: sekitar 15-20 menit setelah matahari terbit hingga menjelang Zhuhur. Salam tiap 2 rakaat. Sunnah membaca Asy-Syams dan Adh-Dhuha.', niat: S('الضُّحَى', 'dh dhuhaa', 'Dhuha', 'رَكْعَتَيْنِ', "rak'ataini") },
      { id: 'tahiyat', nama: 'Tahiyatul Masjid', rak: '2 rakaat', ket: 'Dikerjakan saat masuk masjid sebelum duduk. Jika iqamah sudah dikumandangkan, langsung ikut sholat berjamaah.', niat: S('تَحِيَّةِ الْمَسْجِدِ', 'tahiyyatil masjidi', 'Tahiyatul Masjid', 'رَكْعَتَيْنِ', "rak'ataini"), dz: ['masukMasjid', 'keluarMasjid'] },
      { id: 'wudhu', nama: 'Syukrul Wudhu', rak: '2 rakaat', ket: 'Setelah berwudhu, selama anggota wudhu belum kering/sebelum berhadas.', niat: S('الْوُضُوءِ', "l wudhuu-i", 'Wudhu', 'رَكْعَتَيْنِ', "rak'ataini") },
      { id: 'istikharah', nama: 'Istikharah', rak: '2 rakaat', ket: 'Ketika bimbang memilih urusan mubah (menikah, pekerjaan, pindah). Setelah salam membaca doa istikharah.', niat: S('الِاسْتِخَارَةِ', "l istikhaarati", 'Istikharah', 'رَكْعَتَيْنِ', "rak'ataini"), dz: ['istikharah'] },
      { id: 'hajat', nama: 'Hajat', rak: '2 rakaat (hingga 12)', ket: 'Ketika memiliki hajat kepada Allah; setelah salam berdoa dengan doa hajat.', niat: S('الْحَاجَةِ', "l haajati", 'Hajat', 'رَكْعَتَيْنِ', "rak'ataini"), dz: ['hajat'] },
      { id: 'taubat', nama: 'Taubat', rak: '2 rakaat', ket: 'Setelah berbuat dosa: berwudhu, sholat 2 rakaat, lalu memohon ampun dan berjanji tidak mengulang.', niat: S('التَّوْبَةِ', "t taubati", 'Taubat', 'رَكْعَتَيْنِ', "rak'ataini") },
      { id: 'awwabin', nama: 'Awwabin', rak: '2 hingga 6 rakaat', ket: 'Antara Maghrib dan Isya.', niat: S('الْأَوَّابِينَ', "l awwaabiina", 'Awwabin', 'رَكْعَتَيْنِ', "rak'ataini") }
    ] },
    { grp: 'Sholat sunnah pada momen khusus', items: [
      { id: 'idulfitri', nama: 'Idul Fitri', rak: '2 rakaat berjamaah', ket: "Takbir tambahan: 7 kali di rakaat 1 (setelah iftitah) dan 5 kali di rakaat 2 (sebelum ta'awudz); di antara takbir membaca \"Subhaanallaah wal hamdu lillaah wa laa ilaaha illallaah wallaahu akbar\". Dilanjutkan dua khutbah. Sunnah makan sebelum berangkat, mandi, berhias, dan bertakbir.", niat: U('أُصَلِّي سُنَّةً لِعِيدِ الْفِطْرِ رَكْعَتَيْنِ مُسْتَقْبِلَ الْقِبْلَةِ لِلّٰهِ تَعَالَى', "Ushallii sunnatan li 'iidil fithri rak'ataini mustaqbilal qiblati lillaahi ta'aalaa", 'Aku niat sholat sunnah Idul Fitri dua rakaat menghadap kiblat karena Allah Ta\'ala.') },
      { id: 'iduladha', nama: 'Idul Adha', rak: '2 rakaat berjamaah', ket: 'Sama seperti Idul Fitri (takbir 7 dan 5). Disunnahkan tidak makan dulu sampai selesai sholat; dilanjutkan penyembelihan kurban.', niat: U('أُصَلِّي سُنَّةً لِعِيدِ الْأَضْحَى رَكْعَتَيْنِ مُسْتَقْبِلَ الْقِبْلَةِ لِلّٰهِ تَعَالَى', "Ushallii sunnatan li 'iidil adh-haa rak'ataini mustaqbilal qiblati lillaahi ta'aalaa", 'Aku niat sholat sunnah Idul Adha dua rakaat menghadap kiblat karena Allah Ta\'ala.') },
      { id: 'kusuf', nama: 'Gerhana Matahari', rak: '2 rakaat (tiap rakaat 2 ruku\' dan 2 kali baca Fatihah)', ket: 'Dikerjakan berjamaah, bacaan pelan (siang), diikuti khutbah dan perbanyak dzikir, sedekah, dan istighfar.', niat: S('الْكُسُوفِ', "l kusuufi", 'Gerhana Matahari', 'رَكْعَتَيْنِ', "rak'ataini") },
      { id: 'khusuf', nama: 'Gerhana Bulan', rak: '2 rakaat (sama seperti gerhana matahari)', ket: 'Bacaan dinyaringkan (malam).', niat: S('الْخُسُوفِ', "l khusuufi", 'Gerhana Bulan', 'رَكْعَتَيْنِ', "rak'ataini") },
      { id: 'istisqa', nama: "Istisqa' (minta hujan)", rak: '2 rakaat berjamaah', ket: 'Dikerjakan di lapangan saat kemarau panjang, diikuti khutbah dan doa memohon hujan.', niat: S('الِاسْتِسْقَاءِ', "l istisqaa-i", 'Istisqa', 'رَكْعَتَيْنِ', "rak'ataini") }
    ] }
  ];

  /* ====== SECTIONS KONTEN ====== */
  const TABS = [
    ['jadwal', 'Jadwal'], ['dasar', 'Dasar'], ['wajib', 'Wajib'], ['jamak', 'Jamak Qashar'], ['tarawih', 'Tarawih & Witir'], ['tata', 'Tata Cara'], ['sunnah', 'Sunnah'], ['jenazah', 'Jenazah'], ['dzikir', 'Dzikir'], ['lain', 'Lainnya']
  ];

  const LNK = (n, a, t) => `<a class="btn" href="#/surah/${n}${a ? '?a=' + a : ''}">${esc(t)}</a>`;
  const SURAT = [['1', 'Al-Fatihah'], ['112', 'Al-Ikhlas'], ['113', 'Al-Falaq'], ['114', 'An-Nas'], ['108', 'Al-Kautsar'], ['103', "Al-'Ashr"], ['110', 'An-Nashr'], ['109', 'Al-Kafirun'], ['105', 'Al-Fil'], ['107', "Al-Ma'un"], ['106', 'Quraisy'], ['111', 'Al-Lahab']];

  const dua = k => {
    const x = D[k]; if (!x) return '';
    return `<div class="sh-dua"><div class="sh-dh"><b>${esc(x.t)}</b>${x.n ? `<span class="sh-note">${esc(x.n)}</span>` : ''}</div>
      <p class="sh-ar" lang="ar" dir="rtl">${x.ar}</p><p class="sh-la">${esc(x.la)}</p><p class="sh-id">${esc(x.id)}</p></div>`;
  };
  const niatBox = (n, jud) => `<div class="sh-dua sh-niat"><div class="sh-dh"><b>${jud || 'Niat'}</b><span class="sh-note">Dibaca dalam hati bersama takbiratul ihram; melafalkannya sunnah</span></div>
      <p class="sh-ar" lang="ar" dir="rtl">${n.ar}</p><p class="sh-la">${esc(n.la)}</p><p class="sh-id">${esc(n.id)}</p></div>`;
  const det = (id, title, sub, body, open) => `<details class="card sh-item" id="${id}" ${open ? 'open' : ''}><summary><span><b>${esc(title)}</b>${sub ? `<small class="muted">${esc(sub)}</small>` : ''}</span></summary><div class="sh-body">${body}</div></details>`;
  const ol = a => `<ol class="sh-ol">${a.map(x => `<li>${x}</li>`).join('')}</ol>`;
  const ul = a => `<ul class="sh-ul">${a.map(x => `<li>${x}</li>`).join('')}</ul>`;
  const hint = t => `<p class="sh-tip">${t}</p>`;

  /* --- Dasar: wudhu, tayamum, adzan, syarat, rukun --- */
  const adzanLines = [
    ['اللّٰهُ أَكْبَرُ اللّٰهُ أَكْبَرُ', "Allaahu akbar, Allaahu akbar", '2x'],
    ['أَشْهَدُ أَنْ لَا إِلٰهَ إِلَّا اللّٰهُ', "Asyhadu allaa ilaaha illallaah", '2x'],
    ['أَشْهَدُ أَنَّ مُحَمَّدًا رَسُولُ اللّٰهِ', "Asyhadu anna muhammadar rasuulullaah", '2x'],
    ['حَيَّ عَلَى الصَّلَاةِ', "Hayya 'alash shalaah", '2x'],
    ['حَيَّ عَلَى الْفَلَاحِ', "Hayya 'alal falaah", '2x'],
    ['الصَّلَاةُ خَيْرٌ مِنَ النَّوْمِ', "Ash-shalaatu khairum minan nauum", '2x, khusus Subuh'],
    ['اللّٰهُ أَكْبَرُ اللّٰهُ أَكْبَرُ', "Allaahu akbar, Allaahu akbar", '2x'],
    ['لَا إِلٰهَ إِلَّا اللّٰهُ', "Laa ilaaha illallaah", '1x']
  ];
  const iqamahLines = [
    ['اللّٰهُ أَكْبَرُ اللّٰهُ أَكْبَرُ', 'Allaahu akbar, Allaahu akbar'],
    ['أَشْهَدُ أَنْ لَا إِلٰهَ إِلَّا اللّٰهُ', 'Asyhadu allaa ilaaha illallaah'],
    ['أَشْهَدُ أَنَّ مُحَمَّدًا رَسُولُ اللّٰهِ', 'Asyhadu anna muhammadar rasuulullaah'],
    ['حَيَّ عَلَى الصَّلَاةِ', "Hayya 'alash shalaah"],
    ['حَيَّ عَلَى الْفَلَاحِ', "Hayya 'alal falaah"],
    ['قَدْ قَامَتِ الصَّلَاةُ قَدْ قَامَتِ الصَّلَاةُ', 'Qad qaamatish shalaah, qad qaamatish shalaah'],
    ['اللّٰهُ أَكْبَرُ اللّٰهُ أَكْبَرُ', 'Allaahu akbar, Allaahu akbar'],
    ['لَا إِلٰهَ إِلَّا اللّٰهُ', 'Laa ilaaha illallaah']
  ];
  const lines = (a, c) => `<div class="sh-lines">${a.map(([ar, la, n]) => `<div class="sh-line"><p class="sh-ar" lang="ar" dir="rtl">${ar}</p><p class="sh-la">${esc(la)}${n ? ` <span class="sh-badge">${esc(n)}</span>` : ''}</p></div>`).join('')}</div>`;

  function tabDasar() {
    return [
      det('wudhu', 'Tata Cara Wudhu', 'Rukun, sunnah, dan pembatal', niatBox(D.wudhuNiat, 'Niat Wudhu') +
        `<h4>Urutan wudhu</h4>` + ol([
          'Membaca <b>basmalah</b> (<i>Bismillaah</i>) dan mencuci kedua telapak tangan 3x.',
          'Berkumur 3x dan memasukkan air ke hidung lalu mengeluarkannya (istinsyaq) 3x.',
          '<b>Niat</b> dalam hati lalu <b>membasuh wajah</b> 3x (dari tempat tumbuh rambut kepala hingga dagu, telinga ke telinga).',
          '<b>Membasuh kedua tangan hingga siku</b> 3x, dahulukan yang kanan.',
          '<b>Mengusap kepala</b> (minimal sebagian, sunnah seluruh kepala) 3x, lalu mengusap kedua telinga.',
          '<b>Membasuh kedua kaki hingga mata kaki</b> 3x, dahulukan yang kanan; sela-sela jari dibersihkan.',
          '<b>Tertib</b>: dilakukan berurutan sesuai langkah di atas.',
          'Membaca doa setelah wudhu.'
        ]) + `<div class="sh-chips"><span class="sh-badge">6 rukun wudhu: niat, wajah, tangan, usap kepala, kaki, tertib</span></div>` + dua('wudhuDoa') +
        `<h4>Yang membatalkan wudhu</h4>` + ul([
          'Keluar sesuatu dari kemaluan atau dubur (buang air, buang angin, mazi, wadi, dll.).',
          'Tidur nyenyak dengan posisi tidak tetap di tempatnya.',
          'Hilang akal (pingsan, mabuk, gila).',
          'Bersentuhan kulit laki-laki dan perempuan yang bukan mahram tanpa penghalang (mazhab Syafi\'i).',
          'Menyentuh kemaluan sendiri atau orang lain dengan telapak tangan atau bagian dalam jari.'
        ])),
      det('tayamum', 'Tayamum', 'Pengganti wudhu/mandi', niatBox(D.tayamumNiat, 'Niat Tayamum') + `<p>Dilakukan bila tidak ada air, air tidak cukup, atau sakit yang dikhawatirkan bertambah parah jika terkena air.</p>` + ol([
        'Pastikan waktu sholat sudah masuk dan telah berusaha mencari air.',
        'Siapkan debu/tanah suci (boleh pada tembok, batu berdebu, atau benda berdebu suci).',
        'Niat, lalu menepukkan kedua telapak tangan ke debu dan <b>mengusap wajah</b>.',
        'Menepukkan lagi kedua telapak tangan ke debu dan <b>mengusap kedua tangan hingga siku</b>.',
        'Tertib; satu tayamum untuk satu sholat fardhu (boleh dengan sholat sunnah sesudahnya).'
      ])),
      det('adzan', 'Adzan & Iqamah', 'Panggilan sholat', `<h4>Adzan</h4>` + lines(adzanLines) + `<h4>Iqamah</h4>` + lines(iqamahLines) + `<h4>Yang menjawab adzan</h4><p>Ulangi kalimat muadzin; pada <i>hayya 'alash shalaah</i> dan <i>hayya 'alal falaah</i> jawab <b>Laa haula wa laa quwwata illaa billaah</b>. Setelah adzan, sholawat lalu doa berikut.</p>` + dua('adzanDoa')),
      det('syarat', 'Syarat & Rukun Sholat', 'Agar sholat sah', `<h4>Syarat sah sholat</h4>` + ul([
        'Islam, berakal, dan tamyiz (mumayyiz).',
        'Suci dari hadas kecil dan besar, serta suci badan, pakaian, dan tempat dari najis.',
        'Menutup aurat (laki-laki: pusar sampai lutut; perempuan: seluruh tubuh kecuali wajah dan telapak tangan).',
        'Masuk waktu sholat.',
        'Menghadap kiblat.'
      ]) + `<h4>13 rukun sholat (mazhab Syafi'i)</h4>` + ol([
        'Niat.', 'Takbiratul ihram.', 'Berdiri bagi yang mampu pada sholat fardhu.', 'Membaca Al-Fatihah.', "Ruku' dengan thuma'ninah.", "I'tidal dengan thuma'ninah.", "Sujud dua kali dengan thuma'ninah.", "Duduk di antara dua sujud dengan thuma'ninah.", 'Duduk tasyahud akhir.', 'Membaca tasyahud akhir.', 'Membaca sholawat kepada Nabi pada tasyahud akhir.', 'Salam pertama.', 'Tertib (berurutan sesuai rukun di atas).'
      ]) +
        hint('Thuma\'ninah: diam sejenak (kira-kira selama membaca "subhanallah") di setiap gerakan.') +
        `<h4>Pembatal sholat</h4>` + ul([
        'Berhadas atau terkena najis yang tidak segera hilang.', 'Berbicara dengan sengaja atau tertawa terbahak.', 'Banyak bergerak tanpa keperluan (3 gerakan berturut-turut).', 'Makan atau minum.', 'Membelakangi kiblat.', 'Aurat terbuka dan tidak segera ditutup.', 'Murtad atau niat memutus sholat.'
      ])),
      det('sahwi', 'Sujud Sahwi', 'Bila lupa dalam sholat', `<p>Dilakukan bila lupa meninggalkan sunnah ab'adh (misalnya tasyahud awal atau qunut Subuh) atau ragu jumlah rakaat. Dilakukan <b>sebelum salam</b>: dua kali sujud dengan duduk di antaranya, lalu tasyahud dan salam.</p>` + dua('sujudSahwi') + hint('Jika lupa rukun, harus diulang rukunnya, bukan cukup sujud sahwi.')),
      det('tilawah', 'Sujud Tilawah & Sujud Syukur', 'Sujud di luar sholat', `<p><b>Sujud tilawah</b> dikerjakan ketika membaca atau mendengar ayat sajdah: takbir, sujud sekali dengan bacaan berikut, lalu salam bila di luar sholat. <b>Sujud syukur</b> dilakukan saat mendapat nikmat atau terhindar dari musibah, dengan sujud sekali dan memuji Allah.</p>` + dua('sujudTilawah') + `<p><a class="btn" href="#/surah/32?a=15">Contoh ayat sajdah: As-Sajdah 15</a></p>`)
    ].join('');
  }

  function tabWajib() {
    const w = WAJIB.map(s => det('w-' + s.id, `Sholat ${s.nama}`, `${s.rak} rakaat`,
      `<p class="sh-peta"><b>${s.rak} rakaat</b> · ${esc(s.peta)}</p>` +
      `<p><b>Waktu:</b> ${esc(s.waktu)}</p>` + niatBox(s.niat, 'Niat (sholat sendiri/munfarid)') +
      `<p class="sh-id">Imam: tambahkan <b>إِمَامًا</b> (<i>imaaman</i>) sebelum <i>lillaahi</i>; makmum: <b>مَأْمُومًا</b> (<i>ma'muuman</i>).</p>` +
      `<p><b>Catatan:</b> ${esc(s.cat)}</p><p><b>Sunnah rawatib:</b> ${esc(s.sun)}</p>` +
      (s.extra ? s.extra.map(dua).join('') : '') +
      `<p><a class="btn primary" href="#/sholat/tata">Lihat urutan bacaan lengkap</a></p>`)).join('');
    return `<p class="muted small">Pilih sholat untuk melihat niat, waktu, jumlah rakaat, dan catatannya. Urutan gerakan dan bacaan ada di tab <b>Tata Cara</b>.</p>` + w +
      `<p class="card" style="margin-top:12px">Sedang bepergian? Lihat tab <a href="#/sholat/jamak" style="text-decoration:underline"><b>Jamak Qashar</b></a> untuk syarat, niat, dan urutan sholat musafir.</p>`;
  }


  /* ====== JAMAK & QASHAR ====== */
  const PR = {
    Z: { ar: 'الظُّهْرِ', la: 'zhuhri', id: 'Zhuhur', n: 4, nomAr: 'الظُّهْرُ', nomLa: 'zhuhru' },
    A: { ar: 'الْعَصْرِ', la: "'ashri", id: 'Ashar', n: 4, nomAr: 'الْعَصْرُ', nomLa: "'ashru" },
    M: { ar: 'الْمَغْرِبِ', la: 'maghribi', id: 'Maghrib', n: 3, nomAr: 'الْمَغْرِبُ', nomLa: 'maghribu' },
    I: { ar: 'الْعِشَاءِ', la: "'isyaa-i", id: 'Isya', n: 4, nomAr: 'الْعِشَاءُ', nomLa: "'isyaa-u" }
  };
  const RAK = { 2: ['رَكْعَتَيْنِ', "rak'ataini", 'dua'], 3: ['ثَلَاثَ رَكَعَاتٍ', "tsalaatsa raka'aatin", 'tiga'], 4: ['أَرْبَعَ رَكَعَاتٍ', "arba'a raka'aatin", 'empat'] };
  /* kata "fardhal/fardhazh" mengikuti huruf awal nama sholat (idgham syamsiyah dalam latin) */
  const FARD = { Z: 'fardhazh zhuhri', A: "fardhal 'ashri", M: 'fardhal maghribi', I: "fardhal 'isyaa-i" };
  const niatJQ = (k, { qashar = false, mode = null, partner = null } = {}) => {
    const p = PR[k], q = partner ? PR[partner] : null, rk = RAK[qashar ? 2 : p.n];
    const first = mode && (k === 'Z' || k === 'M');           // sholat pertama dalam pasangan
    let ar = `أُصَلِّي فَرْضَ ${p.ar} ${rk[0]}`, la = `Ushallii ${FARD[k]} ${rk[1]}`;
    let idn = `Aku niat sholat fardhu ${p.id} ${rk[2]} rakaat`;
    if (qashar) { ar += ' قَصْرًا'; la += ' qashran'; idn += ' secara qashar'; }
    if (mode) {
      const md = mode === 'taqdim' ? ['جَمْعَ تَقْدِيمٍ', "jam'a taqdiimin", "jama' taqdim"] : ['جَمْعَ تَأْخِيرٍ', "jam'a ta'khiirin", "jama' ta'khir"];
      if (first) { ar += ` مَجْمُوعًا إِلَيْهِ ${q.nomAr}`; la += ` majmuu'an ilaihil ${q.nomLa}`; idn += `, dijama' dengan ${q.id}`; }
      else { ar += ` مَجْمُوعًا إِلَى ${q.ar}`; la += ` majmuu'an ila${q.la.startsWith('zh') ? 'zh' : 'l'} ${q.la}`; idn += `, dijama' dengan ${q.id}`; }
      ar += ` ${md[0]}`; la += ` ${md[1]}`; idn += ` secara ${md[2]}`;
    }
    ar += ' مُسْتَقْبِلَ الْقِبْلَةِ أَدَاءً لِلّٰهِ تَعَالَى'; la += " mustaqbilal qiblati adaa-an lillaahi ta'aalaa"; idn += ", menghadap kiblat, tepat waktu, karena Allah Ta'ala.";
    return U(ar, la, idn);
  };
  const cardsNiat = arr => arr.map(([t, n]) => niatBox(n, t)).join('');

  function tabJamak() {
    const qOnly = ['Z', 'A', 'I'].map(k => [`Qashar ${PR[k].id} (2 rakaat)`, niatJQ(k, { qashar: true })]);
    const tqOnly = [['Z', 'A'], ['A', 'Z'], ['M', 'I'], ['I', 'M']].map(([k, p]) => [`${PR[k].id} (jama' taqdim, ${PR[k].n} rakaat)`, niatJQ(k, { mode: 'taqdim', partner: p })]);
    const tqQ = [['Z', 'A'], ['A', 'Z'], ['I', 'M']].map(([k, p]) => [`${PR[k].id} (jama' taqdim + qashar)`, niatJQ(k, { mode: 'taqdim', qashar: true, partner: p })]);
    const tkOnly = [['Z', 'A'], ['A', 'Z'], ['M', 'I'], ['I', 'M']].map(([k, p]) => [`${PR[k].id} (jama' ta'khir, ${PR[k].n} rakaat)`, niatJQ(k, { mode: 'takhir', partner: p })]);
    const tkQ = [['Z', 'A'], ['A', 'Z'], ['I', 'M']].map(([k, p]) => [`${PR[k].id} (jama' ta'khir + qashar)`, niatJQ(k, { mode: 'takhir', qashar: true, partner: p })]);
    const mq = `<p class="sh-id">Catatan: Maghrib tetap <b>3 rakaat</b> dan Subuh tetap <b>2 rakaat</b> (tidak diqashar). Maghrib hanya bisa dijama' dengan Isya.</p>`;
    return `<p class="muted small">Keringanan (rukhshah) bagi musafir. <b>Qashar</b> meringkas sholat 4 rakaat menjadi 2 rakaat. <b>Jama'</b> menggabung dua sholat dalam satu waktu. Keduanya boleh dipakai sendiri-sendiri atau digabung.</p>` +
      det('jq-ringkas', 'Ringkasan Cepat', 'Pilih sesuai kebutuhan', `<table class="sh-table"><thead><tr><th>Sholat</th><th>Biasa</th><th>Qashar</th><th>Bisa dijama' dengan</th></tr></thead><tbody>
        <tr><td>Subuh</td><td>2</td><td>-</td><td>Tidak bisa</td></tr>
        <tr><td>Zhuhur</td><td>4</td><td>2</td><td>Ashar</td></tr>
        <tr><td>Ashar</td><td>4</td><td>2</td><td>Zhuhur</td></tr>
        <tr><td>Maghrib</td><td>3</td><td>-</td><td>Isya</td></tr>
        <tr><td>Isya</td><td>4</td><td>2</td><td>Maghrib</td></tr></tbody></table>` +
        ul(["<b>Jama' taqdim</b>: dikerjakan di waktu sholat pertama (Zhuhur atau Maghrib).", "<b>Jama' ta'khir</b>: dikerjakan di waktu sholat kedua (Ashar atau Isya).", 'Boleh qashar tanpa jama\', jama\' tanpa qashar, atau keduanya.']), true) +
      det('jq-syarat', 'Syarat & Ketentuan', "Menurut mazhab Syafi'i", `<h4>Syarat qashar</h4>` + ul([
        'Perjalanan <b>mubah</b> (bukan untuk maksiat), dengan jarak minimal sekitar <b>81 km</b> (dua marhalah; sebagian ulama memakai ±89 km).',
        "Sholat yang diqashar adalah sholat <b>4 rakaat</b> (Zhuhur, Ashar, Isya), baik tunai maupun qadha yang terlewat saat safar.",
        '<b>Niat qashar</b> saat takbiratul ihram.',
        'Sudah <b>keluar dari batas wilayah</b> tempat tinggal (batas desa/kota) saat sholat dimulai.',
        'Tidak makmum kepada imam yang <b>mukim</b> atau yang sholatnya tidak diketahui; bila makmum kepada imam mukim, wajib sempurna 4 rakaat.',
        'Mengetahui bolehnya qashar dan tetap safar sampai sholat selesai.'
      ]) + `<h4>Syarat jama' taqdim</h4>` + ul([
        '<b>Tertib</b>: sholat pertama (Zhuhur/Maghrib) dahulu, baru yang kedua.',
        "<b>Niat jama'</b> pada sholat pertama (boleh sejak takbiratul ihram hingga sebelum salam).",
        '<b>Muwalat</b>: sholat kedua segera dilakukan tanpa jeda lama (cukup iqamah, wudhu cepat bila perlu).',
        'Masih dalam perjalanan sampai sholat kedua dimulai.'
      ]) + `<h4>Syarat jama' ta'khir</h4>` + ul([
        "<b>Niat ta'khir</b> di waktu sholat pertama (misalnya: aku tunda Zhuhur ke waktu Ashar), selama waktu masih cukup untuk sholat; bila tidak berniat dan waktu habis, sholat itu menjadi qadha dan berdosa.",
        'Masih dalam perjalanan hingga kedua sholat selesai.',
        'Tidak wajib tertib dan muwalat, tetapi lebih utama berurutan.'
      ]) + `<h4>Lama bepergian</h4>` + ul([
        "Boleh qashar-jamak selama bepergian; bila singgah di satu tempat <b>lebih dari 3 hari</b> (tidak termasuk hari tiba dan hari berangkat), wajib sholat penuh.",
        'Jika tertahan karena suatu keperluan dan tidak tahu kapan selesai, boleh qashar hingga 18 hari.',
        "Sebab jama' lainnya (sakit parah, hujan lebat, takut): tanyakan kepada ulama setempat; mazhab Syafi'i membolehkan jama' taqdim saat hujan lebat bagi yang berjamaah di masjid."
      ])) +
      det('jq-qashar', 'Niat Qashar Saja', 'Tanpa digabung', cardsNiat(qOnly) + mq + hint('Bacaan dan gerakan sama seperti sholat dua rakaat: tasyahud akhir di rakaat ke-2 lalu salam.'), true) +
      det('jq-taqdim', "Jama' Taqdim", 'Digabung di waktu pertama', `<p>Contoh: Zhuhur + Ashar dikerjakan di waktu Zhuhur; Maghrib + Isya di waktu Maghrib.</p>` + ol([
        'Masuk waktu sholat pertama. Adzan dan iqamah.',
        "Niat sholat pertama <b>beserta niat jama' taqdim</b> (dan qashar bila diqashar), lalu kerjakan seperti biasa dan salam.",
        'Segera iqamah, niat sholat kedua, lalu kerjakan tanpa jeda lama.',
        'Sunnah rawatib boleh ditinggalkan; bila ingin dikerjakan, lakukan setelah kedua sholat.'
      ]) + `<h4>Jama' taqdim saja (tanpa qashar)</h4>` + cardsNiat(tqOnly) + `<h4>Jama' taqdim + qashar</h4>` + cardsNiat(tqQ) + mq) +
      det('jq-takhir', "Jama' Ta'khir", 'Digabung di waktu kedua', `<p>Contoh: Zhuhur + Ashar dikerjakan di waktu Ashar; Maghrib + Isya di waktu Isya.</p>` + ol([
        "Di waktu sholat pertama, <b>berniat dalam hati</b> bahwa sholat itu akan ditunda dan dijama' di waktu kedua (lafaz: <i>Nawaitu ta'khiiraz zhuhri ilaa waqtil 'ashri</i>).",
        'Saat masuk waktu kedua, iqamah lalu kerjakan sholat pertama dengan niat jama\' ta\'khir (dan qashar bila diqashar), lalu salam.',
        'Iqamah lagi dan kerjakan sholat kedua. Bila berurutan, lebih utama.'
      ]) + `<h4>Jama' ta'khir saja (tanpa qashar)</h4>` + cardsNiat(tkOnly) + `<h4>Jama' ta'khir + qashar</h4>` + cardsNiat(tkQ) + mq) +
      det('jq-contoh', 'Contoh Pelaksanaan', 'Zhuhur + Ashar, jama\' taqdim qashar', ol([
        'Tiba waktu Zhuhur. Adzan dan iqamah.',
        'Niat: <i>Ushallii fardhazh zhuhri rak\'ataini qashran majmuu\'an ilaihil \'ashru jam\'a taqdiimin lillaahi ta\'aalaa</i>, lalu takbiratul ihram.',
        'Sholat 2 rakaat sampai salam.',
        'Segera iqamah. Niat: <i>Ushallii fardhal \'ashri rak\'ataini qashran majmuu\'an ilazh zhuhri jam\'a taqdiimin lillaahi ta\'aalaa</i>.',
        'Sholat 2 rakaat sampai salam, lalu dzikir dan doa seperti biasa.'
      ]) + `<p><a class="btn" href="#/sholat/tata">Urutan bacaan sholat</a> <a class="btn" href="#/sholat/dzikir">Dzikir setelah sholat</a></p>`) +
      det('jq-catatan', 'Catatan Penting', '', `<p class="muted small">Ketentuan jarak, lama safar, dan sebab jama' berbeda antar mazhab dan ormas (ada yang membolehkan jama' tanpa qashar dalam kondisi hajat). Uraian ini mengikuti mazhab Syafi'i. Untuk perjalanan khusus, tanyakan kepada ustaz setempat.</p>`);
  }

  /* ====== TARAWIH & WITIR ====== */
  const ROLE = { sendiri: ['', '', 'sendiri'], imam: [' إِمَامًا', ' imaaman', 'sebagai imam'], makmum: [' مَأْمُومًا', " ma'muuman", 'sebagai makmum'] };
  const niatTar = r => U(`أُصَلِّي سُنَّةَ التَّرَاوِيحِ رَكْعَتَيْنِ مُسْتَقْبِلَ الْقِبْلَةِ${ROLE[r][0]} لِلّٰهِ تَعَالَى`, `Ushallii sunnatat taraawiihi rak'ataini mustaqbilal qiblati${ROLE[r][1]} lillaahi ta'aalaa`, `Aku niat sholat sunnah tarawih dua rakaat ${ROLE[r][2]}, menghadap kiblat, karena Allah Ta'ala.`);
  const WR = { 1: ['رَكْعَةً', "rak'atan", 'satu'], 2: ['رَكْعَتَيْنِ', "rak'ataini", 'dua'], 3: ['ثَلَاثَ رَكَعَاتٍ', "tsalaatsa raka'aatin", 'tiga'] };
  const niatWit = (n, r) => U(`أُصَلِّي سُنَّةً مِنَ الْوِتْرِ ${WR[n][0]} مُسْتَقْبِلَ الْقِبْلَةِ${ROLE[r][0]} لِلّٰهِ تَعَالَى`, `Ushallii sunnatan minal witri ${WR[n][1]} mustaqbilal qiblati${ROLE[r][1]} lillaahi ta'aalaa`, `Aku niat sholat sunnah witir ${WR[n][2]} rakaat ${ROLE[r][2]}, menghadap kiblat, karena Allah Ta'ala.`);

  function tabTarawih() {
    const surat = `<div class="btn-row sh-surat">${[['87', "Al-A'la"], ['109', 'Al-Kafirun'], ['112', 'Al-Ikhlas'], ['113', 'Al-Falaq'], ['114', 'An-Nas'], ['102', 'At-Takatsur'], ['103', "Al-'Ashr"], ['108', 'Al-Kautsar']].map(([n, t]) => LNK(n, 0, t)).join('')}</div>`;
    const tarNiat = ['sendiri', 'imam', 'makmum'].map(r => [`Niat Tarawih (${ROLE[r][2]})`, niatTar(r)]);
    const witNiat = [[1, 'sendiri'], [1, 'imam'], [1, 'makmum'], [2, 'sendiri'], [2, 'imam'], [2, 'makmum'], [3, 'sendiri'], [3, 'imam'], [3, 'makmum']].map(([n, r]) => [`Niat Witir ${n} rakaat (${ROLE[r][2]})`, niatWit(n, r)]);
    return `<p class="muted small">Tarawih adalah sholat sunnah malam di bulan Ramadhan, dikerjakan setelah Isya. Witir menutup sholat malam dengan jumlah rakaat ganjil.</p>` +
      det('tw-ringkas', 'Ringkasan & Keutamaan', 'Hukum, waktu, jumlah rakaat', `<p>Hukumnya <b>sunnah muakkad</b>. Nabi bersabda: barang siapa menghidupkan malam Ramadhan dengan iman dan mengharap pahala, diampuni dosanya yang telah lalu (HR. al-Bukhari dan Muslim).</p>` + ul([
        '<b>Waktu tarawih</b>: setelah sholat Isya hingga terbit fajar; paling utama setelah Isya dan sebelum witir.',
        '<b>Jumlah rakaat</b>: 20 rakaat (10 salam) menurut mazhab Syafi\'i, 8 rakaat (4 salam), atau 12 rakaat (6 salam) seperti yang diamalkan sebagian jamaah; semuanya dalam wilayah khilafiyah.',
        '<b>Salam setiap 2 rakaat</b>.',
        '<b>Witir</b>: 1, 3, 5, hingga 11 rakaat; paling sedikit 1 rakaat.'
      ]) + `<table class="sh-table"><thead><tr><th>Pola</th><th>Tarawih</th><th>Witir</th><th>Total</th></tr></thead><tbody>
        <tr><td>Pola 23</td><td>20</td><td>3</td><td>23</td></tr><tr><td>Pola 11</td><td>8</td><td>3</td><td>11</td></tr><tr><td>Pola 21</td><td>20</td><td>1</td><td>21</td></tr><tr><td>Pola 15</td><td>12</td><td>3</td><td>15</td></tr><tr><td>Pola 13</td><td>12</td><td>1</td><td>13</td></tr></tbody></table>`, true) +
      det('tw-12', 'Tarawih 12 Rakaat', '6 salam, 3 kali istirahat', `<p class="sh-tip">Tidak ada hadis yang menyebut angka 12 secara khusus. Pola ini diambil dari prinsip bahwa sholat malam dikerjakan dua rakaat dua rakaat tanpa batas jumlah (HR. al-Bukhari dan Muslim), sehingga sebagian jamaah memilih 12 rakaat sebagai jalan tengah antara 8 dan 20. Tanyakan kepada ustaz setempat bila masjidmu memakai pola tertentu.</p>` +
        `<h4>Pembagian</h4>` + `<table class="sh-table"><thead><tr><th>Tarwihah</th><th>Rakaat</th><th>Salam</th></tr></thead><tbody>
          <tr><td>Ke-1</td><td>1-4</td><td>2 kali</td></tr><tr><td>Ke-2</td><td>5-8</td><td>2 kali</td></tr><tr><td>Ke-3</td><td>9-12</td><td>2 kali</td></tr><tr><td>Witir</td><td>3 (atau 1)</td><td>2+1</td></tr></tbody></table>` +
        ol([
          'Sholat Isya berjamaah dan ba\'diyah Isya.',
          'Niat tarawih <b>dua rakaat</b> (lihat bagian Niat Tarawih), lalu sholat dua rakaat dan salam. Ulangi niat untuk setiap dua rakaat.',
          'Setelah <b>4 rakaat</b> (dua salam), istirahat sejenak: baca dzikir sela tarawih dan sholawat.',
          'Lanjutkan 4 rakaat kedua, istirahat dengan dzikir yang sama.',
          'Lanjutkan 4 rakaat ketiga (total 12 rakaat), lalu istirahat.',
          'Tutup dengan <b>witir 3 rakaat</b> (2 salam + 1 salam) atau 1 rakaat, lalu dzikir dan doa setelah witir.'
        ]) + dua('tarawihDzikir') + `<h4>Rencana surat 12 rakaat (opsional)</h4><p class="muted small">Setelah Al-Fatihah, satu surat pendek tiap rakaat. Ketuk untuk membuka suratnya.</p>` +
        `<div class="sh-table-wrap"><table class="sh-table"><thead><tr><th>Rakaat</th><th>Surat</th></tr></thead><tbody>${[['102', 'At-Takatsur'], ['103', "Al-'Ashr"], ['104', 'Al-Humazah'], ['105', 'Al-Fil'], ['106', 'Quraisy'], ['107', "Al-Ma'un"], ['108', 'Al-Kautsar'], ['110', 'An-Nashr'], ['111', 'Al-Lahab'], ['112', 'Al-Ikhlas'], ['113', 'Al-Falaq'], ['114', 'An-Nas']].map(([n, t], i) => `<tr><td>${i + 1}</td><td><a href="#/surah/${n}" style="text-decoration:underline">${t}</a></td></tr>`).join('')}</tbody></table></div>` +
        `<p class="sh-id">Witir: rakaat 1 Al-A'la, rakaat 2 Al-Kafirun, rakaat 3 Al-Ikhlas (+ Al-Falaq dan An-Nas).</p>` +
        `<p><a class="btn primary" href="#/sholat/tarawih">Niat tarawih dan witir</a></p>`) +
      det('tw-tata', 'Tata Cara Tarawih', 'Dua rakaat, salam', `<p>Sama seperti sholat dua rakaat (lihat <a href="#/sholat/tata" style="text-decoration:underline">Tata Cara</a>). Tidak ada adzan atau iqamah khusus.</p>` + ol([
        'Sholat Isya berjamaah dan ba\'diyah Isya.',
        'Seruan bilal (di sebagian tempat), lalu niat dan takbiratul ihram.',
        'Rakaat 1: iftitah, Al-Fatihah, surat; rakaat 2: Al-Fatihah, surat; tasyahud akhir, sholawat, doa, salam.',
        'Setiap selesai 4 rakaat (satu <i>tarwihah</i>) beristirahat sejenak sambil dzikir dan sholawat.',
        'Ulangi hingga jumlah rakaat yang dipilih, lalu lanjutkan sholat <b>witir</b>.',
        'Setelah witir, dzikir dan doa (Kamilin, doa setelah witir, doa Lailatul Qadar).'
      ]) + `<h4>Surat yang dibaca</h4><p>Bebas; boleh membaca surat pendek atau ayat berurutan (khataman).</p>` + surat + dua('bilal')) +
      det('tw-niat', 'Niat Tarawih', 'Imam, makmum, atau sendiri', cardsNiat(tarNiat) + hint('Niat dibaca dalam hati; melafalkannya sunnah. Diulang tiap dua rakaat.')) +
      det('tw-dzikir', 'Dzikir di Sela Tarawih', 'Setiap 4 rakaat', dua('tarawihDzikir') + dua('shalawat') + hint('Boleh diganti dengan istighfar, sholawat, atau tadarus pelan.')) +
      det('tw-witir', 'Tata Cara Witir', '1, 2+1, atau 3 rakaat', `<p><b>Witir 3 rakaat</b> dapat dikerjakan dengan dua cara:</p>` + ol([
        '<b>Dua salam (lebih utama)</b>: 2 rakaat salam, lalu 1 rakaat salam.',
        '<b>Satu salam</b>: 3 rakaat sekaligus, tasyahud akhir hanya di rakaat ketiga (tanpa tasyahud awal agar tidak menyerupai Maghrib).'
      ]) + `<h4>Surat yang disunnahkan</h4>` + ul([
        "Rakaat 1: <b>Al-A'la</b>.", "Rakaat 2: <b>Al-Kafirun</b>.", 'Rakaat 3: <b>Al-Ikhlas</b>, boleh ditambah <b>Al-Falaq</b> dan <b>An-Nas</b>.'
      ]) + surat + `<h4>Qunut witir</h4><p>Dalam mazhab Syafi\'i, qunut witir disunnahkan pada <b>rakaat terakhir witir mulai malam ke-16 Ramadhan</b> (separuh akhir bulan), dibaca setelah i\'tidal.</p>` + dua('qunut') + `<p class="sh-id">Bila berjamaah, makmum mengaminkan doa imam atau membaca sendiri.</p>`) +
      det('tw-niatw', 'Niat Witir', '1, 2, dan 3 rakaat', cardsNiat(witNiat) + hint('Witir 3 rakaat dengan dua salam: niat 2 rakaat dahulu, lalu niat 1 rakaat.')) +
      det('tw-doa', 'Doa Setelah Tarawih & Witir', 'Lengkap', dua('witirDoa3') + dua('witirDoa4') + dua('kamilin') + dua('lailatul') + dua('sapuJagat2') + dua('ortu'), true) +
      det('tw-catatan', 'Catatan Penting', '', `<p class="muted small">Jumlah rakaat tarawih, bacaan bilal, dan qunut witir berbeda di antara mazhab dan ormas (misalnya 8 atau 20 rakaat, qunut witir pada separuh akhir Ramadhan atau sepanjang tahun). Semuanya diamalkan kaum muslimin. Doa Kamilin dan bacaan bilal adalah amalan masyhur, bukan hadis. Tanyakan kepada ustaz setempat bila ragu.</p>`);
  }

  function tabTata() {
    const s = (t, b, keys) => `<li><b>${t}</b>${b ? `<p>${b}</p>` : ''}${(keys || []).map(dua).join('')}</li>`;
    const surat = `<div class="btn-row sh-surat">${SURAT.map(([n, t]) => LNK(n, 0, t)).join('')}</div>`;
    return `<p class="muted small">Urutan sholat dua rakaat dari awal sampai salam. Untuk sholat 3 atau 4 rakaat, setelah tasyahud awal ulangi tahap berdiri hingga sujud kedua (tanpa iftitah dan tanpa membaca surat), lalu tasyahud akhir.</p>
    <div class="sh-steps"><ol class="sh-big">` + [
      s('Berdiri tegak menghadap kiblat', 'Hadirkan hati, tenangkan pandangan ke tempat sujud, dan niatkan sholat yang akan dikerjakan.', []),
      s('Takbiratul ihram', 'Angkat kedua tangan setinggi bahu atau telinga sambil takbir, lalu letakkan tangan kanan di atas kiri di bawah dada.', ['takbir']),
      s('Doa iftitah', 'Hanya di rakaat pertama.', ['iftitah']),
      s("Ta'awudz dan Al-Fatihah", 'Di setiap rakaat; basmalah termasuk ayat pertama Al-Fatihah.', ['taawudz', 'amin']),
      s('Membaca surat/ayat Al-Qur\'an', 'Sunnah di rakaat 1 dan 2. Buka surat dari app ini:' + surat, []),
      s("Ruku'", 'Takbir sambil membungkuk, punggung rata, tangan memegang lutut, thuma\'ninah.', ['ruku']),
      s("I'tidal", 'Bangun sambil mengangkat tangan, tegak kembali.', ['itidal1', 'itidal2']),
      s('Doa qunut (Subuh)', 'Pada rakaat kedua sholat Subuh, setelah i\'tidal (dan pada witir paruh akhir Ramadhan menurut sebagian ulama Syafi\'iyah).', ['qunut']),
      s('Sujud pertama', 'Takbir sambil turun; tujuh anggota sujud menempel (dahi, kedua telapak tangan, kedua lutut, ujung jari kaki).', ['sujud']),
      s('Duduk di antara dua sujud', 'Takbir, duduk iftirasy (duduk di atas kaki kiri, kaki kanan ditegakkan).', ['duduk']),
      s('Sujud kedua', 'Takbir lalu sujud lagi dengan bacaan sujud yang sama.', ['sujud']),
      s('Rakaat kedua', 'Bangun sambil takbir, lalu ulangi langkah 4-11 (tanpa iftitah).', []),
      s('Tasyahud awal (untuk sholat 3-4 rakaat)', 'Duduk iftirasy setelah sujud kedua rakaat ke-2. Bangun lagi untuk rakaat berikutnya.', ['tasyahud', 'shalawatAwal']),
      s('Tasyahud akhir', 'Di rakaat terakhir; duduk tawarruk (pantat ke lantai, kaki kiri di bawah kaki kanan).', ['tasyahud', 'shalawat']),
      s('Doa sebelum salam', 'Berdoa memohon perlindungan dan kebaikan.', ['sblSalam', 'sapuJagat']),
      s('Salam', 'Menoleh ke kanan hingga pipi kanan terlihat, lalu ke kiri.', ['salam'])
    ].join('') + `</ol></div>` + hint('Tips: lakukan setiap gerakan dengan thuma\'ninah. Sholat berjamaah: makmum tidak mendahului imam, dan membaca Al-Fatihah sendiri (mazhab Syafi\'i).');
  }

  function tabSunnah() {
    const q = SUNNAH.map(g => `<h3 class="sh-grp">${esc(g.grp)}</h3>` + g.items.map(x => det('s-' + x.id, x.nama, x.rak,
      `<p>${esc(x.ket)}</p>` + niatBox(x.niat) + (x.dz ? x.dz.map(dua).join('') : '') + (x.id==='tarawih'||x.id==='witir' ? `<p><a class="btn primary" href="#/sholat/tarawih">Tuntunan lengkap Tarawih & Witir</a></p>` : '') + `<p><a class="btn" href="#/sholat/tata">Cara melaksanakan: sama seperti sholat wajib</a></p>`)).join('')).join('');
    return `<p class="muted small">Lengkap dengan niat Arab, latin, dan arti. Cara pengerjaan sama seperti sholat wajib (lihat tab Tata Cara). Sholat sunnah muakkad lebih ditekankan.</p>` + q;
  }

  function tabJenazah() {
    return `<p class="muted small">Sholat jenazah hukumnya <b>fardhu kifayah</b>. Dilakukan berdiri tanpa ruku' dan sujud, dengan 4 takbir.</p>` +
      det('jnz', 'Tata Cara Sholat Jenazah', 'Empat takbir', niatBox(U('أُصَلِّي عَلَى هٰذَا الْمَيِّتِ أَرْبَعَ تَكْبِيرَاتٍ فَرْضَ الْكِفَايَةِ مَأْمُومًا لِلّٰهِ تَعَالَى', "Ushallii 'alaa haadzal mayyiti arba'a takbiiraatin fardhal kifaayati ma'muuman lillaahi ta'aalaa", "Aku niat sholat atas jenazah laki-laki ini empat takbir, fardhu kifayah, sebagai makmum, karena Allah Ta'ala."), 'Niat (jenazah laki-laki)') +
        `<p class="sh-id">Jenazah perempuan: ganti <b>هٰذَا الْمَيِّتِ</b> dengan <b>هٰذِهِ الْمَيِّتَةِ</b> (<i>haadzihil mayyitati</i>). Imam: ganti <i>ma'muuman</i> dengan <i>imaaman</i>.</p>` +
        ol([
          '<b>Takbir pertama</b> (takbiratul ihram), lalu membaca <b>Al-Fatihah</b>.',
          '<b>Takbir kedua</b>, membaca <b>sholawat</b> kepada Nabi (minimal "Allaahumma shalli \'alaa muhammad").',
          '<b>Takbir ketiga</b>, membaca <b>doa untuk jenazah</b>.',
          '<b>Takbir keempat</b>, membaca doa, lalu <b>salam</b>.'
        ]) + `<p>${LNK(1, 0, 'Buka Al-Fatihah')}</p>` + dua('shalawat') + dua('jnzDoaL') + dua('jnzDoaP') + dua('jnz4') + dua('salam'), true) +
      det('jnzurus', 'Mengurus Jenazah', 'Empat kewajiban kifayah', ol(['<b>Memandikan</b> jenazah (dengan air suci, dimulai dari anggota wudhu).', '<b>Mengkafani</b> dengan kain putih, minimal satu lapis yang menutup seluruh tubuh (sunnah 3 lapis untuk laki-laki, 5 untuk perempuan).', '<b>Menyolatkan</b> jenazah.', '<b>Menguburkan</b> menghadap kiblat (miring ke kanan, wajah ke arah kiblat).']) + hint('Sunnah mempercepat pengurusan jenazah, melayat, mengantar ke pemakaman, dan mendoakannya setelah dikubur.'));
  }

  function tabDzikir() {
    return `<p class="muted small">Dzikir dan doa setelah salam. Urutan umum dari hadis dan tuntunan ulama; tidak harus semua dibaca, sesuaikan waktu.</p>` +
      det('dz-urut', 'Urutan Dzikir Setelah Sholat', 'Ringkasan', ol(['Istighfar 3x, lalu <i>Allaahumma antas salaam</i>.', 'Tahlil dan <i>Laa maani\'a</i>.', 'Tasbih 33x, tahmid 33x, takbir 33x, lalu genapkan seratus dengan tahlil.', 'Membaca <b>Ayat Kursi</b> (Al-Baqarah: 255), <b>Al-Ikhlas</b>, <b>Al-Falaq</b>, dan <b>An-Nas</b> (khususnya setelah Subuh dan Maghrib 3x).', 'Berdoa untuk diri, orang tua, dan sesama muslim.']) +
        `<p class="btn-row">${LNK(2, 255, 'Ayat Kursi')}${LNK(112, 0, 'Al-Ikhlas')}${LNK(113, 0, 'Al-Falaq')}${LNK(114, 0, 'An-Nas')}</p>`, true) +
      ['istighfar', 'antaSalam', 'laMani', 'tasbih', 'tahmid', 'takbir33', 'genap100', 'bantuIbadah', 'ortu', 'sapuJagat2'].map(k => det('d-' + k, D[k].t, D[k].n || '', dua(k))).join('') +
      det('d-masjid', 'Doa Masuk & Keluar Masjid', '', dua('masukMasjid') + dua('keluarMasjid'));
  }

  function tabLain() {
    return det('keutamaan', 'Waktu Terlarang & Makruh', 'Kapan tidak dianjurkan sholat sunnah', ul([
        'Setelah sholat Subuh hingga matahari setinggi tombak (sekitar 15 menit setelah terbit).',
        'Saat matahari tepat di tengah (istiwa\') hingga tergelincir (kecuali hari Jumat).',
        'Setelah sholat Ashar hingga matahari terbenam.',
        'Pengecualian: sholat yang punya sebab (qadha, tahiyatul masjid, gerhana, jenazah) boleh dikerjakan.'
      ]) + hint('Menurut mazhab Syafi\'i, sholat yang memiliki sebab tetap boleh dikerjakan pada waktu-waktu tersebut.')) +
      det('qadha', 'Sholat Qadha & Sholat Orang Sakit', '', `<p><b>Qadha</b>: sholat fardhu yang terlewat wajib diganti segera (mengingatnya saat itu juga). Niatnya sama dengan sholat fardhu dengan mengganti kata <i>adaa-an</i> menjadi <i>qadhaa-an</i> (قَضَاءً).</p><p><b>Sakit</b>: sholat tetap wajib selama akal sadar. Bila tidak mampu berdiri, boleh duduk; tidak mampu duduk, berbaring miring ke kanan menghadap kiblat; tidak mampu itu, telentang; lalu dengan isyarat mata atau hati.</p>`) +
      det('adab', 'Adab Menuju Masjid & Berjamaah', '', ul([
        'Berwudhu di rumah, berjalan tenang dan tidak tergesa-gesa.', 'Membaca doa masuk masjid, lalu tahiyatul masjid.', 'Meluruskan dan merapatkan shaf; shaf pertama paling utama.', 'Mengikuti imam; sholat berjamaah bernilai 27 derajat lebih utama daripada sendiri.', 'Menjawab adzan dan berdoa di antara adzan dan iqamah (waktu mustajab).'
      ])) +
      det('catatan', 'Catatan Penting', '', `<p class="muted small">Tuntunan ini mengikuti pendapat yang umum dipakai di Indonesia (mazhab Syafi'i). Ada perbedaan tata cara di antara mazhab dan ormas Islam (misalnya doa qunut, jumlah rakaat tarawih, atau tangan bersedekap); semuanya dalam wilayah khilafiyah. Untuk kasus khusus, tanyakan kepada ustaz atau ulama setempat. Teks Arab sudah diperiksa untuk bacaan umum; mohon koreksi bila menemukan salah ketik.</p>`);
  }

  /* ====== JADWAL (aladhan API, metode Kemenag RI) ====== */
  const KAABA = [21.422487, 39.826206];
  const qibla = (la, lo) => {
    const r = Math.PI / 180, p1 = la * r, p2 = KAABA[0] * r, dl = (KAABA[1] - lo) * r;
    const y = Math.sin(dl), x = Math.cos(p1) * Math.tan(p2) - Math.sin(p1) * Math.cos(dl);
    return (Math.atan2(y, x) / r + 360) % 360;
  };
  const NAMA = [['Fajr', 'Subuh'], ['Sunrise', 'Terbit'], ['Dhuhr', 'Zhuhur'], ['Asr', 'Ashar'], ['Maghrib', 'Maghrib'], ['Isha', 'Isya']];
  const ymd = (dt = new Date()) => `${String(dt.getDate()).padStart(2, '0')}-${String(dt.getMonth() + 1).padStart(2, '0')}-${dt.getFullYear()}`;
  let timer = null;

  async function loadTimes(la, lo) {
    const key = `${ymd()}|${la.toFixed(2)}|${lo.toFixed(2)}`;
    const c = store.get('sholatJadwal', null);
    if (c && c.key === key) return c.t;
    const r = await fetch(`https://api.aladhan.com/v1/timings/${ymd()}?latitude=${la}&longitude=${lo}&method=20`);
    if (!r.ok) throw new Error('HTTP ' + r.status);
    const j = await r.json();
    const t = {}; NAMA.forEach(([k]) => { t[k] = String(j.data.timings[k]).slice(0, 5); });
    store.set('sholatJadwal', { key, t });
    return t;
  }
  function paintTimes(box, t, la, lo) {
    const now = new Date(), cur = now.getHours() * 60 + now.getMinutes();
    const toM = s => { const [h, m] = s.split(':').map(Number); return h * 60 + m; };
    const list = NAMA.filter(([k]) => k !== 'Sunrise');
    let nextK = null;
    for (const [k] of list) if (toM(t[k]) > cur) { nextK = k; break; }
    nextK = nextK || 'Fajr';
    const nm = NAMA.find(([k]) => k === nextK)[1];
    let diff = toM(t[nextK]) - cur; if (diff <= 0) diff += 1440;
    box.innerHTML = `<div class="sh-next"><small>Sholat berikutnya</small><b>${nm}</b><span>${t[nextK]} · ${Math.floor(diff / 60)} jam ${diff % 60} menit lagi</span></div>
      <ul class="sh-times">${NAMA.map(([k, n]) => `<li class="${k === nextK ? 'on' : ''}"><span>${n}</span><b>${t[k]}</b></li>`).join('')}</ul>
      <p class="muted small">Arah kiblat dari lokasimu: <b>${qibla(la, lo).toFixed(1)}°</b> dari utara (searah jarum jam). Perkiraan. <a href="#/kiblat">Buka kompas kiblat</a> untuk menghadap dengan sensor HP.</p>`;
  }
  function tabJadwal() {
    return `<div class="card sh-jadwal"><p class="mini-title">Jadwal sholat hari ini</p><div id="shTimes"><p class="muted">Izinkan akses lokasi untuk melihat jadwal sesuai tempatmu (metode Kemenag RI). Butuh internet; hasil disimpan sehingga tetap tampil offline hari ini.</p></div>
      <div class="btn-row"><button class="btn primary" id="shLoc">Gunakan lokasi saya</button><button class="btn" id="shSemarang">Semarang</button><button class="btn" id="shJkt">Jakarta</button></div></div>
      <div class="card" style="margin-top:12px"><p class="mini-title">Mulai dari sini</p><p class="muted small" style="margin:0 0 10px">Pilih topik: dasar (wudhu, adzan), sholat wajib, urutan bacaan, sholat sunnah, jenazah, dan dzikir.</p>
      <div class="btn-row"><a class="btn" href="#/sholat/dasar">Wudhu & Adzan</a><a class="btn" href="#/sholat/wajib">Sholat Wajib</a><a class="btn" href="#/sholat/tata">Urutan Bacaan</a><a class="btn" href="#/sholat/sunnah">Sholat Sunnah</a></div></div>`;
  }
  function bindJadwal() {
    const box = $('#shTimes'); if (!box) return;
    const run = async (la, lo) => {
      box.innerHTML = '<p class="muted">Memuat jadwal…</p>';
      try { const t = await loadTimes(la, lo); store.set('sholatLoc', [la, lo]); paintTimes(box, t, la, lo); clearInterval(timer); timer = setInterval(() => { if (!document.body.contains(box)) return clearInterval(timer); paintTimes(box, t, la, lo); }, 60000); }
      catch { box.innerHTML = '<p class="muted">Gagal memuat jadwal. Periksa koneksi internet lalu coba lagi.</p>'; }
    };
    $('#shLoc').onclick = () => {
      if (!navigator.geolocation) return toast('Perangkat tidak mendukung lokasi');
      box.innerHTML = '<p class="muted">Mencari lokasi…</p>';
      navigator.geolocation.getCurrentPosition(p => run(p.coords.latitude, p.coords.longitude), () => { box.innerHTML = '<p class="muted">Lokasi ditolak. Pilih kota di bawah.</p>'; }, { timeout: 10000, maximumAge: 600000 });
    };
    $('#shSemarang').onclick = () => run(-6.9667, 110.4167);
    $('#shJkt').onclick = () => run(-6.2088, 106.8456);
    const last = store.get('sholatLoc', null); if (last) run(last[0], last[1]);
  }

  /* ====== PENCARIAN DI HALAMAN ====== */
  function bindSearch() {
    const inp = $('#shFind'); if (!inp) return;
    inp.oninput = () => {
      const q = inp.value.trim().toLowerCase();
      document.querySelectorAll('.sh-item').forEach(e => { e.hidden = !!q && !e.textContent.toLowerCase().includes(q); if (q && !e.hidden) e.open = false; });
    };
  }

  const RENDER = { jadwal: tabJadwal, dasar: tabDasar, wajib: tabWajib, jamak: tabJamak, tarawih: tabTarawih, tata: tabTata, sunnah: tabSunnah, jenazah: tabJenazah, dzikir: tabDzikir, lain: tabLain };

  return function SholatView(tab) {
    tab = RENDER[tab] ? tab : 'jadwal';
    setTitle('Tuntunan Sholat', true);
    const tabs = `<div class="sh-tabs" role="tablist">${TABS.map(([k, l]) => `<a role="tab" class="chip ${k === tab ? 'on' : ''}" aria-selected="${k === tab}" href="#/sholat/${k}">${l}</a>`).join('')}</div>`;
    const find = ['jadwal', 'tata'].includes(tab) ? '' : `<div class="searchbox"><input id="shFind" type="search" placeholder="Cari di halaman ini (mis. witir, doa, niat)" autocomplete="off"></div>`;
    view.innerHTML = `<section class="sh-wrap"><div class="sh-hero"><p class="sh-bis" lang="ar" dir="rtl">إِنَّ الصَّلَاةَ كَانَتْ عَلَى الْمُؤْمِنِينَ كِتَابًا مَوْقُوتًا</p><h1>Tuntunan Sholat</h1><p>Wudhu, adzan, sholat wajib dan sunnah, lengkap dengan niat, bacaan, dan doa.</p></div>${tabs}${find}<div class="sh-content">${RENDER[tab]()}</div></section>`;
    if (tab === 'jadwal') bindJadwal();
    bindSearch();
    const on = view.querySelector('.sh-tabs .on'); if (on && on.scrollIntoView) on.scrollIntoView({ inline: 'center', block: 'nearest' });
  };
};
