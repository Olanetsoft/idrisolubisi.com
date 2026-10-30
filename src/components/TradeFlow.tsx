"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { flowNodes, flowScenarios, type FlowNode } from "@/data/swoopagent";

/** How long each step stays lit before the next one. */
const STEP_MS = 1100;

/**
 * SwoopAgent's trade path as a small diagram you can play: pick a case and
 * the parts of the system light up in order while the steps are written out
 * below. It plays the first case once when it scrolls into view. Before any
 * script runs (and with reduced motion, and on phones), each case shows all its steps at
 * once; without script the first case is shown and the buttons are hidden.
 */
export function TradeFlow() {
  const [scenario, setScenario] = useState(0);
  const [shown, setShown] = useState(flowScenarios[0].steps.length);
  const root = useRef<HTMLElement>(null);
  const timer = useRef(0);
  const reduced = useRef(false);
  // What a screen reader hears: only after a press, never for the autoplay.
  const [said, setSaid] = useState("");

  const play = useCallback((index: number, pressed = false) => {
    window.clearTimeout(timer.current);
    const steps = flowScenarios[index].steps;
    // Each new step is said as it appears.
    const say = (count: number) => {
      if (pressed) setSaid(steps[count - 1].text);
    };
    setScenario(index);
    if (reduced.current) {
      setShown(steps.length);
      if (pressed) setSaid(steps.map((s) => s.text).join(" "));
      return;
    }
    let count = 1;
    setShown(count);
    say(count);
    const next = () => {
      count += 1;
      setShown(count);
      say(count);
      if (count < steps.length) timer.current = window.setTimeout(next, STEP_MS);
    };
    timer.current = window.setTimeout(next, STEP_MS);
  }, []);

  useEffect(() => {
    // Phones show each case whole: playing it step by step would light boxes
    // above the fold while the steps appear below it.
    reduced.current = window.matchMedia(
      "(prefers-reduced-motion: reduce), (max-width: 759px)",
    ).matches;
    const el = root.current;
    if (!el || reduced.current) return;
    const seen = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        seen.disconnect();
        play(0);
      },
      { threshold: 0.6 },
    );
    seen.observe(el);
    return () => {
      seen.disconnect();
      window.clearTimeout(timer.current);
    };
  }, [play]);

  const steps = flowScenarios[scenario].steps.slice(0, shown);
  const current = steps[steps.length - 1];
  const visited = new Set(steps.map((s) => s.node));
  const stateOf = (node: FlowNode) => {
    if (current?.node === node) return current.tone === "block" ? "blocked" : "active";
    return visited.has(node) ? "visited" : undefined;
  };

  return (
    <figure ref={root} className="flow" aria-labelledby="flow-caption">
      <div className="flow-controls" role="group" aria-label="Cases">
        {flowScenarios.map((s, i) => (
          <button
            key={s.id}
            type="button"
            className="flow-button"
            aria-pressed={i === scenario}
            onClick={() => play(i, true)}
          >
            {s.label}
          </button>
        ))}
      </div>
      <ol className="flow-nodes" aria-label="Parts of the system">
        {flowNodes.map((n) => (
          <li key={n.id} className="flow-node" data-node={n.id} data-state={stateOf(n.id)}>
            <span className="flow-kicker">{n.kicker}</span>
            <span className="flow-name">{n.name}</span>
          </li>
        ))}
      </ol>
      <ol className="flow-trace">
        {steps.map((s, i) => (
          <li key={`${scenario}-${i}`} data-tone={s.tone}>
            <span className="flow-num" aria-hidden="true">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span>{s.text}</span>
          </li>
        ))}
      </ol>
      <p className="sr-only" aria-live="polite">
        {said}
      </p>
      <figcaption id="flow-caption" className="flow-caption">
        How a trade moved through SwoopAgent. Pick a case to see each step.
      </figcaption>
    </figure>
  );
}
