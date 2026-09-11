"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

const noop = () => () => {};
const useMounted = () =>
  useSyncExternalStore(
    noop,
    () => true,
    () => false,
  );

/** An install line with a copy button. Without JS the command is plain, selectable text. */
export function CopyLine({ command }: { command: string }) {
  const mounted = useMounted();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(t);
  }, [copied]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
    } catch {
      // Clipboard unavailable: the text is still selectable.
    }
  }

  return (
    <div className="copyline">
      <pre className="terminal terminal-inline" tabIndex={0}>
        <code>
          <span className="term-prompt">$ </span>
          {command}
        </code>
      </pre>
      {mounted && (
        <button type="button" className="copy-btn" onClick={copy}>
          {copied ? "Copied" : "Copy"}
        </button>
      )}
      <span className="visually-hidden" role="status" aria-live="polite">
        {copied ? "Copied to clipboard" : ""}
      </span>
    </div>
  );
}
