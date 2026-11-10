<script setup lang="ts">
/** Fußzeile: Wortmarke, Anlass, Schule und der Hinweis auf die Cisco-Symbole. */
import WortMarke from "./ui/WortMarke.vue";
</script>

<template>
  <footer class="fuss">
    <div class="innen">
      <div class="oben">
        <WortMarke :size="36" dunkel />
        <p>
          Netzwerktechnik üben mit GNS3, automatischer Prüfung und im Duell.
        </p>
      </div>
      <div class="unten">
        <span>Diplomarbeit · HTL Wien West · Schuljahr 2026/27</span>
        <span>Gerätesymbole von Cisco (Network Topology Icons)</span>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.fuss {
  padding: var(--a-7) 0 var(--a-6);
  background: var(--midnight-0);
  color: var(--midnight-leise);
  font-size: 14px;
}

.oben {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: var(--a-5);
  padding-bottom: var(--a-5);
  border-bottom: 1px solid var(--midnight-linie);
}

.oben p {
  max-width: 380px;
  font-size: 15px;
}

.unten {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: var(--a-2) var(--a-6);
  padding-top: var(--a-5);
}
</style>
