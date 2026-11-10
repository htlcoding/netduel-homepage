<script setup lang="ts">
/**
 * Hero-Vorführung: Lab 4 "Zwei Netze, ein Router", wie es in der App aussieht.
 *
 * Titel und Schritte stammen aus labs/04-router-zwei-netze.json im
 * App-Projekt. Das Drehbuch löst die fünf Schritte nacheinander: Nach jeder
 * bestandenen Prüfung ändert sich die Fläche (Schnittstelle an, Adresse da),
 * beim letzten Schritt wandert der Ping sichtbar durch den Router.
 */
import { computed, ref } from "vue";
import AppFenster from "../ui/AppFenster.vue";
import NetzTopologie, { type Kabel, type Paket } from "../ui/NetzTopologie.vue";
import { useDrehbuch, type Warte } from "../../composables/useDrehbuch";
import pc from "../../assets/cisco/pc.jpg";
import router from "../../assets/cisco/router.jpg";

type Stand = "offen" | "pruefe" | "ok";

const schritte = [
  { titel: "Erste Router-Schnittstelle einrichten", befehl: "interface f0/0 · no shutdown" },
  { titel: "Zweite Router-Schnittstelle einrichten", befehl: "interface f0/1 · no shutdown" },
  { titel: "PC1 einrichten", befehl: "ip 192.168.1.10/24 192.168.1.1" },
  { titel: "PC2 einrichten", befehl: "ip 192.168.2.10/24 192.168.2.1" },
  { titel: "Quer durch den Router pingen", befehl: "ping 192.168.2.10" },
];
const PUNKTE_PRO_SCHRITT = 100;

const stand = ref<Stand[]>(schritte.map(() => "offen"));
const aktuell = ref(0);
const pakete = ref<Paket[]>([]);

const geschafft = computed(() => stand.value.filter((s) => s === "ok").length);

const geraete = computed(() => [
  { name: "PC1", bild: pc, x: 14, y: 46, an: true, info: geschafft.value >= 3 ? "192.168.1.10/24" : undefined },
  { name: "R1", bild: router, x: 50, y: 46, an: true },
  { name: "PC2", bild: pc, x: 86, y: 46, an: true, info: geschafft.value >= 4 ? "192.168.2.10/24" : undefined },
]);

const kabel = computed<Kabel[]>(() => [
  { von: 1, nach: 0, aus: geschafft.value < 1, portVon: geschafft.value >= 1 ? "f0/0 · .1.1" : "f0/0" },
  { von: 1, nach: 2, aus: geschafft.value < 2, portVon: geschafft.value >= 2 ? "f0/1 · .2.1" : "f0/1" },
]);

let paketNr = 0;
/** Lässt ein Paket in `ms` Millisekunden über `weg` wandern. */
function sende(weg: number[], farbe: Paket["farbe"], ms: number): Promise<void> {
  const id = ++paketNr;
  pakete.value.push({ id, weg, t: 0, farbe });
  const start = performance.now();
  return new Promise((fertig) => {
    function bild(jetzt: number) {
      const p = pakete.value.find((x) => x.id === id);
      if (!p) return fertig();
      p.t = (jetzt - start) / ms;
      if (p.t >= 1) {
        pakete.value = pakete.value.filter((x) => x.id !== id);
        fertig();
      } else requestAnimationFrame(bild);
    }
    requestAnimationFrame(bild);
  });
}

async function ablauf(warte: Warte) {
  for (let i = 0; i < schritte.length; i++) {
    aktuell.value = i;
    await warte(i === 0 ? 900 : 1500);
    stand.value[i] = "pruefe";
    if (i === schritte.length - 1) {
      // NetDuel führt den Ping bei der Prüfung selbst aus.
      for (let n = 0; n < 2; n++) {
        await sende([0, 1, 2], "cyan", 1100);
        await sende([2, 1, 0], "amber", 1100);
        await warte(150);
      }
    } else {
      await warte(900);
    }
    stand.value[i] = "ok";
  }
  aktuell.value = schritte.length;
}

const wurzel = ref<HTMLElement | null>(null);
useDrehbuch(wurzel, {
  ablauf,
  pauseMs: 4500,
  zuruecksetzen() {
    stand.value = schritte.map(() => "offen");
    aktuell.value = 0;
    pakete.value = [];
  },
  endstand() {
    stand.value = schritte.map(() => "ok");
    aktuell.value = schritte.length;
  },
});
</script>

<template>
  <div ref="wurzel">
    <AppFenster
      titel="NetDuel · Lab 4 · Zwei Netze, ein Router"
      status="Verbunden mit GNS3 3.0.6"
      verbunden
    >
      <div class="aufbau">
        <div class="rahmen">
          <NetzTopologie :geraete="geraete" :kabel="kabel" :pakete="pakete" :hoehe="72" />
        </div>

        <aside class="aufgabe" aria-label="Schritte des Labs">
          <p class="kopf">
            <span>Schritte</span>
            <span class="mono">{{ geschafft }} / {{ schritte.length }}</span>
          </p>
          <ol>
            <li
              v-for="(s, i) in schritte"
              :key="s.titel"
              :class="[stand[i], { jetzt: i === aktuell }]"
            >
              <span class="symbol" aria-hidden="true">
                <svg v-if="stand[i] === 'ok'" viewBox="0 0 12 12">
                  <path d="M2.5 6.2 5 8.6l4.5-5" />
                </svg>
                <span v-else-if="stand[i] === 'offen'">{{ i + 1 }}</span>
              </span>
              <span class="text">
                <span class="titel">{{ s.titel }}</span>
                <span class="befehl-klein">{{
                  stand[i] === "pruefe" ? "Prüfe …" : s.befehl
                }}</span>
              </span>
            </li>
          </ol>
          <div class="fuss">
            <div class="balken" aria-hidden="true">
              <span :style="{ width: (geschafft / schritte.length) * 100 + '%' }" />
            </div>
            <p>
              <strong>{{ geschafft * PUNKTE_PRO_SCHRITT }}</strong> Punkte
              <span v-if="geschafft === schritte.length" class="geloest">· Lab gelöst</span>
            </p>
          </div>
        </aside>
      </div>
    </AppFenster>
  </div>
</template>

<style scoped>
.aufbau {
  display: grid;
  grid-template-columns: 1fr 300px;
}

/* Der Rahmen trägt das Punktraster und füllt die ganze Zeilenhöhe;
   die Fläche selbst sitzt mittig darin. */
.rahmen {
  display: grid;
  align-items: center;
  background-color: var(--weiss);
  background-image: radial-gradient(#d9dfe6 1px, transparent 1px);
  background-size: 20px 20px;
  background-position: 10px 10px;
}

.rahmen :deep(.flaeche) {
  background: none;
}

.aufgabe {
  display: flex;
  flex-direction: column;
  border-left: 1px solid var(--linie);
  background: var(--weiss);
  font-size: 13.5px;
}

.kopf {
  display: flex;
  justify-content: space-between;
  padding: var(--a-4) var(--a-5) var(--a-2);
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--text-leise);
}

.kopf .mono {
  font-size: 12px;
  letter-spacing: 0;
}

ol {
  flex: 1;
  padding: 0 var(--a-3);
}

li {
  display: flex;
  gap: var(--a-3);
  padding: var(--a-2) var(--a-3);
  border-radius: var(--radius-s);
  color: var(--text-leise);
  transition: background 0.3s ease;
}

li.jetzt {
  background: var(--papier);
  color: var(--text);
}

.symbol {
  flex-shrink: 0;
  display: grid;
  place-items: center;
  width: 22px;
  height: 22px;
  margin-top: 1px;
  border-radius: 50%;
  border: 1.5px solid var(--linie-stark);
  font-family: var(--mono);
  font-size: 11px;
  font-weight: 500;
}

li.ok .symbol {
  border-color: var(--gruen);
  background: var(--gruen);
}

.symbol svg {
  width: 12px;
  height: 12px;
  fill: none;
  stroke: #fff;
  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-linejoin: round;
}

li.pruefe .symbol {
  border-color: var(--cyan);
  border-right-color: transparent;
  animation: drehen 0.8s linear infinite;
}

@keyframes drehen {
  to {
    transform: rotate(360deg);
  }
}

.text {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.titel {
  font-weight: 500;
  line-height: 1.35;
}

li.ok .titel {
  color: var(--text);
}

.befehl-klein {
  font-family: var(--mono);
  font-size: 11px;
  color: var(--text-leise);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

li.pruefe .befehl-klein {
  color: var(--cyan-text);
}

.fuss {
  padding: var(--a-4) var(--a-5);
  border-top: 1px solid var(--linie);
}

.balken {
  height: 6px;
  border-radius: 3px;
  background: var(--papier);
  overflow: hidden;
  margin-bottom: 8px;
}

.balken span {
  display: block;
  height: 100%;
  background: var(--cyan);
  transition: width 0.5s ease;
}

.fuss p {
  color: var(--text-leise);
}

.fuss strong {
  color: var(--text);
  font-variant-numeric: tabular-nums;
}

.geloest {
  color: var(--gruen);
  font-weight: 500;
}

@media (max-width: 900px) {
  .aufbau {
    grid-template-columns: 1fr;
  }
  .aufgabe {
    border-left: 0;
    border-top: 1px solid var(--linie);
  }
}
</style>
