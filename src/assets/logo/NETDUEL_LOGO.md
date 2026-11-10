# NetDuel — Logo (Konzept 3 „Pakete")

Spezifikation zum Einbauen. Alle Dateien liegen neben dieser Datei.

---

## 1. Was das Zeichen zeigt

Eine Kachel in Midnight-Blau mit zwei Winkeln darin, die aufeinander zulaufen
und sich in der Mitte knapp verfehlen. Der linke Winkel ist weiß, der rechte
Signal-Cyan, beide gleich groß und spiegelsymmetrisch zur Mittelachse.

Die Lesart: zwei Pakete laufen durch dasselbe Netz aufeinander zu — zwei
Spieler:innen, dasselbe Lab, ein Wettkampf. Der Spalt in der Mitte ist der
entscheidende Teil: er hält das Zeichen offen, statt es zu einem X zu
verschmelzen. Er darf nie geschlossen werden.

Die Kachel gehört zum Zeichen und wird nicht weggelassen. Deshalb funktioniert
es als App-Icon ohne zusätzlichen Hintergrund.

---

## 2. Geometrie

Zeichenfläche `viewBox="0 0 64 64"`.

| Element | Wert |
| --- | --- |
| Kachel | `x=2 y=2 w=60 h=60`, Eckradius `15` |
| Linker Winkel | `M16 19 L26 32 L16 45` |
| Rechter Winkel | `M48 19 L38 32 L48 45` |
| Strichstärke | `6.5` |
| Linienenden | `round`, Ecken `round` |
| Spalt in der Mitte | 12 Einheiten zwischen den Spitzen, sichtbar bleiben ca. 5,5 |

Bei 16 bis 32 px wird die **Kompaktvariante** verwendet: Strichstärke `8`,
Winkel auf `M16 21 L25 32 L16 43` und `M48 21 L39 32 L48 43`, Kachel randlos
(`x=0 y=0 w=64 h=64`). Sonst säuft der Strich ab und der Spalt verschwindet.

---

## 3. Farben

| Rolle | Hex | Wo |
| --- | --- | --- |
| Midnight | `#0B2545` | Kachel |
| Weiß | `#FFFFFF` | linker Winkel |
| Signal Cyan | `#00B7E0` | rechter Winkel |
| Midnight hell | `#123A66` | Kachel, wenn das Zeichen auf dunklem Grund steht |

Auf dunklem Grund (`#06192E` und dunkler) wird die Kachel auf `#123A66`
aufgehellt, sonst verschwindet ihre Kante. Dafür gibt es `logo-on-dark.svg`.

---

## 4. Dateien

| Datei | Zweck |
| --- | --- |
| `logo.svg` | Hauptvariante, ab 32 px |
| `logo-compact.svg` | 16 bis 24 px, dickerer Strich |
| `logo-on-dark.svg` | auf dunklem Grund |
| `logo-mono.svg` | einfarbig über `currentColor`, ohne Kachel — Druck, Wasserzeichen |
| `icon.ico` | Windows-Installer, enthält 16/24/32/48/64/128/256 |
| `icon.png` | 512 px, Linux und electron-builder |
| `png/icon-*.png` | Einzelgrößen 16 bis 512 |

---

## 5. Einbau ins Projekt

```
resources/icon.png              ← icon.png (512 px), nutzt der Hauptprozess für das Fenster
build/icon.ico                  ← icon.ico, electron-builder Windows
build/icon.png                  ← icon.png (512 px), electron-builder Linux
src/renderer/src/assets/logo.svg        ← logo.svg
src/renderer/src/assets/logo-compact.svg ← logo-compact.svg
src/renderer/src/components/ui/AppLogo.vue ← Komponente unten
```

Die Anwendung zeigt das Zeichen an genau drei Stellen: im Anmelde- und
Einrichtungsdialog (56 px), links oben in der Menüleiste neben dem Namen
(20 px) und im Ergebnisbildschirm als Wasserzeichen (`logo-mono.svg`,
Deckkraft 6 %). Sonst nirgends — ein Logo, das überall klebt, verliert seine
Wirkung.

---

## 6. Vue-Komponente

`src/renderer/src/components/ui/AppLogo.vue`

```vue
<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    /** Kantenlänge in Pixel. Unter 32 wird automatisch die Kompaktvariante gezeichnet. */
    size?: number
    /** 'onDark' hellt die Kachel auf, damit sie auf dunklem Grund nicht verschwindet. */
    variant?: 'default' | 'onDark'
  }>(),
  { size: 24, variant: 'default' }
)

const isCompact = computed(() => props.size < 32)
const tileFill = computed(() => (props.variant === 'onDark' ? '#123A66' : '#0B2545'))
</script>

<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 64 64"
    role="img"
    aria-label="NetDuel"
    focusable="false"
  >
    <template v-if="isCompact">
      <rect x="0" y="0" width="64" height="64" rx="15" :fill="tileFill" />
      <path
        d="M16 21 L25 32 L16 43"
        fill="none"
        stroke="#FFFFFF"
        stroke-width="8"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M48 21 L39 32 L48 43"
        fill="none"
        stroke="#00B7E0"
        stroke-width="8"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </template>
    <template v-else>
      <rect x="2" y="2" width="60" height="60" rx="15" :fill="tileFill" />
      <path
        d="M16 19 L26 32 L16 45"
        fill="none"
        stroke="#FFFFFF"
        stroke-width="6.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M48 19 L38 32 L48 45"
        fill="none"
        stroke="#00B7E0"
        stroke-width="6.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </template>
  </svg>
</template>
```

Verwendung:

```vue
<AppLogo :size="56" />
<AppLogo :size="20" />
<AppLogo :size="40" variant="onDark" />
```

---

## 7. Wortmarke

Zeichen links, Abstand zum Text = halbe Zeichenhöhe, Text in **Archivo 700**
mit −2,5 % Laufweite in `#0B2545` (auf dunklem Grund in `#FFFFFF`).
Optische Mitte: der Text sitzt an der Mittelachse des Zeichens, nicht an der
Grundlinie der Kachel.

Die Wortmarke bleibt einfarbig. Das Cyan gehört dem Zeichen — zwei Akzente
nebeneinander schwächen sich gegenseitig.

Archivo wird **nur** für Logo, Deckblatt und Präsentation geladen. Die
Oberfläche selbst bleibt bei Systemschriften, damit NetDuel neben GNS3 nicht
wie ein Fremdkörper wirkt.

---

## 8. Regeln

- **Mindestgröße** 16 px. Darunter nicht verwenden.
- **Schutzraum** rundum mindestens ein Viertel der Zeichenhöhe frei lassen.
- Die beiden Winkel **nicht** zusammenschieben, bis sie sich berühren.
- Farben **nicht** tauschen: links immer Weiß, rechts immer Cyan.
- Kachel **nicht** entfernen, außer in `logo-mono.svg` für Druck und
  Wasserzeichen.
- Zeichen **nicht** verzerren, drehen, mit Schatten oder Verlauf versehen.
- Die Kachel **nicht** auf Hellgrau oder Weiß umfärben: Weiß auf Weiß
  verschwindet der linke Winkel.

---

## 9. Hinweis zur Abgrenzung

Die Farbwelt orientiert sich an der Netzwerktechnik, das Zeichen ist
eigenständig. Das Cisco-Logo (senkrechte Balken unterschiedlicher Höhe) darf
nicht nachgebaut oder abgewandelt werden. Diese Form kommt hier nicht vor.
