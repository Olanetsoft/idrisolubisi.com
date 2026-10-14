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
    // Tabbing to a card that is mostly off screen brings it fully into view.
    const onFocus = (event: FocusEvent) => {
      (event.target as Element)
        .closest<HTMLElement>(".ccard")
        ?.scrollIntoView({ inline: "start", block: "nearest" });
    };
    row.addEventListener("scroll", onScroll, { passive: true });
    row.addEventListener("focusin", onFocus);
    return () => {
      cancelAnimationFrame(frame);
      row.removeEventListener("scroll", onScroll);
      row.removeEventListener("focusin", onFocus);
    };
  }, [total]);
  return (
    <span className="swipe-hint" aria-hidden="true">
      {" "}
      · {current} / {total}
    </span>
  );
}
