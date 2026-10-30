"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Report, Status } from "@/lib/ai-readiness";

const LABEL: Record<Status, string> = { pass: "Pass", warn: "Worth a look", fail: "Needs work" };

type State =
  | { kind: "idle" }
  | { kind: "checking"; site: string }
  | { kind: "error"; message: string }
  | { kind: "done"; report: Report };

/**
 * The form and results of /tools/ai-readiness. It asks /api/ai-check (a
 * Netlify function) about one site and lists what an AI agent would find.
 * The address goes into ?url= so a result can be shared, and opening such a
 * link runs the check again.
 */
export function ReadinessCheck() {
  const [value, setValue] = useState("");
  const [state, setState] = useState<State>({ kind: "idle" });
  const results = useRef<HTMLHeadingElement>(null);

  const run = useCallback(async (input: string) => {
    const site = input.trim();
    if (!site) return;
    setState({ kind: "checking", site });
    const url = new URL(window.location.href);
    url.searchParams.set("url", site);
    window.history.replaceState(null, "", url);
    try {
      const response = await fetch(`/api/ai-check?url=${encodeURIComponent(site)}`);
      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data.checks) {
        setState({
          kind: "error",
          message:
            response.status === 429
              ? "That's a lot of checks in a minute. Try again shortly."
              : (data.error ?? "The check failed. Try again in a minute."),
        });
        return;
      }
      setState({ kind: "done", report: data as Report });
      requestAnimationFrame(() => results.current?.focus());
    } catch {
      setState({ kind: "error", message: "The check couldn't run. Check your connection." });
    }
  }, []);

  // A shared link (?url=example.com) fills the form and runs the check once
  // the page has painted.
  useEffect(() => {
    const shared = new URLSearchParams(window.location.search).get("url");
    if (!shared) return;
    const frame = requestAnimationFrame(() => {
      setValue(shared);
      run(shared);
    });
    return () => cancelAnimationFrame(frame);
  }, [run]);

  const passed =
    state.kind === "done" ? state.report.checks.filter((c) => c.status === "pass") : [];

  return (
    <div className="readiness">
      <form
        className="readiness-form"
        onSubmit={(event) => {
          event.preventDefault();
          run(value);
        }}
      >
        <label htmlFor="readiness-url" className="readiness-label">
          Website
        </label>
        <div className="readiness-row">
          <input
            id="readiness-url"
            className="readiness-input"
            type="text"
            inputMode="url"
            autoComplete="url"
            autoCapitalize="none"
            spellCheck={false}
            placeholder="example.com"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            required
          />
          <button className="btn btn--primary" type="submit" disabled={state.kind === "checking"}>
            {state.kind === "checking" ? "Checking" : "Check"}
          </button>
        </div>
        <p className="readiness-note">
          Reads only public files from the one site you name. Nothing is stored.
        </p>
      </form>

      <div aria-live="polite" className="readiness-status">
        {state.kind === "checking" && <p>Checking {state.site}, usually a few seconds.</p>}
        {state.kind === "error" && <p className="readiness-error">{state.message}</p>}
      </div>

      {state.kind === "done" && (
        <section className="readiness-results" aria-labelledby="readiness-summary">
          <h2 id="readiness-summary" ref={results} tabIndex={-1} className="readiness-summary">
            {new URL(state.report.site).hostname}: {passed.length} of {state.report.checks.length}{" "}
            checks pass
          </h2>
          <ul className="readiness-list">
            {state.report.checks.map((check) => (
              <li key={check.id} className="readiness-item" data-status={check.status}>
                <p className="readiness-head">
                  <span className="readiness-name">{check.label}</span>
                  <span className="readiness-badge">
                    <span className="readiness-dot" aria-hidden="true" />
                    {LABEL[check.status]}
                  </span>
                </p>
                <p className="readiness-detail">{check.detail}</p>
                <p className="readiness-why">{check.why}</p>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
