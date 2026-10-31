/* Mesin analisis tajwid (rule-based, 100% offline). Input: ayat Arab berharakat (Rasm Utsmani). */
(function (root) {
  const CATS = {
    ikhfa:   { label: "Ikhfa Haqiqi", color: "#d97706", group: "Nun Sukun & Tanwin" },
    idgBG:   { label: "Idgham Bighunnah", color: "#16a34a", group: "Nun Sukun & Tanwin" },
    idgBL:   { label: "Idgham Bilaghunnah", color: "#0d9488", group: "Nun Sukun & Tanwin" },
    iqlab:   { label: "Iqlab", color: "#9333ea", group: "Nun Sukun & Tanwin" },
    izhar:   { label: "Izhar Halqi", color: "#2563eb", group: "Nun Sukun & Tanwin" },
    mimIkh:  { label: "Ikhfa Syafawi", color: "#ea580c", group: "Mim Sukun" },
    mimIdg:  { label: "Idgham Mimi", color: "#65a30d", group: "Mim Sukun" },
    mimIzh:  { label: "Izhar Syafawi", color: "#0284c7", group: "Mim Sukun" },
    ghunnah: { label: "Ghunnah (Nun/Mim Tasydid)", color: "#db2777", group: "Ghunnah" },
    qalqalah:{ label: "Qalqalah", color: "#dc2626", group: "Qalqalah" },
    mad:     { label: "Mad", color: "#a16207", group: "Mad" },
    lam:     { label: "Alif Lam & Lam Jalalah", color: "#4f46e5", group: "Lam" },
    ra:      { label: "Ra (Tafkhim/Tarqiq)", color: "#475569", group: "Ra" },
    idgMut:  { label: "Idgham Mutamatsilain/Mutajanisain/Mutaqaribain", color: "#0891b2", group: "Idgham Lainnya" }
  };

  const RE = {
    letter: /[\u0621-\u063A\u0641-\u064A\u0671-\u06D3]/,
    vowel: /[\u064B-\u0650\u08F0-\u08F2]/, tanwin: /[\u064B-\u064D\u08F0-\u08F2]/,
    fatha: /[\u064E\u064B\u08F0]/, damma: /[\u064F\u064C\u08F1]/, kasra: /[\u0650\u064D\u08F2]/,
    sukun: /[\u0652\u06E1]/, shadda: /\u0651/, dagger: /\u0670/, maddah: /\u0653/,
    silent: /[\u06DF\u06E0]/, smallWaw: /\u06E5/, smallYa: /\u06E6/
  };
  const HAMZA = "\u0621\u0623\u0624\u0625\u0626";
  const HALQI = HAMZA + "هعحغخ";
  const IKHFA = "تثجدذزسشصضطظفقك";
  const QALQ = "قطبجد";
  const QAMARI = "ابجحخعغفقكمهوي\u0621\u0623\u0625\u0624\u0626";
  const MUTAJ = [["ت","د"],["ت","ط"],["د","ط"],["ث","ذ"],["ث","ظ"],["ذ","ظ"],["ب","م"]];
  const MUTAQ = [["ل","ر"],["ق","ك"]];
  const strip = s => s.replace(/[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06ED\u0640]/g, "");
  const norm = ch => ch === "ى" ? "ي" : ch;
  const ar = s => s; // placeholder untuk keterbacaan

  function parse(text) {
    text = text.replace(/\u0622/g, "\u0627\u0653").replace(/[\u06DD\u06DE\u06E9]/g, " ").replace(/[0-9\u0660-\u0669]+/g, " ");
    const words = [], U = [];
    text.split(/\s+/).filter(Boolean).forEach(raw => {
      if (!RE.letter.test(raw)) { words.push({ raw, sign: true, units: [] }); return; }
      const w = { raw, units: [] };
      let cur = null;
      for (const c of raw) {
        if (RE.letter.test(c)) { cur = { ch: norm(c), m: "", raw: c, w: words.length, k: w.units.length, id: U.length }; w.units.push(cur); U.push(cur); }
        else if (cur) { cur.m += c; cur.raw += c; }
      }
      words.push(w);
    });
    return { words, U };
  }

  const has = (u, k) => !!u && RE[k].test(u.m);
  const isHamza = u => !!u && HAMZA.includes(u.ch);
  const bare = u => u && !RE.vowel.test(u.m) && !RE.shadda.test(u.m) && !RE.dagger.test(u.m);
  const lastOf = (U, u) => { let j = u.id; while (U[j + 1] && U[j + 1].w === u.w) j++; return U[j]; };
  const wordText = (words, a, b) => words.slice(a, b + 1).filter(x => !x.sign).map(x => x.raw).join(" ");

  /* Huruf berikutnya yang benar-benar "dibaca" setelah unit i (melewati alif tanwin, alif sunyi, dan hamzah wasal) */
  function nextEff(U, i) {
    let j = i + 1, u = U[j];
    while (u && u.ch === "ا" && !RE.vowel.test(u.m) && !RE.maddah.test(u.m) && (RE.silent.test(u.m) || !U[j + 1] || U[j + 1].w !== u.w) && U[j - 1].w === u.w) { j++; u = U[j]; }
    if (!u) return null;
    if (u.ch === "\u0671") {
      const l = U[j + 1];
      if (l && l.w === u.w && l.ch === "ل") {
        if (has(l, "shadda")) return l;
        const t = U[j + 2];
        if (t && t.w === u.w && has(t, "shadda")) return t;
        return l;
      }
      return U[j + 1] || null;
    }
    return u;
  }

  function vowelOf(u) { // harakat yang menentukan bunyi huruf (untuk Lam Jalalah/Ra)
    if (!u) return null;
    if (has(u, "kasra")) return "kasra"; if (has(u, "damma")) return "damma"; if (has(u, "fatha")) return "fatha";
    return null;
  }

  function analyze(text) {
    const { words, U } = parse(text), F = [], n = U.length;
    const add = (o) => F.push(o);
    const mk = (cat, hukum, ids, sebab, cara, endW) => {
      const a = U[ids[0]];
      let b = U[endW !== undefined ? endW : ids[ids.length - 1]];
      if (["ikhfa","idgBG","idgBL","iqlab","izhar","mimIkh","mimIdg","mimIzh","idgMut"].includes(cat) && lastOf(U, a) === a && U[a.id + 1]) b = U[a.id + 1];
      add({ cat, hukum, ids, w: a.w, w2: Math.max(a.w, b.w), lafadz: wordText(words, a.w, Math.max(a.w, b.w)), sebab, cara });
    };
    // posisi akhir ayat
    const lastU = U[n - 1];

    for (let i = 0; i < n; i++) {
      const u = U[i], prev = U[i - 1], sameP = prev && prev.w === u.w;
      const nx = nextEff(U, i);
      const wordEnd = !U[i + 1] || U[i + 1].w !== u.w;

      /* ===== Nun sukun & Tanwin ===== */
      const tan = has(u, "tanwin"), nunS = u.ch === "ن" && !has(u, "vowel") && !has(u, "shadda") && !has(u, "dagger") && i !== n - 1;
      if ((tan || nunS) && nx) {
        const L = norm(nx.ch), src = tan ? "tanwin" : "nun sukun", crossWord = nx.w !== u.w || (U[i+1] && U[i+1].w !== u.w);
        const nunWord = nx.w !== u.w;
        const ids = [i];
        if ("ينمو".includes(L)) {
          if (!nunWord && !tan) mk("izhar", "Izhar Mutlaq", ids, `${src} bertemu "${L}" dalam satu kata`, "Dibaca jelas tanpa dengung berlebih (kata khusus: dunya, qinwan, shinwan, bunyan).");
          else mk("idgBG", "Idgham Bighunnah", ids, `${src} bertemu huruf "${L}" (huruf yanmu) di kata berikutnya`, "Dilebur ke huruf berikutnya sambil mendengung (ghunnah) ±2 harakat.");
        } else if ("لر".includes(L)) mk("idgBL", "Idgham Bilaghunnah", ids, `${src} bertemu huruf "${L}" di kata berikutnya`, "Dilebur ke huruf berikutnya TANPA dengung.");
        else if (L === "ب") mk("iqlab", "Iqlab", ids, `${src} bertemu huruf "ب"`, "Diganti bunyi mim samar, bibir dirapatkan, didengungkan ±2 harakat, lalu dibaca ba.");
        else if (HALQI.includes(L) || (L === "ا" && has(nx, "vowel"))) mk("izhar", "Izhar Halqi", ids, `${src} bertemu huruf halq "${L === "ا" ? "ء" : L}"`, "Dibaca jelas dan terang dari tenggorokan, tanpa dengung.");
        else if (IKHFA.includes(L)) mk("ikhfa", "Ikhfa Haqiqi", ids, `${src} bertemu huruf ikhfa "${L}"`, "Dibaca samar antara izhar dan idgham, dengung ±2 harakat, lidah tidak menempel makhraj nun.");
      }

      /* ===== Mim sukun ===== */
      if (u.ch === "م" && !has(u, "vowel") && !has(u, "shadda") && !has(u, "dagger") && nx && !RE.silent.test(u.m) && i !== n - 1) {
        const L = nx.ch;
        if (L === "م") mk("mimIdg", "Idgham Mimi (Mitslain Shaghir)", [i], 'mim sukun bertemu mim', "Dilebur ke mim berikutnya dan didengungkan ±2 harakat.");
        else if (L === "ب") mk("mimIkh", "Ikhfa Syafawi", [i], 'mim sukun bertemu "ب"', "Dibaca samar di bibir, dengung ±2 harakat, bibir hanya dirapatkan ringan.");
        else mk("mimIzh", "Izhar Syafawi", [i], `mim sukun bertemu "${L}"`, 'Dibaca jelas di bibir tanpa dengung' + ("وف".includes(L) ? " (hati-hati, jangan disamarkan sebelum و/ف)." : "."));
      }

      /* ===== Nun/Mim bertasydid ===== */
      if ((u.ch === "ن" || u.ch === "م") && has(u, "shadda"))
        mk("ghunnah", `Ghunnah (${u.ch === "ن" ? "Nun" : "Mim"} Musyaddadah)`, [i], `${u.ch === "ن" ? "nun" : "mim"} bertasydid`, "Didengungkan sempurna ±2 harakat.");

      /* ===== Qalqalah ===== */
      if (QALQ.includes(u.ch) && has(u, "sukun") && !has(u, "vowel"))
        mk("qalqalah", wordEnd && i === n - 1 ? "Qalqalah Kubra" : "Qalqalah Sughra", [i], `huruf "${u.ch}" (huruf qalqalah) berharakat sukun`, i === n - 1 ? "Dipantulkan kuat karena waqaf di akhir ayat." : "Dipantulkan ringan (memantul sedikit) di tengah kata/kalimat.");
      else if (i === n - 1 && QALQ.includes(u.ch) && !has(u, "tanwin"))
        mk("qalqalah", "Qalqalah Kubra", [i], `huruf "${u.ch}" di akhir ayat saat waqaf`, "Dipantulkan kuat karena huruf qalqalah dimatikan ketika berhenti.");

      /* ===== Idgham mutamatsilain / mutajanisain / mutaqaribain (antar kata) ===== */
      if (wordEnd && nx && nx.w !== u.w && has(nx, "shadda") && !has(u, "vowel") && !has(u, "tanwin") && !"ننم".includes(u.ch) && !(u.ch === "ن" || u.ch === "م") && !has(u, "dagger")) {
        const a = u.ch, b = nx.ch;
        if (a === b) mk("idgMut", "Idgham Mutamatsilain", [i], `dua huruf sama ("${a}") bertemu, pertama sukun`, "Huruf pertama dilebur ke huruf kedua (dibaca satu huruf bertasydid).");
        else if (MUTAJ.some(p => (p[0] === a && p[1] === b) || (p[1] === a && p[0] === b))) mk("idgMut", "Idgham Mutajanisain", [i], `"${a}" dan "${b}" satu makhraj, beda sifat`, "Huruf pertama dilebur penuh ke huruf kedua.");
        else if (MUTAQ.some(p => (p[0] === a && p[1] === b))) mk("idgMut", "Idgham Mutaqaribain", [i], `"${a}" dan "${b}" berdekatan makhraj/sifat`, "Huruf pertama dilebur ke huruf kedua.");
      }

      /* ===== Alif Lam ===== */
      if (u.ch === "\u0671" && U[i + 1] && U[i + 1].w === u.w && U[i + 1].ch === "ل") {
        const l = U[i + 1], t = U[i + 2], base = strip(words[u.w].raw);
        const jal = /^ٱللَّه|ٱللَّه$/.test(words[u.w].raw.replace(/\u0640/g, "")) && base.replace(/\u0671/g, "ا").match(/^(.*)ا?لله$/) && strip(words[u.w].raw).endsWith("لله") && U[i+3] && U[i+3].ch === "ه";
        if (!jal) {
          if (has(l, "shadda")) mk("lam", "Alif Lam Syamsiyah", [i, i + 1], 'alif lam bertemu huruf "ل" (huruf syamsiyah)', "Lam tidak dibaca, langsung melebur ke huruf lam bertasydid.");
          else if (t && has(t, "shadda")) mk("lam", "Alif Lam Syamsiyah", [i, i + 1, i + 2], `alif lam bertemu huruf "${t.ch}" (huruf syamsiyah)`, `Lam tidak dibaca, langsung melebur ke huruf "${t.ch}" yang ditasydid.`);
          else if (t && QAMARI.includes(t.ch)) mk("lam", "Alif Lam Qamariyah", [i, i + 1, i + 2], `alif lam bertemu huruf "${t.ch}" (huruf qamariyah)`, "Lam dibaca jelas (izhar).");
        }
      }
      /* ===== Lafdzul Jalalah ===== */
      if (u.ch === "ل" && has(u, "shadda") && U[i + 1] && U[i + 1].w === u.w && U[i + 1].ch === "ه" && prev && prev.w === u.w && prev.ch === "ل" && U[i - 2] && U[i - 2].w === u.w && (U[i - 2].ch === "\u0671" || U[i - 2].ch === "ا") && !U[i + 2 - 0 + 0] || (u.ch === "ل" && has(u, "shadda") && U[i+1] && U[i+1].ch === "ه" && U[i+1].w === u.w && prev && prev.ch === "ل" && prev.w === u.w && U[i+2] && U[i+2].w !== u.w) || (u.ch === "ل" && has(u, "shadda") && U[i+1] && U[i+1].ch === "ه" && U[i+1].w === u.w && prev && prev.ch === "ل" && prev.w === u.w && !U[i+2])) {
        const pw = U[i - 2];
        const first = pw && pw.k === 0 && (pw.ch === "\u0671" || pw.ch === "ا") ;
        if (first) {
          const prevWordLast = U[i - 3];
          let pv = null, why = "";
          if (!prevWordLast) { pv = "fatha"; why = "di awal bacaan"; }
          else {
            let p = prevWordLast;
            if (has(p, "sukun") || bare(p)) { const q = U[p.id - 1]; if (q && q.w === p.w && (p.ch === "و" || p.ch === "ي" || p.ch === "ا")) pv = p.ch === "و" ? "damma" : p.ch === "ا" ? "fatha" : "kasra"; else pv = vowelOf(q); }
            else pv = vowelOf(p);
            why = "didahului harakat " + ({ fatha: "fathah", damma: "dhammah", kasra: "kasrah" }[pv] || "-");
          }
          const nm = prev.id;
          if (pv === "kasra") mk("lam", "Lam Jalalah — Tarqiq", [U[i - 2].id, i - 1, i, i + 1], `lafdzul jalalah ${why}`, "Lam dibaca tipis.");
          else mk("lam", "Lam Jalalah — Tafkhim", [U[i - 2].id, i - 1, i, i + 1], `lafdzul jalalah ${why}`, "Lam dibaca tebal (mulut membulat).");
        }
      }

      /* ===== Mad ===== */
      let madType = null;
      if (sameP && !has(u, "silent")) {
        if (u.ch === "ا" && !has(u, "vowel") && has(prev, "fatha") && !has(prev, "tanwin")) madType = "ا";
        else if (u.ch === "و" && bare(u) && !has(u, "sukun") && has(prev, "damma") && !has(prev, "tanwin")) madType = "و";
        else if (u.ch === "ي" && bare(u) && !has(u, "sukun") && has(prev, "kasra") && !has(prev, "tanwin")) madType = "ي";
      }
      if (has(u, "dagger") && !has(u, "shadda") || (has(u, "dagger"))) madType = madType || "٠";
      const isSilaH = u.ch === "ه" && (has(u, "smallWaw") || has(u, "smallYa"));
      if (isSilaH) {
        if (isHamza(nx) || (nx && nx.ch === "\u0671" && false)) mk("mad", "Mad Shilah Thawilah", [i], 'ha dhamir diapit huruf berharakat dan diikuti hamzah', "Dibaca panjang 4–5 harakat.");
        else mk("mad", "Mad Shilah Qasirah", [i], "ha dhamir (kata ganti) diapit dua huruf berharakat", "Dibaca panjang 2 harakat (seperti mad thabi'i).");
      } else if (madType) {
        const nxt = U[i + 1];
        let hukum, sebab, cara, last = i === n - 1;
        const isFirstOf = nxt && nxt.w === u.w ? nxt : null;
        const ids = madType === "٠" ? [i] : [prev.id, i];
        const letterName = madType === "ا" ? "alif" : madType === "و" ? "waw sukun" : madType === "ي" ? "ya sukun" : "alif kecil (khanjariyah)";
        const preHamza = madType !== "٠" ? isHamza(prev) : false;
        if (isFirstOf && isHamza(isFirstOf)) { hukum = "Mad Wajib Muttasil"; sebab = `${letterName} bertemu hamzah dalam satu kata`; cara = "Dibaca panjang 4–5 harakat (wajib sama panjang)."; }
        else if (!isFirstOf && nx && nx.w !== u.w && isHamza(U[i + 1]) && !last) { hukum = "Mad Jaiz Munfasil"; sebab = `${letterName} di akhir kata bertemu hamzah di awal kata berikutnya`; cara = "Dibaca panjang 4–5 harakat (boleh 2 jika waqaf)."; }
        else if (isFirstOf && (has(isFirstOf, "shadda"))) { hukum = "Mad Lazim Kilmi Mutsaqqal"; sebab = `${letterName} bertemu huruf bertasydid dalam satu kata`; cara = "Dibaca panjang 6 harakat."; }
        else if (isFirstOf && has(isFirstOf, "sukun")) { hukum = "Mad Lazim Kilmi Mukhaffaf"; sebab = `${letterName} bertemu sukun asli`; cara = "Dibaca panjang 6 harakat."; }
        else if (last || (nxt && nxt.w !== u.w && false)) { hukum = "Mad Thabi'i"; sebab = `${letterName}`; cara = "Dibaca panjang 2 harakat."; }
        else if (preHamza) { hukum = "Mad Badal"; sebab = `${letterName} setelah hamzah dan tidak diikuti hamzah/sukun`; cara = "Dibaca panjang 2 harakat."; }
        else { hukum = "Mad Thabi'i"; sebab = `harakat ${madType === "ا" || madType === "٠" ? "fathah" : madType === "و" ? "dhammah" : "kasrah"} bertemu ${letterName}`; cara = "Dibaca panjang 2 harakat (tidak bertemu hamzah/sukun)."; }
        if (last && !hukum.includes("Wajib") && hukum !== "Mad Thabi'i") {}
        mk("mad", hukum, ids, sebab, cara);
      }
      // Mad 'Aridh lissukun & Mad Layyin & Mad 'Iwadh di akhir ayat
      if (i === n - 1) {
        if (has(u, "tanwin") && has(u, "fatha") && false) {}
        const pu = U[i - 1];
        if (pu && pu.w === u.w && !(has(u, "tanwin") && has(u, "fatha"))) {
          const pp = U[i - 2];
          const madBefore = pp && pp.w === u.w && ((pu.ch === "ا" && !has(pu, "vowel") && has(pp, "fatha")) || (pu.ch === "و" && bare(pu) && !has(pu,"sukun") && has(pp, "damma")) || (pu.ch === "ي" && bare(pu) && !has(pu,"sukun") && has(pp, "kasra")));
          if (madBefore) for (let q = F.length - 1; q >= 0; q--) if (F[q].cat === "mad" && F[q].ids.includes(pu.id) && F[q].hukum === "Mad Thabi'i") F.splice(q, 1);
          if (madBefore) mk("mad", "Mad 'Aridh Lissukun", [pp.id, pu.id, i], "mad thabi'i bertemu huruf yang dimatikan karena waqaf", "Boleh dibaca 2, 4, atau 6 harakat (paling umum 4–6).");
          else if (pu && pu.ch !== "ا" && (pu.ch === "و" || pu.ch === "ي") && has(pu, "sukun") && pp && has(pp, "fatha")) mk("mad", "Mad Layyin", [pp.id, pu.id, i], `${pu.ch} sukun didahului fathah, lalu waqaf`, "Boleh dibaca 2, 4, atau 6 harakat.");
        }
        if (has(u, "fatha") && has(u, "tanwin") && !pu) {}
      }
      if (has(u, "tanwin") && has(u, "fatha") && wordEnd && U[i + 1] === undefined) {}
      if (wordEnd && !U[i + 1] && has(u, "tanwin") && has(u, "fatha")) mk("mad", "Mad 'Iwadh", [i], "tanwin fathah di akhir ayat saat waqaf", "Tanwin dibaca seperti alif panjang 2 harakat.");
      else if (wordEnd && !U[i + 1] === false && false) {}
      if (wordEnd && !U[i + 1] && u.ch === "ا" && !has(u, "vowel") && pu0(U, i) && has(pu0(U, i), "tanwin") && has(pu0(U, i), "fatha") && !F.some(f => f.hukum === "Mad 'Iwadh")) mk("mad", "Mad 'Iwadh", [pu0(U, i).id, i], "tanwin fathah di akhir ayat saat waqaf", "Tanwin dibaca seperti alif panjang 2 harakat.");

      /* ===== Ra ===== */
      if (u.ch === "ر") {
        const v = vowelOf(u);
        if (has(u, "shadda") || v === "fatha" || v === "damma") mk("ra", "Ra Tafkhim", [i], `ra berharakat ${v === "damma" ? "dhammah" : "fathah"}${has(u, "shadda") ? " bertasydid" : ""}`, "Dibaca tebal.");
        else if (v === "kasra") mk("ra", "Ra Tarqiq", [i], "ra berharakat kasrah", "Dibaca tipis.");
        else if (has(u, "sukun") || bare(u)) {
          if (prev && prev.w === u.w) {
            const pv = vowelOf(prev), nxx = U[i + 1];
            if (pv === "kasra" && !(nxx && nxx.w === u.w && "صضطظقخغ".includes(nxx.ch))) mk("ra", "Ra Tarqiq", [i], "ra sukun didahului kasrah asli", "Dibaca tipis.");
            else mk("ra", "Ra Tafkhim", [i], `ra sukun didahului ${pv === "kasra" ? "kasrah lalu huruf isti'la" : pv === "damma" ? "dhammah" : "fathah"}`, "Dibaca tebal.");
          }
        }
      }
    }
    // ringkas: hapus duplikat (id sama + hukum sama)
    const seen = new Set(), out = [];
    F.sort((a, b) => a.ids[0] - b.ids[0]);
    for (const f of F) { const k = f.ids.join(",") + f.hukum; if (!seen.has(k)) { seen.add(k); out.push(f); } }
    return { words, U, findings: out };
  }
  function pu0(U, i) { return U[i - 1] && U[i - 1].w === U[i].w ? U[i - 1] : null; }

  /* Render ayat sebagai HTML dengan sorotan warna per hukum. */
  function render(res, enabled) {
    const color = new Map();
    res.findings.forEach((f, fi) => { if (enabled && !enabled.has(f.cat)) return; f.ids.forEach(id => { if (!color.has(id) || f.ids.length <= 3) color.set(id, [f.cat, fi]); }); });
    const esc = s => s.replace(/[&<>]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));
    return res.words.map(w => {
      if (w.sign) return `<span class="sg">${esc(w.raw)}</span>`;
      return `<span class="aw" data-w="${res.words.indexOf(w)}">` + w.units.map(u => { const c = color.get(u.id); return c ? `<span class="hl" style="--c:${CATS[c[0]].color}" data-f="${c[1]}">${esc(u.raw)}</span>` : esc(u.raw); }).join("") + `</span>`;
    }).join(" ");
  }
  root.Tajwid = { analyze, render, CATS, strip };
})(typeof window !== "undefined" ? window : globalThis);
