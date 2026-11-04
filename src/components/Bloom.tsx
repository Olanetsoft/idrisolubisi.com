"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

const PETALS = 5;

/**
 * A small line-drawn flower that signs off the page. It stays a bud until the
 * footer scrolls into view, then opens petal by petal. Hovering makes it
 * sway, and each tap turns it by one petal. Pulling it upward grows it out on
 * a springy stem that whips back when let go (src/lib/sprung-flower.ts, loaded
 * once the flower is in view; reduced-motion users keep the plain tap).
 * Decorative only, so it is hidden from assistive technology.
 */
export function Bloom() {
  const ref = useRef<HTMLSpanElement>(null);
  const [open, setOpen] = useState(false);
  const [sprung, setSprung] = useState(false);
  const [turn, setTurn] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let stop: (() => void) | undefined;
    let cancelled = false;
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        setOpen(true);
        io.disconnect();
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        import("@/lib/sprung-flower")
          .then(({ startSprungFlower }) => {
            if (cancelled) return;
            stop = startSprungFlower(el, () => setTurn((t) => t + 1));
            setSprung(true);
          })
          .catch(() => {}); // without the pull it is still a flower that turns
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => {
      cancelled = true;
      io.disconnect();
      stop?.();
    };
  }, []);

  return (
    <span
      ref={ref}
      className={`bloom${open ? " is-open" : ""}${sprung ? " is-sprung" : ""}`}
      style={{ "--turn": turn } as CSSProperties}
      onClick={() => {
        setOpen(true);
        setTurn((t) => t + 1);
      }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 24 24" width="18" height="18" focusable="false">
        <g className="bloom-flower">
          {Array.from({ length: PETALS }, (_, i) => (
            <g key={i} transform={`rotate(${(360 / PETALS) * i} 12 12)`}>
              <ellipse
                className="bloom-petal"
                style={{ "--i": i } as CSSProperties}
                cx="12"
                cy="6.6"
                rx="3.1"
                ry="5"
              />
            </g>
          ))}
          <circle className="bloom-center" cx="12" cy="12" r="1.9" />
        </g>
      </svg>
    </span>
  );
}
