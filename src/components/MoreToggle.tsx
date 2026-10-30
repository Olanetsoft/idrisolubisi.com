"use client";

import { useEffect, useRef, useState } from "react";

/**
 * The button under More builds, the talk videos and On stage: each list shows
 * its first items and this reveals the rest (the extra items carry data-extra,
 * see globals.css). Every item stays in the HTML, so search, print and
 * no-script visitors get all of them. A link straight to a hidden More builds
 * card (/#audioboost) opens the list first; videos and events have no ids.
 * The label has no count, since phones and desktops start with different
 * numbers shown. `noun` names the list for screen readers: "Show all builds".
 */
export function MoreToggle({ listId, noun }: { listId: string; noun: string }) {
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
        // The first item the list was hiding; on phones that can come before
        // the first data-extra one, since phones start shorter.
        const firstHidden = next
          ? [...(list?.children ?? [])].find((item) => item.getClientRects().length === 0)
          : undefined;
        list?.toggleAttribute("data-open", next);
        setOpen(next);
        if (next) {
          // The revealed items come before this button, so Tab would skip them.
          firstHidden?.querySelector<HTMLElement>("a")?.focus();
        } else {
          // Closing from below would leave the button far down the page.
          requestAnimationFrame(() => button.current?.scrollIntoView({ block: "nearest" }));
        }
      }}
    >
      {open ? "Show fewer" : "Show all"}
      <span className="sr-only"> {noun}</span>
    </button>
  );
}
