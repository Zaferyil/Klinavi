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

## Testen auf dem Handy
Die Bewegungssensoren funktionieren nur über HTTPS, zum Beispiel mit Cloudflare Pages: Ordner `dist/neuromed` hochladen und die Adresse auf dem Handy öffnen.
