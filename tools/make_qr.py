"""QR-Code als PNG erzeugen.   python3 tools/make_qr.py https://meine-seite.netlify.app qrtest
   Der Code öffnet  <Adresse>/#s-<Punkt-ID>  und setzt den Startpunkt in Klinavi."""
import sys, qrcode
base, node = sys.argv[1].rstrip('/'), (sys.argv[2] if len(sys.argv) > 2 else 'qrtest')
url = f'{base}/#s-{node}'
img = qrcode.make(url, box_size=14, border=4)
out = f'qr-{node}.png'
img.save(out); print(url, '->', out)
