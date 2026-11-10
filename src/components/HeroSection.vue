<script setup lang="ts">
/**
 * Einstieg: eine kurze Zeile, darunter die App bei der Arbeit.
 * Keine Parolen, keine Knöpfe (die Kopfzeile hat einen).
 */
import LabDemo from "./demo/LabDemo.vue";
</script>

<template>
  <section id="top" class="hero">
    <div class="innen">
      <h1>Netzwerk&#8209;Labs, die sich selbst prüfen.</h1>

      <div class="vorfuehrung">
        <LabDemo />
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero {
  padding: calc(var(--kopfhoehe) + var(--a-8)) 0 var(--abschnitt-y);
  background: var(--midnight-1);
  color: var(--midnight-text);
}

h1 {
  font-size: clamp(34px, 5vw, 60px);
  line-height: 1.08;
  letter-spacing: -0.03em;
}

.vorfuehrung {
  margin-top: var(--kopf-nach);
}

@media (max-width: 640px) {
  .hero {
    padding-top: calc(var(--kopfhoehe) + var(--a-7));
  }
}
</style>
