"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

const SECTIONS = [
  { id: "work", label: "Work" },
  { id: "talks", label: "Talks" },
  { id: "experience", label: "Experience" },
  { id: "writing", label: "Writing" },
  { id: "contact", label: "Contact" },
];

/** Section links: they scroll in place on the home page and lead home elsewhere. */
export function SiteNav() {
  const pathname = usePathname();
  const base = pathname === "/" ? "" : "/";
  return (
    <nav className="site-nav" aria-label="Sections">
      {SECTIONS.map((s) => (
        <a key={s.id} href={`${base}#${s.id}`}>
          {s.label}
        </a>
      ))}
    </nav>
  );
}

/** The name in the header: back to the top on the home page, home elsewhere. */
export function BrandLink({ name }: { name: string }) {
  const pathname = usePathname();
  const onHome = pathname === "/";
  return (
    <a className="brand" href={onHome ? "#about" : "/"}>
      {name}
    </a>
  );
}

/**
 * Phones: a "Menu" button that opens the same section links in a panel under
 * the header. It closes on a link, on Escape (returning focus to the button)
 * and on a tap outside.
 */
export function MobileMenu() {
  const pathname = usePathname();
  const base = pathname === "/" ? "" : "/";
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      buttonRef.current?.focus();
    };
    const onPointer = (event: PointerEvent) => {
      const target = event.target as Node;
      if (panelRef.current?.contains(target) || buttonRef.current?.contains(target)) return;
      setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [open]);

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        className="menu-button"
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpen((o) => !o)}
      >
        Menu
      </button>
      <nav
        ref={panelRef}
        id="mobile-menu"
        className="mobile-menu"
        aria-label="Sections"
        hidden={!open}
      >
        {SECTIONS.map((s) => (
          <a key={s.id} href={`${base}#${s.id}`} onClick={() => setOpen(false)}>
            {s.label}
          </a>
        ))}
      </nav>
    </>
  );
}
