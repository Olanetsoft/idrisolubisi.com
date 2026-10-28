"use client";

import { useEffect, useRef, useState } from "react";

/**
 * The button under More builds and the talk videos: the list shows its first
 * row and this reveals the rest (the extra items carry data-extra, see
 * globals.css). Every item stays in the HTML, so search, print and no-script
 * visitors get all of them. A link straight to a hidden item (/#audioboost)
 * opens the list first.
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
