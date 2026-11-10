/**
 * Welcher Abschnitt ist gerade oben im Bild? Die Kopfzeile hebt den passenden
 * Navigationspunkt hervor.
 *
 * Beobachtet wird ein schmaler Streifen knapp unter der Kopfzeile: Der
 * Abschnitt, der diesen Streifen schneidet, gilt als aktiv.
 */
import { onBeforeUnmount, onMounted, ref } from "vue";

export function useAktiverAbschnitt(ids: string[]) {
  const aktiv = ref<string | null>(null);
  let beobachter: IntersectionObserver | null = null;

  onMounted(() => {
    if (typeof IntersectionObserver === "undefined") return;
    beobachter = new IntersectionObserver(
      (eintraege) => {
        for (const e of eintraege) {
          if (e.isIntersecting) aktiv.value = e.target.id;
          else if (aktiv.value === e.target.id) aktiv.value = null;
        }
      },
      { rootMargin: "-80px 0px -70% 0px" },
    );
    for (const id of ids) {
      const el = document.getElementById(id);
      if (el) beobachter.observe(el);
    }
  });

  onBeforeUnmount(() => beobachter?.disconnect());

  return aktiv;
}
