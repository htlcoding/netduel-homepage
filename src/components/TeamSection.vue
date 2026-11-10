<script setup lang="ts">
/** "Team": wer was gebaut hat — eine ruhige Liste. Aufteilung wie in der README des App-Projekts. */
import AbschnittKopf from "./ui/AbschnittKopf.vue";

const team = [
  { name: "Talha Yigit", bereich: "Oberfläche und Design", ton: "cyan" },
  { name: "Mikal Manay Beyene", bereich: "GNS3-Anbindung und Übungen", ton: "violett" },
  { name: "Hussein Al-Hakeem", bereich: "Server, Anmeldung und Duell", ton: "amber" },
];

function initialen(name: string): string {
  const teile = name.split(" ");
  return (teile[0][0] + teile[teile.length - 1][0]).toUpperCase();
}
</script>

<template>
  <section id="team" class="abschnitt papier">
    <div class="innen">
      <AbschnittKopf>
        Team
        <template #lead>Diplomarbeit an der HTL Wien West, Schuljahr 2026/27.</template>
      </AbschnittKopf>

      <ul class="team">
        <li v-for="p in team" :key="p.name">
          <span class="avatar" :class="p.ton" aria-hidden="true">{{ initialen(p.name) }}</span>
          <div>
            <p class="name">{{ p.name }}</p>
            <p class="bereich">{{ p.bereich }}</p>
          </div>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.team {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  border-top: 1px solid var(--linie);
}

li {
  display: flex;
  align-items: center;
  gap: var(--a-3);
  padding: var(--a-5) 0;
}

li + li {
  padding-left: var(--a-5);
  border-left: 1px solid var(--linie);
}

.avatar {
  flex-shrink: 0;
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  border-radius: var(--kachel-radius);
  background: color-mix(in srgb, var(--a) 16%, transparent);
  color: var(--a-text);
  font-size: 13px;
  font-weight: 600;
}

.cyan { --a: var(--akzent-cyan); --a-text: var(--akzent-cyan-text); }
.violett { --a: var(--akzent-violett); --a-text: var(--akzent-violett-text); }
.amber { --a: var(--akzent-amber); --a-text: var(--akzent-amber-text); }

.name {
  font-size: 15px;
  font-weight: 600;
}

.bereich {
  font-size: 14px;
  color: var(--text-leise);
}

@media (max-width: 860px) {
  .team {
    grid-template-columns: 1fr;
  }
  li {
    padding: var(--a-4) 0;
  }
  li + li {
    padding-left: 0;
    border-left: 0;
    border-top: 1px solid var(--linie);
  }
}
</style>
