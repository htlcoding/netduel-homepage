# NetDuel – Homepage

Landing Page für NetDuel, die Diplomarbeit an der HTL Wien West (Vue 3 + Vite + TypeScript).
Eine einzige Seite. Schriften und Bilder sind mitgebaut, es wird nichts aus dem Internet
geladen — die Seite funktioniert auch am Stand ohne WLAN.

```
npm install
npm run dev       # Entwicklung, http://localhost:5173
npm run build     # Typprüfung + fertige Seite nach dist/
npm run preview   # fertige Seite ansehen (auch für den Stand ohne Internet)
```

## Aufbau

```
src/
  App.vue                 Reihenfolge der Abschnitte
  style.css               Farben, Schrift, Abstände (alles als CSS-Variablen)
  components/
    *Section.vue          ein Abschnitt pro Datei, Texte stehen direkt darin
    SiteHeader.vue        Kopfzeile mit aktivem Abschnitt und Handy-Menü
    SiteFooter.vue
    ui/                   wiederverwendbare Bausteine
      AppLogo.vue         das Logo, genau nach assets/logo/NETDUEL_LOGO.md
      WortMarke.vue       Logo + Name (Geist)
      AbschnittKopf.vue   Überschrift und kurzer Satz
      AppFenster.vue      nachgebautes Programmfenster
      NetzTopologie.vue   Arbeitsfläche mit Geräten, Kabeln, Paketen
      KonsoleAnzeige.vue  Konsolenzeilen
      NdIcon.vue          Icons von Hugeicons (@hugeicons/vue) auf der Logo-Kachel
    demo/LabDemo.vue      animiertes Lab 4 im Hero
  composables/
    useDrehbuch.ts        spielt Animationen in Schleife, hält an wenn nicht sichtbar
    useSichtbar.ts        Sichtbarkeit beobachten
    useAktiverAbschnitt.ts
  assets/logo/            Logo-Dateien und Logo-Regeln
  assets/cisco/           offizielle Cisco-Symbole (nicht verändern, siehe README dort)
public/                   Favicons
```

## Woher die Angaben stammen

Prüfmeldungen, Punkte und Rollen kommen aus dem App-Projekt (`src/main/checks/`,
`README.md`). Die Seite nennt bewusst keine Anzahl an Labs, weil laufend neue dazukommen.
