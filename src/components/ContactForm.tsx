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
    <form className="form" name="contact" onSubmit={onSubmit} aria-describedby="form-status">
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
        <label htmlFor="message">Message</label>
        <textarea id="message" name="message" required placeholder="A role, a talk, a collaboration…" />
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
        <button type="submit" className="btn btn-accent" disabled={status === "sending"}>
          {status === "sending" ? "Sending…" : "Send message"}
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </button>
        <p
          id="form-status"
          className={`form-status ${status === "sent" ? "ok" : status === "error" ? "err" : ""}`}
          role="status"
          aria-live="polite"
        >
          {status === "sent" && "Thanks — I'll reply within a couple of days."}
          {status === "error" && "Something went wrong. Email me on LinkedIn or X instead."}
        </p>
      </div>
    </form>
  );
}
