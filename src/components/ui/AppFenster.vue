<script setup lang="ts">
/**
 * Ein Programmfenster: Titelzeile, Inhalt, optionale Statusleiste.
 * Die Homepage baut die App damit nach statt Screenshots zu zeigen — bleibt
 * auf jedem Bildschirm scharf und kann sich bewegen.
 *
 * `verbunden` zeigt in der Statusleiste den grünen Punkt wie in der App.
 */
withDefaults(
  defineProps<{
    titel: string;
    status?: string;
    verbunden?: boolean;
    dunkel?: boolean;
  }>(),
  { verbunden: false, dunkel: false },
);
</script>

<template>
  <div class="fenster" :class="{ dunkel }">
    <div class="titel">
      <span class="ampel" aria-hidden="true"><i /><i /><i /></span>
      <span class="name">{{ titel }}</span>
      <slot name="titel-rechts" />
    </div>
    <div class="inhalt"><slot /></div>
    <div v-if="status || $slots.status" class="status">
      <span v-if="status" class="links">
        <i v-if="verbunden" class="led" aria-hidden="true" />{{ status }}
      </span>
      <slot name="status" />
    </div>
  </div>
</template>

<style scoped>
.fenster {
  position: relative;
  border-radius: 12px;
  background: var(--weiss);
  overflow: hidden;
  box-shadow:
    0 0 0 1px rgba(19, 38, 59, 0.1),
    0 1px 2px rgba(19, 38, 59, 0.06),
    0 24px 48px -16px rgba(14, 30, 49, 0.28);
}

.titel {
  display: flex;
  align-items: center;
  gap: 14px;
  height: 40px;
  padding: 0 14px;
  font-size: 13px;
  color: var(--text-leise);
  background: var(--papier);
  border-bottom: 1px solid var(--linie);
}

.name {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ampel {
  display: flex;
  gap: 6px;
  flex-shrink: 0;
}

.ampel i {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--linie-stark);
}

.status {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  height: 30px;
  padding: 0 14px;
  font-size: 12px;
  color: var(--text-leise);
  background: var(--papier);
  border-top: 1px solid var(--linie);
}

.links {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.led {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #35c04a;
}

/* Dunkles Fenster, z. B. für die Konsole */
.dunkel {
  background: var(--midnight-0);
  box-shadow:
    0 0 0 1px var(--midnight-linie),
    0 24px 48px -16px rgba(0, 0, 0, 0.5);
}

.dunkel .titel,
.dunkel .status {
  background: var(--midnight-1);
  border-color: var(--midnight-linie);
  color: var(--midnight-leise);
}

.dunkel .ampel i {
  background: var(--midnight-3);
}
</style>
