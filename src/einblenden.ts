/**
 * `v-einblenden`: lässt ein Element sanft erscheinen, sobald man zu ihm
 * scrollt. Benutzung: <div v-einblenden>…</div>
 *
 * Das Element bekommt zuerst das Attribut `data-einblenden` (unsichtbar, leicht
 * nach unten verschoben) und danach die Klasse `ein` (sichtbar). Das Aussehen
 * dazu steht in style.css.
 */
import type { Directive } from "vue";

export const vEinblenden: Directive<HTMLElement, number | undefined> = {
  mounted(el, binding) {
    // Ohne Beobachter oder bei abgeschalteter Bewegung gleich normal zeigen.
    if (typeof IntersectionObserver === "undefined") return;

    el.setAttribute("data-einblenden", "");
    if (binding.value) el.style.transitionDelay = `${binding.value}ms`;

    const beobachter = new IntersectionObserver(
      (eintraege) => {
        if (eintraege.some((e) => e.isIntersecting)) {
          el.classList.add("ein");
          beobachter.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    beobachter.observe(el);
  },
};
