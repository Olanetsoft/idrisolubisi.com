"use client";

import { useEffect, useRef, useState } from "react";
import type { LogLine } from "@/data/hero";

/**
 * The activity log: short true facts, rolling one line at a time. It pauses
 * on hover, on keyboard focus, when the tab is hidden, when it is off screen
 * and through its own Pause button. With reduced motion the lines swap
 * without sliding. Screen readers get the whole list at once instead of the
 * rolling window.
 */
export function ActivityLog({ lines }: { lines: LogLine[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [onScreen, setOnScreen] = useState(true);
  const [tabVisible, setTabVisible] = useState(true);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting));
    io.observe(el);
    const onVisibility = () => setTabVisible(!document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  const running = !paused && !hovered && onScreen && tabVisible;
  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % lines.length), 3400);
    return () => window.clearInterval(id);
  }, [running, lines.length]);

  return (
    <div
      ref={ref}
      className="log"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
    >
      <span className="log-tag" aria-hidden="true">
        [ log ]
      </span>
      <div className="log-window" aria-hidden="true">
        {lines.map((line, i) => (
          <p
            key={`${line.tag}-${line.fact}`}
            className={
              i === index
                ? "log-line is-current"
                : i === (index - 1 + lines.length) % lines.length
                  ? "log-line is-leaving"
                  : "log-line"
            }
          >
            <span className="log-line-tag">{line.tag}</span>
            <span className="log-line-fact">{line.fact}</span>
          </p>
        ))}
      </div>
      <ul className="sr-only" aria-label="Activity log">
        {lines.map((line) => (
          <li key={`${line.tag}-${line.fact}`}>
            {line.tag}: {line.fact}
          </li>
        ))}
      </ul>
      <button
        type="button"
        className="log-toggle"
        aria-label={paused ? "Play activity log" : "Pause activity log"}
        onClick={() => setPaused((p) => !p)}
      >
        {paused ? "Play" : "Pause"}
      </button>
    </div>
  );
}
