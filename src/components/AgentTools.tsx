"use client";

import { useEffect } from "react";
import type { ModelContext } from "@/lib/webmcp";

/**
 * Offers the site's WebMCP tools (src/lib/webmcp.ts) to AI agents in the
 * browser. Most browsers don't have the API yet, so this checks for it once
 * the page is idle and loads the tools, and the data behind them, only where
 * it exists. Renders nothing.
 */
export function AgentTools() {
  useEffect(() => {
    const scope = { document, navigator } as unknown as {
      document: { modelContext?: ModelContext };
      navigator: { modelContext?: ModelContext };
    };
    // A broken polyfill or extension can make the getter itself throw; the
    // site must render either way.
    let context: ModelContext | undefined;
    try {
      context = scope.document.modelContext ?? scope.navigator.modelContext;
      if (typeof context?.registerTool !== "function") return;
    } catch {
      return;
    }
    const api = context;
    const controller = new AbortController();
    const start = () =>
      import("@/lib/webmcp").then(({ registerSiteTools }) => {
        if (!controller.signal.aborted) registerSiteTools(api, controller.signal);
      });
    const idle = window.requestIdleCallback?.(start, { timeout: 3000 });
    const timer = idle === undefined ? window.setTimeout(start, 1500) : undefined;
    return () => {
      controller.abort();
      if (idle !== undefined) window.cancelIdleCallback(idle);
      window.clearTimeout(timer);
    };
  }, []);
  return null;
}
