<script setup lang="ts">
/**
 * Kopf eines Abschnitts: Überschrift und optional ein kurzer Satz.
 *
 *   <AbschnittKopf>
 *     Überschrift
 *     <template #lead>Ein Satz dazu.</template>
 *   </AbschnittKopf>
 *
 * Auf dunklem Abschnitt kommt die Farbe des Satzes aus --kopf-leise
 * (gesetzt in style.css bei .abschnitt.dunkel).
 */
</script>

<template>
  <div class="abschnitt-kopf" v-einblenden>
    <h2><slot /></h2>
    <p v-if="$slots.lead" class="lead"><slot name="lead" /></p>
  </div>
</template>

<style scoped>
.abschnitt-kopf {
  max-width: 680px;
  margin-bottom: var(--kopf-nach);
}

h2 {
  font-size: clamp(30px, 4vw, 44px);
}

.lead {
  margin-top: var(--a-4);
  font-size: clamp(17px, 1.6vw, 19px);
  color: var(--kopf-leise, var(--text-leise));
}

</style>
