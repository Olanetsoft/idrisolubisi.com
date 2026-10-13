"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { lenses, lensOrder, type LensKey } from "@/data/lenses";
import { useLens } from "./LensProvider";
import { RichText } from "./RichText";

/**
 * Every lens variant is rendered and stacked in one grid cell, so the cell is
 * as tall as the tallest variant and switching never moves what follows.
 * Hidden variants use visibility: hidden, which also takes them out of the
 * accessibility tree and the tab order.
 */
function Stack({
  className,
  render,
}: {
  className: string;
  render: (key: LensKey) => React.ReactNode;
}) {
  const { lens } = useLens();
  return (
    <div className={`lens-stack ${className}`}>
      {lensOrder.map((key) => (
        <div
          key={key}
          className={key === lens ? "lens-variant is-active" : "lens-variant"}
          data-lens={key}
        >
          {render(key)}
        </div>
      ))}
    </div>
  );
}

export function LensTitle() {
  return (
    <Stack
      className="lens-title"
      render={(key) => {
        const [role, focus] = lenses[key].title.split(" · ");
        return (
          <p className="headline">
            {role}
            {focus && (
              <>
                <span className="headline-sep"> · </span>
                <span className="headline-sub">{focus}</span>
              </>
            )}
          </p>
        );
      }}
    />
  );
}

export function LensBio() {
  return (
    <Stack
      className="lens-pitch"
      render={(key) => (
        <p className="pitch">
          <RichText text={lenses[key].pitch} />
        </p>
      )}
    />
  );
}

export function LensMetrics() {
  return (
    <Stack
      className="lens-metrics"
      render={(key) => (
        <dl className="metrics">
          {lenses[key].metrics.map((m, i) => (
            <div className="metric" key={m.caption} style={{ "--i": i } as React.CSSProperties}>
              <dt className="metric-source">{m.source}</dt>
              <dd className="metric-value">
                {m.href ? (
                  <a href={m.href}>
                    {m.value}
                    <span className="sr-only"> {m.caption}</span>
                  </a>
                ) : (
                  m.value
                )}
              </dd>
              <dd className="metric-caption">{m.caption}</dd>
            </div>
          ))}
        </dl>
      )}
    />
  );
}

/** "Hiring for" segmented control: a radio group with roving focus. */
export function LensSwitch() {
  const { lens, setLens } = useLens();
  const refs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [announce, setAnnounce] = useState("");

  const choose = (key: LensKey, focus = false) => {
    if (key !== lens) setAnnounce(`Showing the ${lenses[key].label} view.`);
    setLens(key);
    if (focus) refs.current[key]?.focus();
  };

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, current: LensKey) => {
    // Leave Alt/Cmd/Ctrl + arrow to the browser (Back, Forward, word jumps).
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    const i = lensOrder.indexOf(current);
    const last = lensOrder.length - 1;
    const target: Record<string, LensKey | undefined> = {
      ArrowRight: lensOrder[i === last ? 0 : i + 1],
      ArrowDown: lensOrder[i === last ? 0 : i + 1],
      ArrowLeft: lensOrder[i === 0 ? last : i - 1],
      ArrowUp: lensOrder[i === 0 ? last : i - 1],
      Home: lensOrder[0],
      End: lensOrder[last],
    };
    const next = target[event.key];
    if (!next) return;
    event.preventDefault();
    choose(next, true);
  };

  return (
    <div className="lens">
      <span className="lens-label" id="lens-label">
        Hiring for
      </span>
      <div className="seg" role="radiogroup" aria-labelledby="lens-label">
        {lensOrder.map((key) => {
          const selected = key === lens;
          return (
            <button
              key={key}
              ref={(el) => {
                refs.current[key] = el;
              }}
              type="button"
              role="radio"
              aria-checked={selected}
              tabIndex={selected ? 0 : -1}
              className="seg-option"
              onClick={() => choose(key)}
              onKeyDown={(event) => onKeyDown(event, key)}
            >
              {lenses[key].label}
            </button>
          );
        })}
      </div>
      <span className="sr-only" aria-live="polite">
        {announce}
      </span>
    </div>
  );
}

/**
 * The activity log: true facts for the current lens, rolling one line at a
 * time. It pauses on hover, on keyboard focus, when the tab is hidden, when it
 * is off screen and through its own Pause button. With reduced motion the
 * lines swap without sliding. Screen readers get the whole list at once
 * instead of the rolling window.
 */
export function LensLog() {
  const { lens } = useLens();
  const lines = lenses[lens].log;
  // The position belongs to a lens, so switching lens starts from its first line.
  const [pos, setPos] = useState({ lens, i: 0 });
  const index = pos.lens === lens ? pos.i : 0;
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
    const id = window.setInterval(
      () =>
        setPos((p) => ({
          lens,
          i: ((p.lens === lens ? p.i : 0) + 1) % lines.length,
        })),
      3400,
    );
    return () => window.clearInterval(id);
  }, [running, lens, lines.length]);

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
            key={`${lens}-${i}`}
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
