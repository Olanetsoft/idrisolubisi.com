import type { UiName } from "@/components/icons";
import { site } from "./site";

/**
 * The hero: one intro that covers every role, four "what I do" cards (one
 * per kind of role, in plain words; the numbers live in Experience and
 * Projects), and a rolling log of short facts. Every figure comes from the owner's verified brief or public data.
 * No employer names, no em-dashes. In the intro, ==text== marks the one
 * highlighted clause and [label](url) renders as a link.
 */
export type Focus = {
  /** The role a hiring manager scans for. */
  title: string;
  /** What that work is, in plain words. */
  text: string;
  /** Small icon beside the title. */
  icon: UiName;
};

/** One line of the activity log: a tag and a true fact, usually a number, that the cards do not show. */
export type LogLine = { tag: string; fact: string };

export const hero: { headline: string; intro: string; focus: Focus[]; log: LogLine[] } = {
  headline: site.role,
  intro: site.bio[0],
  focus: [
    {
      title: "Developer relations",
      icon: "megaphone",
      text: "Docs, tutorials, explainer videos, talks and workshops that take developers and builders from first look to production.",
    },
    {
      title: "AI agent engineering",
      icon: "robot",
      text: "Production agents and the harness around them: MCP tools, verification, safety limits, human approval and dashboards that show what agents are doing.",
    },
    {
      title: "Forward deployed engineering",
      icon: "people",
      text: "Working inside partner engineering teams from discovery and solution architecture to production launch, then turning repeat problems into reference code and tooling.",
    },
    {
      title: "Backend engineering",
      icon: "hddStack",
      text: "Production services and APIs: event-driven payments, multi-tenant systems, data pipelines, security hardening, race-condition fixes and monitoring.",
    },
  ],
  log: [
    { tag: "developer-support", fact: "100,000+ developers supported, rated 4.8/5" },
    { tag: "mcp-server", fact: "10,000+ downloads, 11,900+ agent tool calls" },
    { tag: "integrations", fact: "setup time cut 55%, 500+ weekly adoptions" },
    { tag: "tutorials", fact: "10M+ reads across 40+ tutorials" },
    { tag: "payments", fact: "50,000+ users at 99.9% uptime" },
    { tag: "academy", fact: "1,120+ developers certified" },
    { tag: "swoopagent", fact: "every position checked every 30s" },
    { tag: "onboarding", fact: "developer onboarding time cut 65%" },
    { tag: "docs", fact: "rebuilt so AI assistants can read them" },
    { tag: "agent-lookout", fact: "flags agent sessions waiting for approval" },
    { tag: "talks", fact: "spoken at Devcon and ETHCC" },
  ],
};
