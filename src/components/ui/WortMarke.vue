<script setup lang="ts">
/**
 * Zeichen + Name: Abstand = halbe Zeichenhöhe (NETDUEL_LOGO.md Abschnitt 7),
 * Schrift Geist 650 mit enger Laufweite, einfarbig (#0B2545, auf dunklem
 * Grund weiß). Das Cyan gehört nur dem Zeichen.
 */
import AppLogo from "./AppLogo.vue";

withDefaults(defineProps<{ size?: number; dunkel?: boolean }>(), {
  size: 28,
  dunkel: false,
});
</script>

<template>
  <span
    class="wortmarke"
    :class="{ dunkel }"
    :style="{ gap: size / 2 + 'px', fontSize: size * 0.72 + 'px' }"
  >
    <AppLogo :size="size" :variant="dunkel ? 'onDark' : 'default'" />
    <span>NetDuel</span>
  </span>
</template>

<style scoped>
.wortmarke {
  display: inline-flex;
  align-items: center;
  font-family: var(--display);
  font-weight: 650;
  letter-spacing: -0.035em;
  line-height: 1;
  color: #0b2545;
  transition: color 0.25s ease;
}

.dunkel {
  color: #ffffff;
}
</style>
