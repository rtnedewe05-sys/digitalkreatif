# Membuat tajwid-k/N.json: warna tajwid (data Madinah/Uthmani) dipetakan ke teks Kemenag (s/N.json -> ar)
import json, glob, os, sys, unicodedata, difflib, collections
ROOT = sys.argv[1]
OUT = os.path.join(ROOT, 'tajwid-k'); os.makedirs(OUT, exist_ok=True)

LETTER_MAP = {0x671:0x627,0x623:0x627,0x625:0x627,0x622:0x627,0x649:0x64A,0x6CC:0x64A,0x626:0x64A,0x624:0x648}
def is_letter(c):
    o = ord(c)
    return (0x621 <= o <= 0x64A and o != 0x640) or (0x671 <= o <= 0x6D3) or o == 0x6D5
def mark_class(c):
    o = ord(c)
    if o in (0x64B,0x64C,0x64D,0x64E,0x64F,0x650,0x656,0x657,0x6E5,0x6E6,0x618,0x619,0x61A): return 'vow'
    if o in (0x652,0x6E1): return 'suk'
    if o == 0x651: return 'shd'
    if o == 0x670: return 'alef'
    if o in (0x653,0x6E4): return 'madd'
    if o in (0x654,0x655): return 'hamza'
    if o in (0x6DF,0x6E0): return 'zero'
    if o == 0x640: return None            # tatweel diabaikan
    return 'small'
def clusters(s):
    """-> list of dict(letter_idx or None, letter_norm, marks=[(idx, class)]); idx = posisi karakter di s"""
    cl = []
    for i, c in enumerate(s):
        if is_letter(c):
            n = LETTER_MAP.get(ord(c), ord(c))
            cl.append({'li': i, 'n': n, 'marks': []})
        elif c == ' ':
            continue
        else:
            k = mark_class(c)
            if k is None: continue
            if unicodedata.category(c) in ('Mn','Lm','Me','Cf','Po','So') or True:
                if cl: cl[-1]['marks'].append((i, k))
    return cl

def build(kem, items):
    # teks Uthmani + kode per karakter
    uth = ''; code = []
    for it in items:
        t, c = (it, None) if isinstance(it, str) else (it[0], it[1])
        uth += t; code += [c] * len(t)
    cu, ck = clusters(uth), clusters(kem)
    sm = difflib.SequenceMatcher(None, [x['n'] for x in ck], [x['n'] for x in cu], autojunk=False)
    pairs = {}   # indeks cluster uth -> cluster kem
    for tag, i1, i2, j1, j2 in sm.get_opcodes():
        if tag == 'equal' or (tag == 'replace' and i2 - i1 == j2 - j1):
            for d in range(i2 - i1): pairs[j1 + d] = i1 + d
    matched = set(pairs.values())
    kc = [None] * len(kem)
    tot = got = 0
    for ju, u in enumerate(cu):
        ki = pairs.get(ju)
        # warna huruf
        if code[u['li']]:
            tot += 1
            if ki is not None: kc[ck[ki]['li']] = code[u['li']]; got += 1
        for (mi, mk) in u['marks']:
            if not code[mi]: continue
            tot += 1
            if ki is None: continue
            hit = [m for (m, k2) in ck[ki]['marks'] if k2 == mk]
            if not hit and mk in ('alef', 'madd') and ki > 0:      # tanda mad bisa menempel di huruf sebelumnya pada teks Kemenag
                hit = [m for (m, k2) in ck[ki - 1]['marks'] if k2 == mk]
            if not hit and mk in ('alef', 'vow', 'small') and ki + 1 < len(ck) and (ki + 1) not in matched \
                    and ck[ki + 1]['n'] in (0x627, 0x648, 0x64A):   # Kemenag menulis huruf mad (alif/waw/ya) utuh
                nx = ck[ki + 1]; hit = [nx['li']] + [m for (m, k2) in nx['marks'] if k2 in ('madd', 'vow', 'suk')]
            for m in hit: kc[m] = code[mi]
            if hit: got += 1
    # rapikan: tanda kecil yang menempel (mis. tanda waqaf) tak perlu; gabungkan run
    out = []; cur = ''; cc = None
    for ch, c in zip(kem, kc):
        if c == cc: cur += ch
        else:
            if cur: out.append(cur if cc is None else [cur, cc])
            cur, cc = ch, c
    if cur: out.append(cur if cc is None else [cur, cc])
    return out, tot, got

T = G = 0; bad = []
for n in range(1, 115):
    tj = json.load(open(f'{ROOT}/tajwid/{n}.json', encoding='utf8'))
    sj = json.load(open(f'{ROOT}/s/{n}.json', encoding='utf8'))
    res = {}
    for a in sj['ayat']:
        k = str(a['a'])
        if k not in tj: continue
        out, tot, got = build(a['ar'], tj[k])
        res[k] = out; T += tot; G += got
        if tot and got / tot < .9: bad.append((n, a['a'], tot, got))
    json.dump(res, open(f'{OUT}/{n}.json', 'w', encoding='utf8'), ensure_ascii=False, separators=(',', ':'))
print('unit berwarna:', T, 'terpetakan:', G, f'{100*G/T:.2f}%'); print('ayat <90%:', len(bad), bad[:15])
