from pathlib import Path
from concurrent.futures import ThreadPoolExecutor
from urllib.request import urlopen
import json,hashlib,re
root=Path(__file__).resolve().parents[1]; source=root.parent/'site 2'
backup=Path((root.parent/'.backups/latest-copy-backup.txt').read_text())
checksums=json.loads((backup/'site-2-checksums.json').read_text())
files={str(p.relative_to(source)):p for p in source.rglob('*') if p.is_file()}
assert files.keys()==checksums.keys(), 'Source file set changed'
for name,digest in checksums.items():
 assert hashlib.sha256(files[name].read_bytes()).hexdigest()==digest, f'Source changed: {name}'
 copied=root/('public' if Path(name).parts[0] in ['_ext','_local'] else 'src/legacy')/name
 assert hashlib.sha256(copied.read_bytes()).hexdigest()==digest, f'Copy differs: {name}'
assert (root/'components/site-header.tsx').read_bytes()==(backup/'components/site-header.tsx').read_bytes(), 'Header component changed'
headers=json.loads((root/'src/legacy-headers.json').read_text())
def check(name):
 path='/' if name=='index.html' else '/'+name.removesuffix('/index.html')
 with urlopen('http://localhost:3000'+path) as r:
  assert r.status==200; actual=r.read().decode()
 original=(source/name).read_text()
 match=re.search(r'<div id="hxr-site-header".*?</template></div>',actual,re.S)
 assert match, f'Header missing: {path}'
 restored=actual[:match.start()]+headers[name]+actual[match.end():]
 restored=restored.replace('<script type="module" src="/_hxr/header.js"></script>','')
 if path == '/':
  hero=(root/'src/overrides/home-hero.html').read_text()
  old_hero=(root/'src/overrides/home-hero-original.html').read_text()
  assert restored.count(hero)==1, 'Homepage hero missing or duplicated'
  restored=restored.replace(hero,old_hero)
  restored=re.sub(r'<style id="hxr-home-hero-styles">.*?</style>','',restored,flags=re.S)
 assert restored==original, f'Non-header content changed: {path}'
 if path in ['/2026/program-2026','/2026/speakers-2026','/2026/sponsors-2026']:
  assert f'href="{path}" aria-current="page"' in actual, f'Selected shortcut missing: {path}'
 return path
with ThreadPoolExecutor(max_workers=8) as pool: routes=list(pool.map(check,headers))
print(f'PASS: {len(files)} source files unchanged; all copies byte-identical; header component unchanged; {len(routes)} pages return 200 and preserve every byte outside the header and requested homepage hero.')
