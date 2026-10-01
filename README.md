# Klinavi

Digitaler Wegweiser für Krankenhausbesucher: QR-Code scannen, Ziel wählen, Schritt für Schritt zur Station. Läuft im Browser, ohne App-Installation und ohne personenbezogene Daten.

## Funktionen
- **Besucher-Ansicht:** Suche nach Stationen, Ambulanzen und Services, Route auf dem Plan, Schritt-für-Schritt-Anweisungen.
- **Mitlaufen:** Schritte werden über die Bewegungssensoren des Handys gezählt, Abbiegungen per Kompass erkannt. Zusätzlich gibt es Weiter/Zurück-Tasten und eine Simulation zum Testen.
- **Plan-Editor:** Plan-Foto hochladen, Wege und Ziele anklicken, Daten als JSON exportieren.
- **QR-Codes:** Druckvorlagen für Eingänge und Aufzüge.

## Build
```bash
python3 build.py
# dist/demo/index.html      – Demo mit fiktivem Klinikum
# dist/neuromed/index.html  – Prototyp Neuromed Campus (nicht öffentlich teilen)
```

## Offline-Betrieb (PWA)
`dist/<variante>/` enthält neben `index.html` auch `sw.js`, `manifest.webmanifest` und zwei Icons. **Der ganze Ordner muss auf denselben HTTPS-Server.** Nach dem ersten Besuch läuft Klinavi ohne Internet weiter (Routen, Übersetzungen und QR-Scan sind in der Seite enthalten, Schriften werden nachgeladen und gemerkt). Bei jeder neuen Version erneuert sich der Cache automatisch. Android/Chrome bietet „App installieren“ an, auf dem iPhone über „Teilen → Zum Home-Bildschirm“.

## Netlify
`netlify.toml` im Hauptordner legt fest, dass `dist/neuromed` veröffentlicht wird (kein Build-Befehl). Ohne diese Datei zeigt Netlify „Page not found“, weil im Hauptordner keine `index.html` liegt. Den Branch `claude/awesome-thompson-swq2gl` (oder `main`, sobald er existiert) als Production-Branch einstellen.

## Testen auf dem Handy
Die Bewegungssensoren funktionieren nur über HTTPS, zum Beispiel mit Cloudflare Pages: Ordner `dist/neuromed` hochladen und die Adresse auf dem Handy öffnen.
