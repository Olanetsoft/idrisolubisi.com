"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Report, Status } from "@/lib/ai-readiness";

const LABEL: Record<Status, string> = { pass: "Pass", warn: "Worth a look", fail: "Needs work" };

type State =
  | { kind: "idle" }
  | { kind: "checking"; site: string }
  | { kind: "error"; message: string; field: boolean }
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
  const field = useRef<HTMLInputElement>(null);
  const busy = useRef(false);

  const run = useCallback(async (input: string) => {
    const site = input.trim();
    if (!site || busy.current) return;
    busy.current = true;
    setState({ kind: "checking", site });
    // An error sends focus back to the field, where it can be fixed.
    const failed = (message: string, inField: boolean) => {
      setState({ kind: "error", message, field: inField });
      requestAnimationFrame(() => field.current?.focus());
    };
    const url = new URL(window.location.href);
    url.searchParams.set("url", site);
    window.history.replaceState(null, "", url);
    try {
      const response = await fetch(`/api/ai-check?url=${encodeURIComponent(site)}`);
      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data.checks) {
        failed(
          response.status === 429
            ? "That's a lot of checks in a minute. Try again shortly."
            : (data.error ?? "The check failed. Try again in a minute."),
          response.status === 400,
        );
        return;
      }
      setState({ kind: "done", report: data as Report });
      requestAnimationFrame(() => results.current?.focus());
    } catch {
      failed("The check couldn't run. Check your connection.", false);
    } finally {
      busy.current = false;
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
            ref={field}
            id="readiness-url"
            className="readiness-input"
            type="text"
            inputMode="url"
            enterKeyHint="go"
            autoComplete="url"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            placeholder="example.com"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            aria-invalid={state.kind === "error" && state.field ? true : undefined}
            aria-describedby={state.kind === "error" ? "readiness-error" : undefined}
            required
          />
          {/* Not disabled while checking, so focus stays on it; run() ignores repeats. */}
          <button
            className="btn btn--primary"
            type="submit"
            aria-disabled={state.kind === "checking" ? true : undefined}
          >
            {state.kind === "checking" ? "Checking" : "Check"}
          </button>
        </div>
        <p className="readiness-note">
          Reads only public files from the one site you name. Nothing is stored.
        </p>
      </form>

      <div aria-live="polite" className="readiness-status">
        {state.kind === "checking" && <p>Checking {state.site}, usually a few seconds.</p>}
        {state.kind === "error" && (
          <p id="readiness-error" className="readiness-error">
            {state.message}
          </p>
        )}
      </div>

      {state.kind === "done" && (
        <section className="readiness-results" aria-labelledby="readiness-summary">
          <h2 id="readiness-summary" ref={results} tabIndex={-1} className="readiness-summary">
            {state.report.page.replace(/^https?:\/\//, "").replace(/\/$/, "")}: {passed.length} of{" "}
            {state.report.checks.length} checks pass
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
