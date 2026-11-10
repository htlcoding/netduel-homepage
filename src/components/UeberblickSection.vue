<script setup lang="ts">
/** "Überblick": was NetDuel ist und was es macht — vier Punkte, je ein Satz. */
import AbschnittKopf from "./ui/AbschnittKopf.vue";
import NdIcon, { type IconName, type Ton } from "./ui/NdIcon.vue";

const punkte: Array<{ icon: IconName; ton: Ton; titel: string; text: string }> = [
  {
    icon: "aufbau",
    ton: "cyan",
    titel: "Aufbauen",
    text: "Ein Klick, und das Netzwerk für die Übung steht mit allen Geräten und Kabeln.",
  },
  {
    icon: "konsole",
    ton: "violett",
    titel: "Konfigurieren",
    text: "Die Geräte bedient man in ihrer Konsole, genau wie echte Router und PCs.",
  },
  {
    icon: "pruefen",
    ton: "gruen",
    titel: "Prüfen",
    text: "NetDuel schaut im Gerät nach und sagt genau, was noch fehlt.",
  },
  {
    icon: "ranking",
    ton: "amber",
    titel: "Vergleichen",
    text: "Punkte, Duelle und ein Klassenranking machen aus Üben einen Wettkampf.",
  },
];
</script>

<template>
  <section id="idee" class="abschnitt">
    <div class="innen">
      <AbschnittKopf>
        Was NetDuel macht.
        <template #lead>
          GNS3 bildet echte Netzwerkgeräte nach, ist aber für Profis gebaut.
          NetDuel legt eine einfache Oberfläche darüber, mit Aufgaben,
          Anleitung und Kontrolle.
        </template>
      </AbschnittKopf>

      <ul class="punkte">
        <li v-for="(p, i) in punkte" :key="p.titel" v-einblenden="i * 90">
          <NdIcon :name="p.icon" :ton="p.ton" />
          <h3>{{ p.titel }}</h3>
          <p>{{ p.text }}</p>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.punkte {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--raster-luecke);
}

li {
  padding: var(--karte-abstand);
  border-radius: var(--karte-radius);
  background: var(--papier);
}

h3 {
  margin: var(--a-4) 0 var(--a-1);
  font-size: 19px;
}

li p {
  font-size: 15.5px;
  color: var(--text-leise);
}

@media (max-width: 960px) {
  .punkte {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 520px) {
  .punkte {
    grid-template-columns: 1fr;
  }
  li {
    display: grid;
    grid-template-columns: 48px 1fr;
    column-gap: var(--a-4);
    padding: var(--karte-abstand);
  }
  li :deep(.icon) {
    grid-row: span 2;
  }
  h3 {
    margin: 0 0 var(--a-1);
  }
}
</style>
