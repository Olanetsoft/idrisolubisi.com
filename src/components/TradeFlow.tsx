"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { flowNodes, flowScenarios, type FlowNode } from "@/data/swoopagent";

/** How long each step stays lit before the next one. */
const STEP_MS = 1100;

/**
 * SwoopAgent's trade path as a small diagram you can play: pick a case and
 * the parts of the system light up in order while the steps are written out
 * below. It plays the first case once when it scrolls into view. Before any
 * script runs (and with reduced motion), each case shows all its steps at
 * once; without script the first case is shown and the buttons are hidden.
 */
export function TradeFlow() {
  const [scenario, setScenario] = useState(0);
  const [shown, setShown] = useState(flowScenarios[0].steps.length);
  const root = useRef<HTMLElement>(null);
  const timer = useRef(0);
  const reduced = useRef(false);

  const play = useCallback((index: number) => {
    window.clearTimeout(timer.current);
    const total = flowScenarios[index].steps.length;
    setScenario(index);
    if (reduced.current) {
      setShown(total);
      return;
    }
    let count = 1;
    setShown(count);
    const next = () => {
      count += 1;
      setShown(count);
      if (count < total) timer.current = window.setTimeout(next, STEP_MS);
    };
    timer.current = window.setTimeout(next, STEP_MS);
  }, []);

  useEffect(() => {
    reduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
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
            onClick={() => play(i)}
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
      <ol className="flow-trace" aria-live="polite">
        {steps.map((s, i) => (
          <li key={`${scenario}-${i}`} data-tone={s.tone}>
            <span className="flow-num" aria-hidden="true">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span>{s.text}</span>
          </li>
        ))}
      </ol>
      <figcaption id="flow-caption" className="flow-caption">
        How a trade moved through SwoopAgent. Pick a case to play it.
      </figcaption>
    </figure>
  );
}
