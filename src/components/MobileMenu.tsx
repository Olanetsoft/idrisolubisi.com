"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { site } from "@/data/site";

const profiles = [
  { label: "LinkedIn", href: site.links.linkedin },
  { label: "GitHub", href: site.links.github },
  { label: "X", href: site.links.x },
  { label: "Blog", href: site.links.blog },
  { label: "CV", href: site.resumeUrl },
];

/** Section menu for screens without the sidebar. */
export function MobileMenu() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="mobile-menu">
      <button
        type="button"
        className="menu-btn"
        aria-expanded={open}
        aria-controls="mobile-nav"
        onClick={() => setOpen((o) => !o)}
      >
        {open ? "Close" : "Menu"}
      </button>
      <nav id="mobile-nav" className="mobile-nav" hidden={!open} aria-label="Sections">
        {site.nav.map((item) => (
          <Link key={item.href} href={item.href} onClick={() => setOpen(false)}>
            {item.label}
          </Link>
        ))}
        <div className="mobile-nav-profiles">
          {profiles.map((p) => (
            <a key={p.href} href={p.href} rel="me">
              {p.label}
            </a>
          ))}
        </div>
      </nav>
    </div>
  );
}
