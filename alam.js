/* Tadabbur Alam: peta cuaca, gempa, sesar & subduksi, tsunami, gunung api, karhutla, dan El Niño,
 * masing-masing dihubungkan langsung ke ayat Al-Qur'an (teks dari data/s/N.json, offline).
 * Data langsung: Open-Meteo (cuaca), USGS + BMKG (gempa), NASA EONET/FIRMS (karhutla), NOAA OISST/ONI (El Niño).
 * Garis sesar, palung subduksi & titik gunung api = perkiraan skematik dari PETAQU (bukan peta resmi / peringatan dini).
 * Rujukan resmi: BMKG, PVMBG (MAGMA Indonesia), BNPB, SiPongi KLHK. */
window.makeAlamView = function (d) {
  const { esc, view, setTitle, toast, store } = d, $ = id => document.getElementById(id);
  const GEO = {"v":[["Seulawah Agam",5.45,95.66],["Peut Sague",4.91,96.33],["Bur Ni Telong",4.77,96.82],["Sinabung",3.17,98.39],["Sibayak",3.23,98.51],["Sorik Marapi",0.69,99.54],["Marapi",-0.38,100.47],["Talang",-0.98,100.68],["Kerinci",-1.7,101.26],["Kaba",-3.52,102.62],["Dempo",-4.03,103.13],["Anak Krakatau",-6.1,105.42],["Salak",-6.72,106.73],["Gede-Pangrango",-6.78,106.98],["Tangkuban Parahu",-6.76,107.6],["Papandayan",-7.32,107.73],["Guntur",-7.14,107.84],["Galunggung",-7.25,108.06],["Ciremai",-6.89,108.4],["Slamet",-7.24,109.21],["Dieng",-7.21,109.92],["Sindoro",-7.3,109.99],["Sumbing",-7.38,110.07],["Merbabu",-7.45,110.44],["Merapi",-7.54,110.446],["Lawu",-7.63,111.19],["Wilis",-7.81,111.76],["Kelud",-7.93,112.31],["Arjuno-Welirang",-7.73,112.58],["Bromo-Tengger",-7.94,112.95],["Semeru",-8.11,112.92],["Raung",-8.125,114.04],["Ijen",-8.06,114.24],["Batur",-8.24,115.375],["Agung",-8.34,115.51],["Rinjani",-8.41,116.47],["Tambora",-8.25,118],["Sangeang Api",-8.18,119.06],["Ebulobo",-8.82,121.18],["Kelimutu",-8.77,121.82],["Paluweh/Rokatenda",-8.32,121.71],["Egon",-8.67,122.45],["Lewotobi",-8.54,122.77],["Ili Boleng",-8.34,123.26],["Lewotolok",-8.27,123.51],["Tangkoko",1.52,125.2],["Soputan",1.11,124.73],["Lokon",1.36,124.79],["Ruang",2.3,125.37],["Karangetang",2.78,125.4],["Colo (Una-Una)",-0.17,121.61],["Gamalama",0.8,127.33],["Gamkonora",1.38,127.53],["Ibu",1.49,127.63],["Dukono",1.7,127.89],["Banda Api",-4.52,129.87]],"s":[["Megathrust Sunda (Sumatra–Jawa–Nusa Tenggara)",[[6.2,93.2],[4,94],[2,95.3],[0,97.3],[-2,99],[-4,100.9],[-6,102.6],[-7.6,105],[-8.9,107.5],[-9.5,110],[-10,112.5],[-10.4,115],[-10.7,117.5],[-10.9,120],[-10.6,122.5]]],["Palung Timor",[[-10.6,122.5],[-10.3,124.5],[-9.6,126.5],[-8.8,128.5]]],["Palung Tanimbar",[[-8.8,128.5],[-8.2,130.5],[-7,131.8]]],["Sesar naik busur-belakang Flores",[[-8.1,115],[-8.2,117.5],[-8.1,120],[-8,122.5],[-7.9,125]]],["Palung Seram–Banda",[[-3.5,126.5],[-3.2,128.5],[-3.4,130.5]]],["Palung Sulawesi Utara",[[2.2,122],[1.6,123.5],[1.2,125]]],["Tumbukan Laut Maluku",[[3.5,126.5],[1,126.5],[-0.5,126]]],["Palung Halmahera",[[2.5,128.8],[0.5,128.8]]],["Palung Papua Utara",[[-0.5,134],[-1.5,137],[-2.4,140]]]],"f":[["Sesar Sumatra (Semangko)",[[5.5,95.3],[4.7,96.5],[3.5,97.6],[2.5,98.7],[1,99.4],[0,100.3],[-1.5,101.2],[-3,102.2],[-4.5,103.3],[-5.9,104.6],[-6,105.2]]],["Sesar Cimandiri",[[-7,106.3],[-6.95,106.9],[-6.85,107.3]]],["Sesar Lembang",[[-6.83,107.45],[-6.82,107.8]]],["Sesar Baribis",[[-6.15,107.15],[-6.55,108],[-6.85,108.6],[-7,109.1]]],["Sesar Opak",[[-8.05,110.28],[-7.85,110.5]]],["Sesar Semarang",[[-6.95,110.3],[-7.05,110.5]]],["Sesar Naik Kendeng",[[-7.1,110.9],[-7.2,111.8],[-7.3,112.6]]],["Sesar Pasuruan",[[-7.6,112.7],[-7.7,113.3]]],["Sesar Palu–Koro",[[-0.4,119.7],[-1.2,120],[-2,120.4],[-2.6,121.4]]],["Sesar Matano",[[-2.5,121.2],[-2.6,122.3]]],["Sesar Lawanopo",[[-3.4,121.9],[-4.2,122.9]]],["Sesar Walanae",[[-3.7,119.9],[-4.8,120.3]]],["Sesar Poso",[[-1.6,120.5],[-1.4,121.5]]],["Sesar Gorontalo",[[0.5,122.3],[0.6,123.5]]],["Sesar Sorong",[[-0.9,131.2],[-1,132.5],[-1.4,134],[-2.1,136],[-2.6,138.5],[-2.8,140.2]]],["Sesar Tarera–Aiduna",[[-3.8,133],[-4.2,134.5],[-4.4,136.5]]],["Sesar Seram",[[-3,128.4],[-3.2,130]]],["Sesar Yapen",[[-1.8,135.5],[-2.4,136.9]]]]};
  const R = Math.PI / 180, ID = [-12, 94, 8, 142];
  const CITIES = [['Banda Aceh', 5.55, 95.32], ['Medan', 3.6, 98.67], ['Padang', -0.95, 100.42], ['Pekanbaru', 0.51, 101.45], ['Palembang', -2.98, 104.75], ['Lampung', -5.43, 105.26], ['Jakarta', -6.21, 106.85], ['Bandung', -6.92, 107.62], ['Semarang', -6.97, 110.42], ['Yogyakarta', -7.8, 110.37], ['Surabaya', -7.26, 112.75], ['Denpasar', -8.67, 115.21], ['Mataram', -8.58, 116.12], ['Kupang', -10.18, 123.6], ['Pontianak', -0.03, 109.34], ['Banjarmasin', -3.32, 114.59], ['Balikpapan', -1.24, 116.85], ['Makassar', -5.15, 119.43], ['Palu', -0.9, 119.87], ['Manado', 1.47, 124.84], ['Ambon', -3.7, 128.18], ['Jayapura', -2.53, 140.72]];
  /* Tiap topik: ayat terkait + catatan. Teks Arab & terjemah diambil dari data bundel, bukan diketik ulang. */
  const TOPIK = {
    ringkas: { emo: '🧭', t: 'Ringkasan', ay: [[57, 22], [64, 11], [2, 155]], note: 'Musibah dan fenomena alam adalah bagian dari ketetapan Allah. Ayat-ayat ini mengajarkan sikap: sabar, tawakal, dan tetap berikhtiar lewat informasi resmi.' },
    cuaca: { emo: '⛅', t: 'Cuaca', ay: [[30, 48], [24, 43], [7, 57], [50, 9]], note: 'Angin, awan, dan hujan disebut Al-Qur\'an sebagai tanda kekuasaan dan rahmat Allah. Sunnah saat hujan: berdoa "Allahumma shayyiban nafi\'a".' },
    gempa: { emo: '🌍', t: 'Gempa bumi', ay: [[99, 1], [99, 2], [99, 3], [22, 1], [29, 37]], note: 'Az-Zalzalah menggambarkan guncangan bumi pada hari kiamat; gempa di dunia menjadi pengingat. Saat gempa: lindungi diri, jauhi bangunan rapuh, dan perbanyak istighfar. Info resmi: BMKG.' },
    sesar: { emo: '〰️', t: 'Sesar & subduksi', ay: [[16, 15], [31, 10], [21, 31], [7, 78]], note: 'Gunung disebut sebagai pasak agar bumi tidak goyang. Lempeng, sesar, dan palung adalah mekanisme bumi yang kini diteliti geologi. Ayat ini mengajak merenung dan berikhtiar: kenali risiko tempat tinggal, bangun tahan gempa.' },
    tsunami: { emo: '🌊', t: 'Gempa & tsunami', ay: [[17, 68], [81, 6], [82, 3], [54, 11]], note: 'Laut ada di tangan Allah. Penanda tsunami alami: gempa kuat di pantai, air laut surut tiba-tiba, suara gemuruh. Segera menuju tempat tinggi tanpa menunggu sirine. Peringatan resmi: BMKG (InaTEWS).' },
    gunung: { emo: '🌋', t: 'Gunung api', ay: [[78, 6], [78, 7], [88, 19], [16, 15], [31, 10]], note: 'Gunung sebagai pasak bumi. Patuhi radius aman dan status Level I–IV dari PVMBG (MAGMA Indonesia). Jangan mendekati kawah meski tampak tenang.' },
    karhutla: { emo: '🔥', t: 'Karhutla', ay: [[30, 41], [7, 56], [36, 80], [2, 205]], note: 'Ar-Rum 41: kerusakan di darat dan laut timbul karena perbuatan tangan manusia. Membakar lahan merusak bumi dan menyakiti sesama lewat asap. Laporkan titik api ke BPBD / SiPongi.' },
    elnino: { emo: '🌡️', t: 'El Niño', ay: [[12, 47], [12, 48], [12, 49], [7, 130], [2, 155]], note: 'Kisah Yusuf: tujuh tahun subur lalu tujuh tahun paceklik, dan tahun penuh hujan setelahnya. Pelajaran: menabung pangan, menata air, dan tidak boros. El Niño di Indonesia cenderung memperpanjang kemarau dan menaikkan risiko karhutla.' }
  };
  /* Pendahuluan: apa itu tadabbur alam + ayat-ayat dasar (teks Arab & terjemah diambil dari data bundel). */
  const INTRO_AY = [[3, 190], [3, 191], [41, 53], [88, 17]];
  const INTRO_HTML = '<details class="al-box al-intro" id="alIntro"><summary><b>🌿 Apa itu Tadabbur Alam?</b></summary>'
    + '<p><b>Tadabbur</b> berarti merenungkan sesuatu sampai ke maknanya. <b>Tadabbur alam</b> adalah membaca alam sebagai <i>ayat kauniyah</i>, yaitu tanda-tanda Allah di langit, bumi, laut, dan gunung, berdampingan dengan <i>ayat qauliyah</i>, yaitu firman-Nya dalam Al-Qur’an. Keduanya berasal dari Pencipta yang sama dan saling menjelaskan.</p>'
    + '<p>Di halaman ini data cuaca, gempa, sesar, gunung api, karhutla, dan El Niño dipertemukan dengan ayat agar kita <b>mengenal</b> ciptaan-Nya, <b>bersyukur</b> atas rahmat-Nya, <b>bersabar</b> atas ketetapan-Nya, dan <b>berikhtiar</b> menjaga diri serta bumi.</p>'
    + '<div class="al-ayg" id="alIntroAy"><p class="muted small">Memuat ayat…</p></div>'
    + '<p class="small muted">Merenung tidak berhenti pada kagum. Lanjutkan dengan syukur, sabar, dan tindakan nyata. Data di sini bersifat informatif; untuk peringatan dini ikuti BMKG, PVMBG, dan BNPB.</p></details>';

  /* ---------- Fitur: Kartu Bagikan (gambar ayat) + Jurnal Tadabbur ---------- */
  const EXTRA_CSS = `
  .al-aywrap{position:relative}
  .al-aywrap .al-ay{padding-bottom:38px}
  .al-share{position:absolute;bottom:8px;right:10px;border:1px solid var(--border);background:var(--surface);color:inherit;border-radius:999px;padding:3px 10px;font-size:.8rem;cursor:pointer;opacity:.9}
  .al-share:hover{border-color:var(--primary)}
  .al-jr textarea{width:100%;min-height:84px;box-sizing:border-box;padding:8px;border-radius:10px;border:1px solid var(--border);background:var(--bg);color:inherit;font:inherit;resize:vertical}
  .al-jr-act{display:flex;gap:8px;flex-wrap:wrap;margin:8px 0}
  .al-jr-it{border-left:3px solid var(--primary);padding:6px 10px;margin:8px 0;background:var(--bg);border-radius:0 10px 10px 0}
  .al-jr-it small{display:flex;justify-content:space-between;gap:8px;color:var(--muted,#667)}
  .al-jr-it p{margin:4px 0 0;white-space:pre-wrap}
  .al-ren{position:absolute;top:10px;right:10px;z-index:850;width:min(400px,calc(100% - 66px));background:color-mix(in srgb,var(--surface) 93%,transparent);-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px);border:1px solid var(--border);border-radius:14px;box-shadow:0 6px 22px rgba(0,0,0,.22);font-size:.9rem;overflow:hidden;color:var(--text,inherit)}
  .al-ren.static{position:static;width:auto;box-shadow:none}
  .al-ren[hidden]{display:none}
  .al-ren-h{display:flex;align-items:center;gap:6px;padding:6px 6px 6px 12px;font-weight:700}
  .al-ren.min .al-ren-h{cursor:pointer}
  .al-ren-h span{flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .al-ren-h button{border:1px solid var(--border);background:var(--bg);color:inherit;border-radius:8px;width:28px;height:28px;line-height:1;cursor:pointer;font-size:1rem;padding:0}
  .al-ren-b{padding:0 12px 10px;max-height:min(320px,46vh);overflow:auto}
  .al-ren.min{width:auto;max-width:calc(100% - 66px);border-radius:999px}
  .al-ren.min .al-ren-b{display:none}
  .al-ren-b p{margin:4px 0}
  .al-ren .al-ay{padding:8px 10px 30px;border-radius:12px;margin-top:6px}
  .al-ren .al-ar{font-size:1.2rem;line-height:1.9}
  .al-ren .al-id{font-size:.85rem}
  .al-ren .al-share{bottom:6px}`;

  function wrapLines(ctx, text, maxW) {
    const words = text.split(/\s+/).filter(Boolean), lines = []; let cur = '';
    for (const w of words) { const t = cur ? cur + ' ' + w : w; if (cur && ctx.measureText(t).width > maxW) { lines.push(cur); cur = w; } else cur = t; }
    if (cur) lines.push(cur); return lines;
  }
  async function shareCard(ar, id, ref, topik) {
    try { await document.fonts.load('48px "Amiri Quran"'); } catch (e) { }
    const W = 1080, H = 1350, c = document.createElement('canvas'); c.width = W; c.height = H; const x = c.getContext('2d');
    const g = x.createLinearGradient(0, 0, W, H); g.addColorStop(0, '#0f766e'); g.addColorStop(1, '#134e4a'); x.fillStyle = g; x.fillRect(0, 0, W, H);
    x.strokeStyle = 'rgba(255,255,255,.35)'; x.lineWidth = 3; x.strokeRect(40, 40, W - 80, H - 80);
    x.fillStyle = '#fff'; x.textAlign = 'center'; x.textBaseline = 'alphabetic';
    x.font = '600 38px system-ui,sans-serif'; x.fillText(topik, W / 2, 130);
    let y = 230; x.direction = 'rtl'; x.font = '54px "Amiri Quran",serif';
    let al = wrapLines(x, ar, W - 200); if (al.length > 7) { x.font = '42px "Amiri Quran",serif'; al = wrapLines(x, ar, W - 200); }
    const lh = al.length > 7 ? 84 : 104; al.forEach(l => { x.fillText(l, W / 2, y); y += lh; });
    x.direction = 'ltr'; y += 30; x.fillStyle = 'rgba(255,255,255,.92)'; x.font = '32px system-ui,sans-serif';
    let tl = wrapLines(x, id, W - 200); if (tl.length > 9) { x.font = '27px system-ui,sans-serif'; tl = wrapLines(x, id, W - 200); }
    tl.slice(0, 12).forEach(l => { x.fillText(l, W / 2, y); y += 46; });
    x.fillStyle = '#facc15'; x.font = '700 34px system-ui,sans-serif'; x.fillText(ref, W / 2, Math.min(y + 40, H - 150));
    x.fillStyle = 'rgba(255,255,255,.7)'; x.font = '26px system-ui,sans-serif'; x.fillText('Tadabbur Alam · Al-Qur\u2019an Pintar', W / 2, H - 80);
    const blob = await new Promise(r => c.toBlob(r, 'image/png')); if (!blob) throw new Error('canvas');
    const f = new File([blob], 'tadabbur-' + ref.replace(/\W+/g, '-') + '.png', { type: 'image/png' });
    if (navigator.canShare && navigator.canShare({ files: [f] })) { try { await navigator.share({ files: [f], title: 'Tadabbur Alam', text: ref }); return 'share'; } catch (e) { if (e && e.name === 'AbortError') return 'batal'; } }
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = f.name; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 4000); return 'unduh';
  }
  /* bungkus tiap kartu ayat dengan tombol bagikan */
  function decorateAyat(root) {
    if (!root) return;
    root.querySelectorAll('a.al-ay').forEach(a => {
      if (a.parentNode.classList.contains('al-aywrap')) return;
      const w = document.createElement('div'); w.className = 'al-aywrap'; a.replaceWith(w); w.appendChild(a);
      const b = document.createElement('button'); b.type = 'button'; b.className = 'al-share'; b.textContent = '🖼️ Bagikan'; b.setAttribute('aria-label', 'Bagikan ayat sebagai gambar');
      b.onclick = async e => {
        e.preventDefault(); e.stopPropagation();
        const ar = (a.querySelector('.al-ar') || {}).textContent || '', id = (a.querySelector('.al-id') || {}).textContent || '', ref = ((a.querySelector('.al-ref') || {}).textContent || '').split('·')[0].trim();
        if (!ar) return toast('Ayat belum termuat');
        b.disabled = true; try { const r = await shareCard(ar, id, ref, TOPIK[ST.tab].emo + ' Tadabbur ' + TOPIK[ST.tab].t); if (r === 'unduh') toast('Gambar diunduh'); } catch (er) { toast('Gagal membuat gambar'); } b.disabled = false;
      };
      w.appendChild(b);
    });
  }
  /* jurnal renungan pribadi (disimpan di perangkat) */
  function jurnalInit() {
    const el = $('alJurnal'); if (!el) return;
    const load = () => { const v = store.get ? store.get('alamJurnal', []) : []; return Array.isArray(v) ? v : []; };
    const draw = () => {
      const L = load();
      el.innerHTML = '<details class="al-box al-jr"><summary><b>📝 Jurnal Tadabbur' + (L.length ? ' (' + L.length + ')' : '') + '</b></summary>'
        + '<p class="small muted">Tulis apa yang kamu renungkan dari ayat dan kejadian alam hari ini. Tersimpan hanya di perangkat ini.</p>'
        + '<textarea id="alJrTx" maxlength="1500" placeholder="Apa pelajaran yang kamu ambil? Apa yang akan kamu syukuri atau lakukan?"></textarea>'
        + '<div class="al-jr-act"><button class="btn" id="alJrSv">Simpan renungan</button>' + (L.length ? '<button class="btn" id="alJrCp">Salin semua</button>' : '') + '</div>'
        + L.map((j, i) => '<div class="al-jr-it"><small><span>' + esc(j.d) + ' · ' + esc(j.t) + '</span><a href="#" data-del="' + i + '" aria-label="Hapus">hapus</a></small><p>' + esc(j.x) + '</p></div>').join('') + '</details>';
      const d = el.querySelector('details'); if (el._open) d.open = true; d.addEventListener('toggle', () => { el._open = d.open; });
      $('alJrSv').onclick = () => {
        const x = $('alJrTx').value.trim(); if (!x) return toast('Tulis dulu renunganmu');
        const A = load(); A.unshift({ d: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }), t: TOPIK[ST.tab].emo + ' ' + TOPIK[ST.tab].t, x });
        store.set && store.set('alamJurnal', A.slice(0, 100)); el._open = true; draw(); toast('Renungan tersimpan');
      };
      const cp = $('alJrCp'); if (cp) cp.onclick = () => { try { navigator.clipboard.writeText(load().map(j => j.d + ' · ' + j.t + '\n' + j.x).join('\n\n')).then(() => toast('Jurnal disalin'), () => toast('Gagal menyalin')); } catch (e) { toast('Gagal menyalin'); } };
      el.onclick = e => { const a = e.target.closest && e.target.closest('[data-del]'); if (!a) return; e.preventDefault(); const A = load(); A.splice(+a.dataset.del, 1); store.set && store.set('alamJurnal', A); el._open = true; draw(); };
    };
    draw();
  }

  /* ---------- Fitur: Renungan Cerdas (menyesuaikan kejadian terkini) + Saran Tindakan lokasi ---------- */
  function cerdasPick() {
    const now = Date.now(), day = (ST.eq || []).filter(e => now - e.t < 864e5), big = day.slice().sort((a, b) => b.m - a.m)[0], nf = (ST.fires || []).length;
    if (big && big.m >= 5) {
      let ts = false; try { ts = tsPot(big); } catch (e) { }
      return { k: ts ? 'tsunami' : 'gempa', f: 'Data langsung ' + (ST.eqSrc || 'USGS/BMKG') + ': ' + day.length + ' gempa terdeteksi dalam 24 jam.',
        h: 'Gempa M ' + big.m.toFixed(1) + ' tercatat dalam 24 jam terakhir (' + (big.w || 'wilayah Indonesia') + '). Bumi bergerak atas izin Allah; kita diminta tenang, berdoa, dan berikhtiar' + (ts ? '. Tetap waspada dan ikuti peringatan resmi BMKG.' : '.') };
    }
    if (nf >= 20) return { k: 'karhutla', f: 'Data langsung ' + (ST.fireSrc || 'NASA') + ': ' + nf + ' titik/kejadian api terpantau.', h: 'Banyak titik api terpantau satelit. Ar-Rum 41 mengingatkan bahwa kerusakan muncul karena tangan manusia; mulai dari diri sendiri, jangan membakar lahan.' };
    if (!(ST.eq || []).length && !nf) return { k: 'cuaca', f: 'Data gempa dan titik api belum termuat.', h: 'Alam adalah kitab terbuka: awan, angin, dan hujan adalah tanda-tanda Allah yang bisa kita baca setiap hari.' };
    return { k: 'cuaca', f: 'Tidak ada gempa M5+ dalam 24 jam dan titik api tidak menonjol pada data yang termuat.', h: 'Saat alam sedang tenang pun tanda-tanda Allah tetap hadir: awan, angin, dan hujan. Renungkan nikmat aman yang sering terlupa.' };
  }
  /* panel Renungan di dalam peta: terbuka / diperkecil / ditutup (ingat pilihan terakhir) */
  function renApply() {
    const pn = $('alRenP'); if (!pn) return;
    pn.hidden = ST.ren === 'x'; pn.classList.toggle('min', ST.ren === 'min');
    const mb = pn.querySelector('[data-a="min"]'); if (mb) { const tt = ST.ren === 'min' ? 'Perbesar' : 'Perkecil'; mb.textContent = ST.ren === 'min' ? '▢' : '–'; mb.title = tt; mb.setAttribute('aria-label', tt); }
    const bt = $('alRen'); if (bt) { bt.classList.toggle('on', ST.ren !== 'x'); bt.setAttribute('aria-pressed', ST.ren !== 'x' ? 'true' : 'false'); }
  }
  function renSet(v) { ST.ren = v; try { store.set && store.set('alamRen', v); } catch (e) { } renApply(); }
  function renInit() {
    let v = null; try { v = store.get ? store.get('alamRen', null) : null; } catch (e) { }
    ST.ren = ['open', 'min', 'x'].includes(v) ? v : (window.innerWidth < 640 ? 'min' : 'open');
    const host = map ? map.getContainer() : $('alCerdas'); if (!host) return;
    const pn = document.createElement('div'); pn.id = 'alRenP'; pn.className = 'al-ren' + (map ? '' : ' static');
    pn.innerHTML = '<div class="al-ren-h" data-a="head"><span>✨ Renungan Hari Ini</span><button type="button" data-a="min"></button><button type="button" data-a="x" title="Tutup" aria-label="Tutup">×</button></div><div class="al-ren-b" id="alRenB"><p class="muted small">Memuat renungan…</p></div>';
    host.appendChild(pn);
    if (L && map) { L.DomEvent.disableClickPropagation(pn); L.DomEvent.disableScrollPropagation(pn); }
    pn.onclick = e => {
      const t = e.target.closest && e.target.closest('[data-a],[data-open]'); if (!t) return;
      if (t.dataset.open) { goTab(t.dataset.open); try { window.scrollTo({ top: 0, behavior: 'smooth' }); } catch (x) { } return; }
      const a = t.dataset.a;
      if (a === 'x') renSet('x'); else if (a === 'min') renSet(ST.ren === 'min' ? 'open' : 'min'); else if (a === 'head' && ST.ren === 'min') renSet('open');
    };
    const bt = $('alRen'); if (bt) bt.onclick = () => renSet(ST.ren === 'x' ? 'open' : 'x');
    renApply();
  }
  async function renderCerdas() {
    const body = $('alRenB'); if (!body) return;
    const p = cerdasPick(), key = p.k + '|' + p.h + '|' + p.f; if (body.dataset.k === key) return; body.dataset.k = key;
    const T = TOPIK[p.k], ay = await ayatHTML([T.ay[0]]); if (body.dataset.k !== key) return;
    body.innerHTML = '<p>' + esc(p.h) + '</p><p class="small muted">' + esc(p.f) + '</p><div class="al-ayg">' + ay + '</div><div class="al-jr-act"><button class="btn" data-open="' + p.k + '">Buka topik ' + T.emo + ' ' + esc(T.t) + '</button></div>';
    decorateAyat(body);
  }
  function riskAdvice() {
    if (!ST.loc) return '';
    const { la, lo } = ST.loc, sub = nearestLine(la, lo, GEO.s), flt = nearestLine(la, lo, GEO.f), vol = nearestVol(la, lo), A = [];
    if (sub.d < 200) A.push('🌊 Dekat zona subduksi: kenali jalur evakuasi ke tempat tinggi, dan jika tinggal di pesisir, segera menjauh dari pantai saat gempa kuat tanpa menunggu sirine.');
    if (flt.d < 50) A.push('〰️ Dekat sesar aktif: periksa kekuatan bangunan, amankan lemari dan benda berat, dan tentukan titik berlindung di rumah.');
    if (vol.d < 40) A.push('🌋 Dekat gunung api (' + vol.n + '): patuhi radius aman dan status PVMBG, siapkan masker dan kacamata untuk abu vulkanik.');
    if (ST.wx) { const pr = ST.wx.daily.precipitation_sum.reduce((a, b) => a + b, 0); if (pr < 5) A.push('🔥 Sepekan ke depan kering: jangan membakar sampah atau lahan, dan matikan api sepenuhnya.'); else if (pr > 120) A.push('🌧️ Curah hujan sepekan tinggi: waspadai banjir dan longsor, dan pantau info BMKG.'); }
    A.push('🎒 Siapkan tas siaga (air, obat, dokumen, senter, powerbank) dan sepakati titik kumpul keluarga.');
    A.push('🤲 Setelah ikhtiar, bertawakal: QS At-Taghabun 64:11 dan Al-Baqarah 2:155 mengajarkan sabar dan keyakinan bahwa musibah terjadi atas izin Allah.');
    return box('<h3>Saran tindakan untuk lokasimu</h3><ul class="al-ul">' + A.map(x => '<li>' + esc(x) + '</li>').join('') + '</ul><p class="small muted">Saran umum berdasarkan jarak perkiraan; bukan peringatan resmi. Ikuti BMKG, PVMBG, dan BNPB.</p>');
  }
  const TABS = Object.keys(TOPIK);
  const cache = {}, ST = { tab: 'ringkas', loc: null, eq: [], eqP: 'week', fires: [], oni: null, nino: null, vols: GEO.v };
  let map = null, L = null, LY = {}, aborted = false, stopFn = null;

  /* ---------- geometri (dari PETAQU) ---------- */
  const km = (a, b, c, e) => { const k = Math.cos((a + c) / 2 * R) * 111.32; return Math.hypot((b - e) * k, (a - c) * 110.57); };
  const dSeg = (la, lo, a, b) => { const k = Math.cos(la * R) * 111.32, px = lo * k, py = la * 110.57, ax = a[1] * k, ay = a[0] * 110.57, bx = b[1] * k, by = b[0] * 110.57, dx = bx - ax, dy = by - ay, l = dx * dx + dy * dy; let t = l ? ((px - ax) * dx + (py - ay) * dy) / l : 0; t = Math.max(0, Math.min(1, t)); return Math.hypot(px - (ax + t * dx), py - (ay + t * dy)); };
  const dLine = (la, lo, p) => { let m = 1e9; for (let i = 1; i < p.length; i++) m = Math.min(m, dSeg(la, lo, p[i - 1], p[i])); return m; };
  const nearestLine = (la, lo, arr) => arr.map(x => ({ n: x[0], d: dLine(la, lo, x[1]) })).sort((a, b) => a.d - b.d)[0];
  const nearestVol = (la, lo) => ST.vols.map(v => ({ n: v[0], d: km(la, lo, v[1], v[2]) })).sort((a, b) => a.d - b.d)[0];
  const inID = (la, lo) => la >= ID[0] && la <= ID[2] && lo >= ID[1] && lo <= ID[3];

  /* ---------- jaringan ---------- */
  async function getJSON(u, ms = 15000) {
    let last;
    for (let a = 0; a < 2; a++) {
      const c = new AbortController(), t = setTimeout(() => c.abort(), ms);
      try {
        const r = await fetch(u, { signal: c.signal });
        if (r.ok) return await r.json();
        last = new Error('HTTP ' + r.status);
        if (r.status !== 500 && r.status !== 502 && r.status !== 503 && r.status !== 504) throw last; /* 4xx (termasuk 429): jangan diulang */
      } catch (e) { last = e; if (/^HTTP (4|5)/.test(e.message || '') && !/^HTTP 50[0234]$/.test(e.message)) throw e; } finally { clearTimeout(t); }
      await new Promise(r => setTimeout(r, 900));
    }
    throw last;
  }
  const errMsg = e => /429/.test((e && e.message) || '') ? 'batas permintaan Open-Meteo tercapai, coba lagi 1–2 menit' : /HTTP/.test((e && e.message) || '') ? 'server menolak: ' + e.message : (e && e.name === 'AbortError') ? 'waktu habis, koneksi lambat' : 'periksa koneksi internet / pemblokir iklan';
  async function getTXT(u, ms = 15000) {
    const c = new AbortController(), t = setTimeout(() => c.abort(), ms);
    try { const r = await fetch(u, { signal: c.signal }); if (!r.ok) throw new Error(r.status); return await r.text(); } finally { clearTimeout(t); }
  }
  const WMO = c => c === 0 ? ['☀️', 'Cerah'] : c <= 2 ? ['🌤️', 'Cerah berawan'] : c === 3 ? ['☁️', 'Berawan'] : c <= 48 ? ['🌫️', 'Berkabut'] : c <= 57 ? ['🌦️', 'Gerimis'] : c <= 67 ? ['🌧️', 'Hujan'] : c <= 77 ? ['❄️', 'Salju'] : c <= 82 ? ['🌧️', 'Hujan lebat'] : c <= 86 ? ['❄️', 'Salju'] : ['⛈️', 'Badai petir'];
  const fmtT = ms => new Date(ms).toLocaleString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });

  async function loadLeaflet() {
    if (window.L) return window.L;
    await new Promise((ok, no) => {
      const l = document.createElement('link'); l.rel = 'stylesheet'; l.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css'; document.head.appendChild(l);
      const s = document.createElement('script'); s.src = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.js'; s.onload = ok; s.onerror = () => no(new Error('Leaflet gagal dimuat')); document.head.appendChild(s);
    });
    return window.L;
  }

  /* ---------- ayat ---------- */
  const surahCache = {};
  async function ayatHTML(list) {
    const out = [];
    for (const [s, a] of list) {
      try {
        if (!surahCache[s]) surahCache[s] = await getJSON('s/' + s + '.json', 20000);
        const x = surahCache[s].ayat.find(y => y.a === a); if (!x) continue;
        out.push('<a class="al-ay" href="#/surah/' + s + '?a=' + a + '"><div class="al-ar" dir="rtl" lang="ar">' + esc(x.ar) + '</div><div class="al-id">' + esc(x.id) + '</div><div class="al-ref">QS ' + s + ':' + a + ' · buka ayat ›</div></a>');
      } catch (e) { out.push('<a class="al-ay" href="#/surah/' + s + '?a=' + a + '"><div class="al-ref">QS ' + s + ':' + a + ' · buka ayat ›</div></a>'); }
    }
    return out.join('');
  }

  /* ---------- sumber data ---------- */
  async function loadGempa(per) {
    const feed = { day: '2.5_day', week: '2.5_week', month: '2.5_month' }[per] || '2.5_week';
    let ev = [], src = [];
    try {
      const g = await getJSON('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/' + feed + '.geojson', 20000);
      g.features.forEach(f => { const [lo, la, dp] = f.geometry.coordinates, p = f.properties; if (inID(la, lo)) ev.push({ la, lo, m: p.mag, dp, t: p.time, w: p.place || '', src: 'USGS', ts: p.tsunami === 1, url: p.url }); });
      src.push('USGS');
    } catch (e) { }
    try { /* BMKG: bisa gagal karena CORS; abaikan bila gagal */
      for (const n of ['gempaterkini', 'gempadirasakan']) {
        const j = await getJSON('https://data.bmkg.go.id/DataMKG/TEWS/' + n + '.json', 8000);
        (j.Infogempa.gempa || []).forEach(x => { const [la, lo] = String(x.Coordinates).split(',').map(Number); if (!isFinite(la)) return; ev.push({ la, lo, m: +x.Magnitude, dp: parseFloat(x.Kedalaman), t: Date.parse(x.DateTime), w: x.Wilayah, src: 'BMKG', pot: x.Potensi || '' }); });
      }
      src.push('BMKG');
    } catch (e) { }
    /* gabung duplikat: kejadian BMKG & USGS yang ±3 menit dan ±1° dianggap satu (pakai BMKG) */
    ev.sort((a, b) => (a.src === 'BMKG' ? -1 : 1) - (b.src === 'BMKG' ? -1 : 1));
    const keep = []; ev.forEach(e => { if (!keep.some(k => Math.abs(k.t - e.t) < 180000 && km(k.la, k.lo, e.la, e.lo) < 110)) keep.push(e); });
    keep.sort((a, b) => b.t - a.t); ST.eq = keep; ST.eqSrc = src.join(' + ') || 'tidak terjangkau'; return keep;
  }
  const tsPot = e => (e.m >= 7 && e.dp < 70) || (e.pot && /berpotensi tsunami/i.test(e.pot) && !/tidak berpotensi/i.test(e.pot)) || (e.ts && e.m >= 6.5);

  async function loadKarhutla() {
    const pts = []; let src = [];
    try {
      const j = await getJSON('https://eonet.gsfc.nasa.gov/api/v3/events?category=wildfires&status=open&limit=300&bbox=94,8,142,-12', 20000);
      (j.events || []).forEach(e => { const g = e.geometry[e.geometry.length - 1]; if (g && g.coordinates && g.type === 'Point') pts.push({ lo: g.coordinates[0], la: g.coordinates[1], n: e.title, t: Date.parse(g.date), s: 'NASA EONET' }); });
      src.push('NASA EONET');
    } catch (e) { }
    const key = store.get ? store.get('alamFirms', '') : '';
    if (key) {
      try {
        const t = await getTXT('https://firms.modaps.eosdis.nasa.gov/api/area/csv/' + encodeURIComponent(key) + '/VIIRS_SNPP_NRT/94,-12,142,8/1', 20000), ls = t.trim().split(/\r?\n/), h = ls[0].split(',');
        const iLa = h.indexOf('latitude'), iLo = h.indexOf('longitude'), iC = h.indexOf('confidence'), iD = h.indexOf('acq_date');
        ls.slice(1).forEach(l => { const c = l.split(','); if (c[iC] === 'l') return; pts.push({ la: +c[iLa], lo: +c[iLo], n: 'Titik panas VIIRS', t: Date.parse(c[iD]), s: 'NASA FIRMS' }); });
        src.push('NASA FIRMS (24 jam)');
      } catch (e) { src.push('FIRMS gagal (kunci salah / diblokir CORS)'); }
    }
    ST.fires = pts; ST.fireSrc = src.join(' + ') || 'tidak terjangkau'; return pts;
  }

  async function loadElnino(N) {
    /* Anomali SST Indo-Pasifik (NOAA OISST via ERDDAP, grid 2°). N hari: rata-rata beberapa irisan waktu pada rentang itu; 1 = terbaru.
       Deret harian Niño 3.4 & perairan Indonesia (30 hari) untuk grafik tren. ONI dari NOAA CPC (di-cache). */
    N = N || ST.nPer || 1; ST.ninoC = ST.ninoC || {};
    const out = { grid: [], n34: null, oni: null, N }, errs = [];
    const stride = N <= 1 ? 1 : N <= 7 ? 3 : N <= 14 ? 4 : 7, back = N <= 1 ? 0 : Math.floor((N - 1) / stride) * stride;
    const tsel = back ? 'last-' + back + ':' + stride + ':last' : 'last';
    const q = '.csv?anom%5B' + tsel + '%5D%5B0%5D%5B(-25):8:(25)%5D%5B(90.125):8:(289.875)%5D';
    const C = ['https://coastwatch.pfeg.noaa.gov/erddap/griddap/ncdcOisst21NrtAgg', 'https://upwell.pfeg.noaa.gov/erddap/griddap/ncdcOisst21NrtAgg', 'https://coastwatch.pfeg.noaa.gov/erddap/griddap/ncdcOisst21Agg', 'https://upwell.pfeg.noaa.gov/erddap/griddap/ncdcOisst21Agg'];
    let base = null;
    for (const b of C) {
      if (out.grid.length) break;
      try {
        const t = await getTXT(b + q, 35000), ls = t.trim().split(/\r?\n/).slice(2), agg = {}, times = {};
        ls.forEach(l => { const c = l.split(','), v = parseFloat(c[4]); times[c[0]] = 1; if (!isFinite(v)) return; const k = c[2] + '|' + c[3], a = agg[k] || (agg[k] = { la: +c[2], lo: +c[3], s: 0, n: 0 }); a.s += v; a.n++; });
        out.grid = Object.keys(agg).map(k => ({ la: agg[k].la, lo: agg[k].lo, v: agg[k].s / agg[k].n }));
        const tk = Object.keys(times).sort(); out.date = tk[tk.length - 1]; out.from = tk[0]; out.slices = tk.length;
        out.srcName = b.split('/')[2] + ' · ' + b.split('/').pop(); if (out.grid.length) base = b;
      } catch (e) { errs.push(b.split('/')[2] + '/' + b.split('/').pop() + ': ' + (e && e.message || e)); }
    }
    if (!out.grid.length) out.err = errs.join('; ');
    /* deret harian 30 hari (sekali per sesi) */
    if (base && !(ST.ser && ST.ser.n34 && ST.ser.n34.length)) {
      const mk = (la, lo) => base + '.csv?anom%5Blast-29:1:last%5D%5B0%5D%5B' + la + '%5D%5B' + lo + '%5D';
      const grp = t => { const by = {}; t.trim().split(/\r?\n/).slice(2).forEach(l => { const c = l.split(','), v = parseFloat(c[4]); if (isFinite(v)) { const d = c[0].slice(0, 10); (by[d] = by[d] || []).push(v); } }); return Object.keys(by).sort().map(d => ({ d, v: by[d].reduce((a, b) => a + b, 0) / by[d].length })); };
      const [a, b] = await Promise.all([getTXT(mk('(-5):8:(5)', '(190.125):8:(239.875)'), 30000).then(grp).catch(() => []), getTXT(mk('(-11):8:(6)', '(95.125):8:(140.875)'), 30000).then(grp).catch(() => [])]);
      ST.ser = { n34: a, idn: b };
    }
    const mean = arr => arr.length ? arr.reduce((x, p) => x + p.v, 0) / arr.length : null, ser = ST.ser || {};
    const n34s = (ser.n34 || []).slice(-N), idns = (ser.idn || []).slice(-N);
    const n = out.grid.filter(p => p.la >= -5 && p.la <= 5 && p.lo >= 190 && p.lo <= 240);
    out.n34 = n34s.length ? mean(n34s) : (n.length ? n.reduce((a, p) => a + p.v, 0) / n.length : null);
    const idn = out.grid.filter(p => p.la >= -11 && p.la <= 6 && p.lo >= 95 && p.lo <= 141);
    out.idn = idns.length ? mean(idns) : (idn.length ? idn.reduce((a, p) => a + p.v, 0) / idn.length : null);
    if (ST.oniC === undefined) {
      try {
        const t = await getTXT('https://www.cpc.ncep.noaa.gov/data/indices/oni.ascii.txt', 8000), S = ['DJF', 'JFM', 'FMA', 'MAM', 'AMJ', 'MJJ', 'JJA', 'JAS', 'ASO', 'SON', 'OND', 'NDJ'], a = [];
        t.split(/\r?\n/).forEach(l => { const m = l.match(/^\s*([A-Z]{3})\s+(\d{4})\s+[-\d.]+\s+(-?\d+(?:\.\d+)?)/); if (m && S.includes(m[1])) a.push({ s: m[1], y: +m[2], a: +m[3] }); });
        if (a.length > 100) { ST.oniC = { oni: a.slice(-12), oniOld: false }; try { localStorage.setItem('alam_oni', JSON.stringify(ST.oniC.oni)); } catch (e) { } } else throw 0;
      } catch (e) { let o = null; try { o = JSON.parse(localStorage.getItem('alam_oni') || 'null'); } catch (e2) { } ST.oniC = { oni: o, oniOld: !!o }; }
    }
    out.oni = ST.oniC.oni; out.oniOld = ST.oniC.oniOld;
    ST.nino = out; if (out.grid.length) ST.ninoC[N] = out; return out;
  }
  async function ensureNino() { const N = ST.nPer || 1; ST.ninoC = ST.ninoC || {}; if (ST.ninoC[N]) { ST.nino = ST.ninoC[N]; return ST.nino; } return loadElnino(N); }

  /* ---------- indeks potensi kering/karhutla per pulau (Open-Meteo, indikatif) ---------- */
  const FP = [['Banda Aceh', 5.55, 95.32], ['Medan', 3.6, 98.67], ['Bengkalis (Riau)', 1.5, 102.1], ['Pekanbaru', .51, 101.45], ['Jambi', -1.6, 103.6], ['Palembang', -2.98, 104.75], ['OKI (Sumsel)', -3.4, 105.5], ['Bengkulu', -3.8, 102.26], ['Lampung', -5.4, 105.26], ['Padang', -.95, 100.42], ['Batam', 1.1, 104],
    ['Pontianak', -.03, 109.34], ['Ketapang', -1.85, 110], ['Sintang', .08, 111.5], ['Palangka Raya', -2.2, 113.9], ['Pangkalan Bun', -2.7, 111.6], ['Banjarmasin', -3.32, 114.59], ['Samarinda', -.5, 117.15], ['Balikpapan', -1.24, 116.85], ['Tarakan', 3.3, 117.6], ['Berau', 2.15, 117.5],
    ['Serang', -6.12, 106.15], ['Jakarta', -6.2, 106.85], ['Bandung', -6.9, 107.6], ['Semarang', -6.97, 110.42], ['Yogyakarta', -7.8, 110.37], ['Surabaya', -7.26, 112.75], ['Banyuwangi', -8.2, 114.37],
    ['Denpasar', -8.67, 115.2], ['Mataram', -8.58, 116.12], ['Sumbawa Besar', -8.5, 117.42], ['Labuan Bajo', -8.5, 119.88], ['Waingapu', -9.65, 120.26], ['Maumere', -8.62, 122.2], ['Kupang', -10.18, 123.6],
    ['Manado', 1.47, 124.84], ['Gorontalo', .54, 123.06], ['Palu', -.9, 119.87], ['Mamuju', -2.68, 118.89], ['Makassar', -5.15, 119.43], ['Kendari', -3.97, 122.5], ['Luwuk', -.95, 122.78],
    ['Ternate', .78, 127.37], ['Ambon', -3.7, 128.18], ['Namlea (Buru)', -3.26, 127.1], ['Tual', -5.63, 132.75],
    ['Sorong', -.88, 131.26], ['Manokwari', -.86, 134.06], ['Nabire', -3.37, 135.5], ['Jayapura', -2.53, 140.72], ['Wamena', -4.1, 138.95], ['Timika', -4.55, 136.89], ['Merauke', -8.49, 140.4]];
  const cl = (x, a, b) => Math.max(a, Math.min(b, x));
  const dgCls = v => v >= 75 ? ['Ekstrem', '#7f1d1d'] : v >= 55 ? ['Tinggi', '#dc2626'] : v >= 35 ? ['Sedang', '#f59e0b'] : ['Rendah', '#16a34a'];
  async function loadDanger() {
    const j = await getJSON('https://api.open-meteo.com/v1/forecast?latitude=' + FP.map(p => p[1]).join() + '&longitude=' + FP.map(p => p[2]).join() + '&current=temperature_2m,relative_humidity_2m,wind_speed_10m&daily=precipitation_sum&past_days=7&forecast_days=1&wind_speed_unit=ms&timezone=auto', 25000);
    ST.fdg = (Array.isArray(j) ? j : [j]).map((x, i) => {
      const rain = (x.daily.precipitation_sum || []).slice(0, 7).reduce((a, b) => a + (b || 0), 0), c = x.current;
      const v = Math.round(cl(1 - rain / 40, 0, 1) * 45 + cl((c.temperature_2m - 26) / 10, 0, 1) * 20 + cl((80 - c.relative_humidity_2m) / 40, 0, 1) * 25 + cl(c.wind_speed_10m / 8, 0, 1) * 10);
      return { n: FP[i][0], la: FP[i][1], lo: FP[i][2], v, rain, t: c.temperature_2m, rh: c.relative_humidity_2m, w: c.wind_speed_10m };
    });
    return ST.fdg;
  }

  /* ---------- animasi angin (partikel) dari grid Open-Meteo ---------- */
  const WG = { la0: -11, dla: 3.4, nla: 6, lo0: 95, dlo: 4.2, nlo: 12 };
  const WC = { cv: null, raf: 0, P: [], on: false };
  async function loadWind() {
    if (ST.wind) return ST.wind;
    try { const c = store.get ? store.get('alamWindC', null) : null; if (c && c.g === WG.nla + 'x' + WG.nlo && Date.now() - c.t < 18e5 && c.U && c.U.length === WG.nla * WG.nlo) return (ST.wind = { U: c.U, V: c.V }); } catch (e) { }
    const pts = []; for (let i = 0; i < WG.nla; i++) for (let k = 0; k < WG.nlo; k++) pts.push([WG.la0 + i * WG.dla, WG.lo0 + k * WG.dlo]);
    const U = [], V = [];
    for (let i = 0; i < pts.length; i += 80) {
      const c = pts.slice(i, i + 80), j = await getJSON('https://api.open-meteo.com/v1/forecast?latitude=' + c.map(p => p[0]).join() + '&longitude=' + c.map(p => p[1]).join() + '&current=wind_speed_10m,wind_direction_10m&wind_speed_unit=ms', 25000);
      (Array.isArray(j) ? j : [j]).forEach(x => { const sp = x.current.wind_speed_10m, dr = x.current.wind_direction_10m * R; U.push(-sp * Math.sin(dr)); V.push(-sp * Math.cos(dr)); });
    }
    try { store.set && store.set('alamWindC', { t: Date.now(), g: WG.nla + 'x' + WG.nlo, U, V }); } catch (e) { }
    return (ST.wind = { U, V });
  }
  function windAt(la, lo) {
    const w = ST.wind; if (!w) return null;
    const fy = (la - WG.la0) / WG.dla, fx = (lo - WG.lo0) / WG.dlo; if (fy < -0.5 || fx < -0.5 || fy > WG.nla - 0.5 || fx > WG.nlo - 0.5) return null;
    const y = cl(fy, 0, WG.nla - 1.001), x = cl(fx, 0, WG.nlo - 1.001), y0 = Math.floor(y), x0 = Math.floor(x), ty = y - y0, tx = x - x0, g = (A, r, c) => A[r * WG.nlo + c];
    const f = A => (g(A, y0, x0) * (1 - tx) + g(A, y0, x0 + 1) * tx) * (1 - ty) + (g(A, y0 + 1, x0) * (1 - tx) + g(A, y0 + 1, x0 + 1) * tx) * ty;
    return { u: f(w.U), v: f(w.V) };
  }
  function stopWind() { if (WC.h && map) { map.off('movestart zoomstart', WC.h.c); map.off('resize', WC.h.f); map.off('moveend zoomend', WC.h.s); } WC.h = null; WC.on = false; cancelAnimationFrame(WC.raf); if (WC.cv) { WC.cv.remove(); WC.cv = null; } }
  function startWind() {
    stopWind(); if (!map || !ST.wind) return;
    const box = map.getContainer(), cv = document.createElement('canvas'); cv.className = 'al-wind'; box.appendChild(cv); WC.cv = cv; WC.on = true;
    const ctx = cv.getContext('2d'), fit = () => { cv.width = box.clientWidth; cv.height = box.clientHeight; }, clear = () => ctx.clearRect(0, 0, cv.width, cv.height);
    fit(); const N = Math.min(900, Math.round(cv.width * cv.height / 450));
    const spawn = p => { const b = map.getBounds(), la = cl(b.getSouth() + Math.random() * (b.getNorth() - b.getSouth()), WG.la0, WG.la0 + (WG.nla - 1) * WG.dla), lo = cl(b.getWest() + Math.random() * (b.getEast() - b.getWest()), WG.lo0, WG.lo0 + (WG.nlo - 1) * WG.dlo); p.la = la; p.lo = lo; p.age = Math.floor(Math.random() * 40); return p; };
    WC.P = Array.from({ length: N }, () => spawn({}));
    WC.h = { c: clear, f: fit, s: () => WC.P.forEach(spawn) }; map.on('movestart zoomstart', WC.h.c); map.on('resize', WC.h.f); map.on('moveend zoomend', WC.h.s);
    const frame = () => {
      if (!WC.on) return; WC.raf = requestAnimationFrame(frame); if (document.hidden) return;
      ctx.globalCompositeOperation = 'destination-out'; ctx.fillStyle = 'rgba(0,0,0,.07)'; ctx.fillRect(0, 0, cv.width, cv.height); ctx.globalCompositeOperation = 'source-over'; ctx.lineWidth = 1.4;
      for (const p of WC.P) {
        const w = windAt(p.la, p.lo); if (!w || p.age++ > 90) { spawn(p); p.age = 0; continue; }
        const a = map.latLngToContainerPoint([p.la, p.lo]), sp = Math.hypot(w.u, w.v), nx = a.x + w.u * .45, ny = a.y - w.v * .45;
        ctx.strokeStyle = 'hsla(' + Math.round(215 - Math.min(sp, 14) * 14) + ',90%,' + (map.getContainer().closest('[data-theme=dark]') ? 70 : 38) + '%,.85)'; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(nx, ny); ctx.stroke();
        const ll = map.containerPointToLatLng([nx, ny]); p.la = ll.lat; p.lo = ll.lng;
      }
    };
    frame();
  }
  const windWanted = t => ST.windPref != null ? ST.windPref : (t === 'cuaca' || t === 'elnino');
  async function syncWind() {
    const btn = $('alWind'); const want = windWanted(ST.tab); if (btn) btn.classList.toggle('on', want);
    if (!want || !map) return stopWind();
    try { await loadWind(); if (windWanted(ST.tab) && map) startWind(); } catch (e) { toast('Data angin gagal dimuat: ' + errMsg(e)); }
  }

  /* ---------- peta ---------- */
  const eqCol = m => m >= 7 ? '#7f1d1d' : m >= 6 ? '#dc2626' : m >= 5 ? '#f97316' : m >= 4 ? '#eab308' : '#84cc16';
  const anCol = v => { const a = Math.min(1, Math.abs(v) / 2); return v >= 0 ? 'rgba(220,38,38,' + (0.15 + a * 0.6) + ')' : 'rgba(37,99,235,' + (0.15 + a * 0.6) + ')'; };
  const group = k => LY[k] || (LY[k] = L.layerGroup());
  function clearLY() { Object.keys(LY).forEach(k => { if (k === 'pin') return; const g = LY[k]; if (g.clearLayers) g.clearLayers(); map.removeLayer(g); }); const p = LY.pin; LY = p ? { pin: p } : {}; }

  function drawSesar(sub = true) {
    const g = group('sesar');
    GEO.s.forEach(x => L.polyline(x[1], { color: '#dc2626', weight: 4, opacity: .85, dashArray: '8 5' }).bindTooltip(x[0] + ' (zona subduksi / palung)').addTo(g));
    GEO.f.forEach(x => L.polyline(x[1], { color: '#7c3aed', weight: 3, opacity: .9 }).bindTooltip(x[0] + ' (sesar aktif)').addTo(g));
    g.addTo(map);
  }
  function drawGunung() {
    const g = group('gunung');
    ST.vols.forEach(v => L.marker([v[1], v[2]], { icon: L.divIcon({ className: 'al-ico', html: '🌋', iconSize: [22, 22] }) }).bindPopup('<b>' + esc(v[0]) + '</b><br>Status terkini: <a target="_blank" rel="noopener" href="https://magma.esdm.go.id">MAGMA Indonesia (PVMBG)</a>').addTo(g));
    g.addTo(map);
  }
  function drawGempa(onlyTs) {
    const g = group('gempa');
    ST.eq.filter(e => !onlyTs || tsPot(e)).forEach(e => L.circleMarker([e.la, e.lo], { radius: 3 + e.m * 1.6, color: tsPot(e) ? '#0369a1' : '#222', weight: tsPot(e) ? 3 : 1, fillColor: eqCol(e.m), fillOpacity: .75 })
      .bindPopup('<b>M ' + e.m.toFixed(1) + '</b> · ' + Math.round(e.dp) + ' km<br>' + esc(e.w) + '<br>' + fmtT(e.t) + ' · ' + e.src + (tsPot(e) ? '<br><b style="color:#0369a1">⚠ Berpotensi tsunami (indikatif)</b>. Cek BMKG.' : '')).addTo(g));
    g.addTo(map);
  }
  function drawKarhutla(full) {
    const g = group('api'), d = new Date(Date.now() - 864e5).toISOString().slice(0, 10);
    L.tileLayer('https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/MODIS_Terra_Thermal_Anomalies_All/default/' + d + '/GoogleMapsCompatible_Level6/{z}/{y}/{x}.png', { maxNativeZoom: 6, maxZoom: 12, opacity: .95, attribution: 'NASA GIBS / MODIS' }).addTo(g);
    L.tileLayer('https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/VIIRS_SNPP_Thermal_Anomalies_375m_All/default/' + d + '/GoogleMapsCompatible_Level8/{z}/{y}/{x}.png', { maxNativeZoom: 8, maxZoom: 12, opacity: .95, attribution: 'NASA GIBS / VIIRS' }).addTo(g);
    if (full) (ST.fdg || []).forEach(p => { const c = dgCls(p.v); L.circleMarker([p.la, p.lo], { radius: 13, color: c[1], weight: 2, fillColor: c[1], fillOpacity: .35 }).bindPopup('<b>' + esc(p.n) + '</b><br>Potensi karhutla: <b style="color:' + c[1] + '">' + c[0] + ' (' + p.v + ')</b><br>Hujan 7 hari: ' + p.rain.toFixed(0) + ' mm · ' + Math.round(p.t) + '°C · RH ' + p.rh + '% · angin ' + p.w.toFixed(1) + ' m/s').addTo(g); });
    ST.fires.forEach(f => L.marker([f.la, f.lo], { icon: L.divIcon({ className: 'al-ico', html: '🔥', iconSize: [20, 20] }) }).bindPopup('<b>' + esc(f.n) + '</b><br>' + (f.t ? fmtT(f.t) : '') + ' · ' + f.s).addTo(g));
    g.addTo(map);
  }
  /* Kabut El Niño: perkiraan sebaran kabut asap. Makin kuat El Niño (anomali Niño 3.4 / ONI) makin pekat; berpusat di titik panas satelit bila ada, kalau tidak di zona gambut rawan. */
  const ninoIdx = () => { const n = ST.nino || {}, o = n.oni && n.oni[n.oni.length - 1]; let m = null; try { m = JSON.parse(localStorage.getItem('alam_oni_manual') || 'null'); } catch (e) { } return n.n34 != null ? n.n34 : (o ? o.a : (m != null ? m : 0)); };
  function drawKabut() {
    const g = group('kabut'), s = ninoIdx(), k = Math.max(.08, Math.min(1, (s + .3) / 1.8));
    let pts = []; const seen = {};
    (ST.fires || []).forEach(f => { const key = Math.round(f.la / 1.5) + ',' + Math.round(f.lo / 1.5); if (f.la > -11 && f.la < 6.5 && f.lo > 95 && f.lo < 141) { (seen[key] = seen[key] || { la: 0, lo: 0, c: 0 }); const o = seen[key]; o.la += f.la; o.lo += f.lo; o.c++; } });
    Object.keys(seen).forEach(x => { const o = seen[x]; pts.push({ la: o.la / o.c, lo: o.lo / o.c, w: Math.min(1, .35 + o.c / 25) }); });
    pts.sort((a, b) => b.w - a.w); pts = pts.slice(0, 40);
    if (pts.length < 4) pts = [[-1.2, 101.8], [-2.8, 104.2], [-0.6, 109.8], [-2.6, 113.4], [-3.2, 115.2], [-7.8, 139.5], [0.5, 102.2]].map(p => ({ la: p[0], lo: p[1], w: .7 }));
    pts.forEach(p => {
      L.circle([p.la, p.lo], { radius: (140000 + 160000 * k) * (.7 + .3 * p.w), stroke: false, fillColor: '#b8a58a', fillOpacity: (.12 + .38 * k) * p.w, className: 'al-haze', interactive: false }).addTo(g);
      L.circle([p.la, p.lo], { radius: (70000 + 90000 * k) * (.7 + .3 * p.w), stroke: false, fillColor: '#8c7b66', fillOpacity: (.08 + .3 * k) * p.w, className: 'al-haze al-haze2', interactive: false }).addTo(g);
    });
    g.addTo(map);
  }
  function drawElnino() {
    const g = group('nino'), r = L.canvas({ padding: .5 });
    (ST.nino.grid || []).forEach(p => L.rectangle([[p.la - 1, p.lo - 1], [p.la + 1, p.lo + 1]], { renderer: r, stroke: false, fillColor: p.v >= 0 ? '#dc2626' : '#2563eb', fillOpacity: Math.min(.75, .1 + Math.abs(p.v) / 3.2) }).bindTooltip('Anomali SST' + ((ST.nPer || 1) > 1 ? ' (rata-rata ' + ST.nPer + ' hari)' : '') + ' ' + (p.v > 0 ? '+' : '') + p.v.toFixed(1) + ' °C').addTo(g));
    L.rectangle([[-5, 190], [5, 240]], { color: '#111', weight: 2, fill: false, dashArray: '5 4' }).bindTooltip('Wilayah Niño 3.4 (acuan El Niño/La Niña)').addTo(g);
    g.addTo(map);
    drawKabut();
    group('sx').addTo(map); renderSx();
    if (!map._alSx) { map._alSx = true; map.on('moveend', () => { clearTimeout(SXQ.tm); SXQ.tm = setTimeout(renderSx, 250); }); }
  }
  /* ---------- doa menurut cuaca ---------- */
  const DOA = {
    hujan: { t: 'Saat turun hujan', ar: 'اللَّهُمَّ صَيِّبًا نَافِعًا', la: 'Allāhumma ṣayyiban nāfi‘ā', id: 'Ya Allah, turunkanlah hujan yang bermanfaat.', src: 'HR. Bukhari' },
    lebat: { t: 'Hujan lebat / khawatir banjir', ar: 'اللَّهُمَّ حَوَالَيْنَا وَلَا عَلَيْنَا، اللَّهُمَّ عَلَى الْآكَامِ وَالظِّرَابِ وَبُطُونِ الْأَوْدِيَةِ وَمَنَابِتِ الشَّجَرِ', la: 'Allāhumma ḥawālaynā wa lā ‘alaynā, Allāhumma ‘alal-ākāmi waẓ-ẓirābi wa buṭūnil-awdiyati wa manābitis-syajar', id: 'Ya Allah, turunkan hujan di sekitar kami dan jangan menimpa kami; turunkan di dataran tinggi, bukit-bukit, perut lembah, dan tempat tumbuhnya pohon.', src: 'HR. Bukhari & Muslim' },
    petir: { t: 'Mendengar guruh / petir', ar: 'سُبْحَانَ الَّذِي يُسَبِّحُ الرَّعْدُ بِحَمْدِهِ وَالْمَلَائِكَةُ مِنْ خِيفَتِهِ', la: 'Subḥānal-ladzī yusabbiḥur-ra‘du biḥamdihi wal-malā’ikatu min khīfatih', id: 'Maha Suci Allah yang guruh bertasbih dengan memuji-Nya, begitu pula para malaikat karena takut kepada-Nya.', src: 'Al-Muwaththa\' Malik; lihat QS 13:13' },
    angin: { t: 'Angin kencang', ar: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ خَيْرَهَا وَخَيْرَ مَا فِيهَا وَخَيْرَ مَا أُرْسِلَتْ بِهِ، وَأَعُوذُ بِكَ مِنْ شَرِّهَا وَشَرِّ مَا فِيهَا وَشَرِّ مَا أُرْسِلَتْ بِهِ', la: 'Allāhumma innī as’aluka khayrahā wa khayra mā fīhā wa khayra mā ursilat bih, wa a‘ūdzu bika min syarrihā wa syarri mā fīhā wa syarri mā ursilat bih', id: 'Ya Allah, aku memohon kepada-Mu kebaikan angin ini, kebaikan yang ada di dalamnya, dan kebaikan yang dibawanya; aku berlindung kepada-Mu dari keburukannya, keburukan yang ada di dalamnya, dan keburukan yang dibawanya.', src: 'HR. Muslim' },
    mendung: { t: 'Melihat mendung / awan gelap', ar: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ شَرِّ مَا فِيهِ', la: 'Allāhumma innī a‘ūdzu bika min syarri mā fīh', id: 'Ya Allah, aku berlindung kepada-Mu dari keburukan yang ada di dalamnya.', src: 'HR. Abu Dawud' },
    kabut: { t: 'Berkendara saat berkabut', ar: 'بِسْمِ اللَّهِ تَوَكَّلْتُ عَلَى اللَّهِ، وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ', la: 'Bismillāhi tawakkaltu ‘alallāh, wa lā ḥawla wa lā quwwata illā billāh', id: 'Dengan nama Allah, aku bertawakal kepada Allah; tiada daya dan kekuatan kecuali dengan pertolongan Allah.', src: 'HR. Abu Dawud & Tirmidzi' },
    panas: { t: 'Kemarau / panas terik: memohon hujan', ar: 'اللَّهُمَّ أَغِثْنَا، اللَّهُمَّ أَغِثْنَا، اللَّهُمَّ أَغِثْنَا', la: 'Allāhumma aghitsnā (3×)', id: 'Ya Allah, turunkanlah hujan kepada kami (diulang tiga kali).', src: 'HR. Bukhari & Muslim' },
    cerah: { t: 'Hari cerah: doa pagi', ar: 'اللَّهُمَّ بِكَ أَصْبَحْنَا وَبِكَ أَمْسَيْنَا وَبِكَ نَحْيَا وَبِكَ نَمُوتُ وَإِلَيْكَ النُّشُورُ', la: 'Allāhumma bika aṣbaḥnā wa bika amsaynā wa bika naḥyā wa bika namūtu wa ilaykan-nusyūr', id: 'Ya Allah, dengan-Mu kami memasuki pagi dan petang, dengan-Mu kami hidup dan mati, dan kepada-Mu kami dibangkitkan.', src: 'HR. Tirmidzi' },
    sesudah: { t: 'Sesudah hujan', ar: 'مُطِرْنَا بِفَضْلِ اللَّهِ وَرَحْمَتِهِ', la: 'Muṭirnā bifaḍlillāhi wa raḥmatih', id: 'Kami diberi hujan karena karunia dan rahmat Allah.', src: 'HR. Bukhari & Muslim' }
  };

  /* Doa untuk tab bencana & iklim. Hanya doa yang bersumber ayat Al-Qur'an atau hadis yang dikenal; tidak ada doa khusus "gempa" dari Nabi ﷺ, jadi dipakai doa perlindungan umum. */
  const DOA2 = {
    khasf: { t: 'Memohon dijaga dari segala arah (termasuk dari bawah / bumi)', ar: 'اللَّهُمَّ احْفَظْنِي مِنْ بَيْنِ يَدَيَّ وَمِنْ خَلْفِي وَعَنْ يَمِينِي وَعَنْ شِمَالِي وَمِنْ فَوْقِي، وَأَعُوذُ بِعَظَمَتِكَ أَنْ أُغْتَالَ مِنْ تَحْتِي', la: 'Allāhummaḥfaẓnī min bayni yadayya wa min khalfī wa ‘an yamīnī wa ‘an syimālī wa min fauqī, wa a‘ūdzu bi‘aẓamatika an ughtāla min taḥtī', id: 'Ya Allah, jagalah aku dari depan, belakang, kanan, kiri, dan atasku; aku berlindung dengan keagungan-Mu dari dibinasakan secara tiba-tiba dari arah bawahku (oleh para ulama dimaknai antara lain ditelan bumi).', src: 'HR. Abu Dawud & Ibnu Majah' },
    nikmat: { t: 'Berlindung dari datangnya azab secara tiba-tiba', ar: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ زَوَالِ نِعْمَتِكَ وَتَحَوُّلِ عَافِيَتِكَ وَفُجَاءَةِ نِقْمَتِكَ وَجَمِيعِ سَخَطِكَ', la: 'Allāhumma innī a‘ūdzu bika min zawāli ni‘matika wa taḥawwuli ‘āfiyatika wa fujā’ati niqmatika wa jamī‘i sakhaṭika', id: 'Ya Allah, aku berlindung kepada-Mu dari hilangnya nikmat-Mu, berubahnya keselamatan dari-Mu, datangnya siksa-Mu secara tiba-tiba, dan dari segala kemurkaan-Mu.', src: 'HR. Muslim' },
    kalimat: { t: 'Berlindung dengan kalimat-kalimat Allah', ar: 'أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ', la: 'A‘ūdzu bikalimātillāhit-tāmmāti min syarri mā khalaq', id: 'Aku berlindung dengan kalimat-kalimat Allah yang sempurna dari kejahatan makhluk yang Dia ciptakan.', src: 'HR. Muslim' },
    bismillah: { t: 'Dzikir pagi & petang: tiada yang membahayakan bersama nama Allah', ar: 'بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ', la: 'Bismillāhilladzī lā yaḍurru ma‘asmihī syai’un fil-arḍi wa lā fis-samā’i wa huwas-samī‘ul-‘alīm', id: 'Dengan nama Allah yang bersama nama-Nya tidak ada sesuatu pun di bumi maupun di langit yang dapat membahayakan, dan Dia Maha Mendengar lagi Maha Mengetahui. (dibaca 3× pagi dan petang)', src: 'HR. Abu Dawud & Tirmidzi' },
    musibah: { t: 'Ketika tertimpa musibah', ar: 'إِنَّا لِلَّهِ وَإِنَّا إِلَيْهِ رَاجِعُونَ، اللَّهُمَّ أْجُرْنِي فِي مُصِيبَتِي وَأَخْلِفْ لِي خَيْرًا مِنْهَا', la: 'Innā lillāhi wa innā ilaihi rāji‘ūn, Allāhumma’-jurnī fī muṣībatī wa akhlif lī khairan minhā', id: 'Sesungguhnya kami milik Allah dan kepada-Nya kami kembali. Ya Allah, berilah aku pahala dalam musibahku dan gantilah dengan yang lebih baik darinya.', src: 'QS. Al-Baqarah: 156; HR. Muslim' },
    afiyah: { t: 'Memohon ampunan & keselamatan', ar: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي الدُّنْيَا وَالْآخِرَةِ', la: 'Allāhumma innī as’alukal-‘afwa wal-‘āfiyata fid-dunyā wal-ākhirah', id: 'Ya Allah, aku memohon kepada-Mu ampunan dan keselamatan di dunia dan akhirat.', src: 'HR. Abu Dawud & Ibnu Majah' },
    hasbun: { t: 'Berserah diri saat genting', ar: 'حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ', la: 'Ḥasbunallāhu wa ni‘mal-wakīl', id: 'Cukuplah Allah bagi kami, dan Dia sebaik-baik pelindung.', src: 'QS. Ali ‘Imran: 173; HR. Bukhari' },
    yunus: { t: 'Doa Nabi Yunus ‘alaihis-salām saat kesempitan', ar: 'لَا إِلَٰهَ إِلَّا أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ الظَّالِمِينَ', la: 'Lā ilāha illā anta subḥānaka innī kuntu minaẓ-ẓālimīn', id: 'Tidak ada Tuhan selain Engkau, Maha Suci Engkau; sungguh aku termasuk orang-orang yang zalim.', src: 'QS. Al-Anbiya: 87; HR. Tirmidzi' },
    laut: { t: 'Berlayar & di dekat laut', ar: 'بِسْمِ اللَّهِ مَجْرَاهَا وَمُرْسَاهَا إِنَّ رَبِّي لَغَفُورٌ رَحِيمٌ', la: 'Bismillāhi majrēhā wa mursāhā, inna rabbī laghafūrur raḥīm', id: 'Dengan nama Allah di waktu berlayar dan berlabuhnya. Sungguh, Tuhanku Maha Pengampun lagi Maha Penyayang.', src: 'QS. Hud: 41' },
    api: { t: 'Ayat tentang api yang menjadi dingin', ar: 'قُلْنَا يَا نَارُ كُونِي بَرْدًا وَسَلَامًا عَلَىٰ إِبْرَاهِيمَ', la: 'Qulnā yā nāru kūnī bardan wa salāman ‘alā Ibrāhīm', id: 'Kami berfirman, “Wahai api, jadilah dingin dan penyelamat bagi Ibrahim.” (ayat ini dibaca sebagai pengharapan perlindungan)', src: 'QS. Al-Anbiya: 69' },
    istisqa: { t: 'Doa memohon hujan (istisqa’)', ar: 'اللَّهُمَّ اسْقِنَا غَيْثًا مُغِيثًا هَنِيئًا مَرِيئًا نَافِعًا غَيْرَ ضَارٍّ عَاجِلًا غَيْرَ آجِلٍ', la: 'Allāhummasqinā gaitsan mugītsan hanī’an marī’an nāfi‘an gaira ḍārrin ‘ājilan gaira ājil', id: 'Ya Allah, turunkanlah kepada kami hujan yang menolong, menyenangkan, menyuburkan, bermanfaat, tidak membahayakan, segera dan tidak ditunda.', src: 'HR. Abu Dawud' },
    istighfar: { t: 'Istighfar: kunci turunnya hujan & rezeki', ar: 'فَقُلْتُ اسْتَغْفِرُوا رَبَّكُمْ إِنَّهُ كَانَ غَفَّارًا يُرْسِلِ السَّمَاءَ عَلَيْكُمْ مِدْرَارًا', la: 'Fa qultustagfirū rabbakum innahū kāna gaffārā, yursilis-samā’a ‘alaikum midrārā', id: 'Maka aku (Nuh) berkata, “Mohonlah ampun kepada Tuhanmu, sungguh Dia Maha Pengampun, niscaya Dia menurunkan hujan yang lebat kepadamu.”', src: 'QS. Nuh: 10–11' },
    rezeki: { t: 'Kecukupan rezeki saat paceklik / krisis', ar: 'اللَّهُمَّ اكْفِنِي بِحَلَالِكَ عَنْ حَرَامِكَ وَأَغْنِنِي بِفَضْلِكَ عَمَّنْ سِوَاكَ', la: 'Allāhummak-finī biḥalālika ‘an ḥarāmika wa agninī bifaḍlika ‘amman siwāk', id: 'Ya Allah, cukupkanlah aku dengan yang halal dari-Mu sehingga tidak butuh yang haram, dan kayakanlah aku dengan karunia-Mu sehingga tidak butuh selain-Mu.', src: 'HR. Tirmidzi' }
  };
  const DOA_TAB = {
    ringkas: ['afiyah', 'bismillah', 'kalimat', 'musibah'],
    gempa: ['khasf', 'nikmat', 'kalimat', 'musibah'],
    tsunami: ['laut', 'yunus', 'hasbun', 'khasf', 'musibah'],
    sesar: ['khasf', 'nikmat', 'afiyah', 'musibah'],
    gunung: ['kalimat', 'bismillah', 'nikmat', 'hasbun', 'musibah'],
    karhutla: ['hasbun', 'api', 'panas', 'istighfar', 'kabut'],
    elnino: ['istisqa', 'panas', 'istighfar', 'rezeki']
  };
  const DOA_TIP = {
    ringkas: 'Berdoa tidak menggantikan ikhtiar: pantau info resmi BMKG, PVMBG, dan BNPB, dan siapkan tas siaga.',
    gempa: 'Saat gempa: lindungi kepala, menjauh dari kaca dan bangunan rapuh, lalu berlindung di tempat aman. Setelah reda, waspada gempa susulan.',
    tsunami: 'Gempa kuat di pantai atau air laut surut tiba-tiba: segera ke tempat tinggi tanpa menunggu sirine.',
    sesar: 'Kenali jalur evakuasi dan bangunan tahan gempa di sekitarmu; ikhtiar sebelum berdoa.',
    gunung: 'Patuhi radius aman dan Level I–IV PVMBG; siapkan masker dan kacamata saat abu vulkanik.',
    karhutla: 'Jangan membakar lahan; laporkan titik api ke BPBD / SiPongi. Pakai masker saat berasap.',
    elnino: 'Hemat air dan pangan, serta perbanyak istighfar dan sedekah, sambil mengikuti prakiraan musim BMKG.'
  };

  const doaIds = (code, wind, temp) => {
    const o = [];
    if (code >= 95) o.push('petir', 'lebat'); else if ([65, 82, 63, 81].includes(code)) o.push('lebat', 'hujan'); else if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) o.push('hujan');
    else if (code === 45 || code === 48) o.push('kabut'); else if (code === 3) o.push('mendung'); else o.push(temp >= 33 ? 'panas' : 'cerah');
    if (wind >= 36) o.push('angin');
    if (code >= 51 && code <= 99) o.push('sesudah');
    return o.filter((x, i) => o.indexOf(x) === i);
  };
  const doaHTML = (ids, max) => ids.slice(0, max || 9).map(k => { const x = DOA[k] || DOA2[k]; return '<div class="al-doa"><button class="btn al-cp" type="button" data-cp aria-label="Salin doa" title="Salin doa">📋</button><b>' + esc(x.t) + '</b><div class="al-ar" dir="rtl" lang="ar">' + esc(x.ar) + '</div><div class="al-la">' + esc(x.la) + '</div><div class="al-id">' + esc(x.id) + '</div><div class="al-ref">' + esc(x.src) + '</div></div>'; }).join('');
  const SEV = c => c >= 95 ? 6 : c >= 80 ? 5 : c >= 61 ? 4 : c >= 51 ? 3 : c >= 45 ? 2 : c >= 3 ? 1 : 0;

  /* ---------- cuaca per wilayah: pulau -> provinsi -> kabupaten/kota (tingkat detail mengikuti zoom) ---------- */
  const WIL = window.ALAM_WIL || [], WX = {}, WXQ = { tok: 0, tm: 0 };
  try { const c = store.get ? store.get('alamWxC', null) : null; if (c && c.d && Date.now() - c.t < 9e5) Object.assign(WX, c.d); } catch (e) { }
  const WXV = 'current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,precipitation';
  async function fetchWx(items) {
    const need = items.filter(i => !WX[i.k]);
    for (let i = 0; i < need.length; i += 60) {
      const c = need.slice(i, i + 60);
      try {
        const j = await getJSON('https://api.open-meteo.com/v1/forecast?latitude=' + c.map(p => p.la).join() + '&longitude=' + c.map(p => p.lo).join() + '&' + WXV + '&timezone=auto', 20000);
        (Array.isArray(j) ? j : [j]).forEach((x, n) => { const q = x.current; WX[c[n].k] = { t: q.temperature_2m, rh: q.relative_humidity_2m, code: q.weather_code, w: q.wind_speed_10m, r: q.precipitation }; });
        WXQ.warned = 0;
      } catch (e) { if (!WXQ.warned) { WXQ.warned = 1; toast('Data cuaca gagal dimuat: ' + errMsg(e)); } }
    }
    try { store.set && store.set('alamWxC', { t: Date.now(), d: WX }); } catch (e) { }
  }
  const provItems = () => WIL.map(p => ({ k: 'p:' + p[0], n: p[0], la: p[1], lo: p[2], pulau: p[3], lv: 'prov' }));
  const kabItems = () => { const o = []; WIL.forEach(p => p[4].forEach(k => o.push({ k: 'k:' + p[0] + ':' + k[0], n: (k[3] ? 'Kota ' : 'Kab. ') + k[0], prov: p[0], la: k[1], lo: k[2], lv: 'kab' }))); return o; };
  let KABS = null;
  function wxLabel(it, z) {
    const w = WX[it.k]; if (!w) return null; const ic = WMO(w.code), cls = w.code >= 95 ? ' t' : (SEV(w.code) >= 3 && SEV(w.code) <= 5) ? ' r' : '';
    const nm = (it.lv === 'pulau' && z <= 4) || (it.lv === 'prov' && z >= 6) || (it.lv === 'kab' && z >= 9);
    const det = it.lv === 'kab' && z >= 11 ? ' · ' + ic[1] + ' · ' + Math.round(w.w) + ' km/j' : '';
    return '<div class="al-wxi' + cls + (it.lv === 'prov' ? ' pv' : it.lv === 'pulau' ? ' pl' : '') + '"><span>' + ic[0] + '</span><b>' + Math.round(w.t) + '°</b>' + (nm ? '<em>' + esc(it.n) + det + '</em>' : '') + '</div>';
  }
  function wxPopup(it) {
    const w = WX[it.k]; if (!w) return '';
    const ic = WMO(w.code), ids = doaIds(w.code, w.w, w.t);
    let h = '<div class="al-pop"><b>' + esc(it.n) + (it.prov ? ' <small>' + esc(it.prov) + '</small>' : '') + '</b><div>' + ic[0] + ' ' + ic[1] + ' · <b>' + Math.round(w.t) + '°C</b></div><div class="small muted">Lembap ' + w.rh + '% · angin ' + Math.round(w.w) + ' km/j · hujan ' + w.r + ' mm</div>';
    if (it.lv === 'pulau' && it.list) h += '<div class="al-plist">' + it.list.map(p => WX[p.k] ? '<span>' + WMO(WX[p.k].code)[0] + ' ' + esc(p.n.replace('Kepulauan ', 'Kep. ')) + ' <b>' + Math.round(WX[p.k].t) + '°</b></span>' : '').join('') + '</div>';
    h += '<details open><summary class="small"><b>Doa untuk cuaca ini</b></summary>' + doaHTML(ids, 2) + '</details><div class="small muted">Ketuk Panel 📊 untuk semua doa &amp; prakiraan 7 hari.</div></div>';
    return h;
  }
  async function renderWx() {
    if (!map || ST.tab !== 'cuaca') return; const tok = ++WXQ.tok, g = group('cuaca'), z = map.getZoom();
    let items, lvName;
    if (z <= 4) {
      lvName = 'Pulau'; const P = provItems(), by = {}; P.forEach(p => (by[p.pulau] = by[p.pulau] || []).push(p));
      items = Object.keys(by).map(n => { const l = by[n]; return { k: 'pl:' + n, n, la: l.reduce((a, b) => a + b.la, 0) / l.length, lo: l.reduce((a, b) => a + b.lo, 0) / l.length, lv: 'pulau', list: l }; });
      await fetchWx(P); if (tok !== WXQ.tok) return;
      items.forEach(it => { const ws = it.list.map(p => WX[p.k]).filter(Boolean); if (!ws.length) return; const cnt = {}; ws.forEach(w => cnt[w.code] = (cnt[w.code] || 0) + 1); const code = +Object.keys(cnt).sort((a, b) => cnt[b] - cnt[a] || SEV(b) - SEV(a))[0]; const av = f => ws.reduce((a, w) => a + w[f], 0) / ws.length; WX[it.k] = { t: av('t'), rh: Math.round(av('rh')), code: ws.some(w => w.code >= 95) && cnt[code] < ws.length / 2 ? code : code, w: av('w'), r: +av('r').toFixed(1) }; });
    } else if (z <= 6) {
      lvName = 'Provinsi'; items = provItems(); await fetchWx(items);
    } else {
      lvName = 'Kabupaten/Kota'; KABS = KABS || kabItems(); const b = map.getBounds().pad(.15), c = map.getCenter();
      items = KABS.filter(k => b.contains([k.la, k.lo])).sort((a, b2) => km(c.lat, c.lng, a.la, a.lo) - km(c.lat, c.lng, b2.la, b2.lo)).slice(0, 90);
      await fetchWx(items);
    }
    if (tok !== WXQ.tok || ST.tab !== 'cuaca') return;
    g.clearLayers();
    items.forEach(it => { const lab = wxLabel(it, z); if (!lab) return; L.marker([it.la, it.lo], { icon: L.divIcon({ className: 'al-wx', html: lab, iconSize: [0, 0] }), keyboard: false }).bindPopup(wxPopup(it), { maxWidth: 300 }).on('click', () => setLoc(it.la, it.lo, it.n + (it.prov ? ', ' + it.prov : ''), true)).addTo(g); });
    const lod = $('alLod'); if (lod) lod.textContent = lvName + ' · ' + items.length + ' titik · zoom ' + z;
  }
  async function drawCuaca() {
    group('cuaca').addTo(map); renderWx();
    if (!map._alWx) { map._alWx = true; map.on('moveend', () => { clearTimeout(WXQ.tm); WXQ.tm = setTimeout(renderWx, 250); }); }
  }

  /* ---------- suhu per wilayah (tab El Niño): pulau -> provinsi -> kabupaten/kota mengikuti zoom ---------- */
  const SX = {}, SXQ = { tok: 0, tm: 0 };
  async function fetchSx(items, N) {
    N = N || 1; const need = items.filter(i => !SX[N + '|' + i.k]);
    for (let i = 0; i < need.length; i += 50) {
      const c = need.slice(i, i + 50);
      try {
        const j = await getJSON('https://api.open-meteo.com/v1/forecast?latitude=' + c.map(p => p.la).join() + '&longitude=' + c.map(p => p.lo).join() + '&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&past_days=' + (N - 1) + '&forecast_days=1&timezone=auto', 25000);
        (Array.isArray(j) ? j : [j]).forEach((x, n) => {
          const d = x.daily || {}, mx = (d.temperature_2m_max || []).filter(v => v != null), mn = (d.temperature_2m_min || []).filter(v => v != null), pr = (d.precipitation_sum || []).map(v => v == null ? 0 : v);
          if (!mx.length) return;
          SX[N + '|' + c[n].k] = { max: Math.max.apply(null, mx), avg: mx.reduce((a, b) => a + b, 0) / mx.length, min: mn.length ? Math.min.apply(null, mn) : null, hot: mx.filter(v => v >= 35).length, days: mx.length, dry: pr.filter(v => v < 1).length, rain: pr.reduce((a, b) => a + b, 0) };
        });
      } catch (e) { }
    }
  }
  const heat = t => t >= 37 ? '#7f1d1d' : t >= 35 ? '#dc2626' : t >= 33 ? '#ea580c' : t >= 31 ? '#ca8a04' : '#0d9488';
  function sxLabel(it, z, N) {
    const w = SX[N + '|' + it.k]; if (!w) return null;
    const nm = (it.lv === 'pulau' && z <= 4) || (it.lv === 'prov' && z >= 6) || (it.lv === 'kab' && z >= 9);
    const det = it.lv === 'kab' && z >= 11 ? ' · ' + w.hot + ' hr ≥35°' : '';
    return '<div class="al-wxi al-sxi' + (it.lv === 'prov' ? ' pv' : it.lv === 'pulau' ? ' pl' : '') + '" style="background:' + heat(w.max) + '"><b>' + Math.round(w.max) + '°</b>' + (nm ? '<em>' + esc(it.n) + det + '</em>' : '') + '</div>';
  }
  function sxPopup(it, N) {
    const w = SX[N + '|' + it.k]; if (!w) return '';
    const per = N <= 1 ? 'hari ini' : N + ' hari terakhir';
    return '<div class="al-pop"><b>' + esc(it.n) + (it.prov ? ' <small>' + esc(it.prov) + '</small>' : '') + '</b><div>🌡️ Suhu maks ' + per + ': <b>' + w.max.toFixed(1) + '°C</b></div>'
      + '<div class="small">' + (N > 1 ? 'Rata-rata suhu maks harian <b>' + w.avg.toFixed(1) + '°C</b> · ' : '') + (w.min != null ? 'suhu min <b>' + w.min.toFixed(1) + '°C</b>' : '') + '</div>'
      + '<div class="small muted">Hari ≥35°C: <b>' + w.hot + '</b> dari ' + w.days + ' · hari tanpa hujan (&lt;1 mm): <b>' + w.dry + '</b> · hujan ' + Math.round(w.rain) + ' mm</div>'
      + '<div class="small muted">Open-Meteo (model/reanalisis), bukan stasiun BMKG.</div></div>';
  }
  async function renderSx() {
    if (!map || ST.tab !== 'elnino') return; const tok = ++SXQ.tok, g = group('sx'), z = map.getZoom(), N = ST.nPer || 1;
    let items, lvName;
    if (z <= 4) {
      lvName = 'Pulau'; const P = provItems(), by = {}; P.forEach(p => (by[p.pulau] = by[p.pulau] || []).push(p));
      await fetchSx(P, N); if (tok !== SXQ.tok) return;
      items = Object.keys(by).map(n => {
        const l = by[n], ws = l.map(p => SX[N + '|' + p.k]).filter(Boolean); if (!ws.length) return null;
        const it = { k: 'pl:' + n, n, la: l.reduce((a, b) => a + b.la, 0) / l.length, lo: l.reduce((a, b) => a + b.lo, 0) / l.length, lv: 'pulau' }, av = f => ws.reduce((a, w) => a + w[f], 0) / ws.length, mins = ws.map(w => w.min).filter(v => v != null);
        SX[N + '|' + it.k] = { max: Math.max.apply(null, ws.map(w => w.max)), avg: av('avg'), min: mins.length ? Math.min.apply(null, mins) : null, hot: Math.round(av('hot')), days: ws[0].days, dry: Math.round(av('dry')), rain: av('rain') };
        return it;
      }).filter(Boolean);
    } else if (z <= 6) {
      lvName = 'Provinsi'; items = provItems(); await fetchSx(items, N);
    } else {
      lvName = 'Kabupaten/Kota'; KABS = KABS || kabItems(); const b = map.getBounds().pad(.15), c = map.getCenter();
      items = KABS.filter(k => b.contains([k.la, k.lo])).sort((a, b2) => km(c.lat, c.lng, a.la, a.lo) - km(c.lat, c.lng, b2.la, b2.lo)).slice(0, 90);
      await fetchSx(items, N);
    }
    if (tok !== SXQ.tok || ST.tab !== 'elnino') return;
    g.clearLayers();
    items.forEach(it => { const lab = sxLabel(it, z, N); if (!lab) return; L.marker([it.la, it.lo], { icon: L.divIcon({ className: 'al-wx', html: lab, iconSize: [0, 0] }), keyboard: false }).bindPopup(sxPopup(it, N), { maxWidth: 280 }).on('click', () => setLoc(it.la, it.lo, it.n + (it.prov ? ', ' + it.prov : ''), true)).addTo(g); });
    const lod = $('alLod'); if (lod) lod.textContent = 'Suhu · ' + lvName + ' · ' + items.length + ' titik · zoom ' + z;
    if (ST.tab === 'elnino' && N === (ST.nPer || 1)) { const el = $('alInfo'); if (el && !el.hidden) refreshPanel(); }
  }
  /* pemilih rentang data (tab El Niño) */
  const NPS = [[1, 'Terbaru'], [7, '7 hari'], [14, '14 hari'], [30, '30 hari']];
  function buildNP() {
    const el = $('alNP'); if (!el) return; el.hidden = ST.tab !== 'elnino'; if (el.hidden) return; const N = ST.nPer || 1;
    el.innerHTML = '<div class="al-npc" role="group" aria-label="Rentang data El Niño">' + NPS.map(x => '<button type="button" class="chip' + (x[0] === N ? ' on' : '') + '" data-n="' + x[0] + '" aria-pressed="' + (x[0] === N) + '">' + x[1] + '</button>').join('') + '</div>'
      + '<div class="al-leg"><span><span class="al-dot" style="background:#0d9488"></span>≤30°</span><span><span class="al-dot" style="background:#ca8a04"></span>31–32°</span><span><span class="al-dot" style="background:#ea580c"></span>33–34°</span><span><span class="al-dot" style="background:#dc2626"></span>35–36°</span><span><span class="al-dot" style="background:#7f1d1d"></span>≥37°</span><span style="color:#dc2626">■ laut hangat</span><span style="color:#2563eb">■ laut dingin</span></div>';
    el.querySelectorAll('[data-n]').forEach(b => b.onclick = () => setNP(+b.dataset.n));
  }
  async function setNP(N) {
    if (N === ST.nPer) return; ST.nPer = N; buildNP(); const lod = $('alLod'); if (lod) lod.textContent = 'Memuat data ' + (N === 1 ? 'terbaru' : N + ' hari') + '…';
    try { await Promise.all([ensureNino(), fetchSx(provItems(), N)]); } catch (e) { }
    if (ST.tab !== 'elnino' || ST.nPer !== N) return; await drawLayers(); refreshPanel();
  }

  /* ---------- panel & ringkasan ---------- */
  const box = h => '<div class="al-box">' + h + '</div>';
  async function weatherBox() {
    if (!ST.loc) return box('<p class="muted small">Ketuk peta, tekan 📍, atau cari nama tempat untuk melihat prakiraan cuaca lokasi itu.</p>');
    const { la, lo } = ST.loc;
    try {
      const j = await getJSON('https://api.open-meteo.com/v1/forecast?latitude=' + la + '&longitude=' + lo + '&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,precipitation&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,uv_index_max&timezone=auto&forecast_days=7', 15000);
      ST.wx = j; const c = j.current, w = WMO(c.weather_code), dy = j.daily;
      return box('<div class="al-now"><span class="al-big">' + w[0] + '</span><div><b>' + Math.round(c.temperature_2m) + '°C</b> · ' + w[1] + '<br><span class="small muted">Lembap ' + c.relative_humidity_2m + '% · angin ' + Math.round(c.wind_speed_10m) + ' km/j · hujan ' + c.precipitation + ' mm</span></div></div><div class="al-days">' + dy.time.map((t, i) => '<div><small>' + new Date(t).toLocaleDateString('id-ID', { weekday: 'short' }) + '</small><span>' + WMO(dy.weather_code[i])[0] + '</span><b>' + Math.round(dy.temperature_2m_max[i]) + '°</b><small>' + Math.round(dy.temperature_2m_min[i]) + '°</small><small>' + dy.precipitation_sum[i].toFixed(0) + ' mm</small></div>').join('') + '</div><p class="small muted">Sumber: Open-Meteo. Peringatan resmi: BMKG.</p><details open><summary><b>Doa untuk cuaca saat ini</b></summary>' + doaHTML(doaIds(c.weather_code, c.wind_speed_10m, c.temperature_2m), 3) + '</details>');
    } catch (e) { ST.wx = null; return box('<p class="muted small">Cuaca tidak terjangkau (periksa koneksi).</p>'); }
  }
  function riskBox() {
    if (!ST.loc) return box('<p class="muted small">Pilih lokasi untuk melihat ringkasan risiko di sekitarmu.</p>');
    const { la, lo } = ST.loc, sub = nearestLine(la, lo, GEO.s), flt = nearestLine(la, lo, GEO.f), vol = nearestVol(la, lo);
    const near = ST.eq.filter(e => km(la, lo, e.la, e.lo) <= 300), top = near.slice().sort((a, b) => b.m - a.m)[0];
    const fire = ST.fires.map(f => ({ f, d: km(la, lo, f.la, f.lo) })).sort((a, b) => a.d - b.d)[0];
    let dry = '';
    if (ST.wx) { const p = ST.wx.daily.precipitation_sum.reduce((a, b) => a + b, 0), t = Math.max(...ST.wx.daily.temperature_2m_max); dry = p < 5 && t >= 33 ? ' · <b style="color:#b91c1c">cuaca kering & panas: waspada karhutla</b>' : p < 5 ? ' · cenderung kering' : ''; }
    const lv = d => d < 50 ? 'tinggi' : d < 150 ? 'sedang' : 'rendah';
    return box('<h3>Ringkasan lokasi: ' + esc(ST.loc.n || la.toFixed(2) + ', ' + lo.toFixed(2)) + '</h3><ul class="al-ul"><li>🌍 Zona subduksi terdekat: <b>' + esc(sub.n) + '</b> ±' + Math.round(sub.d) + ' km (kedekatan ' + lv(sub.d) + ')</li><li>〰️ Sesar aktif terdekat: <b>' + esc(flt.n) + '</b> ±' + Math.round(flt.d) + ' km</li><li>🌋 Gunung api terdekat: <b>' + esc(vol.n) + '</b> ±' + Math.round(vol.d) + ' km</li><li>📈 Gempa dalam 300 km (' + ({ day: '24 jam', week: '7 hari', month: '30 hari' }[ST.eqP]) + '): <b>' + near.length + '</b>' + (top ? ', terkuat M ' + top.m.toFixed(1) : '') + '</li><li>🔥 Titik api terdekat: ' + (fire ? '<b>' + Math.round(fire.d) + ' km</b>' + dry : 'tidak ada data / tidak ada' + dry) + '</li></ul><p class="small muted">Indikatif dari geometri garis skematik, bukan peta resmi. Cek InaRISK BNPB & BMKG untuk keputusan keselamatan.</p>');
  }
  function listBox() {
    const arr = ST.tab === 'tsunami' ? ST.eq.filter(tsPot) : ST.eq, show = arr.slice().sort((a, b) => b.m - a.m).slice(0, 8);
    return box('<div class="al-sel"><label>Periode <select id="alPer"><option value="day">24 jam</option><option value="week">7 hari</option><option value="month">30 hari</option></select></label><span class="small muted">' + arr.length + ' kejadian · sumber: ' + esc(ST.eqSrc || '-') + '</span></div>' + (show.length ? '<ul class="al-ul">' + show.map(e => '<li><b style="color:' + eqCol(e.m) + '">M ' + e.m.toFixed(1) + '</b> · ' + Math.round(e.dp) + ' km · ' + esc(e.w) + '<br><small class="muted">' + fmtT(e.t) + (tsPot(e) ? ' · ⚠ potensi tsunami (indikatif)' : '') + '</small></li>').join('') + '</ul>' : '<p class="muted small">' + (ST.tab === 'tsunami' ? 'Tidak ada gempa berpotensi tsunami pada periode ini. Alhamdulillah.' : 'Tidak ada data.') + '</p>') + '<p class="small muted">Gempa M ≥ 7 dengan kedalaman &lt; 70 km di laut dianggap berpotensi tsunami (indikatif). Resmi: <a target="_blank" rel="noopener" href="https://www.bmkg.go.id/gempabumi/gempabumi-terkini">BMKG</a>.</p>');
  }
  function ninoExtra() {
    const n = ST.nino || {}, N = ST.nPer || 1, ser = ST.ser || {}, win = N === 1 ? 30 : N;
    let h = '<p class="small"><b>Rentang data:</b> ' + (N === 1 ? 'terbaru' : N + ' hari terakhir (rata-rata)') + (n.date ? ' · ' + (N > 1 && n.from && n.from !== n.date ? esc(n.from.slice(0, 10)) + ' → ' : '') + esc(n.date.slice(0, 10)) : '') + '</p>';
    const a = (ser.n34 || []).slice(-win), b = (ser.idn || []).slice(-win);
    if (a.length > 2) {
      const W = 300, H = 76, mx = Math.max(.5, Math.max.apply(null, a.concat(b).map(p => Math.abs(p.v)))), X = (i, len) => 6 + i * (W - 12) / Math.max(1, len - 1), Y = v => H / 2 - v / mx * (H / 2 - 8);
      const pl = (arr, col) => arr.length > 1 ? '<polyline fill="none" stroke="' + col + '" stroke-width="2" stroke-linejoin="round" points="' + arr.map((p, i) => X(i, arr.length).toFixed(1) + ',' + Y(p.v).toFixed(1)).join(' ') + '"/>' : '';
      const ls = x => x.length ? (x[x.length - 1].v > 0 ? '+' : '') + x[x.length - 1].v.toFixed(2) + '°' : '–';
      h += '<svg class="al-spark" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Tren anomali suhu laut ' + win + ' hari"><line x1="6" x2="' + (W - 6) + '" y1="' + H / 2 + '" y2="' + H / 2 + '" stroke="currentColor" opacity=".35" stroke-dasharray="3 3"/>' + pl(b, '#0d9488') + pl(a, '#dc2626') + '</svg>'
        + '<div class="al-leg"><span style="color:#dc2626">━ Niño 3.4 ' + ls(a) + '</span><span style="color:#0d9488">━ Perairan Indonesia ' + ls(b) + '</span><span>tren ' + win + ' hari · ' + esc(a[0].d.slice(5)) + ' → ' + esc(a[a.length - 1].d.slice(5)) + '</span></div>';
    }
    const P = provItems().map(p => ({ n: p.n, w: SX[N + '|' + p.k] })).filter(x => x.w);
    if (P.length > 5) {
      const top = P.slice().sort((x, y) => y.w.max - x.w.max).slice(0, 5), dry = P.slice().sort((x, y) => y.w.dry - x.w.dry || y.w.max - x.w.max).slice(0, 5);
      h += '<div class="al-rank"><div><b>🌡️ Provinsi terpanas' + (N > 1 ? ' (puncak ' + N + ' hari)' : '') + '</b>' + top.map(x => '<span>' + esc(x.n) + ' <b>' + x.w.max.toFixed(1) + '°C</b></span>').join('') + '</div>'
        + (N > 1 ? '<div><b>🏜️ Paling banyak hari tanpa hujan</b>' + dry.map(x => '<span>' + esc(x.n) + ' <b>' + x.w.dry + ' dari ' + x.w.days + ' hr</b></span>').join('') + '</div>' : '') + '</div>';
    }
    return h + '<p class="small muted">Label peta = suhu maksimum per wilayah (zoom: pulau → provinsi → kab/kota). Suhu darat: Open-Meteo (model/reanalisis, bukan stasiun BMKG); suhu laut: NOAA OISST.</p>';
  }
  function ninoBox() {
    const n = ST.nino || {}, v = n.n34, o = n.oni && n.oni[n.oni.length - 1], k = x => x >= .5 ? 'El Niño' : x <= -.5 ? 'La Niña' : 'Netral';
    const imp = x => x >= .5 ? 'Indonesia cenderung lebih kering dan kemarau lebih panjang (terutama Jul–Nov): waspada gagal panen, krisis air, dan karhutla. Angin pasat melemah.' : x <= -.5 ? 'Indonesia cenderung lebih basah: waspada banjir dan longsor. Angin pasat menguat.' : 'ENSO netral: pola musim mendekati normal.';
    let man = null; try { man = JSON.parse(localStorage.getItem('alam_oni_manual') || 'null'); } catch (e) { }
    const s = v != null ? v : (o ? o.a : (man != null ? man : null));
    if (s == null) return box('<p class="muted small">Data suhu laut NOAA belum terjangkau' + (n.err ? ' (' + esc(n.err) + ')' : '') + '. <button class="btn" id="alRetry">Coba lagi</button></p><p class="small">Atau masukkan nilai ONI/Niño 3.4 terbaru dari BMKG atau NOAA (mis. 0.8 atau -0.6):</p><div class="al-row"><input id="alOni" type="number" step="0.1" placeholder="ONI, mis. 0.8"><button class="btn" id="alOniOk">Terapkan</button></div><p class="small muted">Rujukan: <a target="_blank" rel="noopener" href="https://www.bmkg.go.id/iklim/informasi-index-enso.bmkg">BMKG</a> · <a target="_blank" rel="noopener" href="https://www.cpc.ncep.noaa.gov/products/analysis_monitoring/enso_advisory/">NOAA CPC</a>.</p>');
    return box('<div class="al-now"><span class="al-big">' + (s >= .5 ? '🔴' : s <= -.5 ? '🔵' : '🟢') + '</span><div><b>' + k(s) + '</b>' + (v != null ? ' · anomali SST Niño 3.4 ≈ <b>' + (v > 0 ? '+' : '') + v.toFixed(2) + ' °C</b>' : '') + (n.idn != null ? '<br><span class="small">Perairan Indonesia: <b>' + (n.idn > 0 ? '+' : '') + n.idn.toFixed(2) + ' °C</b></span>' : '') + (v == null && !o && man != null ? '<br><span class="small">Nilai manual dari Anda: <b>' + (man > 0 ? '+' : '') + man + '</b> (tanpa peta)</span>' : '') + (o ? '<br><span class="small">ONI ' + o.s + ' ' + o.y + ': <b>' + (o.a > 0 ? '+' : '') + o.a.toFixed(1) + '</b>' + (n.oniOld ? ' (tersimpan)' : '') + '</span>' : '') + '</div></div><p>' + imp(s) + '</p>' + ninoExtra() + '<div class="al-leg"><span style="color:#dc2626">■ lebih hangat</span><span style="color:#2563eb">■ lebih dingin</span><span>▭ kotak putus = Niño 3.4</span><span>💨 garis bergerak = angin 10 m</span><span>☁️ kabut = perkiraan sebaran asap (makin pekat saat El Niño menguat)</span></div><p class="small muted">' + (n.srcName ? esc(n.srcName) : 'NOAA') + (n.date ? ', ' + esc(n.date.slice(0, 10)) + ((ST.nPer || 1) > 1 ? ' (rata-rata ' + ST.nPer + ' hari)' : '') : '') + '. Ambang El Niño/La Niña: ±0,5 °C berkelanjutan (satu pekan belum cukup menyatakan status resmi). Resmi: BMKG &amp; NOAA CPC.</p>');
  }
  function karBox() {
    const dg = (ST.fdg || []).slice().sort((a, b) => b.v - a.v), top = dg.slice(0, 6), hi = dg.filter(p => p.v >= 55).length;
    return box('<p>🛰️ <b>Titik panas satelit NASA</b> (MODIS &amp; VIIRS, kemarin) tampil di peta sebagai titik oranye-merah di <b>seluruh pulau</b>. Perbesar peta untuk melihat titik kecil.</p><p>🔥 ' + ST.fires.length + ' kejadian kebakaran besar aktif (' + esc(ST.fireSrc || '-') + ').</p><h3>Potensi kering &amp; karhutla per daerah</h3>' + (dg.length ? '<div class="al-leg"><span style="color:#16a34a">● Rendah</span><span style="color:#f59e0b">● Sedang</span><span style="color:#dc2626">● Tinggi</span><span style="color:#7f1d1d">● Ekstrem</span></div><p class="small"><b>' + hi + '</b> dari ' + dg.length + ' titik pantau berstatus tinggi/ekstrem. Tertinggi:</p><ul class="al-ul">' + top.map(p => { const c = dgCls(p.v); return '<li><b style="color:' + c[1] + '">' + c[0] + ' ' + p.v + '</b> · ' + esc(p.n) + '<br><small class="muted">hujan 7 hari ' + p.rain.toFixed(0) + ' mm · RH ' + p.rh + '% · ' + Math.round(p.t) + '°C</small></li>'; }).join('') + '</ul>' : '<p class="muted small">Indeks cuaca belum termuat.</p>') + '<p class="small muted">Indeks = hujan 7 hari terakhir, suhu, kelembapan, dan angin (Open-Meteo); indikatif, bukan titik api. <details><summary class="small">Tambah titik panas NASA FIRMS yang bisa diketuk (opsional)</summary><span class="small muted">Daftar gratis MAP_KEY di firms.modaps.eosdis.nasa.gov. Kunci disimpan di perangkat ini.</span><span class="al-row"><input id="alKey" type="text" placeholder="MAP_KEY FIRMS" value="' + esc(store.get ? store.get('alamFirms', '') : '') + '"><button class="btn" id="alKeyOk">Simpan</button></span></details></p><p class="small muted">Laporan resmi: <a target="_blank" rel="noopener" href="https://sipongi.menlhk.go.id">SiPongi KLHK</a>.</p>');
  }

  /* ---------- tampilan ---------- */
  const CSS = `
  .al-wrap{display:grid;gap:12px}
  .al-tabs{display:flex;gap:4px;justify-content:space-between}
  .al-tabs .chip{flex:1 1 0;min-width:0;height:42px;padding:0;display:flex;align-items:center;justify-content:center;font-size:1.2rem;line-height:1}
  .al-tabs .chip.on{background:var(--primary);color:var(--primary-ink);border-color:transparent}
  .al-bar{display:flex;gap:8px;flex-wrap:wrap}
  .al-bar input{flex:1 1 160px;min-width:0;padding:10px;border-radius:12px;border:1px solid var(--border);background:var(--surface);color:inherit}
  .al-map{height:min(62vh,520px);min-height:340px;border-radius:16px;border:1px solid var(--border);overflow:hidden;z-index:0}
  .al-box{background:var(--surface);border:1px solid var(--border);border-radius:16px;padding:12px 14px;box-shadow:var(--shadow)}
  .al-box h3{margin:0 0 6px;font-size:1rem} .al-box p{margin:6px 0}
  .al-ul{margin:0;padding-left:0;list-style:none;display:grid;gap:8px}
  .al-now{display:flex;gap:12px;align-items:center}.al-big{font-size:2.4rem;line-height:1}
  .al-days{display:grid;grid-template-columns:repeat(7,1fr);gap:4px;text-align:center;margin-top:10px}
  .al-days>div{display:grid;gap:1px;background:var(--bg);border-radius:10px;padding:6px 2px;font-size:.85rem}
  .al-sel{display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-bottom:8px}
  .al-sel select,.al-row input{padding:8px;border-radius:10px;border:1px solid var(--border);background:var(--bg);color:inherit}
  .al-row{display:flex;gap:8px}.al-row input{flex:1}
  .al-note{border-left:4px solid var(--primary);padding:8px 12px;background:var(--playing);border-radius:0 12px 12px 0;font-size:.95rem}
  .al-ayg{display:grid;gap:10px}
  .al-ay{display:block;background:var(--surface);border:1px solid var(--border);border-radius:16px;padding:12px 14px}
  .al-ay:hover{border-color:var(--primary)}
  .al-ar{font-family:"Amiri Quran",serif;font-size:calc(var(--arab-size) * .8);line-height:2;text-align:right}
  .al-id{margin-top:4px}.al-ref{margin-top:6px;font-size:.8rem;color:var(--primary);font-weight:600}
  .al-map .leaflet-overlay-pane svg{width:auto;height:auto;max-width:none;fill:none}
  .al-map .leaflet-control svg,.al-map svg{max-width:none}
  .al-wind{position:absolute;left:0;top:0;width:100%;height:100%;pointer-events:none;z-index:500}
  .al-bar .btn.on{background:var(--primary);color:var(--primary-ink);border-color:transparent}
  .al-wx{background:none;border:0;width:0;height:0;overflow:visible}
  .al-wxi{position:absolute;left:0;top:0;transform:translate(-50%,-50%);display:flex;gap:3px;align-items:center;white-space:nowrap;background:rgba(255,255,255,.94);color:#111;border:1px solid #cbd5e1;border-radius:14px;padding:1px 6px;font-size:12px;line-height:18px;box-shadow:0 1px 3px rgba(0,0,0,.25)}
  .al-wxi.r{border-color:#2563eb;background:#eff6ff}.al-wxi.t{border-color:#7c3aed;background:#f5f3ff}
  .al-wxi.pv{font-size:13px;padding:2px 8px}.al-wxi.pl{font-size:14px;padding:3px 10px;font-weight:600}
  .al-wxi em{font-style:normal;color:#334155;font-size:11px}
  .al-lod{position:absolute;left:8px;bottom:22px;z-index:450;background:rgba(15,118,110,.92);color:#fff;font-size:.75rem;padding:3px 10px;border-radius:12px;pointer-events:none}
  .al-wxi.al-sxi{color:#fff;border-color:rgba(255,255,255,.75);font-weight:600;text-shadow:0 1px 1px rgba(0,0,0,.35)}.al-sxi em{font-style:normal;font-weight:500}.al-np{display:grid;gap:6px}.al-npc{display:flex;gap:6px;flex-wrap:wrap}.al-npc .chip{font-size:.82rem;padding:6px 14px}.al-dot{display:inline-block;width:10px;height:10px;border-radius:50%;margin-right:4px;vertical-align:middle}.al-spark{width:100%;height:auto;max-height:96px;color:var(--muted,#64748b);margin-top:6px}.al-rank{display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:10px;margin:10px 0}.al-rank>div{display:flex;flex-direction:column;gap:3px;font-size:.85rem}.al-rank span{display:flex;justify-content:space-between;gap:8px;border-bottom:1px dashed var(--border)}.al-pop{min-width:200px;max-width:280px}.al-pop small{color:#64748b;font-weight:400}
  .al-plist{display:flex;flex-wrap:wrap;gap:4px 10px;font-size:.8rem;margin:6px 0}
  .al-doa{margin:8px 0;padding:8px;border-radius:10px;background:#f1f5f9;color:#111}.al-doa .al-ar{font-size:1.35rem;line-height:1.9}.al-doa{position:relative}.al-cp{position:absolute;top:6px;right:6px;padding:2px 8px;font-size:.8rem;min-height:0}.al-doa>b{display:block;padding-right:44px}
  .al-la{font-size:.8rem;font-style:italic;color:#475569}.al-doa .al-id{font-size:.85rem}
  .al-chips{display:flex;flex-wrap:wrap;gap:6px;margin:8px 0}.al-chips .chip{font-size:.8rem}.al-src{display:flex;flex-direction:column;align-items:flex-start;gap:6px;padding:4px 2px}.al-src-l{font-size:.78rem;color:var(--muted,#6b7280);letter-spacing:.02em}.al-src-a{display:inline-flex;align-items:center;gap:8px;padding:9px 14px;border:1px solid var(--border);border-radius:999px;background:var(--surface);color:inherit;font-weight:600;text-decoration:none;box-shadow:var(--shadow);transition:transform .15s,border-color .15s}.al-src-a:hover,.al-src-a:focus-visible{border-color:currentColor;transform:translateY(-1px)}.al-src-t{text-decoration:underline;text-underline-offset:3px}.al-src-x{opacity:.6}.al-haze{filter:blur(16px);pointer-events:none;animation:alHaze 9s ease-in-out infinite alternate}.al-haze2{filter:blur(10px);animation-duration:13s;animation-direction:alternate-reverse}@keyframes alHaze{from{opacity:.65}to{opacity:1}}@media (prefers-reduced-motion:reduce){.al-haze{animation:none}}.al-src p{margin:0}
  .al-ico{background:none;border:0;font-size:18px;line-height:22px;text-align:center}
  .al-leg{display:flex;gap:10px;flex-wrap:wrap;font-size:.8rem;color:var(--muted)}
  .al-leg i{display:inline-block;width:14px;height:0;border-top:4px solid;vertical-align:middle;margin-right:4px}
  `;
  function css() { if (document.getElementById('alamCss')) return; const s = document.createElement('style'); s.id = 'alamCss'; s.textContent = CSS + EXTRA_CSS; document.head.appendChild(s); }

  const syncPin = () => { const b = $('alGps'); if (!b) return; b.classList.toggle('on', !!ST.pin); b.setAttribute('aria-pressed', ST.pin ? 'true' : 'false'); b.title = ST.pin ? 'Hapus pin lokasi' : 'Lokasiku'; b.setAttribute('aria-label', b.title); };
  async function setLoc(la, lo, n, keep, pin) {
    if (!n) { let best = null; WIL.forEach(p => p[4].forEach(k => { const d = km(la, lo, k[1], k[2]); if (!best || d < best.d) best = { d, n: (k[3] ? 'Kota ' : 'Kab. ') + k[0] + ', ' + p[0] }; })); if (best && best.d < 90) n = best.n; }
    ST.loc = { la, lo, n }; ST.wx = null; if (pin) ST.pin = true; if (map) { if (pin) { if (LY.pin) map.removeLayer(LY.pin); LY.pin = L.marker([la, lo]).addTo(map); } else { if (LY.sel) map.removeLayer(LY.sel); LY.sel = L.circleMarker([la, lo], { radius: 7, weight: 2, color: '#0f766e', fillColor: '#14b8a6', fillOpacity: .35, interactive: false }).addTo(map); } if (!keep && !map.getBounds().contains([la, lo])) map.panTo([la, lo]); }
    syncPin(); refreshPanel();
  }
  async function refreshPanel() {
    const t = ST.tab, el = $('alInfo'); if (!el) return;
    let h = '';
    if (t === 'ringkas') { await ensureWx(); h = riskBox() + riskAdvice() + await weatherBox(); }
    else if (t === 'cuaca') h = await weatherBox();
    else if (t === 'gempa' || t === 'tsunami') h = listBox();
    else if (t === 'sesar') { h = ST.loc ? riskBox() : box('<div class="al-leg"><span><i style="border-color:#dc2626;border-top-style:dashed"></i>Zona subduksi / palung</span><span><i style="border-color:#7c3aed"></i>Sesar aktif</span></div><p class="small muted">Ketuk peta atau pilih lokasi untuk jarak ke sesar & subduksi terdekat. Garis ini skematik (perkiraan), bukan peta resmi PuSGeN.</p>'); }
    else if (t === 'gunung') h = box('<p><b>' + ST.vols.length + '</b> gunung api utama Indonesia. Ketuk 🌋 untuk tautan status resmi PVMBG.</p>' + (ST.loc ? riskBox() : ''));
    else if (t === 'karhutla') h = karBox();
    else if (t === 'elnino') h = ninoBox();
    if (t === 'karhutla' && !ST.wx) ensureWx().then(() => { /* tidak blok */ });
    if (el.dataset.t !== t + (ST.loc ? ST.loc.la : '')) { /* hanya tulis bila tab/lokasi sama dengan permintaan terakhir */ }
    el.innerHTML = h;
    const per = $('alPer'); if (per) { per.value = ST.eqP; per.onchange = async () => { ST.eqP = per.value; el.innerHTML = box('<p class="muted small">Memuat…</p>'); await loadGempa(ST.eqP); drawLayers(); refreshPanel(); }; }
    const rt = $('alRetry'); if (rt) rt.onclick = async () => { ST.nino = null; ST.ninoC = {}; ST.ser = null; el.innerHTML = box('<p class="muted small">Memuat…</p>'); await ensureNino(); await drawLayers(); refreshPanel(); };
    const om = $('alOniOk'); if (om) om.onclick = () => { const x = parseFloat($('alOni').value); if (!isFinite(x) || Math.abs(x) > 5) return toast('Isi angka antara -5 dan 5'); try { localStorage.setItem('alam_oni_manual', JSON.stringify(x)); } catch (e) { } refreshPanel(); };
    const ok = $('alKeyOk'); if (ok) ok.onclick = async () => { store.set && store.set('alamFirms', $('alKey').value.trim()); toast('Kunci disimpan, memuat titik panas…'); await loadKarhutla(); await drawLayers(); refreshPanel(); };
  }
  async function ensureWx() { if (ST.loc && !ST.wx) { try { ST.wx = await getJSON('https://api.open-meteo.com/v1/forecast?latitude=' + ST.loc.la + '&longitude=' + ST.loc.lo + '&daily=precipitation_sum,temperature_2m_max&timezone=auto&forecast_days=7', 12000); } catch (e) { } } }

  async function drawLayers() {
    if (!map) return; clearLY(); const tok = ST.dl = (ST.dl || 0) + 1;
    const t = ST.tab;
    if (t === 'ringkas') { drawSesar(); drawGunung(); drawGempa(false); drawKarhutla(false); }
    else if (t === 'cuaca') await drawCuaca();
    else if (t === 'gempa') drawGempa(false);
    else if (t === 'tsunami') { drawSesar(); drawGempa(true); }
    else if (t === 'sesar') { drawSesar(); drawGempa(false); }
    else if (t === 'gunung') drawGunung();
    else if (t === 'karhutla') drawKarhutla(true);
    else if (t === 'elnino') { await ensureNino(); if (tok !== ST.dl) return; drawElnino(); if (!cache.fire) { cache.fire = 1; loadKarhutla().then(() => { if (ST.tab === 'elnino' && map) { if (LY.kabut) { LY.kabut.clearLayers(); map.removeLayer(LY.kabut); delete LY.kabut; } drawKabut(); } }).catch(() => { cache.fire = 0; }); } }
    syncWind();
  }

  async function goTab(t) {
    ST.tab = t; document.querySelectorAll('.al-tabs .chip').forEach(c => c.classList.toggle('on', c.dataset.t === t));
    const T = TOPIK[t]; $('alNote').innerHTML = '<b>' + T.emo + ' ' + T.t + '.</b> ' + esc(T.note);
    $('alDoa').innerHTML = t === 'cuaca' ? '<details class="al-box"><summary><b>🤲 Doa-doa saat cuaca (hujan, petir, angin, mendung, kemarau)</b></summary>' + doaHTML(Object.keys(DOA)) + '<p class="small muted">Ketuk titik cuaca di peta: tiap wilayah menampilkan doa sesuai cuacanya. Periksa lafaz dan derajat hadis ke ustaz atau kitab rujukan.</p></details>' : (DOA_TAB[t] ? '<details class="al-box"><summary><b>🤲 Doa &amp; adab: ' + esc(TOPIK[t].t) + '</b></summary><p class="small">' + esc(DOA_TIP[t]) + '</p>' + doaHTML(DOA_TAB[t]) + '<p class="small muted">Tidak ada doa khusus dari Nabi ﷺ untuk gempa atau erupsi; yang dipakai adalah doa perlindungan umum dari Al-Qur’an dan hadis. Periksa lafaz dan derajat hadis ke ustaz atau kitab rujukan.</p></details>' : '');
    $('alDoa').onclick = e => { const b = e.target.closest && e.target.closest('[data-cp]'); if (!b) return; const d = b.closest('.al-doa'), tx = ['.al-ar', '.al-la', '.al-id', '.al-ref'].map(q => (d.querySelector(q) || {}).textContent || '').join('\n'); try { navigator.clipboard.writeText(tx).then(() => toast('Doa disalin'), () => toast('Gagal menyalin')); } catch (x) { toast('Gagal menyalin'); } }; const lod = $('alLod'); if (lod) lod.hidden = t !== 'cuaca' && t !== 'elnino'; buildNP();
    $('alAy').innerHTML = '<p class="muted small">Memuat ayat…</p>'; ayatHTML(T.ay).then(h => { if (ST.tab === t) { $('alAy').innerHTML = h; decorateAyat($('alAy')); } });
    $('alInfo').innerHTML = box('<p class="muted small">Memuat data…</p>');
    try { history.replaceState(null, '', '#/alam/' + t); } catch (e) { }
    const need = [];
    if (['ringkas', 'gempa', 'tsunami', 'sesar'].includes(t) && !ST.eq.length && !cache.eq) need.push(loadGempa(ST.eqP).then(() => cache.eq = 1));
    if (['ringkas', 'karhutla'].includes(t) && !cache.fire) need.push(loadKarhutla().then(() => cache.fire = 1));
    if (t === 'karhutla' && !ST.fdg) need.push(loadDanger().catch(() => toast('Indeks cuaca gagal dimuat')));
    fit(t);
    if (t === 'elnino') { need.push(ensureNino()); need.push(fetchSx(provItems(), ST.nPer || 1)); }
    await Promise.all(need); if (ST.tab !== t) return;
    await drawLayers(); fit(t); if (ST.tab === t) refreshPanel(); renderCerdas();
  }
  function fit(t) { if (!map) return; map.invalidateSize(); map.fitBounds([[-11, 95], [6.5, 141]], { maxZoom: 6, animate: false }); }

  return async function AlamView(tab) {
    if (stopFn) stopFn(); aborted = false; css();
    setTitle('Tadabbur Alam', true);
    tab = TABS.includes(tab) ? tab : 'ringkas'; ST.tab = tab;
    view.innerHTML = '<div class="al-wrap">' + INTRO_HTML + '<div id="alCerdas"></div>' + '<div class="al-tabs" role="tablist">' + TABS.map(k => '<button class="chip" role="tab" data-t="' + k + '" title="' + TOPIK[k].t + '" aria-label="' + TOPIK[k].t + '">' + TOPIK[k].emo + '</button>').join('') + '</div><div class="al-bar"><button class="btn" id="alGps" title="Lokasiku" aria-label="Lokasiku">📍</button><button class="btn" id="alWind" title="Animasi angin" aria-label="Animasi angin">💨</button><button class="btn" id="alPanel" title="Tampilkan / sembunyikan data" aria-label="Tampilkan atau sembunyikan data" aria-expanded="false">📊</button><button class="btn" id="alRen" title="Renungan hari ini" aria-label="Renungan hari ini" aria-pressed="true">✨</button><input id="alQ" type="search" placeholder="Cari kota / daerah…" autocomplete="off"><button class="btn" id="alGo">Cari</button></div><div class="al-np" id="alNP" hidden></div><div id="alMap" class="al-map"></div><div id="alInfo" hidden></div><div class="al-note" id="alNote"></div><div class="al-ayg" id="alAy"></div><div id="alDoa"></div><div id="alJurnal"></div><div class="al-src"><span class="al-src-l">Sumber fitur peta</span><a class="al-src-a" href="https://www.petaqu.my.id" target="_blank" rel="noopener noreferrer" aria-label="Buka www.petaqu.my.id di tab baru"><span class="al-src-i" aria-hidden="true">🗺️</span><span class="al-src-t">www.petaqu.my.id</span><span class="al-src-x" aria-hidden="true">↗</span></a><p class="small muted">Data bersifat informatif; untuk peringatan dini ikuti BMKG, PVMBG, dan BNPB.</p></div></div>';
    document.querySelectorAll('.al-tabs .chip').forEach(c => c.onclick = () => goTab(c.dataset.t));
    jurnalInit();
    const intro = $('alIntro');
    if (intro) {
      intro.open = (store.get ? store.get('alamIntro', '1') : '1') !== '0';
      intro.addEventListener('toggle', () => { try { store.set && store.set('alamIntro', intro.open ? '1' : '0'); } catch (e) { } });
      ayatHTML(INTRO_AY).then(h => { const el = $('alIntroAy'); if (el) { el.innerHTML = h; decorateAyat(el); } });
    }
    try { L = await loadLeaflet(); } catch (e) { $('alMap').innerHTML = '<p class="muted small" style="padding:16px">Peta butuh internet untuk pertama kali (Leaflet). Ayat tetap tersedia di bawah.</p>'; L = null; }
    if (L) {
      map = L.map('alMap', { zoomControl: true }); map.fitBounds([[-11, 95], [6.5, 141]], { maxZoom: 6, animate: false });
      let touched = false; const mc = map.getContainer();
      ['pointerdown', 'wheel', 'touchstart', 'dblclick'].forEach(ev => mc.addEventListener(ev, () => { touched = true; }, { passive: true }));
      if (window.ResizeObserver) new ResizeObserver(() => { if (!touched && map) fit(ST.tab); }).observe(mc);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 12, attribution: '© OpenStreetMap' }).addTo(map);
      map.on('click', e => setLoc(e.latlng.lat, e.latlng.lng, null, true));
      const lodEl = document.createElement('div'); lodEl.id = 'alLod'; lodEl.className = 'al-lod'; lodEl.hidden = true; map.getContainer().appendChild(lodEl);
    }
    renInit(); renderCerdas();
    $('alGps').onclick = () => { if (ST.pin) return clearQ(); if (!navigator.geolocation) return toast('GPS tidak tersedia'); navigator.geolocation.getCurrentPosition(p => { ST.wx = null; setLoc(p.coords.latitude, p.coords.longitude, 'Lokasiku', false, true); }, () => toast('Izin lokasi ditolak'), { enableHighAccuracy: false, timeout: 10000 }); };
    const cari = async () => {
      const q = $('alQ').value.trim(); if (q.length < 2) return;
      try { const j = await getJSON('https://geocoding-api.open-meteo.com/v1/search?name=' + encodeURIComponent(q) + '&count=1&language=id&countryCode=ID', 10000); const r = j.results && j.results[0]; if (!r) return toast('Tempat tidak ditemukan'); ST.wx = null; setLoc(r.latitude, r.longitude, r.name + (r.admin1 ? ', ' + r.admin1 : ''), false, true); } catch (e) { toast('Pencarian gagal (periksa koneksi)'); }
    };
    $('alPanel').onclick = () => { const el = $('alInfo'), h = el.hidden; el.hidden = !h; $('alPanel').classList.toggle('on', h); $('alPanel').setAttribute('aria-expanded', h ? 'true' : 'false'); if (h) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); };
    $('alWind').onclick = () => { ST.windPref = !windWanted(ST.tab); syncWind(); };
    const clearQ = () => { ST.loc = null; ST.wx = null; ST.pin = false; if (map) { if (LY.pin) { map.removeLayer(LY.pin); delete LY.pin; } if (LY.sel) { map.removeLayer(LY.sel); delete LY.sel; } } $('alQ').value = ''; syncPin(); refreshPanel(); };
    $('alQ').addEventListener('input', () => { if (!$('alQ').value && ST.pin) clearQ(); });
    $('alQ').addEventListener('search', () => { if (!$('alQ').value && ST.pin) clearQ(); });
    syncPin();
    $('alGo').onclick = cari; $('alQ').onkeydown = e => { if (e.key === 'Enter') cari(); };
    const origSet = setLoc; /* reset cache cuaca saat lokasi berubah lewat peta */
    stopFn = () => { aborted = true; stopWind(); if (map) { map.remove(); map = null; } LY = {}; stopFn = null; };
    window.addEventListener('hashchange', () => { if (!/^#\/alam/.test(location.hash) && stopFn) stopFn(); }, { once: true });
    goTab(tab);
  };
};
