"use client";

import { useEffect, useState } from "react";

/**
 * "3 / 9" beside the More builds label on phones, where the cards are a
 * swipe row. It follows the row's scroll position. Hidden on wider screens
 * by CSS, and from screen readers, which get the full list anyway.
 */
export function SwipeCount({ total }: { total: number }) {
  const [current, setCurrent] = useState(1);
  useEffect(() => {
    const row = document.querySelector<HTMLElement>(".more");
    const first = row?.querySelector<HTMLElement>(".ccard");
    if (!row || !first) return;
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const step =
          first.getBoundingClientRect().width + parseFloat(getComputedStyle(row).columnGap || "0");
        setCurrent(Math.min(total, Math.round(row.scrollLeft / step) + 1));
      });
    };
    row.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      row.removeEventListener("scroll", onScroll);
    };
  }, [total]);
  return (
    <span className="swipe-hint" aria-hidden="true">
      {" "}
      · {current} / {total}
    </span>
  );
}
