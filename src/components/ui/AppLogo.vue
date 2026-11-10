<script setup lang="ts">
/**
 * Das NetDuel-Zeichen (Konzept 3 „Pakete“): zwei Winkel, die aufeinander
 * zulaufen und sich knapp verfehlen. Geometrie und Farben genau nach
 * src/assets/logo/NETDUEL_LOGO.md — dort stehen auch die Regeln.
 *
 * Unter 32 px wird automatisch die Kompaktvariante gezeichnet.
 * `onDark` hellt die Kachel auf, damit sie auf dunklem Grund sichtbar bleibt.
 */
import { computed } from "vue";

const props = withDefaults(
  defineProps<{ size?: number; variant?: "default" | "onDark" }>(),
  { size: 24, variant: "default" },
);

const kompakt = computed(() => props.size < 32);
const kachel = computed(() =>
  props.variant === "onDark" ? "#123A66" : "#0B2545",
);
</script>

<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 64 64"
    aria-hidden="true"
    focusable="false"
  >
    <template v-if="kompakt">
      <rect x="0" y="0" width="64" height="64" rx="15" :fill="kachel" />
      <path d="M16 21 L25 32 L16 43" stroke="#FFFFFF" stroke-width="8" />
      <path d="M48 21 L39 32 L48 43" stroke="#00B7E0" stroke-width="8" />
    </template>
    <template v-else>
      <rect x="2" y="2" width="60" height="60" rx="15" :fill="kachel" />
      <path d="M16 19 L26 32 L16 45" stroke="#FFFFFF" stroke-width="6.5" />
      <path d="M48 19 L38 32 L48 45" stroke="#00B7E0" stroke-width="6.5" />
    </template>
  </svg>
</template>

<style scoped>
path {
  fill: none;
  stroke-linecap: round;
  stroke-linejoin: round;
}
</style>
