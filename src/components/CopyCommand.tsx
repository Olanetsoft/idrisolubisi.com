"use client";

import { useRef, useState } from "react";

/**
 * Copy text to the clipboard. Uses the Clipboard API, and falls back to a
 * hidden textarea for in-app browsers that block it (LinkedIn on Android, for
 * example). Returns whether the copy worked.
 */
async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    let ok = false;
    try {
      ok = document.execCommand("copy");
    } catch {
      ok = false;
    }
    area.remove();
    return ok;
  }
}

/** Shows "Copied" for a moment after a successful copy. */
function useCopied(): [boolean, () => void] {
  const [copied, setCopied] = useState(false);
  const flash = () => {
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };
  return [copied, flash];
}

/** A one-line command with a copy button, e.g. `npx agent-lookout`. */
export function CopyCommand({ command }: { command: string }) {
  const [copied, flash] = useCopied();
  const codeRef = useRef<HTMLElement>(null);

  const copy = async () => {
    if (await copyText(command)) return flash();
    // No clipboard access at all: select the text so it can be copied by hand.
    const node = codeRef.current;
    const selection = window.getSelection();
    if (node && selection) {
      const range = document.createRange();
      range.selectNodeContents(node);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  };

  return (
    <div className="cmd" data-copied={copied || undefined}>
      <span className="cmd-prompt" aria-hidden="true">
        $
      </span>
      <code ref={codeRef}>{command}</code>
      <button type="button" onClick={copy} aria-label={`Copy ${command}`}>
        {copied ? "Copied" : "Copy"}
      </button>
      <span className="sr-only" aria-live="polite">
        {copied ? "Copied to clipboard" : ""}
      </span>
    </div>
  );
}

/** A small "Copy" button for a value shown next to it, such as an email address. */
export function CopyButton({ value, label }: { value: string; label: string }) {
  const [copied, flash] = useCopied();
  return (
    <>
      <button
        type="button"
        className="copy-button"
        data-copied={copied || undefined}
        aria-label={label}
        onClick={async () => {
          if (await copyText(value)) flash();
        }}
      >
        {copied ? "Copied" : "Copy"}
      </button>
      <span className="sr-only" aria-live="polite">
        {copied ? "Copied to clipboard" : ""}
      </span>
    </>
  );
}
