"use client";

import { useSyncExternalStore } from "react";
import { THEME_COLOR, type Theme } from "@/lib/theme";

const listeners = new Set<() => void>();

// Dark is the default; light is an explicit choice.
function readTheme(): Theme {
  return document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";
}

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  return () => {
    listeners.delete(onChange);
  };
}

function setTheme(next: Theme) {
  document.documentElement.setAttribute("data-theme", next);
  try {
    localStorage.setItem("theme", next);
  } catch {}
  document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]').forEach((m) => {
    m.content = THEME_COLOR[next];
  });
  listeners.forEach((l) => l());
}

/**
 * Switch theme. Where the browser supports view transitions, the new theme
 * spreads out in a circle from the button; otherwise, and for reduced-motion
 * users, it switches at once.
 */
function toggleTheme(button: HTMLElement) {
  const next: Theme = readTheme() === "dark" ? "light" : "dark";
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!document.startViewTransition || reduced) {
    setTheme(next);
    return;
  }
  const box = button.getBoundingClientRect();
  const x = box.left + box.width / 2;
  const y = box.top + box.height / 2;
  const radius = Math.hypot(
    Math.max(x, window.innerWidth - x),
    Math.max(y, window.innerHeight - y),
  );
  const transition = document.startViewTransition(() => setTheme(next));
  transition.ready
    .then(() => {
      document.documentElement.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
        {
          duration: 520,
          easing: "cubic-bezier(0.2, 0.8, 0.2, 1)",
          pseudoElement: "::view-transition-new(root)",
        },
      );
    })
    .catch(() => {});
}

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, readTheme, () => null);
  const label =
    theme === null
      ? "Toggle theme"
      : theme === "dark"
        ? "Switch to light theme"
        : "Switch to dark theme";

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={(event) => toggleTheme(event.currentTarget)}
      aria-label={label}
      title={label}
    >
      <svg
        className="icon-sun"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
      </svg>
      <svg
        className="icon-moon"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        aria-hidden="true"
      >
        <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
      </svg>
    </button>
  );
}
