"use client";

import { useEffect } from "react";

/**
 * Pointing at a stack chip (say, Docker) lights that chip on every project
 * that uses it and steps the other projects back, so "where else did he use
 * this?" answers itself. Pointer devices only; it renders nothing.
 */
export function ChipMatch() {
  useEffect(() => {
    const section = document.getElementById("work");
    if (!section || !window.matchMedia("(hover: hover)").matches) return;
    const cards = () => section.querySelectorAll<HTMLElement>(".pcard, .ccard:not(.more-tail)");
    const clear = () => {
      delete section.dataset.chip;
      section
        .querySelectorAll("[data-chip-match]")
        .forEach((el) => el.removeAttribute("data-chip-match"));
    };
    const onOver = (event: PointerEvent) => {
      const chip = (event.target as Element).closest<HTMLElement>(".chip[data-chip]");
      if (!chip) return;
      const name = chip.dataset.chip!;
      if (section.dataset.chip === name) return;
      clear();
      section.dataset.chip = name;
      section
        .querySelectorAll<HTMLElement>(`.chip[data-chip="${CSS.escape(name)}"]`)
        .forEach((el) => el.setAttribute("data-chip-match", ""));
      cards().forEach((card) => {
        if (card.querySelector(`.chip[data-chip="${CSS.escape(name)}"]`))
          card.setAttribute("data-chip-match", "");
      });
    };
    const onOut = (event: PointerEvent) => {
      const to = event.relatedTarget as Element | null;
      if (!to?.closest(".chip[data-chip]")) clear();
    };
    section.addEventListener("pointerover", onOver);
    section.addEventListener("pointerout", onOut);
    return () => {
      section.removeEventListener("pointerover", onOver);
      section.removeEventListener("pointerout", onOut);
      clear();
    };
  }, []);
  return null;
}
