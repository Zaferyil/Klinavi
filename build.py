"""Baut die auslieferbaren Seiten aus src/.
   python3 build.py  ->  dist/demo/ und dist/neuromed/ (index.html, sw.js, manifest.webmanifest, Icons)"""
import base64, hashlib, json, pathlib, shutil
ROOT = pathlib.Path(__file__).parent
app = (ROOT / 'src/app.html').read_text(encoding='utf-8')
app = app.replace('/*I18N-SLOT*/', (ROOT / 'src/i18n.js').read_text(encoding='utf-8'))
# jsQR (Apache-2.0, src/vendor/jsQR.LICENSE) wird eingebettet, damit der QR-Scan auch offline funktioniert
app = app.replace('<!--JSQR-SLOT-->', '<script>' + (ROOT / 'src/vendor/jsQR.min.js').read_text(encoding='utf-8') + '</script>')

HEAD = ('<!doctype html>\n<html lang="de">\n<head>\n<meta charset="utf-8">\n'
        '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n'
        '<meta name="theme-color" content="#0052D4">\n'
        '<meta name="mobile-web-app-capable" content="yes">\n<meta name="apple-mobile-web-app-capable" content="yes">\n'
        '<meta name="apple-mobile-web-app-title" content="Klinavi">\n'
        '<link rel="manifest" href="manifest.webmanifest">\n'
        '<link rel="icon" type="image/png" href="icon-192.png">\n<link rel="apple-touch-icon" href="icon-512.png">\n')

def page(html):
    i = html.index('<div class="sos"')
    return HEAD + html[:i] + '</head>\n<body style="margin:0">\n' + html[i:] + '\n</body>\n</html>\n'

def write(rel, html, name='Klinavi'):
    p = ROOT / rel; p.parent.mkdir(parents=True, exist_ok=True)
    out = page(html); p.write_text(out, encoding='utf-8'); print('->', rel)
    d = p.parent
    ver = hashlib.sha1(out.encode('utf-8')).hexdigest()[:10]
    (d / 'sw.js').write_text((ROOT / 'src/sw.js').read_text(encoding='utf-8').replace('__VERSION__', ver), encoding='utf-8')
    (d / 'manifest.webmanifest').write_text(json.dumps({
        'name': name, 'short_name': 'Klinavi', 'description': 'Digitaler Wegweiser für Krankenhausbesucher',
        'lang': 'de', 'start_url': './', 'scope': './', 'display': 'standalone',
        'background_color': '#FFFFFF', 'theme_color': '#0052D4',
        'icons': [{'src': 'icon-192.png', 'sizes': '192x192', 'type': 'image/png', 'purpose': 'any maskable'},
                  {'src': 'icon-512.png', 'sizes': '512x512', 'type': 'image/png', 'purpose': 'any maskable'}]},
        ensure_ascii=False, indent=2), encoding='utf-8')
    for n in ('icon-192.png', 'icon-512.png'):
        shutil.copy(ROOT / 'src' / n, d / n)

# 1) Demo (fiktives Klinikum, ohne echte Daten)
write('dist/demo/index.html', app)

# 2) Neuromed Campus (Campusplan eingebettet)
img = 'data:image/jpeg;base64,' + base64.b64encode((ROOT / 'src/neuromed/campus-plan.jpg').read_bytes()).decode()
nmc = (ROOT / 'src/neuromed/nmc-data.js').read_text(encoding='utf-8')
html = app.replace('/*NMC-SLOT*/', "const NMC_IMG='" + img + "';\n" + nmc)
html = html.replace('<title>Klinavi</title>', '<title>Klinavi – Neuromed Campus</title>')
write('dist/neuromed/index.html', html, 'Klinavi Neuromed Campus')

# 3) Neuromed ohne Seitengerüst (für die Vorschau in Claude, ohne <head>/<body>)
(ROOT / 'dist/neuromed/artifact.html').write_text(html, encoding='utf-8'); print('-> dist/neuromed/artifact.html')
