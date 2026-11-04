"use client";

import { useEffect, useRef } from "react";

/**
 * Keeps the hero portrait loose while the viewport is under 760px: the wheel
 * (src/lib/portrait-roll.ts) loads once the page is idle, and a rotation past
 * that width stops it or starts it again. Returns a function that stops it.
 */
function loosenPortrait(hero: HTMLElement) {
  const phone = window.matchMedia("(max-width: 759px)");
  let stop: (() => void) | undefined;
  const sync = () => {
    stop?.();
    stop = undefined;
    if (!phone.matches) return;
    let stopRoll: (() => void) | undefined;
    let cancelled = false;
    const startRoll = () =>
      import("@/lib/portrait-roll")
        .then(({ startPortraitRoll }) => {
          if (!cancelled) stopRoll = startPortraitRoll(hero);
        })
        .catch(() => {});
    const idle = window.requestIdleCallback?.(startRoll, { timeout: 2000 });
    const timer = idle === undefined ? window.setTimeout(startRoll, 1200) : undefined;
    stop = () => {
      cancelled = true;
      if (idle !== undefined) window.cancelIdleCallback(idle);
      window.clearTimeout(timer);
      stopRoll?.();
    };
  };
  sync();
  phone.addEventListener("change", sync);
  return () => {
    phone.removeEventListener("change", sync);
    stop?.();
  };
}

/**
 * The faint grid behind the hero. On load, one ring of lit grid lines goes
 * out from the live dot (CSS, see .hero-pulse). On a desktop with a mouse, the
 * pointer leaves an amber wake along the grid lines and bends them slightly
 * (WebGL, src/lib/grid-wake.ts, loaded once the page is idle); until then, or
 * without WebGL, a soft light follows the pointer instead. Pointing at the
 * status line sends the ring again. Touch screens keep the grid still after the
 * first ring, except that on phones the loose portrait sends the ring from
 * where a hard thump lands. Reduced-motion users get the still grid, with no
 * ring and no loose portrait.
 */
export function HeroBackdrop() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    const hero = el?.closest<HTMLElement>(".hero");
    if (!el || !hero) return;
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const stopRoll = reduced ? undefined : loosenPortrait(hero);
    if (!finePointer || reduced) return stopRoll;

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
      stopRoll?.();
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
