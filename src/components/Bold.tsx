import type { ReactNode } from "react";

/** Renders text with **double-asterisk** spans as <strong>. */
export function Bold({ text }: { text: string }): ReactNode {
  const parts = text.split(/\*\*(.+?)\*\*/g);
  return parts.map((part, i) => (i % 2 === 1 ? <strong key={i}>{part}</strong> : part));
}
