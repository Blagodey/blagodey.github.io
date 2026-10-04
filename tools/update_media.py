"""Rebuild media.json: every video of the three YouTube channels + streaming releases.
Used by the chat picker. Run: python tools/update_media.py (no API key needed)."""
import json, re, os, sys, urllib.request
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
UA = {'User-Agent': 'Mozilla/5.0', 'Accept-Language': 'en'}
CHANNELS = [('bv', '@BlagodayVision'), ('bm', '@TheBlagoday'),
            ('kg', '@%D0%9A%D0%B0%D0%BF%D0%B8%D1%82%D0%B0%D0%BD%D0%93%D0%95%D0%A0%D0%9C%D0%90%D0%9D'),
            ('ke', '@CaptainGermanExploring')]

def get(u, data=None):
    r = urllib.request.Request(u, data=json.dumps(data).encode() if data else None, headers={**UA, 'Content-Type': 'application/json'})
    return urllib.request.urlopen(r, timeout=30).read().decode()

def walk(o, out, tok):
    if isinstance(o, dict):
        v = o.get('videoRenderer') or o.get('richItemRenderer', {}).get('content', {}).get('videoRenderer')
        if v and 'videoId' in v:
            t = ''.join(x.get('text', '') for x in v.get('title', {}).get('runs', [])) or v.get('title', {}).get('simpleText', '')
            out.append((v['videoId'], t))
        lv = o.get('lockupViewModel')
        if lv and lv.get('contentId') and lv.get('contentType', '').endswith('VIDEO'):
            out.append((lv['contentId'], lv.get('metadata', {}).get('lockupMetadataViewModel', {}).get('title', {}).get('content', '')))
        sh = o.get('shortsLockupViewModel')
        if sh:
            vid = sh.get('onTap', {}).get('innertubeCommand', {}).get('reelWatchEndpoint', {}).get('videoId')
            if vid: out.append((vid, sh.get('overlayMetadata', {}).get('primaryText', {}).get('content', '')))
        c = o.get('continuationCommand', {}).get('token')
        if c: tok.append(c)
        for x in o.values(): walk(x, out, tok)
    elif isinstance(o, list):
        for x in o: walk(x, out, tok)

def channel(handle, tab):
    h = get(f'https://www.youtube.com/{handle}/{tab}')
    key = re.search(r'"INNERTUBE_API_KEY":"([^"]+)"', h).group(1)
    ver = re.search(r'"INNERTUBE_CLIENT_VERSION":"([^"]+)"', h).group(1)
    d = json.loads(re.search(r'var ytInitialData = (\{.*?\});</script>', h).group(1))
    out, tok, seen = [], [], set()
    walk(d, out, tok)
    while tok and len(seen) < 300:
        t = tok.pop()
        if t in seen: break
        seen.add(t)
        walk(json.loads(get(f'https://www.youtube.com/youtubei/v1/browse?key={key}',
             {'context': {'client': {'clientName': 'WEB', 'clientVersion': ver, 'hl': 'en'}}, 'continuation': t})), out, tok)
    return out

def releases():
    src = open(os.path.join(ROOT, 'index.html'), encoding='utf-8').read()
    m = re.search(r'const RELEASES=(\[.*?\n\]);', src, re.S)
    return [[r[0], r[4], r[5]] for r in json.loads(m.group(1))] if m else []

def main():
    old = {}
    p = os.path.join(ROOT, 'media.json')
    if os.path.exists(p):
        for v in json.load(open(p, encoding='utf-8')).get('v', []): old.setdefault(v[2], []).append(v)
    vids, ids = [], set()
    for g, h in CHANNELS:
        got = []
        for tab in ('videos', 'shorts'):
            try: got += channel(h, tab)
            except Exception as e: print(g, tab, 'error:', e, file=sys.stderr)
        if not got and g in old: got = [(v[0], v[1]) for v in old[g]]  # keep previous list if YouTube failed
        for i, t in got:
            if i not in ids and t: ids.add(i); vids.append([i, t, g])
        print(g, len([v for v in vids if v[2] == g]), file=sys.stderr)
    data = {'v': vids, 'r': releases()}
    json.dump(data, open(p, 'w', encoding='utf-8'), ensure_ascii=False, separators=(',', ':'))

main()
