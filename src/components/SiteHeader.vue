<script setup lang="ts">
/**
 * Kopfzeile: schlicht und fest oben. Logo links, Links in der Mitte rechts,
 * ein Knopf ganz rechts. Der aktive Abschnitt ist nur heller — keine Effekte.
 * Auf dem Handy klappt darunter eine einfache Liste auf (Esc schließt sie).
 */
import { onBeforeUnmount, onMounted, ref } from "vue";
import WortMarke from "./ui/WortMarke.vue";
import { useAktiverAbschnitt } from "../composables/useAktiverAbschnitt";

const links = [
  { id: "idee", text: "Überblick" },
  { id: "pruefung", text: "Prüfung" },
  { id: "duell", text: "Duell" },
  { id: "rollen", text: "Für wen" },
  { id: "team", text: "Team" },
];

const aktiv = useAktiverAbschnitt(links.map((l) => l.id));
const offen = ref(false);

function tasten(e: KeyboardEvent) {
  if (e.key === "Escape") offen.value = false;
}

onMounted(() => window.addEventListener("keydown", tasten));
onBeforeUnmount(() => window.removeEventListener("keydown", tasten));
</script>

<template>
  <header class="kopf">
    <div class="innen leiste">
      <a class="marke" href="#top" aria-label="NetDuel, zum Anfang" @click="offen = false">
        <WortMarke :size="26" dunkel />
      </a>

      <nav aria-label="Abschnitte" class="links">
        <a
          v-for="link in links"
          :key="link.id"
          :href="'#' + link.id"
          :class="{ aktiv: aktiv === link.id }"
          :aria-current="aktiv === link.id ? 'true' : undefined"
          >{{ link.text }}</a
        >
      </nav>

      <a class="aktion" href="#duell">Duell ansehen</a>

      <button
        class="menue"
        type="button"
        :aria-expanded="offen"
        aria-controls="menue-liste"
        @click="offen = !offen"
      >
        <span class="nur-vorlesen">Menü</span>
        <i /><i />
      </button>
    </div>

    <nav v-if="offen" id="menue-liste" class="menue-liste" aria-label="Abschnitte">
      <div class="innen">
        <a
          v-for="link in links"
          :key="link.id"
          :href="'#' + link.id"
          :class="{ aktiv: aktiv === link.id }"
          @click="offen = false"
          >{{ link.text }}</a
        >
      </div>
    </nav>
  </header>
</template>

<style scoped>
.kopf {
  position: fixed;
  inset: 0 0 auto;
  z-index: 20;
  background: var(--midnight-1);
  border-bottom: 1px solid var(--midnight-linie);
}

.leiste {
  display: flex;
  align-items: center;
  gap: 32px;
  height: var(--kopfhoehe);
}

.marke {
  display: inline-flex;
  margin-right: auto;
  text-decoration: none;
}

.links {
  display: flex;
  gap: 28px;
}

.links a {
  font-size: 14px;
  color: var(--midnight-leise);
  text-decoration: none;
  transition: color 0.15s ease;
}

.links a:hover,
.links a.aktiv {
  color: var(--midnight-text);
}

.aktion {
  display: inline-flex;
  align-items: center;
  height: 36px;
  padding: 0 14px;
  border-radius: var(--radius-s);
  font-family: var(--display);
  font-size: 14px;
  font-weight: 550;
  letter-spacing: -0.01em;
  color: var(--midnight-0);
  background: var(--cyan);
  text-decoration: none;
  transition: background 0.15s ease;
}

.aktion:hover {
  background: var(--cyan-hell);
}

.menue,
.menue-liste {
  display: none;
}

@media (max-width: 860px) {
  .links,
  .aktion {
    display: none;
  }

  .menue {
    display: grid;
    place-content: center;
    gap: 5px;
    width: 40px;
    height: 40px;
    margin-right: -8px;
    border: 0;
    background: none;
    color: var(--midnight-text);
    cursor: pointer;
  }

  .menue i {
    width: 18px;
    height: 1.5px;
    background: currentColor;
    transition: transform 0.2s ease;
  }

  .menue[aria-expanded="true"] i:first-of-type {
    transform: translateY(3.25px) rotate(45deg);
  }

  .menue[aria-expanded="true"] i:last-of-type {
    transform: translateY(-3.25px) rotate(-45deg);
  }

  .menue-liste {
    display: block;
    border-top: 1px solid var(--midnight-linie);
    padding: 8px 0 16px;
  }

  .menue-liste a {
    display: block;
    padding: 12px 0;
    font-size: 16px;
    color: var(--midnight-leise);
    text-decoration: none;
  }

  .menue-liste a + a {
    border-top: 1px solid var(--midnight-linie);
  }

  .menue-liste a.aktiv {
    color: var(--midnight-text);
  }
}
</style>
