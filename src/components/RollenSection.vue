<script setup lang="ts">
/** "Für wen": die zwei Rollen der App, je drei Punkte. */
import AbschnittKopf from "./ui/AbschnittKopf.vue";
import NdIcon, { type IconName, type Ton } from "./ui/NdIcon.vue";

const rollen: Array<{ icon: IconName; ton: Ton; titel: string; punkte: string[] }> = [
  {
    icon: "schueler",
    ton: "cyan",
    titel: "Schülerinnen und Schüler",
    punkte: [
      "Schritt für Schritt durch jede Übung, mit Tipps",
      "Sofort sehen, ob es stimmt und warum nicht",
      "Duelle und Ranking gegen die eigene Klasse",
    ],
  },
  {
    icon: "lehrkraft",
    ton: "violett",
    titel: "Lehrkräfte",
    punkte: [
      "Übungen für eine Klasse freigeben",
      "Fortschritt und Ergebnisse der Klasse im Blick",
      "Sehen, an welchem Schritt jemand hängt",
    ],
  },
];
</script>

<template>
  <section id="rollen" class="abschnitt">
    <div class="innen">
      <AbschnittKopf>Für die Klasse und für die Lehrkraft.</AbschnittKopf>

      <div class="spalten">
        <article v-for="(r, i) in rollen" :key="r.titel" v-einblenden="i * 120">
          <div class="titel">
            <NdIcon :name="r.icon" :ton="r.ton" />
            <h3>{{ r.titel }}</h3>
          </div>
          <ul>
            <li v-for="p in r.punkte" :key="p">
              <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3.5 8.4 6.6 11.4 12.5 4.8" /></svg>
              {{ p }}
            </li>
          </ul>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.spalten {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--raster-luecke);
}

article {
  padding: var(--karte-abstand);
  border-radius: var(--karte-radius);
  background: var(--papier);
}

.titel {
  display: flex;
  align-items: center;
  gap: var(--a-4);
  margin-bottom: var(--a-3);
}

h3 {
  font-size: 22px;
}

li {
  display: flex;
  gap: var(--a-3);
  padding: var(--a-3) 0;
  border-top: 1px solid var(--linie-stark);
}

li svg {
  flex-shrink: 0;
  width: 18px;
  height: 18px;
  margin-top: 3px;
  fill: none;
  stroke: var(--cyan-text);
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

@media (max-width: 860px) {
  .spalten {
    grid-template-columns: 1fr;
  }
}
</style>
