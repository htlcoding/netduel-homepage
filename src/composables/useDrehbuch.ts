/**
 * Spielt ein "Drehbuch" in Endlosschleife ab — die Grundlage aller
 * Animationen auf der Seite (Lab im Hero, Konsole, Duell).
 *
 * Das Drehbuch ist eine async-Funktion. Darin ruft man `warte(ms)` auf, wo
 * eine Pause sein soll. Zwei Dinge erledigt `warte` von selbst:
 *  - Ist der Abschnitt nicht im Bild, hält es an, bis er wieder sichtbar ist.
 *  - Wird die Komponente entfernt, bricht es das Drehbuch ab.
 *
 * Wer Bewegung abgeschaltet hat, bekommt sofort den Endstand (`endstand()`).
 *
 * Beispiel:
 *   useDrehbuch(wurzel, {
 *     zuruecksetzen: () => (zahl.value = 0),
 *     endstand: () => (zahl.value = 3),
 *     async ablauf(warte) { for (let i = 1; i <= 3; i++) { await warte(500); zahl.value = i } },
 *   })
 */
import { onBeforeUnmount, watch, type Ref } from "vue";
import { useSichtbar, wenigerBewegung } from "./useSichtbar";

export type Warte = (ms: number) => Promise<void>;

interface Drehbuch {
  ablauf: (warte: Warte) => Promise<void>;
  zuruecksetzen: () => void;
  endstand: () => void;
  /** Pause nach dem Ende, bevor es von vorn beginnt. */
  pauseMs?: number;
  schwelle?: number;
}

class Abbruch extends Error {}

export function useDrehbuch(wurzel: Ref<HTMLElement | null>, d: Drehbuch) {
  const sichtbar = useSichtbar(wurzel, d.schwelle ?? 0.25);
  let beendet = false;
  let laeuft = false;
  let weiter: (() => void) | null = null;

  /** Wartet, bis der Abschnitt (wieder) im Bild ist. */
  function sichtbarkeit(): Promise<void> {
    if (sichtbar.value) return Promise.resolve();
    return new Promise((r) => (weiter = r));
  }

  const warte: Warte = async (ms) => {
    let rest = ms;
    // In kleinen Stücken warten, damit Wegscrollen sofort anhält.
    while (rest > 0) {
      if (beendet) throw new Abbruch();
      await sichtbarkeit();
      const stueck = Math.min(rest, 100);
      await new Promise((r) => setTimeout(r, stueck));
      rest -= stueck;
    }
    if (beendet) throw new Abbruch();
  };

  async function schleife(): Promise<void> {
    laeuft = true;
    try {
      for (;;) {
        d.zuruecksetzen();
        await d.ablauf(warte);
        await warte(d.pauseMs ?? 4000);
      }
    } catch (e) {
      if (!(e instanceof Abbruch)) throw e;
    }
  }

  watch(sichtbar, (jetzt) => {
    if (!jetzt) return;
    if (weiter) {
      weiter();
      weiter = null;
    }
    if (laeuft) return;
    if (wenigerBewegung()) {
      laeuft = true;
      d.endstand();
      return;
    }
    void schleife();
  });

  onBeforeUnmount(() => {
    beendet = true;
    weiter?.();
  });
}

/** Tippt `text` Zeichen für Zeichen; `setze` bekommt jeweils den Zwischenstand. */
export async function tippen(
  text: string,
  setze: (t: string) => void,
  warte: Warte,
  msProZeichen = 38,
): Promise<void> {
  for (let i = 1; i <= text.length; i++) {
    setze(text.slice(0, i));
    await warte(msProZeichen);
  }
}
