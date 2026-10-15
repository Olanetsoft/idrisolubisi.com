"use client";

import { useEffect } from "react";

const MAX_TILT = 5; // degrees

/**
 * Cards marked "spot" catch a soft light where the pointer is, and cards
 * marked "tilt" lean a few degrees toward it and lift forward, so they feel
 * like objects rather than frames. One listener for the whole page; it only
 * sets CSS variables on the card under the pointer and resets the last one.
 * Off for touch screens and reduced-motion users.
 */
export function Spotlight() {
  useEffect(() => {
    // iOS Safari only shows the tap state (:active) when a touch listener exists.
    const noop = () => {};
    document.addEventListener("touchstart", noop, { passive: true });
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!finePointer || reduced) return () => document.removeEventListener("touchstart", noop);

    let frame = 0;
    let current: HTMLElement | null = null;
    const reset = (el: HTMLElement | null) => {
      if (!el) return;
      el.style.removeProperty("--rx");
      el.style.removeProperty("--ry");
    };
    const move = (event: PointerEvent) => {
      const target = event.target as Element | null;
      const card = target?.closest<HTMLElement>(".spot, .tilt") ?? null;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (card !== current) {
          reset(current);
          current = card;
        }
        if (!card) return;
        const box = card.getBoundingClientRect();
        const x = event.clientX - box.left;
        const y = event.clientY - box.top;
        card.style.setProperty("--mx", `${x}px`);
        card.style.setProperty("--my", `${y}px`);
        if (card.classList.contains("tilt")) {
          card.style.setProperty("--rx", `${((0.5 - y / box.height) * MAX_TILT).toFixed(2)}deg`);
          card.style.setProperty("--ry", `${((x / box.width - 0.5) * MAX_TILT).toFixed(2)}deg`);
        }
      });
    };
    const leave = () => {
      cancelAnimationFrame(frame);
      reset(current);
      current = null;
    };
    document.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("touchstart", noop);
      document.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", leave);
    };
  }, []);
  return null;
}
