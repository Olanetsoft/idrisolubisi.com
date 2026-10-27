"use client";

import { useEffect, useRef, useState } from "react";

/**
 * The button under More builds: the list shows its first cards and this
 * reveals the rest (the extra cards carry data-extra, see globals.css). All
 * cards stay in the HTML, so search, print and no-script visitors get every
 * one. A link straight to a hidden card (/#audioboost) opens the list first.
 */
export function MoreToggle({ listId, hidden }: { listId: string; hidden: number }) {
  const [open, setOpen] = useState(false);
  const button = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const list = document.getElementById(listId);
    list?.toggleAttribute("data-open", open);
  }, [listId, open]);

  useEffect(() => {
    const openForHash = () => {
      const id = decodeURIComponent(window.location.hash.slice(1));
      const target = id ? document.getElementById(id) : null;
      if (target?.matches(`#${CSS.escape(listId)} > [data-extra]`)) {
        document.getElementById(listId)?.toggleAttribute("data-open", true);
        setOpen(true);
        requestAnimationFrame(() => target.scrollIntoView());
      }
    };
    openForHash();
    window.addEventListener("hashchange", openForHash);
    return () => window.removeEventListener("hashchange", openForHash);
  }, [listId]);

  return (
    <button
      ref={button}
      type="button"
      className="btn more-toggle"
      aria-expanded={open}
      aria-controls={listId}
      onClick={() => {
        const next = !open;
        const list = document.getElementById(listId);
        list?.toggleAttribute("data-open", next);
        setOpen(next);
        if (next) {
          // The revealed cards come before this button, so Tab would skip them.
          list?.querySelector<HTMLElement>(":scope > [data-extra] a")?.focus();
        } else {
          // Closing from below would leave the button far down the page.
          requestAnimationFrame(() => button.current?.scrollIntoView({ block: "nearest" }));
        }
      }}
    >
      {open ? "Show fewer" : `Show ${hidden} more`}
    </button>
  );
}
