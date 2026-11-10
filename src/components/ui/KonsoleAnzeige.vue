<script setup lang="ts">
/**
 * Zeigt Konsolenzeilen an — nur die Darstellung. Was wann erscheint, steuert
 * die Komponente, die sie benutzt (siehe PruefungSection.vue).
 */
export interface KonsolenZeile {
  art: "befehl" | "antwort" | "hinweis";
  text: string;
  /** Nur bei Befehlen, z. B. "R1(config-if)#" */
  prompt?: string;
}

defineProps<{ zeilen: KonsolenZeile[]; cursor?: boolean }>();
</script>

<template>
  <div class="konsole" role="img" aria-label="Beispiel einer Gerätekonsole">
    <div
      v-for="(z, i) in zeilen"
      :key="i"
      class="zeile"
      :class="'z-' + z.art"
      aria-hidden="true"
    >
      <span v-if="z.prompt" class="prompt">{{ z.prompt }}</span>
      <span v-if="z.prompt">&nbsp;</span>{{ z.text
      }}<span v-if="cursor && i === zeilen.length - 1" class="cursor" />
    </div>
  </div>
</template>

<style scoped>
.konsole {
  font-family: var(--mono);
  font-size: 13px;
  line-height: 1.75;
  color: #d7e2ee;
  padding: var(--a-4) var(--a-5);
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}

.zeile {
  white-space: pre-wrap;
  word-break: break-word;
}

.prompt {
  color: var(--cyan);
}

.z-antwort {
  color: var(--midnight-leise);
}

.z-hinweis {
  color: #e6b35c;
}

.cursor {
  display: inline-block;
  width: 8px;
  height: 15px;
  margin-left: 1px;
  vertical-align: -2px;
  background: var(--cyan);
  animation: blinken 1s steps(2) infinite;
}

@keyframes blinken {
  50% {
    opacity: 0;
  }
}

@media (max-width: 640px) {
  .konsole {
    font-size: 11.5px;
    padding: var(--a-3) var(--a-4);
  }
}
</style>
