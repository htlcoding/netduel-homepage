<script setup lang="ts">
/**
 * Icons von Hugeicons (hugeicons.com, freies Set "Stroke Rounded") auf einer
 * Kachel, getönt in einer der Akzentfarben aus style.css.
 *
 *   <NdIcon name="konsole" ton="violett" />
 *
 * Die Icons kommen aus dem npm-Paket @hugeicons/core-free-icons und werden
 * mitgebaut — kein Laden aus dem Internet.
 */
import { computed } from "vue";
import { HugeiconsIcon } from "@hugeicons/vue";
import {
  ComputerTerminal01Icon,
  HierarchySquare02Icon,
  LiveStreaming02Icon,
  PasswordValidationIcon,
  RankingIcon,
  StudentIcon,
  TaskDone01Icon,
  TeacherIcon,
} from "@hugeicons/core-free-icons";

const icons = {
  aufbau: HierarchySquare02Icon,
  konsole: ComputerTerminal01Icon,
  pruefen: TaskDone01Icon,
  ranking: RankingIcon,
  raum: PasswordValidationIcon,
  live: LiveStreaming02Icon,
  schueler: StudentIcon,
  lehrkraft: TeacherIcon,
};

export type IconName = keyof typeof icons;
export type Ton = "cyan" | "violett" | "gruen" | "amber" | "koralle";

const props = withDefaults(
  defineProps<{ name: IconName; ton?: Ton; groesse?: number }>(),
  { ton: "cyan", groesse: 48 },
);

const icon = computed(() => icons[props.name]);
</script>

<template>
  <span
    class="icon"
    :class="ton"
    :style="{ width: groesse + 'px', height: groesse + 'px' }"
    aria-hidden="true"
  >
    <HugeiconsIcon :icon="icon" :size="Math.round(groesse * 0.5)" :stroke-width="1.6" />
  </span>
</template>

<style scoped>
.icon {
  display: inline-grid;
  place-items: center;
  flex-shrink: 0;
  border-radius: var(--kachel-radius);
  background: color-mix(in srgb, var(--a) 16%, transparent);
  color: var(--a-text);
}

.cyan { --a: var(--akzent-cyan); --a-text: var(--akzent-cyan-text); }
.violett { --a: var(--akzent-violett); --a-text: var(--akzent-violett-text); }
.gruen { --a: var(--akzent-gruen); --a-text: var(--akzent-gruen-text); }
.amber { --a: var(--akzent-amber); --a-text: var(--akzent-amber-text); }
.koralle { --a: var(--akzent-koralle); --a-text: var(--akzent-koralle-text); }
</style>
