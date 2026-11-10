/**
 * Sichtbarkeit von Elementen beobachten.
 *
 * `useSichtbar(el)` sagt laufend, ob das Element gerade im Bild ist (wird also
 * auch wieder `false`). Die Animationen nutzen das, um anzuhalten, sobald man
 * weiterscrollt — so läuft nichts im Hintergrund weiter.
 */
import { onBeforeUnmount, onMounted, ref, type Ref } from "vue";

export function useSichtbar(
  element: Ref<HTMLElement | null>,
  schwelle = 0.25,
): Ref<boolean> {
  const sichtbar = ref(false);
  let beobachter: IntersectionObserver | null = null;

  onMounted(() => {
    // Sehr alte Browser kennen den Beobachter nicht: dann einfach anzeigen.
    if (typeof IntersectionObserver === "undefined" || element.value === null) {
      sichtbar.value = true;
      return;
    }
    beobachter = new IntersectionObserver(
      (eintraege) => {
        sichtbar.value = eintraege.some((e) => e.isIntersecting);
      },
      { threshold: schwelle },
    );
    beobachter.observe(element.value);
  });

  onBeforeUnmount(() => beobachter?.disconnect());

  return sichtbar;
}

/** Hat der Besucher in seinem Betriebssystem Bewegung abgeschaltet? */
export function wenigerBewegung(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}
