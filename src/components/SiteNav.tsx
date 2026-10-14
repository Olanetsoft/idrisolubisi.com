"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type RefObject,
} from "react";
import { usePathname } from "next/navigation";
import { site } from "@/data/site";

const SECTIONS = [
  { id: "work", label: "Projects" },
  { id: "talks", label: "Talks" },
  { id: "experience", label: "Experience" },
  { id: "writing", label: "Writing" },
  { id: "recognition", label: "Recognition" },
  { id: "contact", label: "Contact" },
];

/**
 * The section being read: the one crossing the middle of the screen. Only on
 * the home page, where the sections exist.
 */
function useActiveSection(enabled: boolean): string | null {
  const [active, setActive] = useState<string | null>(null);
  useEffect(() => {
    if (!enabled) return;
    // Every section is watched, so one without a nav item (the hero)
    // clears the mark instead of leaving the previous item underlined.
    const navIds = new Set(SECTIONS.map((s) => s.id));
    const sections = Array.from(document.querySelectorAll<HTMLElement>("main section[id]"));
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries)
          if (entry.isIntersecting) setActive(navIds.has(entry.target.id) ? entry.target.id : null);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((el) => io.observe(el));
    const top = () => {
      if (window.scrollY < 200) setActive(null);
    };
    window.addEventListener("scroll", top, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", top);
    };
  }, [enabled]);
  return active;
}

/**
 * Section links: they scroll in place on the home page and lead home
 * elsewhere. The section being read is marked, so the header doubles as a
 * "you are here".
 */
export function SiteNav() {
  const pathname = usePathname();
  const onHome = pathname === "/";
  const base = onHome ? "" : "/";
  const active = useActiveSection(onHome);
  const navRef = useRef<HTMLElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  useGlideIndicator(active, navRef, barRef);
  return (
    <nav className="site-nav" aria-label="Sections" ref={navRef} data-glide="">
      {SECTIONS.map((s) => (
        <a
          key={s.id}
          href={`${base}#${s.id}`}
          aria-current={active === s.id ? "location" : undefined}
        >
          {s.label}
        </a>
      ))}
      <a href={site.links.blog}>Blog</a>
      <span className="nav-indicator" aria-hidden="true" ref={barRef} />
    </nav>
  );
}

/**
 * One underline that glides from section to section as the reader scrolls,
 * instead of jumping. It appears in place (no slide in from the left) when a
 * section first becomes current, and follows the link if the layout changes.
 */
function useGlideIndicator(
  active: string | null,
  navRef: RefObject<HTMLElement | null>,
  barRef: RefObject<HTMLSpanElement | null>,
) {
  const shown = useRef(false);
  useLayoutEffect(() => {
    const nav = navRef.current;
    const bar = barRef.current;
    if (!nav || !bar) return;
    const place = (animate: boolean) => {
      const link = nav.querySelector<HTMLElement>("a[aria-current]");
      if (!link) {
        bar.dataset.on = "false";
        shown.current = false;
        return;
      }
      if (!animate || !shown.current) bar.dataset.snap = "";
      bar.style.setProperty("--ind-x", `${link.offsetLeft}px`);
      bar.style.setProperty("--ind-w", `${link.offsetWidth}px`);
      bar.dataset.on = "true";
      shown.current = true;
      requestAnimationFrame(() => delete bar.dataset.snap);
    };
    place(true);
    const ro = new ResizeObserver(() => place(false));
    ro.observe(nav);
    return () => ro.disconnect();
  }, [active, navRef, barRef]);
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
  const onHome = pathname === "/";
  const base = onHome ? "" : "/";
  const active = useActiveSection(onHome);
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const scrimRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      buttonRef.current?.focus();
    };
    const onPointer = (event: PointerEvent) => {
      const target = event.target as Node;
      // A tap on the scrim closes through its own click, so it never reaches a link underneath.
      if (
        panelRef.current?.contains(target) ||
        buttonRef.current?.contains(target) ||
        scrimRef.current?.contains(target)
      )
        return;
      setOpen(false);
    };
    // Tabbing out of the panel closes it, so focus never sits under the scrim.
    const onFocus = (event: FocusEvent) => {
      const target = event.target as Node;
      if (panelRef.current?.contains(target) || buttonRef.current?.contains(target)) return;
      setOpen(false);
    };
    // A phone rotated to landscape crosses into the desktop nav: close the menu.
    const wide = window.matchMedia("(min-width: 760px)");
    const onWide = () => wide.matches && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("focusin", onFocus);
    wide.addEventListener("change", onWide);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("focusin", onFocus);
      wide.removeEventListener("change", onWide);
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
        {open ? "Close" : "Menu"}
      </button>
      <div
        ref={scrimRef}
        className="menu-scrim"
        aria-hidden="true"
        hidden={!open}
        onClick={() => setOpen(false)}
      />
      <nav
        ref={panelRef}
        id="mobile-menu"
        className="mobile-menu"
        aria-label="Sections"
        hidden={!open}
      >
        {SECTIONS.map((s, i) => (
          <a
            key={s.id}
            href={`${base}#${s.id}`}
            aria-current={active === s.id ? "location" : undefined}
            onClick={() => setOpen(false)}
            style={{ "--i": i } as CSSProperties}
          >
            {s.label}
          </a>
        ))}
        <a
          href={site.links.blog}
          onClick={() => setOpen(false)}
          style={{ "--i": SECTIONS.length } as CSSProperties}
        >
          Blog
        </a>
      </nav>
    </>
  );
}
