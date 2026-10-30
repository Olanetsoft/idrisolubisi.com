"use client";

import { useEffect, useRef } from "react";

/**
 * The faint grid behind the hero. On load, one ring of lit grid lines goes
 * out from the live dot (CSS, see .hero-pulse). On a desktop with a mouse, the
 * pointer leaves an amber wake along the grid lines and bends them slightly
 * (WebGL, src/lib/grid-wake.ts, loaded once the page is idle); until then, or
 * without WebGL, a soft light follows the pointer instead. Pointing at the
 * status line sends the ring again. Touch screens and reduced-motion users get
 * the still grid after the first ring, or none.
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
    let stopWake: (() => void) | null = null;
    let cancelled = false;
    const startWake = () =>
      import("@/lib/grid-wake").then(({ startGridWake }) => {
        if (cancelled) return;
        stopWake = startGridWake(el, hero);
        if (stopWake) el.dataset.wake = "on";
      });
    const idle = window.requestIdleCallback?.(startWake, { timeout: 2000 });
    const timer = idle === undefined ? window.setTimeout(startWake, 1200) : undefined;

    const move = (event: PointerEvent) => {
      if (stopWake) return;
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
    // Pointing at the status line sends the ring again, at most once per run.
    const ring = el.querySelector<HTMLElement>(".hero-pulse-ring");
    const status = hero.querySelector(".status-label");
    let last = -Infinity;
    const pulse = () => {
      const now = performance.now();
      if (!ring || now - last < 2400) return;
      last = now;
      ring.animate(
        [
          { transform: "scale(0.02)", opacity: 1 },
          { opacity: 0.7, offset: 0.7 },
          { transform: "none", opacity: 0 },
        ],
        { duration: 2400, easing: "cubic-bezier(0.3, 0.6, 0.3, 1)" },
      );
    };
    hero.addEventListener("pointermove", move);
    hero.addEventListener("pointerleave", leave);
    status?.addEventListener("pointerenter", pulse);
    return () => {
      cancelled = true;
      if (idle !== undefined) window.cancelIdleCallback(idle);
      window.clearTimeout(timer);
      stopWake?.();
      cancelAnimationFrame(frame);
      hero.removeEventListener("pointermove", move);
      hero.removeEventListener("pointerleave", leave);
      status?.removeEventListener("pointerenter", pulse);
    };
  }, []);

  return (
    <div ref={ref} className="hero-bg" aria-hidden="true">
      <div className="hero-pulse">
        <span className="hero-pulse-ring" />
      </div>
    </div>
  );
}
