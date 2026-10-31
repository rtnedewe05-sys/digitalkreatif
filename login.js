'use strict';
/* Gerbang login — Al-Quran
 * CATATAN: aplikasi ini statis (tanpa server), jadi login ini hanya pembatas tampilan di sisi peserta (client-side).
 * Kata sandi tidak disimpan polos (hanya hash SHA-256), tetapi siapa pun yang paham DevTools tetap bisa melewatinya.
 * Untuk keamanan sungguhan, gunakan autentikasi di server. */
(() => {
  const KEY = 'qp_auth';
  const SALT = 'qp-v1';
  const EXPECTED = '65973877adedf82967b1e7a509de534c2d0f6f3214f430a550d89bf237121909'; // sha256(SALT|user|pass)
  const DAY = 864e5;
  const REMEMBER_DAYS = 30;
  const MAX_TRIES = 5, COOLDOWN = 30; // detik

  /* ---------- SHA-256 murni JS (tidak bergantung pada HTTPS/crypto.subtle) ---------- */
  function sha256(str) {
    const b = new TextEncoder().encode(str), l = b.length, n = ((l + 9 + 63) >> 6) << 6;
    const m = new Uint8Array(n); m.set(b); m[l] = 0x80;
    const dv = new DataView(m.buffer);
    dv.setUint32(n - 4, (l * 8) >>> 0); dv.setUint32(n - 8, Math.floor((l * 8) / 4294967296));
    const K = [], H = [];
    for (let p = 2, c = 0; c < 64; p++) {
      let prime = true; for (let d = 2; d * d <= p; d++) if (p % d === 0) { prime = false; break; }
      if (!prime) continue;
      if (c < 8) H[c] = (Math.pow(p, .5) % 1 * 4294967296) | 0;
      K[c++] = (Math.pow(p, 1 / 3) % 1 * 4294967296) | 0;
    }
    const rr = (x, k) => (x >>> k) | (x << (32 - k)), w = new Array(64);
    for (let o = 0; o < n; o += 64) {
      for (let i = 0; i < 16; i++) w[i] = dv.getUint32(o + i * 4);
      for (let i = 16; i < 64; i++) {
        const a = w[i - 15], c = w[i - 2];
        w[i] = (w[i - 16] + (rr(a, 7) ^ rr(a, 18) ^ (a >>> 3)) + w[i - 7] + (rr(c, 17) ^ rr(c, 19) ^ (c >>> 10))) | 0;
      }
      let [a, b2, c, d, e, f, g, h] = H;
      for (let i = 0; i < 64; i++) {
        const t1 = (h + (rr(e, 6) ^ rr(e, 11) ^ rr(e, 25)) + ((e & f) ^ (~e & g)) + K[i] + w[i]) | 0;
        const t2 = ((rr(a, 2) ^ rr(a, 13) ^ rr(a, 22)) + ((a & b2) ^ (a & c) ^ (b2 & c))) | 0;
        h = g; g = f; f = e; e = (d + t1) | 0; d = c; c = b2; b2 = a; a = (t1 + t2) | 0;
      }
      [a, b2, c, d, e, f, g, h].forEach((v, i) => { H[i] = (H[i] + v) | 0; });
    }
    return H.map(v => (v >>> 0).toString(16).padStart(8, '0')).join('');
  }

  /* ---------- Sesi ---------- */
  const read = st => { try { return JSON.parse(st.getItem(KEY) || 'null'); } catch { return null; } };
  function validSession() {
    for (const st of [safe('localStorage'), safe('sessionStorage')]) {
      if (!st) continue;
      const s = read(st);
      if (s && s.h === EXPECTED && s.exp > Date.now()) return s;
      if (s) { try { st.removeItem(KEY); } catch { /* abaikan */ } }
    }
    return null;
  }
  function safe(name) { try { return window[name]; } catch { return null; } }
  function saveSession(user, remember) {
    const val = JSON.stringify({ h: EXPECTED, u: user, exp: Date.now() + (remember ? REMEMBER_DAYS * DAY : DAY) });
    try { (remember ? localStorage : sessionStorage).setItem(KEY, val); } catch { /* mode privat: sesi hanya di memori halaman */ }
  }
  function clearSession() {
    ['localStorage', 'sessionStorage'].forEach(n => { try { window[n].removeItem(KEY); } catch { /* abaikan */ } });
  }

  const session = validSession();
  const root = document.documentElement;
  if (!session) root.classList.add('locked'); // sebelum render pertama → tidak ada kedipan isi aplikasi

  /* ---------- UI ---------- */
  function star(color, w) {
    // bintang segi delapan (dua persegi bertumpuk) + berlian penghubung di sudut kotak 96×96
    const s = `<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96" fill="none" stroke="${color}" stroke-width="${w}" stroke-linejoin="round">` +
      `<path d="M19 19H77V77H19Z"/><path d="M48 7.4 88.6 48 48 88.6 7.4 48Z"/>` +
      `<path d="M0 0 19 19M96 0 77 19M0 96 19 77M96 96 77 77"/><circle cx="48" cy="48" r="9"/></svg>`;
    return 'url("data:image/svg+xml,' + encodeURIComponent(s) + '")';
  }

  function init() {
    const el = document.getElementById('login');
    if (!el) return;
    const $ = s => el.querySelector(s);
    el.style.setProperty('--pat-dim', star('rgba(120,220,200,.075)', 1));
    el.style.setProperty('--pat-lit', star('rgba(94,234,212,.55)', 1.2));

    const form = $('#lgForm'), user = $('#lgUser'), pass = $('#lgPass'), eye = $('#lgEye'),
      remember = $('#lgRemember'), msg = $('#lgMsg'), go = $('#lgGo'), card = $('.lg-card-l');
    const goLabel = go.textContent;

    /* Cahaya pola mengikuti kursor/jari; saat diam, melayang pelan */
    const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let lastMove = 0, raf = 0;
    const setGlow = (x, y) => { el.style.setProperty('--mx', x + 'px'); el.style.setProperty('--my', y + 'px'); };
    setGlow(innerWidth * .32, innerHeight * .38);
    el.addEventListener('pointermove', e => { lastMove = performance.now(); setGlow(e.clientX, e.clientY); });
    if (!still) {
      const drift = t => {
        if (!root.classList.contains('locked')) return;
        if (t - lastMove > 2500) {
          const k = t / 1000;
          setGlow(innerWidth * (.5 + .38 * Math.sin(k * .21)), innerHeight * (.45 + .32 * Math.sin(k * .17 + 1.3)));
        }
        raf = requestAnimationFrame(drift);
      };
      raf = requestAnimationFrame(drift);
    }

    eye.addEventListener('click', () => {
      const show = pass.type === 'password';
      pass.type = show ? 'text' : 'password';
      eye.setAttribute('aria-pressed', String(show));
      eye.setAttribute('aria-label', show ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi');
      eye.classList.toggle('on', show);
      pass.focus();
    });

    let fails = 0, until = 0, timer = 0;
    const say = t => { msg.textContent = t || ''; };
    const lockTick = () => {
      const left = Math.ceil((until - Date.now()) / 1000);
      if (left > 0) { say(`Terlalu banyak percobaan. Coba lagi dalam ${left} detik.`); go.disabled = true; return; }
      clearInterval(timer); go.disabled = false; fails = 0; say('');
    };

    form.addEventListener('submit', async e => {
      e.preventDefault();
      if (Date.now() < until) return;
      say('');
      go.disabled = true; go.innerHTML = '<span class="lg-sp" aria-hidden="true"></span><span>Memeriksa…</span>';
      const u = user.value.trim().toLowerCase(), p = pass.value;
      await new Promise(r => setTimeout(r, 420)); // jeda singkat agar terasa nyata dan memperlambat tebak-tebakan
      const ok = sha256(`${SALT}|${u}|${p}`) === EXPECTED;
      go.innerHTML = ''; go.textContent = goLabel;
      if (ok) {
        saveSession(u, remember.checked);
        pass.value = '';
        el.classList.add('leaving');
        setTimeout(() => {
          root.classList.remove('locked'); el.classList.remove('leaving'); cancelAnimationFrame(raf);
          window.scrollTo(0, 0);
          const t = document.getElementById('appTitle'); if (t) t.focus({ preventScroll: true });
          window.dispatchEvent(new Event('qp-login'));
        }, still ? 0 : 440);
        return;
      }
      go.disabled = false; fails++;
      say('Nama pengguna atau kata sandi salah.');
      card.classList.remove('shake'); void card.offsetWidth; card.classList.add('shake');
      pass.select();
      if (fails >= MAX_TRIES) { until = Date.now() + COOLDOWN * 1000; clearInterval(timer); timer = setInterval(lockTick, 500); lockTick(); }
    });

    if (root.classList.contains('locked')) user.focus({ preventScroll: true });
  }

  /* Tombol Keluar (ada di Pengaturan) */
  function wireLogout() {
    const b = document.getElementById('btnLogout'); if (!b) return;
    const s = validSession();
    const who = document.getElementById('lgWho');
    if (who && s && s.u) who.textContent = s.u;
    window.addEventListener('qp-login', () => { const s2 = validSession(); if (who && s2) who.textContent = s2.u; });
    b.addEventListener('click', () => { clearSession(); location.reload(); });
  }

  const ready = () => { init(); wireLogout(); };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ready); else ready();
})();
