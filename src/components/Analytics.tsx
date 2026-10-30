"use client";

import { useEffect } from "react";

/** Any of these means a person is on the page; the first one loads the script. */
const EVENTS = ["pointerdown", "keydown", "scroll", "touchstart"] as const;
/** Otherwise the script loads this long after the page is up. */
const WAIT_MS = 4000;

type Gtag = Window & { dataLayer?: unknown[]; gtag?: (...args: unknown[]) => void };

/**
 * Google Analytics without the cost at load: the dataLayer and the config are
 * queued at once, but the gtag script loads on the first scroll, tap or key
 * press, or after a few seconds, so it never competes with the first paint or
 * with hydration. The queued page view is sent when the script arrives.
 */
export function Analytics({ gaId }: { gaId: string }) {
  useEffect(() => {
    const w = window as Gtag;
    if (w.gtag) return;
    w.dataLayer = w.dataLayer || [];
    w.gtag = function gtag() {
      // gtag.js reads the arguments object itself, not an array.
      // eslint-disable-next-line prefer-rest-params
      w.dataLayer?.push(arguments);
    };
    w.gtag("js", new Date());
    w.gtag("config", gaId);

    let timer = 0;
    const load = () => {
      EVENTS.forEach((e) => window.removeEventListener(e, load));
      window.clearTimeout(timer);
      const script = document.createElement("script");
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
      document.head.append(script);
    };
    EVENTS.forEach((e) => window.addEventListener(e, load, { once: true, passive: true }));
    timer = window.setTimeout(load, WAIT_MS);
    return () => {
      EVENTS.forEach((e) => window.removeEventListener(e, load));
      window.clearTimeout(timer);
    };
  }, [gaId]);
  return null;
}
