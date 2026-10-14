import { site } from "./site";

/**
 * The hero: one intro that covers every role and four "what I do" cards (one
 * per kind of role, in plain words; the numbers live in Experience and
 * Projects). Every figure comes from the owner's verified brief or public data.
 * No employer names, no em-dashes. In the intro, ==text== marks the one
 * highlighted clause and [label](url) renders as a link.
 */
export type Focus = {
  /** The role a hiring manager scans for. */
  title: string;
  /** What that work is, in plain words. */
  text: string;
};

export const hero: { headline: string; intro: string; focus: Focus[] } = {
  headline: site.role,
  intro: site.bio[0],
  focus: [
    {
      title: "Developer relations",
      text: "Docs, tutorials, explainer videos, talks and workshops that take developers and builders from first look to shipping.",
    },
    {
      title: "AI agent engineering",
      text: "Production agents and the harness around them: MCP tools, verification, safety limits, human approval and dashboards that show what agents are doing.",
    },
    {
      title: "Forward deployed engineering",
      text: "Working inside partner engineering teams from discovery and solution architecture to launch, then turning repeat problems into reference code and tooling.",
    },
    {
      title: "Backend engineering",
      text: "Production services and APIs: event-driven payments, multi-tenant systems, data pipelines, security hardening, race-condition fixes and monitoring.",
    },
  ],
};
