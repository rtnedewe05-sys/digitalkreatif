#!/usr/bin/env python3
"""Membangun data offline (data/surahs.json, data/s/N.json, data/search.json, data/vocab.json, data/tafsir/N.json).
Sumber (clone dulu):
  git clone --depth 1 https://github.com/ekoheri/Al_Quran_Terjemahan_per_kata_per_ayat src/ekoheri
  git clone --depth 1 https://github.com/ihzaa/quran-json-indopak-tajweed src/ihzaa
Pakai: python3 tools/build-data.py src/ekoheri src/ihzaa"""
import json, re, sys, os, collections
EK, IH = sys.argv[1] + '/backend/database/', sys.argv[2] + '/data/'
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) + '/data/'
os.makedirs(ROOT + 's', exist_ok=True); os.makedirs(ROOT + 'tafsir', exist_ok=True)
L = re.compile(r'[\u0621-\u064A\u0671-\u06D3]')
DI = re.compile(r'[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06ED\u0640]')
def norm(w):
    w = DI.sub('', w)
    return re.sub('[ٱأإآ]', 'ا', w).replace('ى', 'ي')
def plain(items): return ''.join(x if isinstance(x, str) else x[0] for x in items)
J = lambda p: json.load(open(p, encoding='utf-8'))
def dump(p, o): json.dump(o, open(p, 'w', encoding='utf-8'), ensure_ascii=False, separators=(',', ':'))

surahs, search = [], []
vocab = {}
bad_audio = 0
for n in range(1, 115):
    s = J(f'{EK}surah_per_ayat/{n}.json')[str(n)]
    k = J(f'{EK}surah_per_kata/{n}.json')[str(n)]
    tj = J(ROOT + f'tajwid/{n}.json')
    ih = {a['verse_number']: a for a in J(IH + f'surah_{n}.json')}
    cnt = int(s['number_of_ayah'])
    surahs.append({'n': n, 'ar': s['name'].strip(), 'la': s['name_latin'].strip(), 'count': cnt,
                   'place': s['location'].strip(), 'mean': s['surah_translation'].strip()})
    ayat = []
    for a in range(1, cnt + 1):
        sa = str(a)
        m = [k['terjemah'][sa][str(i)] for i in range(1, len(k['terjemah'][sa]) + 1)]
        ws = [k['text'][sa][str(i)] for i in range(1, len(k['text'][sa]) + 1)]
        iw = ih.get(a, {}).get('words', [])
        m2 = [x['tr'] if len(iw) == len(m) and x['tr'].strip().lower() != m[i].strip().lower() else '' for i, x in enumerate(iw)] if len(iw) == len(m) else []
        e = {'a': a, 'ar': s['text'][sa].strip(), 'la': s['latin'][sa].strip(), 'id': s['terjemah'][sa].strip(), 'm': m}
        if any(m2): e['m2'] = m2
        tw = [t for t in plain(tj[sa]).split() if L.search(t)]
        if len(tw) != len(m): e['w'] = ws   # kata tidak sejajar dengan data tajwid: simpan teks kata sendiri
        ayat.append(e)
        search.append([n, a, e['id'], e['la']])
        url = ih.get(a, {}).get('audioUrl', '')
        if url != f'https://download.quranicaudio.com/recitations/Alafasy/mp3/{n:03d}{a:03d}.mp3': bad_audio += 1
        for i, w in enumerate(ws):
            v = vocab.setdefault(norm(w), {'c': 0, 'm': collections.Counter(), 'r': []})
            v['c'] += 1
            if i < len(m): v['m'][m[i].strip()] += 1
            if len(v['r']) < 6: v['r'].append(f'{n}:{a}')
    dump(ROOT + f's/{n}.json', {'n': n, 'ayat': ayat})
    t = J(f'{EK}tafsir/{n}.json')[str(n)]
    dump(ROOT + f'tafsir/{n}.json', {'w': t.get('wajiz', {}), 't': t.get('tahlili', {})})
dump(ROOT + 'surahs.json', surahs)
dump(ROOT + 'search.json', search)
dump(ROOT + 'vocab.json', {k: [v['c'], [x for x, _ in v['m'].most_common(3)], v['r']] for k, v in vocab.items()})
print('surah', len(surahs), 'ayat', len(search), 'kosakata unik', len(vocab), 'audio tak sesuai pola', bad_audio)
