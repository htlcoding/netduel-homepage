<script setup lang="ts">
/**
 * "Prüfung": wie NetDuel erkennt, ob eine Aufgabe gelöst ist.
 *
 * Rechts läuft Lab 4, Schritt 2 durch — mit dem klassischen Anfängerfehler:
 * Adresse eingetragen, "no shutdown" vergessen. Die Meldungen sind wörtlich
 * die der App (src/main/checks/cisco.ts im App-Projekt), die Punkte folgen
 * ihrer Regel: 100 pro Schritt, 10 weniger für jeden weiteren Versuch.
 */
import { ref } from "vue";
import AbschnittKopf from "./ui/AbschnittKopf.vue";
import AppFenster from "./ui/AppFenster.vue";
import KonsoleAnzeige, { type KonsolenZeile } from "./ui/KonsoleAnzeige.vue";
import { tippen, useDrehbuch, type Warte } from "../composables/useDrehbuch";

type Ergebnis =
  | { art: "leer" }
  | { art: "laeuft" }
  | { art: "nein"; text: string }
  | { art: "ja"; text: string; punkte: number };

const zeilen = ref<KonsolenZeile[]>([]);
const tippt = ref(false);
const ergebnis = ref<Ergebnis>({ art: "leer" });
const versuch = ref(1);

async function befehl(prompt: string, text: string, warte: Warte) {
  zeilen.value.push({ art: "befehl", prompt, text: "" });
  const z = zeilen.value[zeilen.value.length - 1];
  tippt.value = true;
  await tippen(text, (t) => (z.text = t), warte);
  await warte(350);
  tippt.value = false;
}

function antwort(text: string, art: KonsolenZeile["art"] = "antwort") {
  zeilen.value.push({ art, text });
}

async function ablauf(warte: Warte) {
  await warte(600);
  await befehl("R1#", "configure terminal", warte);
  antwort("Enter configuration commands, one per line.  End with CNTL/Z.");
  await befehl("R1(config)#", "interface f0/1", warte);
  await befehl("R1(config-if)#", "ip address 192.168.2.1 255.255.255.0", warte);
  await befehl("R1(config-if)#", "end", warte);
  antwort("%SYS-5-CONFIG_I: Configured from console by console");

  // Erster Versuch: no shutdown fehlt.
  await warte(700);
  ergebnis.value = { art: "laeuft" };
  await warte(1300);
  ergebnis.value = {
    art: "nein",
    text: 'Die Adresse auf FastEthernet0/1 stimmt, aber die Schnittstelle ist abgeschaltet. Es fehlt das "no shutdown".',
  };
  await warte(2600);

  // Nachbessern
  versuch.value = 2;
  await befehl("R1#", "configure terminal", warte);
  await befehl("R1(config)#", "interface f0/1", warte);
  await befehl("R1(config-if)#", "no shutdown", warte);
  antwort("%LINK-3-UPDOWN: Interface FastEthernet0/1, changed state to up", "hinweis");
  await befehl("R1(config-if)#", "end", warte);

  await warte(700);
  ergebnis.value = { art: "laeuft" };
  await warte(1300);
  ergebnis.value = {
    art: "ja",
    text: "FastEthernet0/1 hat 192.168.2.1 und ist aktiv.",
    punkte: 90,
  };
  zeilen.value.push({ art: "befehl", prompt: "R1#", text: "" });
  tippt.value = true;
}

const wurzel = ref<HTMLElement | null>(null);
useDrehbuch(wurzel, {
  ablauf,
  pauseMs: 5000,
  zuruecksetzen() {
    zeilen.value = [];
    tippt.value = false;
    ergebnis.value = { art: "leer" };
    versuch.value = 1;
  },
  endstand() {
    zeilen.value = [
      { art: "befehl", prompt: "R1(config)#", text: "interface f0/1" },
      { art: "befehl", prompt: "R1(config-if)#", text: "ip address 192.168.2.1 255.255.255.0" },
      { art: "befehl", prompt: "R1(config-if)#", text: "no shutdown" },
      { art: "hinweis", text: "%LINK-3-UPDOWN: Interface FastEthernet0/1, changed state to up" },
      { art: "befehl", prompt: "R1(config-if)#", text: "end" },
    ];
    versuch.value = 2;
    ergebnis.value = { art: "ja", text: "FastEthernet0/1 hat 192.168.2.1 und ist aktiv.", punkte: 90 };
  },
});
</script>

<template>
  <section id="pruefung" class="abschnitt dunkel">
    <div class="innen raster">
      <div>
        <AbschnittKopf>
          NetDuel schaut im Gerät nach.
          <template #lead>
            Beim Prüfen fragt NetDuel das Gerät selbst ab. Deshalb sagt es nicht
            nur „falsch“, sondern genau, was fehlt.
          </template>
        </AbschnittKopf>
      </div>

      <div ref="wurzel" class="vorfuehrung">
        <AppFenster titel="Konsole · R1 (Cisco 3725)" dunkel>
          <div class="konsole-hoehe">
            <KonsoleAnzeige :zeilen="zeilen" :cursor="tippt" />
          </div>
        </AppFenster>

        <div class="pruefkarte" aria-live="polite">
          <div class="pruefkopf">
            <div>
              <p class="klein">Lab 4 · Schritt 2 von 5 · Versuch {{ versuch }}</p>
              <p class="schritt">Zweite Router-Schnittstelle einrichten</p>
            </div>
            <span class="knopf" :class="{ drueckt: ergebnis.art === 'laeuft' }">
              {{ ergebnis.art === "laeuft" ? "Prüfe …" : "Schritt prüfen" }}
            </span>
          </div>

          <Transition name="wechsel" mode="out-in">
            <p v-if="ergebnis.art === 'leer'" key="leer" class="meldung leer">
              Noch nicht geprüft.
            </p>
            <p v-else-if="ergebnis.art === 'laeuft'" key="laeuft" class="meldung leer">
              NetDuel führt <code>show ip interface brief</code> auf R1 aus …
            </p>
            <p v-else-if="ergebnis.art === 'nein'" key="nein" class="meldung nein">
              <strong>✗ Noch nicht.</strong> {{ ergebnis.text }}
            </p>
            <p v-else key="ja" class="meldung ja">
              <strong>✓ Geschafft.</strong> {{ ergebnis.text }}
              <span class="punkte">+{{ ergebnis.punkte }} Punkte</span>
            </p>
          </Transition>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.raster {
  display: grid;
  grid-template-columns: 0.8fr 1.2fr;
  gap: var(--spalten-luecke);
  align-items: center;
}

.raster :deep(.abschnitt-kopf) {
  margin-bottom: 0;
}


.konsole-hoehe {
  height: 236px;
}

.pruefkarte {
  /* innen (Knopf, Meldung) radius-s, außen = radius-s + Abstand */
  --abstand: var(--a-4);
  margin-top: var(--a-3);
  padding: var(--abstand);
  border-radius: calc(var(--radius-s) + var(--abstand));
  background: var(--weiss);
  color: var(--text);
}

.pruefkopf {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--a-4);
  padding-bottom: var(--a-3);
  margin-bottom: var(--a-3);
  border-bottom: 1px solid var(--linie);
}

.klein {
  font-family: var(--mono);
  font-size: 11.5px;
  color: var(--text-leise);
}

.schritt {
  font-weight: 600;
  font-size: 15px;
}

.knopf {
  flex-shrink: 0;
  padding: var(--a-2) var(--a-4);
  border-radius: var(--radius-s);
  background: var(--midnight-2);
  color: var(--weiss);
  font-size: 13px;
  font-weight: 500;
  transition: transform 0.15s ease, background 0.15s ease;
}

.knopf.drueckt {
  background: var(--midnight-3);
  transform: scale(0.97);
}

.meldung {
  min-height: 72px;
  padding: var(--a-3) var(--a-4);
  border-radius: var(--radius-s);
  font-size: 14px;
  line-height: 1.5;
}

.meldung.leer {
  color: var(--text-leise);
  background: var(--papier);
}

.meldung code {
  font-family: var(--mono);
  font-size: 12.5px;
  color: var(--text);
}

.meldung.nein {
  color: #5c3a06;
  background: var(--orange-weich);
}

.meldung.nein strong {
  color: var(--orange);
}

.meldung.ja {
  color: #17461f;
  background: var(--gruen-weich);
}

.meldung.ja strong {
  color: var(--gruen);
}

.punkte {
  float: right;
  margin-left: var(--a-3);
  font-family: var(--mono);
  font-size: 12.5px;
  font-weight: 500;
  color: var(--gruen);
}

.wechsel-enter-active,
.wechsel-leave-active {
  transition: opacity 0.2s ease;
}
.wechsel-enter-from,
.wechsel-leave-to {
  opacity: 0;
}

@media (max-width: 960px) {
  .raster {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 520px) {
  .konsole-hoehe {
    height: 236px;
  }
}
</style>
