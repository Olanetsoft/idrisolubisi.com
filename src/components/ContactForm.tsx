"use client";

import { useState, type FormEvent } from "react";

type Status = "idle" | "sending" | "sent" | "error";

/**
 * Netlify Forms. The static twin of this form lives in public/__forms.html so
 * Netlify's build-time form detection can register it; we POST there.
 */
export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    if (data.get("bot-field")) return; // honeypot
    setStatus("sending");
    try {
      const res = await fetch("/__forms.html", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(data as unknown as Record<string, string>).toString(),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setStatus("sent");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  return (
    <form
      className="form"
      name="contact"
      method="POST"
      action="/__forms.html"
      onSubmit={onSubmit}
      aria-describedby="form-status"
    >
      <input type="hidden" name="form-name" value="contact" />
      <p className="hp" aria-hidden="true">
        <label>
          Don&apos;t fill this out: <input name="bot-field" tabIndex={-1} autoComplete="off" />
        </label>
      </p>
      <div className="form-row">
        <div className="field">
          <label htmlFor="name">Name</label>
          <input id="name" name="name" type="text" autoComplete="name" required />
        </div>
        <div className="field">
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" autoComplete="email" required />
        </div>
      </div>
      <div className="field">
        <label htmlFor="message">The problem, in a few lines</label>
        <textarea id="message" name="message" required />
      </div>
      <div className="form-actions">
        <button type="submit" className="btn" disabled={status === "sending"}>
          {status === "sending" ? "Sending…" : "Send"}
        </button>
        <p id="form-status" className="form-status" role="status" aria-live="polite">
          {status === "sent" && "Received. I will reply in writing."}
          {status === "error" && "That did not send. Message me on LinkedIn or X instead."}
        </p>
      </div>
    </form>
  );
}
