<script setup lang="ts">
/**
 * Arbeitsfläche mit Geräten und Kabeln — wie in der App.
 *
 * Plätze stehen in Prozent der Fläche (x, y von 0 bis 100). Die Fläche ist
 * 160 Einheiten breit und `hoehe` Einheiten hoch (Standard 100, also 16 : 10);
 * das SVG für Kabel und Pakete hat dieselben Maße und verzerrt deshalb nicht.
 *
 * Die Gerätebilder sind die offiziellen Cisco-Symbole (siehe src/assets/cisco/).
 */
import { computed } from "vue";

export interface Geraet {
  name: string;
  bild: string;
  x: number;
  y: number;
  /** Läuft das Gerät? Dann leuchtet der grüne Punkt. */
  an?: boolean;
  /** Beschriftung unter dem Namen, z. B. die IP-Adresse. */
  info?: string;
}

export interface Kabel {
  von: number;
  nach: number;
  /** "aus" = Schnittstelle noch abgeschaltet (gestrichelt). */
  aus?: boolean;
  /** Portnamen an den Enden, z. B. "f0/0". */
  portVon?: string;
  portNach?: string;
}

export interface Paket {
  id: number;
  /** Geräte-Nummern, über die das Paket wandert. */
  weg: number[];
  /** Fortschritt von 0 bis 1. */
  t: number;
  farbe: "cyan" | "amber";
}

const props = withDefaults(
  defineProps<{
    geraete: Geraet[];
    kabel: Kabel[];
    pakete?: Paket[];
    hoehe?: number;
  }>(),
  { pakete: () => [], hoehe: 100 },
);

/** Platz eines Geräts in SVG-Einheiten */
const px = (g: Geraet) => g.x * 1.6;
const py = (g: Geraet) => (g.y * props.hoehe) / 100;

/** Wo steht ein Paket gerade? Lineare Strecke über alle Wegpunkte. */
function position(p: Paket): { x: number; y: number } {
  const punkte = p.weg.map((n) => ({
    x: px(props.geraete[n]),
    y: py(props.geraete[n]),
  }));
  const laengen = punkte
    .slice(1)
    .map((b, i) => Math.hypot(b.x - punkte[i].x, b.y - punkte[i].y));
  const gesamt = laengen.reduce((a, b) => a + b, 0);
  let rest = Math.min(Math.max(p.t, 0), 1) * gesamt;
  for (let i = 0; i < laengen.length; i++) {
    if (rest <= laengen[i]) {
      const f = laengen[i] === 0 ? 0 : rest / laengen[i];
      return {
        x: punkte[i].x + (punkte[i + 1].x - punkte[i].x) * f,
        y: punkte[i].y + (punkte[i + 1].y - punkte[i].y) * f,
      };
    }
    rest -= laengen[i];
  }
  return punkte[punkte.length - 1];
}

/** Portbeschriftung: ein Stück vom Gerät entfernt auf dem Kabel. */
function portPlatz(von: Geraet, nach: Geraet) {
  const t = 0.3;
  return {
    left: von.x + (nach.x - von.x) * t + "%",
    top: von.y + (nach.y - von.y) * t + "%",
  };
}

const ports = computed(() =>
  props.kabel.flatMap((k) => {
    const a = props.geraete[k.von];
    const b = props.geraete[k.nach];
    const liste: { text: string; stil: Record<string, string> }[] = [];
    if (k.portVon) liste.push({ text: k.portVon, stil: portPlatz(a, b) });
    if (k.portNach) liste.push({ text: k.portNach, stil: portPlatz(b, a) });
    return liste;
  }),
);
</script>

<template>
  <div class="flaeche" :style="{ aspectRatio: `160 / ${hoehe}` }">
    <svg class="netz" :viewBox="`0 0 160 ${hoehe}`" aria-hidden="true">
      <line
        v-for="(k, i) in kabel"
        :key="i"
        :class="{ aus: k.aus }"
        :x1="px(geraete[k.von])"
        :y1="py(geraete[k.von])"
        :x2="px(geraete[k.nach])"
        :y2="py(geraete[k.nach])"
      />
      <g v-for="p in pakete" :key="p.id" :class="['paket', p.farbe]">
        <circle :cx="position(p).x" :cy="position(p).y" r="2.6" class="hof" />
        <circle :cx="position(p).x" :cy="position(p).y" r="1.3" />
      </g>
    </svg>

    <span
      v-for="(p, i) in ports"
      :key="'p' + i"
      class="port"
      :style="p.stil"
      aria-hidden="true"
      >{{ p.text }}</span
    >

    <div
      v-for="g in geraete"
      :key="g.name"
      class="geraet"
      :style="{ left: g.x + '%', top: g.y + '%' }"
    >
      <span class="bild">
        <img :src="g.bild" alt="" width="64" height="44" draggable="false" />
        <i class="led" :class="{ an: g.an }" aria-hidden="true" />
      </span>
      <strong>{{ g.name }}</strong>
      <Transition name="info">
        <span v-if="g.info" :key="g.info" class="info">{{ g.info }}</span>
      </Transition>
    </div>
  </div>
</template>

<style scoped>
.flaeche {
  position: relative;
  background-color: var(--weiss);
  /* Punktraster der Arbeitsfläche wie in der App */
  background-image: radial-gradient(#d9dfe6 1px, transparent 1px);
  background-size: 20px 20px;
  background-position: 10px 10px;
}

.netz {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  overflow: visible;
}

.netz line {
  stroke: #3d4d61;
  stroke-width: 1.6;
  vector-effect: non-scaling-stroke;
  transition: stroke 0.4s ease;
}

.netz line.aus {
  stroke: #b2bcc8;
  stroke-dasharray: 5 5;
}

.paket circle {
  fill: var(--cyan);
}
.paket .hof {
  opacity: 0.22;
}
.paket.amber circle {
  fill: var(--amber);
}

.port {
  position: absolute;
  transform: translate(-50%, -150%);
  font-family: var(--mono);
  font-size: 10.5px;
  color: var(--text-leise);
  background: var(--weiss);
  padding: 0 3px;
  pointer-events: none;
}

.geraet {
  position: absolute;
  transform: translate(-50%, -30%);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  white-space: nowrap;
}

.bild {
  position: relative;
}

.bild img {
  /* Die Cisco-Bilder haben weißen Grund; "multiply" blendet ihn aus, ohne
     die Datei zu verändern (Cisco erlaubt keine Änderungen). */
  mix-blend-mode: multiply;
  user-select: none;
}

.led {
  position: absolute;
  top: -2px;
  left: 4px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #c8d0da;
  box-shadow: 0 0 0 2px var(--weiss);
  transition: background 0.3s ease;
}

.led.an {
  background: #35c04a;
}

strong {
  margin-top: 2px;
  font-size: 12px;
  font-weight: 600;
  color: var(--text);
}

.info {
  font-family: var(--mono);
  font-size: 10.5px;
  color: var(--cyan-text);
  background: var(--cyan-weich);
  border-radius: 4px;
  padding: 0 5px;
  margin-top: 2px;
}

.info-enter-active {
  transition:
    opacity 0.4s ease,
    transform 0.4s ease;
}
.info-enter-from {
  opacity: 0;
  transform: translateY(-4px);
}
.info-leave-active {
  display: none;
}

/* Auf schmalen Flächen ist für Portnamen kein Platz */
@media (max-width: 520px) {
  .port {
    display: none;
  }
}

@media (max-width: 640px) {
  .bild img {
    width: 42px;
    height: auto;
  }
  .port,
  .info {
    font-size: 9px;
  }
  strong {
    font-size: 11px;
  }
}
</style>
