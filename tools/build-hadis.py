#!/usr/bin/env python3
"""Bangun data hadis (Shahih Bukhari & Shahih Muslim) untuk aplikasi.
Sumber: https://github.com/gadingnst/hadith-api (lisensi MIT; teks Arab + terjemahan Indonesia).
Pakai:  python3 tools/build-hadis.py <folder-berisi-bukhari.json-dan-muslim.json>
Keluaran di data/hadis/: meta.json, <kitab>-<n>.json (50 hadis/berkas), cari-<kitab>.json, pilihan.json"""
import json, re, sys, os
src = sys.argv[1] if len(sys.argv) > 1 else 'books'
out = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'data', 'hadis')
os.makedirs(out, exist_ok=True)
CH = 50
NAMES = {'bukhari': 'Shahih Bukhari', 'muslim': 'Shahih Muslim'}

def clean(s): return re.sub(r'[ \t]+', ' ', re.sub(r'\s*\n\s*', ' ', s)).strip()
def matn(t):                      # buang rantai perawi (di dalam [...]) untuk indeks cari
    q = t.find('"', 0, 900)
    if q >= 0: return clean(t[q:])
    i = t.rfind(']', 0, 900)
    return clean(t[i + 1:] if i >= 0 else t).lstrip(' ,;:')

meta, pil_src = {}, {}
for b in NAMES:
    data = json.load(open(os.path.join(src, b + '.json'), encoding='utf-8'))
    data = [[h['number'], clean(h['arab']), clean(h['id'])] for h in data]
    data.sort(key=lambda x: x[0])
    chunks = [data[i:i + CH] for i in range(0, len(data), CH)]
    for k, c in enumerate(chunks):
        json.dump(c, open(f'{out}/{b}-{k}.json', 'w', encoding='utf-8'), ensure_ascii=False, separators=(',', ':'))
    json.dump([[x[0], matn(x[2])[:300]] for x in data], open(f'{out}/cari-{b}.json', 'w', encoding='utf-8'), ensure_ascii=False, separators=(',', ':'))
    meta[b] = {'nama': NAMES[b], 'total': len(data), 'ch': CH, 'first': [c[0][0] for c in chunks], 'max': data[-1][0]}
    pil_src[b] = {x[0]: x for x in data}
json.dump(meta, open(f'{out}/meta.json', 'w'), separators=(',', ':'))

PIL = [('bukhari', 1), ('bukhari', 5559), ('bukhari', 5649), ('bukhari', 5927), ('muslim', 131)]
json.dump([{'b': b, 'n': n, 'a': pil_src[b][n][1], 'i': pil_src[b][n][2]} for b, n in PIL if n in pil_src[b]],
          open(f'{out}/pilihan.json', 'w', encoding='utf-8'), ensure_ascii=False, separators=(',', ':'))
print('selesai', {b: m['total'] for b, m in meta.items()})
