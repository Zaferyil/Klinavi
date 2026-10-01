"""Baut die auslieferbaren Seiten aus src/.
   python3 build.py  ->  dist/demo/index.html  und  dist/neuromed/index.html"""
import base64, pathlib
ROOT = pathlib.Path(__file__).parent
app = (ROOT / 'src/app.html').read_text(encoding='utf-8')
app = app.replace('/*I18N-SLOT*/', (ROOT / 'src/i18n.js').read_text(encoding='utf-8'))

HEAD = ('<!doctype html>\n<html lang="de">\n<head>\n<meta charset="utf-8">\n'
        '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n')

def page(html):
    i = html.index('<header class="top">')
    return HEAD + html[:i] + '</head>\n<body style="margin:0">\n' + html[i:] + '\n</body>\n</html>\n'

def write(rel, html):
    p = ROOT / rel; p.parent.mkdir(parents=True, exist_ok=True); p.write_text(page(html), encoding='utf-8'); print('->', rel)

# 1) Demo (fiktives Klinikum, ohne echte Daten)
write('dist/demo/index.html', app)

# 2) Neuromed Campus (Campusplan eingebettet)
img = 'data:image/jpeg;base64,' + base64.b64encode((ROOT / 'src/neuromed/campus-plan.jpg').read_bytes()).decode()
nmc = (ROOT / 'src/neuromed/nmc-data.js').read_text(encoding='utf-8')
html = app.replace('/*NMC-SLOT*/', "const NMC_IMG='" + img + "';\n" + nmc)
html = html.replace('<title>Klinavi</title>', '<title>Klinavi – Neuromed Campus</title>')
write('dist/neuromed/index.html', html)

# 3) Neuromed ohne Seitengerüst (für die Vorschau in Claude, ohne <head>/<body>)
(ROOT / 'dist/neuromed/artifact.html').write_text(html, encoding='utf-8'); print('-> dist/neuromed/artifact.html')
