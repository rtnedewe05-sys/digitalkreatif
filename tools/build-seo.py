#!/usr/bin/env python3
"""Membangun halaman statis ramah-Google untuk tiap surah.

Aplikasi utama memakai alamat '#/surah/N' yang tidak dihitung Google sebagai halaman
terpisah. Skrip ini membaca data yang sudah ada di repo (data/surahs.json, data/riwayat.json,
s/N.json) lalu menulis:

  surah/index.html                 daftar 114 surat (pusat tautan internal)
  surah/<n>-<nama>/index.html      satu halaman per surat: teks Arab, latin, terjemahan
  sitemap.xml                      beranda + daftar surat + 114 surat

Setiap halaman punya judul, deskripsi, dan canonical yang unik, serta tombol ke versi
interaktif di aplikasi (/#/surah/N).

Pakai (dari akar repo):
  python3 tools/build-seo.py                  tulis langsung ke akar repo
  python3 tools/build-seo.py --out /jalur     tulis ke folder lain (untuk uji coba)
  python3 tools/build-seo.py --site https://contoh.id   ganti alamat situs

Hanya memakai pustaka standar Python 3.
"""
import argparse
import datetime
import html
import json
import re
import unicodedata
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
BRAND = "Al-Quran"
BISMILLAH = "بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ"


def esc(s):
    return html.escape(str(s), quote=True)


def ascii_name(s):
    """'Al-Fātiḥah' -> 'Al-Fatihah'; 'Al-An‘ām' -> \"Al-An'am\" (yang diketik orang di Google)."""
    t = unicodedata.normalize("NFD", s)
    t = "".join(c for c in t if not unicodedata.combining(c))
    t = t.replace("‘", "'").replace("’", "'").replace("ʿ", "'").replace("ʾ", "'")
    return t.lstrip("'")  # '‘Abasa' -> 'Abasa'


def slugify(s):
    t = ascii_name(s).lower().replace("'", "")
    return re.sub(r"[^a-z0-9]+", "-", t).strip("-")


def trim(text, limit):
    if len(text) <= limit:
        return text
    cut = text[: limit - 1].rsplit(" ", 1)[0].rstrip(",.;:- ")
    return cut + "…"


CSS = """
@font-face{font-family:AmiriQ;src:url(/fonts/amiri-quran-arabic-400-normal.woff2) format("woff2");font-display:swap}
:root{--bg:#f6f8f6;--card:#fff;--tx:#14201b;--mu:#5b6b63;--ac:#0f766e;--ac2:#0b5a54;--bd:#dbe4df}
@media(prefers-color-scheme:dark){:root{--bg:#0f1815;--card:#16231e;--tx:#e8f0ec;--mu:#9bb0a6;--ac:#2dd4bf;--ac2:#5eead4;--bd:#243a32}}
*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--tx);font:16px/1.65 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif}
a{color:var(--ac2)}
.wrap{max-width:820px;margin:0 auto;padding:0 16px 48px}
.top{background:var(--ac);color:#fff}
.top .wrap{display:flex;gap:16px;align-items:center;justify-content:space-between;padding:12px 16px}
.top a{color:#fff;text-decoration:none;font-weight:600}
.crumb{font-size:14px;color:var(--mu);margin:16px 0}
.crumb a{color:var(--mu)}
h1{font-size:28px;line-height:1.25;margin:8px 0 4px}
.hero{background:var(--card);border:1px solid var(--bd);border-radius:14px;padding:20px;margin:12px 0;text-align:center}
.hero .nm{font:42px/1.6 AmiriQ,serif;margin:0}
.meta{color:var(--mu);margin:4px 0 14px}
.btn{display:inline-block;padding:10px 18px;border-radius:10px;border:1px solid var(--ac);color:var(--ac2);text-decoration:none;font-weight:600;margin:4px}
.btn.p{background:var(--ac);color:#fff}
.info{background:var(--card);border:1px solid var(--bd);border-radius:14px;padding:6px 18px;margin:12px 0}
.info h2,.sec{font-size:18px;margin:16px 0 6px}
.info ul{padding-left:20px}
.bism{font:30px/2 AmiriQ,serif;text-align:center;margin:20px 0}
.ay{background:var(--card);border:1px solid var(--bd);border-radius:14px;padding:14px 18px;margin:10px 0}
.ay .n{display:inline-block;min-width:30px;padding:0 8px;border-radius:99px;background:var(--ac);color:#fff;font-size:13px;text-align:center;text-decoration:none}
.ay .ar{font:30px/2.1 AmiriQ,serif;text-align:right;margin:8px 0}
.ay .la{color:var(--ac2);font-style:italic;margin:2px 0}
.ay .id{margin:4px 0 2px}
.pager{display:flex;gap:8px;justify-content:space-between;flex-wrap:wrap;margin:24px 0}
.list{list-style:none;padding:0;margin:0;display:grid;gap:8px}
.list a{display:flex;gap:12px;align-items:center;background:var(--card);border:1px solid var(--bd);border-radius:12px;padding:10px 14px;text-decoration:none;color:var(--tx)}
.list .b{min-width:34px;height:34px;border-radius:50%;background:var(--ac);color:#fff;display:flex;align-items:center;justify-content:center;font-size:14px}
.list .t{flex:1}.list small{display:block;color:var(--mu)}
.list .a{font:22px/1.4 AmiriQ,serif}
footer{color:var(--mu);font-size:14px;text-align:center;margin-top:32px}
""".strip()


def head(title, desc, canonical, ld=None, og_type="article"):
    parts = [
        '<!DOCTYPE html>',
        '<html lang="id">',
        '<head>',
        '<meta charset="utf-8">',
        '<meta name="viewport" content="width=device-width, initial-scale=1">',
        f'<title>{esc(title)}</title>',
        f'<meta name="description" content="{esc(desc)}">',
        f'<link rel="canonical" href="{esc(canonical)}">',
        '<meta name="robots" content="index,follow,max-snippet:-1">',
        '<meta name="theme-color" content="#0f766e">',
        '<link rel="icon" type="image/png" href="/icons/icon-192.png">',
        f'<meta property="og:site_name" content="{esc(BRAND)}">',
        '<meta property="og:locale" content="id_ID">',
        f'<meta property="og:type" content="{og_type}">',
        f'<meta property="og:title" content="{esc(title)}">',
        f'<meta property="og:description" content="{esc(desc)}">',
        f'<meta property="og:url" content="{esc(canonical)}">',
        '<meta name="twitter:card" content="summary">',
        f'<style>{CSS}</style>',
    ]
    if ld:
        data = json.dumps(ld, ensure_ascii=False).replace("</", "<\\/")
        parts.append(f'<script type="application/ld+json">{data}</script>')
    parts.append('</head>')
    return "\n".join(parts)


def topbar():
    return (
        '<header class="top"><div class="wrap">'
        f'<a href="/">{esc(BRAND)}</a>'
        '<nav><a href="/surah/">Daftar Surat</a></nav>'
        '</div></header>'
    )


def footer():
    return (
        f'<footer><p><a href="/">{esc(BRAND)}</a> · <a href="/surah/">Daftar 114 surat</a></p></footer>'
    )


def breadcrumb_ld(site, items):
    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {"@type": "ListItem", "position": i + 1, "name": name, "item": url}
            for i, (name, url) in enumerate(items)
        ],
    }


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--out", default=str(ROOT), help="folder tujuan (default: akar repo)")
    ap.add_argument("--site", default="https://tajwidku.my.id", help="alamat situs tanpa garis miring akhir")
    ap.add_argument("--date", default=datetime.date.today().isoformat(), help="tanggal lastmod (YYYY-MM-DD)")
    args = ap.parse_args()

    out = Path(args.out)
    site = args.site.rstrip("/")
    surahs = json.loads((ROOT / "data" / "surahs.json").read_text(encoding="utf-8"))
    riwayat = json.loads((ROOT / "data" / "riwayat.json").read_text(encoding="utf-8"))

    for s in surahs:
        s["ascii"] = ascii_name(s["la"])
        s["slug"] = f'{s["n"]}-{slugify(s["la"])}'
        s["path"] = f'/surah/{s["slug"]}/'

    # ---------- halaman tiap surat ----------
    (out / "surah").mkdir(parents=True, exist_ok=True)
    titles, descs = set(), set()
    for i, s in enumerate(surahs):
        n = s["n"]
        data = json.loads((ROOT / "s" / f"{n}.json").read_text(encoding="utf-8"))
        assert len(data["ayat"]) == s["count"], f"jumlah ayat surat {n} tidak cocok"
        rw = riwayat.get(str(n)) or {}

        title = f'Surat {s["ascii"]}: Arab, Latin, Terjemahan | {BRAND}'
        desc = trim(
            f'Baca Surat {s["ascii"]} ({s["ar"]}), artinya {s["mean"]}: {s["count"]} ayat, {s["place"]}. '
            "Teks Arab, latin, dan terjemahan Indonesia lengkap, plus tajwid berwarna, murottal, dan tafsir.",
            165,
        )
        assert title not in titles and desc not in descs, f"judul/deskripsi ganda di surat {n}"
        titles.add(title)
        descs.add(desc)
        canonical = site + s["path"]

        ld = breadcrumb_ld(site, [
            ("Beranda", site + "/"),
            ("Daftar Surat", site + "/surah/"),
            (f'Surat {s["ascii"]}', canonical),
        ])

        info = []
        if rw.get("t"):
            info.append(f'<p>{esc(rw["t"])}</p>')
        facts = [
            f'Surat ke-{n} dalam mushaf',
            f'{s["count"]} ayat',
            s["place"],
        ]
        if rw.get("o"):
            facts.append(f'urutan turun ke-{rw["o"]} dari 114 surat')
        info.append(f'<p>{esc(" · ".join(facts))}.</p>')
        if rw.get("n"):
            info.append(f'<p><b>Nama lain:</b> {esc(rw["n"])}</p>')
        if rw.get("k"):
            info.append(f'<p><b>Keutamaan:</b> {esc(rw["k"])}</p>')
        if rw.get("g"):
            lis = "".join(f'<li><b>Ayat {esc(g[0])}:</b> {esc(g[1])}</li>' for g in rw["g"])
            info.append(f'<h2>Tema per kelompok ayat</h2><ul>{lis}</ul>')
        info_html = (
            f'<section class="info"><h2>Tentang Surat {esc(s["ascii"])}</h2>' + "".join(info) + "</section>"
        )

        ayat_html = []
        for a in data["ayat"]:
            num = esc(a["a"])
            ayat_html.append(
                f'<article class="ay" id="ayat-{num}">'
                f'<a class="n" href="#ayat-{num}" aria-label="Ayat {num}">{num}</a>'
                f'<p class="ar" lang="ar" dir="rtl">{esc(a["ar"])}</p>'
                f'<p class="la">{esc(a["la"])}</p>'
                f'<p class="id">{esc(a["id"])}</p>'
                "</article>"
            )

        bism = f'<p class="bism" lang="ar" dir="rtl">{BISMILLAH}</p>' if n not in (1, 9) else ""
        prev_s = surahs[i - 1] if i > 0 else None
        next_s = surahs[i + 1] if i < len(surahs) - 1 else None
        pager = (
            '<nav class="pager" aria-label="Surat sebelum dan sesudah">'
            + (f'<a class="btn" href="{prev_s["path"]}">← {esc(prev_s["ascii"])}</a>' if prev_s else "<span></span>")
            + '<a class="btn" href="/surah/">Daftar Surat</a>'
            + (f'<a class="btn" href="{next_s["path"]}">{esc(next_s["ascii"])} →</a>' if next_s else "<span></span>")
            + "</nav>"
        )

        body = f"""<body>
{topbar()}
<main class="wrap">
<nav class="crumb" aria-label="Jejak"><a href="/">Beranda</a> › <a href="/surah/">Daftar Surat</a> › Surat {esc(s["ascii"])}</nav>
<section class="hero">
<h1>Surat {esc(s["ascii"])}</h1>
<p class="nm" lang="ar" dir="rtl">{esc(s["ar"])}</p>
<p class="meta">{esc(s["mean"])} · {esc(s["place"])} · {s["count"]} ayat</p>
<a class="btn p" href="/#/surah/{n}">Buka versi interaktif</a>
<p class="meta" style="margin:6px 0 0">Tajwid berwarna, arti per kata, murottal, dan tafsir</p>
</section>
{info_html}
<h2 class="sec">Teks Arab, latin, dan terjemahan Surat {esc(s["ascii"])}</h2>
{bism}
{"".join(ayat_html)}
<p style="text-align:center"><a class="btn p" href="/#/surah/{n}">Dengarkan dan pelajari tajwid Surat {esc(s["ascii"])}</a></p>
{pager}
</main>
{footer()}
</body>
</html>"""

        d = out / "surah" / s["slug"]
        d.mkdir(parents=True, exist_ok=True)
        (d / "index.html").write_text(head(title, desc, canonical, ld) + "\n" + body, encoding="utf-8")

    # ---------- halaman daftar surat ----------
    hub_title = f"Daftar 114 Surat Al-Qur'an: Arab, Latin, Terjemahan | {BRAND}"
    hub_desc = (
        "Daftar 114 surat Al-Qur'an dari Al-Fatihah sampai An-Nas, lengkap dengan arti nama, "
        "tempat turun, dan jumlah ayat. Pilih surat untuk membaca Arab, latin, dan terjemahan."
    )
    hub_url = site + "/surah/"
    items = "".join(
        f'<li><a href="{s["path"]}"><span class="b">{s["n"]}</span>'
        f'<span class="t"><b>{esc(s["ascii"])}</b><small>{esc(s["mean"])} · {esc(s["place"])} · {s["count"]} ayat</small></span>'
        f'<span class="a" lang="ar" dir="rtl">{esc(s["ar"])}</span></a></li>'
        for s in surahs
    )
    hub_ld = breadcrumb_ld(site, [("Beranda", site + "/"), ("Daftar Surat", hub_url)])
    hub = f"""{head(hub_title, hub_desc, hub_url, hub_ld, og_type="website")}
<body>
{topbar()}
<main class="wrap">
<nav class="crumb" aria-label="Jejak"><a href="/">Beranda</a> › Daftar Surat</nav>
<h1>Daftar 114 Surat Al-Qur'an</h1>
<p class="meta">Pilih surat untuk membaca teks Arab, latin, dan terjemahan Indonesia. Untuk tajwid berwarna, murottal, dan tafsir, buka <a href="/">{esc(BRAND)}</a>.</p>
<ul class="list">{items}</ul>
</main>
{footer()}
</body>
</html>"""
    (out / "surah" / "index.html").write_text(hub, encoding="utf-8")

    # ---------- sitemap ----------
    urls = [(site + "/", "1.0", "weekly"), (hub_url, "0.9", "monthly")]
    urls += [(site + s["path"], "0.8", "monthly") for s in surahs]
    xml = ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
    for loc, pri, freq in urls:
        xml.append(
            f"  <url><loc>{esc(loc)}</loc><lastmod>{args.date}</lastmod>"
            f"<changefreq>{freq}</changefreq><priority>{pri}</priority></url>"
        )
    xml.append("</urlset>")
    (out / "sitemap.xml").write_text("\n".join(xml) + "\n", encoding="utf-8")

    print(f"Selesai: {len(surahs)} halaman surat, 1 daftar surat, sitemap {len(urls)} URL -> {out}")


if __name__ == "__main__":
    main()
