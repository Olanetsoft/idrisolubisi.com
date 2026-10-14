"use client";

import { useEffect, useRef } from "react";

/**
 * The faint grid behind the hero. On a desktop with a mouse, a soft light
 * follows the pointer across the grid lines and fades when it leaves. Touch
 * screens and reduced-motion users get the still grid.
 */
export function HeroBackdrop() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    const hero = el?.closest<HTMLElement>(".hero");
    if (!el || !hero) return;
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!finePointer || reduced) return;

    let frame = 0;
    const move = (event: PointerEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const box = el.getBoundingClientRect();
        el.style.setProperty("--mx", `${event.clientX - box.left}px`);
        el.style.setProperty("--my", `${event.clientY - box.top}px`);
        el.dataset.glow = "on";
      });
    };
    const leave = () => {
      cancelAnimationFrame(frame);
      el.dataset.glow = "off";
    };
    hero.addEventListener("pointermove", move);
    hero.addEventListener("pointerleave", leave);
    return () => {
      cancelAnimationFrame(frame);
      hero.removeEventListener("pointermove", move);
      hero.removeEventListener("pointerleave", leave);
    };
  }, []);

  return <div ref={ref} className="hero-bg" aria-hidden="true" />;
}
