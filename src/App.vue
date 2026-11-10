<script setup lang="ts">
/**
 * Die Homepage ist eine einzige Seite. Jeder Abschnitt ist eine eigene
 * Komponente in `components/`; hier stehen sie in der Reihenfolge, in der man
 * sie beim Herunterscrollen sieht. Kleine, wiederverwendbare Bausteine liegen
 * in `components/ui/`, die animierte App-Vorführung in `components/demo/`.
 */
import SiteHeader from "./components/SiteHeader.vue";
import HeroSection from "./components/HeroSection.vue";
import UeberblickSection from "./components/UeberblickSection.vue";
import PruefungSection from "./components/PruefungSection.vue";
import DuellSection from "./components/DuellSection.vue";
import RollenSection from "./components/RollenSection.vue";
import TeamSection from "./components/TeamSection.vue";
import SiteFooter from "./components/SiteFooter.vue";
</script>

<template>
  <SiteHeader />
  <main>
    <HeroSection />
    <UeberblickSection />
    <PruefungSection />
    <DuellSection />
    <RollenSection />
    <TeamSection />
  </main>
  <SiteFooter />
</template>
