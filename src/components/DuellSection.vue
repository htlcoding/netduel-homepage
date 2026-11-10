<script setup lang="ts">
/**
 * "Duell": kurzer Text links, rechts ein Beispiel-Duell.
 *
 * Das Beispiel folgt dem Ablauf der App: Warteraum mit Raumcode, beide
 * drücken "bereit", dann läuft Lab 1 für beide gleichzeitig. Die Namen sind
 * die Beispieldaten aus dem Mock-Dienst der App, keine echten Personen.
 * Die Spielzeit läuft schneller als echt (ein Takt = 3 Sekunden).
 */
import { computed, ref } from "vue";
import AbschnittKopf from "./ui/AbschnittKopf.vue";
import AppFenster from "./ui/AppFenster.vue";
import NdIcon, { type IconName, type Ton } from "./ui/NdIcon.vue";
import { useDrehbuch, type Warte } from "../composables/useDrehbuch";

const SCHRITTE = 3;
const PUNKTE = 100;
const TAKT_MS = 160;
const SEKUNDEN_PRO_TAKT = 3;

type Phase = "warteraum" | "laeuft" | "ende";

const phase = ref<Phase>("warteraum");
const bereit = ref([false, false]);
const geschafft = ref([0, 0]);
const zeitpunkt = ref([0, 0]);
const takt = ref(0);

/** In welchem Takt schafft wer einen Schritt? */
const drehbuch: Array<{ takt: number; wer: 0 | 1 }> = [
  { takt: 14, wer: 1 },
  { takt: 19, wer: 0 },
  { takt: 31, wer: 0 },
  { takt: 37, wer: 1 },
  { takt: 52, wer: 0 },
];

const namen = ["Anna Berger", "Ben Wagner"];

function format(sekunden: number): string {
  const m = Math.floor(sekunden / 60);
  const s = sekunden % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

const uhr = computed(() => format(takt.value * SEKUNDEN_PRO_TAKT));

const spieler = computed(() =>
  namen.map((name, i) => ({
    name,
    farbe: i === 0 ? "cyan" : "amber",
    schritte: geschafft.value[i],
    punkte: geschafft.value[i] * PUNKTE,
    zeit: format(zeitpunkt.value[i] * SEKUNDEN_PRO_TAKT),
    bereit: bereit.value[i],
    fuehrt:
      geschafft.value[i] > 0 && geschafft.value[i] > geschafft.value[1 - i],
    sieger: phase.value === "ende" && geschafft.value[i] === SCHRITTE,
  })),
);

async function ablauf(warte: Warte) {
  await warte(900);
  bereit.value = [true, false];
  await warte(900);
  bereit.value = [true, true];
  await warte(1000);
  phase.value = "laeuft";

  for (const e of drehbuch) {
    while (takt.value < e.takt) {
      await warte(TAKT_MS);
      takt.value++;
    }
    geschafft.value[e.wer]++;
    zeitpunkt.value[e.wer] = takt.value;
  }
  phase.value = "ende";
}

const wurzel = ref<HTMLElement | null>(null);
useDrehbuch(wurzel, {
  ablauf,
  pauseMs: 4500,
  zuruecksetzen() {
    phase.value = "warteraum";
    bereit.value = [false, false];
    geschafft.value = [0, 0];
    zeitpunkt.value = [0, 0];
    takt.value = 0;
  },
  endstand() {
    phase.value = "ende";
    bereit.value = [true, true];
    geschafft.value = [3, 2];
    zeitpunkt.value = [52, 37];
    takt.value = 52;
  },
});

const punkte: Array<{ icon: IconName; ton: Ton; text: string }> = [
  { icon: "raum", ton: "cyan", text: "Raum erstellen, Code weitergeben, los geht's." },
  { icon: "live", ton: "koralle", text: "Den Fortschritt des Gegenübers sieht man live." },
  { icon: "ranking", ton: "amber", text: "Siege und Punkte landen im Ranking der Klasse." },
];
</script>

<template>
  <section id="duell" class="abschnitt papier">
    <div class="innen raster">
      <div>
        <AbschnittKopf>
          Gleiches Lab. Zwei Personen. Eine Uhr.
          <template #lead>Wer zuerst alle Schritte richtig hat, gewinnt.</template>
        </AbschnittKopf>

        <ul class="punkte">
          <li v-for="(p, i) in punkte" :key="p.text" v-einblenden="i * 90">
            <NdIcon :name="p.icon" :ton="p.ton" :groesse="40" />
            {{ p.text }}
          </li>
        </ul>
      </div>

      <div ref="wurzel">
        <AppFenster titel="NetDuel · Duell" :status="phase === 'warteraum' ? 'Warteraum' : 'Beispiel-Duell'">
          <div class="duell">
            <div class="kopf">
              <div>
                <p class="lab">Lab 1 · IP-Adressen vergeben</p>
                <p class="unter">Raum <span class="code">K7MQ</span></p>
              </div>
              <div class="uhr" aria-label="Zeit">
                <span>Zeit</span>{{ uhr }}
              </div>
            </div>

            <div class="karten">
              <article
                v-for="s in spieler"
                :key="s.name"
                class="karte"
                :class="[s.farbe, { sieger: s.sieger }]"
              >
                <header>
                  <strong>{{ s.name }}</strong>
                  <span v-if="phase === 'warteraum'" class="zustand" :class="{ ja: s.bereit }">
                    {{ s.bereit ? "bereit" : "wartet …" }}
                  </span>
                  <span v-else-if="s.sieger" class="zustand ja">gewonnen</span>
                  <span v-else-if="s.fuehrt && phase === 'laeuft'" class="zustand fuehrt">führt</span>
                </header>
                <div class="spur" aria-hidden="true">
                  <i v-for="n in SCHRITTE" :key="n" :class="{ voll: n <= s.schritte }" />
                </div>
                <footer>
                  <span>{{ s.schritte }} von {{ SCHRITTE }} Schritten</span>
                  <span class="mono">{{ s.punkte }} P · {{ s.zeit }}</span>
                </footer>
              </article>
            </div>

            <p class="ergebnis" :class="{ da: phase === 'ende' }" aria-live="polite">
              <template v-if="phase === 'ende'">
                Anna Berger gewinnt mit allen 3 Schritten in {{ uhr }}.
              </template>
              <template v-else>&nbsp;</template>
            </p>
          </div>
        </AppFenster>
      </div>
    </div>
  </section>
</template>

<style scoped>
.raster {
  display: grid;
  grid-template-columns: 1fr 1.05fr;
  gap: var(--spalten-luecke);
  align-items: center;
}

.raster :deep(.abschnitt-kopf) {
  margin-bottom: var(--a-6);
}

.punkte li {
  display: flex;
  align-items: center;
  gap: var(--a-4);
  padding: var(--a-2) 0;
  font-size: 16px;
}

/* --- Beispiel-Duell --- */

.duell {
  padding: var(--a-5);
  background: var(--weiss);
}

.kopf {
  display: flex;
  flex-wrap: wrap;
  gap: var(--a-2) var(--a-4);
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--a-5);
}

.lab {
  font-weight: 600;
}

.unter {
  font-size: 13px;
  color: var(--text-leise);
}

.code {
  font-family: var(--mono);
  font-weight: 500;
  letter-spacing: 0.1em;
  color: var(--text);
  background: var(--papier);
  border: 1px solid var(--linie);
  border-radius: 4px;
  padding: 0 5px;
}

.uhr {
  font-size: 28px;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.02em;
  line-height: 1;
}

.uhr span {
  margin-right: 8px;
  font-size: 12px;
  font-weight: 400;
  letter-spacing: 0;
  color: var(--text-leise);
}

.karten {
  display: grid;
  gap: var(--a-3);
}

.karte {
  padding: var(--a-4);
  border-radius: var(--radius);
  border: 1px solid var(--linie);
  transition:
    border-color 0.3s ease,
    box-shadow 0.3s ease;
}

.karte.sieger {
  border-color: var(--gruen);
  box-shadow: 0 0 0 3px var(--gruen-weich);
}

.karte header,
.karte footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.karte footer {
  font-size: 13px;
  color: var(--text-leise);
}

.karte .mono {
  font-family: var(--mono);
  font-size: 12px;
  font-variant-numeric: tabular-nums;
}

.zustand {
  font-size: 12px;
  font-weight: 500;
  color: var(--text-leise);
}

.zustand.ja {
  color: var(--gruen);
}

.zustand.fuehrt {
  color: var(--cyan-text);
}

.spur {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 4px;
  margin: var(--a-3) 0 var(--a-2);
}

.spur i {
  height: 8px;
  border-radius: 2px;
  background: var(--papier);
  transition: background 0.4s ease;
}

.cyan .spur i.voll {
  background: var(--cyan);
}

.amber .spur i.voll {
  background: var(--amber);
}

.ergebnis {
  margin-top: var(--a-4);
  padding: var(--a-3);
  border-radius: var(--radius-s);
  font-size: 14px;
  font-weight: 500;
  text-align: center;
  color: var(--gruen);
  background: var(--gruen-weich);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.ergebnis.da {
  opacity: 1;
}

@media (max-width: 960px) {
  .raster {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .duell {
    padding: var(--a-4);
  }
}
</style>
