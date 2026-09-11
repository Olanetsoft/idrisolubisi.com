"use client";

import { useSyncExternalStore } from "react";

type Theme = "light" | "dark";

const THEME_COLOR: Record<Theme, string> = { light: "#f4f1ea", dark: "#121212" };
const listeners = new Set<() => void>();

function readTheme(): Theme {
  const explicit = document.documentElement.getAttribute("data-theme");
  if (explicit === "dark" || explicit === "light") return explicit;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  const mq = window.matchMedia("(prefers-color-scheme: dark)");
  mq.addEventListener("change", onChange);
  return () => {
    listeners.delete(onChange);
    mq.removeEventListener("change", onChange);
  };
}

function setTheme(next: Theme) {
  document.documentElement.setAttribute("data-theme", next);
  try {
    localStorage.setItem("theme", next);
  } catch {}
  // The media-scoped theme-color tags no longer match the explicit choice.
  document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]').forEach((m) => {
    m.removeAttribute("media");
    m.content = THEME_COLOR[next];
  });
  listeners.forEach((l) => l());
}

export function ThemeToggle() {
  // null on the server and during hydration; resolved on the client afterwards.
  const theme = useSyncExternalStore(subscribe, readTheme, () => null);
  const label =
    theme === null ? "Toggle theme" : theme === "dark" ? "Switch to light theme" : "Switch to dark theme";

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={() => setTheme(readTheme() === "dark" ? "light" : "dark")}
      aria-label={label}
      title={label}
    >
      {/* Both icons are in the DOM; CSS shows the right one, so nothing flips after hydration. */}
      <svg className="icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
      </svg>
      <svg className="icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
      </svg>
    </button>
  );
}
