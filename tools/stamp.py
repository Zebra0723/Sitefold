#!/usr/bin/env python3
"""Re-stamp every local asset URL in the built HTML with a hash of its contents.

Assets are served with a one-year immutable cache header, so the URL has to
change whenever the file does. Run this after editing anything in /assets:

    python3 tools/stamp.py
"""
import hashlib, os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
_cache = {}

def digest(path):
    if path not in _cache:
        f = os.path.join(ROOT, path.lstrip("/"))
        _cache[path] = hashlib.md5(open(f, "rb").read()).hexdigest()[:8] if os.path.isfile(f) else None
    return _cache[path]

def stamp(m):
    attr, path = m.group(1), m.group(2)
    h = digest(path)
    return m.group(0) if h is None else '%s="%s?v=%s"' % (attr, path, h)

changed = 0
for dirpath, dirnames, filenames in os.walk(ROOT):
    dirnames[:] = [d for d in dirnames if d not in (".git", "tools")]
    for name in filenames:
        if not name.endswith(".html"):
            continue
        p = os.path.join(dirpath, name)
        s = open(p, encoding="utf-8").read()
        out = re.sub(r'(href|src)="(/assets/[^"?]+)(?:\?v=[a-f0-9]+)?"', stamp, s)
        if out != s:
            open(p, "w", encoding="utf-8").write(out)
            changed += 1
            print("stamped", os.path.relpath(p, ROOT))
print("%d file(s) updated" % changed)
